'use strict'
const generalMiddleware = require('./general.middleware')
const _ = require('lodash')

// **************************
// Create Research Category
// **************************

const validateCreateCategory = (req, res, done) => {

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

    // send array if error(s)
    if (errorArray.length) {
        return generalMiddleware.standardErrorResponse(res, errorArray, 'category.middleware.validateCreateCategory')
    }

    // Info Object
    validatedValues.name = body.name;
    validatedValues.ShopId = req.user.id;

    req.body = validatedValues
    done()
}

// **************************
// Update Research Category
// **************************

const updateCategory = (req, res, done) => {
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

    // send array if error(s)
    if (errorArray.length) {
        return generalMiddleware.standardErrorResponse(res, errorArray, 'category.middleware.updateCategory')
    }

    req.body = validatedValues
    done()
}


// *****************************
//  Get Category By Id
// *****************************

const getCategoryById = (req, res, done) => {
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
        return generalMiddleware.standardErrorResponse(res, errorArray, 'category.middleware.getCategoryById')
    }
    done()
}

// ****************************
//  Get All Categories
// ****************************

const getAllCategories = (req, res, done) => {
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
        validatedQuery.id = query.id
    }


    if (!_.isEmpty(errorArray)) {
        return generalMiddleware.standardErrorResponse(res, errorArray, 'user.middleware.validateGetUsers')
    }

    if (query.limit && query.limit > 0) {
        limit = query.limit
    }

    if (query.offset && query.offset > 0) {
        offset = query.offset
    }

    validatedQuery.isDeleted = false
    req.conditions = validatedQuery
    req.limit = limit
    req.offset = offset
    done()
}

// ************************
// Delete Research Category
// ************************

const deleteCategory = (req, res, done) => {
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
        return generalMiddleware.standardErrorResponse(res, errorArray, 'category.middleware.deleteCategory')
    }
    done()
}

module.exports = {
    validateCreateCategory,
    updateCategory,
    getCategoryById,
    getAllCategories,
    deleteCategory
}