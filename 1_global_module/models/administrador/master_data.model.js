var path = require('path')
var fs = require('fs')
var _ = require('underscore')
var Promise = require('promise')
var request = require('request')
var csvparser = require("csv-parser")
if(process.platform !== "win32"){
    var detectCharacterEncoding = require('detect-character-encoding');    
}
var iconv = require('iconv-lite');

var log = console.log

//var FunctionsGeneral = require(path.join(__dirname, '../../functions/general.js'));

var Parse = require('parse/node');
const { object, functions } = require('underscore')
const { type } = require('os')
const LIMIT_NUMBER_RESULTS = 1000

const APP_ID = process.env.APP_ID
const MASTER_KEY = process.env.MASTER_KEY

Parse._initialize(APP_ID, "", MASTER_KEY)
Parse.serverURL = process.env.PUBLIC_SERVER_URL

exports.ObtenerTotalDeMateriaPrima = function () {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerTotalDeMateriaPrima(function (total, error) {
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
exports.AsyncObtenerTotalDeMateriaPrima = async (callback) => {
    var Table = Parse.Object.extend("DMMateriaPrima")
    var query = new Parse.Query(Table)
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
exports.ObtenerTodaLaMateriaPrima = function () {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerTodaLaCategoria(0,[], function (resultsCate, error){
            //log(resultsCate)
            if (error) {
                return resolve({ type: "CONSULTA", data: null, error: error.message })
            } else {
                exports.AsyncObtenerTodaLaMateriaPrima(0, [], function (results, error) {
                    if (!error) {
                        resolve({ type: "CONSULTA", data: results, dataCategoria: resultsCate, error: null })
                    } else {
                        resolve({ type: "CONSULTA", data: null, error: error.message })
                    }
                })
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
exports.AsyncObtenerTodaLaMateriaPrima = async (index, dataArray, callback) => {
    var Table = Parse.Object.extend("DMMateriaPrima")
    var query = new Parse.Query(Table)
    query.equalTo("exists", true)
    query.include("categoriaPtr")
    query.skip(index * 1000)
    query.limit(1000)
    try {
        const results = await query.find()
        if (results.length <= 0) {
            //console.log("Finaliza")
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            //console.log("Avanzando")
            exports.AsyncObtenerTodaLaMateriaPrima((index + 1), dataArray, callback)
        }
    } catch (error) {
        //throw new Error(error)
        callback(dataArray, error)
    }
}

exports.AsyncObtenerTodaLaCategoria = async (index, dataArray, callback) => {
    var Table = Parse.Object.extend("DMMateriaPrimaCategoria")
    var query = new Parse.Query(Table)
    query.equalTo("exists",true)
    query.equalTo("active",true)
    query.skip(index * 1000)
    query.limit(1000)
    try {
        const results = await query.find()
        if (results.length <= 0) {
            //console.log("Finaliza")
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            //console.log("Avanzando")
            exports.AsyncObtenerTodaLaCategoria((index + 1), dataArray, callback)
        }
    } catch (error) {
        //throw new Error(error)
        callback(null, error)
    }
}

/**
 * Función que permite conexión con controladores y manda llamar la función asíncrona para actualizar 
 * la materia prima
 *
 * @memberof ModeloUsuariosAdmin
 * @returns {Promise<Object>} JSON con el tipo de consulta, los datos de vuelta y el error en caso de existir
 */
 exports.EditarMateriaPrima = function (data, pathArchivo) {
     log(data)
    return new Promise(function (resolve, reject) {
        var objectId = data.objectId
        exports.AsyncObtenerTypoDematerial( function( resultsType, error){

            if (error) { return resolve({ type: "EDITAR", data: null, error: error.message })}

            exports.AsyncObtenerMateriaPrimaToEdit(objectId, function (results, error) {
                if (error) { return resolve({ type: "EDITAR", data: null, error: error.message })}

                var imagenPath = results.get("imagen")

                if(data["name"]){
                    results.set("nombre", data["name"])
                }if(pathArchivo){
                    results.set("imagen",pathArchivo)
                }
                if(data["typeRawMaterial"]){
                    var materialType = _.find( resultsType, function (obj){
                        return obj.get("abreviatura") == data["typeRawMaterial"]
                    })

                    results.set("categoriaPtr",materialType)
                }

                results.save().then( (resulSave)=> {
                    if(pathArchivo){
                        if( imagenPath || imagenPath != '' || imagenPath != undefined || imagenPath != null){
                            var pathImage = path.join(__dirname+"../../../../"+imagenPath)
                            fs.unlink(pathImage, function (err) {
                                if (err) {
                                    return resolve({ type: "EDITAR", data: null, error: err }); 
                                }
                                return resolve({ type: "EDITAR", data: resulSave, error: null })
                            })
                        }
                    }
                    resolve({ type: "EDITAR", data: resulSave, error: null })
                    
                }, (error)=>{
                    resolve({ type: "EDITAR", data: null, error: error.message })
                })
                
            })
        })
    })
}

exports.AsyncObtenerMateriaPrimaToEdit = async (idMateriaPrima, callback) => {
    var Table = Parse.Object.extend("DMMateriaPrima")
    var query = new Parse.Query(Table)

    query.equalTo("objectId", idMateriaPrima)
    query.equalTo("exists", true)

    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncObtenerTypoDematerial = async ( callback) => {
    var Table = Parse.Object.extend("DMMateriaPrimaCategoria")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)
    query.equalTo("active", true)

    try {
        var results = await query.find()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.AgregarMateriaPrima = function (data, pathArchivo) {
    return new Promise(function (resolve, reject) {
        log(data)
        log(pathArchivo)
       var Table = Parse.Object.extend("DMMateriaPrima")
        var object = new Table()
        if(data["nombre"]){
            object.set("nombre",data["nombre"])
        }
        if(data["codigo"]){
            object.set("codigo",data["codigo"])
        }
        if(data["noparte"]){
            object.set("noparte",data["noparte"])
        }
        if(data["categoriaPtr"]){
            var objectCategoria = Parse.Object.extend("DMMateriaPrimaCategoria")
            var catPtr          = new objectCategoria()
                catPtr.id       = data["categoriaPtr"]
            object.set("categoriaPtr",catPtr)
        }
        if(pathArchivo){
            object.set("imagen", pathArchivo)
        }
        object.set("exists",true)
        object.set("active",true)

        object.save().then((result)=>{
            resolve({ type: "EDITAR", data: result, error: null })
        }, (error)=>{
            resolve({ type: "EDITAR", data: null, error: error.message }); 
        })

    })
}

/**
 * Función que permite conexión con controladores y manda llamar la función asíncrona para obtener todos 
 * los usuarios de administración que hay en el sistema
 *
 * @memberof ModeloUsuariosAdmin
 * @returns {Promise<Object>} JSON con el tipo de consulta, los datos de vuelta y el error en caso de existir
 */
exports.ObtenerTodosLosProductos = function () {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerTodosLosProductos(0, [], function (results, error) {
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
exports.AsyncObtenerTodosLosProductos = async (index, dataArray, callback) => {
    var Table = Parse.Object.extend("DMProductoFamilia")
    var query = new Parse.Query(Table)
    query.equalTo("exists", true)
    query.skip(index * 1000)
    query.limit(1000)
    try {
        const results = await query.find()
        if (results.length <= 0) {
            //console.log("Finaliza")
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            //console.log("Avanzando")
            exports.AsyncObtenerTodosLosProductos((index + 1), dataArray, callback)
        }
    } catch (error) {
        //throw new Error(error)
        callback(dataArray, error)
    }
}

exports.AgregarProductoFamilia = function (data, pathArchivo, pathArchivoVideo) {
    //log(data)
    return new Promise( async (resolve, reject) => {
        var rawMaterialSave = data['rawMaterials']; 
        const Table = Parse.Object.extend("DMProductoFamilia")
        const object = new Table()

        if (data["nombre"]) {
            object.set("nombre", data["nombre"])
        }

        if (data["codigo"]) {
            object.set("codigo", data["codigo"])
        }

        if (pathArchivo) {
            object.set("imagen", pathArchivo)
        }

        if (pathArchivoVideo) {
            object.set("videos", pathArchivoVideo)
        }

        var jsonData = data
        
        delete jsonData['nombre'];
        delete jsonData['codigo'];
        delete jsonData['imagen'];
        delete jsonData['videos'];
        delete jsonData['rawMaterials'];
        
        var dataTempo = {}

        for (const key in jsonData) {
            var dataSave = _.find( rawMaterialSave, function( current ) {
                return current == key
            })

            if( dataSave ) {
                dataTempo[key] = jsonData[key]
            }
        }

        jsonData = dataTempo

        var arrayRawMaterial = []
        for (const key in jsonData) {/*
            var RawMaterialTable = Parse.Object.extend("DMMateriaPrima")
            var rawMaterial = new RawMaterialTable()
                rawMaterial.id = key*/
            arrayRawMaterial.push( key )
        }

        try {
            var transportTempo = await exports.IterativeGetData( "DMTransporte" )
            var transport = transportTempo.data
            var SuppliersRawMaterialTempo = await exports.IterativeGetData( "DMProveedoresMP" )
            var SuppliersRawMaterial = SuppliersRawMaterialTempo.data
        } catch (error) {
            log(error)
            resolve({ type: "AGREGAR", data: null, error: error.error })
        }

        var notTransport = []

        for (let i = 0; i < arrayRawMaterial.length; i++) {
            var notFound = _.find(transport, function(current){
                return current.get("productoPtr").id == arrayRawMaterial[i]
            })
            if(!notFound){
                notTransport.push(arrayRawMaterial[i])
            }
        }

        var notSRM = []
        for (let i = 0; i < arrayRawMaterial.length; i++) {
            var notFound = _.find(SuppliersRawMaterial, function(current){
                return current.get("materiaPrimaPtr").id == arrayRawMaterial[i]
            })
            if(!notFound){
                notSRM.push(arrayRawMaterial[i])
            }
        }

        if( notTransport.length > 0 || notSRM.length > 0 ){
            try {
                var withoutTransportTempo = await exports.IterativeGetRawMaterial (notTransport)
                var withoutTransport = withoutTransportTempo.data
                var withoutSRMTempo = await exports.IterativeGetRawMaterial (notSRM)
                var withoutSRM = withoutSRMTempo.data
            } catch (error) {
                log(error)
                resolve({ type: "AGREGAR", data: null, error: error.error })
            }

            for (let j = 0; j < withoutSRM.length; j++) {
                withoutTransport.push(withoutSRM[j])
            }

            var dataUniq = _.uniq(withoutTransport, function(obj){
                return obj.id
            })

            resolve({ type: "AGREGAR", data: [], withoutTransport: withoutTransport, withoutSRM: withoutSRM, dataUniq: dataUniq, error: null })

        }else{
            log(jsonData)
            object.set("component", jsonData)
            object.set("active", true)
            object.set("exists", true)

            object.save()
                .then((object) => {
                    resolve({ type: "AGREGAR", data: object, error: null, withoutTransport: [], withoutSRM: [], dataUniq: [] })
                }, (error) => {
                    resolve({ type: "AGREGAR", data: null, error: error.message })
                })
        }
    })
}

exports.IterativeGetData = async ( nameTable ) => {

    var Table = Parse.Object.extend( nameTable )
    var query = new Parse.Query( Table )

    var count = 0
    try {
        count = await query.count()
    } catch (error) {
        log( error )
        return { date: null, error: error.error }
    }

    var results = []
    var noQueries = Math.ceil( count/LIMIT_NUMBER_RESULTS )

    for (let i = 0; i < noQueries; i++) {

        query.equalTo( "exists", true )

        query.limit( LIMIT_NUMBER_RESULTS )
        query.skip( i*LIMIT_NUMBER_RESULTS )

        try {
            var resultstempo = await query.find()
            results.push.apply( results, resultstempo )
        } catch (error) {
            log( error )
            return { data: null, error: error.error }
        }
    }
    return { data: results, error: null }
    
}

exports.IterativeGetRawMaterial = async ( arrayIds ) => {

    var Table = Parse.Object.extend( "DMMateriaPrima" )
    var query = new Parse.Query( Table )

    var count = 0
    try {
        count = await query.count()
    } catch (error) {
        log( error )
        return { date: null, error: error.error }
    }

    var results = []
    var noQueries = Math.ceil( count/LIMIT_NUMBER_RESULTS )

    for (let i = 0; i < noQueries; i++) {

        query.equalTo( "exists", true )
        query.containedIn( "objectId", arrayIds)

        query.limit( LIMIT_NUMBER_RESULTS )
        query.skip( i*LIMIT_NUMBER_RESULTS )

        try {
            var resultstempo = await query.find()
            results.push.apply( results, resultstempo )
        } catch (error) {
            log( error )
            return { data: null, error: error.error }
        }
    }
    return { data: results, error: null }
    
}

exports.EliminarProducto = function (idProducto) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerProducto(idProducto, function (producto, error) {
            if (error) {
                return resolve({ type: "ELIMINAR", data: null, error: error.message })
            }

            producto.set("active", false)
            producto.set("exists", false)

            producto.save().then((productoEliminado) => {
                resolve({ type: "ELIMINAR", data: productoEliminado, error: null })
            }, (error) => {
                resolve({ type: "ELIMINAR", data: null, error: error.message })
            })
        })
    })
}

exports.ArchivarProducto = function (idProducto, seActiva) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerProducto(idProducto, function (producto, error) {
            if (error) {
                return resolve({ type: "ARCHIVAR", data: null, error: error.message })
            }

            if (seActiva === "true") {
                producto.set("active", true)
            } else if (seActiva === "false") {
                producto.set("active", false)
            }

            producto.save().then((productoArchivado) => {
                resolve({ type: "ARCHIVAR", data: productoArchivado, error: null })
            }, (error) => {
                resolve({ type: "ARCHIVAR", data: null, error: error.message })
            })
        })
    })
}

exports.ActualizarProducto = function (data, pathArchivo) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerProducto(data["objectId"], function (producto, error) {
            if (error) {
                return resolve({ type: "EDITAR", data: null, error: error.message })
            }

            if (data["nombre"]) {
                producto.set("nombre", data["nombre"])
            }
            if (data["codigo"]) {
                producto.set("codigo", data["codigo"])
            }
            if (pathArchivo) {
                producto.set("imagen", pathArchivo)
            }

            producto.save().then((productoEditado) => {
                resolve({ type: "EDITAR", data: productoEditado, error: null })
            }, (error) => {
                resolve({ type: "EDITAR", data: null, error: error.message })
            })

        })
    })
}

exports.AsyncObtenerProducto = async (idProducto, callback) => {
    var Table = Parse.Object.extend("DMProductoFamilia")
    var query = new Parse.Query(Table)

    query.equalTo("objectId", idProducto)
    query.equalTo("exists", true)

    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.AddVideoProductoFamily = function (objectId, pathVideos) {
    return new Promise(function (resolve, reject) {
        exports.AsyncGetProductFamily(objectId, function(result, error){
            if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message })}
            var arrayPathSave = result.get("videos")
            var newArrayPathToSave = _.union(arrayPathSave,pathVideos)

            result.set("videos",newArrayPathToSave)
            result.save().then( (resultSave) => {
                resolve({ type: "EDITAR", data: resultSave, error: null })
            }, (error) => {
                resolve({ type: "ELIMINAR", data: null, error: error.message })
            })
        })

    })
}

exports.DeleteVideoProductoFamily = function (objectId, pathVideo) {
    return new Promise(function (resolve, reject) {
        exports.AsyncGetProductFamily(objectId, function(result, error){
            if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message })}
            var arrayPathSave = result.get("videos")
            var newArrayPathToSave = _.without(arrayPathSave,pathVideo)

            result.set("videos",newArrayPathToSave)
            result.save().then( (resultSave) => {
                var pathVideoToDelete = path.join(__dirname+"../../../../"+pathVideo)
                fs.unlink(pathVideoToDelete, function (err) {
                    if (err) {
                        return resolve({ type: "EDITAR", data: null, error: err }); 
                    }
                    return resolve({ type: "EDITAR", data: resultSave, error: null })
                })
            }, (error) => {
                resolve({ type: "ELIMINAR", data: null, error: error.message })
            })
        })

    })
}

exports.AsyncGetProductFamily = async (objectId, callback) => {
    var Table = Parse.Object.extend("DMProductoFamilia")
    var query = new Parse.Query(Table)
        query.equalTo("objectId",objectId)
        query.equalTo("exists", true)
        query.equalTo("active",true)
    
    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
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
exports.ObtenerTodosElInventario = function () {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerTodosElInventario(0, [], function (results, error) {
            if (!error) {
                resolve({ type: "CONSULTA", data: results, error: null })
            } else {
                resolve({ type: "CONSULTA", data: results, error: error.message })
            }
        })
    })
}

/**
   * Función que permite conexión con controladores y manda llamar la función asíncrona para obtener la cuenta 
   * de cuantos usuarios de administración hay en el sistema
   *
   * @memberof ModeloUsuariosAdmin
   *
   * @returns {Promise<Object>} JSON con el tipo de consulta, los datos de vuelta y el error en caso de existir
   */
exports.ObtenerTotalDeInventario = function () {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerTotalDeInventario(function (total, error) {
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
exports.AsyncObtenerTotalDeInventario = async (callback) => {
    var Table = Parse.Object.extend("DMMateriaPrimaInventario")
    var query = new Parse.Query(Table)
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
 * Función asíncrona recursiva que manda llamar desde la base de datos todos los usuarios de administración que hay en el sistema
 *
 * @memberof ModeloUsuariosAdmin
 *
 * @param {Number} index Índice del nivel de recursión en el que se encuentra la función
 * @param {Array} data Lista de todos los objetos recuperados por toda la recursión
 * @param {function} callback Función callback para devolver la información
 *
 */
exports.AsyncObtenerTodosElInventario = async (index, dataArray, callback) => {
    var Table = Parse.Object.extend("DMMateriaPrimaInventario")
    var query = new Parse.Query(Table)
    query.equalTo("exists", true)
    query.include("materaPrimaPtr")
    query.skip(index * 1000)
    query.limit(1000)
    try {
        const results = await query.find()
        if (results.length <= 0) {
            //console.log("Finaliza")
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            //console.log("Avanzando")
            exports.AsyncObtenerTodosElInventario((index + 1), dataArray, callback)
        }
    } catch (error) {
        //throw new Error(error)
        callback(dataArray, error)
    }
}

exports.AgregarBaseInventario = function (data) {
    return new Promise(function (resolve, reject) {
        var inventario = []

        for (var key in data) {
            var quantity = data[key]

            const Table = Parse.Object.extend("DMMateriaPrimaInventario")
            const object = new Table()

            var TableMP = Parse.Object.extend("DMMateriaPrima")
            var mpPtr = new TableMP()
            mpPtr.id = key

            object.set("materaPrimaPtr", mpPtr)
            object.set("cantidad", quantity)
            object.set("active", true)
            object.set("exists", true)

            inventario.push(object)
        }

        Parse.Object.saveAll(inventario).then((list) => {
            resolve({ type: "AGREGAR", data: list, error: null })
        }, (error) => {
            resolve({ type: "AGREGAR", data: null, error: error.message })
        })
    })
}

exports.ActualizarBaseInventario = function (data) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerTodosElInventario(0, [], function (results, error) {
            var inventarioUpddate = []
            if (!error) {
                for (var key in data) {
                    var object = _.find(results, function (obj) {
                        return obj.get('materaPrimaPtr').id == key
                    });

                    if(object) {
                        object.set("cantidad", data[key])
                        inventarioUpddate.push(object)
                    } else {
                        const Table = Parse.Object.extend("DMMateriaPrimaInventario")
                        const new_object = new Table()

                        var TableMP = Parse.Object.extend("DMMateriaPrima")
                        var mpPtr = new TableMP()
                        mpPtr.id = key

                        new_object.set("materaPrimaPtr", mpPtr)
                        new_object.set("cantidad", data[key])
                        new_object.set("active", true)
                        new_object.set("exists", true)

                        inventarioUpddate.push(new_object)
                    }
                }

                Parse.Object.saveAll(inventarioUpddate).then((list) => {
                    resolve({ type: "AGREGAR", data: list, error: null })
                }, (error) => {
                    resolve({ type: "AGREGAR", data: null, error: error.message })
                })
            } else {
                resolve({ type: "AGREGAR", data: null, error: error.message })
            }
        })
    })
}

exports.EliminarInventarioMateriaPrima = function (idMateriaPrima) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerMateriaPrima(idMateriaPrima, function (materiaPrima, error) {
            if (error) {
                return resolve({ type: "ELIMINAR", data: null, error: error.message })
            }

            materiaPrima.set("active", false)
            materiaPrima.set("exists", false)

            materiaPrima.save().then((materiaPrimaEliminado) => {
                resolve({ type: "ELIMINAR", data: materiaPrimaEliminado, error: null })
            }, (error) => {
                resolve({ type: "ELIMINAR", data: null, error: error.message })
            })
        })
    })
}

exports.ArchivarInventarioMateriaPrima = function (idMateriaPrima, seActiva) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerMateriaPrima(idMateriaPrima, function (materiaPrima, error) {
            if (error) {
                return resolve({ type: "ARCHIVAR", data: null, error: error.message })
            }

            if (seActiva === "true") {
                materiaPrima.set("active", true)
            } else if (seActiva === "false") {
                materiaPrima.set("active", false)
            }

            materiaPrima.save().then((materiaPrimaArchivado) => {
                resolve({ type: "ARCHIVAR", data: materiaPrimaArchivado, error: null })
            }, (error) => {
                resolve({ type: "ARCHIVAR", data: null, error: error.message })
            })
        })
    })
}

exports.ActualizarInventarioMateriaPrima = function (data) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerMateriaPrima(data["objectId"], function (InventarioMateriaPrima, error) {

            if (error) {
                return resolve({ type: "EDITAR", data: null, error: error.message })
            }

            if (data["cantidad"]) {
                InventarioMateriaPrima.set("cantidad", data["cantidad"])
            }

            InventarioMateriaPrima.save().then((InventarioMateriaPrimaEditado) => {
                resolve({ type: "EDITAR", data: InventarioMateriaPrimaEditado, error: null })
            }, (error) => {
                resolve({ type: "EDITAR", data: null, error: error.message })
            })

        })
    })
}

exports.AsyncObtenerMateriaPrima = async (idMateriaPrima, callback) => {
    var Table = Parse.Object.extend("DMMateriaPrimaInventario")
    var query = new Parse.Query(Table)

    query.equalTo("objectId", idMateriaPrima)
    query.equalTo("exists", true)

    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.ImportarProveedores = async ( pathArchivo ) => {

    await exports.ConvertFileToUTF8( pathArchivo )

    var dataReturn = new Promise(function (resolve, reject) {
        var resultsObjectsCSV = []
        fs.createReadStream(path.resolve(__dirname, '../../../' + pathArchivo))
            .pipe(csvparser({
                skipLines: 1,
                headers: ['abbreviation', 'numid', 'name', 'rfc', 'rsBusiness', 'telephone', 'email', 'pweb', 'cbank', 'credit_days'],
            }))
            .on('data', (data) => {
                var Table = Parse.Object.extend("DMProveedores")
                var object = new Table()

                if( data["abbreviation"] ){
                    object.set("abreviatura", data["abbreviation"])
                }
                if( data["numid"] ){
                    object.set("folio", data["numid"])
                }
                if( data["name"] ){
                    object.set("nombre", data["name"])
                }
                if( data["rfc"] ){
                    object.set("rfc", data["rfc"])
                }
                if( data["rsBusiness"] ){
                    object.set("rsSocial", data["rsBusiness"])
                }
                if( data["telephone"] ){
                    object.set("telefono", data["telephone"])
                }
                if( data["email"] ){
                    object.set("correoElectronico", data["email"])
                }
                if( data["pweb"] ){
                    object.set("paginaWeb", data["pweb"])
                }
                if( data["cbank"] ){
                    object.set("cuentaBancaria", data["cbank"])
                }
                if( data["credit_days"] ){
                    object.set("diasCredito", data["credit_days"])
                }

                object.set("active", true)
                object.set("exists", true)

                resultsObjectsCSV.push(object)
            })
            .on('end', async () => {

                try {
                    var results = await exports.IterativeSaveData ( resultsObjectsCSV )
                } catch (error) {
                    log( error )
                    resolve( { type: "AGREGAR", data: null, error: error.error } )
                }
                resolve( { type: "AGREGAR", data: results.data, error: null } )

            })

    })
    return await dataReturn

}

exports.ObtenerTodosLosProveedores = function () {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerTodosLosProveedores(0, [], function (results, error) {
            if (error) {
                return resolve({ type: "CONSULTA", data: null, error: error.message })
            }
            resolve({ type: "CONSULTA", data: results, error: null })
        })
    })
}

exports.AsyncObtenerTodosLosProveedores = async (index, dataArray, callback) => {
    var Table = Parse.Object.extend("DMProveedores")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)
    query.skip(index * 1000)
    query.limit(1000)

    try {
        const results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            //callback(dataArray, null)
            exports.AsyncObtenerTodosLosProveedores((index+1), dataArray, callback)
        }
    } catch (error) {
        callback(dataArray, error)
    }
}

exports.EliminarProveedor = function (idProveedor) {
    return new Promise(function (resolve, reject) {
        exports.AsyncProveedor(idProveedor, function (proveedor, error) {
            if (error) {
                return resolve({ type: "ELIMINAR", data: null, error: error.message })
            }

            proveedor.set("active", false)
            proveedor.set("exists", false)

            proveedor.save().then((proveedorEliminado) => {
                resolve({ type: "ELIMINAR", data: proveedorEliminado, error: null })
            }, (error) => {
                resolve({ type: "ELIMINAR", data: null, error: error.message })
            })
        })
    })
}

exports.ArchivarProveedor = function (idProveedor, seActiva) {
    return new Promise(function (resolve, reject) {
        exports.AsyncProveedor(idProveedor, function (proveedor, error) {
            if (error) {
                return resolve({ type: "ARCHIVAR", data: null, error: error.message })
            }

            if (seActiva === "true") {
                proveedor.set("active", true)
            } else if (seActiva === "false") {
                proveedor.set("active", false)
            }

            proveedor.save().then((proveedorArchivado) => {
                resolve({ type: "ARCHIVAR", data: proveedorArchivado, error: null })
            }, (error) => {
                resolve({ type: "ARCHIVAR", data: null, error: error.message })
            })
        })
    })
}

exports.ActualizarProveedor = function (data) {
    return new Promise(function (resolve, reject) {
        exports.AsyncProveedor(data["objectId"], function (proveedor, error) {

            if (error) {
                return resolve({ type: "EDITAR", data: null, error: error.message })
            }

            if (data["abreviatura"]) {
                proveedor.set("abreviatura", data["abreviatura"])
            }
            if (data["nombre"]) {
                proveedor.set("nombre", data["nombre"])
            }
            if (data["rfc"]) {
                proveedor.set("rfc", data["rfc"])
            }
            if (data["rsSocial"]) {
                proveedor.set("rsSocial", data["rsSocial"])
            }
            if (data["telefono"]) {
                proveedor.set("telefono", data["telefono"])
            }
            if (data["correoElectronico"]) {
                proveedor.set("correoElectronico", data["correoElectronico"])
            }
            if (data["paginaWeb"]) {
                proveedor.set("paginaWeb", data["paginaWeb"])
            }
            if (data["cuentaBancaria"]) {
                proveedor.set("cuentaBancaria", data["cuentaBancaria"])
            }
            if (data["diasCredito"]) {
                proveedor.set("diasCredito", data["diasCredito"])
            }

            proveedor.save().then((proveedorEditado) => {
                resolve({ type: "EDITAR", data: proveedorEditado, error: null })
            }, (error) => {
                resolve({ type: "EDITAR", data: null, error: error.message })
            })


        })
    })
}

exports.AsyncProveedor = async (idProveedor, callback) => {
    var Table = Parse.Object.extend("DMProveedores")
    var query = new Parse.Query(Table)

    query.equalTo("objectId", idProveedor)
    query.equalTo("exists", true)

    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.ImportarClientes = async (pathArchivo) => {
    
    await exports.ConvertFileToUTF8( pathArchivo )

    var dataReturn =  new Promise(function (resolve, reject) {
        var resultsObjectsCSV = []
        fs.createReadStream(path.resolve(__dirname, '../../../' + pathArchivo))
            .pipe(csvparser({
                skipLines: 1,
                headers: ['name', 'lastName', 'lastNameMother', 'street', 'number', 'suburb', 'postalCode', 'city', 'state', 'phone', 'email', 'creditMoney', 'clientType'],
            }))
            .on('data', (data) => {
                var Table = Parse.Object.extend("DMClientes")
                var object = new Table()

                if( data["name"] ){
                    object.set("nombre", data["name"])
                }
                if( data["lastName"] ){
                    object.set("apellidoPaterno", data["lastName"])
                }
                if( data["lastNameMother"] ){
                    object.set("apellidoMaterno", data["lastNameMother"])
                }
                if( data["street"] ){
                    object.set("calle", data["street"])
                }
                if( data["number"] ){
                    object.set("numero", data["number"])
                }
                if( data["suburb"] ){
                    object.set("suburbio", data["suburb"])
                }
                if( data["postalCode"] ){
                    object.set("codigoPostal", data["postalCode"])
                }
                if( data["city"] ){
                    object.set("ciudad", data["city"])
                }
                if( data["state"] ){
                    object.set("estado", data["state"])
                }
                if( data["phone"] ){
                    object.set("telefono", data["phone"])
                }
                if( data["email"] ){
                    object.set("email", data["email"])
                }
                if( data["creditMoney"] ){
                    object.set("creditoMonetario", data["creditMoney"])
                }
                if( data["clientType"] ){
                    object.set("tipoCliente", data["clientType"])
                }

                object.set("active", true)
                object.set("exists", true)

                resultsObjectsCSV.push(object)
            })
            .on('end', async () => {

                try {
                    var results = await exports.IterativeSaveData ( resultsObjectsCSV )
                } catch (error) {
                    log( error )
                    resolve( { type: "AGREGAR", data: null, error: error.error } )
                }
                resolve( { type: "AGREGAR", data: results.data, error: null } )

            })

    })

    return await dataReturn
}

exports.IterativeSaveData = async ( data ) => {
    var dataToSave = []
    var dataReturn = []
    for (let i = 0; i < data.length; i++) {
        dataToSave.push( data[i] )
        if ( dataToSave.length == LIMIT_NUMBER_RESULTS || i == data.length-1 ) {
            try {
                var resultsTempo = await Parse.Object.saveAll( dataToSave )
                dataReturn.push.apply( dataReturn, resultsTempo )
                dataToSave = []
            } catch (error) {
                log( error )
                return { data: null, error: error.error }
            }
        }
    }
    return { data: dataReturn, error: null }
}

exports.ObtenerTodosLosClientes = function () {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerTodosLosClientes(0, [], function (results, error) {
            if (error) {
                return resolve({ type: "CONSULTA", data: null, error: error.message })
            }
            resolve({ type: "CONSULTA", data: results, error: null })
        })
    })
}

exports.AsyncObtenerTodosLosClientes = async (index, dataArray, callback) => {
    var Table = Parse.Object.extend("DMClientes")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)
    query.skip(index * 1000)
    query.limit(1000)

    try {
        const results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncObtenerTodosLosClientes((index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(dataArray, error)
    }
}

exports.EliminarCliente = function (idCliente) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerCliente(idCliente, function (cliente, error) {
            if (error) {
                return resolve({ type: "ELIMINAR", data: null, error: error.message })
            }

            cliente.set("active", false)
            cliente.set("exists", false)

            cliente.save().then((clienteEliminado) => {
                resolve({ type: "ELIMINAR", data: clienteEliminado, error: null })
            }, (error) => {
                resolve({ type: "ELIMINAR", data: null, error: error.message })
            })
        })
    })
}

exports.ArchivarCliente = function (idCliente, seActiva) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerCliente(idCliente, function (cliente, error) {
            if (error) {
                return resolve({ type: "ARCHIVAR", data: null, error: error.message })
            }

            if (seActiva === "true") {
                cliente.set("active", true)
            } else if (seActiva === "false") {
                cliente.set("active", false)
            }

            cliente.save().then((clienteArchivado) => {
                resolve({ type: "ARCHIVAR", data: clienteArchivado, error: null })
            }, (error) => {
                resolve({ type: "ARCHIVAR", data: null, error: error.message })
            })
        })
    })
}

exports.ActualizarCliente = function (data) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerCliente(data["objectId"], function (cliente, error) {
            if (error) {
                return resolve({ type: "EDITAR", data: null, error: error.message })
            }

            if (data["nombre"]) {
                cliente.set("nombre", data["nombre"])
            }
            if (data["apellidoPaterno"]) {
                cliente.set("apellidoPaterno", data["apellidoPaterno"])
            }
            if (data["apellidoMaterno"]) {
                cliente.set("apellidoMaterno", data["apellidoMaterno"])
            }
            if (data["calle"]) {
                cliente.set("calle", data["calle"])
            }
            if (data["numero"]) {
                cliente.set("numero", data["numero"])
            }
            if (data["suburbio"]) {
                cliente.set("suburbio", data["suburbio"])
            }
            if (data["codigoPostal"]) {
                cliente.set("codigoPostal", data["codigoPostal"])
            }
            if (data["ciudad"]) {
                cliente.set("ciudad", data["ciudad"])
            }
            if (data["estado"]) {
                cliente.set("estado", data["estado"])
            }
            if (data["telefono"]) {
                cliente.set("telefono", data["telefono"])
            }
            if (data["email"]) {
                cliente.set("email", data["email"])
            }
            if (data["creditoMonetario"]) {
                cliente.set("creditoMonetario", data["creditoMonetario"])
            }
            if (data["tipoCliente"]) {
                cliente.set("tipoCliente", data["tipoCliente"])
            }

            cliente.save().then((clienteEditado) => {
                resolve({ type: "EDITAR", data: clienteEditado, error: null })
            }, (error) => {
                resolve({ type: "EDITAR", data: null, error: error.message })
            })

        })
    })
}

exports.AsyncObtenerCliente = async (idCliente, callback) => {
    var Table = Parse.Object.extend("DMClientes")
    var query = new Parse.Query(Table)

    query.equalTo("objectId", idCliente)
    query.equalTo("exists", true)

    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.ImportarEmpleados = async ( pathArchivo, salaryTabulator ) => {

    await exports.ConvertFileToUTF8( pathArchivo )

    var dataReturn = new Promise(function (resolve, reject) {
        log("modelo")
        var resultsObjectsCSV = []
        fs.createReadStream(path.resolve(__dirname, '../../../' + pathArchivo))
            .pipe(csvparser({
                skipLines: 1,
                headers: ['employeeID', 'name', 'lastName', 'lastNameMother', 'startDay', 'imss', 'rfc', 'curp', 'civilState', 'sex', 'street', 'number', 'suburb', 'state', 'city', 'salaryHr', 'turn', 'email', 'phone', 'job', 'bornDate'],
            }))
            .on('data', (data) => {
                var Table = Parse.Object.extend("DMEmpleados")
                var object = new Table()

                object.set("idEmpleado", data["employeeID"])
                object.set("nombre", data["name"])
                object.set("apellidoPaterno", data["lastName"])
                object.set("apellidoMaterno", data["lastNameMother"])
                object.set("diaInicio", data["startDay"])
                object.set("imss", data["imss"])
                object.set("rfc", data["rfc"])
                object.set("curp", data["curp"])
                object.set("estadoCivil", data["civilState"])
                object.set("sexo", data["sex"])
                object.set("calle", data["street"])
                object.set("numero", data["number"])
                object.set("suburbio", data["suburb"])
                object.set("estado", data["state"])
                object.set("ciudad", data["city"])
                object.set("salarioHora", data["salaryHr"])
                object.set("giro", data["turn"])
                object.set("email", data["email"])
                object.set("telefono", data["phone"])
                object.set("trabajo", data["job"])
                object.set("fechaNacimiento", data["bornDate"])

                var Table     = Parse.Object.extend("DMSalaryTabulator")
                var objectTabulator    = new Table()
                    objectTabulator.id = salaryTabulator

                object.set("DMsalaryTabulatorPtr", objectTabulator)

                object.set("active", true)
                object.set("exists", true)

                resultsObjectsCSV.push(object)
            })
            .on('end', async () => {

                try {
                    var results = await exports.IterativeSaveData ( resultsObjectsCSV )
                } catch (error) {
                    log( error )
                    resolve( { type: "AGREGAR", data: null, error: error.error } )
                }
                resolve( { type: "AGREGAR", data: results.data, error: null } )

            })

    })

    return await dataReturn

}

exports.ObtenerTodosLosEmpleados = function () {
    return new Promise(function (resolve, reject) {
        exports.AsyncGetAllSalaryTabulator(0,[], function (resultsTabulator, error){
            exports.AsyncObtenerTodosLosEmpleados(0, [], function (results, error) {
                if (error) {
                    return resolve({ type: "CONSULTA", data: null, error: error.message })
                }
                resolve({ type: "CONSULTA", data: results, dataTabulator: resultsTabulator, error: null })
            })
        })
    })
}

exports.AsyncObtenerTodosLosEmpleados = async (index, dataArray, callback) => {
    var Table = Parse.Object.extend("DMEmpleados")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)
    query.includeAll()
    query.skip(index * 1000)
    query.limit(1000)

    try {
        const results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncObtenerTodosLosEmpleados((index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(dataArray, error)
    }
}

exports.EliminarEmpledo = function (idEmpleado) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerEmpleado(idEmpleado, function (empleado, error) {
            if (error) {
                return resolve({ type: "ELIMINAR", data: null, error: error.message })
            }

            empleado.set("active", false)
            empleado.set("exists", false)

            empleado.save().then((empleadoEliminado) => {
                resolve({ type: "ELIMINAR", data: empleadoEliminado, error: null })
            }, (error) => {
                resolve({ type: "ELIMINAR", data: null, error: error.message })
            })
        })
    })
}

exports.ArchivarEmpleado = function (idEmpleado, seActiva) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerEmpleado(idEmpleado, function (empleado, error) {
            if (error) {
                return resolve({ type: "ARCHIVAR", data: null, error: error.message })
            }

            if (seActiva === "true") {
                empleado.set("active", true)
            } else if (seActiva === "false") {
                empleado.set("active", false)
            }

            empleado.save().then((empleadoArchivado) => {
                resolve({ type: "ARCHIVAR", data: empleadoArchivado, error: null })
            }, (error) => {
                resolve({ type: "ARCHIVAR", data: null, error: error.message })
            })
        })
    })
}

exports.ActualizarEmpleado = function (data) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerEmpleado(data["objectId"], function (empleado, error) {

            if (error) {
                return resolve({ type: "EDITAR", data: null, error: error.message })
            }

            if (data["idEmpleado"]) {
                empleado.set("idEmpleado", data["idEmpleado"])
            }
            if (data["nombre"]) {
                empleado.set("nombre", data["nombre"])
            }
            if (data["apellidoPaterno"]) {
                empleado.set("apellidoPaterno", data["apellidoPaterno"])
            }
            if (data["apellidoMaterno"]) {
                empleado.set("apellidoMaterno", data["apellidoMaterno"])
            }
            if (data["diaInicio"]) {
                empleado.set("diaInicio", data["diaInicio"])
            }
            if (data["imss"]) {
                empleado.set("imss", data["imss"])
            }
            if (data["rfc"]) {
                empleado.set("rfc", data["rfc"])
            }
            if (data["curp"]) {
                empleado.set("curp", data["curp"])
            }
            if (data["estadoCivil"]) {
                empleado.set("estadoCivil", data["estadoCivil"])
            }
            if (data["sexo"]) {
                empleado.set("sexo", data["sexo"])
            }
            if (data["calle"]) {
                empleado.set("calle", data["calle"])
            }
            if (data["numero"]) {
                empleado.set("numero", data["numero"])
            }
            if (data["suburbio"]) {
                empleado.set("suburbio", data["suburbio"])
            }
            if (data["estado"]) {
                empleado.set("estado", data["estado"])
            }
            if (data["ciudad"]) {
                empleado.set("ciudad", data["ciudad"])
            }
            if (data["salarioHora"]) {
                empleado.set("salarioHora", data["salarioHora"])
            }
            if (data["giro"]) {
                empleado.set("giro", data["giro"])
            }
            if (data["email"]) {
                empleado.set("email", data["email"])
            }
            if (data["telefono"]) {
                empleado.set("telefono", data["telefono"])
            }
            if (data["trabajo"]) {
                empleado.set("trabajo", data["trabajo"])
            }
            if (data["fechaNacimiento"]) {
                empleado.set("fechaNacimiento", data["fechaNacimiento"])
            }

            empleado.save().then((empleadoEditado) => {
                resolve({ type: "EDITAR", data: empleadoEditado, error: null })
            }, (error) => {
                resolve({ type: "EDITAR", data: null, error: error.message })
            })

        })
    })
}

exports.AsyncObtenerEmpleado = async (idEmpleado, callback) => {
    var Table = Parse.Object.extend("DMEmpleados")
    var query = new Parse.Query(Table)

    query.equalTo("objectId", idEmpleado)
    query.equalTo("exists", true)

    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.ImportarGastos = async (pathArchivo) => {

    await exports.ConvertFileToUTF8( pathArchivo )

    var dataReturn =  new Promise(function (resolve, reject) {
        var resultsObjectsCSV = []
        fs.createReadStream(path.resolve(__dirname, '../../../' + pathArchivo))
            .pipe(csvparser({
                skipLines: 1,
                headers: ['account', 'import', 'period', 'type', 'percentage'],
            }))
            .on('data', (data) => {
                var Table = Parse.Object.extend("DMGastos")
                var object = new Table()

                if( data["account"] ){
                    object.set("cuenta", data["account"])
                }
                if( data["import"] ){
                    object.set("importar", data["import"])
                }
                if( data["period"] ){
                    object.set("periodo", data["period"])
                }
                if( data["type"] ){
                    object.set("tipo", data["type"])
                }
                if( data["percentage"] ){
                    object.set("porcentaje", data["percentage"])
                }

                object.set("active", true)
                object.set("exists", true)

                resultsObjectsCSV.push(object)
            })
            .on('end', async () => {

                try {
                    var results = await exports.IterativeSaveData ( resultsObjectsCSV )
                } catch (error) {
                    log( error )
                    resolve( { type: "AGREGAR", data: null, error: error.error } )
                }
                resolve( { type: "AGREGAR", data: results.data, error: null } )

            })

    })

    return await dataReturn
}

exports.ObtenerTodosLosGastos = function () {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerTodosLosGastos(0, [], function (results, error) {
            if (error) {
                return resolve({ type: "CONSULTA", data: null, error: error.message })
            }
            resolve({ type: "CONSULTA", data: results, error: null })
        })
    })
}

exports.AsyncObtenerTodosLosGastos = async (index, dataArray, callback) => {
    var Table = Parse.Object.extend("DMGastos")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)
    query.skip(index * 1000)
    query.limit(1000)

    try {
        const results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncObtenerTodosLosGastos((index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(dataArray, error)
    }
}

exports.EliminarGasto = function (idGasto) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerGastos(idGasto, function (gasto, error) {
            if (error) {
                return resolve({ type: "ELIMINAR", data: null, error: error.message })
            }

            gasto.set("active", false)
            gasto.set("exists", false)

            gasto.save().then((gastoEliminado) => {
                resolve({ type: "ELIMINAR", data: gastoEliminado, error: null })
            }, (error) => {
                resolve({ type: "ELIMINAR", data: null, error: error.message })
            })
        })
    })
}

exports.ArchivarGasto = function (idGasto, seActiva) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerGastos(idGasto, function (gasto, error) {
            if (error) {
                return resolve({ type: "ARCHIVAR", data: null, error: error.message })
            }

            if (seActiva === "true") {
                gasto.set("active", true)
            } else if (seActiva === "false") {
                gasto.set("active", false)
            }

            gasto.save().then((gastoArchivado) => {
                resolve({ type: "ARCHIVAR", data: gastoArchivado, error: null })
            }, (error) => {
                resolve({ type: "ARCHIVAR", data: null, error: error.message })
            })
        })
    })
}

exports.ActualizarGasto = function (data) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerGastos(data["objectId"], function (gasto, error) {
            if (error) {
                return resolve({ type: "EDITAR", data: null, error: error.message })
            }

            if (data["cuenta"]) {
                gasto.set("cuenta", data["cuenta"])
            }
            if (data["importar"]) {
                gasto.set("importar", data["importar"])
            }
            if (data["periodo"]) {
                gasto.set("periodo", data["periodo"])
            }
            if (data["tipo"]) {
                gasto.set("tipo", data["tipo"])
            }
            if (data["porcentaje"]) {
                gasto.set("porcentaje", data["porcentaje"])
            }

            gasto.save().then((gastoEditado) => {
                resolve({ type: "EDITAR", data: gastoEditado, error: null })
            }, (error) => {
                resolve({ type: "EDITAR", data: null, error: error.message })
            })


        })
    })
}

exports.AsyncObtenerGastos = async (idGasto, callback) => {
    var Table = Parse.Object.extend("DMGastos")
    var query = new Parse.Query(Table)

    query.equalTo("objectId", idGasto)
    query.equalTo("exists", true)

    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.ImportarActivosFijos = async ( pathArchivo ) => {

    await exports.ConvertFileToUTF8( pathArchivo )

    var dataReturn = new Promise(function (resolve, reject) {
        var resultsObjectsCSV = []
        fs.createReadStream(path.resolve(__dirname, '../../../' + pathArchivo))
            .pipe(csvparser({
                skipLines: 1,
                headers: ['name', 'description', 'model', 'costPrice', 'salePrice', 'serialNumber', 'brand', 'department', 'acquisitionDate', 'timelife', 'depreciation fee'],
            }))
            .on('data', (data) => {
                var Table = Parse.Object.extend("DMActivosFijos")
                var object = new Table()

                if( data["name"] ){
                    object.set("nombre", data["name"])
                }
                if( data["description"] ){
                    object.set("descripcion", data["description"])
                }
                if( data["model"] ){
                    object.set("modelo", data["model"])
                }
                if( data["costPrice"] ){
                    object.set("precioCosto", data["costPrice"])
                }
                if( data["salePrice"] ){
                    object.set("precioVenta", data["salePrice"])
                }
                if( data["serialNumber"] ){
                    object.set("numeroSerie", data["serialNumber"])
                }
                if( data["brand"] ){
                    object.set("marca", data["brand"])
                }
                if( data["department"] ){
                    object.set("departamento", data["department"])
                }
                if( data["acquisitionDate"] ){
                    object.set("fechaAdquisicion", data["acquisitionDate"])
                }
                if( data["timelife"] ){
                    object.set("tiempoVida", data["timelife"])
                }
                if( data["depreciation fee"] ){
                    object.set("tarifaDepreciacion", data["depreciation fee"])
                }

                object.set("active", true)
                object.set("exists", true)

                resultsObjectsCSV.push(object)
            })
            .on('end', async () => {

                try {
                    var results = await exports.IterativeSaveData ( resultsObjectsCSV )
                } catch (error) {
                    log( error )
                    resolve( { type: "AGREGAR", data: null, error: error.error } )
                }
                resolve( { type: "AGREGAR", data: results.data, error: null } )

            })

    })

    return await dataReturn
}

exports.ObtenerTodosLosActivosFijos = function () {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerTodosLosActivosFijos(0, [], function (results, error) {
            if (error) {
                return resolve({ type: "CONSULTA", data: null, error: error.message })
            }
            resolve({ type: "CONSULTA", data: results, error: null })
        })
    })
}

exports.AsyncObtenerTodosLosActivosFijos = async (index, dataArray, callback) => {
    var Table = Parse.Object.extend("DMActivosFijos")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)
    query.skip(index * 1000)
    query.limit(1000)

    try {
        const results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncObtenerTodosLosActivosFijos((index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(dataArray, error)
    }
}

exports.EliminarActivoFijo = function (idActivoFijo) {
    return new Promise(function (resolve, reject) {
        exports.AsyncActivoFijo(idActivoFijo, function (activoFijo, error) {
            if (error) {
                return resolve({ type: "ELIMINAR", data: null, error: error.message })
            }

            activoFijo.set("active", false)
            activoFijo.set("exists", false)

            activoFijo.save().then((activoFijoEliminado) => {
                resolve({ type: "ELIMINAR", data: activoFijoEliminado, error: null })
            }, (error) => {
                resolve({ type: "ELIMINAR", data: null, error: error.message })
            })
        })
    })
}

exports.ArchivarActivoFijo = function (idActivoFijo, seActiva) {
    return new Promise(function (resolve, reject) {
        exports.AsyncActivoFijo(idActivoFijo, function (activoFijo, error) {
            if (error) {
                return resolve({ type: "ARCHIVAR", data: null, error: error.message })
            }

            if (seActiva === "true") {
                activoFijo.set("active", true)
            } else if (seActiva === "false") {
                activoFijo.set("active", false)
            }

            activoFijo.save().then((activoFijoArchivado) => {
                resolve({ type: "ARCHIVAR", data: activoFijoArchivado, error: null })
            }, (error) => {
                resolve({ type: "ARCHIVAR", data: null, error: error.message })
            })
        })
    })
}

exports.ActualizarActivoFijo = function (data) {
    return new Promise(function (resolve, reject) {
        exports.AsyncActivoFijo(data["objectId"], function (activoFijo, error) {

            if (error) {
                return resolve({ type: "EDITAR", data: null, error: error.message })
            }

            if (data["nombre"]) {
                activoFijo.set("nombre", data["nombre"])
            }
            if (data["descripcion"]) {
                activoFijo.set("descripcion", data["descripcion"])
            }
            if (data["modelo"]) {
                activoFijo.set("modelo", data["modelo"])
            }
            if (data["precioCosto"]) {
                activoFijo.set("precioCosto", data["precioCosto"])
            }
            if (data["precioVenta"]) {
                activoFijo.set("precioVenta", data["precioVenta"])
            }
            if (data["numeroSerie"]) {
                activoFijo.set("numeroSerie", data["numeroSerie"])
            }
            if (data["marca"]) {
                activoFijo.set("marca", data["marca"])
            }
            if (data["departamento"]) {
                activoFijo.set("departamento", data["departamento"])
            }
            if (data["fechaAdquisicion"]) {
                activoFijo.set("fechaAdquisicion", data["fechaAdquisicion"])
            }
            if (data["tiempoVida"]) {
                activoFijo.set("tiempoVida", data["tiempoVida"])
            }
            if (data["tarifaDepreciacion"]) {
                activoFijo.set("tarifaDepreciacion", data["tarifaDepreciacion"])
            }

            activoFijo.save().then((activoFijoEditado) => {
                resolve({ type: "EDITAR", data: activoFijoEditado, error: null })
            }, (error) => {
                resolve({ type: "EDITAR", data: null, error: error.message })
            })

        })
    })
}

exports.AsyncActivoFijo = async (idActivoFijo, callback) => {
    var Table = Parse.Object.extend("DMActivosFijos")
    var query = new Parse.Query(Table)

    query.equalTo("objectId", idActivoFijo)
    query.equalTo("exists", true)

    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.ObtenerTodoInventarioActivosFijos = function () {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerInventarioActivosFijos(0, [], function (results, error) {
            if (error) {
                return resolve({ type: "AGREGAR", data: null, error: error.message })
            }
            resolve({ type: "AGREGAR", data: results, error: null })
        })
    })
}

exports.ActualizarInventarioActivosFijos = function (data) {

    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerInventarioActivosFijos(0, [], function (results, error) {
            
            var inventarioUpddate = []
            if (!error) {
                for (var key in data) {

                    var object = _.find(results, function (obj) {
                        return obj.get('activoFijoPtr').id == key
                    });

                    if (object != undefined) {
                        object.set("cantidad", data[key])
                    }else{
                        var Table  = Parse.Object.extend("DMActivosFijosInventario")
                            object = new Table()

                        var TableActivoFijo = Parse.Object.extend("DMActivosFijos")
                        var afPtr = new TableActivoFijo()
                            afPtr.id = key

                            object.set("activoFijoPtr", afPtr)
                            object.set("cantidad", data[key])
                            object.set("active", true)
                            object.set("exists", true)
                    }

                    inventarioUpddate.push(object)
                }

                Parse.Object.saveAll(inventarioUpddate).then((list) => {
                    resolve({ type: "AGREGAR", data: list, error: null })
                }, (error) => {
                    resolve({ type: "AGREGAR", data: null, error: error.message })
                })
            } else {
                resolve({ type: "AGREGAR", data: null, error: error.message })
            }
        })
    })
}

exports.AgregarBaseInventarioActivosFijos = function (data) {
    return new Promise(function (resolve, reject) {
        var inventario = []
        for (var key in data) {
            var cantidad = data[key]

            const Table = Parse.Object.extend("DMActivosFijosInventario")
            const object = new Table()

            var TableActivoFijo = Parse.Object.extend("DMActivosFijos")
            var afPtr = new TableActivoFijo()
            afPtr.id = key

            object.set("activoFijoPtr", afPtr)
            object.set("cantidad", cantidad)
            object.set("active", true)
            object.set("exists", true)

            inventario.push(object)
        }

        Parse.Object.saveAll(inventario).then((list) => {
            resolve({ type: "AGREGAR", data: list, error: null })
        }, (error) => {
            resolve({ type: "AGREGAR", data: null, error: error.message })
        })
    })
}

exports.AsyncObtenerInventarioActivosFijos = async (index, dataArray, callback) => {
    var Table = Parse.Object.extend("DMActivosFijosInventario")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)
    query.include("activoFijoPtr")
    query.skip(index * 1000)
    query.limit(1000)
    try {
        const results = await query.find()
        if (results.length <= 0) {
            //console.log("Finaliza")
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            //console.log("Avanzando")
            exports.AsyncObtenerInventarioActivosFijos((index + 1), dataArray, callback)
        }
    } catch (error) {
        //throw new Error(error)
        callback(dataArray, error)
    }

}

exports.ObtenerTotalAsyncInventarioActivosFijos = function () {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerTotalInventarioActivosFijos(function (total, error) {
            if (error) {
                return resolve({ type: "CONTAR", data: null, error: error.message })
            }
            resolve({ type: "CONTAR", data: total, error: null })
        })
    })
}

exports.AsyncObtenerTotalInventarioActivosFijos = async (callback) => {
    var Table = Parse.Object.extend("DMActivosFijosInventario")
    var query = new Parse.Query(Table)
    query.equalTo("exists", true)

    try {
        const results = await query.count()
        callback(results, null)
    } catch (error) {
        //throw new Error(error)
        callback(null, error)
    }
}

exports.ActualizarInventarioActivosFijo = function (data) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerInventarioActivoFijo(data["objectId"], function (inventario, error) {

            if (error) {
                return resolve({ type: "EDITAR", data: null, error: error.message })
            }

            if (data["cantidad"]) {
                inventario.set("cantidad", data["cantidad"])
            }

            inventario.save().then((inventarioEditado) => {
                resolve({ type: "EDITAR", data: inventarioEditado, error: null })
            }, (error) => {
                resolve({ type: "EDITAR", data: null, error: error.message })
            })

        })
    })
}

exports.AsyncObtenerInventarioActivoFijo = async (idInventarioActivoFijo, callback) => {
    var Table = Parse.Object.extend("DMActivosFijosInventario")
    var query = new Parse.Query(Table)

    query.equalTo("objectId", idInventarioActivoFijo)
    query.equalTo("exists", true)

    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.ObtenerHistoricoOrdenes = function () {
    return new Promise(function (resolve, reject) {
        log("here in consult ")
        exports.AsyncObtenerHistoricoOrdenes(0, [], function (results, error) {
            if (!error) {
                resolve({ type: "CONSULTA", data: results, error: null })
            } else {
                resolve({ type: "CONSULTA", data: results, error: error.message })
            }
        })
    })
}

exports.AsyncObtenerHistoricoOrdenes = async (index, dataArray, callback) => {
    log("here in recursive " + index)
    var Table = Parse.Object.extend("DMOrderHistory")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)
    query.include("productoPtr")    
    query.skip(index * 1000)
    query.limit(1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncObtenerHistoricoOrdenes((index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(dataArray, error)
    }
}

exports.AgregarHistoricoOrdenes = function(data) {
    return new Promise(function (resolve, reject) {
        console.log("here")
        const Table = Parse.Object.extend("DMOrderHistory")
        const object = new Table()

        console.log("data body", data)

        const ProductoFamila = Parse.Object.extend("DMProductoFamilia")
        const producto = new ProductoFamila()
        producto.id = data["products"] 

        object.set("productoPtr", producto)
        object.set("quantity", parseInt(data["qty"]))
        object.set("active", true)
        object.set("exists", true)

        object.save().then((order) => {
            resolve({ type: "AGREGAR", data: order, error: null })
        }, (error) => {
            resolve({ type: "AGREGAR", data: null, error: error.message })
        })
    })
}

exports.ObtenerTodaLosProvedoresMateriaPrima = function () {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerTodaLosProvedoresMateriaPrima(0, [], function (results, error) {
            if (error) {
                return resolve({ type: "CONSULTA", data: null, error: error.message })
            }
            resolve({ type: "CONSULTA", data: results, error: null })
        })
    })
}

exports.AsyncObtenerTodaLosProvedoresMateriaPrima = async (index, dataArray, callback) => {
    var Table = Parse.Object.extend("DMProveedoresMP")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)
    query.include('proveedorPtr')
    query.include('materiaPrimaPtr')
    query.skip(index * 1000)
    query.limit(1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncObtenerTodaLosProvedoresMateriaPrima((index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(dataArray, error)
    }
}

exports.AgregarProvedoreMateriaPrima = function (data) {
log(data)
    return new Promise(function (resolve, reject) {

        var primerEntrada = true
        var arregloDatosForm = []
        var arregloIdsMateriales = []

        var Proveedor = Parse.Object.extend("DMProveedores")
        var proveedor = new Proveedor()

        for (let key in data) {

            if (primerEntrada) {

                primerEntrada = false
                proveedor.id = data[key]

            } else {

                if (data[key].length == 3) {

                    var Table = Parse.Object.extend("DMProveedoresMP")
                    var object = new Table()

                    var MateriaPrima = Parse.Object.extend("DMMateriaPrima")
                    var materiaPrima = new MateriaPrima()
                    materiaPrima.id = data[key][0]

                    object.set("proveedorPtr", proveedor)
                    object.set("materiaPrimaPtr", materiaPrima)
                    object.set("costo", data[key][1])
                    object.set("cantidadMinima", data[key][2])

                    object.set("exists", true)
                    object.set("active", true)

                    arregloIdsMateriales.push(materiaPrima)
                    arregloDatosForm.push(object)

                }
            }
        }

        exports.AsyncObtenerProveedorMateriasPrimas(proveedor, arregloIdsMateriales, function (resultadoProvedoresMaterais, error) {
            log(resultadoProvedoresMaterais)
            log(error)
            if (error) {
                return resolve({ type: "AGREGAR", data: null, error: error.message })
            }

            var arregloAgregarNuvosPMP = []
            var arregloActualizarPMP = []

            arregloDatosForm.forEach(element => {
                var noeExiste = false
                resultadoProvedoresMaterais.forEach(element2 => {
                    if (element.get("materiaPrimaPtr").id == element2.get("materiaPrimaPtr").id) {

                        element2.set("costo", element.get("costo"))
                        element2.set("cantidadMinima", element.get("cantidadMinima"))
                        element2.set("active", true)

                        arregloActualizarPMP.push(element2)

                        noeExiste = true
                    }
                });
                if (!noeExiste) {
                    arregloAgregarNuvosPMP.push(element)
                }
            });

            Parse.Object.saveAll(arregloAgregarNuvosPMP).then((resultsAgregarNuvosPMP) => {

                Parse.Object.saveAll(arregloActualizarPMP).then((resultsActualizarPMP) => {
                    resultsActualizarPMP.push(resultsAgregarNuvosPMP)
                    resolve({ type: "AGREGAR", data: resultsActualizarPMP, error: null })
                }, (error) => {
                    resolve({ type: "AGREGAR", data: null, error: error.message })
                })

            }, (error) => {
                resolve({ type: "AGREGAR", data: null, error: error.message })
            })

        })
    })
}

exports.AsyncObtenerProveedorMateriasPrimas = async (idPreoveedor, idsMateriasles, callback) => {
    var Table = Parse.Object.extend("DMProveedoresMP")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)
    query.equalTo("proveedorPtr", idPreoveedor)
    query.containedIn("materiaPrimaPtr", idsMateriasles)

    try {
        var results = await query.find()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }

}

exports.EliminarProvedoreMateriaPrima = function (idProvedoreMateriaPrima) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerProveedorMateriaPrima(idProvedoreMateriaPrima, function (ProvedoreMateriaPrima, error) {
            if (error) {
                return resolve({ type: "ELIMINAR", data: null, error: error.message })
            }

            ProvedoreMateriaPrima.set("active", false)
            ProvedoreMateriaPrima.set("exists", false)

            ProvedoreMateriaPrima.save().then((ProvedoreMateriaPrimaEliminado) => {
                resolve({ type: "ELIMINAR", data: ProvedoreMateriaPrimaEliminado, error: null })
            }, (error) => {
                resolve({ type: "ELIMINAR", data: null, error: error.message })
            })
        })
    })
}

exports.ArchivarProvedoreMateriaPrima = function (idProvedoreMateriaPrima, seActiva) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerProveedorMateriaPrima(idProvedoreMateriaPrima, function (ProvedoreMateriaPrima, error) {
            if (error) {
                return resolve({ type: "ARCHIVAR", data: null, error: error.message })
            }

            if (seActiva === "true") {
                ProvedoreMateriaPrima.set("active", true)
            } else if (seActiva === "false") {
                ProvedoreMateriaPrima.set("active", false)
            }

            ProvedoreMateriaPrima.save().then((ProvedoreMateriaPrimaArchivado) => {
                resolve({ type: "ARCHIVAR", data: ProvedoreMateriaPrimaArchivado, error: null })
            }, (error) => {
                resolve({ type: "ARCHIVAR", data: null, error: error.message })
            })
        })
    })
}

exports.ActualizarProvedoreMateriaPrima = function (data) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerProveedorMateriaPrima(data["objectId"], function (ProvedoreMateriaPrima, error) {

            if (error) {
                return resolve({ type: "EDITAR", data: null, error: error.message })
            }

            if (data["costo"]) {
                ProvedoreMateriaPrima.set("costo", data["costo"])
            }

            if (data["cantidadMinima"]) {
                ProvedoreMateriaPrima.set("cantidadMinima", data["cantidadMinima"])
            }

            ProvedoreMateriaPrima.save().then((ProvedoreMateriaPrimaEditado) => {
                resolve({ type: "EDITAR", data: ProvedoreMateriaPrimaEditado, error: null })
            }, (error) => {
                resolve({ type: "EDITAR", data: null, error: error.message })
            })

        })
    })
}

exports.AsyncObtenerProveedorMateriaPrima = async (idProvedoreMateriaPrima, callback) => {
    var Table = Parse.Object.extend("DMProveedoresMP")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)
    query.equalTo("objectId", idProvedoreMateriaPrima)
    try {
        const results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }

}

exports.ImportarProveedoresMateriasPrimas = async (pathArchivo) => {

    await exports.ConvertFileToUTF8( pathArchivo )

    var dataReturn = new Promise(function (resolve, reject) {

        var resultsObjectsCSV = []
        var arregloFolios = []
        var arregloNoparte = []

        fs.createReadStream(path.resolve(__dirname, '../../../' + pathArchivo))
            .pipe(csvparser({
                skipLines: 1,
                headers: ['numid', 'part_number', 'cost', 'minimum_order_quantity'],
            }))
            .on('data', async (data) => {

                var Table = Parse.Object.extend("DMProveedoresMP")
                var object = new Table()

                if( data["numid"] ){
                    object.set("folio", data["numid"])
                }
                if( data["part_number"] ){
                    object.set("numerParte", data["part_number"])
                }
                if( data["cost"] ){
                    object.set("costo", await exports.ConvertNumber( data["cost"] ))
                }
                if( data["minimum_order_quantity"] ){
                    object.set("cantidadMinima", data["minimum_order_quantity"])
                }

                object.set("active", true)
                object.set("exists", true)

                if( data["numid"] ){
                    arregloFolios.push( data["numid"] )
                }
                if( data["part_number"] ){
                    arregloNoparte.push( data["part_number"] )
                }
                resultsObjectsCSV.push(object)

            })
            .on('end', async () => {

                try {
                    var resultsTempo = await exports.IterativeSearchSuppliersRawMaterial( arregloFolios, arregloNoparte )
                    var results = resultsTempo.data
                } catch (error) {
                    log( error )
                    return { data: null, error: error.error }
                }

                var arregloConFolio   = []
                var arregloActualizar = []
                resultsObjectsCSV.forEach(element => {
                    var existe = false
                    results.forEach(element2 => {
                        if (element.get("folio") == element2.get("proveedorPtr").get("folio") && element.get("numerParte") == element2.get("materiaPrimaPtr").get("noparte")) {
                            element2.set("costo", element.get("costo"))
                            element2.set("cantidadMinima", element.get("cantidadMinima"))
                            element2.set("active", true)
                            arregloActualizar.push(element2)
                            existe = true
                        }
                    });

                    if (!existe) { arregloConFolio.push(element) }
                });

                try {
                    var provedoresTempo = await exports.IterativeSearchSuppliersForInvoice( arregloFolios )
                    var provedores = provedoresTempo.data

                    var materiasPrimasTempo = await exports.IterativeSearchRawMaterialForNumberPart( arregloNoparte )
                    var materiasPrimas = materiasPrimasTempo.data
                } catch (error) {
                    log( error )
                    return { data: null, error: error.error }
                }

                var arregloAgreggarNuevos = []
                    arregloConFolio.forEach(element => {
                        var idPreoveedor = _.find(provedores, function (obj) {
                            return obj.get('folio') == element.get("folio")
                        });

                        var idMateriaPrima = _.find(materiasPrimas, function (obj) {
                            return obj.get('noparte') == element.get("numerParte")
                        });

                        delete element.set("folio")
                        delete element.set("numerParte")

                        element.set("proveedorPtr", idPreoveedor)
                        element.set("materiaPrimaPtr", idMateriaPrima)

                        arregloAgreggarNuevos.push(element)
                    });

                try {

                    var datosNuevosTempo = await exports.IterativeSaveData ( arregloAgreggarNuevos )
                    var datosNuevos = datosNuevosTempo.data

                    var datosActualizadosTempo = await exports.IterativeSaveData ( arregloActualizar )
                    var datosActualizados = datosActualizadosTempo.data
                        datosActualizados.push(datosNuevos)

                } catch (error) {
                    log( error )
                    resolve( { type: "AGREGAR", data: null, error: error.error } )
                }
                resolve( { type: "AGREGAR", data: datosActualizados, error: null } )

            })

    })
    return await dataReturn

}

exports.ConvertNumber = async ( number ) => { 
    var numeroReturn = ''
    for (let index = 0; index < number.length; index++) {
        if( number.charAt( index ) != '$' && number.charAt( index ) != ',' ){
            numeroReturn += number.charAt( index )
        }
    }
    return numeroReturn
}

exports.IterativeSearchSuppliersRawMaterial = async ( folios, numerosMaterias ) => {
    var Table = Parse.Object.extend( "DMProveedoresMP" )
    var query = new Parse.Query( Table )

    var count = 0
    try {
        var count = await query.count()
    } catch (error) {
        log( error )
        return { data: null, error: error.error }
    }

    var results = []
    var noQueries = Math.ceil( count / LIMIT_NUMBER_RESULTS )

    for (let i = 0; i < noQueries; i++) {

        var DMProveedores = Parse.Object.extend("DMProveedores")
        var matchesQueryProveedores = new Parse.Query(DMProveedores)
            matchesQueryProveedores.equalTo("exists", true)
            matchesQueryProveedores.containedIn("folio", folios)

        var DMMateriaPrima = Parse.Object.extend("DMMateriaPrima")
        var matchesQueryMateriaPrima = new Parse.Query(DMMateriaPrima)
            matchesQueryMateriaPrima.equalTo("exists", true)
            matchesQueryMateriaPrima.containedIn("noparte", numerosMaterias)

            query.equalTo("exists", true)
            query.matchesQuery("proveedorPtr", matchesQueryProveedores)
            query.matchesQuery("materiaPrimaPtr", matchesQueryMateriaPrima)
            query.include("proveedorPtr")
            query.include("materiaPrimaPtr")
            query.limit( LIMIT_NUMBER_RESULTS )
            query.skip( i * LIMIT_NUMBER_RESULTS )

        try {
            var tempResult = await query.find()
            results.push.apply( results, tempResult )
        } catch (error) {
            log( error )
            return { results: null, error: error.error }
        }
    }
    return { data: results, error: null }
}

exports.IterativeSearchSuppliersForInvoice = async ( folios ) => {

    var Table = Parse.Object.extend("DMProveedores")
    var query = new Parse.Query(Table)

    var count = 0
    try {
        var count = await query.count()
    } catch (error) {
        log( error )
        return { data: null, error: error.error }
    }

    var results = []
    var noQueries = Math.ceil( count / LIMIT_NUMBER_RESULTS )

    for (let i = 0; i < noQueries; i++) {

        query.equalTo("exists", true)
        query.containedIn("folio", folios)
        query.limit( LIMIT_NUMBER_RESULTS )
        query.skip( i * LIMIT_NUMBER_RESULTS )

        try {
            var tempResult = await query.find()
            results.push.apply( results, tempResult )
        } catch (error) {
            log( error )
            return { results: null, error: error.error }
        }

    }
    return { data: results, error: null }

}
exports.IterativeSearchRawMaterialForNumberPart = async ( numeroParte ) => {

    var Table = Parse.Object.extend("DMMateriaPrima")
    var query = new Parse.Query(Table)

    var count = 0
    try {
        var count = await query.count()
    } catch (error) {
        log( error )
        return { data: null, error: error.error }
    }

    var results = []
    var noQueries = Math.ceil( count / LIMIT_NUMBER_RESULTS )

    for (let i = 0; i < noQueries; i++) {

        query.equalTo("exists", true)
        query.containedIn("noparte", numeroParte)
        query.limit( LIMIT_NUMBER_RESULTS )
        query.skip( i * LIMIT_NUMBER_RESULTS )

        try {
            var tempResult = await query.find()
            results.push.apply( results, tempResult )
        } catch (error) {
            log( error )
            return { results: null, error: error.error }
        }

    }
    return { data: results, error: null }

}

exports.AsyncBuscarProvedoresMateriasPrias = async (folios, numerosMaterias, index, dataArray, callback) => {

    var DMProveedores = Parse.Object.extend("DMProveedores")
    var matchesQueryProveedores = new Parse.Query(DMProveedores)
    matchesQueryProveedores.equalTo("exists", true)
    matchesQueryProveedores.containedIn("folio", folios)

    var DMMateriaPrima = Parse.Object.extend("DMMateriaPrima")
    var matchesQueryMateriaPrima = new Parse.Query(DMMateriaPrima)
    matchesQueryMateriaPrima.equalTo("exists", true)
    matchesQueryMateriaPrima.containedIn("noparte", numerosMaterias)

    var Table = Parse.Object.extend("DMProveedoresMP")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)
    query.matchesQuery("proveedorPtr", matchesQueryProveedores)
    query.matchesQuery("materiaPrimaPtr", matchesQueryMateriaPrima)
    query.include("proveedorPtr")
    query.include("materiaPrimaPtr")
    query.skip(index * 1000)
    query.limit(1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncBuscarProvedoresMateriasPrias(folios, numerosMaterias, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(dataArray, error)
    }
}

exports.AsycBucarProveedoresPorFolios = async (folios, index, dataArray, callback) => {
    var Table = Parse.Object.extend("DMProveedores")
    var query = new Parse.Query(Table)
    query.equalTo("exists", true)
    query.containedIn("folio", folios)
    query.skip(index * 1000)
    query.limit(1000)

    try {
        const results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsycBucarProveedoresPorFolios(folios, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(dataArray, error)
    }
}

exports.AsycBucarMateriaPrimaPorNumeroParte = async (numeroParte, index, dataArray, callback) => {
    var Table = Parse.Object.extend("DMMateriaPrima")
    var query = new Parse.Query(Table)
    query.equalTo("exists", true)
    query.containedIn("noparte", numeroParte)
    query.skip(index * 1000)
    query.limit(1000)

    try {
        const results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsycBucarMateriaPrimaPorNumeroParte(numeroParte, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(dataArray, error)
    }
}

exports.ObtenerTodosLosPaises = function () {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerPaises(0, [], function (results, error) {
            if (error) {
                return resolve({ type: "CONSULTA", data: null, error: error.message })
            }
            resolve({ type: "CONSULTA", data: results, error: null })
        })
    })
}

exports.AsyncObtenerPaises = async (index, dataArray, callback) => {
    var Table = Parse.Object.extend("DMPaises")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)
    query.equalTo("paisEnvio", true)
    query.skip(index * 1000)
    query.limit(1000)

    try {
        const results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncObtenerPaises((index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(dataArray, error)
    }

}

exports.AsyncBuscarPaise = async (abreviatura, callback) => {
    log(abreviatura)
    var Table = Parse.Object.extend("DMPaises")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)
    query.equalTo("abreviatura", abreviatura)

    try {
        const results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.AgregarTransporte = function (data) {
    return new Promise(function (resolve, reject) {
        exports.AsyncBuscarPaise(data["paisPtr"], function (resultPais, error) {
            var Table = Parse.Object.extend("DMProveedores")
            var idPreoveedor = new Table()
            idPreoveedor.id = data["proveedorPtr"]

            var Table = Parse.Object.extend("DMMateriaPrima")
            var idMateriaPrima = new Table()
            idMateriaPrima.id = data["productoPtr"]

            exports.AsyncBuscarTransporte(idPreoveedor, idMateriaPrima, resultPais, data["tipoEnvio"], function (results, error) {
                if (error) {
                    return resolve({ type: "AGREGAR", data: null, error: error.message })
                }

                if (results != undefined) {
                    data["objectId"] = results.id;
                    exports.ActualizarTransporteEcontrado(data).then(function (result2) {

                        if (result2.error) {
                            return resolve({ type: "AGREGAR", data: null, error: error.message })
                        }
                        resolve({ type: "AGREGAR", data: result2.data, error: null })

                    })

                } else {

                    var Table = Parse.Object.extend("DMTransporte")
                    var transporte = new Table()

                    if (data["paisPtr"]) {
                        transporte.set("paisPtr", resultPais)
                    }
                    if (data["productoPtr"]) {
                        transporte.set("productoPtr", idMateriaPrima)
                    }
                    if (data["proveedorPtr"]) {
                        transporte.set("proveedorPtr", idPreoveedor)
                    }
                    if (data["tipoEnvio"]) {
                        transporte.set("tipoEnvio", data["tipoEnvio"])
                    }
                    if (data["precio"]) {
                        transporte.set("precio", data["precio"])
                    }
                    if (data["porcentajePrecio"]) {
                        transporte.set("porcentajePrecio", data["porcentajePrecio"])
                    }
                    if (data["cantidadMax"]) {
                        transporte.set("cantidadMax", data["cantidadMax"])
                    }
                    if (data["cantidadMin"]) {
                        transporte.set("cantidadMin", data["cantidadMin"])
                    }
                    if (data["lugarSalida"]) {
                        transporte.set("lugarSalida", data["lugarSalida"])
                    }
                    if (data["lugarDestino"]) {
                        transporte.set("lugarDestino", data["lugarDestino"])
                    }
                    if (data["diasEntrega"]) {
                        transporte.set("diasEntrega", data["diasEntrega"])
                    }
                    if (data["urgente"]) {
                        transporte.set("urgente", true)
                    } else {
                        transporte.set("urgente", false)
                    }

                    transporte.set("exists", true)
                    transporte.set("active", true)

                    transporte.save().then((result) => {
                        resolve({ type: "AGREGAR", data: result, error: null })
                    }, (error) => {
                        resolve({ type: "AGREGAR", data: null, error: error.message })
                    })

                }


            })
        })

    })
}

exports.ActualizarTransporteEcontrado = function (data) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerTransporte(data["objectId"], function (transporte, error) {
            if (error) {
                return resolve({ type: "EDITAR", data: null, error: error.message })
            }

            if (data["tipoEnvio"]) {
                transporte.set("tipoEnvio", data["tipoEnvio"])
            }
            if (data["precio"]) {
                transporte.set("precio", data["precio"])
            }
            if (data["porcentajePrecio"]) {
                transporte.set("porcentajePrecio", data["porcentajePrecio"])
            }
            if (data["cantidadMax"]) {
                transporte.set("cantidadMax", data["cantidadMax"])
            }
            if (data["cantidadMin"]) {
                transporte.set("cantidadMin", data["cantidadMin"])
            }
            if (data["lugarSalida"]) {
                transporte.set("lugarSalida", data["lugarSalida"])
            }
            if (data["lugarDestino"]) {
                transporte.set("lugarDestino", data["lugarDestino"])
            }
            if (data["diasEntrega"]) {
                transporte.set("diasEntrega", data["diasEntrega"])
            }
            if (data["urgente"]) {
                transporte.set("urgente", true)
            } else {
                transporte.set("urgente", false)
            }

            transporte.set("active", true)
            transporte.set("exists", true)

            transporte.save().then((transporteEditado) => {
                resolve({ type: "EDITAR", data: transporteEditado, error: null })
            }, (error) => {
                resolve({ type: "EDITAR", data: null, error: error.message })
            })

        })
    })
}

exports.AsyncBuscarTransporte = async (idProveedor, idMateriaPrima, idPais, tipoEnvio, callback) => {
    var Table = Parse.Object.extend("DMTransporte")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)
    query.equalTo("proveedorPtr", idProveedor)
    query.equalTo("productoPtr", idMateriaPrima)
    query.equalTo("paisPtr", idPais)
    query.equalTo("tipoEnvio", tipoEnvio)

    try {
        const result = await query.first()
        callback(result, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.ObtenertodosLosTransportes = function () {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenertodosLosTransportes(0, [], function (results, error) {
            if (error) {
                return resolve({ type: "CONSULTA", data: null, error: error.message })
            }
            resolve({ type: "CONSULTA", data: results, error: null })
        })
    })
}

exports.AsyncObtenertodosLosTransportes = async (index, dataArray, callback) => {
    var Table = Parse.Object.extend("DMTransporte")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)
    query.include("paisPtr")
    query.include("productoPtr")
    query.include("proveedorPtr")
    query.skip(index * 1000)
    query.limit(1000)

    try {
        const results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncObtenertodosLosTransportes((index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(dataArray, error)
    }

}

exports.EliminarTransporte = function (idTransporte) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerTransporte(idTransporte, function (trasnporte, error) {
            if (error) {
                return resolve({ type: "ELIMINAR", data: null, error: error.message })
            }

            trasnporte.set("active", false)
            trasnporte.set("exists", false)

            trasnporte.save().then((trasnporteEliminado) => {
                resolve({ type: "ELIMINAR", data: trasnporteEliminado, error: null })
            }, (error) => {
                resolve({ type: "ELIMINAR", data: null, error: error.message })
            })
        })
    })
}

exports.ArchivarTransporte = function (idTransporte, seActiva) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerTransporte(idTransporte, function (transporte, error) {
            if (error) {
                return resolve({ type: "ARCHIVAR", data: null, error: error.message })
            }

            if (seActiva === "true") {
                transporte.set("active", true)
            } else if (seActiva === "false") {
                transporte.set("active", false)
            }

            transporte.save().then((transporteArchivado) => {
                resolve({ type: "ARCHIVAR", data: transporteArchivado, error: null })
            }, (error) => {
                resolve({ type: "ARCHIVAR", data: null, error: error.message })
            })
        })
    })
}

exports.ActualizarTransporte = function (data) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerTransporte(data["objectId"], function (transporte, error) {

            if (error) {
                return resolve({ type: "EDITAR", data: null, error: "'An error occurred while performing the action" })
            }

            var Table = Parse.Object.extend("DMProveedores")
            var idPreoveedor = new Table()
            idPreoveedor.id = data["proveedor"]

            var Table = Parse.Object.extend("DMMateriaPrima")
            var idMateriaPrima = new Table()
            idMateriaPrima.id = data["producto"]

            var Table = Parse.Object.extend("DMPaises")
            var idPais = new Table()
            idPais.id = data["pais"]

            exports.AsyncBuscarTransporte(idPreoveedor, idMateriaPrima, idPais, data["tipoEnvio"], function (results, error) {

                if (error) {
                    return resolve({ type: "EDITAR", data: null, error: "'An error occurred while performing the action" })
                }

                if (results != null) {
                    if (data["objectId"] != results.id) {
                        if (data["tipoEnvio"] == results.get("tipoEnvio")) {
                            return resolve({ type: "EDITAR", data: null, error: "This item already exists with the same shipping type" })
                        }
                    }
                }

                if (data["tipoEnvio"]) {
                    transporte.set("tipoEnvio", data["tipoEnvio"])
                }
                if (data["precio"]) {
                    transporte.set("precio", data["precio"])
                }
                if (data["porcentajePrecio"]) {
                    transporte.set("porcentajePrecio", data["porcentajePrecio"])
                }
                if (data["cantidadMax"]) {
                    transporte.set("cantidadMax", data["cantidadMax"])
                }
                if (data["cantidadMin"]) {
                    transporte.set("cantidadMin", data["cantidadMin"])
                }
                if (data["lugarSalida"]) {
                    transporte.set("lugarSalida", data["lugarSalida"])
                }
                if (data["lugarDestino"]) {
                    transporte.set("lugarDestino", data["lugarDestino"])
                }
                if (data["diasEntrega"]) {
                    transporte.set("diasEntrega", data["diasEntrega"])
                }
                if (data["urgente"]) {
                    transporte.set("urgente", true)
                } else {
                    transporte.set("urgente", false)
                }

                transporte.set("productoPtr", idMateriaPrima)
                transporte.set("active", true)
                transporte.set("exists", true)

                transporte.save().then((transporteEditado) => {
                    resolve({ type: "EDITAR", data: transporteEditado, error: null })
                }, (error) => {
                    resolve({ type: "EDITAR", data: null, error: error.message })
                })
            })
        })
    })
}

exports.AsyncObtenerTransporte = async (objectId, callback) => {
    var Table = Parse.Object.extend("DMTransporte")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)
    query.equalTo("objectId", objectId)

    try {
        const result = await query.first()
        callback(result, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.GetAllSalaryTabulator = function(){
    return new Promise(function (resolve, reject) {
        exports.AsyncGetAllSalaryTabulator(0, [], function (results, error){
            if(error){return resolve({ type: "CONSULTA", data: null, error: error.message })}
            resolve({ type: "CONSULTA", data: results, error: null})
        })
    })
}

exports.AsyncGetAllSalaryTabulator = async (index, dataArray,callback) =>{
    var Table = Parse.Object.extend("DMSalaryTabulator")
    var query = new Parse.Query(Table)

    query.equalTo("exists",true)
    query.equalTo("active",true)
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetAllSalaryTabulator( (index + 1), dataArray, callback )
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.UpdateSalaryTabulator = function(salaryTabulatorPtr, salary){
    return new Promise(function (resolve, reject) {
        exports.AsyncGetSalaryTabulator(salaryTabulatorPtr, function (results, error){
            if(error){return resolve({ type: "ACTUALIZAR", data: null, error: error.message })}
            results.set("salary",salary)
            results.save().then((resultSave)=>{
                resolve({ type: "ACTUALIZAR", data: resultSave, error: null})
            }, (error)=>{
                resolve({ type: "ACTUALIZAR", data: null, error: error.message})
            })
        })
    })
}

exports.AsyncGetSalaryTabulator = async (salaryTabulatorPtr, callback) => {
    var Table = Parse.Object.extend("DMSalaryTabulator")
    var query = new Parse.Query(Table)

    query.equalTo("objectId",salaryTabulatorPtr)
    query.equalTo("exists",true)
    query.equalTo("active",true)

    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.GetProductionLinePhases = function (){
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerTodosLosActivosFijos(0, [], function (resultsFixedAssets, error) {
            if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message })}
            exports.AsyncGetAllProductionLinePhases ( 0, [], function (resultsPhases, error) {
                if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message })}
                
                exports.AsyncGetAllSalaryTabulator( 0, [], function (resultsSalaryTabulator, error) {
                    var arrayPhases = []
                    for (let i = 0; i < resultsPhases.length; i++) {
                        var arrayFixedAssets = []
                        var phases = resultsPhases[i].get("fixedAssetDMPtr")
                        for (const key in phases) {
                                let  fixedAsset = _.find( resultsFixedAssets, function ( currentDate ){
                                return currentDate.id == key
                            })
                            arrayFixedAssets.push(fixedAsset)
                        }
                        var json = {
                                        'phase': resultsPhases[i],
                                        'fixedAssets': arrayFixedAssets
                                    }
                        arrayPhases.push(json)
                    }
                    resolve({ type: "CONSULTA", data: arrayPhases, dataFixedAsset: resultsFixedAssets, dataTabulator: resultsSalaryTabulator, error: null })
                })
            })
        })
    })
}

exports.AsyncGetAllProductionLinePhases = async ( index, dataArray, callback ) => {
    var Table = Parse.Object.extend("DMProductionLinePhases")
    var query = new Parse.Query(Table)

    query.equalTo("exists",true)
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if(results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetAllProductionLinePhases( (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.SaveProductionLinePhases = function ( data ) {
     return new Promise(function (resolve, reject) {
        exports.AsyncNameProductionLinePhase ( data["name"], function (results, error) {
            if(error){return resolve({ type: "AGREGAR", data: null, error: error.message })}
            if(results != undefined){ return resolve({ type: "AGREGAR", data: null, error: "The name of this pahase already exists" })}

            var namePhase = data["name"]
            var description = data["description"]
            //var quantityEmployees = data["quantityEmployees"]
            var hoursfinishPhase = data["hoursfinishPhase"]
            var employees       = data["employees"]
            var jsonEmployes    = {}

            for (const key in employees) {
                log(key)
                if( employees[key].length > 1 ) {
                    jsonEmployes[key] = Number(employees[key][1])
                }
            }
            
            delete data['name'];
            //delete data['quantityEmployees'];
            delete data['employees'];
            delete data['hoursfinishPhase'];
            delete data["description"]
            var jsonFixedAssets = {}
            for (const key in data) {
                if( data[key].length > 1 ) {
                    jsonFixedAssets[key] = Number(data[key][1])
                }
            }
            
            var Table = Parse.Object.extend("DMProductionLinePhases")
            var object = new Table()

            if(description){
                object.set("description",description)
            }
                object.set("name",namePhase)
                object.set("fixedAssetDMPtr",jsonFixedAssets)
                object.set("quantityEmployees",jsonEmployes)
                object.set("hoursFinishPhase",Number(hoursfinishPhase))
                object.set("exists",true)
                object.set("active",true)

            object.save().then((result) => {
                resolve({ type: "AGREGAR", data: result, error: null })
            },(error) => {
                resolve({ type: "AGREGAR", data: null, error: error.message })
            })

        })
     })
}

exports.AsyncNameProductionLinePhase = async ( name, callback ) => {
    var Table = Parse.Object.extend("DMProductionLinePhases")
    var query = new Parse.Query(Table)

    query.equalTo("name",name)
    query.equalTo("exists", true)

    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.ArchiveProductionLinePhase = function ( objectPtr, seActiva ) {
    return new Promise(function (resolve, reject) {
        exports.AsyncSearchProductionLinePhase ( objectPtr,function (result, error) {
            if (error) { return resolve({ type: "ARCHIVAR", data: null, error: error.message })}

            if (seActiva === "true") {
                result.set("active", true)
            } else if (seActiva === "false") {
                result.set("active", false)
            }

            result.save().then((resultPhase)=>{
                resolve({ type: "ARCHIVAR", data: resultPhase, error: null })
            }, (error) => {
                resolve({ type: "ARCHIVAR", data: null, error: error.message })
            })
        })
    })
}

exports.DeleteProductionLinePhase = function (objectPtr) {
    return new Promise(function (resolve, reject) {
        exports.AsyncSearchProductionLinePhase ( objectPtr,function (result, error) {
            if (error) { return resolve({ type: "ARCHIVAR", data: null, error: error.message })}

            result.set("exists",false)
            result.set("active",false)
            result.save().then((resultPhase)=>{
                resolve({ type: "ARCHIVAR", data: resultPhase, error: null })
            }, (error) => {
                resolve({ type: "ARCHIVAR", data: null, error: error.message })
            })
        })
    })
}

exports.AsyncSearchProductionLinePhase = async ( objectPtr, callback) => {
    var Table = Parse.Object.extend("DMProductionLinePhases")
    var query = new Parse.Query(Table)

        query.equalTo("objectId",objectPtr)
        query.equalTo("exists",true)
    
    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.EditProductionLinePhase = function (data) {
    return new Promise(function (resolve, reject) {
        exports.AsyncSearchProductionLinePhase ( data["objectId"], function (result, error) {
            if (error) { return resolve({ type: "ARCHIVAR", data: null, error: error.message })}
            var name             = data["name"]
            //var quantityEmployees  = data["quantityEmployees"]
            var employees  = data["employees"]
            var hoursfinishPhase = data["hoursfinishPhase"]
            var description = data["description"]
            
            var jsoEmployees = {}
            for (const key in employees) {
                jsoEmployees[key] = Number(employees[key])
            }
            delete data['name']
            delete data['employees']
            delete data['objectId']
            delete data['hoursfinishPhase'];
            delete data["description"]

            var jsonFixedAssets = {}
            for (const key in data) {
                jsonFixedAssets[key] = Number(data[key])
            }

            //if(description){
                result.set("description",description)
            //}
                result.set("name",name)
                result.set("fixedAssetDMPtr",jsonFixedAssets)
                result.set("quantityEmployees",jsoEmployees)
                result.set("hoursFinishPhase",Number(hoursfinishPhase))
            
            result.save().then((resultPhase)=>{
                resolve({ type: "ARCHIVAR", data: resultPhase, error: null })
            }, (error) => {
                resolve({ type: "ARCHIVAR", data: null, error: error.message })
            })
        })
    })
}

exports.SaveProductionLineTemplate = function ( data ) {
    return new Promise(function (resolve, reject) {
        exports.AsyncGetAllProductionLinePhases(0, [], function (resultsPhases, error){
            exports.AsyncNameProductionLineTemplate ( data["name"], function (results, error) {
                if(error){return resolve({ type: "AGREGAR", data: null, error: error.message })}
                if(results != undefined){ return resolve({ type: "AGREGAR", data: null, error: "The name of this tamplate already exists" })}
                var dataPhases = data["phases"]
                var phases = []
                var hoursPhases = []
                var QuantityFixedAsset = []
                var hoursFinalProduct = 0
                
                for (const key in dataPhases) {
                    hoursFinalProduct += parseInt(dataPhases[key])
                    phases.push(key)
                    hoursPhases.push(Number(dataPhases[key]))

                    var dataPhase = _.find(resultsPhases, function (obj){
                        return obj.id == key
                    }) 

                    QuantityFixedAsset.push(dataPhase.get("fixedAssetDMPtr"))
                }
                
                var Table = Parse.Object.extend("DMProductionLineTemplates")
                var object = new Table()

                var ProductFamily = Parse.Object.extend("DMProductoFamilia")
                var productFamily = new ProductFamily()
                    productFamily.id = data["productFamilyDMPtr"]

                object.set("name",data["name"])
                object.set("efficiencyPercentage",Number( data["efficiencyPercentage"] ))
                object.set("productionQuantity",Number( data["productionQuantity"] ))
                object.set("productFamilyDMPtr",productFamily)
                object.set("phases",phases)
                object.set("hoursFinalProduct",Number(hoursFinalProduct))
                object.set("hoursPhases",hoursPhases)
                object.set("quantityFixedAssets",QuantityFixedAsset)
                object.set("exists",true)
                object.set("active",true)

                object.save().then((result) => {
                    resolve({ type: "AGREGAR", data: result, error: null })
                },(error) => {
                    resolve({ type: "AGREGAR", data: null, error: error.message })
                })

            })
        })
    })
}

exports.AsyncNameProductionLineTemplate = async ( name, callback ) => {
    var Table = Parse.Object.extend("DMProductionLineTemplates")
    var query = new Parse.Query(Table)

    query.equalTo("name",name)
    query.equalTo("exists", true)

    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.GetAllProdcutionLineTemplates = function () {
    return new Promise(function (resolve, reject) {
        exports.AsyncGetAllProductionLineTemplates ( 0, [], function (resultsTemplates, error) {
            if(error){ return resolve({ type: "CONSULTA", data: null, error: error.message }) }
            exports.AsyncGetAllProductionLinePhasesTemplates ( 0, [], function (resultsPhases, error) {
                if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message }) }
                exports.AsyncObtenerTodosLosProductos ( 0, [], function (resultsProductFamily, error){ 
                    if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message }) }
                    exports.AsyncObtenerTodosLosActivosFijos(0, [], function (resultsFixedAssets, error) {
                        if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message }) }
                        exports.AsyncGetAllSalaryTabulator( 0, [], function (resultsSalaryTabulator, error) {
                            if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message }) }

                            var arrayTemplates = []
                            for (let i = 0; i < resultsTemplates.length; i++) {

                                var phases          = []
                                var phasesTemplates = resultsTemplates[i].get("phases") 
                                
                                for (let j = 0; j < phasesTemplates.length; j++) {
                                    let phase = _.find( resultsPhases, function ( current ) {
                                                return current.id == phasesTemplates[j]
                                            })
                                    if (phase != undefined) {
                                        phases.push(phase)
                                    }
                                }
                                var json =  {
                                                'phases'    : phases,
                                                'templates' : resultsTemplates[i]
                                            }
                                arrayTemplates.push(json)
                            }

                            var jsonTabulatorAndFixed = {
                                                            "fixedAssets":resultsFixedAssets,
                                                            "tabulator":resultsSalaryTabulator
                                                        }
                            
                            resolve({ type: "CONSULTA", data: arrayTemplates, dataProductFamily: resultsProductFamily, dataPhases: resultsPhases, dataTabulatorFixedAssets: jsonTabulatorAndFixed, error: null })
                        })
                    })
                })
            })
        })
    })
}

exports.AsyncGetAllProductionLineTemplates = async ( index, dataArray, callback ) => {
    var Table = Parse.Object.extend("DMProductionLineTemplates")
    var query = new Parse.Query(Table)

        query.equalTo("exists",true)
        query.include("productFamilyDMPtr")
        query.limit(1000)
        query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetAllProductionLineTemplates ( (index + 1), dataArray, callback )
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetAllProductionLinePhasesTemplates = async ( index, dataArray, callback ) => {
    var Table = Parse.Object.extend("DMProductionLinePhases")
    var query = new Parse.Query(Table)

        query.equalTo("exists",true)
        query.limit(1000)
        query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetAllProductionLinePhasesTemplates ( (index + 1), dataArray, callback )
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.ArchiveProductionLineTemplate = function ( objectPtr, seActiva ) {
    
    return new Promise(function (resolve, reject) {
        exports.AsyncSearchProductionLineTemplate ( objectPtr,function (result, error) {
            if (error) { return resolve({ type: "ARCHIVAR", data: null, error: error.message })}

            if (seActiva === "true") {
                result.set("active", true)
            } else if (seActiva === "false") {
                result.set("active", false)
            }

            result.save().then((resultPhase)=>{
                resolve({ type: "ARCHIVAR", data: resultPhase, error: null })
            }, (error) => {
                resolve({ type: "ARCHIVAR", data: null, error: error.message })
            })
        })
    })
}

exports.DeleteProductionLineTemplate = function (objectPtr) {
    return new Promise(function (resolve, reject) {
        exports.AsyncSearchProductionLineTemplate ( objectPtr,function (result, error) {
            if (error) { return resolve({ type: "ARCHIVAR", data: null, error: error.message })}

            result.set("exists",false)
            result.set("active",false)
            result.save().then((resultPhase)=>{
                resolve({ type: "ARCHIVAR", data: resultPhase, error: null })
            }, (error) => {
                resolve({ type: "ARCHIVAR", data: null, error: error.message })
            })
        })
    })
}

exports.AsyncSearchProductionLineTemplate = async ( objectPtr, callback) => {
    var Table = Parse.Object.extend("DMProductionLineTemplates")
    var query = new Parse.Query(Table)

        query.equalTo("objectId",objectPtr)
        query.equalTo("exists",true)
    
    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.EditProductionLineTemplate = function (data) {
    return new Promise(function (resolve, reject) {
        exports.AsyncSearchProductionLineTemplate ( data["objectId"], function (result, error) {
            if (error) { return resolve({ type: "ARCHIVAR", data: null, error: error.message })}
            log(data)

            var ProductFamily = Parse.Object.extend("DMProductoFamilia")
            var productFamily = new ProductFamily()
               productFamily.id = data["productFamilyDMPtr"] 

            result.set("name",data["name"])
            result.set("productFamilyDMPtr",productFamily)
            result.set("hoursFinalProduct",data["hoursFinalProduct"])
            result.set("efficiencyPercentage",Number( data["efficiencyPercentage"] ))
            result.set("productionQuantity",Number( data["productionQuantity"] ))

            result.save().then((resultTemplate)=>{
                resolve({ type: "ARCHIVAR", data: resultTemplate, error: null })
            }, (error) => {
                resolve({ type: "ARCHIVAR", data: null, error: error.message })
            })
            
        })
    })
}

exports.ImportRawMaterial = async ( dataBody, pathArchivo ) => {

    await exports.ConvertFileToUTF8( pathArchivo )
    
    var dataReturn = new Promise( async (resolve, reject) => {

        var rawMaterialCategoryTempo = await exports.GetRawMaterialCategory()
        var rawMaterialCategory      = rawMaterialCategoryTempo.data
        var resultsObjectsCSV        = []

        fs.createReadStream(path.resolve(__dirname, '../../../' + pathArchivo))
            .pipe(csvparser({
                skipLines: 1,
                headers: ['PartNumber', 'SKU', 'RawMaterialName', 'RawMaterialCategory'], 
            }))
            .on('data', (data) => {

                var Table = Parse.Object.extend("DMMateriaPrima")
                var object = new Table()
                if( data["RawMaterialCategory"] ) {

                    var ptrCategory  = undefined
                    var categoryFind = true
                    
                    switch ( data["RawMaterialCategory"].toUpperCase() ) {
                        case 'PLASTICS':
                            ptrCategory = _.find( rawMaterialCategory, function( current ){
                                                    return current.get("abreviatura") == "P"
                                                })
                            break;
                        case 'METALS':
                            ptrCategory = _.find( rawMaterialCategory, function( current ){
                                                    return current.get("abreviatura") == "M"
                                                })
                            break;
                        case 'SCREWS':
                            ptrCategory = _.find( rawMaterialCategory, function( current ){
                                                    return current.get("abreviatura") == "T"
                                                })
                            break;
                        case 'TIRES':
                            ptrCategory = _.find( rawMaterialCategory, function( current ){
                                                    return current.get("abreviatura") == "L"
                                                })
                            break;
                        default:
                            categoryFind = false
                            break;
                    }

                    if( categoryFind == true ){
                        if( data["PartNumber"] ){
                            object.set("noparte", data["PartNumber"])
                        }
                        if( data["SKU"] ){
                            object.set("codigo", data["SKU"])
                        }
                        if( data["RawMaterialName"] ){
                            object.set("nombre", data["RawMaterialName"])
                        }
                        /*if(dataBody["categoriaPtr"]){
                            var objectCategoria = Parse.Object.extend("DMMateriaPrimaCategoria")
                            var catPtr          = new objectCategoria()
                                catPtr.id       = dataBody["categoriaPtr"]
                            object.set("categoriaPtr",catPtr)
                        }*/
                        object.set("categoriaPtr", ptrCategory )

                        object.set("active", true)
                        object.set("exists", true)

                        resultsObjectsCSV.push(object)
                    }
                }

            })
            .on('end', async () => {

                try {
                    var results = await exports.IterativeSaveData ( resultsObjectsCSV )
                } catch (error) {
                    log( error )
                    resolve( { type: "AGREGAR", data: null, error: error.error } )
                }
                resolve( { type: "AGREGAR", data: results.data, error: null } )

            })

    })
    return await dataReturn

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

exports.GetRawMaterialCategory = async () => {
    
    var Table = Parse.Object.extend( "DMMateriaPrimaCategoria" )
    var query = new Parse.Query( Table )

    var count = 0
    try {
        count = await query.count()
    } catch (error) {
        log( error )
        return { data: null, error: error.error }
    }

    var results = []
    var noQueries = Math.ceil( count / LIMIT_NUMBER_RESULTS )
    for (let i = 0; i < noQueries; i++) {
        query.equalTo( "exists", true )
        query.equalTo( "active", true )

        query.limit( LIMIT_NUMBER_RESULTS )
        query.skip( i * LIMIT_NUMBER_RESULTS )

        try {
            var resultsTempo = await query.find()
                results.push.apply( results, resultsTempo )
        } catch (error) {
            log( error )
            return { data: null, error: error.error }
        }
    }
    return { data: results, error: null }

}

exports.restartEmployees = async () => {
    log("restablecer modelo")
    try {
        var EmployeesSalaryPtrNotFoundTempo = await exports.GetAllData( "DMEmpleados" )
        var EmployeesSalaryPtrNotFound = EmployeesSalaryPtrNotFoundTempo.data
        var DMSalaryTabulatorTempo = await exports.GetAllData( "DMSalaryTabulator" )
        var DMSalaryTabulator = DMSalaryTabulatorTempo.data
    } catch (error) {
        log( error )
        return { data: null, error: error.error }
    }

    var SaveEmployeesSalaryPtrNotFound = _.filter( EmployeesSalaryPtrNotFound, function(current){
        return current.get("DMsalaryTabulatorPtr") == undefined
    })

    var index = 0
    for (let i = 0; i < SaveEmployeesSalaryPtrNotFound.length; i++) {
        if( DMSalaryTabulator.length-1 == i ){
            index = 0
        }
        SaveEmployeesSalaryPtrNotFound[i].set( "DMsalaryTabulatorPtr", DMSalaryTabulator[index] )
        index++
    }
    log(SaveEmployeesSalaryPtrNotFound.length)
    var EmployeesSalaryPtrEmpty = _.filter( EmployeesSalaryPtrNotFound, function(current){
        return current.get("DMsalaryTabulatorPtr").get("area") == undefined
    })

    log(EmployeesSalaryPtrEmpty.length)
    var index = 0
    for (let i = 0; i < EmployeesSalaryPtrEmpty.length; i++) {
        if( DMSalaryTabulator.length-1 == i ){
            index = 0
        }
        EmployeesSalaryPtrEmpty[i].set( "DMsalaryTabulatorPtr", DMSalaryTabulator[index] )
        index++
    }

    try {
        var resultSave = await Parse.Object.saveAll( SaveEmployeesSalaryPtrNotFound )
        var resultSave2 = await Parse.Object.saveAll( EmployeesSalaryPtrEmpty )
    } catch (error) {
        log( error )
        return { data: null, error: error.error }
    }
    resultSave.push( resultSave2 )
    return { data: resultSave, error: null }
}

exports.GetAllData = async ( Table ) => {
    
    var Table = Parse.Object.extend( Table )
    var query = new Parse.Query( Table )

    var count = 0
    try {
        count = await query.count()
    } catch (error) {
        log( error )
        return { data: null, error: error.error }
    }

    var results = []
    var noQueries = Math.ceil( count / LIMIT_NUMBER_RESULTS )
    for (let i = 0; i < noQueries; i++) {
        query.equalTo( "exists", true )
        query.equalTo( "active", true )
        query.includeAll()

        query.limit( LIMIT_NUMBER_RESULTS )
        query.skip( i * LIMIT_NUMBER_RESULTS )

        try {
            var resultsTempo = await query.find()
                results.push.apply( results, resultsTempo )
        } catch (error) {
            log( error )
            return { data: null, error: error.error }
        }
    }
    return { data: results, error: null }

}