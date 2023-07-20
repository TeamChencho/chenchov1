var path = require('path')
var fs = require('fs')
var _ = require('underscore')
var Promise = require('promise')
var request = require('request')
var CryptoJS = require("crypto-js")

var log = console.log

let Seguridad = require(path.resolve(__dirname, '../../middlewares/utils/seguridad.util'))

//var FunctionsGeneral = require(path.join(__dirname, '../../functions/general.js'))
var Parse = require('parse/node')

const APP_ID = process.env.APP_ID
const MASTER_KEY = process.env.MASTER_KEY
const SECRET_KEY_USERS = process.env.SECRET_KEY_USERS

Parse._initialize(APP_ID, "", MASTER_KEY)
Parse.serverURL = process.env.SERVER_URL


/**
 * Modelo que maneja la lógica del módulo de Usuarios de Administración del sistema de administración
 * @namespace ModeloPerfilModerador
 */

exports.RevisarContrasena = function (contrasena, usuarioActual) {
    return new Promise(function (resolve, reject) {
        exports.BuscarUsuario(usuarioActual, function (object, error) {
            if (error) {
                return resolve({ type: "BUSCAR", data: null, error: error.message })
            }

            var bytes = Seguridad.desencriptar(object.get("contrasena"), SECRET_KEY_USERS);
            var plaintext = bytes.toString(CryptoJS.enc.Utf8);
            var noEsIgualContrasena = false
            if (contrasena === plaintext) {
                noEsIgualContrasena = true
            }

            resolve({ type: "CONSULTA", data: noEsIgualContrasena, error: null })
        })
    })
}

exports.BuscarUsuario = async (usuarioActual, callback) => {
    var UsuariosSistema = Parse.Object.extend("UsuariosSistema")
    var query = new Parse.Query(UsuariosSistema)

    query.equalTo("objectId", usuarioActual.id)
    query.equalTo("exists", true)

    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.ActualizarContrasena = function (contrasenaNueva, usuarioActual) {
    return new Promise(function (resolve, reject) {
        exports.BuscarUsuario(usuarioActual, function (object, error) {

            if (error) {
                return resolve({ type: "ACTUALIZAR", data: null, error: error.message })
            }

            var SECRET_KEY_USERS = process.env.SECRET_KEY_USERS || TESTING_ENVIRONMENT.SECRET_KEY_USERS
            var ciphertext = Seguridad.encriptar(contrasenaNueva, SECRET_KEY_USERS)

            object.set("contrasena", ciphertext.toString(CryptoJS.enc.Utf8))

            object.save().then((usuario) => {
                resolve({ type: "ACTUALIZAR", data: usuario, error: null })
            }, (error) => {
                resolve({ type: "ACTUALIZAR", data: null, error: error.message })
            })

        })
    })
}

exports.ActualizarColorRobot = function (colorRobot, usuarioActual) {
    return new Promise(function (resolve, reject) {
        exports.BuscarUsuario(usuarioActual, function (object, error) {

            if (error) {
                return resolve({ type: "ACTUALIZAR", data: null, error: error.message })
            }

            object.set("colorRobot", colorRobot)

            object.save().then((usuario) => {
                resolve({ type: "ACTUALIZAR", data: usuario, error: null })
            }, (error) => {
                resolve({ type: "ACTUALIZAR", data: null, error: error.message })
            })

        })
    })
}