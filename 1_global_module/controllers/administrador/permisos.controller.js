let Permisos = require("../../models/administrador/permisos.model")
var moment           = require('moment')
var _                = require('underscore')

var log = console.log

module.exports.test = async(req, res) => {
    res.status(200).send({ status: "success", message: "Welcome To Testing API" })
}

module.exports.PermisosPrincipal = async (req, res) => {
    var error = req.query.e
    res.render('NovusTec/Administrador/Permisos/index', {
        title: "Permisos",
        description: "",
        content: "Permisos",
        menu_item: "Permisos",
        //currentUser: req.currentUser,
        error: error,
        _:_,
        moment:moment
    });

}

/**
 * URL con punto de fin AJAX que obtiene todos los permisos del sistema
 * @memberof ControladorUsuariosAdmin
 * @param {Object} req Objeto request HTTP
 * @param {Object} res Objeto response HTTP
 */
module.exports.ObtenerTodosLosPermisos = async(req, res) => {
    Permisos.ObtenerTodosLosPermisos().then(function(results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

/**
 * URL con punto de fin AJAX que agrega un nuevo permiso del sistema
 * @memberof ControladorUsuariosAdmin
 * @param {Object} req Objeto request HTTP
 * @param {Object} res Objeto response HTTP
 */
module.exports.AgregarPermiso = async(req, res) => {
    console.log('****************')
    console.log(req.body)
    console.log('****************')
        //console.log(req.body.data);
    Permisos.AgregarPermiso(req.body.data).then(function(results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

/**
 * URL con punto de fin AJAX que edita un permiso del sistema
 * @memberof ControladorUsuariosAdmin
 * @param {Object} req Objeto request HTTP
 * @param {Object} res Objeto response HTTP
 */
module.exports.EditarPermiso = async(req, res) => {
    //log("controlador editar")
    //log(req.body.data)
    Permisos.EditarPermiso(req.body.data).then(function(results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

/**
 * URL con punto de fin AJAX que archiva un permiso del sistema
 * @memberof ControladorUsuariosAdmin
 * @param {Object} req Objeto request HTTP
 * @param {Object} res Objeto response HTTP
 */
module.exports.ArchivarPermiso = async(req, res) => {
    Permisos.ArchivarPermiso(req.body.objectId, req.body.seActiva).then(function(results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

/**
 * URL con punto de fin AJAX que elimina un permiso del sistema
 * @memberof ControladorUsuariosAdmin
 * @param {Object} req Objeto request HTTP
 * @param {Object} res Objeto response HTTP
 */
module.exports.EliminarPermiso = async(req, res) => {
    Permisos.EliminarPermiso(req.body.objectId).then(function(results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}