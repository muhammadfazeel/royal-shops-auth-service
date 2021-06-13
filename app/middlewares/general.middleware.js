'use strict'
const SERVER_RESPONSE = require('../config/serverResponses')
const formidable = require('formidable')

function standardErrorResponse (res, err, type, statusCode) {
  let code = SERVER_RESPONSE.VALIDATION_ERROR
  statusCode = parseInt(statusCode)
  if (!isNaN(statusCode)) {
    code = statusCode
  }
  return res.status(code)
    .send({
      status: 'Error',
      message: err,
      location: type
    })
}

// a middleware to attach files and field to form data requests
const attachBodyAndFiles = (req, res, next) => {
  // console.log(req)
  console.log('Attach File Func Called')
  let form = new formidable.IncomingForm()
  form.parse(req, function (err, fields, files) {
    if (err) {
      return standardErrorResponse(res, {
        field: 'general',
        error: '2000',
        message: err
      }, 'attachBodyAndFiles.middleware.generalMiddleware')
    }
    req.files = []
    for (const key in files) {
      if (files.hasOwnProperty(key)) {
        const element = files[key]
        req.files.push(element)
      }
    }
    req.body = fields
    next()
  })
}

//Upload Image File
const uploadFile = (file) => {
  return new Promise((resolve) => {
    console.log('upload Func Called')
    // eslint-disable-next-line no-useless-catch
    try {
      let sampleFile = file;
      let x = new Date();
      let filename =
        file.name +
        "" +
        x.getDate() +
        "" +
        x.getMonth() +
        "" +
        x.getFullYear() +
        "" +
        x.getHours() +
        "" +
        x.getMinutes() +
        "" +
        x.getSeconds() +
        ".jpg";
      // Use the mv() method to place the file somewhere on your server
      sampleFile.mv("./public/" + filename, (err) => {
        if (err) {
          throw err;
        }
        resolve(filename);
      });
    } catch (err) {
      throw err;
    }
  });
}

module.exports = {
  standardErrorResponse,
  attachBodyAndFiles,
  uploadFile
}
