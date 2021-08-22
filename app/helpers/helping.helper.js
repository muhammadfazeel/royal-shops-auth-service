'use strict'
const model = require('../models')
const config = require('../config/environment.config.json')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const Mustache = require('mustache')
const nodemailer = require("nodemailer");
const AWS = require('aws-sdk');
const crypto = require("crypto");

// *****************
// AWS Credentials
// *****************

const awsConfig = config.awsConfig

const s3 = new AWS.S3({
  'accessKeyId': process.env.accessKeyId || awsConfig.accessKeyId,
  'secretAccessKey': process.env.secretAccessKey || awsConfig.secretAccessKey,
  'region': process.env.region || awsConfig.region,
  'signatureVersion': 'v4'
});

let newConfig = {
  jwtOptions: {
    'secretOrKey': config.jwtOptions.secretOrKey || process.env.secretOrKey,
    'ignoreExpiration': config.jwtOptions.ignoreExpiration || process.env.ignoreExpiration
  }
}

// **********************
// To Upload File
// **********************

function uploadFile(file) {
  return new Promise(function (resolve, reject) {
    var stream = fs.createReadStream(file.path)
    var name = Date.now().toString() + '.pdf'
    var data = {
      Key: name,
      ACL: 'public-read',
      Body: stream,
      ContentType: file.type,
      Bucket: process.env.Bucket || config.Bucket
    }
    s3.upload(data, function (err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

// *************************************************
// Aws S3 Bucket Pre Assigned Url For File Handling
// *************************************************

const getSingedUrl = async (data) => {
  console.log("Get Singed Url Function Called")
  const params = {
    Bucket: config.bucketName,
    Key: data.fileName,
    Expires: 60 * 5,
    ACL: "public-read",
    ContentType: data.fileType
  };
  return await new Promise((resolve, reject) => {
    s3.getSignedUrl('putObject', params, (err, url) => {
      if (err) {
        return reject(err)
      }
      return resolve(url)
    });
  });
}


// **********************
// To Generate Password
// **********************

const generatePassword = () => {
  let password = generator.generate({
    length: 7,
    numbers: true
  })
  return password
}

// **************************
// sign jwt token
// **************************

const signLoginData = (userInfo) => {
  return new Promise((resolve, reject) => {
    var token = jwt.sign(userInfo, newConfig.jwtOptions.secretOrKey, { expiresIn: 180000000 })
    return resolve(token)
  })
}

// **********************
// To Generate Unique Id
// **********************

const generateUniqueKey = () => {
  return new Promise(function (resolve) {
    console.log("Generate Key Function Called");
    let uId = '';
    let key = Math.random().toString(36).slice(-8);
    uId = uId + key

    model.Order.findAll({
      where: { OrderId: uId }
    })
      .then((result) => {
        if (!result) {
          return generateUniqueKey()
        }
      })
    return resolve(uId)
  })
}

// ***************************
// nodemailer transporter
// ***************************

let transporter = nodemailer.createTransport({
  service: config.mailService.mailService,
  auth: {
    user: config.mailService.senderMail, // generated ethereal user
    pass: config.mailService.senderPass, // generated ethereal password
  },
});

// *********************
// Verify Email Address
// *********************


const verifyOTP = (otp, email) => {
  console.log('Send Verify Email Function Called');
  let view = {
    logo: ``,
    otp,
  };
  const emailVerificationTemp = require('../../views/passwordRestTemp');
  let emailData = Mustache.render(emailVerificationTemp, view);
  let mailOptions = {
    from: '"The Coacher" <admin@thecoacher.com>', // sender address
    to: email, // list of receivers
    subject: "Email verification ✔", // Subject line
    text: "Email verification",
    html: emailData,
  };
  transporter.sendMail(mailOptions);
  console.log("Email sent :)");
  return true
}

// *******************
// Random Token
// ******************

const generateRandomToken = (length) => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(length, function (err, buffer) {
      if (err) {
        reject(err);
      } else {
        resolve(buffer.toString("hex"));
      }
    });
  });
}

// *********************
// Password Reset Email
// *********************

const passResetMail = (verificationLink, email) => {
  console.log("Password Reset Email API Called");
  let view = {
    logo: ``,
    verificationLink
  };
  const passwordRestTemp = require("../../views/passwordResetTemp");
  let emailData = Mustache.render(passwordRestTemp, view);
  let mailOptions = {
    from: '"Royal Shops" <royalshops@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Password reset ✔", // Subject line
    text: "Password Recovery",
    html: emailData,
  };
  transporter.sendMail(mailOptions);
  console.log("passReset Email sent :)");
}

// ********************
//  Review Email
// ********************

const reviewEmail = (review, email) => {
  console.log("Password Reset Email API Called");
  let view = {
    logo: ``,
    review
  };
  const passwordRestTemp = require("../../views/reviewEmail");
  let emailData = Mustache.render(passwordRestTemp, view);
  let mailOptions = {
    from: '"Reswel" <reswel@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Article Review ✔", // Subject line
    text: "Article FeedBack",
    html: emailData,
  };
  transporter.sendMail(mailOptions);
  console.log("Review Email sent :)");
}

// *********************
// Verify Email Address
// *********************

const verifyEmail = (verificationLink, email) => {
  console.log('Send Verify Email Function Called');
  let view = {
    logo: ``,
    verificationLink,
  };
  console.log(verificationLink)
  const emailVerificationTemp = require("../../views/emailVerificationTemp");
  let emailData = Mustache.render(emailVerificationTemp, view);
  let mailOptions = {
    from: '"Reswel" <Rewel@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Email verification ✔", // Subject line
    text: "Email verification",
    html: emailData,
  };
  transporter.sendMail(mailOptions);
  console.log("verifyEmail mail sent :)");
  return true
}


module.exports = {
  generatePassword,
  signLoginData,
  uploadFile,
  generateUniqueKey,
  verifyOTP,
  getSingedUrl,
  generateRandomToken,
  passResetMail,
  verifyEmail,
  reviewEmail
}