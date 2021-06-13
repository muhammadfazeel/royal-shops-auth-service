'use strict'

const userMiddleware = require('../middlewares/user.middleware')
const userController = require('../controllers/user.controller')
const passport = require('../config/passport')
const generalMiddleware = require('../middlewares/general.middleware')

module.exports = function (app, apiVersion) {
  const route = apiVersion

  // ---------------------------------------------
  // ------------- Public Apis  ------------------
  // ---------------------------------------------

  // user-signup
  app.post(route + '/register-account', userMiddleware.validateSignUp, userController.signUp)
  app.post(route + '/login', userMiddleware.validateLoginCredentials, userController.login)
  app.post(route + '/forgot-password', userMiddleware.validateForgotPassword, userController.resetPasswordMail)
  app.post(route + '/reset-password', userMiddleware.validateResetPassword, userController.resetPassword)
  app.get(route + '/verifyEmail', userController.emailVerification);

  // ----------------------------------------------
  // ------------- Protected Apis -----------------
  // ----------------------------------------------
  app.get(route + '/user', passport.authenticate('jwt', { session: false }), userMiddleware.validateGetUsers, userController.getUsers);
  app.put(route + '/user/update/:id', passport.authenticate('jwt', { session: false }), userMiddleware.validateUpdateUser, userController.updateUser)
  app.get(route + '/user/validate', passport.authenticate('jwt', { session: false }), userController.userValidation)
  app.post(route + '/user/check-password', passport.authenticate('jwt', { session: false }), userMiddleware.validateLoginCredentials, userController.checkPassword)
  app.put(route + '/user/change-password/:id', passport.authenticate('jwt', { session: false }), userMiddleware.validateChangePassword, userController.changeCurrentPassword)
}
