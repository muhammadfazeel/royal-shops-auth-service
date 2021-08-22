'use strict'
const model = require('../models')
const helpingHelperMethods = require('../helpers/helping.helper');
const _ = require('lodash')
const Op = require('sequelize').Op
const config = require('../config/environment.config.json');

// **************************
//  Add Product
// **************************

const addProduct = async (req, res) => {
    console.log('Add Product API Called');
    try {
        let input = req.body;

        let checkProductIfExist = await model.Product.findOne({
            where: { name: input.name }
        });
        if (checkProductIfExist) throw "Product Already Exists";

        let addProduct = await model.Product.create(input)
        if (!addProduct) throw "Cannot Create Product";

        res.status(200).json({
            success: true,
            msg: "Successfully Created",
            addProduct
        })
    } catch (e) {
        res.status(500).json({
            success: false,
            ex: 'Exception: ',
            msg: e
        })
    }
}

// ***********************
// Get Products
// ***********************

const getProducts = async (req, res) => {
    try {

        let conditions = req.conditions;

        let limit = Number(req.limit)
        let offset = Number(req.offset)

        if (conditions.name) {
            conditions.name = {
                [Op.like]: `%${conditions.name}%`
            }
        }

        // Check if Product exist in conditions
        let result = await model.Product.findAndCountAll({
            where: conditions,
            include: [
                {
                    model: model.Category,
                    as: 'category'
                },
                {
                    model: model.User,
                    as: 'shop'
                }
            ],
            limit: limit,
            offset: offset,
            order: [['id', 'DESC']]
        });

        res.status(200).json({
            success: true,
            msg: 'Successfully Fetched',
            result
        })
    } catch (e) {
        res.status(500).json({
            success: false,
            ex: 'Exception: ',
            msg: e
        })
    }
}

// ****************************
// Update Product
// ****************************

const updateProduct = async (req, res) => {
    console.log('Update Product API Called');
    try {
        let id = req.params.id;
        let data = req.body;
        let updateProduct = await model.Product.update(data, { where: { id } });
        if (updateProduct[0] == 0) throw "Cannot Update Product";
        res.status(200).json({
            success: true,
            msg: 'Successfully Updated',
            updateProduct
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            ex: 'Exception: ',
            msg: e
        })
    }
}

// ******************************
//  Get Product By Id
// ******************************

const getProductById = async (req, res) => {
    console.log('Get Product By Id API Called');
    try {
        let id = req.params.id;
        let product = await model.Product.findOne({
            where: { id },
            include: [
                {
                    model: model.Category,
                    as: 'category'
                },
                {
                    model: model.User,
                    as: 'shop'
                }
            ],
        });
        if (!product) throw "Cannot Find Product";
        res.status(200).json({
            success: true,
            msg: 'Successfully Fetched',
            product
        })
    } catch (e) {
        res.status(501).json({
            success: false,
            ex: 'Exception: ',
            msg: e
        })
    }
}

module.exports = {
    getProducts,
    addProduct,
    updateProduct,
    getProductById
}
