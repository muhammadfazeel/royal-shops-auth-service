'use strict'
const model = require('../models')
const helpingHelperMethods = require('../helpers/helping.helper');
const _ = require('lodash')
const Op = require('sequelize').Op
const config = require('../config/environment.config.json');

// **************************
//  Add Customer
// **************************

const addCustomer = async (req, res) => {
    console.log('Add Customer API Called');
    try {
        let input = req.body;
        let condition =
        {
            [Op.or]: [
                {
                    nationalId: {
                        [Op.eq]: input.nationalId
                    },
                },
                {
                    phone: {
                        [Op.or]: input.phone
                    }
                }
            ]
        }

        let checkCustomerIfExist = await model.Customer.findAll({
            where: condition
        });
        if (checkCustomerIfExist.length) throw "Customer Already Exists With Same National Id or Phone";

        let addCustomer = await model.Customer.create(input)
        if (!addCustomer) throw "Cannot Create Customer";

        res.status(200).json({
            success: true,
            msg: "Successfully Created",
            addCustomer
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
// Get Customers
// ***********************

const getCustomers = async (req, res) => {
    try {
        let conditions = req.conditions;

        let limit = Number(req.limit)
        let offset = Number(req.offset)

        if (conditions.name) {
            conditions.name = {
                [Op.like]: `%${conditions.name}%`
            }
        }

        // Check if Customer exist in conditions
        let result = await model.Customer.findAndCountAll({
            where: conditions,
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
// Update Customer
// ****************************

const updateCustomer = async (req, res) => {
    console.log('Update Customer API Called');
    try {
        let id = req.params.id;
        let data = req.body;

        let condition =
        {
            [Op.or]: [
                {
                    nationalId: {
                        [Op.eq]: data.nationalId
                    },
                },
                {
                    phone: {
                        [Op.eq]: data.phone
                    }
                }
            ]
        }
        condition.id = {
            [Op.ne]: id
        }

        let checkCustomerIfExist = await model.Customer.findAll({
            where: condition
        });
        if (checkCustomerIfExist.length) throw "Customer Already Exists With Same National Id or Phone";


        let updateCustomer = await model.Customer.update(data, { where: { id } });
        if (updateCustomer[0] == 0) throw "Cannot Update Customer";
        res.status(200).json({
            success: true,
            msg: 'Successfully Updated',
            updateCustomer
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
//  Get Customer By Id
// ******************************

const getCustomerById = async (req, res) => {
    console.log('Get Customer By Id API Called');
    try {
        let id = req.params.id;
        let customer = await model.Customer.findOne({
            where: { id }
        });
        if (!customer) throw "Cannot Find Customer";
        res.status(200).json({
            success: true,
            msg: 'Successfully Fetched',
            customer
        })
    } catch (e) {
        res.status(501).json({
            success: false,
            ex: 'Exception: ',
            msg: e
        })
    }
}

// ******************************
//  Customer Credit
// ******************************

const credit = async (req, res) => {
    console.log('Credit API Called');
    try {
        let id = req.params.id;
        let data = req.body;

        let customer = await model.Customer.findOne({
            where: { id }
        });
        if (!customer) throw "Cannot Find Customer";

        if (customer.dataValues.credit === 0) throw "Credit is Already Zero";
        if (customer.dataValues.credit < data.amount) throw "Invalid Amount";

        let credit = customer.dataValues.credit;
        credit = credit - data.amount;

        customer.credit = credit;
        customer.save()

        res.status(200).json({
            success: true,
            msg: 'Successfully Fetched',
            customer
        })
    } catch (e) {
        res.status(501).json({
            success: false,
            ex: 'Exception: ',
            msg: e
        })
    }
}

// ******************************
//  Get Customer By Id
// ******************************

const getCustomerCredit = async (req, res) => {
    console.log('Get Customer By Id API Called');
    try {
        let conditions = req.conditions;

        let limit = Number(req.limit)
        let offset = Number(req.offset)

        let credit = await model.Credit.findAndCountAll({
            where: conditions,
            limit: limit,
            offset: offset,
            order: [['id', 'DESC']]
        });

        res.status(200).json({
            success: true,
            msg: 'Successfully Fetched',
            credit
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
    getCustomers,
    addCustomer,
    updateCustomer,
    getCustomerById,
    credit,
    getCustomerCredit
}
