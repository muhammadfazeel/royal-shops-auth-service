'use strict'
const model = require('../models')
const helpingHelperMethods = require('../helpers/helping.helper');
const _ = require('lodash')
const Op = require('sequelize').Op
const config = require('../config/environment.config.json');

// **************************
//  Add Order
// **************************

const addOrder = async (req, res) => {
    console.log('Add Order API Called');
    try {
        let input = req.body;
        if (!input.CustomerId && input.credit) throw "Cannot Add Credit Without CustomerId";
        input.OrderId = helpingHelperMethods.generateUniqueKey();
        let addOrder = await model.Order.create(input);
        if (!addOrder) throw "Cannot Create Order";

        let orderProduct = [];
        for (let i = 0; i < input.products.length; i++) {
            orderProduct.push({
                OrderId: addOrder.id,
                ProductId: input.products[i]
            });
        }
        await model.OrderProduct.bulkCreate(orderProduct);
        if (input.CustomerId && input.credit) {
            await model.Customer.increment({ credit: +input.credit }, { where: { id: input.CustomerId } });
        }

        res.status(200).json({
            success: true,
            msg: "Successfully Created",
            addOrder
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
// Get Orders
// ***********************

const getOrders = async (req, res) => {
    try {

        let conditions = req.conditions;

        let limit = Number(req.limit)
        let offset = Number(req.offset)

        // Check if Product exist in conditions
        let result = await model.Order.findAndCountAll({
            where: conditions,
            include: [
                {
                    model: model.Customer,
                    as: 'customer'
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
// Update Order
// ****************************

const updateOrder = async (req, res) => {
    console.log('Update Order API Called');
    try {
        let id = req.params.id;
        let data = req.body;
        let updateOrder = await model.Order.update(data, { where: { id } });
        if (updateOrder[0] == 0) throw "Cannot Update Order";
        res.status(200).json({
            success: true,
            msg: 'Successfully Updated',
            updateOrder
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
    getOrders,
    addOrder,
    updateOrder,
    getProductById
}
