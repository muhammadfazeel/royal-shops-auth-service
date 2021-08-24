"use strict";
const model = require("../models");
const helpingHelperMethods = require("../helpers/helping.helper");
const _ = require("lodash");
const Op = require("sequelize").Op;
const config = require("../config/environment.config.json");

// *****************
// Create New User
// *****************

const signUp = async (req, res) => {
  console.log("Signup API Called");
  try {
    let input = req.body;

    // check if input email already exist
    let user = await model.User.findOne({
      where: { email: input.email },
      attributes: ["id"],
    });
    // check user existence
    if (!user) {
      let newUser = await model.User.create(input);

      // To Generate Random Token
      let emailToken = await helpingHelperMethods.generateRandomToken(36);
      newUser.emailVerifiedToken = emailToken;

      newUser.salt = newUser.makeSalt();
      newUser.hashedPassword = newUser.encryptPassword(
        input.password,
        newUser.salt
      );
      newUser.save();

      const verificationLink = `${
        config.Domain
      }/verifyEmail?emToken=${emailToken}&e=${encodeURIComponent(input.email)}`;

      // Mail Service
      helpingHelperMethods.verifyEmail(verificationLink, input.email);

      // Send Email
      let result = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      };

      res.status(200).json({
        success: true,
        msg: "Successfully Created",
        result,
      });
    } else throw "Email Already Exist";
  } catch (e) {
    res.status(500).json({
      success: false,
      ex: "Exception: ",
      msg: e,
    });
  }
};

// ************
// User Login
// ************

const login = function (req, res) {
  let input = req.body.values;
  let email = input.email;
  let password = input.password;
  let userData = {};

  // check if email exist and isDeleted equal to false
  return model.User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user || !user.salt || !user.hashedPassword) {
        throw "Invalid email or Password";
      } else if (!user.authenticate(password)) {
        throw "Invalid email or Password";
      }
      // convert mongoose document object to plain json object and return user
      return user.toJSON();
    })
    .then((user) => {
      userData.userInfo = user;
      const tokenData = {
        id: userData.userInfo.id,
        name: userData.userInfo.name,
        email: userData.userInfo.email,
      };

      userData.userInfo = {
        ...tokenData,
      };
      return helpingHelperMethods.signLoginData({ data: tokenData });
    })
    .then((tokenData) => {
      userData.tokenInfo = tokenData;
      res.status(200).json({ userData });
    })
    .catch((e) => {
      res.status(500).json({
        success: false,
        msg: e,
        ex: "Exception: ",
      });
    });
};

// *****************
// Change Password
// *****************

const changePassword = async (req, res) => {
  let data = req.body;
  let id = req.user.data;
  // check if phone exist and isDeleted equal to false
  model.User.findOne({
    where: {
      id: id,
      isDeleted: false,
    },
  })
    .then(async (user) => {
      if (!user) throw "User not found";

      // Validate password
      if (!user.authenticate(data.oldPassword)) throw "Old Password is wrong";

      user.salt = user.makeSalt();
      // hashing newPassword, encrypted
      user.hashedPassword = user.encryptPassword(data.newPassword, user.salt);

      // save user
      await user.save();
      res.status(200).json({
        success: true,
        msg: "Password Changed Successfully",
        user,
      });
    })
    .catch((e) => {
      res.status(501).json({
        success: false,
        ex: "Exception: ",
        msg: e,
      });
    });
};

// **************
// Verify Phone
// **************

const verifyOtp = function (req, res) {
  let input = req.body;
  let email = input.email;
  let otp = input.otp;

  // check if phone exist and isDeleted equal to false
  model.User.findOne({ where: { email: email, isDeleted: false } })
    .then((user) => {
      if (!user) throw "No user found against this email";

      user.otp = parseInt(user.otp, 10);

      // matching otp against user verification code
      if (
        otp !== user.otp ||
        Date.parse(user.otpValidTill) < Date.parse(new Date())
      )
        throw "Failed to Verify email, invalid otp or it is expired.";

      user.otp = "";
      user.isVerified = true;
      user.save();
      res.status(200).json({
        success: true,
        msg: "Successfully Verified",
        user,
      });
    })
    .catch((e) => {
      res.status(500).json({
        success: false,
        ex: "Exception: ",
        msg: e,
      });
    });
};

// ***********
// Resend Otp
// ***********

const resendOtp = function (req, res) {
  let email = req.body.email;
  // check if email exist and isDeleted equal to false
  return model.User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) throw "Invalid Email";
      if (user.dataValues.isVerified) throw "Already Verified";

      let now = new Date();
      now.setMinutes(now.getMinutes() + 10); // timestamp
      now = new Date(now); // Date object

      user.otpValidTill = now;
      user.otp = Math.round(Math.random() * 9000 + 1000);
      user.save().then(() => {
        // Send Email
        helpingHelperMethods.verifyOTP(user.otp, user.email);
      });

      // Send otp
      res.status(200).json({
        success: true,
        msg: "Successfully Sent OTP",
      });
    })
    .catch((e) => {
      res.status(500).json({
        success: false,
        ex: "Exception: ",
        msg: e,
      });
    });
};

// ***********
// Get Users
// ***********

const getUsers = async (req, res) => {
  try {
    let conditions = req.conditions;
    let coachCondition = {};

    let limit = Number(req.limit);
    let offset = Number(req.offset);

    if (conditions.name) {
      conditions.name = {
        [Op.like]: `%${conditions.name}%`,
      };
    }

    // Check if user exist in conditions
    let result = await model.User.findAndCountAll({
      where: conditions,
      limit: limit,
      offset: offset,
      order: [["id", "DESC"]],
    });
    res.status(200).json({
      success: true,
      msg: "Successfully Fetched",
      result,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      ex: "Exception: ",
      msg: e,
    });
  }
};

// ****************
// Forgot Password
// ****************

const forgotPassword = (req, res) => {
  let conditions = req.conditions;
  // Check if user exist in conditions
  return model.User.findOne({ where: conditions })
    .then((user) => {
      if (!user) throw "User Not Found";

      let now = new Date();
      now.setMinutes(now.getMinutes() + 10); // timestamp
      now = new Date(now); // Date object

      user.otpValidTill = now;
      user.otp = Math.round(Math.random() * 9000 + 1000);
      user.save().then(() => {
        // Send Email
        helpingHelperMethods.verifyOTP(user.otp, user.email);
      });
      res.status(200).json({
        success: true,
        msg: "OTP Sent By Email",
      });
    })
    .catch((e) => {
      res.status(500).json({
        success: false,
        ex: "Exception: ",
        msg: e,
      });
    });
};

// ***************
// Validation
// ***************

const userValidation = (req, res) => {
  let userData = {};

  // check if email exist and isDeleted equal to false
  model.User.findOne({
    where: {
      id: req.user.id,
    },
  })
    .then((user) => {
      // convert mongoose document object to plain json object and return user
      return user.toJSON();
    })
    .then((user) => {
      userData.userInfo = user;
      const tokenData = {
        id: userData.userInfo.id,
        name: userData.userInfo.name,
        email: userData.userInfo.email,
      };

      userData.userInfo = {
        ...tokenData,
      };
      return helpingHelperMethods.signLoginData({ data: tokenData });
    })
    .then((tokenData) => {
      userData.tokenInfo = tokenData;
      res.status(200).json({ userData });
    })
    .catch((e) => {
      res.status(500).json({
        success: false,
        msg: e,
        ex: "Exception: ",
      });
    });
};

// ****************************
// Get data of logged in user.
// ****************************

const getLoggedInUser = function (req, res) {
  // Find user against id.
  return model.User.findOne({
    where: {
      id: req.token.id,
      isDeleted: false,
    },
  })
    .then((user) => {
      res.status(200).json({
        success: true,
        msg: "fetched Successfully",
        user,
      });
    })
    .catch((e) => {
      res.status(500).json({
        success: false,
        ex: "Exception: ",
        msg: e,
      });
    });
};

// ********************************
// Check input password is correct.
// ********************************

const checkPassword = function (req, res) {
  let input = req.body;
  let email = input.email;
  let password = input.password;
  // check if email exist and isDeleted equal to false
  return model.User.findOne({
    where: {
      email: email,
      isDeleted: false,
    },
  })
    .then((user) => {
      if (!user) throw "User Not Found";

      if (!user.authenticate(password)) {
        res.status(200).json({
          success: true,
          msg: "Password Not Matched",
        });
      }
      res.status(200).json({
        success: true,
        msg: "Password Matched",
      });
    })
    .catch((e) => {
      res.status(500).json({
        success: false,
        ex: "Exception: ",
        msg: e,
      });
    });
};

// *****************
// Update User.
// *****************

const updateUser = function (req, res) {
  let id = req.body.id;
  let data = req.body.data;
  model.User.findOne({
    where: {
      id: id,
    },
  })
    .then(async (user) => {
      if (_.isEmpty(user)) throw "User Not Found";
      // Update user
      if (data) {
        user.set(data);
        user.save();
      }
      res.status(200).json({
        success: true,
        msg: "Successfully Updated",
        user,
      });
    })
    .catch((e) => {
      res.status(500).json({
        success: false,
        ex: "Exception: ",
        msg: e,
      });
    });
};

// ********************************
// changeCurrentPassword.
// ********************************

const changeCurrentPassword = function (req, res) {
  let id = req.body.id;
  let data = req.body.data;
  // check if phone exist and isDeleted equal to false
  return model.User.findOne({
    where: {
      id: id,
    },
  })
    .then(async (user) => {
      if (!user) throw "User Not Found";

      // Validate password
      if (!user.authenticate(data.oldPassword)) throw "Old Password is wrong";

      user.salt = user.makeSalt();
      // hashing newPassword, encrypted
      user.hashedPassword = user.encryptPassword(data.newPassword, user.salt);

      // save user
      await user.save();
      res.status(200).json({
        success: true,
        msg: "Successfully Changed",
        user,
      });
    })
    .catch((e) => {
      res.status(500).json({
        success: false,
        ex: "Exception: ",
        msg: e,
      });
    });
};

// ********************************
// deleteUser.
// ********************************

const deleteUser = (req, res) => {
  if (!req.params.id) throw "Invalid Request";
  model.User.findOne({
    where: {
      id: req.params.id,
      isDeleted: false,
    },
  })
    .then((user) => {
      if (_.isEmpty(user)) throw "User Not Found";
      // User found, change value of isDeleted to true
      user.isDeleted = true;
      // save User
      user.save();
      res.status(200).json({
        success: true,
        msg: "User Deleted",
        user,
      });
    })
    .catch((e) => {
      res.status(500).json({
        success: false,
        ex: "Exception ",
        msg: e,
      });
    });
};

// ***************
// Approve User
// ***************

const approveUser = async (req, res) => {
  try {
    let input = req.body.validatedData;
    let changeStatus = await model.User.update(
      {
        isApproved: input.isApproved,
      },
      { where: { id: input.UserId } }
    );
    if (changeStatus[0] == 0) throw "Cannot Change Status";
    res.status(200).json({
      success: true,
      msg: "Status Changed Successfully",
      changeStatus,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      ex: "Exception: ",
      msg: e,
    });
  }
};

// *************************
//  Email Verification
// *************************

const emailVerification = async (req, res) => {
  console.log("Email verification Called");
  let email = req.query.e;
  let emailVerifiedToken = req.query.emToken;
  try {
    if (
      email &&
      email !== "" &&
      emailVerifiedToken &&
      emailVerifiedToken !== null
    ) {
      let user = await model.User.findOne({
        where: { email, emailVerifiedToken },
      });
      if (user) {
        user.emailVerified = 1;
        user.emailVerifiedToken = "";
        await user.save();
        return res
          .status(200)
          .json({ success: true, msg: "Email verified successfully" });
      } else {
        return res.status(401).json({ success: false, msg: "No user found" });
      }
    } else {
      return res.status(401).json({ success: false, msg: "Incomplete data" });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      ex: "Exception",
      msg: e,
    });
  }
};

// *************************
//  Reset Password Mail
// *************************

const resetPasswordMail = async (req, res) => {
  console.log("Reset password called");
  let email = req.conditions.email;
  try {
    let user = await model.User.findOne({
      where: { email },
    });
    if (!user) {
      return res.status(401).json({ success: false, msg: "No user found" });
    }

    // To Generate Random Token
    let passwordResetToken = await helpingHelperMethods.generateRandomToken(36);
    user.passwordResetToken = passwordResetToken;
    await user.save();

    // Verification Email With Reset Token
    const verificationLink = `${
      config.Domain
    }/reset-password?emToken=${passwordResetToken}&e=${encodeURIComponent(
      email
    )}`;

    // Send Email With verification Link
    helpingHelperMethods.passResetMail(verificationLink, email);
    return res.status(200).json({ success: true, msg: "email has been sent" });
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, msg: "No user found" });
  }
};

// ****************************
// Reset Password
// ****************************

const resetPassword = async (req, res) => {
  console.log("Reset password API Called");

  let email = req.body.data.email;
  let resetToken = req.body.data.resetToken;
  let password = req.body.data.password;
  let password2 = req.body.data.password2;

  if (password !== password2) {
    return res
      .status(401)
      .json({ success: false, msg: "Passwords do not match" });
  }
  try {
    if (email && email !== "" && resetToken && resetToken !== "") {
      let user = await model.User.findOne({
        where: { email, passwordResetToken: resetToken },
      });
      if (!user) {
        console.log("No User found");
        return res.status(401).json({ success: false, msg: "No User found" });
      }

      user.passwordResetToken = "";
      user.hashedPassword = user.encryptPassword(password, user.salt);
      await user.save();

      return res
        .status(200)
        .json({ success: true, msg: "Password Changed Successfully." });
    } else {
      //change pass through customer profile here
      return res.status(401).json({ success: false, msg: "Invalid request" });
    }
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, ex: "Exception", msg: error });
  }
};

module.exports = {
  signUp,
  login,
  getUsers,
  forgotPassword,
  changePassword,
  checkPassword,
  resetPassword,
  getLoggedInUser,
  updateUser,
  changeCurrentPassword,
  deleteUser,
  verifyOtp,
  resendOtp,
  approveUser,
  resetPasswordMail,
  emailVerification,
  userValidation,
};
