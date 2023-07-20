let EventsModel = require("../../models/administrador/events.model")
var moment           = require('moment')
var _                = require('underscore')

var log = console.log

module.exports.test = async(req, res) => {
    res.status(200).send({ status: "success", message: "Welcome To Testing API" })
}

module.exports.EventosPrincipal = async (req, res) => {
    var error = req.query.e
    res.render('NovusTec/Administrador/Events/index', {
        title: "Events",
        description: "",
        content: "Events",
        menu_item: "Events",
        currentUser: req.currentUser,
        error: error,
        _:_,
        moment:moment
    });

}

module.exports.DataPipeEvents = async (req, res) => {
    EventsModel.DataPipeEvents().then(function (results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

module.exports.ArchivePipeEvent = async (req, res) => {
    EventsModel.ArchivePipeEvent(req.body.idGrupo, req.body.seActiva).then(function (results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}