var ModelProfile = require('../../models/advisers/profile.model')
var moment = require('moment')
var _ = require('underscore')
var log = console.log

module.exports.test = async (req, res) => {
    res.status(200).send({ status: "success", message: "Welcome To Testing API" })
}

module.exports.ProfilePrincipal = async (req, res) => {
    var error = req.query.e
    res.render('NovusTec/Alumnos/Profile/index', {
        title: "Profile",
        description: "",
        content: "Profile",
        menu_item: "Profile",
        currentUser: req.currentUser,
        error: error,
        permisos: [],
        _: _,
        moment: moment
    })

}

module.exports.RevisarContrasena = async (req, res) => {
    ModelProfile.RevisarContrasena(req.body.contraAnterior, req.currentUser).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }

        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ActualizarContrasena = async (req, res) => {
    ModelProfile.ActualizarContrasena(req.body.nuevaContrasena, req.currentUser).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ActualizarColorRobot = async (req, res) => {
    ModelProfile.ActualizarColorRobot(req.body.colorRobot, req.currentUser).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}