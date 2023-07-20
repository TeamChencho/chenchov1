let UsuariosAdmin = require("../../models/administrador/usuarios_administracion.model")
// let Permisos = require("../../models/administrador/permisos.model")
//let Bitacora = require("../../models/administrador/bitacora.model")
var moment           = require('moment')
var _                = require('underscore')

var log = console.log

module.exports.test = async(req, res) => {

    res.status(200).send({ title: "success", message: "Welcome To Testing API" })
}

module.exports.UsuariosAdministracionPrincipal = async(req, res) => {
    var error = req.query.e
    res.render('NovusTec/Administrador/Usuarios/index', {
        title: "Usuarios Administración",
        description: "",
        content: "Usuarios Administración",
        menu_item: "UsuariosAdmin",
        //currentUser: req.currentUser,
        error: error,
        permisos: [],
        _:_,
        moment:moment
    });
    /*Permisos.ObtenerTodosLosPermisos().then(function(results) {
        if (!results.error && results.data) {
            var permisos = results.data
            res.render('appCita/Administrador/Usuarios/index', {
                title: "Usuarios Administración",
                description: "",
                content: "Usuarios Administración",
                menu_item: "UsuariosAdmin",
                currentUser: req.currentUser,
                error: error,
                permisos: permisos,
                _:_,
                moment:moment
            });
        } else {
            log("en el else Usuarios_Admin en usuarios_administracion.controller")
            res.render('appCita/Administrador/Usuarios/index', {
                title: "Usuarios Administración",
                description: "",
                content: "Usuarios Administración",
                menu_item: "UsuariosAdmin",
                currentUser: req.currentUser,
                error: error,
                permisos: null,
                _:_,
                moment:moment
            });
        }
    })*/
}

/**
 * URL con punto de fin AJAX que obtiene todos los usuarios de administración del sistema
 * @memberof ControladorUsuariosAdmin
 * @param {Object} req Objeto request HTTP
 * @param {Object} res Objeto response HTTP
 */
module.exports.ObtenerTodosLosUsuariosAdministracion = async(req, res) => {
    UsuariosAdmin.ObtenerTodosLosUsuariosAdministracion().then(function(results) {
        log(results)
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

/**
 * URL con punto de fin AJAX que agrega un nuevo usuario de administración del sistema
 * @memberof ControladorUsuariosAdmin
 * @param {Object} req Objeto request HTTP
 * @param {Object} res Objeto response HTTP
 */
module.exports.AgregarUsuarioAdministracion = async(req, res) => {
    var fullUrl = req.protocol + '://' + req.get('host') + '/acceso';
    UsuariosAdmin.AgregarUsuarioAdministracion(req.body, false, fullUrl).then(function(results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

/**
 * URL con punto de fin AJAX que edita a un usuario de administración del sistema
 * @memberof ControladorUsuariosAdmin
 * @param {Object} req Objeto request HTTP
 * @param {Object} res Objeto response HTTP
 */
module.exports.EditarUsuarioAdministracion = async(req, res) => {
    UsuariosAdmin.EditarUsuarioAdministracion(req.body).then(function(results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

/**
 * URL con punto de fin AJAX que archiva a un usuario de administración del sistema
 * @memberof ControladorUsuariosAdmin
 * @param {Object} req Objeto request HTTP
 * @param {Object} res Objeto response HTTP
 */
module.exports.ArchivarUsuarioAdministracion = async(req, res) => {
    //console.log("iiiiiiiiiiiii")
    //console.log(req.body)
    UsuariosAdmin.ArchivarUsuarioAdministracion(req.body.objectId, req.body.seActiva).then(function(results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

/**
 * URL con punto de fin AJAX que elimina a un usuario de administración del sistema
 * @memberof ControladorUsuariosAdmin
 * @param {Object} req Objeto request HTTP
 * @param {Object} res Objeto response HTTP
 */
module.exports.EliminarUsuarioAdministracion = async(req, res) => {
    UsuariosAdmin.EliminarUsuarioAdministracion(req.body.objectId).then(function(results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

/**
 * URL con punto de fin AJAX que obtiene todos los permisos de administración del sistema
 * @memberof ControladorUsuariosAdmin
 * @param {Object} req Objeto request HTTP
 * @param {Object} res Objeto response HTTP
 */
module.exports.ObtenerPermisosAdministrador = async(req, res) => {
    UsuariosAdmin.ObtenerTodosLosPermisos().then(function(results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}