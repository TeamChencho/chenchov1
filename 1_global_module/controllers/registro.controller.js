const ModeloRegistro = require('../models/registro.model')
var log = console.log

/**
 * Controlador que maneja la lógica del módulo de Acceso del sistema de administración
 * @namespace ControladorRegistro
 */

/**
 * Carga la url de prueba como test de verificación de la clase
 * @memberof ControladorRegistro
 * @param {Object} req Objeto request HTTP
 * @param {Object} res Objeto response HTTP
 */
module.exports.test = async (req, res) => {
    res.status(200).send({ status: "success", message: "Welcome To Testing API" })
}

/**
 * Carga la url y permite ingresar a la vista de registro
 * @memberof ControladorRegistro
 * @param {Object} req Objeto request HTTP
 * @param {Object} res Objeto response HTTP
 */
module.exports.AccesoPrincipal = async (req, res) => {
    var error = req.query.e
    if (req.cookies.type || req.cookies.usr_id) {
        if (req.cookies.permission == "SUPERADMIN") {
            res.redirect("/administrador")
        } else if (req.cookies.permission == "MODERADOR") {
            res.redirect("/advisers")
        } else if (req.cookies.permission == "ALUMNO") {
            res.redirect("/alumnos")
        }

    } else {
        res.render('NovusTec/Register/index', {
            title: "Registrar Usuario",
            description: "",
            content: "Registrar Usuario",
            error: error,
            environment: process.env.APP_NAME
        })
    }
}

/**
 * URL con punto de fin AJAX que verifica un usuario en el sistema
 * @memberof ControladorUsuariosAdmin
 * @param {Object} req Objeto request HTTP
 * @param {Object} res Objeto response HTTP
 */
module.exports.VerificarUsuario = async (req, res) => {
    ModeloRegistro.VerificarUsuario(req.body.correo).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }

        res.status(200).json({ code: 200, msg: "OK", data: results.data, usuarioSistema: results.usuarioSistema, existeContrasena: results.existeContrasena })
    })
}

/**
 * URL con punto de fin AJAX que agrega una contraseña a un usuario
 * @memberof ControladorUsuariosAdmin
 * @param {Object} req Objeto request HTTP
 * @param {Object} res Objeto response HTTP
 */
module.exports.AgregarContrasena = async (req, res) => {
    ModeloRegistro.AgregarContrasena(req.body).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

/**
 * URL con punto de fin AJAX que agrega una solicitud al sistema
 * @memberof ControladorUsuariosAdmin
 * @param {Object} req Objeto request HTTP
 * @param {Object} res Objeto response HTTP
 */
module.exports.EnviarSolicitud=async (req, res) => {
    ModeloRegistro.EnviarSolicitud(req.body).then(function(results){
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }

        res.status(200).json({ code: 200, msg: "OK", data: results.data})
    })
}