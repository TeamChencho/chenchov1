let SimulationsModel = require("../../models/alumnos/simulaciones.model.js")
var moment           = require('moment')
var _                = require('underscore')

var log = console.log

module.exports.test = async(req, res) => {
    res.status(200).send({ status: "success", message: "Welcome To Testing API" })
}

module.exports.Principal = async (req, res) => {
    var error = req.query.e
    res.render('NovusTec/Alumnos/Simulaciones/index', {
        title: "Simulations",
        description: "",
        content: "Simulations",
        menu_item: "Simulations",
        currentUser: req.currentUser,
        error: error,
        _:_,
        moment:moment
    });

}

module.exports.GetAllSimulations = async (req, res) => {
    SimulationsModel.GetAllSimulations(req.currentUser).then(function (results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

module.exports.GetAllTeamsMembersInSimulationTeam = async (req, res) => {
    SimulationsModel.GetAllTeamsMembersInSimulationTeam(req.body.objectId,req.body.members).then(function (results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}