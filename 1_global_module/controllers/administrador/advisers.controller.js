const ModeloAdministrador = require("../../models/administrador/usuarios_administracion.model")
const Bitacora = require("../../models/administrador/bitacora.model")
var moment = require('moment')
var _ = require('underscore')

var log = console.log

module.exports.test = async (req, res) => {
    res.status(200).send({ status: "success", message: "Welcome To Testing API" })
}

module.exports.AdvisersPrincipal = async (req, res) => {
    var error = req.query.e
    res.render('NovusTec/Administrador/Advisers/index', {
        title: "Advisers",
        description: "",
        content: "Advisers",
        menu_item: "Advisers",
        currentUser: req.currentUser,
        error: error,
        _: _,
        moment: moment
    });
}

module.exports.ObtenerDatosModeradores = async (req, res) => {
    ModeloAdministrador.ObtenerTodosLosUsuariosAdministracion("MODERADOR").then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.EliminarUsuarioModerador = async (req, res) => {
    ModeloAdministrador.EliminarUsuarioAdministracion(req.body.objectId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ArchivarUsuarioModerador = async (req, res) => {
    ModeloAdministrador.ArchivarUsuarioAdministracion(req.body.objectId, req.body.seActiva).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.EditarUsuarioModerador = async (req, res) => {
    ModeloAdministrador.EditarUsuarioAdministracion(req.body).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.AgregarUsuarioModerador = async (req, res) => {
    var fullUrl = req.protocol + '://' + req.get('host') + '/acceso';
    ModeloAdministrador.AgregarUsuarioAdministracion(req.body,true,fullUrl).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.UsuarioHistorialPrincipal = async (req, res) => {
    var error = req.query.e
    ModeloAdministrador.BuscarUsuarioAdministracion(req.params.objectId).then(function(results) {
        res.render('NovusTec/Administrador/Advisers/historial', {
            title: "Adviser History",
            description: "",
            content: "Adviser History",
            menu_item: "Advisers",
            currentUser: req.currentUser,
            user: results.data,
            error: error
        });
    })
}

module.exports.ObtenerTodasLasBitacorasDeUnUsuario = async (req, res) => {
    Bitacora.ObtenerTodasLasBitacorasDeUnUsuario(req.query.user).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}