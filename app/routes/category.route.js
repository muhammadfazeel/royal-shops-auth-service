'use strict'

const categoryMiddleware = require('../middlewares/category.middleware')
const categoryController = require('../controllers/category.controller')
const passport = require('../config/passport')
const generalMiddleware = require('../middlewares/general.middleware')

module.exports = function (app, apiVersion) {
    const route = apiVersion + '/admin'

    app.post(route + '/createCategory', passport.authenticate('jwt', { session: false }), categoryMiddleware.validateCreateCategory, categoryController.createCategory);
    app.put(route + '/updateCategory/:id', passport.authenticate('jwt', { session: false }), categoryMiddleware.updateCategory, categoryController.updateCategory);
    app.get(route + '/getCategoryBy/:id', passport.authenticate('jwt', { session: false }), categoryMiddleware.getCategoryById, categoryController.getCategoryById);
    app.get(route + '/getAllCategories', passport.authenticate('jwt', { session: false }), categoryMiddleware.getAllCategories, categoryController.getCategories);
}
