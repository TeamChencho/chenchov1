let Permisos = require("../../models/moderadores/dashboard.model")
var moment           = require('moment')
var _                = require('underscore')

var log = console.log

module.exports.test = async(req, res) => {
    res.status(200).send({ status: "success", message: "Welcome To Testing API" })
}

module.exports.Principal = async (req, res) => {
    var error = req.query.e
    res.render('NovusTec/Profesores/Dashboard/index', {
        title: "Dashboard",
        description: "",
        content: "Dashboard",
        menu_item: "Dashboard",
        //currentUser: req.currentUser,
        error: error,
        _:_,
        moment:moment
    });

}