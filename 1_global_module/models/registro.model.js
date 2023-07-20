var path = require('path')
var fs = require('fs')
var _ = require('underscore')
var Promise = require('promise')
var request = require('request')
var moment = require('moment')
var CryptoJS = require("crypto-js")
let Seguridad = require(path.resolve(__dirname, '../middlewares/utils/seguridad.util'))

var log = console.log

//var FunctionsGeneral = require(path.join(__dirname, '../../functions/general.js'));
var Parse = require('parse/node');

const APP_ID = process.env.APP_ID
const MASTER_KEY = process.env.MASTER_KEY
const SECRET_KEY_USERS = process.env.SECRET_KEY_USERS

Parse._initialize(APP_ID, "", MASTER_KEY)
Parse.serverURL = process.env.PUBLIC_SERVER_URL

/**
 * Función que permite realizar la verificación de un usuario si existe en el sistema o no, al igual que si tiene contraseña 
 * @memberof ModeloRegsitro
 * @param {correo} correo Identificador de un usuario por correo electrónico 
 * @returns {Promise<Object>} JSON con el tipo de consulta, los datos de vuelta y el error en caso de existir
 */
exports.VerificarUsuario = function (correo) {
    return new Promise(function (resolve, reject) {
        exports.AsyncBuscarCorreo(correo, function (usuarioEncontrado, error) {

            if (!usuarioEncontrado) {
                return resolve({ type: "CONSULTA", data: usuarioEncontrado, usuarioSistema: false, existeContrasena: false })
            }

            if (usuarioEncontrado.get("contrasena") == undefined) {
                return resolve({ type: "CONSULTA", data: usuarioEncontrado, usuarioSistema: true, existeContrasena: false })
            }

            resolve({ type: "CONSULTA", data: usuarioEncontrado, usuarioSistema: true, existeContrasena: true })
        })
    })
}

/**
 * Función asíncrona que permite la obtención del usuario a buscar por correo
 * @memberof ModeloRegsitro
 * @param {correo} correo Identificador de un usuario por correo electrónico 
 * @param {function} callback Función callback para devolver la información
 * 
 */
exports.AsyncBuscarCorreo = async (correo, callback) => {
    var Usuario = Parse.Object.extend("UsuariosSistema")
    var query = new Parse.Query(Usuario)

    query.equalTo("correoElectronico", correo)
    query.equalTo("exists", true)

    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }

}

/**
 * Función que permite agregar la contraseña al usuario que existe en el sistema, pero no tiene la contraseña
 * @memberof ModeloRegsitro
 * @param {data} data Información de la contraseña que se agregara al usuario
 * @returns {Promise<Object>} JSON con el tipo de consulta, los datos de vuelta y el error en caso de existir
 */
exports.AgregarContrasena = function (data) {
    return new Promise(function (resolve, reject) {
        exports.AsyncBuscarUsuario(data.idUsuario, function (usuarioEncontrado, error) {
            if (!usuarioEncontrado) {
                resolve({ type: "BÚSQUEDA", data: null, error: error.message })
            }

            var SECRET_KEY_USERS = process.env.SECRET_KEY_USERS || TESTING_ENVIRONMENT.SECRET_KEY_USERS
            var ciphertext = Seguridad.encriptar(data["contrasena"], SECRET_KEY_USERS)

            usuarioEncontrado.set("contrasena", ciphertext.toString(CryptoJS.enc.Utf8))

            usuarioEncontrado.save().then((usuarioEditado) => {
                resolve({ type: "BÚSQUEDA", data: usuarioEditado, error: null })
            }, (error) => {
                resolve({ type: "BÚSQUEDA", data: null, error: error.message })
            })
        })
    })
}

/**
 * Función asíncrona que permite la obtención del usuario por su identificador objectId
 * @memberof ModeloRegsitro
 * @param {objectId} idUsuario Identificador de un usuario
 * @param {function} callback Función callback para devolver la información
 * 
 */
exports.AsyncBuscarUsuario = async (idUsuario, callback) => {
    var Usuario = Parse.Object.extend("UsuariosSistema")
    var query = new Parse.Query(Usuario)

    query.equalTo("objectId", idUsuario)
    query.equalTo("exists", true)

    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

/**
 * Función que permite agregar a la base de datos una solicitud de ingreso al sistema
 * @memberof ModeloRegsitro
 * @param {data} data Información de la solicitud
 * @returns {Promise<Object>} JSON con el tipo de consulta, los datos de vuelta y el error en caso de existir
 */
exports.EnviarSolicitud = function (data) {
    return new Promise(function (resolve, reject) {
        const Table = Parse.Object.extend("SolicitudesUsuarios")
        const object = new Table()

        if (data["nombre"]) {
            object.set("nombre", data["nombre"])
        }

        if (data["apellidoP"]) {
            object.set("apellidoPaterno", data["apellidoP"])
        }

        if (data["apellidoM"]) {
            object.set("apellidoMaterno", data["apellidoM"])
        }

        if (data["telefono"]) {
            object.set("telefono", data["telefono"])
        }

        if (data["matricula"]) {
            object.set("matricula", data["matricula"])
        }

        if (data["correo"]) {
            object.set("correoElectronico", data["correo"])
        }

        if (data["nombreUniversidad"]) {
            object.set("nombreUniversidad", data["nombreUniversidad"])
        }

        if (data["numeroAlumnos"]) {
            object.set("numeroAlumnos", data["numeroAlumnos"])
        }

        if (data["comentario"]) {
            object.set("comentario", data["comentario"])
        }

        object.set("exists",true)
        object.set("active",true)
        object.set("status","Pending")

        object.save().then((solicitudAgregada) => {
            resolve({ type: "AGREGAR", data: solicitudAgregada, error: null })
        }, (error) => {
            resolve({ type: "AGREGAR", data: null, error: error.message })
        })
    })
}
