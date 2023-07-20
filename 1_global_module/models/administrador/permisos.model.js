var path = require('path')
var fs = require('fs')
var _ = require('underscore')
var Promise = require('promise')
var request = require('request')

var log = console.log

//var FunctionsGeneral = require(path.join(__dirname, '../../functions/general.js'));

var Parse = require('parse/node');
const { object, functions } = require('underscore')

const APP_ID = process.env.APP_ID 
const MASTER_KEY = process.env.MASTER_KEY

Parse._initialize(APP_ID, "", MASTER_KEY)
Parse.serverURL = process.env.PUBLIC_SERVER_URL

exports.ObtenerTodosLosPermisos = function (req, res) {
    return new Promise(function (resolve, reject) {
        log("Iniciando recursión");
        //recursionInsuranceCarriers(0, data, resolve, reject);
        exports.AsyncObtenerTodosLosPermisos(0, [], function (results, error) {
            log("fINALIZNADO")
            if (!error) {
                resolve({ type: "CONSULTA", data: results, error: null })
            } else {
                resolve({ type: "CONSULTA", data: results, error: error.message })
            }
        })
    });
}

exports.AsyncObtenerTodosLosPermisos = async (index, dataArray, callback) => {
    var Table = Parse.Object.extend("Permisos");
    var query = new Parse.Query(Table);
    query.equalTo("exists", true);
    query.notEqualTo("tipo", "SOLO_SISTEMA");
    query.equalTo("active", true);
    query.equalTo("EXISTS", true);
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


/**
 * Función que permite conexión con controladores y guarda un nuevo permiso en la base de datos
 *
 * @memberof ModeloPermisos
 *
 * @param {Object} data JSON serializado de los datos con el contenido del permiso
 *
 * @returns {Promise<Object>} JSON con el tipo de consulta, los datos de vuelta y el error en caso de existir
 */
exports.AgregarPermiso = function (data) {
    console.log(data)
    return new Promise(function (resolve, reject) {
        const Table = Parse.Object.extend("Permisos")
        const object = new Table()
        var arrayPermisos = []
        var arrayUsurAdmin = []
        var arrayEmpresas = []
        var arrayDirectorios = []
        var arrayPagos = []
        var arraySoportes = []
        var arrayEstadisticas = []
        var arrayLandingPages = []
        var nombre = ""
        var clave = ""
        for (let i = 0; i < data.length; i++) {
            if (data[i].name === "nombre") {
                nombre = data[i].value
                clave = nombre.replace(/ /g, "").toUpperCase()
                object.set("nombre", nombre)
            }
            if (data[i].name === "permisos") {
                var arraypermiso = {
                    role: clave,
                    resource: 'PERMISOS',
                    action: data[i].value,
                    attributes: ["*"]
                }
                arrayPermisos.push(arraypermiso)
                object.set("permisos", arrayPermisos)
            }
            if (data[i].name === "usuariosAdministrador") {
                var arrayUrs_admin = {
                    role: clave,
                    resource: 'USRADMIN',
                    action: data[i].value,
                    attributes: ["*"]
                }
                arrayUsurAdmin.push(arrayUrs_admin)
                object.set("usuariosAdministrador", arrayUsurAdmin)
            }
            if (data[i].name === "empresa") {
                var arrayEmpresa = {
                    role: clave,
                    resource: "EMPRESA",
                    action: data[i].value,
                    attributes: ["*"]
                }
                arrayEmpresas.push(arrayEmpresa)
                object.set("empresa", arrayEmpresas)
            }
            if (data[i].name === "directorios") {
                var arrayDirect = {
                    role: clave,
                    resource: "DIRECTORIOS",
                    action: data[i].value,
                    attributes: ["*"]
                }
                arrayDirectorios.push(arrayDirect)
                object.set("directorios", arrayDirectorios)
            }
            if (data[i].name === "pagos") {
                var arrayPago = {
                    role: clave,
                    resource: "PAGOS",
                    action: data[i].value,
                    attributes: ["*"]
                }
                arrayPagos.push(arrayPago)
                object.set("pagos", arrayPagos)
            }
            if (data[i].name === "soporte") {
                var arraySoporte = {
                    role: clave,
                    resource: "SOPORTE",
                    action: data[i].value,
                    attributes: ["*"]
                }
                arraySoportes.push(arraySoporte)
                object.set("soporte", arraySoportes)
            }
            if (data[i].name === "estadisticas") {
                var arrayEstadistc = {
                    role: clave,
                    resource: "ESTADISTICAS",
                    action: data[i].value,
                    attributes: ["*"]
                }
                arrayEstadisticas.push(arrayEstadistc)
                object.set("estadisticas", arrayEstadisticas)
            }
            if (data[i].name === "landingPage") {
                var arrayLandingPage = {
                    role: clave,
                    resource: "LANDINGPAGE",
                    action: data[i].value,
                    attributes: ["*"]
                }
                arrayLandingPages.push(arrayLandingPage)
                object.set("landingPage", arrayLandingPages)
            }
        }
        object.set("nombreEmpresaPermisos", "VISTASADMIN")
        object.set("clave", clave)
        object.set("active", true)
        object.set("exists", true)
        object.set("renombrable", true)
        object.set("editable", true)
        object.save()
            .then((object) => {
                resolve({ type: "AGREGAR", data: object, error: null })
            }, (error) => {
                resolve({ type: "AGREGAR", data: null, error: error.message })
            })
    })
}
/**
 * Función que permite la conexión con controladores y la función asíncrona para buscar un permisos en específica a través de su Id único de registro
 *
 * @memberof ModeloPermisos
 *
 * @param {String} objectId Id único de identificación de la publicidad
 * 
 * @returns {Promise<Object>} JSON con el tipo de consulta, los datos de vuelta y el error en caso de existir
 */
exports.BuscarPermiso = function (objectId) {
    return new Promise(function (resolve, reject) {
        exports.AsyncBuscarPermiso(objectId, function (object, error) {
            if (!error) {
                if (object) resolve({ type: "BÚSQUEDA", data: object, error: null })
                else resolve({ type: "BÚSQUEDA", data: null, error: "No se encontro el permiso" })
            } else {
                resolve({ type: "BÚSQUEDA", data: null, error: error.message })
            }
        })
    })
}
/**
 * Función asíncrona que manda llamar desde la base de datos un permiso que hay en el sistema a través de su Id único
 *
 * @memberof ModeloPermisos
 *
 * @param {String} objectId Id único de identificación del permiso
 *
 * @returns {Object} Objeto tipo ParseObject con el permiso encontrado
 */
exports.AsyncBuscarPermiso = async (objectId, callback) => {
    var Table = Parse.Object.extend("Permisos")
    var query = new Parse.Query(Table)
    query.equalTo("objectId", objectId)
    query.equalTo("exists", true)
    try {
        const results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}
/**
 * Función que permite conexión con controladores y editar un permiso en la base de datos
 *
 * @memberof ModeloPermisos
 * @param {Object} data JSON serializado de la forma con el contenido del permiso
 * @returns {Promise<Object>} JSON con el tipo de consulta, los datos de vuelta y el error en caso de existir
 */
exports.EditarPermiso = function (data) {
    console.log(data)
    return new Promise(function (resolve, reject) {
        var objectId = ""
        for (let i = 0; i < data.length; i++) {
            if (data[i].name === "objectId") {
                objectId = data[i].value
            }
        }
        exports.AsyncBuscarPermiso(objectId, function (object, error) {
            if (!error) {
                if (object) {
                    var arrayPermisos = []
                    var arrayUsurAdmin = []
                    var arrayEmpresas = []
                    var arrayDirectorios = []
                    var arrayPagos = []
                    var arraySoportes = []
                    var arrayEstadisticas = []
                    var arrayLandingPages = []
                    var nombre = ""
                    var clave = ""
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].name === "nombre") {
                            nombre = data[i].value
                            clave = nombre.replace(/ /g, "").toUpperCase()
                            object.set("nombre", nombre)
                        }
                        if (data[i].name === "permisos") {
                            if (data[i].value !== "") {
                                var arraypermiso = {
                                    role: clave,
                                    resource: 'PERMISOS',
                                    action: data[i].value,
                                    attributes: ["*"]
                                }
                                arrayPermisos.push(arraypermiso)
                                object.set("permisos", arrayPermisos)
                            } else {
                                object.set("permisos", [])
                            }
                        }
                        if (data[i].name === "usuariosAdministrador") {
                            if (data[i].value !== "") {
                                var arrayUrsAdmin = {
                                    role: clave,
                                    resource: 'USRADMIN',
                                    action: data[i].value,
                                    attributes: ["*"]
                                }
                                arrayUsurAdmin.push(arrayUrsAdmin)
                                object.set("usuariosAdministrador", arrayUsurAdmin)
                            } else {
                                object.set("usuariosAdministrador", [])
                            }
                        }
                        if (data[i].name === "empresa") {
                            if (data[i].value !== "") {
                                var arrayEmpresa = {
                                    role: clave,
                                    resource: "EMPRESA",
                                    action: data[i].value,
                                    attributes: ["*"]
                                }
                                arrayEmpresas.push(arrayEmpresa)
                                object.set("empresa", arrayEmpresas)
                            } else {
                                object.set("empresa", [])
                            }
                        }
                        if (data[i].name === "directorios") {
                            if (data[i].value !== "") {
                                var arrayDirectorio = {
                                    role: clave,
                                    resource: "DIRECTORIOS",
                                    action: data[i].value,
                                    attributes: ["*"]
                                }
                                arrayDirectorios.push(arrayDirectorio)
                                object.set("directorios", arrayDirectorios)
                            } else {
                                object.set("directorios", [])
                            }
                        }
                        if (data[i].name === "pagos") {
                            if (data[i].value !== "") {
                                var arrayPago = {
                                    role: clave,
                                    resource: "PAGOS",
                                    action: data[i].value,
                                    attributes: ["*"]
                                }
                                arrayPagos.push(arrayPago)
                                object.set("pagos", arrayPagos)
                            } else {
                                object.set("pagos", [])
                            }
                        }
                        if (data[i].name === "soporte") {
                            if (data[i].value !== "") {
                                var arraySoporte = {
                                    role: clave,
                                    resource: "SOPORTE",
                                    action: data[i].value,
                                    attributes: ["*"]
                                }
                                arraySoportes.push(arraySoporte)
                                object.set("soporte", arraySoportes)
                            } else {
                                object.set("soporte", [])
                            }
                        }
                        if (data[i].name === "estadisticas") {
                            if (data[i].value !== "") {
                                var arrayEstadistica = {
                                    role: clave,
                                    resource: "ESTADISTICAS",
                                    action: data[i].value,
                                    attributes: ["*"]
                                }
                                arrayEstadisticas.push(arrayEstadistica)
                                object.set("estadisticas", arrayEstadisticas)
                            } else {
                                object.set("estadisticas", [])
                            }
                        }
                        if (data[i].name === "landingPage") {
                            if (data[i].value !== "") {
                                var arrayLandingPage = {
                                    role: clave,
                                    resource: "LANDINGPAGE",
                                    action: data[i].value,
                                    attributes: ["*"]
                                }
                                arrayLandingPages.push(arrayLandingPage)
                                object.set("landingPage", arrayLandingPages)
                            } else {
                                object.set("landingPage", [])
                            }
                        }
                    }
                    object.save()
                        .then((object) => {
                            resolve({ type: "EDITAR", data: object, error: null })
                        }, (error) => {
                            resolve({ type: "EDITAR", data: null, error: error.message })
                        })
                } else {
                    resolve({ type: "EDITAR", data: null, error: "No se encontró el permiso" })
                }
            } else {
                resolve({ type: "EDITAR", data: null, error: error.message })
            }
        })

    })
}
/**
 * Función que permite conexión con controladores y archivar un permiso de la base de datos
 *
 * @memberof ModeloPermisos
 *
 * @param {String} objectId Id único de identificación del permiso
 * @param {String} seActiva Booleano en formato de string {true|false} para verificar si el permiso debe activarse o desactivarse
 *
 * @returns {Promise<Object>} JSON con el tipo de consulta, los datos de vuelta y el error en caso de existir
 */
exports.ArchivarPermiso = function (objectId, seActiva) {
    return new Promise(function (resolve, reject) {
        exports.AsyncBuscarPermiso(objectId, function (object, error) {
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
                    resolve({ type: "ARCHIVAR", data: null, error: "No se econtró el permiso" })
                }
            } else {
                resolve({ type: "ARCHIVAR", data: null, error: error.message })
            }
        })
    })
}
/**
 * Función que permite conexión con controladores y eliminar un permiso en la base de datos
 *
 * @memberof ModeloPermisos
 *
 * @param {String} objectId Id único de identificación de permiso
 *
 * @returns {Promise<Object>} JSON con el tipo de consulta, los datos de vuelta y el error en caso de existir
 */
exports.EliminarPermiso = function (objectId) {
    return new Promise(function (resolve, reject) {
        exports.AsyncBuscarPermiso(objectId, function (object, error) {
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
                    resolve({ type: "ELIMINAR", data: null, error: "No se encontró el permiso" })
                }
            } else {
                resolve({ type: "ELIMINAR", data: null, error: error.message })
            }
        })
    })
}

/*
exports.AgregarPermiso = function(data) {
        return new Promise(function(resolve, reject) {
            const Table = Parse.Object.extend("Permisos")
            const object = new Table()
            var arrayPermisos = []
            var arrayUsurAdmin = []
            var arrayNotifs = []
            var arrayEstadisticas = []
            var arrayPanico = []
            var arrayUserAplicacion = []
            var arrayRecompensas = []
            var arrayPublicidad = []
            var arrayFAQS = []
            var nombre = ""
            var clave = ""
            for (let i = 0; i < data.length; i++) {
                if (data[i].name === "nombre") {
                    nombre = data[i].value
                    clave = nombre.replace(/ /g, "").toUpperCase()
                    object.set("nombre", nombre)
                }
                if (data[i].name === "permisos") {
                    var arraypermiso = {
                        role: clave,
                        resource: 'PERMISOS',
                        action: data[i].value,
                        attributes: ["*"]
                    }
                    arrayPermisos.push(arraypermiso)
                    object.set("permisos", arrayPermisos)
                }
                if (data[i].name === "usuarios_Administrador") {
                    var arrayUrs_admin = {
                        role: clave,
                        resource: 'USRADMIN',
                        action: data[i].value,
                        attributes: ["*"]
                    }
                    arrayUsurAdmin.push(arrayUrs_admin)
                    object.set("usuariosAdministrador", arrayUsurAdmin)
                }
                if (data[i].name === "notificaciones") {
                    var arrayNotif = {
                        role: clave,
                        resource: "NOTIF",
                        action: data[i].value,
                        attributes: ["*"]
                    }
                    arrayNotifs.push(arrayNotif)
                    object.set("notificaciones", arrayNotifs)
                }
                if (data[i].name === "estadisticas") {
                    var arrayEstad = {
                        role: clave,
                        resource: "ESTAD",
                        action: data[i].value,
                        attributes: ["*"]
                    }
                    arrayEstadisticas.push(arrayEstad)
                    object.set("estadisticas", arrayEstadisticas)
                }
                if (data[i].name === "panico") {
                    var arrayPanic = {
                        role: clave,
                        resource: "PANICO",
                        action: data[i].value,
                        attributes: ["*"]
                    }
                    arrayPanico.push(arrayPanic)
                    object.set("panico", arrayPanico)
                }
                if (data[i].name === "usuariosAplicacion") {
                    var arrayUserApp = {
                        role: clave,
                        resource: "USRAPP",
                        action: data[i].value,
                        attributes: ["*"]
                    }
                    arrayUserAplicacion.push(arrayUserApp)
                    object.set("usuariosAplicacion", arrayUserAplicacion)
                }
                if (data[i].name === "recompensas") {
                    var arrayRecomp = {
                        role: clave,
                        resource: "RECOMP",
                        action: data[i].value,
                        attributes: ["*"]
                    }
                    arrayRecompensas.push(arrayRecomp)
                    object.set("recompensas", arrayRecompensas)
                }
                if (data[i].name === "publicidad") {
                    var arrayPublic = {
                        role: clave,
                        resource: "PUBLICIDAD",
                        action: data[i].value,
                        attributes: ["*"]
                    }
                    arrayPublicidad.push(arrayPublic)
                    object.set("publicidad", arrayPublicidad)
                }
                if (data[i].name === "faqs") {
                    var arrayFaqs = {
                        role: clave,
                        resource: "FAQS",
                        action: data[i].value,
                        attributes: ["*"]
                    }
                    arrayFAQS.push(arrayFaqs)
                    object.set("faqs", arrayFAQS)
                }
            }
            object.set("clave", clave)
            object.set("active", true)
            object.set("exists", true)
            object.set("renombrable", true)
            object.set("editable", true)
            object.save()
                .then((object) => {
                    resolve({ type: "AGREGAR", data: object, error: null })
                }, (error) => {
                    resolve({ type: "AGREGAR", data: null, error: error.message })
                })
        })
    }
 */