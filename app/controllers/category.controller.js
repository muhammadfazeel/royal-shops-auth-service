'use strict'
const model = require('../models')
const helpingHelperMethods = require('../helpers/helping.helper');
const _ = require('lodash')
const Op = require('sequelize').Op
const config = require('../config/environment.config.json');

// **************************
//  Create Category
// **************************

const createCategory = async (req, res) => {
    console.log('Create Category API Called');
    try {
        let input = req.body;

        let checkCategoryIfExist = await model.Category.findOne({
            where: { name: input.name }
        });
        if (checkCategoryIfExist) throw "Category Already Exists";

        let createCategory = await model.Category.create(input)
        if (!createCategory) throw "Cannot Create Category";

        res.status(200).json({
            success: true,
            msg: "Successfully Created",
            createCategory
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
// Get Category
// ***********************

const getCategories = async (req, res) => {
    try {

        let conditions = req.conditions;

        let limit = Number(req.limit)
        let offset = Number(req.offset)

        if (conditions.name) {
            conditions.name = {
                [Op.like]: `%${conditions.name}%`
            }
        }

        // Check if Category exist in conditions
        let result = await model.Category.findAndCountAll({
            where: conditions,
            limit: limit,
            offset: offset
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
// Update Category
// ****************************

const updateCategory = async (req, res) => {
    console.log('Update Category API Called');
    try {
        let id = req.params.id;
        let data = req.body;
        let updateCategory = await model.Category.update(data, { where: { id } });
        if (updateCategory[0] == 0) throw "Cannot Update Category";
        res.status(200).json({
            success: true,
            msg: 'Successfully Updated',
            updateCategory
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
//  Get Category By Id
// ******************************

const getCategoryById = async (req, res) => {
    console.log('Get Category By Id API Called');
    try {
        let id = req.params.id;
        let Category = await model.Category.findOne({
            where: { id }
        });
        if (!Category) throw "Cannot Find Category";
        res.status(200).json({
            success: true,
            msg: 'Successfully Fetched',
            Category
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
    getCategories,
    createCategory,
    updateCategory,
    getCategoryById
}
