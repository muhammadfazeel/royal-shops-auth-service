'use strict'

const customerMiddleware = require('../middlewares/customer.middleware')
const customerController = require('../controllers/customer.controller')
const passport = require('../config/passport')
const generalMiddleware = require('../middlewares/general.middleware')

module.exports = function (app, apiVersion) {
    const route = apiVersion + '/admin'

    app.post(route + '/createCustomer', passport.authenticate('jwt', { session: false }), customerMiddleware.validateAddCustomer, customerController.addCustomer);
    app.put(route + '/updateCustomer/:id', passport.authenticate('jwt', { session: false }), customerMiddleware.updateCustomer, customerController.updateCustomer);
    app.get(route + '/getCustomerBy/:id', passport.authenticate('jwt', { session: false }), customerMiddleware.getCustomerById, customerController.getCustomerById);
    app.get(route + '/getAllCustomers', passport.authenticate('jwt', { session: false }), customerMiddleware.getAllCustomers, customerController.getCustomers);
    app.put(route + '/customerCredit/:id', passport.authenticate('jwt', { session: false }), customerMiddleware.updateCredit, customerController.credit);
    app.get(route + '/getCustomersCredit', passport.authenticate('jwt', { session: false }), customerMiddleware.getCustomerCredit, customerController.getCustomerCredit);
}
