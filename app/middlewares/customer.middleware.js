'use strict'
const generalMiddleware = require('./general.middleware')
const _ = require('lodash')

// **************************
// Create Customer
// **************************

const validateAddCustomer = (req, res, done) => {

    const body = req.body
    const validatedValues = {}

    // get all the errors in an array
    const errorArray = []

    // name is required, validating it as not empty, valid String and length range.
    if (_.isEmpty(body.name) || !_.isString(body.name) || body.name.length < 2 || body.name.length > 100) {
        errorArray.push({
            field: 'name',
            error: 10020,
            message: '\'name\' is required as string, length must be between 2 and 100.'
        })
    }

    // nationalId is required, validating it as not empty, valid String and length range.
    if (_.isEmpty(body.nationalId) || !_.isString(body.nationalId) || body.nationalId.length < 8 || body.nationalId.length > 15) {
        errorArray.push({
            field: 'nationalId',
            error: 10020,
            message: '\'nationalId\' is required as string, length must be between 8 and 15.'
        })
    }

    // phone is required, validating it as not empty, valid String and length range.
    if (_.isEmpty(body.phone) || !_.isString(body.phone) || body.phone.length < 6 || body.phone.length > 15) {
        errorArray.push({
            field: 'phone',
            error: 10020,
            message: '\'phone\' is required as string, length must be between 6 and 15.'
        })
    }

    // address is required, validating it as not empty, valid String and length range.
    if (_.isEmpty(body.address) || !_.isString(body.address) || body.address.length < 2 || body.address.length > 150) {
        errorArray.push({
            field: 'address',
            error: 10020,
            message: '\'address\' is required as string, length must be between 2 and 150.'
        })
    }

    // if (!body.credit || isNaN(body.credit)) {
    //     errorArray.push({
    //         field: 'credit',
    //         error: 10380,
    //         message: 'Please provide only valid \'credit\' as numeric.'
    //     })
    // }

    // send array if error(s)
    if (errorArray.length) {
        return generalMiddleware.standardErrorResponse(res, errorArray, 'Customer.middleware.validateAddCustomer')
    }

    // Info Object
    validatedValues.name = body.name;
    validatedValues.nationalId = body.nationalId;
    validatedValues.phone = body.phone;
    validatedValues.address = body.address;
    validatedValues.credit = body.credit;
    validatedValues.ShopId = req.user.id;

    req.body = validatedValues
    done()
}

// **************************
// Update Customer
// **************************

const updateCustomer = (req, res, done) => {
    const body = req.body
    const validatedValues = {}
    const params = req.params

    // get all the errors in an array
    const errorArray = [];

    if (!params.id || isNaN(params.id)) {
        errorArray.push({
            field: 'id',
            error: 10380,
            message: 'Please provide only valid \'id\' as numeric.'
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
        validatedValues.credit = body.credit
    }

    if (body.hasOwnProperty('name')) {
        // name is required, validating it as not empty, valid String and length range.
        if (_.isEmpty(body.name) || !_.isString(body.name) || body.name.length < 2 || body.name.length > 100) {
            errorArray.push({
                field: 'name',
                error: 10020,
                message: '\'name\' is required as string, length must be between 2 and 100.'
            })
        }
        validatedValues.name = body.name
    }

    if (body.hasOwnProperty('nationalId')) {
        // nationalId is required, validating it as not empty, valid String and length range.
        if (_.isEmpty(body.nationalId) || !_.isString(body.nationalId) || body.nationalId.length < 2 || body.nationalId.length > 15) {
            errorArray.push({
                field: 'nationalId',
                error: 10020,
                message: '\'nationalId\' is required as string, length must be between 2 and 15.'
            })
        }
        validatedValues.nationalId = body.nationalId
    }

    if (body.hasOwnProperty('phone')) {
        // phone is required, validating it as not empty, valid String and length range.
        if (_.isEmpty(body.phone) || !_.isString(body.phone) || body.phone.length < 6 || body.phone.length > 15) {
            errorArray.push({
                field: 'phone',
                error: 10020,
                message: '\'phone\' is required as string, length must be between 6 and 15.'
            })
        }
        validatedValues.phone = body.phone
    }

    if (body.hasOwnProperty('address')) {
        // address is required, validating it as not empty, valid String and length range.
        if (_.isEmpty(body.address) || !_.isString(body.address) || body.address.length < 2 || body.address.length > 150) {
            errorArray.push({
                field: 'address',
                error: 10020,
                message: '\'address\' is required as string, length must be between 2 and 150.'
            })
        }
        validatedValues.address = body.address
    }

    // send array if error(s)
    if (errorArray.length) {
        return generalMiddleware.standardErrorResponse(res, errorArray, 'Customer.middleware.updateCustomer')
    }

    req.body = validatedValues
    done()
}


// *****************************
//  Get Customer By Id
// *****************************

const getCustomerById = (req, res, done) => {
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
        return generalMiddleware.standardErrorResponse(res, errorArray, 'Customer.middleware.getCustomerById')
    }
    done()
}

// ****************************
//  Get All Customers
// ****************************

const getAllCustomers = (req, res, done) => {
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

    // nationalId is an optional string property, if it is given than validate it.
    if (query.hasOwnProperty('nationalId')) {
        // Validating as not empty, valid String and length range.
        if (_.isEmpty(query.nationalId) || !_.isString(query.nationalId) || query.nationalId.length < 2 || query.nationalId.length > 100) {
            errorArray.push({
                field: 'nationalId',
                error: 10130,
                message: 'Please provide only valid \'nationalId\' as string, length must be between 2 and 100.'
            })
        }
        validatedQuery.nationalId = query.nationalId
    }

    // phone is an optional string property, if it is given than validate it.
    if (query.hasOwnProperty('phone')) {
        // Validating as not empty, valid String and length range.
        if (_.isEmpty(query.phone) || !_.isString(query.phone) || query.phone.length < 2 || query.phone.length > 100) {
            errorArray.push({
                field: 'phone',
                error: 10130,
                message: 'Please provide only valid \'phone\' as string, length must be between 2 and 100.'
            })
        }
        validatedQuery.phone = query.phone
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
        return generalMiddleware.standardErrorResponse(res, errorArray, 'user.middleware.getAllCustomers')
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
// Delete Customer
// ************************

const deleteCustomer = (req, res, done) => {
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
        return generalMiddleware.standardErrorResponse(res, errorArray, 'Customer.middleware.deleteCustomer')
    }
    done()
}

// **************************
// Update Credit
// **************************

const updateCredit = (req, res, done) => {
    const body = req.body
    const validatedValues = {}
    const params = req.params

    // get all the errors in an array
    const errorArray = [];

    if (!params.id || isNaN(params.id)) {
        errorArray.push({
            field: 'id',
            error: 10380,
            message: 'Please provide only valid \'id\' as numeric.'
        })
    }

    if (body.hasOwnProperty('amount')) {
        if (!body.amount || isNaN(body.amount)) {
            errorArray.push({
                field: 'amount',
                error: 10380,
                message: 'Please provide only valid \'amount\' as numeric.'
            })
        }
        validatedValues.amount = body.amount
    }

    // send array if error(s)
    if (errorArray.length) {
        return generalMiddleware.standardErrorResponse(res, errorArray, 'Customer.middleware.updateCredit')
    }

    req.body = validatedValues
    done()
}

// ****************************
//  Get All Customer Credits
// ****************************

const getCustomerCredit = (req, res, done) => {
    const errorArray = []
    const query = req.query
    const validatedQuery = {}

    let limit = 50
    let offset = 0

    // Validating as not empty, valid numeric value with range.
    if (!query.CustomerId || isNaN(query.CustomerId)) {
        errorArray.push({
            field: 'CustomerId',
            error: 10120,
            message: 'Please provide only valid \'CustomerId\' as numeric.'
        })
    }
    validatedQuery.CustomerId = query.CustomerId

    // startDate is an optional string property, if it is given than validate it.
    if (query.hasOwnProperty('startDate')) {
        // Validating as not empty, valid String and length range.
        if (_.isEmpty(query.startDate) || !_.isString(query.startDate)) {
            errorArray.push({
                field: 'startDate',
                error: 10130,
                message: 'Please provide only valid \'startDate\' as string.'
            })
        }
        validatedQuery.startDate = query.startDate
    }

    // endDate is an optional string property, if it is given than validate it.
    if (query.hasOwnProperty('endDate')) {
        // Validating as not empty, valid String and length range.
        if (_.isEmpty(query.endDate) || !_.isString(query.endDate)) {
            errorArray.push({
                field: 'endDate',
                error: 10130,
                message: 'Please provide only valid \'endDate\' as string.'
            })
        }
        validatedQuery.endDate = query.endDate
    }

    if (!_.isEmpty(errorArray)) {
        return generalMiddleware.standardErrorResponse(res, errorArray, 'user.middleware.getAllCustomers')
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

module.exports = {
    validateAddCustomer,
    updateCustomer,
    getCustomerById,
    getAllCustomers,
    deleteCustomer,
    updateCredit,
    getCustomerCredit
}