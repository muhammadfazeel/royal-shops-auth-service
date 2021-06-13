'use strict'
const passport = require('../config/passport')
const helpingHelperMethod = require('../helpers/helping.helper');

module.exports = function (app, apiVersion) {
    const route = apiVersion + '/getUrl'

    app.post(route, async (req, res) => {
        console.log('Get PRE Assigned Url API Called');
        try {
            let data = req.body;
            if (!data.fileName || !data.fileType) throw "fileName And fileType is Required";
            let url = await helpingHelperMethod.getSingedUrl(data).catch(e => { throw e });
            if (!url) throw "Cannot Create Url";
            res.status(200).json({
                success: true,
                msg: 'Url Successfully Created',
                postUrl: url,
                getUrl: url.split("?")[0]
            })
        } catch (e) {
            res.status(500).json({
                success: false,
                ex: 'Exception: ',
                msg: e
            })
        }
    });
}