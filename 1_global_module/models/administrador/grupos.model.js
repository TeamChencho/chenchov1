var path = require('path')
var fs = require('fs')
var _ = require('underscore')
var Promise = require('promise')
var request = require('request')
var CryptoJS = require("crypto-js")
var csvparser = require("csv-parser")
var csv = require('csvtojson')
var sedEmails = require('../../functionalities/emails.functionality')
if(process.platform !== "win32"){
    var detectCharacterEncoding = require('detect-character-encoding');    
}
var iconv = require('iconv-lite');

var log = console.log

let Seguridad = require(path.resolve(__dirname, '../../middlewares/utils/seguridad.util'))

var Parse = require('parse/node')
const { result } = require('underscore')

const APP_ID = process.env.APP_ID
const MASTER_KEY = process.env.MASTER_KEY

Parse._initialize(APP_ID, "", MASTER_KEY)
Parse.serverURL = process.env.SERVER_URL

/**
 * Modelo que maneja la lógica del módulo de Usuarios de Administración del sistema de administración
 * @namespace ModeloUsuariosAdmin
 */

/**
 * Función que permite conexión con controladores y manda llamar la función asíncrona para obtener todos 
 * los usuarios de administración que hay en el sistema
 *
 * @memberof ModeloUsuariosAdmin
 * @returns {Promise<Object>} JSON con el tipo de consulta, los datos de vuelta y el error en caso de existir
 */
exports.ObtenerTodosLosGrupos = function (idAdviser) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerTodosLosGruposAdmin(0, idAdviser, [], function (results, error) {
            var arregloIdsGruposAdmin = []
            results.forEach(element => {
                arregloIdsGruposAdmin.push(element.get("grupoPtr").id)
            });
            
            exports.AsyncObtenerTodosLosGrupos(0, arregloIdsGruposAdmin, [], function (resultsGrupos, error) {
                log(results)
                if (!error) {
                    resolve({ type: "CONSULTA", data: results, dataGrupos: resultsGrupos, error: null })
                } else {
                    resolve({ type: "CONSULTA", data: results, dataGrupos: resultsGrupos, error: error.message })
                }
            })

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
exports.AsyncObtenerTodosLosGruposAdmin = async (index, idAdviser, dataArray, callback) => {
    const Grupos = Parse.Object.extend("Grupos");
    const innerQuery = new Parse.Query(Grupos);
    innerQuery.equalTo("exists", true)

    var UsuariosSistema = Parse.Object.extend("UsuariosSistema")
    var adviser = new UsuariosSistema()
    adviser.id = idAdviser

    var GruposUsuarios = Parse.Object.extend("GruposUsuarios")
    var query = new Parse.Query(GruposUsuarios)

    query.matchesQuery("grupoPtr", innerQuery)
    query.equalTo("usuarioPtr", adviser)
    query.equalTo("exists", true)
    query.descending("createdAt")
    query.skip(index * 1000)
    query.limit(1000)
    query.include("usuarioPtr")
    query.include("grupoPtr")
    try {
        const results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncObtenerTodosLosGruposAdmin((index + 1), idAdviser, dataArray, callback)
        }
    } catch (error) {
        callback(dataArray, error)
    }
}

exports.AsyncObtenerTodosLosGrupos = async (index, idsGrupos, dataArray, callback) => {

    var Grupos = Parse.Object.extend("Grupos")
    var query = new Parse.Query(Grupos)

    query.notContainedIn("objectId", idsGrupos)
    query.equalTo("exists", true)
    query.descending("createdAt")
    query.skip(index * 1000)
    query.limit(1000)
    try {
        const results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncObtenerTodosLosGrupos((index + 1), idsGrupos, dataArray, callback)
        }
    } catch (error) {
        callback(dataArray, error)
    }
}

/**
 * Función que permite conexión con controladores y manda llamar la función asíncrona para obtener todos 
 * los usuarios de administración que hay en el sistema
 *
 * @memberof ModeloUsuariosAdmin
 * @returns {Promise<Object>} JSON con el tipo de consulta, los datos de vuelta y el error en caso de existir
 */
exports.ObtenerTodosLosProfesores = function () {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerTodosLosProfesores(0, [], function (results, error) {
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
exports.AsyncObtenerTodosLosProfesores = async (index, dataArray, callback) => {
    var Permisos = Parse.Object.extend("Permisos");
    var inquery = new Parse.Query(Permisos)
    inquery.equalTo("clave", "ALUMNO")

    var Table = Parse.Object.extend("UsuariosSistema")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)
    query.ascending("nombre")
    query.skip(index * 1000)
    query.limit(1000)
    query.include("permisoPtr")
    //query.matchesQuery("permisoPtr", inquery);
    query.doesNotMatchQuery("permisoPtr", inquery);
    try {
        const results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncObtenerTodosLosProfesores((index + 1), dataArray, callback)
        }
    } catch (error) {
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
exports.AgregarGrupo = function (data) {
    return new Promise(function (resolve, reject) {
        var codigoGrupo = data["codigoGrupo"] ? data["codigoGrupo"] : ""
        exports.BuscarCodigoGrupo(codigoGrupo, function (grupo, error) {
            
            if (grupo) {
                return resolve({ type: "AGREGAR", data: null, error: "The code of the group is already in use" })
            }

            const Table = Parse.Object.extend("Grupos")
            const object = new Table()

            if (data["nombre"]) {
                object.set("nombre", data["nombre"])
            }

            if (data["codigoGrupo"]) {
                object.set("codigo", data["codigoGrupo"])
            }

            object.set("active", true)
            object.set("exists", true)

            object.save().then((objecto) => {

                var arregloModeradores = []

                if (data["moderador"] != undefined && !Array.isArray(data["moderador"])) {
                    arregloModeradores.push(data["moderador"])
                }
                if (data["moderador"] != undefined && Array.isArray(data["moderador"])) {
                    data["moderador"].forEach(moderador => {
                        arregloModeradores.push(moderador)
                    });
                }

                var arregloModeradoresAgregar = []

                arregloModeradores.forEach(element => {

                    var Moderadores = Parse.Object.extend("UsuariosSistema")
                    var moderador = new Moderadores()
                    moderador.id = element

                    const GruposUsuarios = Parse.Object.extend("GruposUsuarios")
                    const grupoUsuario = new GruposUsuarios()

                    grupoUsuario.set("exists", true)
                    grupoUsuario.set("active", true)
                    grupoUsuario.set("grupoPtr", objecto)
                    grupoUsuario.set("usuarioPtr", moderador)

                    arregloModeradoresAgregar.push(grupoUsuario)
                });

                Parse.Object.saveAll(arregloModeradoresAgregar).then((list) => {
                    resolve({ type: "AGREGAR", data: list, error: null })
                }, (error) => {
                    resolve({ type: "AGREGAR", data: null, error: error.message })
                })
            }, (error) => {
                resolve({ type: "AGREGAR", data: null, error: error.message })
            })

        })
    })
}

/**
 * Función asíncrona que manda llamar desde la base de datos, al grupo si existe, por el código de grupo
 * @memberof ModeloUsuariosAdmin
 *
 * @param {String} codigoGrupo Identificador único del grupo
 * @param {function} callback Función callback para devolver la información
 */
exports.BuscarCodigoGrupo = async (codigoGrupo, callback) => {
    var Grupo = Parse.Object.extend("Grupos")
    var query = new Parse.Query(Grupo)

    query.equalTo("codigo", codigoGrupo)
    query.equalTo("exists", true)

    try {
        const results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
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
exports.BuscarGrupo = function (objectId) {
    return new Promise(function (resolve, reject) {
        exports.AsyncBuscarGrupo(objectId, function (object, error) {
            if (!error) {
                if (object) {
                    resolve({ type: "BÚSQUEDA", data: object, error: null })
                } else {
                    resolve({ type: "BÚSQUEDA", data: null, error: "User not found" })
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

exports.AsyncBuscarGrupo = async (objectId, callback) => {

    var Table = Parse.Object.extend("Grupos")
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
 * Función que permite conexión con controladores y editar un usuario de administración en la base de datos
 *
 * @memberof ModeloUsuariosAdmin
 * @param {Object} data JSON serializado de la forma con el contenido del usuario de administración
 * @returns {Promise<Object>} JSON con el tipo de consulta, los datos de vuelta y el error en caso de existir
 */
exports.EditarGrupo = function (data) {
    return new Promise(function (resolve, reject) {
        var objectId = data["objectId"] ? data["objectId"] : ""

        exports.AsyncBuscarGrupo(objectId, function (grupo, error) {
            if (!grupo) {
                return resolve({ type: "EDITAR", data: null, error: "Group not found" })
            }

            if (data["nombre"]) {
                grupo.set("nombre", data["nombre"])
            }

            if (data["codigoClase"]) {
                grupo.set("codigo", data["codigoClase"])
            }

            grupo.save().then((grupo) => {
                exports.AsyncObtenerDatosGrupo(objectId, function (moderadores, error) {
                    //De los obtenidos en la consulta crear un nuevo arreglo donde solo aparezcan los resultados menos el usuario que está haciendo
                    //la acción el currentUser
                    var arregloModeradores = []
                    moderadores.forEach(element => {
                        if (element.get("usuarioPtr").id != data["currentUser"]) {
                            arregloModeradores.push(element)
                        }
                    });

                    var arregloModeradoresAgregar = []
                    var arregloModeradoresEliminar = []

                    if (data["moderador"] != undefined && !Array.isArray(data["moderador"])) {
                        if (arregloModeradores.length == 0) {
                            arregloModeradoresAgregar.push(data["moderador"])
                        } else {
                            arregloModeradores.forEach(element => {
                                if (element.get("usuarioPtr").id != data["moderador"]) {
                                    arregloModeradoresEliminar.push(element)
                                }
                            });
                        }
                    }

                    if (data["moderador"] != undefined && Array.isArray(data["moderador"])) {
                        arregloModeradores.forEach(element => {
                            var notFound = false
                            data["moderador"].forEach(element2 => {
                                if (element2 == element.get("usuarioPtr").id) {
                                    notFound = true
                                }
                            });
                            if (!notFound) {
                                arregloModeradoresEliminar.push(element)
                            }

                        });

                        data["moderador"].forEach(element => {
                            var notFound = false
                            arregloModeradores.forEach(element2 => {
                                if (element == element2.get("usuarioPtr").id) {
                                    notFound = true
                                }
                            });
                            if (!notFound) {
                                arregloModeradoresAgregar.push(element)
                            }
                        });
                    }

                    if (data["moderador"] == undefined) {
                        arregloModeradores.forEach(element => {
                            arregloModeradoresEliminar.push(element)
                        });
                    }

                    var arregloGuardar = []
                    arregloModeradoresEliminar.forEach(element => {
                        element.set("exists", false)
                        element.set("active", false)
                        arregloGuardar.push(element)
                    });

                    Parse.Object.saveAll(arregloGuardar).then((eliminados) => {

                        arregloGuardar = []
                        arregloModeradoresAgregar.forEach(element => {
                            var Moderadores = Parse.Object.extend("UsuariosSistema")
                            var moderador = new Moderadores()
                            moderador.id = element

                            var Grupos = Parse.Object.extend("Grupos")
                            var grupo = new Grupos()
                            grupo.id = objectId

                            const GruposUsuarios = Parse.Object.extend("GruposUsuarios")
                            const gruposUsuarios = new GruposUsuarios()

                            gruposUsuarios.set("exists", true)
                            gruposUsuarios.set("active", true)
                            gruposUsuarios.set("grupoPtr", grupo)
                            gruposUsuarios.set("usuarioPtr", moderador)
                            arregloGuardar.push(gruposUsuarios)
                        });

                        Parse.Object.saveAll(arregloGuardar).then((Agregados) => {
                            resolve({ type: "EDITAR", data: Agregados, error: null })
                        }, (error) => {
                            resolve({ type: "EDITAR", data: null, error: error.message })
                        })
                    }, (error) => {
                        resolve({ type: "EDITAR", data: null, error: error.message })
                    })
                })
            }, (error) => {
                resolve({ type: "EDITAR", data: null, error: error.message })
            })
        })
    })
}

/**
 * Función que permite conexión con controladores y obtener los moderadores de del grupo
 *
 * @memberof ModeloUsuariosAdmin
 * @param {String} idGrupo Id único del grupo para obtener alumnos pertenecientes al grupo
 * @param {String} idModerador Id único del moderador para no ser incluido en el arreglo a retornar 
 */
exports.ObtenerDatosGrupo = function (idGrupo, idModerador) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerDatosGrupo(idGrupo, function (datosGrupo, error) {
            log(datosGrupo)
            if (error) {
                resolve({ type: "BUSCAR", data: null, error: error.message })
            }
            if (!datosGrupo) {
                resolve({ type: "BUSCAR", data: null, error: error.message })
            }

            var arregloIds = []

            datosGrupo.forEach(element => {
                if (element.get("usuarioPtr").id != idModerador) {
                    arregloIds.push(element.get("usuarioPtr").id)
                }
            });

            resolve({ type: "BUSCAR", data: arregloIds, error: null })

        })
    })
}

/**
 * Función asíncrona que manda llamar desde la base de datos, a los moderadores que están vinculados al grupo desde la base de datos
 * @memberof ModeloUsuariosAdmin
 *
 * @param {String} idGrupo Id único de identificación del grupo
 * @param {function} callback Función callback para devolver la información
 */
exports.AsyncObtenerDatosGrupo = async (idGrupo, callback) => {
    var Permisos = Parse.Object.extend("Permisos");
    var permiso = new Parse.Query(Permisos)
    permiso.equalTo("clave", "ALUMNO")

    var Table = Parse.Object.extend("UsuariosSistema")
    var moderadores = new Parse.Query(Table)
    moderadores.equalTo("exists", true)
    //moderadores.matchesQuery("permisoPtr", permiso);
    moderadores.doesNotMatchQuery("permisoPtr", permiso);

    var Grupos = Parse.Object.extend("Grupos")
    var grupo = new Grupos()
    grupo.id = idGrupo

    var UsuariosGrupo = Parse.Object.extend("GruposUsuarios")
    var query = new Parse.Query(UsuariosGrupo)

    query.matchesQuery("usuarioPtr", moderadores)
    query.equalTo("grupoPtr", grupo)
    query.equalTo("exists", true)
    query.limit(1000)

    try {
        var results = await query.find()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
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
exports.ArchivarGrupo = function (idGrupo, seActiva) {
    return new Promise(function (resolve, reject) {
        exports.AsyncBuscarGrupo(idGrupo, function (grupo, error) {
            if (error) {
                return resolve({ type: "ARCHIVAR", data: null, error: error.message })
            }
            if (!grupo) {
                return resolve({ type: "ARCHIVAR", data: null, error: "Grupo not found" })
            }

            if (seActiva === "true") {
                grupo.set("active", true)
            } else if (seActiva === "false") {
                grupo.set("active", false)
            }

            grupo.save().then((objetoGrupo) => {
                resolve({ type: "ARCHIVAR", data: objetoGrupo, error: null })
            }, (error) => {
                resolve({ type: "ARCHIVAR", data: null, error: error.message })
            })

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
exports.EliminarGrupo = function (idGrupo, idModerador,perteneceAdmin) {
    return new Promise(function (resolve, reject) {
        exports.AsyncBuscarGrupo(idGrupo, function (grupo, error) {

            if (!grupo) {
                return resolve({ type: "ELIMINAR", data: null, error: 'Group not found' })
            }

            grupo.set("active", false)
            grupo.set("exists", false)
            grupo.save().then((objetoGrupo) => {

                if(perteneceAdmin=="false"){
                    return resolve({ type: "ELIMINAR", data: objetoGrupo, error: null })
                }
                
                exports.AsyncObtenerGrupoModerador(idGrupo, idModerador, function (grupoUsuario) {
                    grupoUsuario.set("active", false)
                    grupoUsuario.set("exists", false)
                    grupoUsuario.save().then((objetoGrupo) => {
                        resolve({ type: "ELIMINAR", data: objetoGrupo, error: null })
                    }, (error) => {
                        resolve({ type: "ELIMINAR", data: null, error: error.message })
                    })
                })

            }, (error) => {
                resolve({ type: "ELIMINAR", data: null, error: error.message })
            })

        })
    })
}

/**
 * Función asíncrona que manda llamar desde la base de datos un grupo perteneciente a un Administrador a través de su Id único
 * @memberof ModeloUsuariosAdmin
 *
 * @param {String} idGrupo Id único de identificación del usuario de administración
 * @param {String} idModerador Id único de identificación del usuario de administración
 * @param {function} callback Función callback para devolver la información
 */
exports.AsyncObtenerGrupoModerador = async (idGrupo, idModerador, callback) => {
    var UsuariosSistema = Parse.Object.extend("UsuariosSistema")
    var adviser = new UsuariosSistema()
    adviser.id = idModerador

    var Grupos = Parse.Object.extend("Grupos")
    var grupo = new Grupos()
    grupo.id = idGrupo

    var GruposUsuarios = Parse.Object.extend("GruposUsuarios")
    var query = new Parse.Query(GruposUsuarios)

    query.equalTo("grupoPtr", grupo)
    query.equalTo("usuarioPtr", adviser)
    query.equalTo("exists", true)

    try {
        const results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.SalirDelGrupo = function (idModeraodr, idGrupo) {
    return new Promise(function (resolve, reject) {
        exports.AsyncSalirGrupo(idModeraodr, idGrupo, function (usuarioGrupo, error) {

            if (!usuarioGrupo) {
                return resolve({ type: "SALIR", data: null, error: "Group not found" })
            }

            usuarioGrupo.set("active", false)
            usuarioGrupo.set("exists", false)
            usuarioGrupo.save().then((result) => {
                resolve({ type: "SALIR", data: result, error: null })
            }, (error) => {
                resolve({ type: "SALIR", data: null, error: error.message })
            })


        })
    })
}

exports.AsyncSalirGrupo = async (idUsuario, idGrupo, callback) => {
    var Grupos = Parse.Object.extend("Grupos")
    var grupo = new Grupos()
    grupo.id = idGrupo

    var Table = Parse.Object.extend("GruposUsuarios")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)
    query.equalTo("grupoPtr", grupo)
    query.equalTo("usuarioPtr", idUsuario)

    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

/* Alumnos */
exports.ObtenerAlumnos = function (idGrupo) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerAlumnos(idGrupo, function (usuariosEncotrados, error) {
            if (error) {
                return resolve({ type: "CONSULTA", data: null, error: error.message })
            }
            resolve({ type: "CONSULTA", data: usuariosEncotrados, error: null })
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

exports.AsyncObtenerAlumnos = async (idGrupo, callback) => {
    var Grupos = Parse.Object.extend("Grupos")
    var grupo = new Grupos()
    grupo.id = idGrupo

    var Permisos = Parse.Object.extend("Permisos")
    var permiso = new Parse.Query(Permisos)

    permiso.equalTo("clave", "ALUMNO")
    permiso.equalTo("exists", true)

    var UsuariosSistema = Parse.Object.extend("UsuariosSistema")
    var inerquery = new Parse.Query(UsuariosSistema)

    inerquery.matchesQuery("permisoPtr", permiso)
    inerquery.equalTo("exists", true)

    var GruposUsuarios = Parse.Object.extend("GruposUsuarios")
    var query = new Parse.Query(GruposUsuarios)

    query.matchesQuery("usuarioPtr", inerquery)
    query.equalTo("grupoPtr", grupo)
    query.equalTo("exists", true)
    query.include("usuarioPtr")
    query.include("grupoPtr")
    query.ascending("nombre")
    query.limit(1000)

    try {
        const results = await query.find()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.AgregarAlumno = function (data, link) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerPermiso("ALUMNO", function (claveAlumno, error) {
            exports.AsyncObtenerPermiso("NORMAL", function (claveNormal, error) {
                exports.AsyncBuscarCorreo(data.correo, function (usuario, error) {
                    exports.AsyncBuscarAlumnoGrupo(data.grupoPtr, usuario, function (usuarioEnGrupo, error) {
                        var arregloAgregarUsuariosSistema = []
                        var exiteEnSistema = true
                        if (usuario) {
                            if (usuario.get("permisoPtr").get("clave") != 'ALUMNO') {
                                return resolve({ type: "AGREGAR", data: null, error: "This user can not be added, as the mail already exists with a different permission" })
                            }
                        }
                        if (!usuario) {

                            exiteEnSistema = false

                            const UsuariosSistema = Parse.Object.extend("UsuariosSistema")
                            const usuarioNuevo = new UsuariosSistema()

                            if (data["matricula"]) {
                                usuarioNuevo.set("matricula", data["matricula"])
                            }

                            if (data["correo"]) {
                                usuarioNuevo.set("correoElectronico", data["correo"])
                            }

                            if (data["nombre"]) {
                                usuarioNuevo.set("nombre", data["nombre"])
                            }

                            if (data["papellido"]) {
                                usuarioNuevo.set("apellidoPaterno", data["papellido"])
                            }

                            if (data["mapellido"]) {
                                usuarioNuevo.set("apellidoMaterno", data["mapellido"])
                            }
                            usuarioNuevo.set("colorRobot", "blue")
                            usuarioNuevo.set("permisoPtr", claveAlumno)
                            usuarioNuevo.set("permisoSimulacionPtr", claveNormal)

                            usuarioNuevo.set("active", true)
                            usuarioNuevo.set("exists", true)

                            arregloAgregarUsuariosSistema.push(usuarioNuevo)
                        }
                        if (usuarioEnGrupo) {
                            return resolve({ type: "AGREGAR", data: null, error: "User already exists in group" })
                        }
                        Parse.Object.saveAll(arregloAgregarUsuariosSistema).then((usuarioGuardado) => {

                            var GruposUsuarios = Parse.Object.extend("GruposUsuarios")
                            var gruposUsuarios = new GruposUsuarios()

                            gruposUsuarios.set("active", true)
                            gruposUsuarios.set("exists", true)

                            if (exiteEnSistema) {
                                gruposUsuarios.set("usuarioPtr", usuario)
                            } else {
                                gruposUsuarios.set("usuarioPtr", usuarioGuardado[0])
                            }

                            var Grupo = Parse.Object.extend("Grupos")
                            var grupo = new Grupo()
                            grupo.id = data["grupoPtr"]

                            gruposUsuarios.set("grupoPtr", grupo)

                            gruposUsuarios.save().then((grupoAgregado) => {
                                sedEmails.SendCompanyCode(data["correo"], data["nombre"], link)
                                resolve({ type: "AGREGAR", data: grupoAgregado, error: null })
                            }, (error) => {
                                resolve({ type: "AGREGAR", data: null, error: error.message })
                            })

                        }, (error) => {
                            resolve({ type: "AGREGAR", data: null, error: error.message })
                        })

                    })
                })
            })
        })
    })
    
}

exports.AsyncBuscarCorreo = async (correo, callback) => {

    var UsuariosSistema = Parse.Object.extend("UsuariosSistema")
    var usuario = new Parse.Query(UsuariosSistema)

    usuario.equalTo("correoElectronico", correo)
    usuario.equalTo("exists", true)
    usuario.include("permisoPtr")

    try {
        var results = await usuario.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

/**
 * Función asíncrona que manda llamar desde la base de datos un usuario de administración que hay en el sistema a través de su Id único
 * @memberof ModeloUsuariosAdmin
 *
 * @param {String} idGrupo Id único de identificación del usuario del grupo
 * * @param {String} idUsuario Id único de identificación del usuario de administración
 * @param {function} callback Función callback para devolver la información
 */

exports.AsyncBuscarAlumnoGrupo = async (idGrupo, idUsuario, callback) => {
    var Grupos = Parse.Object.extend("Grupos")
    var grupo = new Grupos()
    grupo.id = idGrupo

    var GruposUsuarios = Parse.Object.extend("GruposUsuarios")
    var gruposUsuarios = new Parse.Query(GruposUsuarios)

    gruposUsuarios.equalTo("usuarioPtr", idUsuario)
    gruposUsuarios.equalTo("grupoPtr", grupo)
    gruposUsuarios.equalTo("exists", true)

    try {
        var results = await gruposUsuarios.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
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
exports.EliminarAlumno = function (idUsuario) {
    return new Promise(function (resolve, reject) {
        exports.AsyncBuscarAlumnoGrupoPtr(idUsuario, function (alumnoEncontrado, error) {
            if (!alumnoEncontrado) {
                return resolve({ type: "ARCHIVAR", data: null, error: "User not found" })
            }

            alumnoEncontrado.set("exists", false)
            alumnoEncontrado.set("active", false)

            alumnoEncontrado.save().then((object) => {
                resolve({ type: "ARCHIVAR", data: object, error: null })
            }, (error) => {
                resolve({ type: "ARCHIVAR", data: null, error: error.message })
            })
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
exports.ArchivarAlumno = function (objectId, seActiva) {
    return new Promise(function (resolve, reject) {
        exports.AsyncBuscarAlumnoGrupoPtr(objectId, function (alumnoEncontrado, error) {

            if (!alumnoEncontrado) {
                return resolve({ type: "ARCHIVAR", data: null, error: "User not found" })
            }

            if (seActiva === "true") {
                alumnoEncontrado.set("active", true)
            } else if (seActiva === "false") {
                alumnoEncontrado.set("active", false)
            }

            alumnoEncontrado.save().then((object) => {
                resolve({ type: "ARCHIVAR", data: object, error: null })
            }, (error) => {
                resolve({ type: "ARCHIVAR", data: null, error: error.message })
            })
        })
    })
}

exports.AsyncBuscarAlumnoGrupoPtr = async (objectId, callback) => {
    var GruposUsuarios = Parse.Object.extend("GruposUsuarios")
    var alumnosGrupo = new Parse.Query(GruposUsuarios)

    alumnosGrupo.equalTo("objectId", objectId)
    alumnosGrupo.equalTo("exists", true)

    try {
        var results = await alumnosGrupo.first()
        callback(results, null)
    } catch (error) {
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
exports.EditarAlumno = function (data) {
    return new Promise(function (resolve, reject) {
        var objectId = data["objectId"] ? data["objectId"] : ""
        exports.AsyncObtenrAlumno(objectId, function (usuarioEncontrado, error) {
            if (!usuarioEncontrado) {
                return resolve({ type: "ELIMINAR", data: null, error: error.message })
            }

            if (data["matricula"]) {
                usuarioEncontrado.set("matricula", data["matricula"])
            }

            if (data["correo"]) {
                usuarioEncontrado.set("correoElectronico", data["correo"])
            }

            if (data["nombre"]) {
                usuarioEncontrado.set("nombre", data["nombre"])
            }

            if (data["papellido"]) {
                usuarioEncontrado.set("apellidoPaterno", data["papellido"])
            }

            //if (data["mapellido"]) {
                usuarioEncontrado.set("apellidoMaterno", data["mapellido"])
            //}

            usuarioEncontrado.save()
                .then((object) => {
                    resolve({ type: "EDITAR", data: object, error: null })
                }, (error) => {
                    resolve({ type: "EDITAR", data: null, error: error.message })
                })
        })
    })
}

exports.AsyncObtenrAlumno = async (idUsuario, callback) => {
    var UsuariosSistema = Parse.Object.extend("UsuariosSistema")
    var query = new Parse.Query(UsuariosSistema)

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
 * Función que permite conexión con controladores y agregar una serie de datos obtenidos de un csv en la base de datos
 *
 * @memberof ModeloUsuariosAdmin
 *
 *  @param {path} path Nombre de archivo csv a obtener datos
 *  @param {String} objectId Id único de identificación del usuario de administración
 *
 * @returns {Promise<Object>} JSON con el tipo de consulta, los datos de vuelta y el error en caso de existir
 */
exports.ImportarAlumnos = function (pathArchivo, grupoId, fullUrl) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerPermiso("ALUMNO", function (claveAlumno, error) {
            exports.AsyncObtenerPermiso("NORMAL", function (claveNormal, error) {
                const resultsObjectsCSV = [];
                const correo = []
                //Obtengo y al mismo tiempo creo los alumnos que se encuentran en el archivo CSV
                fs.createReadStream(path.resolve(__dirname, '../../../' + "/" + pathArchivo)).setEncoding('utf8')
                    .pipe(csvparser({
                        skipLines: 1,
                        headers: ['Enrollment', 'Email', 'Names', 'Last name', "mother's last name"],
                    }))
                    .on('data', (data) => {
                        const Table = Parse.Object.extend("UsuariosSistema")
                        const object = new Table()

                        object.set("matricula", data["Enrollment"])
                        object.set("correoElectronico", data["Email"])
                        object.set("nombre", data["Names"])
                        object.set("apellidoPaterno", data["Last name"])
                        object.set("apellidoMaterno", data["mother's last name"])
                        object.set("permisoPtr", claveAlumno)
                        object.set("permisoSimulacionPtr", claveNormal)
                        object.set("colorRobot", "blue")

                        object.set("active", true)
                        object.set("exists", true)

                        //Agrego en un arreglo las matriculas y los objetos Parse obtenidos del CSV
                        resultsObjectsCSV.push(object)
                        correo.push(object.get("correoElectronico"))
                    })
                    .on('end', () => {
                        //El arreglo de matrículas se busca en el sistema para obtener los que ya están agregados al sistema
                        exports.ObtenerUsuariosEnelSistema(correo, function (encotradosEnSistema, error) {
                            var contadorUsuariosConOtroPermiso = 0
                            var exitenEnSistemaConPermisoAlumno = []
                            var noExistentesEnSistema = []
                            var noExistenEnElGrupo = []
                            var existenEnElGrupo = []
                            //Se agregan los que no están en el sistema a un nuevo arreglo llamado noExistentesEnSistema para tenerlos aparte
                            resultsObjectsCSV.forEach(element => {
                                var found = false

                                encotradosEnSistema.forEach(element2 => {
                                    if (element.get("correoElectronico") == element2.get("correoElectronico")) {
                                        found = true
                                    }
                                });

                                if (!found) {
                                    //estos directamente se agregan al grupo
                                    noExistentesEnSistema.push(element)
                                }
                            });

                            //Eliminar los usuarios que existen en el sistema, pero que no tiene el permiso de "ALUMNO"
                            encotradosEnSistema.forEach(userEcontrado => {
                                if (userEcontrado.get("permisoPtr").get("clave") === "ALUMNO") {
                                    exitenEnSistemaConPermisoAlumno.push(userEcontrado)
                                } else {
                                    contadorUsuariosConOtroPermiso++
                                }
                            });

                            exports.AsyncBuscarPtrAlumnoGrupo(grupoId, exitenEnSistemaConPermisoAlumno, function (usuariosEncontradosGrupo, error) {
                                //Apartamos los usuarios que no se encuentran en el grupo de en el arreglo noExistenEnElGrupo de los que existen en el grupo
                                exitenEnSistemaConPermisoAlumno.forEach(element => {
                                    var found = false
                                    usuariosEncontradosGrupo.forEach(element2 => {
                                        if (element.id == element2.get("usuarioPtr").id) {
                                            found = true
                                        }
                                    });
                                    if (!found) {
                                        noExistenEnElGrupo.push(element)
                                    }
                                });

                                //Cambiamos la propiedad de active a true de los usuarios encontrados en el grupo por si alguno está desactivado
                                usuariosEncontradosGrupo.forEach(element => {
                                    element.set("active", true)
                                    existenEnElGrupo.push(element)
                                });

                                //Actualizamos a los usuarios que existen en el grupo del arreglo existenEnElGrupo para ya tenerlos activados
                                Parse.Object.saveAll(existenEnElGrupo).then((usuariosActualizados) => {
                                    //Guardamos los usuarios del arreglo noExistentesEnSistema anteriormente obtenidos, al sistema, ya que estos no existían
                                    Parse.Object.saveAll(noExistentesEnSistema).then((usuariosNuevos) => {
                                        //El resultado de guardar los usuarios del arreglo noExistentesEnSistema se agregan al arreglo noExistenEnElGrupo, 
                                        //ya que estos usuarios no se encontraban en el grupo

                                        
                                        for (let j = 0; j < noExistentesEnSistema.length; j++) {
                                            sedEmails.SendCompanyCode(noExistentesEnSistema[j].get("correoElectronico"), noExistentesEnSistema[j].get("nombre"), fullUrl)
                                        }

                                        usuariosNuevos.forEach(element => {
                                            noExistenEnElGrupo.push(element)
                                        });

                                        //Se crea un nuevo arreglo para contener los objetos Prase de la relación GruposUsuarios
                                        var arregloAgregarGrupo = []

                                        //Se crean los objetos Parse de la relación de GruposUsuarios con los datos del arreglo noExistenEnElGrupo
                                        //que contiene los Ptr de los usuarios nuevos al sistema y los ya existentes en el sistema
                                        noExistenEnElGrupo.forEach(element => {
                                            var GruposUsuarios = Parse.Object.extend("GruposUsuarios")
                                            var gruposUsuarios = new GruposUsuarios()

                                            gruposUsuarios.set("active", true)
                                            gruposUsuarios.set("exists", true)
                                            gruposUsuarios.set("usuarioPtr", element)

                                            var Grupo = Parse.Object.extend("Grupos")
                                            var grupo = new Grupo()
                                            grupo.id = grupoId

                                            gruposUsuarios.set("grupoPtr", grupo)
                                            arregloAgregarGrupo.push(gruposUsuarios)
                                        });

                                        //Se guarda el arreglo arregloAgregarGrupo para que ya existan en el grupo los nuevos usuarios del sistema y los que ya existían en el sistema pero no en el grupo 
                                        Parse.Object.saveAll(arregloAgregarGrupo).then((usuariosNuevosEnGrupo) => {
                                            resolve({ type: "EDITAR", data: usuariosNuevosEnGrupo, error: null, usuariosConOtroPermiso: contadorUsuariosConOtroPermiso, alumnosNuevosSistema: noExistentesEnSistema.length, alumnosNuevosGrupo: noExistenEnElGrupo.length, alumnosExistentesGrupo: existenEnElGrupo.length })
                                        }, (error) => {
                                            resolve({ type: "IMPORTAR", data: null, error: error.message })
                                        })

                                    }, (error) => {
                                        resolve({ type: "IMPORTAR", data: null, error: error.message })
                                    })

                                }, (error) => {
                                    resolve({ type: "IMPORTAR", data: null, error: error.message })
                                })

                            })

                        })
                    });
            })
        })
    }, (error) => {
        resolve({ type: "AGREGAR", data: null, error: error.message })
    })
}

exports.ObtenerUsuariosEnelSistema = async (correos, callback) => {
    var Table = Parse.Object.extend("UsuariosSistema")
    var query = new Parse.Query(Table)

    query.containedIn("correoElectronico", correos);
    query.exists("exists", true)
    query.include("permisoPtr")

    try {
        var results = await query.find()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

/**
 * Función asíncrona que manda llamar desde la base de datos a los alumnos que existen en un grupo específico, a través de un arreglo de identificadores y el identificador del grupo
 * @memberof ModeloUsuariosAdmin
 *
 * @param {String} objectId Identificador del grupo
 * @param {array} objectsId Arreglo de identificadores de los alumnos
 * @param {function} callback Función callback para devolver la información
 */
exports.AsyncBuscarPtrAlumnoGrupo = async (grupoPtr, usuariosPtr, callback) => {

    var Grupo = Parse.Object.extend("Grupos")
    var grupo = new Grupo()
    grupo.id = grupoPtr

    var Table = Parse.Object.extend("GruposUsuarios")
    var query = new Parse.Query(Table)

    query.containedIn("usuarioPtr", usuariosPtr);
    query.equalTo("grupoPtr", grupo)
    query.include("usuarioPtr")
    query.equalTo("exists", true)

    try {
        const results = await query.find()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

/**
 * Función asíncrona que manda llamar desde la base de datos un permiso que hay en el sistema, a través de su Id único
 * @memberof ModeloUsuariosAdmin
 *
 * @param {String} objectId Id único de identificación del permiso
 * @param {function} callback Función callback para devolver la información
 */
exports.AsyncObtenerPermiso = async (clave, callback) => {
    var Table = Parse.Object.extend("Permisos");
    var query = new Parse.Query(Table);
    query.equalTo("exists", true);
    query.equalTo("clave", clave);

    try {
        const results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}


/*Funciones Iterativas*/
/**
 * Función que permite conexión con controladores y agregar una serie de datos obtenidos de un csv en la base de datos
 *
 * @memberof ModeloUsuariosAdmin
 *
 *  @param {path} path Nombre de archivo csv a obtener datos
 *  @param {String} objectId Id único de identificación del usuario de administración
 *
 * @returns {Promise<Object>} JSON con el tipo de consulta, los datos de vuelta y el error en caso de existir
 */
exports.IterativoImportarAlumnos = async ( pathArchivo, grupoId, fullUrl ) => {

    var usuariosNuevosEnGrupoTempo = null
    var contadorUsuariosConOtroPermisoTempo = null
    var noExistentesEnSistemaTempo = null
    var noExistenEnElGrupoTempo = null
    var existenEnElGrupoTempo = null

    await exports.ConvertFileToUTF8( pathArchivo )

    try {
        var claveAlumnoTempo = await exports.GetPermissions( 'ALUMNO' )
        var claveAlumno = claveAlumnoTempo.data
        var claveNormalTempo = await exports.GetPermissions( 'NORMAL' )
        var claveNormal = claveNormalTempo.data
    } catch (error) {
        log( error )
        return { data: null, error: error.error }   
    }

    const resultsObjectsCSV = [];
    const correo = []
    
        //Obtengo y al mismo tiempo creo los alumnos que se encuentran en el archivo CSV
    const dataReturn = new Promise( async function (resolve, reject) { 
        fs.createReadStream(path.resolve(__dirname, '../../../' + "/" + pathArchivo)).setEncoding('utf8')
        .pipe(csvparser({
            skipLines: 1,
            headers: ['Enrollment', 'Email', 'Names', 'Last name', "mother's last name"],
        }))
        .on('data', (data) => {
            const Table = Parse.Object.extend("UsuariosSistema")
            const object = new Table()

            if( data["Enrollment"] ){            
                object.set("matricula", data["Enrollment"])
            }
            if( data["Email"] ){
                object.set("correoElectronico", data["Email"])
            }
            if( data["Names"] ){
                object.set("nombre", data["Names"])
            }
            if( data["Last name"] ){
                object.set("apellidoPaterno", data["Last name"])
            }
            if( data["mother's last name"] ){
                object.set("apellidoMaterno", data["mother's last name"])
            }
            object.set("permisoPtr", claveAlumno)
            object.set("permisoSimulacionPtr", claveNormal)
            object.set("colorRobot", "blue")

            object.set("active", true)
            object.set("exists", true)

            //Agrego en un arreglo las matriculas y los objetos Parse obtenidos del CSV
            resultsObjectsCSV.push(object)
            correo.push(object.get("correoElectronico"))
        })
        .on('end', async () => {
                //El arreglo de matrículas se busca en el sistema para obtener los que ya están agregados al sistema
            try {
                var encotradosEnSistemaTempo = await exports.GetUsersInSistem( correo )
                var encotradosEnSistema      = encotradosEnSistemaTempo.data
            } catch (error) {
                log( error )
                return { data: null, error: error.error }
            }
            

            var contadorUsuariosConOtroPermiso  = 0
            var exitenEnSistemaConPermisoAlumno = []
            var noExistentesEnSistema           = []
            var noExistenEnElGrupo              = []
            var existenEnElGrupo                = []
                //Se agregan los que no están en el sistema a un nuevo arreglo llamado noExistentesEnSistema para tenerlos aparte
            resultsObjectsCSV.forEach( element => {
                var found = false
                encotradosEnSistema.forEach( element2 => {
                    if ( element.get( "correoElectronico" ) == element2.get( "correoElectronico" ) ) { found = true }
                });
                    //estos directamente se agregan al grupo
                if ( !found ) { noExistentesEnSistema.push(element) }
            });

                //Eliminar los usuarios que existen en el sistema, pero que no tiene el permiso de "ALUMNO"
            encotradosEnSistema.forEach( userEcontrado => {
                if ( userEcontrado.get( "permisoPtr" ).get( "clave" ) === "ALUMNO") { exitenEnSistemaConPermisoAlumno.push( userEcontrado ) } 
                else { contadorUsuariosConOtroPermiso++ }
            });

            try {
                var usuariosEncontradosGrupoTempo = await exports.SearchStudentsPtrGroup( grupoId, exitenEnSistemaConPermisoAlumno )
                var usuariosEncontradosGrupo      = usuariosEncontradosGrupoTempo.data
            } catch (error) {
                log( error )
                return { data: null, error: error.error }
            }
            
                //Apartamos los usuarios que no se encuentran en el grupo de en el arreglo noExistenEnElGrupo de los que existen en el grupo
            exitenEnSistemaConPermisoAlumno.forEach( element => {
                var found = false
                usuariosEncontradosGrupo.forEach( element2 => {
                    if ( element.id == element2.get( "usuarioPtr" ).id ) { found = true }
                });
                if ( !found ) { noExistenEnElGrupo.push( element ) }
            });

                //Cambiamos la propiedad de active a true de los usuarios encontrados en el grupo por si alguno está desactivado
            usuariosEncontradosGrupo.forEach( element => {
                element.set( "active", true )
                existenEnElGrupo.push( element )
            });

            try {
                    //Actualizamos a los usuarios que existen en el grupo del arreglo existenEnElGrupo para ya tenerlos activados
            var usuariosActualizados    = await Parse.Object.saveAll(existenEnElGrupo)
                    //Guardamos los usuarios del arreglo noExistentesEnSistema anteriormente obtenidos, al sistema, ya que estos no existían
            var usuariosNuevos = await Parse.Object.saveAll(noExistentesEnSistema)
            } catch (error) {
                log( error )
                return { data: null, error: error.error }
            }

                //El resultado de guardar los usuarios del arreglo noExistentesEnSistema se agregan al arreglo noExistenEnElGrupo, 
                //ya que estos usuarios no se encontraban en el grupo   
            for ( let j = 0; j < noExistentesEnSistema.length; j++ ) {
                await sedEmails.SendCompanyCode( noExistentesEnSistema[j].get( "correoElectronico" ), noExistentesEnSistema[j].get( "nombre" ), fullUrl )
            }

            usuariosNuevos.forEach( element => { noExistenEnElGrupo.push( element ) } );

                //Se crea un nuevo arreglo para contener los objetos Prase de la relación GruposUsuarios
            var arregloAgregarGrupo = []

                //Se crean los objetos Parse de la relación de GruposUsuarios con los datos del arreglo noExistenEnElGrupo
                //que contiene los Ptr de los usuarios nuevos al sistema y los ya existentes en el sistema
            noExistenEnElGrupo.forEach( element => {
                var GruposUsuarios = Parse.Object.extend( "GruposUsuarios" )
                var gruposUsuarios = new GruposUsuarios()

                    gruposUsuarios.set( "active", true )
                    gruposUsuarios.set( "exists", true )
                    gruposUsuarios.set( "usuarioPtr", element )

                var Grupo    = Parse.Object.extend( "Grupos" )
                var grupo    = new Grupo()
                    grupo.id = grupoId

                    gruposUsuarios.set("grupoPtr", grupo)
                    arregloAgregarGrupo.push(gruposUsuarios)
            });
                //Se guarda el arreglo arregloAgregarGrupo para que ya existan en el grupo los nuevos usuarios del sistema 
                //y los que ya existían en el sistema pero no en el grupo
            try {
                var usuariosNuevosEnGrupo = await Parse.Object.saveAll( arregloAgregarGrupo )
            } catch (error) {
                log( error )
                return { data: null, error: error.error }
            }

            usuariosNuevosEnGrupoTempo = usuariosNuevosEnGrupo
            contadorUsuariosConOtroPermisoTempo = contadorUsuariosConOtroPermiso
            noExistentesEnSistemaTempo = noExistentesEnSistema.length
            noExistenEnElGrupoTempo = noExistenEnElGrupo.length
            existenEnElGrupoTempo = existenEnElGrupo.length 
            resolve ({ data: usuariosNuevosEnGrupo, error: null, usuariosConOtroPermiso: contadorUsuariosConOtroPermiso, alumnosNuevosSistema: noExistentesEnSistema.length, alumnosNuevosGrupo: noExistenEnElGrupo.length, alumnosExistentesGrupo: existenEnElGrupo.length })
            
        })
    })

    return await dataReturn
}

/**
 * Función asíncrona que permite obtener un permiso
 *
 * @memberof ModeloGrupos
*
 * @param {String} permission Clave del permiso
 * @returns {Object} JSON con el tipo de consulta, los datos de vuelta y el error en caso de existir
 */
exports.GetPermissions = async ( permission ) => {
    var Table = Parse.Object.extend("Permisos");
    var query = new Parse.Query(Table);
    query.equalTo("exists", true);
    query.equalTo("clave", permission);

    try {
        const results = await query.first()
        return { data: results, error: null }
    } catch (error) {
        log( error )
        return { data: null, error: error.error }
    }
}

/**
 * Función asíncrona que permite obtener los usuarios del sistema por los correos indicados
 *
 * @memberof ModeloGrupos
*
 * @param {String} permission Clave del permiso
 * @returns {Object} JSON con el tipo de consulta, los datos de vuelta y el error en caso de existir
 */
exports.GetUsersInSistem = async ( correos ) => {
    var Table = Parse.Object.extend("UsuariosSistema")
    var query = new Parse.Query(Table)

    query.containedIn("correoElectronico", correos);
    query.exists("exists", true)
    query.include("permisoPtr")

    try {
        var results = await query.find()
        return { data: results, error: null }
    } catch (error) {
        log( error )
        return { data: null, error: error.error }
    }
}

/**
 * Función asíncrona que permite obtener los usuarios del grupo indicado
 *
 * @memberof ModeloGrupos
*
 * @param {String} grupoPtr objectId del grupo
 * @param {array} usuariosPtr Arreglo de objectId de usuarios
 * 
 * @returns {Object} JSON con el tipo de consulta, los datos de vuelta y el error en caso de existir
 */
exports.SearchStudentsPtrGroup = async ( grupoPtr, usuariosPtr ) => {
    var Grupo = Parse.Object.extend("Grupos")
    var grupo = new Grupo()
    grupo.id = grupoPtr

    var Table = Parse.Object.extend("GruposUsuarios")
    var query = new Parse.Query(Table)

    query.containedIn("usuarioPtr", usuariosPtr);
    query.equalTo("grupoPtr", grupo)
    query.include("usuarioPtr")
    query.equalTo("exists", true)

    try {
        const results = await query.find()
        return { data: results, error: null }
    } catch (error) {
        log( error )
        return { data: null, error: error.error }
    }
}

exports.ConvertFileToUTF8 = async ( pathArchive ) => {

        //Ruta del archivo
    var archive          = path.resolve(__dirname, '../../../' + "/" + pathArchive)
        //Leer el archivo
    var buffer           = fs.readFileSync( archive );
        //Obtener el tipo de encoding del archivo
    var originalEncoding;
    var file;
    if(process.platform === "win32"){
        file             = iconv.decode(buffer, "utf8");
    }else{
        originalEncoding = detectCharacterEncoding(buffer);
        file             = iconv.decode(buffer, originalEncoding.encoding);
    }
        //Crear nuevo archivo con encoding utf8 
    fs.writeFileSync( archive, file, "UTF-8");

}