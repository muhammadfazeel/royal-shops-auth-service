'use strict'

const orderMiddleware = require('../middlewares/order.middleware')
const orderController = require('../controllers/order.controller')
const passport = require('../config/passport')
const generalMiddleware = require('../middlewares/general.middleware')

module.exports = function (app, apiVersion) {
    const route = apiVersion + '/admin'

    app.post(route + '/createOrder', passport.authenticate('jwt', { session: false }), orderMiddleware.validateAddOrder, orderController.addOrder);
    app.put(route + '/updateOrder/:id', passport.authenticate('jwt', { session: false }), orderMiddleware.validateUpdateOrder, orderController.updateOrder);
    app.get(route + '/getOrderBy/:id', passport.authenticate('jwt', { session: false }), orderMiddleware.getOrderById, orderController.getPOrderById);
    app.get(route + '/getAllOrders', passport.authenticate('jwt', { session: false }), orderMiddleware.getAllOrders, orderController.getOrders);
}
