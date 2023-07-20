let AsdvisersModel = require("../models/advisers.model")
var moment = require('moment')
var _ = require('underscore')

var log = console.log

module.exports.test = async (req, res) => {
    res.status(200).send({ status: "success", message: "Welcome To Testing API" })
}

module.exports.Principal = async (req, res) => {
    res.redirect("advisers/groups")
}