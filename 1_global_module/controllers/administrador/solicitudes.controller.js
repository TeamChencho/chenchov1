var Solicitudes = require("../../models/administrador/solicitudes.models")
var moment = require('moment')
var _ = require('underscore')

var log = console.log

module.exports.test = async (req, res) => {
    res.status(200).send({ status: "success", message: "Welcome To Testing API" })
}

module.exports.SolicitudesPrincipal = async (req, res) => {
    var error = req.query.e
    res.render('NovusTec/Administrador/Solicitudes/index', {
        title: "Solicitudes",
        description: "",
        content: "Solicitudes",
        menu_item: "Solicitudes",
        currentUser: req.currentUser,
        //moderadores: results.data,
        error: error,
        permisos: [],
        _: _,
        moment: moment
    });
}

module.exports.ObtenerTodasLasSolicitudes = async (req, res) => {
    Solicitudes.ObtenerTodasLasSolicitudes().then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.EliminarSolicitud = async (req, res) => {
    Solicitudes.EliminarSolicitud(req.body.idSolicitud).then(function (results) {
        if(results.error){
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data})
    })
}

module.exports.SolicitudArchivar=async (req, res) => {
    Solicitudes.SolicitudArchivar(req.body.idSolicitud, req.body.seActiva).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.SolicitudCambiarStatus= async (req, res) => {
    Solicitudes.SolicitudCambiarStatus(req.body).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}