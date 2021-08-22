'use strict'
const generalMiddleware = require('./general.middleware')
const _ = require('lodash')

// **************************
// Create Product
// **************************

const validateAddProduct = (req, res, done) => {

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

    if (!body.retailPrice || isNaN(body.retailPrice)) {
        errorArray.push({
            field: 'retailPrice',
            error: 10380,
            message: 'Please provide only valid \'retailPrice\' as numeric.'
        })
    }

    if (!body.salePrice || isNaN(body.salePrice)) {
        errorArray.push({
            field: 'salePrice',
            error: 10380,
            message: 'Please provide only valid \'salePrice\' as numeric.'
        })
    }

    if (!body.stock || isNaN(body.stock)) {
        errorArray.push({
            field: 'stock',
            error: 10380,
            message: 'Please provide only valid \'stock\' as numeric.'
        })
    }

    if (!body.CategoryId || isNaN(body.CategoryId)) {
        errorArray.push({
            field: 'CategoryId',
            error: 10380,
            message: 'Please provide only valid \'CategoryId\' as numeric.'
        })
    }

    if (body.hasOwnProperty('imageUrl')) {
        // imageUrl is required, validating it as not empty, valid String and length range.
        if (_.isEmpty(body.imageUrl) || !_.isString(body.imageUrl) || body.imageUrl.length < 2 || body.imageUrl.length > 250) {
            errorArray.push({
                field: 'imageUrl',
                error: 10020,
                message: '\'imageUrl\' is required as string, length must be between 2 and 250.'
            })
        }
        validatedValues.imageUrl = body.imageUrl;
    }


    // send array if error(s)
    if (errorArray.length) {
        return generalMiddleware.standardErrorResponse(res, errorArray, 'Product.middleware.validateAddProduct')
    }

    // Info Object
    validatedValues.name = body.name;
    validatedValues.retailPrice = body.retailPrice;
    validatedValues.salePrice = body.salePrice;
    validatedValues.stock = body.stock;
    validatedValues.CategoryId = body.CategoryId;
    validatedValues.ShopId = req.user.id;

    req.body = validatedValues
    done()
}

// **************************
// Update Research Product
// **************************

const updateProduct = (req, res, done) => {
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

    if (body.hasOwnProperty('retailPrice')) {
        if (!body.retailPrice || isNaN(body.retailPrice)) {
            errorArray.push({
                field: 'retailPrice',
                error: 10380,
                message: 'Please provide only valid \'retailPrice\' as numeric.'
            })
        }
        validatedValues.retailPrice = body.retailPrice
    }

    if (body.hasOwnProperty('salePrice')) {
        if (!body.salePrice || isNaN(body.salePrice)) {
            errorArray.push({
                field: 'salePrice',
                error: 10380,
                message: 'Please provide only valid \'salePrice\' as numeric.'
            })
        }
        validatedValues.salePrice = body.salePrice
    }

    if (body.hasOwnProperty('stock')) {
        if (!body.stock || isNaN(body.stock)) {
            errorArray.push({
                field: 'stock',
                error: 10380,
                message: 'Please provide only valid \'stock\' as numeric.'
            })
        }
        validatedValues.stock = body.stock
    }

    if (body.hasOwnProperty('CategoryId')) {
        if (!body.CategoryId || isNaN(body.CategoryId)) {
            errorArray.push({
                field: 'CategoryId',
                error: 10380,
                message: 'Please provide only valid \'CategoryId\' as numeric.'
            })
        }
        validatedValues.CategoryId = body.CategoryId
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
        return generalMiddleware.standardErrorResponse(res, errorArray, 'Product.middleware.updateProduct')
    }

    req.body = validatedValues
    done()
}


// *****************************
//  Get Product By Id
// *****************************

const getProductById = (req, res, done) => {
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
        return generalMiddleware.standardErrorResponse(res, errorArray, 'Product.middleware.getProductById')
    }
    done()
}

// ****************************
//  Get All Products
// ****************************

const getAllProducts = (req, res, done) => {
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
        validatedQuery.ShopId = query.ShopId
    }

    // CategoryId is an optional numeric property, if it is given than validate it.
    if (query.hasOwnProperty('CategoryId')) {
        // Validating as not empty, valid numeric value with range.
        if (!query.CategoryId || isNaN(query.CategoryId)) {
            errorArray.push({
                field: 'CategoryId',
                error: 10120,
                message: 'Please provide only valid \'CategoryId\' as numeric.'
            })
        }
        validatedQuery.CategoryId = query.CategoryId
    }


    if (!_.isEmpty(errorArray)) {
        return generalMiddleware.standardErrorResponse(res, errorArray, 'user.middleware.getAllProducts')
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
// Delete Product
// ************************

const deleteProduct = (req, res, done) => {
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
        return generalMiddleware.standardErrorResponse(res, errorArray, 'Product.middleware.deleteProduct')
    }
    done()
}

module.exports = {
    validateAddProduct,
    updateProduct,
    getProductById,
    getAllProducts,
    deleteProduct
}