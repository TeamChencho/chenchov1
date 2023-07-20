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

Parse._initialize(APP_ID, "", MASTER_KEY)
Parse.serverURL = process.env.SERVER_URL

/**
 * Modelo que maneja la lógica del módulo de Usuarios de Administración del sistema de administración
 * @namespace ModeloUsuariosAdmin
 */

/**
 * Función que permite conexión con controladores y manda llamar la función asíncrona para obtener la cuenta 
 * de cuantos usuarios de administración hay en el sistema
 *
 * @memberof ModeloUsuariosAdmin
 *
 * @returns {Promise<Object>} JSON con el tipo de consulta, los datos de vuelta y el error en caso de existir
 */
exports.ObtenerTotalDeLosModeradores = function() {
    return new Promise(function(resolve, reject) {
        exports.AsyncObtenerTotalDeLosModeradores(function(total, error) {
            if (!error) {
                resolve({ type: "CONTAR", data: total, error: null })
            } else {
                resolve({ type: "CONTAR", data: total, error: error.message })
            }

        })
    })
}

/**
 * Función asíncrona que manda llamar desde la base de datos la cuenta de cuantos usuarios de administración hay en el sistema
 *
 * @memberof ModeloUsuariosAdmin
 *
 * @param {function} callback Función callback para devolver la información
 */
exports.AsyncObtenerTotalDeLosModeradores = async(callback) => {
    var Table = Parse.Object.extend("UsuariosSistema")
    var query = new Parse.Query(Table)
    query.notEqualTo("clave", "NORMAL")
    query.equalTo("exists", true)

    try {
        const results = await query.count()
        callback(results, null)
    } catch (error) {
        //throw new Error(error)
        callback(null, error)
    }
}

/**
 * Función que permite conexión con controladores y manda llamar la función asíncrona para obtener todos 
 * los usuarios de administración que hay en el sistema
 *
 * @memberof ModeloUsuariosAdmin
 * @returns {Promise<Object>} JSON con el tipo de consulta, los datos de vuelta y el error en caso de existir
 */
exports.ObtenerTodosLosModeradores = function() {
    //log("Iniciando promesa")
    return new Promise(function(resolve, reject) {
        
        exports.AsyncObtenerTodosLosModeradores(0, [], function(results, error) {
            //log("Resultados " + results.length)
            if (!error) {
                resolve({ type: "CONSULTA", data: results, error: null })
            } else {
                resolve({ type: "CONSULTA", data: results, error: error.message })
            }

        })
    })
}

/**
 * Función asíncrona recursiva que manda llamar desde la base de datos todos los usuarios de administración que hay en el sistema
 *
 * @memberof ModeloUsuariosAdmin
 *
 * @param {Number} index Índice del nivel de recursión en el que se encuentra la función
 * @param {Array} data Lista de todos los objetos recuperados por toda la recursión
 * @param {function} callback Función callback para devolver la información
 *
 */
exports.AsyncObtenerTodosLosModeradores = async(index, dataArray, callback) => {
    var Table = Parse.Object.extend("UsuariosSistema")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)
    query.ascending("nombre")
    query.skip(index * 1000)
    query.limit(1000)
    query.include("permisoPtr")
    try {
        const results = await query.find()
        if (results.length <= 0) {
            //console.log("Finaliza")
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
                //console.log("Avanzando")
            exports.AsyncObtenerTodosLosModeradores((index + 1), dataArray, callback)
        }
    } catch (error) {
        //throw new Error(error)
        callback(dataArray, error)
    }
}

/**
 * Función que permite conexión con controladores y guarda un nuevo usuario de administración en la base de datos
 *
 * @memberof ModeloUsuariosAdmin
 *
 * @param {Object} data JSON serializado de la forma con el contenido del usuario de administración
 *
 * @returns {Promise<Object>} JSON con el tipo de consulta, los datos de vuelta y el error en caso de existir
 */
exports.AgregarModerador = function(data) {

    return new Promise(function(resolve, reject) {
        var correoElectronico = data["correoElectronico"] ? data["correoElectronico"] : ""
       
        exports.AsyncBuscarUsuarioCorreoElectronico(correoElectronico, function(object, error) {
            if (!error) {
                if (!object) {
                    const Table = Parse.Object.extend("UsuariosSistema")
                    const object = new Table()
                    
                    if (data["nombre"]) {
                        object.set("nombre", data["nombre"])
                    }

                    if (data["apellidoPaterno"]) {
                        object.set("apellidoPaterno", data["apellidoPaterno"])
                    }

                    if (data["apellidoMaterno"]) {
                        object.set("apellidoMaterno", data["apellidoMaterno"])
                    }
                    
                    if (data["contrasena"]) {
                        var SECRET_KEY_USERS = process.env.SECRET_KEY_USERS || TESTING_ENVIRONMENT.SECRET_KEY_USERS
                        var ciphertext = Seguridad.encriptar(data["contrasena"], SECRET_KEY_USERS)
                        object.set("contrasena", ciphertext.toString(CryptoJS.enc.Utf8))
                    }
                       
                    /*if (data[i].name === "permisoPtr") {
                        var Permisos = Parse.Object.extend("Permisos")
                        var pointerToPermisos = new Permisos()
                        pointerToPermisos.id = data[i].value
                        object.set("permisoPtr", pointerToPermisos)
                        object.set("permisoPtr", permisoPtr)
                    }*/
                    
                    object.set("correoElectronico", correoElectronico)
                    object.set("active", true)
                    object.set("exists", true)

                    object.save()
                        .then((object) => {
                            resolve({ type: "AGREGAR", data: object, error: null })
                        }, (error) => {
                            console.log(error)
                            resolve({ type: "AGREGAR", data: null, error: error.message })
                        })
                } else {
                    resolve({ type: "AGREGAR", data: null, error: "El correo electrónico ya está en uso" })
                }
            } else {
                resolve({ type: "AGREGAR", data: null, error: error.message })
            }
        })
    })
}

/**
 * Función que permite conexión con controladores y la función asíncrona para buscar un usuario específico a través de su Id único
 *
 * @memberof ModeloUsuariosAdmin
 *
 * @param {String} objectId Id único de identificación del usuario de administración
 *
 * @returns {Promise<Object>} JSON con el tipo de consulta, los datos de vuelta y el error en caso de existir
 */
exports.BuscarUsuarioAdministracion = function(objectId) {
    //console.log("object ID" + objectId)
    return new Promise(function(resolve, reject) {
        exports.AsyncBuscarUsuarioAdministracion(objectId, function(object, error) {
            if (!error) {
                if (object) {
                    resolve({ type: "BÚSQUEDA", data: object, error: null })
                } else {
                    resolve({ type: "BÚSQUEDA", data: null, error: "No se encontró el usuario" })
                }
            } else {
                resolve({ type: "BÚSQUEDA", data: null, error: error.message })
            }
        })
    })
}

/**
 * Función asíncrona que manda llamar desde la base de datos un usuario de administración que hay en el sistema a través de su Id único
 * @memberof ModeloUsuariosAdmin
 *
 * @param {String} objectId Id único de identificación del usuario de administración
 * @param {function} callback Función callback para devolver la información
 */

exports.AsyncBuscarUsuarioAdministracion = async(objectId, callback) => {
    var Table = Parse.Object.extend("UsuariosSistema")
    var query = new Parse.Query(Table)
    query.equalTo("objectId", objectId)
    query.equalTo("exists", true)
    query.include("permisoPtr")
    try {
        const results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
            //throw new Error(error)
    }
}

/**
 * Función que permite conexión con controladores y la función asíncrona para buscar un usuario específico a través de su correo electrónico
 *
 * @memberof ModeloUsuariosAdmin
 *
 * @param {String} correoElectronico Correo Electrónico del usuario de administración
 *
 * @returns {Promise<Object>} JSON con el tipo de consulta, los datos de vuelta y el error en caso de existir
 */
exports.BuscarUsuarioAdministracionCorreoElectronico = function(correoElectronico) {
    return new Promise(function(resolve, reject) {
        exports.AsyncBuscarUsuarioAdministracionCorreoElectronico(correoElectronico, function(object, error) {
            if (!error) {
                if (object) resolve({ type: "BÚSQUEDA", data: object, error: null })
                else resolve({ type: "BÚSQUEDA", data: null, error: "No se encontró el usuario" })
            } else {
                resolve({ type: "BÚSQUEDA", data: null, error: error.message })
            }
        })
    })
}

/**
 * Función asíncrona que manda llamar desde la base de datos un usuario de administración que hay en el sistema a través de su correo electrónico
 *
 * @memberof ModeloUsuariosAdmin
 *
 * @param {String} correoElectronico Correo electrónico del usuario de administración
 * @param {function} callback Función callback para devolver la información
 *
 */
exports.AsyncBuscarUsuarioAdministracionCorreoElectronico = async(correoElectronico, callback) => {
    var Table = Parse.Object.extend("UsuariosSistema")
    var query = new Parse.Query(Table)
    query.equalTo("correoElectronico", correoElectronico)
    query.equalTo("exists", true)
    query.include("permisoPtr")
    try {
        const results = await query.first()        
        callback(results, null)
    } catch (error) {       
        //throw new Error(error)
        callback(null, error)
    }
}

/**
 * Función que permite conexión con controladores y editar un usuario de administración en la base de datos
 *
 * @memberof ModeloUsuariosAdmin
 * @param {Object} data JSON serializado de la forma con el contenido del usuario de administración
 * @returns {Promise<Object>} JSON con el tipo de consulta, los datos de vuelta y el error en caso de existir
 */
exports.EditarUsuarioAdministracion = function(data) {
    return new Promise(function(resolve, reject) {
        var objectId = data["objectId"] ? data["objectId"] : "" 
        
        exports.AsyncBuscarUsuarioAdministracion(objectId, function(object, error) {
            if (!error) {
                if (object) {
                    if (data["nombre"]) {
                        object.set("nombre", data["nombre"])
                    }
                    
                    if (data["apellidoPaterno"]) {
                        object.set("apellidoPaterno", data["apellidoPaterno"])
                    }
                    
                    //if (data["apellidoMaterno"]) {
                        object.set("apellidoMaterno", data["apellidoMaterno"])
                   //}
                    
                    if (data["correoElectronico"]) {
                        object.set("correoElectronico", data["correoElectronico"])
                    } 
                    
                    if (data["contrasena"]) {
                        if(data["contrasena"] != "") {
                            var SECRET_KEY_USERS = process.env.SECRET_KEY_USERS || TESTING_ENVIRONMENT.SECRET_KEY_USERS
                            var ciphertext = Seguridad.encriptar(data["contrasena"], SECRET_KEY_USERS)
                            object.set("contrasena", ciphertext.toString(CryptoJS.enc.Utf8))
                        }
                    }
                       
                    // if (data[i].name === "permiso") {
                    //     var Permisos = Parse.Object.extend("Permisos")
                    //     var pointerToPermisos = new Permisos()
                    //     pointerToPermisos.id = data[i].value
                    //     object.set("permisoPtr", pointerToPermisos)
                    // }
                    
                    object.save()
                        .then((object) => {
                            //log("After archiving insurance carrier")
                            resolve({ type: "EDITAR", data: object, error: null })
                        }, (error) => {
                            //log('Failed to create new object, with error code: ' + error.message)
                            resolve({ type: "EDITAR", data: null, error: error.message })
                        })
                } else {
                    resolve({ type: "EDITAR", data: null, error: "No se encontró el usuario" })
                }
            } else {
                resolve({ type: "EDITAR", data: null, error: error.message })
            }
        })
    })
}

/**
 * Función que permite conexión con controladores y archivar un usuario de administración en la base de datos
 *
 * @memberof ModeloUsuariosAdmin
 *
 * @param {String} objectId Id único de identificación del usuario de administración
 * @param {String} seActiva Booleano en formato de string {true|false} para verificar si el usuario debe activarse o desactivarse
 *
 * @returns {Promise<Object>} JSON con el tipo de consulta, los datos de vuelta y el error en caso de existir
 */
exports.ArchivarUsuarioAdministracion = function(objectId, seActiva) {
    return new Promise(function(resolve, reject) {
        exports.AsyncBuscarUsuarioAdministracion(objectId, function(object, error) {
            if (!error) {
                if (object) {
                    if (seActiva === "true") {
                        object.set("active", true)
                    } else if (seActiva === "false") {
                        object.set("active", false)
                    }

                    object.save()
                        .then((object) => {
                            resolve({ type: "ARCHIVAR", data: object, error: null })
                        }, (error) => {
                            resolve({ type: "ARCHIVAR", data: null, error: error.message })
                        })
                } else {
                    resolve({ type: "ARCHIVAR", data: null, error: "No se encontró el usuario" })
                }
            } else {
                resolve({ type: "ARCHIVAR", data: null, error: error.message })
            }

        })
    })
}

/**
 * Función que permite conexión con controladores y eliminar un usuario de administración en la base de datos
 *
 * @memberof ModeloUsuariosAdmin
 *
 * @param {String} objectId Id único de identificación del usuario de administración
 *
 * @returns {Promise<Object>} JSON con el tipo de consulta, los datos de vuelta y el error en caso de existir
 */
exports.EliminarUsuarioAdministracion = function(objectId) {
    return new Promise(function(resolve, reject) {
        exports.AsyncBuscarUsuarioAdministracion(objectId, function(object, error) {
            if (!error) {
                if (object) {
                    object.set("active", false)
                    object.set("exists", false)

                    object.save()
                        .then((object) => {
                            resolve({ type: "ELIMINAR", data: object, error: null })
                        }, (error) => {
                            resolve({ type: "ELIMINAR", data: null, error: error.message })
                        })
                } else {
                    resolve({ type: "ELIMINAR", data: null, error: "No se encontró el usuario" })
                }
            } else {
                resolve({ type: "ELIMINAR", data: null, error: error.message })
            }
        })
    })
}

/**
 * Función que permite conexión con controladores y manda llamar la función asíncrona para obtener todos 
 * los permisos que hay en el sistema
 *
 * @memberof ModeloUsuariosAdmin
 * @returns {Promise<Object>} JSON con el tipo de consulta, los datos de vuelta y el error en caso de existir
 */
exports.ObtenerTodosLosPermisos = function() {
    return new Promise(function(resolve, reject) {
        //console.log("Iniciando recursión");
        //recursionInsuranceCarriers(0, data, resolve, reject);
        exports.AsyncObtenerTodosLosPermisos(0, [], function(results, error) {
            if (!error) {
                console.log(" ObtenerTodosLosPermisos en el if de permisos.model")
                resolve({ type: "CONSULTA", data: results, error: null })
            } else {
                console.log(" ObtenerTodosLosPermisos en el else de permisos.model")
                resolve({ type: "CONSULTA", data: results, error: error.message })
            }
        })
    });
}

/**
 * Función asíncrona recursiva que manda llamar desde la base de datos todos los permisos que hay en el sistema
 *
 * @memberof ModeloUsuariosAdmin
 *
 * @param {Number} index Índice del nivel de recursión en el que se encuentra la función
 * @param {Array} data Lista de todos los objetos recuperados por toda la recursión
 * @param {function} callback Función callback para devolver la información
 *
 */
exports.AsyncObtenerTodosLosPermisos = async(index, dataArray, callback) => {
    var Table = Parse.Object.extend("Permisos");
    var query = new Parse.Query(Table);
    query.equalTo("exists", true);
    query.equalTo("nombreEmpresaPermisos", "VISTASADMIN");
    //query.notEqualTo("nombreEmpresaPermisos", "VISTASADMIN")
    //query.equalTo("active", true);
    query.ascending("createdAt")
    query.skip(index * 1000);
    query.limit(1000)
    try {
        const results = await query.find()
        if (results.length <= 0) {
            //log("Finaliza")
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
                //log("Avanzando")
            exports.AsyncObtenerTodosLosPermisos((index + 1), dataArray, callback)
        }
    } catch (error) {
        //throw new Error(error);
        callback(dataArray, error)
    }
}