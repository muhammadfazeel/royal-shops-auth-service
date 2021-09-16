"use strict";
const generalMiddleware = require("./general.middleware");
const _ = require("lodash");

// *********************
// signUp validation
// *********************

const validateSignUp = (req, res, done) => {
  const body = req.body.values;
  const validatedValues = {};

  // get all the errors in an array
  const errorArray = [];

  // email is an required  Validating as not empty, valid String and length range.
  if (
    !_.isString(body.email) ||
    body.email.length < 5 ||
    body.email.length > 100 ||
    !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(body.email)
  ) {
    errorArray.push({
      field: "email",
      error: 10010,
      message:
        "Please provide only valid 'email' as string, length must be between 5 and 100.",
    });
  }

  // name is required, validating it as not empty, valid String and length range.
  if (
    _.isEmpty(body.name) ||
    !_.isString(body.name) ||
    body.name.length < 2 ||
    body.name.length > 100
  ) {
    errorArray.push({
      field: "name",
      error: 10020,
      message:
        "'name' is required as string, length must be between 2 and 100.",
    });
  }

  // password is required, validating it as not empty, valid String and length range.
  if (
    _.isEmpty(body.password) ||
    !_.isString(body.password) ||
    body.password.length < 8 ||
    body.password.length > 16
  ) {
    errorArray.push({
      field: "password",
      error: 10030,
      message:
        "'password' is required as string, length must be between 8 and 16.",
    });
  }

  // address is required, validating it as not empty, valid String and length range.
  if (
    _.isEmpty(body.address) ||
    !_.isString(body.address) ||
    body.address.length < 2 ||
    body.address.length > 300
  ) {
    errorArray.push({
      field: "address",
      error: 10040,
      message:
        "'address' is required as string, length must be between 2 and 100.",
    });
  }

  // phone is required, validating it as not empty, valid String and length range.
  if (
    _.isEmpty(body.phone) ||
    !_.isString(body.phone) ||
    body.phone.length < 2 ||
    body.phone.length > 15
  ) {
    errorArray.push({
      field: "phone",
      error: 10020,
      message:
        "'phone' is required as string, length must be between 2 and 100.",
    });
  }

  // nationalId is required, validating it as not empty, valid String and length range.
  if (
    _.isEmpty(body.nationalId) ||
    !_.isString(body.nationalId) ||
    body.nationalId.length < 2 ||
    body.nationalId.length > 15
  ) {
    errorArray.push({
      field: "nationalId",
      error: 10020,
      message:
        "'nationalId' is required as string, length must be between 2 and 100.",
    });
  }

  // send array if error(s)
  if (errorArray.length) {
    return generalMiddleware.standardErrorResponse(
      res,
      errorArray,
      "user.middleware.validateSignUp"
    );
  }

  // Info Object
  validatedValues.name = body.name;
  validatedValues.email = body.email;
  validatedValues.password = body.password;
  validatedValues.address = body.address;
  validatedValues.phone = body.phone;
  validatedValues.nationalId = body.nationalId;

  req.body = validatedValues;
  done();
};

// ****************************
// validate login credentials
// ****************************

const validateLoginCredentials = (req, res, done) => {
  const body = req.body;
  // get all the errors in an array

  const errorArray = [];
  // email is required, validating it as not empty, valid String and length range.
  if (_.isEmpty(body.email) || !_.isString(body.email)) {
    errorArray.push({
      field: "email",
      error: 10100,
      message: "'email' is required as string, length must be 11.",
    });
  }

  // password is required, validating it as not empty, valid String and length range.
  if (_.isEmpty(body.password) || !_.isString(body.password)) {
    errorArray.push({
      field: "password",
      error: 10110,
      message: "'password' is required.",
    });
  }

  if (errorArray.length) {
    return generalMiddleware.standardErrorResponse(
      res,
      errorArray,
      "user.middleware.validateLoginCredentials"
    );
  }

  return done();
};

// ********************
// validate get user
// ********************

const validateGetUsers = (req, res, done) => {
  const errorArray = [];
  const query = req.query;
  const validatedQuery = {};

  let limit = 50;
  let offset = 0;

  // id is an optional numeric property, if it is given than validate it.
  if (query.hasOwnProperty("id")) {
    // Validating as not empty, valid numeric value with range.
    if (!query.id || isNaN(query.id)) {
      errorArray.push({
        field: "id",
        error: 10120,
        message: "Please provide only valid 'id' as numeric.",
      });
    }
    validatedQuery.id = query.id;
  }

  // name is an optional string property, if it is given than validate it.
  if (query.hasOwnProperty("name")) {
    // Validating as not empty, valid String and length range.
    if (
      _.isEmpty(query.name) ||
      !_.isString(query.name) ||
      query.name.length < 2 ||
      query.name.length > 100
    ) {
      errorArray.push({
        field: "name",
        error: 10130,
        message:
          "Please provide only valid 'name' as string, length must be between 2 and 100.",
      });
    }
    validatedQuery.name = query.name;
  }

  if (!_.isEmpty(errorArray)) {
    return generalMiddleware.standardErrorResponse(
      res,
      errorArray,
      "user.middleware.validateGetUsers"
    );
  }

  if (query.limit && query.limit > 0) {
    limit = query.limit;
  }

  if (query.offset && query.offset > 0) {
    offset = query.offset;
  }

  req.conditions = validatedQuery;
  req.limit = limit;
  req.offset = offset;
  done();
};

// **************************
// Validate forgot password
// **************************

const validateForgotPassword = (req, res, done) => {
  const errorArray = [];
  const body = req.body;
  const validatedBody = {};

  // email is an optional string property, if it is given than validate it.
  // Validating as not empty, valid String and length range.
  if (
    _.isEmpty(body.email) ||
    !_.isString(body.email) ||
    body.email.length < 5 ||
    body.email.length > 100 ||
    !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(body.email)
  ) {
    errorArray.push({
      field: "email",
      error: 10200,
      message: "Please provide only valid 'email', length must be 11.",
    });
  }

  if (!_.isEmpty(errorArray)) {
    return generalMiddleware.standardErrorResponse(
      res,
      errorArray,
      "user.middleware.validateForgotPassword"
    );
  }
  validatedBody.email = body.email;
  req.conditions = validatedBody;
  done();
};

// ****************************
// validate login credentials
// ***************************

const validateResetPassword = (req, res, done) => {
  const body = req.body;
  const validatedData = {};
  // get all the errors in an array
  const errorArray = [];

  // email is required, validating it as not empty, valid String and length range.
  if (
    _.isEmpty(body.email) ||
    !_.isString(body.email) ||
    body.email.length < 5 ||
    body.email.length > 100 ||
    !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(body.email)
  ) {
    errorArray.push({
      field: "email",
      error: 10210,
      message: "'email' is required as string, length must be 11.",
    });
  }
  validatedData.email = body.email;

  // password is required, validating it as not empty, valid String and length range.
  if (
    _.isEmpty(body.password) ||
    !_.isString(body.password) ||
    body.password.length < 8 ||
    body.password.length > 16
  ) {
    errorArray.push({
      field: "password",
      error: 10220,
      message:
        "'password' is required as string, length must be between 8 and 16.",
    });
  }
  validatedData.password = body.password;

  // password2 is required, validating it as not empty, valid String and length range.
  if (
    _.isEmpty(body.password2) ||
    !_.isString(body.password2) ||
    body.password2.length < 8 ||
    body.password2.length > 16
  ) {
    errorArray.push({
      field: "password2",
      error: 10220,
      message:
        "'password2' is required as string, length must be between 8 and 16.",
    });
  }
  validatedData.password2 = body.password2;

  // resetToken is required, validating as not empty, valid numeric value with range.
  if (!body.resetToken || body.resetToken < 10 || body.resetToken > 9999) {
    errorArray.push({
      field: "resetToken",
      error: 10230,
      message:
        "'resetToken' is required as numeric, range must be between 1000 and 9999.",
    });
  }
  validatedData.resetToken = body.resetToken;

  if (errorArray.length) {
    return generalMiddleware.standardErrorResponse(
      res,
      errorArray,
      "user.middleware.validateResetPassword"
    );
  }
  req.body = {
    data: validatedData,
  };
  return done();
};

// ************************
// Update User Validations
// ************************

const validateUpdateUser = (req, res, done) => {
  const errorArray = [];
  const body = req.body;
  let id = req.params.id;

  const validatedData = {
    newCoachGroup: [],
    updateCoachGroup: [],
  };

  // id is required, validating as not empty, valid numeric value with range.
  if (!id || isNaN(id)) {
    errorArray.push({
      field: "id",
      error: 10270,
      message: "'id' is required as numeric in params.",
    });
  }

  // name is an optional string property, if it is given than validate it.
  if (body.hasOwnProperty("name")) {
    // Validating as not empty, valid String and length range.
    if (
      _.isEmpty(body.name) ||
      !_.isString(body.name) ||
      body.name.length < 2 ||
      body.name.length > 100
    ) {
      errorArray.push({
        field: "name",
        error: 10280,
        message:
          "Please provide only valid 'name' as string, length must be between 2 and 100.",
      });
    }
    validatedData.name = body.name;
  }

  if (body.hasOwnProperty("address")) {
    // address is required, validating it as not empty, valid String and length range.
    if (
      _.isEmpty(body.address) ||
      !_.isString(body.address) ||
      body.address.length < 2 ||
      body.address.length > 300
    ) {
      errorArray.push({
        field: "address",
        error: 10040,
        message:
          "'address' is required as string, length must be between 2 and 100.",
      });
    }
    validatedData.address = body.address;
  }

  if (body.hasOwnProperty("phone")) {
    // phone is required, validating it as not empty, valid String and length range.
    if (
      _.isEmpty(body.phone) ||
      !_.isString(body.phone) ||
      body.phone.length < 2 ||
      body.phone.length > 15
    ) {
      errorArray.push({
        field: "phone",
        error: 10020,
        message:
          "'phone' is required as string, length must be between 2 and 100.",
      });
    }
    validatedData.phone = body.phone;
  }

  if (body.hasOwnProperty("nationalId")) {
    // nationalId is required, validating it as not empty, valid String and length range.
    if (
      _.isEmpty(body.nationalId) ||
      !_.isString(body.nationalId) ||
      body.nationalId.length < 2 ||
      body.nationalId.length > 15
    ) {
      errorArray.push({
        field: "nationalId",
        error: 10020,
        message:
          "'nationalId' is required as string, length must be between 2 and 100.",
      });
    }
    validatedData.nationalId = body.nationalId;
  }

  // Send error Array if error(s).
  if (!_.isEmpty(errorArray)) {
    return generalMiddleware.standardErrorResponse(
      res,
      errorArray,
      "user.middleware.validateUpdateUser"
    );
  }

  if (_.isEmpty(validatedData)) {
    return generalMiddleware.standardErrorResponse(
      res,
      [
        {
          field: "general",
          error: 10320,
          message: "No data provided to update.",
        },
      ],
      "user.middleware.validateUpdateUser"
    );
  }

  req.body = {
    data: validatedData,
    id: id,
  };
  return done();
};

// ************************
// validateChangePassword
// ************************

const validateChangePassword = (req, res, done) => {
  const body = req.body;
  let id = req.params.id;
  // get all the errors in an array
  const errorArray = [];

  // id is required, validating as not empty, valid numeric value with range.
  if (!id || isNaN(id)) {
    errorArray.push({
      field: "id",
      error: 10270,
      message: "'id' is required as numeric in params.",
    });
  }

  // password is required, validating it as not empty, valid String and length range.
  if (_.isEmpty(body.oldPassword) || !_.isString(body.oldPassword)) {
    errorArray.push({
      field: "password",
      error: 10335,
      message: "'password' is required.",
    });
  }

  // newPassword is required, validating it as not empty, valid String and length range.
  if (
    _.isEmpty(body.newPassword) ||
    !_.isString(body.newPassword) ||
    body.newPassword.length < 8 ||
    body.newPassword.length > 16
  ) {
    errorArray.push({
      field: "newPassword",
      error: 10340,
      message:
        "'newPassword' is required as string, length must be between 8 and 16.",
    });
  }

  if (errorArray.length) {
    return generalMiddleware.standardErrorResponse(
      res,
      errorArray,
      "user.middleware.validateChangePassword"
    );
  }

  const validatedValues = {};
  validatedValues.oldPassword = body.oldPassword;
  validatedValues.newPassword = body.newPassword;

  req.body = {
    data: validatedValues,
    id: id,
  };

  return done();
};

// *****************
// Delete User
// *****************

const validateDeleteUser = (req, res, done) => {
  const errorArray = [];
  const params = req.params;

  if (!params.id || isNaN(params.id)) {
    errorArray.push({
      field: "id",
      error: 10380,
      message: "Please provide only valid 'id' as numeric.",
    });
  }

  if (!_.isEmpty(errorArray)) {
    return generalMiddleware.standardErrorResponse(
      res,
      errorArray,
      "user.middleware.validateDeleteUser"
    );
  }
  done();
};

// ****************************
// validate Email Verification
// ****************************

const validateEmailVerification = (req, res, done) => {
  const errorArray = [];
  const query = req.query;
  const validatedQuery = {};

  // e is an optional string property, if it is given than validate it.
  if (query.hasOwnProperty("e")) {
    // Validating as not empty, valid String and length range.
    if (_.isEmpty(query.e) || !_.isString(query.e)) {
      errorArray.push({
        field: "e",
        error: 10130,
        message: "Please provide only valid 'e' as string.",
      });
    }
    validatedQuery.e = query.e;
  }

  // emToken is an optional string property, if it is given than validate it.
  if (query.hasOwnProperty("emToken")) {
    // Validating as not empty, valid String and length range.
    if (_.isEmpty(query.emToken) || !_.isString(query.emToken)) {
      errorArray.push({
        field: "emToken",
        error: 10130,
        message: "Please provide only valid 'emToken' as string.",
      });
    }
    validatedQuery.e = query.e;
  }

  if (!_.isEmpty(errorArray)) {
    return generalMiddleware.standardErrorResponse(
      res,
      errorArray,
      "user.middleware.validateEmailVerification"
    );
  }

  req.conditions = validatedQuery;
  done();
};

module.exports = {
  validateSignUp,
  validateLoginCredentials,
  validateGetUsers,
  validateForgotPassword,
  validateResetPassword,
  validateUpdateUser,
  validateChangePassword,
  validateDeleteUser,
  validateEmailVerification,
};
