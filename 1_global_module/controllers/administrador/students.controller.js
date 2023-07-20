let AdvisersModel    = require("../../models/administrador/students.model")
var moment           = require('moment')
var _                = require('underscore')

var log = console.log

module.exports.test = async(req, res) => {
    res.status(200).send({ status: "success", message: "Welcome To Testing API" })
}

module.exports.StudentsPrincipal = async (req, res) => {
    var error = req.query.e
    res.render('NovusTec/Administrador/Students/index', {
        title: "Students",
        description: "",
        content: "Students",
        menu_item: "Students",
        //currentUser: req.currentUser,
        error: error,
        _:_,
        moment:moment
    });

}

