'use strict'

const productMiddleware = require('../middlewares/Product.middleware')
const productController = require('../controllers/product.controller')
const passport = require('../config/passport')
const generalMiddleware = require('../middlewares/general.middleware')

module.exports = function (app, apiVersion) {
    const route = apiVersion + '/admin'

    app.post(route + '/createProduct', passport.authenticate('jwt', { session: false }), productMiddleware.validateAddProduct, productController.addProduct);
    app.put(route + '/updateProduct/:id', passport.authenticate('jwt', { session: false }), productMiddleware.updateProduct, productController.updateProduct);
    app.get(route + '/getProductBy/:id', passport.authenticate('jwt', { session: false }), productMiddleware.getProductById, productController.getProductById);
    app.get(route + '/getAllProducts', passport.authenticate('jwt', { session: false }), productMiddleware.getAllProducts, productController.getProducts);
}
