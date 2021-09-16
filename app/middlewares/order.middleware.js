'use strict'
const generalMiddleware = require('./general.middleware')
const _ = require('lodash')

// **************************
// Create Order
// **************************

const validateAddOrder = (req, res, done) => {

    const body = req.body
    const validatedValues = {}

    // get all the errors in an array
    const errorArray = []

    if (!body.totalAmount || isNaN(body.totalAmount)) {
        errorArray.push({
            field: 'totalAmount',
            error: 10380,
            message: 'Please provide only valid \'totalAmount\' as numeric.'
        })
    }

    if (body.hasOwnProperty('discount')) {
        if (isNaN(body.discount)) {
            errorArray.push({
                field: 'discount',
                error: 10380,
                message: 'Please provide only valid \'discount\' as numeric.'
            })
        }
        validatedValues.discount = body.discount;
    }

    if (!body.amountPaid || isNaN(body.amountPaid)) {
        errorArray.push({
            field: 'amountPaid',
            error: 10380,
            message: 'Please provide only valid \'amountPaid\' as numeric.'
        })
    }

    if (body.hasOwnProperty('credit')) {
        if (!body.credit || isNaN(body.credit)) {
            errorArray.push({
                field: 'credit',
                error: 10380,
                message: 'Please provide only valid \'credit\' as numeric.'
            })
        }
        validatedValues.credit = body.credit;
    }

    if (!body.ShopId || isNaN(body.ShopId)) {
        errorArray.push({
            field: 'ShopId',
            error: 10380,
            message: 'Please provide only valid \'ShopId\' as numeric.'
        })
    }

    if (!body.CustomerId || isNaN(body.CustomerId)) {
        errorArray.push({
            field: 'CustomerId',
            error: 10380,
            message: 'Please provide only valid \'CustomerId\' as numeric.'
        })
    }


    if (!body.products || !_.isArray(body.products) || !body.products.length) {
        errorArray.push({
            field: 'products',
            error: 10380,
            message: 'Please provide only valid \'products\' as Array.'
        })
    }

    for (let i = 0; i < body.products.length; ++i) {
        if (!body.products[i].ProductId || isNaN(body.products[i].ProductId)) {
            errorArray.push({
                field: 'products.ProductId',
                error: 10380,
                message: 'Please provide only valid \'products.ProductId\' as numeric.'
            })
        }

        if (!body.products[i].quantity || isNaN(body.products[i].quantity)) {
            errorArray.push({
                field: 'products.quantity',
                error: 10380,
                message: 'Please provide only valid \'products.quantity\' as numeric.'
            })
        }


        if (!body.products[i].price || isNaN(body.products[i].price)) {
            errorArray.push({
                field: 'products.price',
                error: 10380,
                message: 'Please provide only valid \'products.price\' as numeric.'
            })
        }
    }

    // send array if error(s)
    if (errorArray.length) {
        return generalMiddleware.standardErrorResponse(res, errorArray, 'Product.middleware.validateAddOrder')
    }

    // Info Object
    validatedValues.totalAmount = body.totalAmount;
    validatedValues.amountPaid = body.amountPaid;
    validatedValues.CustomerId = body.CustomerId;
    validatedValues.ShopId = body.ShopId;
    validatedValues.products = body.products;

    req.body = validatedValues
    done()
}

// ****************
// Update Order
// ****************

const validateUpdateOrder = (req, res, done) => {

    const body = req.body
    const validatedValues = {}

    // get all the errors in an array
    const errorArray = []

    if (body.hasOwnProperty('totalAmount')) {
        if (!body.totalAmount || isNaN(body.totalAmount)) {
            errorArray.push({
                field: 'totalAmount',
                error: 10380,
                message: 'Please provide only valid \'totalAmount\' as numeric.'
            })
        }
        validatedValues.totalAmount = body.totalAmount;
    }

    if (body.hasOwnProperty('discount')) {
        if (isNaN(body.discount)) {
            errorArray.push({
                field: 'discount',
                error: 10380,
                message: 'Please provide only valid \'discount\' as numeric.'
            })
        }
        validatedValues.discount = body.discount;
    }

    if (body.hasOwnProperty('amountPaid')) {
        if (!body.amountPaid || isNaN(body.amountPaid)) {
            errorArray.push({
                field: 'amountPaid',
                error: 10380,
                message: 'Please provide only valid \'amountPaid\' as numeric.'
            })
        }
        validatedValues.amountPaid = body.amountPaid;
    }

    if (body.hasOwnProperty('credit')) {
        if (isNaN(body.credit)) {
            errorArray.push({
                field: 'credit',
                error: 10380,
                message: 'Please provide only valid \'credit\' as numeric.'
            })
        }
        validatedValues.credit = body.credit;
    }

    if (!body.ShopId || isNaN(body.ShopId)) {
        errorArray.push({
            field: 'ShopId',
            error: 10380,
            message: 'Please provide only valid \'ShopId\' as numeric.'
        })
    }

    if (!body.CustomerId || isNaN(body.CustomerId)) {
        errorArray.push({
            field: 'CustomerId',
            error: 10380,
            message: 'Please provide only valid \'CustomerId\' as numeric.'
        })
    }

    if (body.hasOwnProperty('products')) {
        if (!body.products || !_.isArray(body.products) || !body.products.length) {
            errorArray.push({
                field: 'products',
                error: 10380,
                message: 'Please provide only valid \'products\' as Array.'
            })
        }

        for (let i = 0; i < body.products.length; ++i) {
            if (!body.products[i].ProductId || isNaN(body.products[i].ProductId)) {
                errorArray.push({
                    field: 'products.ProductId',
                    error: 10380,
                    message: 'Please provide only valid \'products.ProductId\' as numeric.'
                })
            }

            if (!body.products[i].quantity || isNaN(body.products[i].quantity)) {
                errorArray.push({
                    field: 'products.quantity',
                    error: 10380,
                    message: 'Please provide only valid \'products.quantity\' as numeric.'
                })
            }


            if (!body.products[i].price || isNaN(body.products[i].price)) {
                errorArray.push({
                    field: 'products.price',
                    error: 10380,
                    message: 'Please provide only valid \'products.price\' as numeric.'
                })
            }
            body.products[i].OrderId = req.params.id
        }
        validatedValues.products = body.products;
    }

    // send array if error(s)
    if (errorArray.length) {
        return generalMiddleware.standardErrorResponse(res, errorArray, 'Product.middleware.validateUpdateOrder')
    }

    // Info Object
    validatedValues.CustomerId = body.CustomerId;
    validatedValues.ShopId = body.ShopId;

    req.body = validatedValues
    done()
}

// *****************************
//  Get Order By Id
// *****************************

const getOrderById = (req, res, done) => {
    const errorArray = []
    const params = req.params

    if (!params.id || isNaN(params.id)) {
        errorArray.push({
            field: 'id',
            error: 10380,
            message: 'Please provide only valid \'id\' as numeric.'
        })
    }

    if (!_.isEmpty(errorArray)) {
        return generalMiddleware.standardErrorResponse(res, errorArray, 'Order.middleware.getOrderById')
    }
    done()
}

// ****************************
//  Get All Orders
// ****************************

const getAllOrders = (req, res, done) => {
    const errorArray = []
    const query = req.query
    const validatedQuery = {}

    let limit = 50
    let offset = 0

    // id is an optional numeric property, if it is given than validate it.
    if (query.hasOwnProperty('id')) {
        // Validating as not empty, valid numeric value with range.
        if (!query.id || isNaN(query.id)) {
            errorArray.push({
                field: 'id',
                error: 10120,
                message: 'Please provide only valid \'id\' as numeric.'
            })
        }
        validatedQuery.id = query.id
    }


    // OrderId is an optional numeric property, if it is given than validate it.
    if (query.hasOwnProperty('OrderId')) {
        // Validating as not empty, valid numeric value with range.
        if (!query.OrderId || isNaN(query.OrderId)) {
            errorArray.push({
                field: 'OrderId',
                error: 10120,
                message: 'Please provide only valid \'OrderId\' as numeric.'
            })
        }
        validatedQuery.OrderId = query.OrderId
    }


    // name is an optional string property, if it is given than validate it.
    if (query.hasOwnProperty('name')) {
        // Validating as not empty, valid String and length range.
        if (_.isEmpty(query.name) || !_.isString(query.name) || query.name.length < 2 || query.name.length > 100) {
            errorArray.push({
                field: 'name',
                error: 10130,
                message: 'Please provide only valid \'name\' as string, length must be between 2 and 100.'
            })
        }
        validatedQuery.name = query.name
    }


    // startDate is an optional string property, if it is given than validate it.
    if (query.hasOwnProperty('startDate')) {
        // Validating as not empty, valid String and length range.
        if (_.isEmpty(query.startDate) || !_.isString(query.startDate) || query.startDate.length < 2 || query.startDate.length > 100) {
            errorArray.push({
                field: 'startDate',
                error: 10130,
                message: 'Please provide only valid \'startDate\' as string, length must be between 2 and 100.'
            })
        }
        validatedQuery.startDate = query.startDate
    }


    // endDate is an optional string property, if it is given than validate it.
    if (query.hasOwnProperty('endDate')) {
        // Validating as not empty, valid String and length range.
        if (_.isEmpty(query.endDate) || !_.isString(query.endDate) || query.endDate.length < 2 || query.endDate.length > 100) {
            errorArray.push({
                field: 'endDate',
                error: 10130,
                message: 'Please provide only valid \'endDate\' as string, length must be between 2 and 100.'
            })
        }
        validatedQuery.endDate = query.endDate
    }

    // ShopId is an optional numeric property, if it is given than validate it.
    if (query.hasOwnProperty('ShopId')) {
        // Validating as not empty, valid numeric value with range.
        if (!query.ShopId || isNaN(query.ShopId)) {
            errorArray.push({
                field: 'ShopId',
                error: 10120,
                message: 'Please provide only valid \'ShopId\' as numeric.'
            })
        }
        validatedQuery.ShopId = query.ShopId
    }


    if (!_.isEmpty(errorArray)) {
        return generalMiddleware.standardErrorResponse(res, errorArray, 'user.middleware.getAllOrders')
    }

    if (query.limit && query.limit > 0) {
        limit = query.limit
    }

    if (query.offset && query.offset > 0) {
        offset = query.offset
    }

    req.conditions = validatedQuery
    req.limit = limit
    req.offset = offset
    done()
}

// ************************
// Delete Order
// ************************

const deleteOrder = (req, res, done) => {
    const errorArray = []
    const params = req.params

    if (!params.id || isNaN(params.id)) {
        errorArray.push({
            field: 'id',
            error: 10380,
            message: 'Please provide only valid \'id\' as numeric.'
        })
    }

    if (!_.isEmpty(errorArray)) {
        return generalMiddleware.standardErrorResponse(res, errorArray, 'Product.middleware.deleteOrder')
    }
    done()
}

module.exports = {
    validateAddOrder,
    validateUpdateOrder,
    getOrderById,
    getAllOrders,
    deleteOrder
}