var path = require('path')
var fs = require('fs')
var _ = require('underscore')
var Promise = require('promise')
var request = require('request')
var csvparser = require("csv-parser")

var log = console.log
var siglaTabla = "SDM"
var LIMIT_NUMBER_RESULTS = 1000

log("en el modelo de masterdatsimulacion")

//var FunctionsGeneral = require(path.join(__dirname, '../../functions/general.js'));

var Parse = require('parse/node');
const { object, functions } = require('underscore')
const { type } = require('os')

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
        exports.AsyncObtenerTodaLaMateriaPrima(0, [], function (results, error) {
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

/**
 * Función que permite conexión con controladores y manda llamar la función asíncrona para obtener todos 
 * los usuarios de administración que hay en el sistema
 *
 * @memberof ModeloUsuariosAdmin
 * @returns {Promise<Object>} JSON con el tipo de consulta, los datos de vuelta y el error en caso de existir
 */
exports.ObtenerTodosLosProductos = function (simulacion) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerTodosLosProductos(0, [], simulacion, function (results, error) {
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
exports.AsyncObtenerTodosLosProductos = async (index, dataArray, simulacion, callback) => {
    var Table = Parse.Object.extend(""+siglaTabla+"ProductoFamilia")
    var query = new Parse.Query(Table)
    query.equalTo("exists", true)
    if(siglaTabla == "SDM") {
        var Simulaciones = Parse.Object.extend("Simulations")
        var simulacionPtr = new Simulaciones()
        simulacionPtr.id = simulacion
        query.equalTo("simulationPtr", simulacionPtr)
    }
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
            exports.AsyncObtenerTodosLosProductos((index + 1), dataArray, simulacion, callback)
        }
    } catch (error) {
        //throw new Error(error)
        callback(dataArray, error)
    }
} 

exports.AgregarProductoFamilia = function (data, simulacion, pathArchivo, pathArchivoVideo) {
    var Simulaciones = Parse.Object.extend("Simulations")
    var simulacionPtr = new Simulaciones()
    simulacionPtr.id = simulacion
    return new Promise( async (resolve, reject) => {
        var rawMaterialSave = data['rawMaterials']; 
        const Table = Parse.Object.extend(""+siglaTabla+"ProductoFamilia")
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
            var transportTempo = await exports.IterativeGetData( "SDMTransporte", simulacionPtr )
            var transport = transportTempo.data
            var SuppliersRawMaterialTempo = await exports.IterativeGetData( "SDMProveedoresMP", simulacionPtr )
            var SuppliersRawMaterial = SuppliersRawMaterialTempo.data
        } catch (error) {
            log(error)
            resolve({ type: "AGREGAR", data: null, error: error.error })
        }

        var notTransport = []

        for (let i = 0; i < arrayRawMaterial.length; i++) {
            var notFound = _.find(transport, function(current){
                //log(current.get("productoPtr").id +"== "+ arrayRawMaterial[i])
                return current.get("productoPtr").id == arrayRawMaterial[i]
            })
            if(!notFound){
                notTransport.push(arrayRawMaterial[i])
            }
        }
        //log(notTransport)

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
            if(siglaTabla == "SDM") {
            
                object.set("simulationPtr", simulacionPtr)
            }
            
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

exports.IterativeGetData = async ( nameTable, simulationPtr ) => {

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
        query.equalTo( "simulationPtr", simulationPtr)

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
    var Table = Parse.Object.extend(""+siglaTabla+"ProductoFamilia")
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

exports.ArchiveVariousDataProductFamily = function(data, simulationPtr){
    var Simulations             = Parse.Object.extend("Simulations")
    var pointerToSimulation     = new Simulations()
        pointerToSimulation.id  = simulationPtr
    //log( data, simulationPtr)
    return new Promise(function (resolve, reject) {
        //if(Object.entries(data).length > 0){
            var dataTempo = data.objectId
            var arraySearch = []
            for (const key in dataTempo) {
                arraySearch.push(dataTempo[key])
            }
            //log(pointerToSimulation)
            exports.AsyncGetAllProductFamilyToSave(pointerToSimulation, 0, [], function (results, error){
                if(error){return resolve({ type: "ELIMINAR", data: null, error: error.message })}
                for (let i = 0; i < results.length; i++) {
                    var activateDataFound = _.find(arraySearch,function(currentData){
                        //log(currentData +" == "+ results[i].id)
                        return currentData == results[i].id
                    })
                    //log(deactivateDataFound)
                    if(activateDataFound){
                        //log('encontrado')
                        results[i].set("active",true)
                    }else{
                        results[i].set("active",false)
                    }

                }
                Parse.Object.saveAll(results).then((resultSave)=>{
                    exports.AsyncGetAllTDProductFamilyToSave(pointerToSimulation, 0, [], function (resultsTDPF, error){
                        if(error){return resolve({ type: "ELIMINAR", data: null, error: error.message })}
                        
                        for (let i = 0; i < resultsTDPF.length; i++) {
                            var activateTDPF = _.find(arraySearch,function(currentData){
                                return currentData == resultsTDPF[i].get("SMDproductoFamiliaPtr").id
                            })
                            
                            if(activateTDPF){
                                resultsTDPF[i].set("active",true)
                            }else{
                                resultsTDPF[i].set("active",false)
                            }
                        }

                        Parse.Object.saveAll(resultsTDPF).then((resultSaveTDPF)=>{
                                resolve({ type: "AGREGAR", data: resultSave, error: null })
                            }, (error)=>{
                                resolve({ type: "AGREGAR", data: null, error: error.message })
                            })
                    })                    
                }, (error)=>{
                    resolve({ type: "AGREGAR", data: null, error: error.message })
                })
                
            })
        /*]}else{
            resolve({ type: "ACTUALIZAR", data: null, error: "There is no data to update "})
        }*/
    })
}

exports.AsyncGetAllProductFamilyToSave = async (pointerToSimulation, index, dataArray, callback)=>{
    var Table = Parse.Object.extend("SDMProductoFamilia")
    var query = new Parse.Query(Table)
        
        query.equalTo("simulationPtr",pointerToSimulation)
        query.equalTo("exists", true)
        query.limit(1000)
        query.skip(index * 1000)
    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetAllProductFamilyToSave(pointerToSimulation, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
        
}

exports.AsyncGetAllTDProductFamilyToSave = async (pointerToSimulation, index, dataArray, callback)=>{
    var Table = Parse.Object.extend("TDProductoFamilia")
    var query = new Parse.Query(Table)
        
        query.equalTo("simulationPtr",pointerToSimulation)
        query.equalTo("exists", true)
        query.include("SMDproductoFamiliaPtr")
        query.limit(1000)
        query.skip(index * 1000)
    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetAllTDProductFamilyToSave(pointerToSimulation, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
        
}

exports.AddVideoProductoFamily = function (simulationPtr,objectIdFamilyProduct, pathVideos) {
    var Simulations             = Parse.Object.extend("Simulations")
    var pointerToSimulation     = new Simulations()
        pointerToSimulation.id  = simulationPtr
    return new Promise(function (resolve, reject) {
        exports.AsyncGetProductFamily(pointerToSimulation,objectIdFamilyProduct, function(result, error){
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

exports.DeleteVideoProductoFamily = function (simulationPtr, objectIdFamilyProduct, pathVideo) {
    var Simulations             = Parse.Object.extend("Simulations")
    var pointerToSimulation     = new Simulations()
        pointerToSimulation.id  = simulationPtr
    return new Promise(function (resolve, reject) {
        exports.AsyncGetProductFamily(pointerToSimulation, objectIdFamilyProduct, function(result, error){
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

exports.AsyncGetProductFamily = async (pointerToSimulation, objectId, callback) => {
    var Table = Parse.Object.extend(""+siglaTabla+"ProductoFamilia")
    var query = new Parse.Query(Table)
        query.equalTo("simulationPtr",pointerToSimulation)
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
exports.ObtenerTodosElInventario = function (simulacion) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerTodosElInventario(0, [], simulacion, function (results, error) {
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
exports.ObtenerTotalDeInventario = function (simulacion) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerTotalDeInventario(simulacion, function (total, error) {
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
exports.AsyncObtenerTotalDeInventario = async (simulacion, callback) => {
    var Table = Parse.Object.extend(""+siglaTabla+"MateriaPrimaInventario")
    var query = new Parse.Query(Table)
    query.equalTo("exists", true)

    if(siglaTabla == "SDM") {
        var Simulaciones = Parse.Object.extend("Simulations")
        var simulacionPtr = new Simulaciones()
        simulacionPtr.id = simulacion
        query.equalTo("simulationPtr", simulacionPtr)
    }

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
exports.AsyncObtenerTodosElInventario = async (index, dataArray, simulacion, callback) => {
    var Table = Parse.Object.extend(""+siglaTabla+"MateriaPrimaInventario")
    var query = new Parse.Query(Table)
    query.equalTo("exists", true)
    if(siglaTabla == "SDM") {
        var Simulaciones = Parse.Object.extend("Simulations")
        var simulacionPtr = new Simulaciones()
        simulacionPtr.id = simulacion
        query.equalTo("simulationPtr", simulacionPtr)
    }
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
            exports.AsyncObtenerTodosElInventario((index + 1), dataArray, simulacion, callback)
        }
    } catch (error) {
        //throw new Error(error)
        callback(dataArray, error)
    }
}

exports.AgregarBaseInventario = function (data, simulacion) {
    return new Promise(function (resolve, reject) {
        var inventario = []

        for (var key in data) {
            var quantity = data[key]

            const Table = Parse.Object.extend(""+siglaTabla+"MateriaPrimaInventario")
            const object = new Table()

            var TableMP = Parse.Object.extend("DMMateriaPrima")
            var mpPtr = new TableMP()
            mpPtr.id = key

            object.set("materaPrimaPtr", mpPtr)
            object.set("cantidad", quantity)
            object.set("active", true)
            object.set("exists", true)

            if(siglaTabla == "SDM") {
                var Simulaciones = Parse.Object.extend("Simulations")
                var simulacionPtr = new Simulaciones()
                simulacionPtr.id = simulacion
                object.set("simulationPtr", simulacionPtr)
            }

            inventario.push(object)
        }

        Parse.Object.saveAll(inventario).then((list) => {
            resolve({ type: "AGREGAR", data: list, error: null })
        }, (error) => {
            resolve({ type: "AGREGAR", data: null, error: error.message })
        })
    })
}

exports.ActualizarBaseInventario = function (data, simulacion) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerTodosElInventario(0, [], simulacion, function (results, error) {
            var inventarioUpddate = []
            if (!error) {
                for (var key in data) {
                    var object = _.find(results, function (obj) {
                        return obj.get('materaPrimaPtr').id == key
                    });

                    object.set("cantidad", data[key])

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
    var Table = Parse.Object.extend(""+siglaTabla+"MateriaPrimaInventario")
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

exports.ImportarProveedores = function (simulacion, pathArchivo) {
    return new Promise(function (resolve, reject) {
        var resultsObjectsCSV = []
        fs.createReadStream(path.resolve(__dirname, '../../../' + pathArchivo))
            .pipe(csvparser({
                skipLines: 1,
                headers: ['abbreviation', 'numid', 'name', 'rfc', 'rsBusiness', 'telephone', 'email', 'pweb', 'cbank', 'credit_days'],
            }))
            .on('data', (data) => {
                var Table = Parse.Object.extend(""+siglaTabla+"Proveedores")
                var object = new Table()

                object.set("abreviatura", data["abbreviation"])
                object.set("folio", data["numid"])
                object.set("nombre", data["name"])
                object.set("rfc", data["rfc"])
                object.set("rsSocial", data["rsBusiness"])
                object.set("telefono", data["telephone"])
                object.set("correoElectronico", data["email"])
                object.set("paginaWeb", data["pweb"])
                object.set("cuentaBancaria", data["cbank"])
                object.set("diasCredito", data["credit_days"])
                object.set("active", true)
                object.set("exists", true)

                if(siglaTabla == "SDM") {
                    var Simulaciones = Parse.Object.extend("Simulations")
                    var simulacionPtr = new Simulaciones()
                    simulacionPtr.id = simulacion
                    object.set("simulationPtr", simulacionPtr)
                }

                resultsObjectsCSV.push(object)
            })
            .on('end', () => {

                Parse.Object.saveAll(resultsObjectsCSV).then((result) => {
                    resolve({ type: "AGREGAR", data: result, error: null })
                }, (error) => {
                    resolve({ type: "AGREGAR", data: null, error: error.message })
                })

            })

    })
}

exports.ObtenerTodosLosProveedores = function (simulacion) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerTodosLosProveedores(0, [], simulacion, function (results, error) {
            if (error) {
                return resolve({ type: "CONSULTA", data: null, error: error.message })
            }
            resolve({ type: "CONSULTA", data: results, error: null })
        })
    })
}

exports.AsyncObtenerTodosLosProveedores = async (index, dataArray, simulacion, callback) => {
    var Table = Parse.Object.extend(""+siglaTabla+"Proveedores")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)
    if(siglaTabla == "SDM") {
        var Simulaciones = Parse.Object.extend("Simulations")
        var simulacionPtr = new Simulaciones()
        simulacionPtr.id = simulacion
        query.equalTo("simulationPtr", simulacionPtr)
    }
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
            exports.AsyncObtenerTodosLosProveedores((index + 1), dataArray, simulacion, callback)
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
    var Table = Parse.Object.extend(""+siglaTabla+"Proveedores")
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

exports.ImportarClientes = function (simulacion, pathArchivo) {
    return new Promise(function (resolve, reject) {
        var resultsObjectsCSV = []
        fs.createReadStream(path.resolve(__dirname, '../../../' + pathArchivo))
            .pipe(csvparser({
                skipLines: 1,
                headers: ['name', 'lastName', 'lastNameMother', 'street', 'number', 'suburb', 'postalCode', 'city', 'state', 'phone', 'email', 'creditMoney', 'clientType'],
            }))
            .on('data', (data) => {
                var Table = Parse.Object.extend(""+siglaTabla+"Clientes")
                var object = new Table()

                object.set("nombre", data["name"])
                object.set("apellidoPaterno", data["lastName"])
                object.set("apellidoMaterno", data["lastNameMother"])
                object.set("calle", data["street"])
                object.set("numero", data["number"])
                object.set("suburbio", data["suburb"])
                object.set("codigoPostal", data["postalCode"])
                object.set("ciudad", data["city"])
                object.set("estado", data["state"])
                object.set("telefono", data["phone"])
                object.set("email", data["email"])
                object.set("creditoMonetario", data["creditMoney"])
                object.set("tipoCliente", data["clientType"])

                if(siglaTabla == "SDM") {
                    var Simulaciones = Parse.Object.extend("Simulations")
                    var simulacionPtr = new Simulaciones()
                    simulacionPtr.id = simulacion
                    object.set("simulationPtr", simulacionPtr)
                }

                object.set("active", true)
                object.set("exists", true)

                resultsObjectsCSV.push(object)
            })
            .on('end', () => {

                Parse.Object.saveAll(resultsObjectsCSV).then((result) => {
                    resolve({ type: "AGREGAR", data: result, error: null })
                }, (error) => {
                    resolve({ type: "AGREGAR", data: null, error: error.message })
                })

            })

    })
}

exports.ObtenerTodosLosClientes = function (simulacion) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerTodosLosClientes(0, [], simulacion, function (results, error) {
            if (error) {
                return resolve({ type: "CONSULTA", data: null, error: error.message })
            }
            resolve({ type: "CONSULTA", data: results, error: null })
        })
    })
}

exports.AsyncObtenerTodosLosClientes = async (index, dataArray, simulacion, callback) => {
    var Table = Parse.Object.extend(""+siglaTabla+"Clientes")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)
    if(siglaTabla == "SDM") {
        var Simulaciones = Parse.Object.extend("Simulations")
        var simulacionPtr = new Simulaciones()
        simulacionPtr.id = simulacion
        query.equalTo("simulationPtr", simulacionPtr)
    }
    query.skip(index * 1000)
    query.limit(1000)

    try {
        const results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncObtenerTodosLosClientes((index + 1), dataArray, simulacion, callback)
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
    var Table = Parse.Object.extend(""+siglaTabla+"Clientes")
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

exports.ImportarEmpleados = function (simulacion, pathArchivo) {
    return new Promise(function (resolve, reject) {
        var resultsObjectsCSV = []
        fs.createReadStream(path.resolve(__dirname, '../../../' + pathArchivo))
            .pipe(csvparser({
                skipLines: 1,
                headers: ['employeeID', 'name', 'lastName', 'lastNameMother', 'startDay', 'imss', 'rfc', 'curp', 'civilState', 'sex', 'street', 'number', 'suburb', 'state', 'city', 'salaryHr', 'turn', 'email', 'phone', 'job', 'bornDate'],
            }))
            .on('data', (data) => {
                var Table = Parse.Object.extend(""+siglaTabla+"Empleados")
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

                if(siglaTabla == "SDM") {
                    var Simulaciones = Parse.Object.extend("Simulations")
                    var simulacionPtr = new Simulaciones()
                    simulacionPtr.id = simulacion
                    object.set("simulationPtr", simulacionPtr)
                }

                object.set("active", true)
                object.set("exists", true)

                resultsObjectsCSV.push(object)
            })
            .on('end', () => {

                Parse.Object.saveAll(resultsObjectsCSV).then((result) => {
                    resolve({ type: "AGREGAR", data: result, error: null })
                }, (error) => {
                    resolve({ type: "AGREGAR", data: null, error: error.message })
                })

            })

    })
}

exports.ObtenerTodosLosEmpleados = function (simulacion) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerTodosLosEmpleados(0, [], simulacion, function (results, error) {
            if (error) {
                return resolve({ type: "CONSULTA", data: null, error: error.message })
            }
            resolve({ type: "CONSULTA", data: results, error: null })
        })
    })
}

exports.AsyncObtenerTodosLosEmpleados = async (index, dataArray, simulacion, callback) => {
    var Table = Parse.Object.extend(""+siglaTabla+"Empleados")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)
    if(siglaTabla == "SDM") {
        var Simulaciones = Parse.Object.extend("Simulations")
        var simulacionPtr = new Simulaciones()
        simulacionPtr.id = simulacion
        query.equalTo("simulationPtr", simulacionPtr)
    }
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
            exports.AsyncObtenerTodosLosEmpleados((index + 1), dataArray, simulacion, callback)
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
    var Table = Parse.Object.extend(""+siglaTabla+"Empleados")
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

exports.ImportarGastos = function (simulacion, pathArchivo) {
    return new Promise(function (resolve, reject) {
        var resultsObjectsCSV = []
        fs.createReadStream(path.resolve(__dirname, '../../../' + pathArchivo))
            .pipe(csvparser({
                skipLines: 1,
                headers: ['account', 'import', 'period', 'type', 'percentage'],
            }))
            .on('data', (data) => {
                var Table = Parse.Object.extend(""+siglaTabla+"Gastos")
                var object = new Table()

                object.set("cuenta", data["account"])
                object.set("importar", data["import"])
                object.set("periodo", data["period"])
                object.set("tipo", data["type"])
                object.set("porcentaje", data["percentage"])

                if(siglaTabla == "SDM") {
                    var Simulaciones = Parse.Object.extend("Simulations")
                    var simulacionPtr = new Simulaciones()
                    simulacionPtr.id = simulacion
                    object.set("simulationPtr", simulacionPtr)
                }

                object.set("active", true)
                object.set("exists", true)

                resultsObjectsCSV.push(object)
            })
            .on('end', () => {

                Parse.Object.saveAll(resultsObjectsCSV).then((result) => {
                    resolve({ type: "AGREGAR", data: result, error: null })
                }, (error) => {
                    resolve({ type: "AGREGAR", data: null, error: error.message })
                })

            })

    })
}

exports.ObtenerTodosLosGastos = function (simulacion) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerTodosLosGastos(0, [], simulacion, function (results, error) {
            if (error) {
                return resolve({ type: "CONSULTA", data: null, error: error.message })
            }
            resolve({ type: "CONSULTA", data: results, error: null })
        })
    })
}

exports.AsyncObtenerTodosLosGastos = async (index, dataArray, simulacion, callback) => {
    var Table = Parse.Object.extend(""+siglaTabla+"Gastos")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)
    if(siglaTabla == "SDM") {
        var Simulaciones = Parse.Object.extend("Simulations")
        var simulacionPtr = new Simulaciones()
        simulacionPtr.id = simulacion
        query.equalTo("simulationPtr", simulacionPtr)
    }
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
            exports.AsyncObtenerTodosLosGastos((index + 1), dataArray, simulacion, callback)
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
    var Table = Parse.Object.extend(""+siglaTabla+"Gastos")
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

exports.ImportarActivosFijos = function (simulacion, pathArchivo) {
    return new Promise(function (resolve, reject) {
        var resultsObjectsCSV = []
        fs.createReadStream(path.resolve(__dirname, '../../../' + pathArchivo))
            .pipe(csvparser({
                skipLines: 1,
                headers: ['name', 'description', 'model', 'costPrice', 'salePrice', 'serialNumber', 'brand', 'department', 'acquisitionDate', 'timelife', 'depreciation fee'],
            }))
            .on('data', (data) => {
                var Table = Parse.Object.extend(""+siglaTabla+"ActivosFijos")
                var object = new Table()

                object.set("nombre", data["name"])
                object.set("descripcion", data["description"])
                object.set("modelo", data["model"])
                object.set("precioCosto", data["costPrice"])
                object.set("precioVenta", data["salePrice"])
                object.set("numeroSerie", data["serialNumber"])
                object.set("marca", data["brand"])
                object.set("departamento", data["department"])
                object.set("fechaAdquisicion", data["acquisitionDate"])
                object.set("tiempoVida", data["timelife"])
                object.set("tarifaDepreciacion", data["depreciation fee"])

                if(siglaTabla == "SDM") {
                    var Simulaciones = Parse.Object.extend("Simulations")
                    var simulacionPtr = new Simulaciones()
                    simulacionPtr.id = simulacion
                    object.set("simulationPtr", simulacionPtr)
                }
                
                object.set("active", true)
                object.set("exists", true)

                resultsObjectsCSV.push(object)
            })
            .on('end', () => {

                Parse.Object.saveAll(resultsObjectsCSV).then((result) => {
                    resolve({ type: "AGREGAR", data: result, error: null })
                }, (error) => {
                    resolve({ type: "AGREGAR", data: null, error: error.message })
                })

            })

    })
}

exports.ObtenerTodosLosActivosFijos = function (simulacion) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerTodosLosActivosFijos(0, [], simulacion, function (results, error) {
            if (error) {
                return resolve({ type: "CONSULTA", data: null, error: error.message })
            }
            resolve({ type: "CONSULTA", data: results, error: null })
        })
    })
}

exports.AsyncObtenerTodosLosActivosFijos = async (index, dataArray, simulacion, callback) => {
    var Table = Parse.Object.extend(""+siglaTabla+"ActivosFijos")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)
    
    if(siglaTabla == "SDM") {
        var Simulaciones = Parse.Object.extend("Simulations")
        var simulacionPtr = new Simulaciones()
        simulacionPtr.id = simulacion
        query.equalTo("simulationPtr", simulacionPtr)
    }

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
            exports.AsyncObtenerTodosLosActivosFijos((index + 1), dataArray, simulacion, callback)
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
    var Table = Parse.Object.extend(""+siglaTabla+"ActivosFijos")
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

exports.ObtenerTodoInventarioActivosFijos = function (simulacion) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerInventarioActivosFijos(0, [], simulacion, function (results, error) {
            if (error) {
                return resolve({ type: "AGREGAR", data: null, error: error.message })
            }
            resolve({ type: "AGREGAR", data: results, error: null })
        })
    })
}

exports.ActualizarInventarioActivosFijos = function (data, simulacion) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerInventarioActivosFijos(0, [], simulacion, function (results, error) {
            log((results, error))
            var inventarioUpddate = []
            if (!error) {
                for (var key in data) {
                    var object = _.find(results, function (obj) {
                        return obj.get('activoFijoPtr').id == key
                    });

                    object.set("cantidad", data[key])

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

exports.AgregarBaseInventarioActivosFijos = function (data, simulacion) {
    return new Promise(function (resolve, reject) {
        var inventario = []
        for (var key in data) {
            var cantidad = data[key]

            const Table = Parse.Object.extend(""+siglaTabla+"ActivosFijosInventario")
            const object = new Table()

            var TableActivoFijo = Parse.Object.extend(""+siglaTabla+"ActivosFijos")
            var afPtr = new TableActivoFijo()
            afPtr.id = key

            object.set("activoFijoPtr", afPtr)
            object.set("cantidad", cantidad)
            object.set("active", true)
            object.set("exists", true)

            if(siglaTabla == "SDM") {
                var Simulaciones = Parse.Object.extend("Simulations")
                var simulacionPtr = new Simulaciones()
                simulacionPtr.id = simulacion
                object.set("simulationPtr", simulacionPtr)
            }

            inventario.push(object)
        }

        Parse.Object.saveAll(inventario).then((list) => {
            resolve({ type: "AGREGAR", data: list, error: null })
        }, (error) => {
            resolve({ type: "AGREGAR", data: null, error: error.message })
        })
    })
}

exports.AsyncObtenerInventarioActivosFijos = async (index, dataArray, simulacion, callback) => {
    var Table = Parse.Object.extend(""+siglaTabla+"ActivosFijosInventario")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)
    if(siglaTabla == "SDM") {
        var Simulaciones = Parse.Object.extend("Simulations")
        var simulacionPtr = new Simulaciones()
        simulacionPtr.id = simulacion
        query.equalTo("simulationPtr", simulacionPtr)
    }
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
            exports.AsyncObtenerInventarioActivosFijos((index + 1), dataArray, simulacion, callback)
        }
    } catch (error) {
        //throw new Error(error)
        callback(dataArray, error)
    }

}

exports.ObtenerTotalAsyncInventarioActivosFijos = function (simulacion) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerTotalInventarioActivosFijos(simulacion, function (total, error) {
            if (error) {
                return resolve({ type: "CONTAR", data: null, error: error.message })
            }
            resolve({ type: "CONTAR", data: total, error: null })
        })
    })
}

exports.AsyncObtenerTotalInventarioActivosFijos = async (simulacion, callback) => {
    var Table = Parse.Object.extend(""+siglaTabla+"ActivosFijosInventario")
    var query = new Parse.Query(Table)
    query.equalTo("exists", true)

    if(siglaTabla == "SDM") {
        var Simulaciones = Parse.Object.extend("Simulations")
        var simulacionPtr = new Simulaciones()
        simulacionPtr.id = simulacion
        query.equalTo("simulationPtr", simulacionPtr)
    }
    
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
    var Table = Parse.Object.extend(""+siglaTabla+"ActivosFijosInventario")
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

exports.ObtenerTodaLosProvedoresMateriaPrima = function (simulacion) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerTodaLosProvedoresMateriaPrima(0, [], simulacion, function (results, error) {
            if (error) {
                return resolve({ type: "CONSULTA", data: null, error: error.message })
            }
            resolve({ type: "CONSULTA", data: results, error: null })
        })
    })
}

exports.AsyncObtenerTodaLosProvedoresMateriaPrima = async (index, dataArray, simulacion, callback) => {
    var Table = Parse.Object.extend(""+siglaTabla+"ProveedoresMP")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)
    if(siglaTabla == "SDM") {
        var Simulaciones = Parse.Object.extend("Simulations")
        var simulacionPtr = new Simulaciones()
        simulacionPtr.id = simulacion
        query.equalTo("simulationPtr", simulacionPtr)
    }
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
            exports.AsyncObtenerTodaLosProvedoresMateriaPrima((index + 1), dataArray, simulacion, callback)
        }
    } catch (error) {
        callback(dataArray, error)
    }
}

exports.AgregarProvedoreMateriaPrima = function (data, simulacion) {
    log(data, simulacion)
    return new Promise(function (resolve, reject) {

        var primerEntrada = true
        var arregloDatosForm = []
        var arregloIdsMateriales = []

        var Proveedor = Parse.Object.extend(""+siglaTabla+"Proveedores")
        var proveedor = new Proveedor()
            proveedor.id = data["Provedores"]

        delete data["Provedores"]
        log(data)

        for (let key in data) {

                if (data[key].length == 3) {

                    var Table = Parse.Object.extend(""+siglaTabla+"ProveedoresMP")
                    var object = new Table()

                    var MateriaPrima = Parse.Object.extend("DMMateriaPrima")
                    var materiaPrima = new MateriaPrima()
                    materiaPrima.id = data[key][0]

                    object.set("proveedorPtr", proveedor)
                    object.set("materiaPrimaPtr", materiaPrima)
                    object.set("costo", data[key][1])
                    object.set("cantidadMinima", data[key][2])

                    if(siglaTabla == "SDM") {
                        var Simulaciones = Parse.Object.extend("Simulations")
                        var simulacionPtr = new Simulaciones()
                        simulacionPtr.id = simulacion
                        object.set("simulationPtr", simulacionPtr)
                    }

                    object.set("exists", true)
                    object.set("active", true)

                    arregloIdsMateriales.push(materiaPrima)
                    arregloDatosForm.push(object)

                }
            
        }
        log(arregloIdsMateriales)
        log(proveedor)

        exports.AsyncObtenerProveedorMateriasPrimas(proveedor, arregloIdsMateriales, function (resultadoProvedoresMaterais, error) {
            log(resultadoProvedoresMaterais, error)

            if (error) {
                return resolve({ type: "AGREGAR", data: null, error: error.message })
            }

            var arregloAgregarNuvosPMP = []
            var arregloActualizarPMP = []

            arregloDatosForm.forEach(element => {
                var noeExiste = false

                if(resultadoProvedoresMaterais){
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
                }else{
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
    var Table = Parse.Object.extend(""+siglaTabla+"ProveedoresMP")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)
    query.equalTo("proveedorPtr", idPreoveedor)
    query.containedIn("productoPtr", idsMateriasles)

    try {
        var results = await query.first()
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
    var Table = Parse.Object.extend(""+siglaTabla+"ProveedoresMP")
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

exports.ImportarProveedoresMateriasPrimas = function (simulacion, pathArchivo) {
    return new Promise(function (resolve, reject) {
        var resultsObjectsCSV = []
        var arregloFolios = []
        var arregloNoparte = []

        fs.createReadStream(path.resolve(__dirname, '../../../' + pathArchivo))
            .pipe(csvparser({
                skipLines: 1,
                headers: ['numid', 'part_number', 'cost', 'minimum_order_quantity'],
            }))
            .on('data', (data) => {
                var Table = Parse.Object.extend(""+siglaTabla+"ProveedoresMP")
                var object = new Table()

                object.set("folio", data["numid"])
                object.set("numerParte", data["part_number"])
                object.set("costo", data["cost"])
                object.set("cantidadMinima", data["minimum_order_quantity"])

                if(siglaTabla == "SDM") {
                    var Simulaciones = Parse.Object.extend("Simulations")
                    var simulacionPtr = new Simulaciones()
                    simulacionPtr.id = simulacion
                    object.set("simulationPtr", simulacionPtr)
                }

                object.set("active", true)
                object.set("exists", true)

                arregloFolios.push(data["numid"])
                arregloNoparte.push(data["part_number"])
                resultsObjectsCSV.push(object)
            })
            .on('end', () => {

                exports.AsyncBuscarProvedoresMateriasPrias(arregloFolios, arregloNoparte, 0, [], simulacion, function (results, error) {
                    if (error) {
                        return resolve({ type: "AGREGAR", data: null, error: error.message })
                    }

                    var arregloConFolio = []
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
                        if (!existe) {
                            arregloConFolio.push(element)
                        }
                    });

                    exports.AsycBucarProveedoresPorFolios(arregloFolios, 0, [], simulacion, function (provedores, error) {
                        exports.AsycBucarMateriaPrimaPorNumeroParte(arregloNoparte, 0, [], function (materiasPrimas, error) {

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

                            Parse.Object.saveAll(arregloAgreggarNuevos).then((datosNuevos) => {

                                Parse.Object.saveAll(arregloActualizar).then((datosActualizados) => {
                                    datosActualizados.push(datosNuevos)
                                    resolve({ type: "AGREGAR", data: datosActualizados, error: null })
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

exports.AsyncBuscarProvedoresMateriasPrias = async (folios, numerosMaterias, index, dataArray, simulacion, callback) => {

    var DMProveedores = Parse.Object.extend(""+siglaTabla+"Proveedores")
    var matchesQueryProveedores = new Parse.Query(DMProveedores)
    matchesQueryProveedores.equalTo("exists", true)
    matchesQueryProveedores.containedIn("folio", folios)

    var DMMateriaPrima = Parse.Object.extend("DMMateriaPrima")
    var matchesQueryMateriaPrima = new Parse.Query(DMMateriaPrima)
    matchesQueryMateriaPrima.equalTo("exists", true)
    matchesQueryMateriaPrima.containedIn("noparte", numerosMaterias)

    var Table = Parse.Object.extend(""+siglaTabla+"ProveedoresMP")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)

    if(siglaTabla == "SDM") {
        var Simulaciones = Parse.Object.extend("Simulations")
        var simulacionPtr = new Simulaciones()
        simulacionPtr.id = simulacion
        query.equalTo("simulationPtr", simulacionPtr)
    }
    
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
            exports.AsyncBuscarProvedoresMateriasPrias(folios, numerosMaterias, (index + 1), dataArray, simulacion, callback)
        }
    } catch (error) {
        callback(dataArray, error)
    }
}

exports.AsycBucarProveedoresPorFolios = async (folios, index, dataArray, simulacion, callback) => {
    var Table = Parse.Object.extend(""+siglaTabla+"Proveedores")
    var query = new Parse.Query(Table)
    query.equalTo("exists", true)
    
    if(siglaTabla == "SDM") {
        var Simulaciones = Parse.Object.extend("Simulations")
        var simulacionPtr = new Simulaciones()
        simulacionPtr.id = simulacion
        query.equalTo("simulationPtr", simulacionPtr)
    }

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
            exports.AsycBucarProveedoresPorFolios(folios, (index + 1), dataArray, simulacion, callback)
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

exports.AgregarTransporte = function (data, simulacion) {
    return new Promise(function (resolve, reject) {
        exports.AsyncBuscarPaise(data["paisPtr"], function (resultPais, error) {
            var Table = Parse.Object.extend(""+siglaTabla+"Proveedores")
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

                    var Table = Parse.Object.extend(""+siglaTabla+"Transporte")
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

                    if(siglaTabla == "SDM") {
                        var Simulaciones = Parse.Object.extend("Simulations")
                        var simulacionPtr = new Simulaciones()
                        simulacionPtr.id = simulacion
                        transporte.set("simulationPtr", simulacionPtr)
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
    var Table = Parse.Object.extend(""+siglaTabla+"Transporte")
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

exports.ObtenertodosLosTransportes = function (simulacion) {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenertodosLosTransportes(0, [], simulacion, function (results, error) {
            if (error) {
                return resolve({ type: "CONSULTA", data: null, error: error.message })
            }
            resolve({ type: "CONSULTA", data: results, error: null })
        })
    })
}

exports.AsyncObtenertodosLosTransportes = async (index, dataArray, simulacion, callback) => {
    var Table = Parse.Object.extend(""+siglaTabla+"Transporte")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)
    query.include("paisPtr")
    query.include("productoPtr")
    query.include("proveedorPtr")

    if(siglaTabla == "SDM") {
        var Simulaciones = Parse.Object.extend("Simulations")
        var simulacionPtr = new Simulaciones()
        simulacionPtr.id = simulacion
        query.equalTo("simulationPtr", simulacionPtr)
    }

    query.skip(index * 1000)
    query.limit(1000)

    try {
        const results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncObtenertodosLosTransportes((index + 1), dataArray, simulacion, callback)
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

            var Table = Parse.Object.extend(""+siglaTabla+"Proveedores")
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
    var Table = Parse.Object.extend(""+siglaTabla+"Transporte")
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

exports.AsyncGetAllSalaryTabulator = async ( simulationPtr, index, dataArray,callback) =>{
    var Table = Parse.Object.extend(""+siglaTabla+"SalaryTabulator")
    var query = new Parse.Query(Table)
    
    if(siglaTabla == "SDM") {
        query.equalTo("simulationPtr", simulationPtr)
    }
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
            exports.AsyncGetAllSalaryTabulator( simulationPtr, (index + 1), dataArray, callback )
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.GetProductionLinePhases = function (simulationPtr){
    var Simulation = Parse.Object.extend("Simulations")
    var simulation = new Simulation()
        simulation.id = simulationPtr
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerTodosLosActivosFijos(0, [], simulationPtr, function (resultsFixedAssets, error) {
            if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message })}
            exports.AsyncGetAllProductionLinePhases ( simulation, 0, [], function (resultsPhases, error) {
                if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message })}
                
                exports.AsyncGetAllSalaryTabulator( simulation, 0, [], function (resultsSalaryTabulator, error) {
                    var arrayPhases = []
                    for (let i = 0; i < resultsPhases.length; i++) {
                        var arrayFixedAssets = []
                        var phases = resultsPhases[i].get("fixedAssetSDMPtr")
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

exports.AsyncGetAllProductionLinePhases = async ( simulationPtr, index, dataArray, callback ) => {
    var Table = Parse.Object.extend(siglaTabla+"ProductionLinePhases")
    var query = new Parse.Query(Table)

    if(siglaTabla == "SDM") {
        query.equalTo("simulationPtr", simulationPtr)
    }
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
            exports.AsyncGetAllProductionLinePhases( simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.SaveProductionLinePhases = function ( data, simulationPtr ) {
    var Simulation              = Parse.Object.extend("Simulations")
    var pointerToSimulation     = new Simulation()
        pointerToSimulation.id  = simulationPtr

     return new Promise(function (resolve, reject) {
        exports.AsyncNameProductionLinePhase ( pointerToSimulation, data["name"], function (results, error) {
            if(error){return resolve({ type: "AGREGAR", data: null, error: error.message })}
            if(results != undefined){ return resolve({ type: "AGREGAR", data: null, error: "The name of this pahase already exists" })}

            var namePhase = data["name"]
            //var quantityEmployees = data["quantityEmployees"]
            var hoursfinishPhase = data["hoursfinishPhase"]
            var employees        = data["employees"]
            var description      = data['description']
            var jsonEmployes     = {}

            for (const key in employees) {
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
            
            var Table = Parse.Object.extend(siglaTabla+"ProductionLinePhases")
            var object = new Table()
            if(description){
                object.set("description",description)
            }
                object.set("name",namePhase)
                object.set("fixedAssetSDMPtr",jsonFixedAssets)
                object.set("quantityEmployees",jsonEmployes)
                object.set("hoursFinishPhase",Number(hoursfinishPhase))
            if(siglaTabla == "SDM") {
                object.set("simulationPtr", pointerToSimulation)
            }
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

exports.AsyncNameProductionLinePhase = async ( simulationPtr, name, callback ) => {
    var Table = Parse.Object.extend(siglaTabla+"ProductionLinePhases")
    var query = new Parse.Query(Table)

    if(siglaTabla == "SDM") {
        query.equalTo("simulationPtr", simulationPtr)
    }
    query.equalTo("name",name)
    query.equalTo("exists", true)

    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.ArchiveProductionLinePhase = function ( objectPtr, seActiva, simulationPtr ) {
    var Simulations             = Parse.Object.extend("Simulations")
    var pointerToSimulation     = new Simulations()
        pointerToSimulation.id  = simulationPtr
    return new Promise(function (resolve, reject) {
        exports.AsyncSearchProductionLinePhase ( pointerToSimulation, objectPtr, function (result, error) {
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

exports.DeleteProductionLinePhase = function ( objectPtr, simulationPtr ) {
    var Simulations             = Parse.Object.extend("Simulations")
    var pointerToSimulation     = new Simulations()
        pointerToSimulation.id  = simulationPtr
    return new Promise(function (resolve, reject) {
        exports.AsyncSearchProductionLinePhase ( pointerToSimulation, objectPtr,function (result, error) {
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

exports.AsyncSearchProductionLinePhase = async ( simulationPtr, objectPtr, callback) => {
    var Table = Parse.Object.extend(siglaTabla+"ProductionLinePhases")
    var query = new Parse.Query(Table)

    if(siglaTabla == "SDM") {
        query.equalTo("simulationPtr", simulationPtr)
    }
        query.equalTo("objectId",objectPtr)
        query.equalTo("exists",true)
    
    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.EditProductionLinePhase = function ( data, simulationPtr ) {
    var Simulations             = Parse.Object.extend("Simulations")
    var pointerToSimulation     = new Simulations()
        pointerToSimulation.id  = simulationPtr
    return new Promise(function (resolve, reject) {
        exports.AsyncSearchProductionLinePhase ( pointerToSimulation, data["objectId"], function (result, error) {
            if (error) { return resolve({ type: "ARCHIVAR", data: null, error: error.message })}
            var name             = data["name"]
            //var quantityEmployees  = data["quantityEmployees"]
            var employees  = data["employees"]
            var hoursfinishPhase = data["hoursfinishPhase"]
            var description      = data['description']
            
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

            result.set('description',description)
            result.set("name",name)
            result.set("fixedAssetSDMPtr",jsonFixedAssets)
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

exports.SaveProductionLineTemplate = function ( data, simulationPtr ) {
    var Simulations             = Parse.Object.extend("Simulations")
    var pointerToSimulation     = new Simulations()
        pointerToSimulation.id  = simulationPtr
    return new Promise(function (resolve, reject) {
        exports.AsyncGetAllProductionLinePhases(pointerToSimulation, 0, [], function (resultsPhases, error){
            exports.AsyncNameProductionLineTemplate ( pointerToSimulation, data["name"], function (results, error) {
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

                        QuantityFixedAsset.push(dataPhase.get("fixedAssetSDMPtr"))
                    }
                    
                var Table = Parse.Object.extend(siglaTabla+"ProductionLineTemplates")
                var object = new Table()

                var ProductFamily = Parse.Object.extend(siglaTabla+"ProductoFamilia")
                var productFamily = new ProductFamily()
                    productFamily.id = data["productFamilySDMPtr"]

                object.set("name",data["name"])
                object.set("productFamilySDMPtr",productFamily)
                object.set("phases",phases)
                object.set("hoursFinalProduct",Number(hoursFinalProduct))
                object.set("hoursPhases",hoursPhases)
                object.set("quantityFixedAssets",QuantityFixedAsset)
                if(siglaTabla == "SDM") {
                        object.set("simulationPtr", pointerToSimulation)
                    }
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

exports.AsyncNameProductionLineTemplate = async ( simulationPtr, name, callback ) => {
    var Table = Parse.Object.extend(siglaTabla+"ProductionLineTemplates")
    var query = new Parse.Query(Table)

    if(siglaTabla == "SDM") {
        query.equalTo("simulationPtr", simulationPtr)
    }
    query.equalTo("name",name)
    query.equalTo("exists", true)

    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.GetAllProdcutionLineTemplates = function ( simulationPtr ) {
    var Simulations             = Parse.Object.extend("Simulations")
    var pointerToSimulation     = new Simulations()
        pointerToSimulation.id  = simulationPtr
    return new Promise(function (resolve, reject) {
        exports.AsyncGetAllProductionLineTemplates ( pointerToSimulation, 0, [], function (resultsTemplates, error) {
            if(error){ return resolve({ type: "CONSULTA", data: null, error: error.message }) }
            exports.AsyncGetAllProductionLinePhasesTemplates ( pointerToSimulation, 0, [], function (resultsPhases, error) {
                if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message }) }
                exports.AsyncObtenerTodosLosProductos ( 0, [], simulationPtr, function (resultsProductFamily, error){ 
                    if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message }) }
                    exports.AsyncObtenerTodosLosActivosFijos(0, [], simulationPtr, function (resultsFixedAssets, error) {
                        if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message }) }
                        exports.AsyncGetAllSalaryTabulator( pointerToSimulation, 0, [], function (resultsSalaryTabulator, error) {
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

exports.AsyncGetAllProductionLineTemplates = async ( simulationPtr, index, dataArray, callback ) => {
    var Table = Parse.Object.extend(siglaTabla+"ProductionLineTemplates")
    var query = new Parse.Query(Table)

    if(siglaTabla == "SDM") {
        query.equalTo("simulationPtr", simulationPtr)
    }
        query.equalTo("exists",true)
        query.include("productFamilySDMPtr")
        query.limit(1000)
        query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetAllProductionLineTemplates ( simulationPtr, (index + 1), dataArray, callback )
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetAllProductionLinePhasesTemplates = async ( simulationPtr, index, dataArray, callback ) => {
    var Table = Parse.Object.extend(siglaTabla+"ProductionLinePhases")
    var query = new Parse.Query(Table)

    if(siglaTabla == "SDM") {
        query.equalTo("simulationPtr", simulationPtr)
    }
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
            exports.AsyncGetAllProductionLinePhasesTemplates ( simulationPtr, (index + 1), dataArray, callback )
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.ArchiveProductionLineTemplate = function ( objectPtr, seActiva, simulationPtr) {
    var Simulations             = Parse.Object.extend("Simulations")
    var pointerToSimulation     = new Simulations()
        pointerToSimulation.id  = simulationPtr
    return new Promise(function (resolve, reject) {
        exports.AsyncSearchProductionLineTemplate ( pointerToSimulation, objectPtr,function (result, error) {
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

exports.DeleteProductionLineTemplate = function (objectPtr, simulationPtr) {
    var Simulations             = Parse.Object.extend("Simulations")
    var pointerToSimulation     = new Simulations()
        pointerToSimulation.id  = simulationPtr
    return new Promise(function (resolve, reject) {
        exports.AsyncSearchProductionLineTemplate ( pointerToSimulation, objectPtr,function (result, error) {
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

exports.AsyncSearchProductionLineTemplate = async ( simulationPtr, objectPtr, callback) => {

    var Table = Parse.Object.extend(siglaTabla+"ProductionLineTemplates")
    var query = new Parse.Query(Table)

    if(siglaTabla == "SDM") {
        query.equalTo("simulationPtr", simulationPtr)
    }
        query.equalTo("objectId",objectPtr)
        query.equalTo("exists",true)
    
    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.EditProductionLineTemplate = function ( data, simulationPtr ) {
    var Simulations             = Parse.Object.extend("Simulations")
    var pointerToSimulation     = new Simulations()
        pointerToSimulation.id  = simulationPtr
    return new Promise(function (resolve, reject) {
        exports.AsyncSearchProductionLineTemplate ( pointerToSimulation, data["objectId"], function (result, error) {
            if (error) { return resolve({ type: "ARCHIVAR", data: null, error: error.message })}
            log(data)

            var ProductFamily = Parse.Object.extend(siglaTabla+"ProductoFamilia")
            var productFamily = new ProductFamily()
                productFamily.id = data["productFamilySDMPtr"] 

            result.set("name",data["name"])
            result.set("efficiencyPercentage",Number( data["efficiencyPercentage"] ))
            result.set("productionQuantity",Number( data["productionQuantity"] ))
            result.set("productFamilySDMPtr",productFamily)
            result.set("hoursFinalProduct",data["hoursFinalProduct"])

            result.save().then((resultTemplate)=>{
                resolve({ type: "ARCHIVAR", data: resultTemplate, error: null })
            }, (error) => {
                resolve({ type: "ARCHIVAR", data: null, error: error.message })
            })
            
        })
    })
}

exports.UpdateVariousDataClient = function(data, simulationPtr){
    var Simulations             = Parse.Object.extend("Simulations")
    var pointerToSimulation     = new Simulations()
        pointerToSimulation.id  = simulationPtr
    //log( data, simulationPtr)
    return new Promise(function (resolve, reject) {
            var dataTempo = data.objectId
            var arraySearch = []
            for (const key in dataTempo) {
                arraySearch.push(dataTempo[key])
            }
            exports.AsyncGetAllCustomersToSave(pointerToSimulation, 0, [], function (results, error){
                if(error){return resolve({ type: "ELIMINAR", data: null, error: error.message })}
                for (let i = 0; i < results.length; i++) {
                    var activateDataFound = _.find(arraySearch,function(currentData){
                        return currentData == results[i].id
                    })
                    if(activateDataFound){
                        results[i].set("active",true)
                    }else{
                        results[i].set("active",false)
                    }

                    Parse.Object.saveAll(results).then((resultSave)=>{
                        resolve({ type: "AGREGAR", data: resultSave, error: null })
                    }, (error)=>{
                        resolve({ type: "AGREGAR", data: null, error: error.message })
                    })

                }
            })
    })
}

exports.AsyncGetAllCustomersToSave = async (pointerToSimulation, index, dataArray, callback)=>{
    var Table = Parse.Object.extend(""+siglaTabla+"Clientes")
    var query = new Parse.Query(Table)
        
        query.equalTo("simulationPtr",pointerToSimulation)
        query.equalTo("exists", true)
        query.limit(1000)
        query.skip(index * 1000)
    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetAllCustomersToSave(pointerToSimulation, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
        
}

exports.UpdateVariousDataSuppliers = function(data, simulationPtr){
    var Simulations             = Parse.Object.extend("Simulations")
    var pointerToSimulation     = new Simulations()
        pointerToSimulation.id  = simulationPtr
    //log( data, simulationPtr)
    return new Promise(function (resolve, reject) {

            var dataTempo = data.objectId
            var arraySearch = []
            for (const key in dataTempo) {
                arraySearch.push(dataTempo[key])
            }
            exports.AsyncGetAllSuppliersToSave(pointerToSimulation, 0, [], function (results, error){
                if(error){return resolve({ type: "ELIMINAR", data: null, error: error.message })}
                for (let i = 0; i < results.length; i++) {
                    var activateDataFound = _.find(arraySearch,function(currentData){
                        return currentData == results[i].id
                    })
                    if(activateDataFound){
                        results[i].set("active",true)
                    }else{
                        results[i].set("active",false)
                    }

                    Parse.Object.saveAll(results).then((resultSave)=>{
                        resolve({ type: "AGREGAR", data: resultSave, error: null })
                    }, (error)=>{
                        resolve({ type: "AGREGAR", data: null, error: error.message })
                    })

                }
            })
    })
}

exports.AsyncGetAllSuppliersToSave = async (pointerToSimulation, index, dataArray, callback)=>{
    var Table = Parse.Object.extend(""+siglaTabla+"Proveedores")
    var query = new Parse.Query(Table)
        
        query.equalTo("simulationPtr",pointerToSimulation)
        query.equalTo("exists", true)
        query.limit(1000)
        query.skip(index * 1000)
    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetAllSuppliersToSave(pointerToSimulation, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
        
}

exports.UpdateVariousDataEmployees = function(data, simulationPtr){
    var Simulations             = Parse.Object.extend("Simulations")
    var pointerToSimulation     = new Simulations()
        pointerToSimulation.id  = simulationPtr
    log( data, simulationPtr)
    return new Promise(function (resolve, reject) {

            var dataTempo = data.objectId
            var arraySearch = []
            for (const key in dataTempo) {
                arraySearch.push(dataTempo[key])
            }
            exports.AsyncGetAllEmployeesToSave(pointerToSimulation, 0, [], function (results, error){
                if(error){return resolve({ type: "ELIMINAR", data: null, error: error.message })}
                for (let i = 0; i < results.length; i++) {
                    var activateDataFound = _.find(arraySearch,function(currentData){
                        return currentData == results[i].id
                    })
                    if(activateDataFound){
                        results[i].set("active",true)
                    }else{
                        results[i].set("active",false)
                    }

                    Parse.Object.saveAll(results).then((resultSave)=>{
                        resolve({ type: "AGREGAR", data: resultSave, error: null })
                    }, (error)=>{
                        resolve({ type: "AGREGAR", data: null, error: error.message })
                    })

                }
            })
    })
}

exports.AsyncGetAllEmployeesToSave = async (pointerToSimulation, index, dataArray, callback)=>{
    var Table = Parse.Object.extend(""+siglaTabla+"Empleados")
    var query = new Parse.Query(Table)
        
        query.equalTo("simulationPtr",pointerToSimulation)
        query.equalTo("exists", true)
        query.limit(1000)
        query.skip(index * 1000)
    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetAllSuppliersToSave(pointerToSimulation, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
        
}

exports.UpdateVariousDataExpenses = function(data, simulationPtr){
    var Simulations             = Parse.Object.extend("Simulations")
    var pointerToSimulation     = new Simulations()
        pointerToSimulation.id  = simulationPtr
    //log( data, simulationPtr)
    return new Promise(function (resolve, reject) {

            var dataTempo = data.objectId
            var arraySearch = []
            for (const key in dataTempo) {
                arraySearch.push(dataTempo[key])
            }
            exports.AsyncGetAllExpensesToSave(pointerToSimulation, 0, [], function (results, error){
                if(error){return resolve({ type: "ELIMINAR", data: null, error: error.message })}
                for (let i = 0; i < results.length; i++) {
                    var activateDataFound = _.find(arraySearch,function(currentData){
                        return currentData == results[i].id
                    })
                    if(activateDataFound){
                        results[i].set("active",true)
                    }else{
                        results[i].set("active",false)
                    }

                    Parse.Object.saveAll(results).then((resultSave)=>{
                        resolve({ type: "AGREGAR", data: resultSave, error: null })
                    }, (error)=>{
                        resolve({ type: "AGREGAR", data: null, error: error.message })
                    })

                }
            })
    })
}

exports.AsyncGetAllExpensesToSave = async (pointerToSimulation, index, dataArray, callback)=>{
    var Table = Parse.Object.extend(""+siglaTabla+"Gastos")
    var query = new Parse.Query(Table)
        
        query.equalTo("simulationPtr",pointerToSimulation)
        query.equalTo("exists", true)
        query.limit(1000)
        query.skip(index * 1000)
    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetAllSuppliersToSave(pointerToSimulation, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
        
}

exports.UpdateVariousDataFixedAssets = function(data, simulationPtr){
    var Simulations             = Parse.Object.extend("Simulations")
    var pointerToSimulation     = new Simulations()
        pointerToSimulation.id  = simulationPtr
    //log( data, simulationPtr)
    return new Promise(function (resolve, reject) {

            var dataTempo = data.objectId
            var arraySearch = []
            for (const key in dataTempo) {
                arraySearch.push(dataTempo[key])
            }
            exports.AsyncGetAllFixedAssetsToSave(pointerToSimulation, 0, [], function (results, error){
                if(error){return resolve({ type: "ELIMINAR", data: null, error: error.message })}
                for (let i = 0; i < results.length; i++) {
                    var activateDataFound = _.find(arraySearch,function(currentData){
                        return currentData == results[i].id
                    })
                    if(activateDataFound){
                        results[i].set("active",true)
                    }else{
                        results[i].set("active",false)
                    }

                    Parse.Object.saveAll(results).then((resultSave)=>{
                        resolve({ type: "AGREGAR", data: resultSave, error: null })
                    }, (error)=>{
                        resolve({ type: "AGREGAR", data: null, error: error.message })
                    })

                }
            })
    })
}

exports.AsyncGetAllFixedAssetsToSave = async (pointerToSimulation, index, dataArray, callback)=>{
    var Table = Parse.Object.extend(""+siglaTabla+"ActivosFijos")
    var query = new Parse.Query(Table)
        
        query.equalTo("simulationPtr",pointerToSimulation)
        query.equalTo("exists", true)
        query.limit(1000)
        query.skip(index * 1000)
    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetAllSuppliersToSave(pointerToSimulation, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
        
}

exports.UpdateVariousDataTransports = function(data, simulationPtr){
    var Simulations             = Parse.Object.extend("Simulations")
    var pointerToSimulation     = new Simulations()
        pointerToSimulation.id  = simulationPtr
    //log( data, simulationPtr)
    return new Promise(function (resolve, reject) {

            var dataTempo = data.objectId
            var arraySearch = []
            for (const key in dataTempo) {
                arraySearch.push(dataTempo[key])
            }
            exports.AsyncGetAllFixedTransports(pointerToSimulation, 0, [], function (results, error){
                if(error){return resolve({ type: "ELIMINAR", data: null, error: error.message })}
                for (let i = 0; i < results.length; i++) {
                    var activateDataFound = _.find(arraySearch,function(currentData){
                        return currentData == results[i].id
                    })
                    if(activateDataFound){
                        results[i].set("active",true)
                    }else{
                        results[i].set("active",false)
                    }

                    Parse.Object.saveAll(results).then((resultSave)=>{
                        resolve({ type: "AGREGAR", data: resultSave, error: null })
                    }, (error)=>{
                        resolve({ type: "AGREGAR", data: null, error: error.message })
                    })

                }
            })
    })
}

exports.AsyncGetAllFixedTransports = async (pointerToSimulation, index, dataArray, callback)=>{
    var Table = Parse.Object.extend(""+siglaTabla+"Transporte")
    var query = new Parse.Query(Table)
        
        query.equalTo("simulationPtr",pointerToSimulation)
        query.equalTo("exists", true)
        query.limit(1000)
        query.skip(index * 1000)
    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetAllSuppliersToSave(pointerToSimulation, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
        
}

exports.UpdateVariousDataRawmaterialInv = function(data, simulationPtr){
    var Simulations             = Parse.Object.extend("Simulations")
    var pointerToSimulation     = new Simulations()
        pointerToSimulation.id  = simulationPtr
    //log( data, simulationPtr)
    return new Promise(function (resolve, reject) {

            var dataTempo = data.objectId
            var arraySearch = []
            for (const key in dataTempo) {
                arraySearch.push(dataTempo[key])
            }
            exports.AsyncGetAllRawMaterialInvToSave(pointerToSimulation, 0, [], function (results, error){
                if(error){return resolve({ type: "ELIMINAR", data: null, error: error.message })}
                for (let i = 0; i < results.length; i++) {
                    var activateDataFound = _.find(arraySearch,function(currentData){
                        return currentData == results[i].id
                    })
                    if(activateDataFound){
                        results[i].set("active",true)
                    }else{
                        results[i].set("active",false)
                    }

                    Parse.Object.saveAll(results).then((resultSave)=>{
                        resolve({ type: "AGREGAR", data: resultSave, error: null })
                    }, (error)=>{
                        resolve({ type: "AGREGAR", data: null, error: error.message })
                    })

                }
            })
    })
}

exports.AsyncGetAllRawMaterialInvToSave = async (pointerToSimulation, index, dataArray, callback)=>{
    var Table = Parse.Object.extend(""+siglaTabla+"MateriaPrimaInventario")
    var query = new Parse.Query(Table)
        
        query.equalTo("simulationPtr",pointerToSimulation)
        query.equalTo("exists", true)
        query.limit(1000)
        query.skip(index * 1000)
    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetAllSuppliersToSave(pointerToSimulation, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
        
}

exports.UpdateVariousDataFixAssetsInv = function(data, simulationPtr){
    var Simulations             = Parse.Object.extend("Simulations")
    var pointerToSimulation     = new Simulations()
        pointerToSimulation.id  = simulationPtr
    //log( data, simulationPtr)
    return new Promise(function (resolve, reject) {

            var dataTempo = data.objectId
            var arraySearch = []
            for (const key in dataTempo) {
                arraySearch.push(dataTempo[key])
            }
            exports.AsyncGetAllFiexAssetsInvToSave(pointerToSimulation, 0, [], function (results, error){
                if(error){return resolve({ type: "ELIMINAR", data: null, error: error.message })}
                for (let i = 0; i < results.length; i++) {
                    var activateDataFound = _.find(arraySearch,function(currentData){
                        return currentData == results[i].id
                    })
                    if(activateDataFound){
                        results[i].set("active",true)
                    }else{
                        results[i].set("active",false)
                    }

                    Parse.Object.saveAll(results).then((resultSave)=>{
                        resolve({ type: "AGREGAR", data: resultSave, error: null })
                    }, (error)=>{
                        resolve({ type: "AGREGAR", data: null, error: error.message })
                    })

                }
            })
    })
}

exports.AsyncGetAllFiexAssetsInvToSave = async (pointerToSimulation, index, dataArray, callback)=>{
    var Table = Parse.Object.extend(""+siglaTabla+"ActivosFijosInventario")
    var query = new Parse.Query(Table)
        
        query.equalTo("simulationPtr",pointerToSimulation)
        query.equalTo("exists", true)
        query.limit(1000)
        query.skip(index * 1000)
    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetAllSuppliersToSave(pointerToSimulation, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
        
}

exports.UpdateVariousDataSuppliersRawMaterial = function(data, simulationPtr){
    var Simulations             = Parse.Object.extend("Simulations")
    var pointerToSimulation     = new Simulations()
        pointerToSimulation.id  = simulationPtr
    //log( data, simulationPtr)
    return new Promise(function (resolve, reject) {

            var dataTempo = data.objectId
            var arraySearch = []
            for (const key in dataTempo) {
                arraySearch.push(dataTempo[key])
            }
            exports.AsyncGetAllSuppliersRawMaterialToSave(pointerToSimulation, 0, [], function (results, error){
                if(error){return resolve({ type: "ELIMINAR", data: null, error: error.message })}
                for (let i = 0; i < results.length; i++) {
                    var activateDataFound = _.find(arraySearch,function(currentData){
                        return currentData == results[i].id
                    })
                    if(activateDataFound){
                        results[i].set("active",true)
                    }else{
                        results[i].set("active",false)
                    }

                    Parse.Object.saveAll(results).then((resultSave)=>{
                        resolve({ type: "AGREGAR", data: resultSave, error: null })
                    }, (error)=>{
                        resolve({ type: "AGREGAR", data: null, error: error.message })
                    })

                }
            })
    })
}

exports.AsyncGetAllSuppliersRawMaterialToSave = async (pointerToSimulation, index, dataArray, callback)=>{
    var Table = Parse.Object.extend(""+siglaTabla+"ProveedoresMP")
    var query = new Parse.Query(Table)
        
        query.equalTo("simulationPtr",pointerToSimulation)
        query.equalTo("exists", true)
        query.limit(1000)
        query.skip(index * 1000)
    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetAllSuppliersToSave(pointerToSimulation, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
        
}

//__________________

exports.UpdateVariousDataSalaryTabulator = function(data, simulationPtr){
    var Simulations             = Parse.Object.extend("Simulations")
    var pointerToSimulation     = new Simulations()
        pointerToSimulation.id  = simulationPtr
    //log( data, simulationPtr)
    return new Promise(function (resolve, reject) {

            var dataTempo = data.objectId
            var arraySearch = []
            for (const key in dataTempo) {
                arraySearch.push(dataTempo[key])
            }
            exports.AsyncGetAllSalaryTabulatorToSave(pointerToSimulation, 0, [], function (results, error){
                if(error){return resolve({ type: "ELIMINAR", data: null, error: error.message })}
                for (let i = 0; i < results.length; i++) {
                    var activateDataFound = _.find(arraySearch,function(currentData){
                        return currentData == results[i].id
                    })
                    if(activateDataFound){
                        results[i].set("active",true)
                    }else{
                        results[i].set("active",false)
                    }

                    Parse.Object.saveAll(results).then((resultSave)=>{
                        resolve({ type: "AGREGAR", data: resultSave, error: null })
                    }, (error)=>{
                        resolve({ type: "AGREGAR", data: null, error: error.message })
                    })

                }
            })
    })
}

exports.AsyncGetAllSalaryTabulatorToSave = async (pointerToSimulation, index, dataArray, callback)=>{
    var Table = Parse.Object.extend(""+siglaTabla+"SalaryTabulator")
    var query = new Parse.Query(Table)
        
        query.equalTo("simulationPtr",pointerToSimulation)
        query.equalTo("exists", true)
        query.limit(1000)
        query.skip(index * 1000)
    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetAllSuppliersToSave(pointerToSimulation, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
        
}

exports.UpdateVariousProductionLinePhases = function(data, simulationPtr){
    var Simulations             = Parse.Object.extend("Simulations")
    var pointerToSimulation     = new Simulations()
        pointerToSimulation.id  = simulationPtr
    //log( data, simulationPtr)
    return new Promise(function (resolve, reject) {

            var dataTempo = data.objectId
            var arraySearch = []
            for (const key in dataTempo) {
                arraySearch.push(dataTempo[key])
            }
            exports.AsyncGetAllProductionLinePhasesToSave(pointerToSimulation, 0, [], function (results, error){
                if(error){return resolve({ type: "ELIMINAR", data: null, error: error.message })}
                for (let i = 0; i < results.length; i++) {
                    var activateDataFound = _.find(arraySearch,function(currentData){
                        return currentData == results[i].id
                    })
                    if(activateDataFound){
                        results[i].set("active",true)
                    }else{
                        results[i].set("active",false)
                    }

                    Parse.Object.saveAll(results).then((resultSave)=>{
                        resolve({ type: "AGREGAR", data: resultSave, error: null })
                    }, (error)=>{
                        resolve({ type: "AGREGAR", data: null, error: error.message })
                    })

                }
            })
    })
}

exports.AsyncGetAllProductionLinePhasesToSave = async (pointerToSimulation, index, dataArray, callback)=>{
    var Table = Parse.Object.extend(""+siglaTabla+"ProductionLinePhases")
    var query = new Parse.Query(Table)
        
        query.equalTo("simulationPtr",pointerToSimulation)
        query.equalTo("exists", true)
        query.limit(1000)
        query.skip(index * 1000)
    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetAllSuppliersToSave(pointerToSimulation, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
        
}

exports.UpdateVariousProductionLineTemplates = function(data, simulationPtr){
    var Simulations             = Parse.Object.extend("Simulations")
    var pointerToSimulation     = new Simulations()
        pointerToSimulation.id  = simulationPtr
    //log( data, simulationPtr)
    return new Promise(function (resolve, reject) {

            var dataTempo = data.objectId
            var arraySearch = []
            for (const key in dataTempo) {
                arraySearch.push(dataTempo[key])
            }
            exports.AsyncGetAllProductionLineTemplatesToSave(pointerToSimulation, 0, [], function (results, error){
                if(error){return resolve({ type: "ELIMINAR", data: null, error: error.message })}
                for (let i = 0; i < results.length; i++) {
                    var activateDataFound = _.find(arraySearch,function(currentData){
                        return currentData == results[i].id
                    })
                    if(activateDataFound){
                        results[i].set("active",true)
                    }else{
                        results[i].set("active",false)
                    }

                    Parse.Object.saveAll(results).then((resultSave)=>{
                        resolve({ type: "AGREGAR", data: resultSave, error: null })
                    }, (error)=>{
                        resolve({ type: "AGREGAR", data: null, error: error.message })
                    })

                }
            })
    })
}

exports.AsyncGetAllProductionLineTemplatesToSave = async (pointerToSimulation, index, dataArray, callback)=>{
    var Table = Parse.Object.extend(""+siglaTabla+"ProductionLineTemplates")
    var query = new Parse.Query(Table)
        
        query.equalTo("simulationPtr",pointerToSimulation)
        query.equalTo("exists", true)
        query.limit(1000)
        query.skip(index * 1000)
    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetAllSuppliersToSave(pointerToSimulation, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
        
}