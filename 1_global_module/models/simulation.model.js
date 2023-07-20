var path = require('path')
var fs = require('fs')
var _ = require('underscore')
var Promise = require('promise')
var request = require('request')
var CryptoJS = require("crypto-js")
var faker  = require("faker")
var globalFunctionality  = require("../functionalities/global.functionality")
let Bitacora      = require("../models/administrador/bitacora.model") 
var moment = require('moment')

var log = console.log

let Seguridad = require(path.resolve(__dirname, '../middlewares/utils/seguridad.util'))

//var FunctionsGeneral = require(path.join(__dirname, '../../functions/general.js'))
var Parse = require('parse/node')
const { isNull, result } = require('underscore')

const APP_ID = process.env.APP_ID
const MASTER_KEY = process.env.MASTER_KEY

Parse._initialize(APP_ID, "", MASTER_KEY)
Parse.serverURL = process.env.PUBLIC_SERVER_URL

exports.SearchSimulation = function (objectId) {
    return new Promise(function (resolve, reject) {
        exports.AsyncSearchSimulation(objectId, function (object, error) {
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

exports.AsyncSearchSimulation = async (objectId, callback) => {
    var Table = Parse.Object.extend("Simulations")
    var query = new Parse.Query(Table)
    query.equalTo("objectId", objectId)
    query.equalTo("active", true)
    query.equalTo("exists", true)
    try {
        const results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.SearchTeam = function (objectId) {
    return new Promise(function (resolve, reject) {
        exports.AsyncSearchTeam(objectId, function (object, error) {
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

exports.AsyncSearchTeam = async (objectId, callback) => {
    var Table = Parse.Object.extend("SimulationsTeams")
    var query = new Parse.Query(Table)
    query.equalTo("objectId", objectId)
    query.equalTo("active", true)
    query.equalTo("exists", true)
    query.include("simulationPtr")
    try {
        const results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.GetAllClientOrders = function (simulationId,teamId) {
    return new Promise(function (resolve, reject) {
        exports.AsyncGetAvailableProductFamilies(0, simulationId,teamId, [], function (results, error) {
            if (!error) {
                //log("Recuperados: " + results.length)
                var availableVehicles = []
                var listPrice = []
                for(var i = 0; i < results.length; i++){
                    //log(results[i].get("SMDproductoFamiliaPtr").id)
                    availableVehicles.push(results[i].get("SMDproductoFamiliaPtr").get("nombre"))
                    listPrice.push({
                        name: results[i].get("SMDproductoFamiliaPtr").get("nombre"),
                        totalCost: results[i].get("totalCost"),
                        finalPrice: results[i].get("finalPrice")
                    })
                }
                //log("Fin")
                exports.AsyncGetAllClientOrders(0, simulationId, [], function (results, error) {
                    //log("Resultados " + availableVehicles)
                    if (!error) {
                        var finalResult = []
                        for(var i = 0; i < results.length; i++){
                            var order = results[i].get("order")
                            var orderVehicles = []
                            for(var j = 0; j < order.length; j++){
                                //log(order[j]["model"])
                                orderVehicles.push(order[j]["model"])
                            }
                            //log(orderVehicles)
                            var goodOrder = true
                            for(var j = 0; j < orderVehicles.length; j++){
                                if(availableVehicles.includes(orderVehicles[j])){
                                    goodOrder = true
                                }else{
                                    goodOrder = false
                                    break
                                }
                            }


                            if(goodOrder){
                                finalResult.push(results[i])
                            }
                        }
                        //log(results.length + " - " + finalResult.length)
                    
                        resolve({ type: "CONSULTA", data: finalResult, listPrice:listPrice, error: null })
                    } else {
                        resolve({ type: "CONSULTA", data: results, listPrice:null, error: error.message })
                    }

                })
            } else {
                resolve({ type: "CONSULTA", data: results, error: error.message })
            }
        })
    })
}

exports.AsyncGetAvailableProductFamilies = async (index, simulationId,teamId, dataArray, callback) => {
    var Table = Parse.Object.extend("TDProductoFamilia")
    var query = new Parse.Query(Table)

    var Simulations = Parse.Object.extend("Simulations")
    var pointerToSimulations = new Simulations()
    pointerToSimulations.id = simulationId

    var SimulationsTeams = Parse.Object.extend("SimulationsTeams")
    var pointerToSimulationsTeams = new SimulationsTeams()
    pointerToSimulationsTeams.id = teamId

    query.equalTo("simulationPtr", pointerToSimulations)
    query.equalTo("teamPtr", pointerToSimulationsTeams)
    query.equalTo("active", true)
    query.equalTo("exists", true)
    query.equalTo("status", "guardado")
    query.exists("totalCost")
    query.exists("finalPrice")
    query.skip(index * 1000)
    query.limit(1000)
    query.include("SMDproductoFamiliaPtr")

    try {
        const results = await query.find()
        if (results.length <= 0) {
            //console.log("Finaliza")
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            //console.log("Avanzando")
            exports.AsyncGetAvailableProductFamilies((index + 1), simulationId, teamId, dataArray, callback)
        }
    } catch (error) {
        //throw new Error(error)
        callback(dataArray, error)
    }
}

exports.AsyncGetAllClientOrders = async (index, simulationId, dataArray, callback) => {
    var Table = Parse.Object.extend("SimulationsOrders")
    var query = new Parse.Query(Table)

    var Simulations = Parse.Object.extend("Simulations")
    var pointerToSimulations = new Simulations()
    pointerToSimulations.id = simulationId
    query.equalTo("simulationPtr", pointerToSimulations)
    query.equalTo("active", true)
    query.equalTo("exists", true)
    query.descending("createdAt")
    query.doesNotExist("teamPtr")
    query.skip(index * 1000)
    query.limit(1000)
    query.include("clientPtr")

    try {
        const results = await query.find()
        if (results.length <= 0) {
            //console.log("Finaliza")
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            //console.log("Avanzando")
            exports.AsyncGetAllClientOrders((index + 1), simulationId, dataArray, callback)
        }
    } catch (error) {
        //throw new Error(error)
        callback(dataArray, error)
    }
}

exports.GetAllClientOrdersTeam = function (teamId) {
    //log("Iniciando promesa")
    return new Promise(function (resolve, reject) {

        exports.AsyncGetAllClientOrdersTeam(0, teamId, [], function (results, error) {
            //log("Resultados " + results.length)
            if (!error) {
                resolve({ type: "CONSULTA", data: results, error: null })
            } else {
                resolve({ type: "CONSULTA", data: results, error: error.message })
            }

        })
    })
}

exports.AsyncGetAllClientOrdersTeam = async (index, teamId, dataArray, callback) => {
    var Table = Parse.Object.extend("SimulationsOrders")
    var query = new Parse.Query(Table)

    var SimulationsTeams = Parse.Object.extend("SimulationsTeams")
    var pointerToSimulationsTeams = new SimulationsTeams()
    pointerToSimulationsTeams.id = teamId
    query.equalTo("teamPtr", pointerToSimulationsTeams)
    query.equalTo("active", true)
    query.equalTo("exists", true)
    query.descending("createdAt")
    query.skip(index * 1000)
    query.limit(1000)
    query.include("clientPtr")

    try {
        const results = await query.find()
        if (results.length <= 0) {
            //console.log("Finaliza")
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            //console.log("Avanzando")
            exports.AsyncGetAllClientOrdersTeam((index + 1), teamId, dataArray, callback)
        }
    } catch (error) {
        //throw new Error(error)
        callback(dataArray, error)
    }
}

exports.ClientOrdersAssign = function (teamId, orderId,revenue) {
    //log("Iniciando promesa")
    return new Promise(function (resolve, reject) {
        exports.SearchOrderWithoutTeam(orderId).then(function (result) {
            if (!result.error && result.data) {
                var data = result.data
                log(teamId)

                var SimulationsTeams = Parse.Object.extend("SimulationsTeams")
                var pointerToSimulationsTeams = new SimulationsTeams()
                pointerToSimulationsTeams.id = teamId
                data.set("teamPtr", pointerToSimulationsTeams)
                data.set("revenue", revenue)

                log(data.id)
                data.save()
                    .then((object) => {
                        resolve({ type: "AGREGAR", data: object, error: null })
                    }, (error) => {
                        resolve({ type: "AGREGAR", data: null, error: error.message })
                    })
            } else {
                resolve({ type: "BÚSQUEDA", data: null, error: "Order was already assigned" })
            }
        })
    })
}

exports.SearchOrderWithoutTeam = function (objectId) {
    return new Promise(function (resolve, reject) {
        exports.AsyncSearchOrderWithoutTeam(objectId, function (object, error) {
            if (!error) {
                if (object) {
                    resolve({ type: "BÚSQUEDA", data: object, error: null })
                } else {
                    resolve({ type: "BÚSQUEDA", data: null, error: "Order was not found" })
                }
            } else {
                resolve({ type: "BÚSQUEDA", data: null, error: error.message })
            }
        })
    })
}

exports.AsyncSearchOrderWithoutTeam = async (objectId, callback) => {
    var Table = Parse.Object.extend("SimulationsOrders")
    var query = new Parse.Query(Table)
    query.equalTo("objectId", objectId)
    query.equalTo("active", true)
    query.equalTo("exists", true)
    query.doesNotExist("teamPtr")
    try {
        const results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.ObtenerFamiliaProductos = function (idSimulation, idTeam) {

    var Simulations = Parse.Object.extend("Simulations");
    var simulation = new Simulations()
    simulation.id = idSimulation

    var SimulationsTeams = Parse.Object.extend("SimulationsTeams");
    var team = new SimulationsTeams()
    team.id = idTeam

    return new Promise(function (resolve, reject) {
        exports.AsycSearchPurchasingsSuppliersTrue(simulation, team, 0, [], function (resultsPurchasing, error) {

            if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message }) }

            exports.AsyncObtenerDMMateriaPrima(0, [], function (listaMateriaPrima, error) {
                exports.AsyncSimulacionProductoFamilia(simulation, 0, [], function (objetosProductiFamilia, error) {

                    if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message }) }

                    exports.AsyncContarTDBuscarProductoFamilia(objetosProductiFamilia, team, simulation, function (totalFalmiliEquipo, error) {

                        if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message }) }

                        if (totalFalmiliEquipo > 0) {
                            exports.AsyncTodosTDBuscarProductoFamilia(objetosProductiFamilia, team, simulation, 0, [], function (productoFalmiliEquipo, error) {
                                if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message }) }
                                return resolve({ type: "AGREGAR", data: productoFalmiliEquipo, dataMateriaPrima: listaMateriaPrima, dataPurchasing: resultsPurchasing, error: null })
                            })
                        } else {
                            var arregloProductoFamilia = []
                            objetosProductiFamilia.forEach(element => {
                                var TDProductoFamilia = Parse.Object.extend("TDProductoFamilia")
                                var object = new TDProductoFamilia()
                                object.set("SMDproductoFamiliaPtr", element)
                                object.set("teamPtr", team)
                                object.set("simulationPtr", simulation)
                                object.set("status", "noguardado")
                                object.set("exists", true)
                                object.set("active", false)
                                arregloProductoFamilia.push(object)
                            })
                            Parse.Object.saveAll(arregloProductoFamilia).then((objetosTDProductoFamilia) => {
                                resolve({ type: "AGREGAR", data: objetosTDProductoFamilia, dataMateriaPrima: listaMateriaPrima, dataPurchasing: resultsPurchasing, error: null })
                            }, (error) => {
                                resolve({ type: "AGREGAR", data: null, error: error.message })
                            })

                        }
                    })

                })
            })
        })
    })
}

exports.AsycSearchPurchasingsSuppliersTrue = async (simulation, teamPtr, index, dataArray, callback) => {

    var TableSDMTransporte = Parse.Object.extend("SDMTransporte")
    var innerTransporteQuery = new Parse.Query(TableSDMTransporte)

    innerTransporteQuery.equalTo("exists", true)
    innerTransporteQuery.equalTo("active", true)
    innerTransporteQuery.equalTo("simulationPtr", simulation)

    var SimulationsPurchasing = Parse.Object.extend("SimulationsPurchasing")
    var query = new Parse.Query(SimulationsPurchasing)

    query.equalTo("teamPtr", teamPtr)
    query.matchesQuery("transporteSDMPtr", innerTransporteQuery)
    query.equalTo("exists", true)
    query.equalTo("active", true)
    query.equalTo("default", true)
    query.include("provedorMateriaPrimaSDMPtr.materiaPrimaPtr")
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsycSearchPurchasingsSuppliersTrue(simulation, teamPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(dataArray, error)
    }
}

exports.AsyncSimulacionProductoFamilia = async (objectId, index, dataArray, callback) => {
    var Table = Parse.Object.extend("SDMProductoFamilia")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)
    //query.equalTo("active", true)
    query.equalTo("simulationPtr", objectId)
    query.ascending("nombre")
    query.skip(index * 1000)
    query.limit(1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            //console.log("Finaliza")
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            //console.log("Avanzando")
            exports.AsyncSimulacionProductoFamilia(objectId, (index + 1), dataArray, callback)
        }
    } catch (error) {
        //throw new Error(error)
        callback(dataArray, error)
    }

}

exports.AsyncContarTDBuscarProductoFamilia = async (ptrSMDproductoFamilia, ptrEquipo, ptrSimulacion, callback) => {
    var Table = Parse.Object.extend("TDProductoFamilia")
    var query = new Parse.Query(Table)

    query.containedIn("SMDproductoFamiliaPtr", ptrSMDproductoFamilia)
    query.equalTo("teamPtr", ptrEquipo)
    query.equalTo("simulationPtr", ptrSimulacion)
    query.addAscending('SMDproductoFamiliaPtr.nombre')
    query.equalTo("exists", true)
    //query.equalTo("active", true)

    try {
        var results = await query.count()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }

}

exports.AsyncTodosTDBuscarProductoFamilia = async (ptrSMDproductoFamilia, ptrEquipo, ptrSimulacion, index, dataArray, callback) => {
    var Table = Parse.Object.extend("TDProductoFamilia")
    var query = new Parse.Query(Table)

    query.containedIn("SMDproductoFamiliaPtr", ptrSMDproductoFamilia)
    query.equalTo("teamPtr", ptrEquipo)
    query.equalTo("simulationPtr", ptrSimulacion)
    query.equalTo("exists", true)
    //query.equalTo("active", true)
    query.include("SMDproductoFamiliaPtr")
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            //console.log("Finaliza")
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            //console.log("Avanzando")
            exports.AsyncTodosTDBuscarProductoFamilia(ptrSMDproductoFamilia, ptrEquipo, ptrSimulacion, (index + 1), dataArray, callback)
        }
    } catch (error) {
        //throw new Error(error)
        callback(dataArray, error)
    }

}

exports.AsyncObtenerDMMateriaPrima = async (index, dataArray, callback) => {
    var Table = Parse.Object.extend("DMMateriaPrima")
    var query = new Parse.Query(Table)
    query.equalTo("exists", true)
    //query.equalTo("active",true)
    query.ascending("nombre")
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            //console.log("Finaliza")
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            //console.log("Avanzando")
            exports.AsyncObtenerDMMateriaPrima((index + 1), dataArray, callback)
        }
    } catch (error) {
        //throw new Error(error)
        callback(dataArray, error)
    }
}

exports.BomSaveSimulation = function (data, simulationId, teamId) {
    var Simulations = Parse.Object.extend("Simulations");
    var simulation = new Simulations()
    simulation.id = simulationId

    var SimulationsTeams = Parse.Object.extend("SimulationsTeams");
    var team = new SimulationsTeams()
    team.id = teamId
    return new Promise(function (resolve, reject) {

        exports.AsyncTDBuscarProductoFamilia(data["objectIdTDMateriPrima"], team, simulation, function (results, error) {
            if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message }) }

            delete data["objectIdTDMateriPrima"]

            var component = results.get("SMDproductoFamiliaPtr").get("component")
            /*var losDatosSonIguales = true

            var datoComparaUno
            var datoComparaDos
            var keyComparaUno
            var keyComparaDos

            for (var key in data) {
                datoComparaUno = data[key]
                keyComparaUno = key
                for (var llave in component) {

                    if (keyComparaUno == llave) {
                        datoComparaDos = component[llave]
                        keyComparaDos = llave
                        break
                    }
                }
                if (datoComparaUno != datoComparaDos) {
                    losDatosSonIguales = false
                    break
                }
            }

            if (!losDatosSonIguales) {
                return resolve({ type: "CONSULTA", data: results, esIgual: false, error: null })
            } else {*/
                results.set("status", "guardado")
                results.set("component", data)
                results.set("active", true)
                results.save().then((MateraiPrimaGuardado) => {
                    resolve({ type: "CONSULTA", data: results, esIgual: true, error: null })
                }, (error) => {
                    resolve({ type: "CONSULTA", data: null, error: error.message })
                })
            //}
        })
    })
}

exports.AsyncTDBuscarProductoFamilia = async (prtTDProductoFamilia, teamId, simulationId, callback) => {
    var Table = Parse.Object.extend("TDProductoFamilia")
    var query = new Parse.Query(Table)

    query.equalTo("objectId", prtTDProductoFamilia)
    query.equalTo("teamPtr", teamId)
    query.equalTo("simulationPtr", simulationId)
    query.equalTo("exists", true)
    //query.equalTo("active", true)
    query.include("SMDproductoFamiliaPtr")

    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.BomExplosionRMSimulation = function (data, simulationId, teamId) {
    var Simulations         = Parse.Object.extend("Simulations");
    var simulation          = new Simulations()
        simulation.id       = simulationId

    var SimulationsTeams    = Parse.Object.extend("SimulationsTeams");
    var team                = new SimulationsTeams()
        team.id             = teamId

    return new Promise(function (resolve, reject) {
        exports.AsyncSearchTDproductFamily( data["familyPtr"], simulation, team, 0, [], function (resultsFamily, error){
            if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message }) }
            resultsFamily.set("totalCost",data["totalCost"])
            resultsFamily.set("finalPrice",data["totalCost"])   
            resultsFamily.save().then((result)=>{
                resolve({ type: "ACTUALIZAR", data: result, error: null})
            }, (error)=>{
                resolve({ type: "ACTUALIZAR", data: null, error: error.message })
            })
        })
    })
}

exports.AsyncSearchTDproductFamily = async ( familyPtr, simulationPtr, teamPtr, index, dataArray, callback ) => {
    var Table = Parse.Object.extend("TDProductoFamilia")
    var query = new Parse.Query(Table)

    query.equalTo("exists",true)
    query.equalTo("active", true)
    query.equalTo("simulationPtr",simulationPtr)
    query.equalTo("teamPtr",teamPtr)
    query.equalTo("objectId",familyPtr)

    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.BomArchivarSimulation = function (data, simulationId, teamId) {
    var Simulations = Parse.Object.extend("Simulations");
    var simulation = new Simulations()
    simulation.id = simulationId

    var SimulationsTeams = Parse.Object.extend("SimulationsTeams");
    var team = new SimulationsTeams()
    team.id = teamId
    return new Promise(function (resolve, reject) {

        exports.AsyncTDBuscarProductoFamilia(data["idMateriaPrima"], team, simulation, function (results, error) {
            if (error) { return resolve({ type: "ARCHIVAR", data: null, error: error.message }) }
            if (data["seActiva"] == "true") {
                results.set("active", true)
                //results.set("status", true)
            } else {
                results.set("active", false)
                //results.set("status", false)
            }

            results.save().then((resultsArchivado) => {
                resolve({ type: "ARCHIVAR", data: resultsArchivado, error: null })
            }, (error) => {
                resolve({ type: "ARCHIVAR", data: null, error: error.message })
            })
        })
    })
}

exports.GetAllPurchasing = function (simulationId, teamId) {
    var Simulations = Parse.Object.extend("Simulations")
    var simulation = new Simulations()
    simulation.id = simulationId

    var SimulationsTeams = Parse.Object.extend("SimulationsTeams")
    var team = new SimulationsTeams()
    team.id = teamId

    return new Promise(function (resolve, reject) {

        exports.CheckSuppliers( simulation, team ).then(function( dataResult, error){
            exports.GetSimulationTeam(simulation, teamId, function(resultsTeam, error){
                exports.AsyncSearchSimulationPurchasing(simulation, team, 0, [], function (resultsPurchasing, error) {

                    if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message }) }

                    if (resultsPurchasing.length > 0) {

                        //Se elimina los datos que se repiten por materia prima para saber cuantas materias primas son 
                        const unicos = _.uniq(resultsPurchasing, function (persona) {
                            return persona.get("provedorMateriaPrimaSDMPtr").get("materiaPrimaPtr").id;
                        });

                        //return resolve({ type: "CONSULTA", data: arregloSinDuplicadosTransporte, dataMateriaPtr: unicos, error: null })
                        return resolve({ type: "CONSULTA", data: resultsPurchasing, dataMateriaPtr: unicos, money: resultsTeam.get("teamCurrentMoney"), error: null })
                    }

                    exports.AsyncSearchSDMprovevoresMP(simulation, 0, [], function (resultsSuppliersRM, error) {

                        if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message }) }

                        exports.AsyncSearchSDMTransport(simulation, 0, [], function (resultsTransports, error) {

                            if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message }) }

                            var arregloCompras = []

                            resultsTransports.forEach(element => {

                                var encotrado = _.find(resultsSuppliersRM, function (p) { return p.get("proveedorPtr").id == element.get("proveedorPtr").id && p.get("materiaPrimaPtr").id == element.get("productoPtr").id });
                                if (encotrado != undefined) {
                                    var Table = Parse.Object.extend("SimulationsPurchasing")
                                    var object = new Table()
                                    object.set("provedorMateriaPrimaSDMPtr", encotrado)
                                    object.set("transporteSDMPtr", element)
                                    object.set("teamPtr", team)
                                    object.set("default", false)
                                    object.set("exists", true)
                                    object.set("active", true)

                                    arregloCompras.push(object)
                                }

                            })

                            Parse.Object.saveAll(arregloCompras).then((resultadoCompras) => {

                                //Se elimina los datos que se repiten por materia prima para saber cuantas materias primas son 
                                const unicos = _.uniq(resultadoCompras, function (materia) {
                                    return materia.get("provedorMateriaPrimaSDMPtr").get("materiaPrimaPtr").id
                                });
                                resolve({ type: "CONSULTA", data: resultadoCompras, dataMateriaPtr: unicos, money: resultsTeam.get("teamCurrentMoney"), error: null })
                                //resolve({ type: "CONSULTA", data: arregloSinDuplicadosTransporte, dataMateriaPtr: unicos, error: null })
                            }, (error) => {
                                resolve({ type: "CONSULTA", data: null, error: null })
                            })

                        })
                    })
                })
            })
        })

    })
}

exports.CheckSuppliers = function ( simulation, teamId ){

    return new Promise( function ( resolve, reject ) {

        exports.AsyncGetAllDynamicTeam( teamId,simulation, "TDProductoFamilia", 0, [] , function(resultProducts,error){
            var arrayPtrRawMaterial = []
            for (let i = 0; i < resultProducts.length; i++) {
                var componets = resultProducts[i].get("SMDproductoFamiliaPtr").get("component")
                for (const key in componets) {
                    arrayPtrRawMaterial.push( key )
                }
            }

            var arrayPtrRawMaterialUniq = _.uniq(arrayPtrRawMaterial, function(current){
                return current
            })

            exports.AsyncGetAllDynamicTeam( teamId,simulation, "SimulationsPurchasing", 0, [] , function(resultSupllierPurchasing,error){
                var rawMateriaNotFound = []
                for (let i = 0; i < arrayPtrRawMaterialUniq.length; i++) {
                    var dataFound = _.filter(resultSupllierPurchasing, function(current){
                        return current.get('provedorMateriaPrimaSDMPtr').get("materiaPrimaPtr").id == arrayPtrRawMaterialUniq[i]
                    })

                    if( dataFound.length <= 0){
                        rawMateriaNotFound.push(arrayPtrRawMaterialUniq[i])
                    }
                }

                exports.AsyncSearchSDMprovevoresMP(simulation, 0, [], function (resultsSuppliersRM, error) {

                    exports.AsyncSearchSDMTransport(simulation, 0, [], function (resultsTransports, error) {
                        var arrayToSave = []
                        for (let  i= 0; i < rawMateriaNotFound.length; i++) {

                            var supplierRawMaterialNew = _.filter( resultsSuppliersRM, function(current){
                                return current.get("materiaPrimaPtr").id == rawMateriaNotFound[i]
                            })

                            var transportNew = _.filter( resultsTransports, function(current){
                                return current.get("productoPtr").id == rawMateriaNotFound[i]
                            })

                                for (let j = 0; j < supplierRawMaterialNew.length; j++) {
                                    var supplierTransportFound = _.find(transportNew,function(current) {
                                        return current.get("proveedorPtr").id == supplierRawMaterialNew[j].get("proveedorPtr").id
                                    })                                    

                                    if(supplierTransportFound){
                                        var Table = Parse.Object.extend("SimulationsPurchasing")
                                        var object = new Table()
                                            object.set("provedorMateriaPrimaSDMPtr", supplierRawMaterialNew[j])
                                            object.set("transporteSDMPtr", supplierTransportFound)
                                            object.set("teamPtr", teamId)
                                            object.set("default", false)
                                            object.set("exists", true)
                                            object.set("active", true)
                                        arrayToSave.push(object)
                                    }
                                }
                            
                        }

                        Parse.Object.saveAll(arrayToSave).then((results) => {

                            resolve({ type: "CONSULTA", data: results,  error: null })
                        }, (error) => {
                            resolve({ type: "CONSULTA", data: null, error: error })
                        })
                    })
                    
                
                })

            })
        })
    })
    
}

exports.AsyncGetAllDynamicTeam = async (teamPtr, simulation, nameTable, index, dataArray, callback) => {

    var Table = Parse.Object.extend(nameTable)
    var query = new Parse.Query(Table)

            query.equalTo("teamPtr", teamPtr)
        if(nameTable != 'SimulationsPurchasing' ){
            query.equalTo("simulationPtr", simulation)
        }
            query.equalTo("exists", true)
            query.includeAll()
            query.limit(1000)
            query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetAllDynamicTeam(teamPtr, simulation, nameTable, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(dataArray, error)
    }

}

exports.AsyncSearchSDMprovevoresMP = async (simulationPtr, index, dataArray, callback) => {
    var TableMateriaPrima = Parse.Object.extend("DMMateriaPrima")
    var innerQuery = new Parse.Query(TableMateriaPrima)

    innerQuery.equalTo("exists", true)
    innerQuery.equalTo("active", true)

    var TableProveedores = Parse.Object.extend("SDMProveedores")
    var innerInnerQuery = new Parse.Query(TableProveedores)

    innerInnerQuery.equalTo("exists", true)
    innerInnerQuery.equalTo("active", true)
    innerInnerQuery.equalTo("simulationPtr", simulationPtr)

    var Table = Parse.Object.extend("SDMProveedoresMP")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr", simulationPtr)
    query.matchesQuery("proveedorPtr", innerInnerQuery)
    query.matchesQuery("materiaPrimaPtr", innerQuery)
    query.equalTo("exists", true)
    query.equalTo("active", true)
    query.include("proveedorPtr")
    query.include("materiaPrimaPtr")
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncSearchSDMprovevoresMP(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(dataArray, error)
    }


}

exports.AsyncSearchSDMTransport = async (simulationPtr, index, dataArray, callback) => {
    var TableMateriaPrima = Parse.Object.extend("DMMateriaPrima")
    var innerQuery = new Parse.Query(TableMateriaPrima)

    innerQuery.equalTo("exists", true)
    innerQuery.equalTo("active", true)

    var TableProveedores = Parse.Object.extend("SDMProveedores")
    var innerInnerQuery = new Parse.Query(TableProveedores)

    innerInnerQuery.equalTo("exists", true)
    innerInnerQuery.equalTo("active", true)
    innerInnerQuery.equalTo("simulationPtr", simulationPtr)

    var Table = Parse.Object.extend("SDMTransporte")
    var query = new Parse.Query(Table)

    query.matchesQuery("proveedorPtr", innerInnerQuery)
    query.matchesQuery("productoPtr", innerQuery)
    query.equalTo("simulationPtr", simulationPtr)
    query.equalTo("exists", true)
    query.equalTo("active", true)
    query.include("proveedorPtr")
    query.include("productoPtr")
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncSearchSDMTransport(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(dataArray, error)
    }
}

exports.AsyncSearchSimulationPurchasing = async (simulationPtr, teamPtr, index, dataArray, callback) => {

    var TableMateriaPrima = Parse.Object.extend("DMMateriaPrima")
    var innerMateriaPrimaQuery = new Parse.Query(TableMateriaPrima)

    innerMateriaPrimaQuery.equalTo("exists", true)
    innerMateriaPrimaQuery.equalTo("active", true)

    var TableProveedores = Parse.Object.extend("SDMProveedores")
    var innerProvedoreQuery = new Parse.Query(TableProveedores)

    innerProvedoreQuery.equalTo("exists", true)
    innerProvedoreQuery.equalTo("active", true)
    innerProvedoreQuery.equalTo("simulationPtr", simulationPtr)

    var TableProveedoresMP = Parse.Object.extend("SDMProveedoresMP")
    var proveedoresMP = new Parse.Query(TableProveedoresMP)

    proveedoresMP.matchesQuery("materiaPrimaPtr", innerMateriaPrimaQuery)
    proveedoresMP.matchesQuery("proveedorPtr", innerProvedoreQuery)
    proveedoresMP.equalTo("simulationPtr", simulationPtr)
    proveedoresMP.equalTo("exists", true)
    proveedoresMP.equalTo("active", true)
    proveedoresMP.include("materiaPrimaPtr")
    proveedoresMP.include("proveedorPtr")

    var TableSDMTransporte = Parse.Object.extend("SDMTransporte")
    var innerTransporteQuery = new Parse.Query(TableSDMTransporte)

    innerTransporteQuery.equalTo("exists", true)
    innerTransporteQuery.equalTo("active", true)
    innerTransporteQuery.equalTo("simulationPtr", simulationPtr)

    //---------Quey priincipal------
    var Table = Parse.Object.extend("SimulationsPurchasing")
    var query = new Parse.Query(Table)

    query.matchesQuery("provedorMateriaPrimaSDMPtr", proveedoresMP)
    query.matchesQuery("transporteSDMPtr", innerTransporteQuery)
    query.equalTo("teamPtr", teamPtr)
    query.equalTo("exists", true)
    query.equalTo("active", true)
    query.include("transporteSDMPtr")
    query.include("provedorMateriaPrimaSDMPtr.materiaPrimaPtr")
    query.include("provedorMateriaPrimaSDMPtr.proveedorPtr")
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncSearchSimulationPurchasing(simulationPtr, teamPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(dataArray, error)
    }

}

exports.SaveDefaultSuppliersFirstEntry = function(data, simulationId, teamId){
    var Simulations = Parse.Object.extend("Simulations")
    var simulation = new Simulations()
    simulation.id = simulationId

    var SimulationsTeams = Parse.Object.extend("SimulationsTeams")
    var team = new SimulationsTeams()
    team.id = teamId

    return new Promise(function (resolve, reject) {
        exports.AsyncGetCountAlwaysDefaultSuppliers(team, function(resultsCount, error){
            if(error) { return resolve({ type: "ACTUALIZAR", data: null, error: error.message })}

            if(resultsCount > 0){
                resolve({ type: "ACTUALIZAR", data: resultsCount, error: null})
            }else{
                exports.AsyncGetSuppliersForDefaultFirtsEntry(data, team, 0, [], function (results, error){
                    if(error) { return resolve({ type: "ACTUALIZAR", data: null, error: error.message })}
                    //log(results, error)
                    var arrayDefault = []
                    results.forEach(element => {
                        //log(element.get("default"))
                        element.set("default",true)
                        arrayDefault.push(element)
                    })
                    Parse.Object.saveAll(arrayDefault).then((resultSave)=>{
                        resolve({ type: "ACTUALIZAR", data: resultSave, error: null})
                    }, (error)=>{
                        resolve({ type: "ACTUALIZAR", data: null, error: error.message })
                    })
                })
            }
        })
    })
}

exports.AsyncGetCountAlwaysDefaultSuppliers = async (teamPtr, callback) => {
    var Table = Parse.Object.extend("SimulationsPurchasing")
    var query = new Parse.Query(Table)

        query.equalTo("teamPtr",teamPtr)
        query.equalTo("default",true)

    try {
        var results = await query.count()
        callback(results,null)
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetSuppliersForDefaultFirtsEntry = async (arrayObjectsIds, teamId, index, dataArray, callback) => {
    var Table = Parse.Object.extend("SimulationsPurchasing")
    var query = new Parse.Query(Table)

    query.containedIn("objectId", arrayObjectsIds)
    query.equalTo("teamPtr", teamId)
    query.equalTo("exists", true)
    query.equalTo("active", true)
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetSuppliersForDefaultFirtsEntry(arrayObjectsIds, teamId, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.SavePurchasing = function (data, simulationId, teamId) {
    
    var Simulations = Parse.Object.extend("Simulations")
    var simulation = new Simulations()
    simulation.id = simulationId

    var SimulationsTeams = Parse.Object.extend("SimulationsTeams")
    var team = new SimulationsTeams()
    team.id = teamId

    return new Promise(function (resolve, reject) {

        var arregloTransportesPtr = []
        if(Array.isArray(data["transprote"])){
            for (let i = 0; i < data["transprote"].length; i++) {
                var Tabla = Parse.Object.extend("SDMTransporte")
                var object = new Tabla()
                object.id = data["transprote"][i]

                arregloTransportesPtr.push(object)
            }
        }else{
            arregloTransportesPtr.push(data["transprote"])
        }

        delete data.transprote
        delete data.PurchasinDataTable_length
        var arregloProveedorMP = []
        for (const key in data) {

            var ProveedorMP = Parse.Object.extend("SDMProveedoresMP")
            var proveedorMP = new ProveedorMP()

            proveedorMP.id = data[key]

            arregloProveedorMP.push(proveedorMP)
        }

        exports.AsyncSearchDefaultExistSimulationPurchasing(team, arregloTransportesPtr, arregloProveedorMP, 0, [], function (results, error) {
            if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message }) }

            var arrayTrueExistPurchasing = []
            var arryNoExistPurchasing = []
            exports.AsyncSearchDefaultSimulationPurchasing(team, 0, [], function (resultsPurchasing, error) {

                var suppliersDefault = _.filter(resultsPurchasing, function (obj){
                    return obj.get("default") == true
                })
                results.forEach(element => {
                    var datFound = _.find(suppliersDefault, function(current){
                        return current.get("provedorMateriaPrimaSDMPtr").get("materiaPrimaPtr").id == element.get("provedorMateriaPrimaSDMPtr").get("materiaPrimaPtr").id
                    })
                    if(datFound){
                        arryNoExistPurchasing.push(element.set("default", false))
                    }
                });

                /*resultsPurchasing.forEach(element => {
                    arryNoExistPurchasing.push(element.set("default", false)) 
                });*/

                results.forEach(element => {
                    arrayTrueExistPurchasing.push(element.set("default", true))
                });

                Parse.Object.saveAll(arryNoExistPurchasing).then((resultsDefaulFalsePurchasing) => {
                    Parse.Object.saveAll(arrayTrueExistPurchasing).then((resultsDefaulTruePurchasing) => {
                        resolve({ type: "EDITAR", data: resultsDefaulTruePurchasing, error: null })
                    }, (error) => {
                        resolve({ type: "EDITAR", data: null, error: error.message })
                    })
                }, (error) => {
                    resolve({ type: "EDITAR", data: null, error: error.message })
                })

            })
        })

    })
}

exports.AsyncSearchDefaultExistSimulationPurchasing = async (teamPtr, arregloTransportesPtr, arregloProveedorMP, index, dataArray, callback) => {

    var Table = Parse.Object.extend("SimulationsPurchasing")
    var query = new Parse.Query(Table)

    query.containedIn("transporteSDMPtr", arregloTransportesPtr)
    query.containedIn("provedorMateriaPrimaSDMPtr", arregloProveedorMP)
    query.equalTo("teamPtr", teamPtr)
    query.equalTo("exists", true)
    query.equalTo("active", true)
    query.include("provedorMateriaPrimaSDMPtr.proveedorSDMPtr")
    query.include("provedorMateriaPrimaSDMPtr.transporteSDMPtr")
    query.include("provedorMateriaPrimaSDMPtr")
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncSearchDefaultExistSimulationPurchasing(teamPtr, arregloTransportesPtr, arregloProveedorMP, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(dataArray, error)
    }

}

exports.AsyncSearchDefaultSimulationPurchasing = async (teamPtr, index, dataArray, callback) => {

    var Table = Parse.Object.extend("SimulationsPurchasing")
    var query = new Parse.Query(Table)

    query.equalTo("teamPtr", teamPtr)
    query.equalTo("exists", true)
    query.equalTo("active", true)
    query.includeAll()
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncSearchDefaultSimulationPurchasing(teamPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(dataArray, error)
    }

}

exports.GetAllSales = function (simulationId,teamId){

    var Simulations         = Parse.Object.extend("Simulations")
    var simulation          = new Simulations()
        simulation.id       = simulationId

    var SimulationsTeams    = Parse.Object.extend("SimulationsTeams")
    var team                = new SimulationsTeams()
        team.id             = teamId

    return new Promise(function (resolve, reject) {
        exports.AsyncGetAllsSales( simulation, team, 0, [], function( resultsSales, error ){
            if (error) { return resolve( { type: "CONSULTA", data: null, error: error.message } ) }
            resolve( { type: "CONSULTA", data: resultsSales, error: null } )
        })
    })
}

exports.AsyncGetAllsSales = async ( simulationPtr, teamPtr, index, dataArray, callback ) => {
    var Table = Parse.Object.extend("TDProductoFamilia")
    var query = new Parse.Query(Table)

    query.equalTo("exists",true),
    query.equalTo("active",true)
    query.equalTo("simulationPtr",simulationPtr)
    query.equalTo("teamPtr",teamPtr)
    query.include("SMDproductoFamiliaPtr")
    query.exists("totalCost")
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetAllsSales(simulationPtr,teamPtr,(index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(dataArray, error)
    }
}

exports.SaveSales = function ( data, simulationId, teamId ) {

    var Simulations         = Parse.Object.extend("Simulations")
    var simulation          = new Simulations()
        simulation.id       = simulationId

    var SimulationsTeams    = Parse.Object.extend("SimulationsTeams")
    var team                = new SimulationsTeams()
        team.id             = teamId

    return new Promise(function (resolve, reject) {
        exports.AsyncSearchSales( simulation, team, 0, [], function ( resultsSales, error ){
            if (error) { return resolve( { type: "CONSULTA", data: null, error: error.message } ) }

            delete  data["dataTableSales_length"]
            var     arregloPriceSales = []

                //Recorremos la data que viene de la vista
            for (var key in data) {
                    //Se busca el id de resultado del query con el de la data que viene de la vista 
                var sale = _.find( resultsSales, function(current) { return current.id == key })
                    //Se agrega el nuevo precio del producto
                    sale.set("finalPrice",data[key])
                    //Se agrega al arreglo
                    arregloPriceSales.push(sale)
            }
                //Se guardan los cambios del arreglo en la base de datos
            Parse.Object.saveAll(arregloPriceSales).then( ( resultSaleSave ) => {
                resolve( { type: "AGREGAR", data: resultSaleSave, error: null } )
            }, ( error ) => {
                resolve( { type: "AGREGAR", data: null, error: error.message } )
            })
        })
    })
}

exports.AsyncSearchSales = async ( simulationPtr, teamPtr, index, dataArray, callback ) => {
    var Table = Parse.Object.extend("TDProductoFamilia")
    var query = new Parse.Query(Table)

    query.equalTo("exists",true)
    query.equalTo("active", true)
    query.equalTo("simulationPtr",simulationPtr)
    query.equalTo("teamPtr",teamPtr)
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncSearchSales( simulationPtr, teamPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(dataArray, error)
    }
}

exports.GetAllOrdersPurchasing = function ( simulationPtr, teamPtr ) {
    var Simulations         = Parse.Object.extend("Simulations")
    var simulation          = new Simulations()
        simulation.id       = simulationPtr

    var SimulationsTeams    = Parse.Object.extend("SimulationsTeams")
    var team                = new SimulationsTeams()
        team.id             = teamPtr

    return new Promise(function (resolve, reject) {
        exports.AsyncGetAllOrdersSuppliers( simulation, team, 0, [], function ( results, error ) {
            if (error) { return resolve( { type: "CONSULTA", data: null, error: error.message } ) }
            
                //Eliminar duplicados para obtener el número de órdenes que hay en el sistema
            var numerosUnicosOrdenes = _.uniq(results,function(current){
                return current.get("simulationOrderPurchaingPtr").get("folioNumber")
            })
            
            var getFullOrders  = []
                //Crea el arreglo de objetos por número de orden
            for (let i = 0; i < numerosUnicosOrdenes.length; i++) {

                    //Obtenemos los objetos con el mismo numero de orden al que pertenecen 
                var ordersObjectsFull = _.filter(results, function (obj){
                    return obj.get("simulationOrderPurchaingPtr").get("folioNumber") == numerosUnicosOrdenes[i].get("simulationOrderPurchaingPtr").get("folioNumber")
                })
                    //Obtenemos los objetos que tienen el status en FINISHED de los objetos encontrados con el mismo número de orden
                var ordersObjectsStatusFinished = _.filter(ordersObjectsFull, function (obj){
                    return obj.get("simulationOrderPurchaingPtr").get("status") == "FINISHED"
                })
                    //Se agrega los objetos que se identifican que no tiene la misma longitud de datos en los encontrados con el mismo número de orden
                    // y los que se encuentran con el status FINISHED
                if ( ordersObjectsFull.length != ordersObjectsStatusFinished.length ) {
                    var status = ''
                        //Verificar si es pending o on going la orden de compra
                    var statusOrderOnGoing = _.filter(ordersObjectsFull, function (obj){
                        return obj.get("simulationOrderPurchaingPtr").get("status") == "ON GOING"
                    })

                    if( ordersObjectsStatusFinished.length != 0 || statusOrderOnGoing.length != 0){
                        status = "ON GOING"
                    }else{
                        status = "PENDING"
                    }

                    var object = {
                                    "folioNumber"   : numerosUnicosOrdenes[i].get("simulationOrderPurchaingPtr").get("folioNumber"),
                                    "data"          : ordersObjectsFull,
                                    "statusOrder"   : status
                                 }
                    getFullOrders.push(object)    
                }
                
            }
            resolve({ type: "CONSULTA", data: getFullOrders, error: null})
        })
    })
}

exports.AsyncGetAllOrdersSuppliers = async (simulationPtr, teamPtr, index, dataArray, callback) =>{

    var Table = Parse.Object.extend("SimulationsOrdersSuppliers")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr",simulationPtr)
    query.equalTo("teamPtr",teamPtr)
    query.equalTo("exists",true)
    query.equalTo("active", true)
    query.include("simulationOrderPurchaingPtr")
    query.include("DMRawMaterialPtr")
    query.include("SDMSupplierPtr")
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply( dataArray, results )
            callback( dataArray, null )
        }else{
            dataArray.push.apply( dataArray, results )
            exports.AsyncGetAllOrdersSuppliers ( simulationPtr, teamPtr, (index + 1), dataArray, callback )
        }
    } catch ( error ) {
        callback( null, error )
    }
}

exports.SaveOrderPurchasing = function (dataFinancialLog, totalCost, data, simulationId, teamId){
    var Simulations         = Parse.Object.extend("Simulations")
    var simulation          = new Simulations()
        simulation.id       = simulationId

    var SimulationsTeams    = Parse.Object.extend("SimulationsTeams")
    var team                = new SimulationsTeams()
        team.id             = teamId
    return new Promise(function (resolve, reject) {

        exports.AsyncSearchSimulation(simulationId, function(resullSimulation, error){

            if(error) { return resolve({ type: "CONSULTA", data: null, error: error.message })}

            exports.AsynOrderPurchasing(simulation, team, 0, [], function(resultsOrders,error){

                if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message }) }

                var jsonObjects = []
                var numeroFolio = 1

                const unicos = _.uniq(resultsOrders, function (puchasing) {
                    return puchasing.get("folioNumber")
                })
                if (unicos.length!=0) {
                    var CurrentNumeroFolio = unicos.reduce(function(prev, current){
                        return prev.get("folioNumber") > current.get("folioNumber") ? prev : current 
                    })
                    numeroFolio=(CurrentNumeroFolio.get("folioNumber")+1)
                }
                for (let i = 0; i < data.length; i++) {

                    var Table                   = Parse.Object.extend("SimulationsOrdersPurchasings")
                    var object                  = new Table()
                    var json                    = data[i] 

                    var TablePurchasing         = Parse.Object.extend("SimulationsPurchasing")
                    var objectPurchasing        = new TablePurchasing()

                        objectPurchasing.id     = json["objectIdPurchasing"]
                        object.set("simulationPurchasinPtr",objectPurchasing)

                    let price                   = exports.deleteComma(json["price"].substr(1,json["price"].length))
                        object.set("priceRawMaterial",price)
                        object.set("totalAmountRawMaterial",json["totalAmountRM"])

                    let totalCostRawMaterial    = exports.deleteComma(json["totalCostRM"].substr(1,json["totalCostRM"].length))
                        object.set("totalCostRawMaterial",totalCostRawMaterial)
                        object.set("transportAmount",json["transportAmount"])

                    let transportPrice           = exports.deleteComma(json["transportPrice"].substr(1,json["transportPrice"].length))
                        object.set("transportPrice",transportPrice)

                    let percentage              = json["percentage"].substr(0,json["percentage"].length-1)
                        object.set("percentagePriceTransport",percentage)
                        
                    let totalCostTransport      = exports.deleteComma(json["totalCostTransport"].substr(1,json["totalCostTransport"].length))
                        object.set("totalCostTransport",totalCostTransport)
                        object.set("typeTransport",json["typeTransport"])
                        object.set( "folioNumber" , numeroFolio)
                        object.set("simulationPtr",simulation)
                        object.set("teamPtr",team)
                        object.set("status","PENDING")
                        object.set("exists",true)
                        object.set("active",true)
                        object.set("datePurchase",resullSimulation.get("currentDate"))
                        
                    jsonObjects.push(object)
                }
                
                Parse.Object.saveAll(jsonObjects).then((results)=>{
                    var arrayPtrs = []
                    results.forEach(element => {
                        arrayPtrs.push(element.id)
                    })
                    exports.SaveOrdersPurchasingSupplier(arrayPtrs, simulationId, teamId).then(function(resultsorderSuppliers){
    
                        if (resultsorderSuppliers.error) {resolve({ type: "AGREGAR", data: null, error: error.message })}
                        
                        else{
                            exports.GetSimulationTeam ( simulation, teamId, function(resultsTeam, error){ 
                                var currentMoney = parseFloat(resultsTeam.get("teamCurrentMoney")) - parseFloat(totalCost)
                                resultsTeam.set("teamCurrentMoney",currentMoney.toString())
                                resultsTeam.save().then((resultCost) => {
                                    exports.SaveFinacialLog( dataFinancialLog, resultsTeam.get("simulationPtr").get("currentDate"), simulationId, teamId ).then(function (results) {
                                        if (results.error) {
                                            resolve({ type: "AGREGAR", data: null, error: error.message })
                                        }else{
                                            resolve({ type: "AGREGAR", data: resultsorderSuppliers, money: resultCost.get("teamCurrentMoney"),numeroFolio:(numeroFolio+1), error: null})
                                        }

                                    })
                                    //resolve({ type: "AGREGAR", data: resultsorderSuppliers, money: resultCost.get("teamCurrentMoney"), error: null})
                                }, (error) =>{
                                    resolve({ type: "AGREGAR", data: null, error: error.message })
                                })
                            }) 
                        }
                    })
                    //resolve({ type: "AGREGAR", data: result, error: null})
                }, ( error)=>{
                    resolve({ type: "AGREGAR", data: null, error: error.message })
                })

            })

        }) 
        
    })
}

exports.deleteComma = function(data){
    var dataWithoutComma   = ''
    for ( var i  = 0 ; i <  data.length;  i++ ){
      if( data[i] != "," ){
        dataWithoutComma  += data[i] 
      }
    }
    return dataWithoutComma
}

exports.SaveFinacialLog = function ( data, simualtionDate, simulationPtr, teamPtr ) {
    var Simulations         = Parse.Object.extend("Simulations")
    var simulation          = new Simulations()
        simulation.id       = simulationPtr

    var SimulationsTeams    = Parse.Object.extend("SimulationsTeams")
    var team                = new SimulationsTeams()
        team.id             = teamPtr
    return new Promise(function (resolve, reject) {
        var TDSimulationFinancialLog    = Parse.Object.extend("TDSimulationFinancialLog")
        var finacialLog                 = new TDSimulationFinancialLog()

            finacialLog.set("teamPtr",team)
            finacialLog.set("simulationPtr",simulation)
            finacialLog.set("simulationDate",simualtionDate)
            finacialLog.set("amountMoney",Number(data["amountMoney"]))
            finacialLog.set("beforeAmount",Number(data["beforeAmount"]))
            finacialLog.set("afterAmount",Number(data["afterAmount"]))
            finacialLog.set("type",data["type"])
            finacialLog.set("status",data["status"])
            finacialLog.set("exists",true)
            finacialLog.set("active",true)
        
            finacialLog.save().then((resultsFinancialLog) => {
                resolve({ type: "AGREGAR", data: resultsFinancialLog, error: null})
            }, (error) => {
                resolve({ type: "AGREGAR", data: null, error: error.message })
            })
    })
}

exports.AsynOrderPurchasing = async (simulationPtr, teamPtr, index, dataArray, callback)=>{
    var Table = Parse.Object.extend("SimulationsOrdersPurchasings")
    var query = new Parse.Query(Table)

    //query.equalTo("exists",true)
    //query.equalTo("active", true)
    query.equalTo("simulationPtr", simulationPtr)
    query.equalTo("teamPtr",teamPtr)
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }
        else{
            dataArray.push.apply(dataArray, results)
            exports.AsynOrderPurchasing(simulationPtr,teamPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }

}

exports.SaveOrdersPurchasingSupplier = function(dataArraysPtr, simulationPtr, teamPtr){
    var Simulations         = Parse.Object.extend("Simulations")
    var simulation          = new Simulations()
        simulation.id       = simulationPtr

    var SimulationsTeams    = Parse.Object.extend("SimulationsTeams")
    var team                = new SimulationsTeams()
        team.id             = teamPtr
    return new Promise(function (resolve, reject) {
        exports.AsyncSearchOrdersSupplier(dataArraysPtr, 0, [], function (resultsOrders, error) {
                var ordersSuppliers = []
                var orderUpdate = []
            resultsOrders.forEach(element => {
                var Table           = Parse.Object.extend("SimulationsOrdersSuppliers")
                var object          = new Table()

                    object.set("simulationOrderPurchaingPtr",element)
                    object.set("simulationPtr",simulation)
                    object.set("teamPtr",team)
                    object.set("deliveryDays",element.get("simulationPurchasinPtr").get("transporteSDMPtr").get("diasEntrega"))
                    object.set("totalDeliveryDays",element.get("simulationPurchasinPtr").get("transporteSDMPtr").get("diasEntrega"))

                var TableProveedores = Parse.Object.extend("SDMProveedores")
                var supplier         = new TableProveedores()
                    supplier.id      = element.get("simulationPurchasinPtr").get("provedorMateriaPrimaSDMPtr").get("proveedorPtr").id
                    object.set("SDMSupplierPtr",supplier)

                var TableRM          = Parse.Object.extend("DMMateriaPrima")
                var rawMaterial      = new TableRM()
                    rawMaterial.id   = element.get("simulationPurchasinPtr").get("provedorMateriaPrimaSDMPtr").get("materiaPrimaPtr").id
                    
                    object.set("DMRawMaterialPtr",rawMaterial)
                    object.set("totalAmountRawMaterial",element.get("totalAmountRawMaterial"))
                    object.set("status","PENDING")
                    object.set("exists",true)
                    object.set("active",true)

                    var currentSimulationDate = moment(element.get("datePurchase"))
                    //log(currentSimulationDate.format("DD/MM/YYYY HH:mm:ss"))
                    var number = Number(element.get("simulationPurchasinPtr").get("transporteSDMPtr").get("diasEntrega"))
                    currentSimulationDate = currentSimulationDate.add(number, 'd')
                    //log(currentSimulationDate.format("DD/MM/YYYY HH:mm:ss"))                
                    element.set("deliveryDate", currentSimulationDate.valueOf())

                    orderUpdate.push(element)
                    ordersSuppliers.push(object)
            })

            Parse.Object.saveAll(ordersSuppliers).then((result)=>{
                Parse.Object.saveAll(orderUpdate).then((resultOrder)=>{
                    resolve({ type: "AGREGAR", data: result, error: null})
                }, (error)=>{
                    resolve({ type: "AGREGAR", data: null, error:error.message })
                })
                //resolve({ type: "AGREGAR", data: result, error: null})
            }, (error)=>{
                resolve({ type: "AGREGAR", data: null, error:error.message })
            })
        })
    })
}

exports.AsyncSearchOrdersSupplier = async (arryPtr, index, dataArray, callback)=>{
    var Table = Parse.Object.extend("SimulationsOrdersPurchasings")
    var query = new Parse.Query(Table)

    query.equalTo("exists",true)
    query.equalTo("active", true)
    query.containedIn("objectId",arryPtr)
    query.include("simulationPurchasinPtr.transporteSDMPtr")
    query.include("simulationPurchasinPtr.provedorMateriaPrimaSDMPtr.proveedorPtr")
    query.include("simulationPurchasinPtr.provedorMateriaPrimaSDMPtr.materiaPrimaPtr")
    query.limit(1000)
    query.skip(index * 1000)
    
    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncSearchOrdersSupplier(arryPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.GetFixedAssetInventory = function (simulationPtr, teamPtr){
    var Simulations         = Parse.Object.extend("Simulations")
    var simulation          = new Simulations()
        simulation.id       = simulationPtr

    var SimulationsTeams    = Parse.Object.extend("SimulationsTeams")
    var team                = new SimulationsTeams()
        team.id             = teamPtr
    return new Promise(function (resolve, reject) {
        exports.AsyncGetAlDataTDProductionLine(simulation, team, "FIXED_ASSET", 0, [], function (resultsDataProductionLine, error) {
            if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message })}
            exports.AsyncGetAllProductionLinePhases( simulation, 0, [], function(resultsPhases, error){
                if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message })}
                exports.AsyncTDGetFixedAssteInventory( simulation, team, 0, [], function ( resultsTDFixedAssetInventory, error ) {
                    if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message })}
                        
                    if ( resultsTDFixedAssetInventory.length != 0 ) {
                        //obtener los ids para ser buscados en la base de datos 
                        //var arrayPtrs = _.pluck( resultsTDFixedAssetInventory, 'id' )  
                        return resolve({ type: "CONSULTA", data: resultsTDFixedAssetInventory, dataPhase: resultsPhases, dataProductionLine: resultsDataProductionLine, error: null })
                            //log(arrayPtrs)
                    }

                    exports.AsyncSearchTDFixedAsset ( simulation, team, function (resultFixedAsset, error){
                        if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message })}

                            //Si hay un dato agregado aunque este en exists y active en false no permite pasar a crear de nuevo los activos fijos
                        if (resultFixedAsset != undefined) {
                            return resolve({ type: "CONSULTA", data: resultsTDFixedAssetInventory, dataPhase: resultsPhases, dataProductionLine: resultsDataProductionLine, error: null })
                        }

                        exports.AsyncGetFixedAssteInventory( simulation, team, 0, [], function ( resultsFixedAssetInventory, error ) {
                            var arrayFixedAssetInventory = []
                            resultsFixedAssetInventory.forEach(element => {
                                for (let i = 0; i < parseInt(element.get("cantidad")); i++) {
                                    var Table = Parse.Object.extend("TDMActivosFijosInventario")
                                    var object = new Table()
                                    
                                    object.set( "amount",1 )
                                    object.set( "simulationPtr",element.get("simulationPtr") )
                                    object.set( "teamPtr",team )
                                    object.set( "fixedAssetPtr",element.get("activoFijoPtr") )
                                    object.set( "LifeTime",Number(element.get("activoFijoPtr").get("tiempoVida") ) )
                                    object.set( "Cost",Number(element.get("activoFijoPtr").get("precioCosto") ) )
                                    object.set( "priceSale",Number(element.get("activoFijoPtr").get("precioVenta") ) )
                                    object.set( "depreciationRate",Number(element.get("activoFijoPtr").get("tarifaDepreciacion") ) )
                                    object.set( "datePurchasing", element.get("simulationPtr").get("currentDate"))
                                    object.set( "exists",true )
                                    object.set( "active",true )

                                    arrayFixedAssetInventory.push( object )
                                }
                            });

                            Parse.Object.saveAll(arrayFixedAssetInventory).then( ( results ) =>{
                                exports.AsyncTDGetFixedAssteInventory( simulation, team, 0, [], function ( resultsTDFixedAssetInventory, error ) {
                                    resolve({ type: "AGREGAR", data: resultsTDFixedAssetInventory, dataPhase: resultsPhases, dataProductionLine: resultsDataProductionLine, error: null})
                                })
                            }, (error) => {
                                resolve({ type: "AGREGAR", data: null, error: error.message })
                            })
                        })
                    })
                    
                })
            })
        })
    })
}

exports.AsyncGetAlDataTDProductionLine = async (simulationPtr, teamPtr, type, index, dataArray, callback) => {
    var Table = Parse.Object.extend("TDProductionLine")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr",simulationPtr)
    query.equalTo("teamPtr",teamPtr)
    query.equalTo("type",type)
    query.equalTo("exists",true)
    query.equalTo("active", true)
    query.include("productionLineTDSptr")
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetAlDataTDProductionLine(simulationPtr, teamPtr, type, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncSearchTDFixedAsset = async ( simulationPtr, teamPtr, callback ) => {
    var Table = Parse.Object.extend("TDMActivosFijosInventario")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr",simulationPtr)
    query.equalTo("teamPtr",teamPtr)
    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetFixedAssteInventory = async (simulationPtr, teamPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("SDMActivosFijosInventario")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr",simulationPtr)
    query.equalTo("exists",true)
    query.equalTo("active", true)
    query.include("activoFijoPtr")
    query.include("simulationPtr")
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetFixedAssteInventory(simulationPtr, teamPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncTDGetFixedAssteInventory = async (simulationPtr, teamPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("TDMActivosFijosInventario")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr",simulationPtr)
    query.equalTo("teamPtr",teamPtr)
    query.equalTo("exists",true)
    query.equalTo("active", true)
    query.include("fixedAssetPtr")
    query.include("phaseSDMPtr")
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncTDGetFixedAssteInventory(simulationPtr, teamPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.GetFixedAsset = function (simulationPtr, teamPtr){
    var Simulations         = Parse.Object.extend("Simulations")
    var simulation          = new Simulations()
        simulation.id       = simulationPtr
    return new Promise(function (resolve, reject) {
        exports.AsyncGetAllFixedAsset(simulation, 0, [], function (results, error){
            if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message })}
            //resolve({ type: "CONSULTA", data: results, error: null })
            exports.GetSimulationTeam(simulation, teamPtr, function(resultsTeam, error){
                resolve({ type: "CONSULTA", data: results, money: resultsTeam.get("teamCurrentMoney"), error: null })
            })
        })
    })
}

exports.AsyncGetAllFixedAsset = async (simulationPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("SDMActivosFijos")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr",simulationPtr)
    query.equalTo("exists",true)
    query.equalTo("active", true)
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetAllFixedAsset(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.SaveFixedAsset = function ( dataFinancialLog, totalCost, data, simulationPtr, teamPtr ) {
    var Simulations         = Parse.Object.extend("Simulations")
    var simulation          = new Simulations()
        simulation.id       = simulationPtr

    var SimulationsTeams    = Parse.Object.extend("SimulationsTeams")
    var team                = new SimulationsTeams()
        team.id             = teamPtr
    return new Promise(function (resolve, reject) {
        //var ptrs = _.pluck( data, 'objectId' ) 

        var arrayPtrs = []
        data.forEach(element => {
            var FixedAsset       = Parse.Object.extend("SDMActivosFijos")
            var fixedAsset       = new FixedAsset()
                fixedAsset.id    = element["objectId"]
                arrayPtrs.push(fixedAsset)
        })

        exports.GetFixedAssetForPtr( arrayPtrs, simulation, team, 0, [], function (resultsFixedAssets, error){
            if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message }) }
            //log(resultsFixedAssets)
            var arrayObjects = []
            data.forEach(element => {
                /*var fixedAsset = _.find(resultsFixedAssets,function(fixedAsset){
                    return fixedAsset.get("fixedAssetPtr").id == element["objectId"]
                })

                if(fixedAsset != undefined){
                    var adition = parseInt(fixedAsset.get("amount")) + parseInt(element["totalAmount"]) 
                    fixedAsset.set("amount", adition.toString() )
                    fixedAsset.set("datePurchasing",resultsFixedAssets[0].get("simulationPtr").get("currentDate"))
                    arrayObjects.push(fixedAsset)
                }else{*/
                    for (let i = 0; i < parseInt(element["totalAmount"]); i++) {
                        var SDMActivosFijosTable = Parse.Object.extend("SDMActivosFijos")
                        var fixedAssetPtr = new SDMActivosFijosTable()
                            fixedAssetPtr.id = element["objectId"]

                        var Table = Parse.Object.extend("TDMActivosFijosInventario")
                        var object = new Table()
                        
                        object.set( "amount",1)
                        object.set( "simulationPtr",simulation )
                        object.set( "teamPtr",team )
                        object.set( "fixedAssetPtr", fixedAssetPtr)
                        object.set( "LifeTime", Number(element["LifeTime"]))
                        object.set( "Cost", Number(element["Cost"]))
                        object.set( "priceSale", Number(element["priceSale"]))
                        object.set( "depreciationRate", Number(element["depreciationRate"]))
                        object.set( "datePurchasing", Number(element["datePurchasing"]))//resultsFixedAssets[0].get("simulationPtr").get("currentDate"))
                        object.set( "exists",true )
                        object.set( "active",true )
                        arrayObjects.push(object)
                    }
                    
                //}
            })
            Parse.Object.saveAll(arrayObjects).then( ( resultsSave ) => {
                //resolve({ type: "AGREGAR", data: resultsSave, error: null })
                
                exports.GetSimulationTeam ( simulation, teamPtr, function(resultsTeam, error){ 
                    var currentMoney = parseFloat(resultsTeam.get("teamCurrentMoney")) - parseFloat(totalCost)
                    resultsTeam.set("teamCurrentMoney",currentMoney.toString())
                    resultsTeam.save().then((resultCost) => {
                        exports.SaveFinacialLog( dataFinancialLog, resultsTeam.get("simulationPtr").get("currentDate"), simulationPtr, teamPtr ).then(function (results) {
                            if (results.error) {
                                resolve({ type: "AGREGAR", data: null, error: error.message })
                            }else{
                                resolve({ type: "AGREGAR", data: resultsSave, money: resultCost.get("teamCurrentMoney"), error: null })
                            }

                        })
                        //resolve({ type: "AGREGAR", data: resultsSave, money: resultCost.get("teamCurrentMoney"), error: null })
                    }, (error) =>{
                        resolve({ type: "AGREGAR", data: null, error: error.message })
                    })
                }) 
            }, ( error ) => {
                resolve({ type: "AGREGAR", data: null, error: error.message })
            })
        })
    })
}

exports.GetFixedAssetForPtr = async ( arrayPtrs, simulationPtr, teamPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("TDMActivosFijosInventario")
    var query = new Parse.Query(Table)

    query.containedIn("fixedAssetPtr",arrayPtrs)
    query.equalTo("simulationPtr",simulationPtr)
    query.equalTo("teamPtr",teamPtr)
    query.equalTo("exists",true)
    query.equalTo("active", true)
    query.include("simulationPtr")
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.GetFixedAssetForPtr(arrayPtrs, simulationPtr, teamPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }

}

exports.GetSimulationTeam = async (simulationPtr, teamPtr, callback) => {
    var Table = Parse.Object.extend("SimulationsTeams")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr",simulationPtr)
    query.equalTo("objectId",teamPtr)
    query.equalTo("exists",true)
    query.equalTo("active",true)
    query.include("simulationPtr")

    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.GetAllEmployees = function ( simulationPtr, teamPtr ){
    var Simulations         = Parse.Object.extend("Simulations")
    var simulation          = new Simulations()
        simulation.id       = simulationPtr
    
    var SimulationsTeams    = Parse.Object.extend("SimulationsTeams")
    var team                = new SimulationsTeams()
        team.id             = teamPtr

    return new Promise(function (resolve, reject) {
        exports.AsyncGetAlDataTDProductionLine(simulation, team, "EMPLOYEE", 0, [], function (resultsDataProductionLine, error) {
            if (error) { return resolve( { type: "CONSULTA", data: null, error: error.message } ) }
            exports.AsyncGetSomeEmployeeTeam(simulation, team,function(resultsFoundEmployee, error){
                if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message }) }

                //Solo si es primera vez que ingresa al sistema
                if(resultsFoundEmployee == 0){
                    exports.AsyncGetAllSDMEmployees(simulation, 0, [], function(resultsSDMEmployees, error){
                        if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message })}
                        exports.AsyncSearchSimulation(simulationPtr,function(resultsSimulation, error){
                            if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message })}

                            var quantityEmployees = resultsSimulation.get("qtyEmployees")
                            var arrayEmpoyeesToSave = []
                            var arraTabulatorIds = []
                            var controlIndex = 0
                            var gt = 0
                            
                            //Obtenemos a unicos empleados por Salario Tabulador 
                            var salaryTabulatorPtrUniq = _.uniq(resultsSDMEmployees, function(current){
                                return current.get("SDMsalaryTabulatorPtr").id
                            })
                            //Obtenemos los ids de salario tabulator 
                            for (let i = 0; i < salaryTabulatorPtrUniq.length; i++) {
                                arraTabulatorIds.push(salaryTabulatorPtrUniq[i].get("SDMsalaryTabulatorPtr").id)
                            }

                            lengthTempo = arraTabulatorIds.length
                            //Se crea el for para agregar los nuevos empleados hasata la cantidada de empledos definidos en la simulación
                            for (let i = 0; i < Number(quantityEmployees); i++) {
                                //Reiniciar la variable que rrecorre a el arreglo de ids del tabulador para cuando hay mas empleados que departamentos
                                
                                if(i == lengthTempo){
                                    controlIndex = 0
                                    lengthTempo += arraTabulatorIds.length
                                }
                                //Filtramos por salario tabuador a los empleados
                                var employesFilterByTabulatorId = _.filter(resultsSDMEmployees, function (obj){
                                    return obj.get("SDMsalaryTabulatorPtr").id == arraTabulatorIds[controlIndex]
                                })
                                //recorremos el arreglo filtrado anteriormete de empleados
                                for (let j = 0; j < employesFilterByTabulatorId.length; j++) {
                                    //Buscamos al empledado en el arreglo a guardar
                                    var employeeFound = _.find(arrayEmpoyeesToSave, function(current){
                                        return current.get("referenciIdSDM") == employesFilterByTabulatorId[j].id
                                    })
                                    //Si no existe se agrega y se sale del for para el empleado hasta completar la cantidad a guardar   
                                    if(employeeFound == undefined){
                                        var Employed = Parse.Object.extend("TDMEmployees")
                                        var object   = new Employed()

                                        var name = employesFilterByTabulatorId[j].get("nombre") ? employesFilterByTabulatorId[j].get("nombre") : ''
                                        var lastName = employesFilterByTabulatorId[j].get("apellidoPaterno") ? employesFilterByTabulatorId[j].get("apellidoPaterno") : ''
                                        var motherName = employesFilterByTabulatorId[j].get("apellidoMaterno") ? employesFilterByTabulatorId[j].get("apellidoMaterno") : ''
                                        var fullName =name+" "+lastName+" "+motherName

                                        object.set("referenciIdSDM",employesFilterByTabulatorId[j].id)
                                        object.set("name",fullName)
                                        object.set("simulationPtr",simulation)
                                        object.set("teamPtr",team)
                                        object.set("salaryTabulatorPtr",employesFilterByTabulatorId[j].get("SDMsalaryTabulatorPtr"))
                                        object.set("exists",true)
                                        object.set("active",true)

                                        arrayEmpoyeesToSave.push(object)

                                        break
                                    }
                                }
                                
                                controlIndex++
                            }

                            Parse.Object.saveAll(arrayEmpoyeesToSave).then((resultEmployeesSave) => {

                                exports.AsyncGetAllEmployees ( simulation, team, 0, [], function ( resultsEmployees, error ) {
                                    if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message })}
                                    // resolve({ type: "CONSULTA", data: resultsEmployees, error: null })
                                    exports.AsyncGetAllSalaryTabulator( simulation, 0, [], function (resultsSalary, error){
                                        if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message }) }
                                        exports.AsyncGetAllProductionLinePhases( simulation, 0, [], function (resultsPhases, error){
                                            if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message }) }
                                            resolve({ type: "CONSULTA", data: resultsEmployees, dataSalary: resultsSalary, dataPhases: resultsPhases, dataProductionLine: resultsDataProductionLine,  error:null })
                                        })
                                    })
                                })

                            }, (error) => {
                                //log(error)
                                //log(error.message)
                                resolve({ type: "CONSULTA", data: null, error: error.message })
                            })

                            
                        })
                    })
                }else{
                    exports.AsyncGetAllEmployees ( simulation, team, 0, [], function ( resultsEmployees, error ) {
                        if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message })}
                        // resolve({ type: "CONSULTA", data: resultsEmployees, error: null })
                        exports.AsyncGetAllSalaryTabulator( simulation, 0, [], function (resultsSalary, error){
                            if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message }) }
                            exports.AsyncGetAllProductionLinePhases( simulation, 0, [], function (resultsPhases, error){
                                if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message }) }
                                resolve({ type: "CONSULTA", data: resultsEmployees, dataSalary: resultsSalary, dataPhases: resultsPhases, dataProductionLine: resultsDataProductionLine,  error:null })
                            })
                        })
                    })
                }
            })
        })
    })
}

exports.AsyncGetAllProductionLinePhases = async ( simulationPtr, index, dataArray, callback ) => {
    var Table = Parse.Object.extend("SDMProductionLinePhases")
    var query = new Parse.Query(Table)

        query.equalTo("simulationPtr",simulationPtr)
        query.equalTo("active",true)
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
            exports.AsyncGetAllProductionLinePhases( simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetAllEmployees = async ( simulationPtr, teamPtr, index, dataArray, callback ) => {
    var Table = Parse.Object.extend("TDMEmployees")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr",simulationPtr)
    query.equalTo("teamPtr",teamPtr)
    query.equalTo("exists",true)
    query.equalTo("active", true)
    query.include("salaryTabulatorPtr")
    query.include("phaseSDMPtr")
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetAllEmployees(simulationPtr, teamPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetAllSalaryTabulator = async ( simulationPtr, index, dataArray, callback ) => {
    var Table = Parse.Object.extend("SDMSalaryTabulator")
    var query = new Parse.Query(Table)

    query.equalTo( "simulationPtr", simulationPtr )
    query.equalTo( "exists", true)
    query.equalTo( "active", true)
    query.limit  ( 1000 )
    query.skip   ( index * 1000 )

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

exports.SaveTDEmployees = function (data, simulationPtr, teamPtr){
    var Simulations         = Parse.Object.extend("Simulations")
    var simulation          = new Simulations()
        simulation.id       = simulationPtr
    
    var SimulationsTeams    = Parse.Object.extend("SimulationsTeams")
    var team                = new SimulationsTeams()
        team.id             = teamPtr

    return new Promise(function (resolve, reject) {

        var SalaryTabulator     = Parse.Object.extend("SDMSalaryTabulator")
        var salaryTabulator     = new SalaryTabulator()
            salaryTabulator.id  = data.type_tabulator 

        var employeesArray = []
        for (let i = 0; i < data.employees_number; i++) {

            var name = faker.name.findName()
            var lastName = faker.name.lastName()
            var fullName = name + " " + lastName

            var Employed         = Parse.Object.extend("TDMEmployees")
            var object = new Employed()

                object.set("name",fullName)
                object.set("simulationPtr",simulation)
                object.set("teamPtr",team)
                object.set("salaryTabulatorPtr",salaryTabulator)
                
            if( data["type_production_line_phase"] ){
                var Phase           = Parse.Object.extend("SDMProductionLinePhases")
                var phaseSDMPtr     = new Phase()
                    phaseSDMPtr.id  = data["type_production_line_phase"] 

                object.set("phaseSDMPtr",phaseSDMPtr)
            }
                object.set("exists",true)
                object.set("active",true)
                
                employeesArray.push(object)
        }

        Parse.Object.saveAll(employeesArray).then((resultsEmployees) => {
            resolve({ type: "AGREGAR", data: resultsEmployees, error: null})
        }, (error) => {
            resolve({ type: "AGREGAR", data: null, error: error.message })
        })

    })
}

exports.DeleteTDEmployee = function ( employeePtr, simulationPtr, teamPtr ) {
    var Simulations         = Parse.Object.extend("Simulations")
    var simulation          = new Simulations()
        simulation.id       = simulationPtr

    var SimulationsTeams    = Parse.Object.extend("SimulationsTeams")
    var team                = new SimulationsTeams()
        team.id             = teamPtr
    return new Promise(function (resolve, reject) {
        exports.GetEmployee(employeePtr, simulation, team, function(resultEmployee, error) {
            if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message })}
            exports.AsyncGetEmployeeTDProductionLineTemplate(resultEmployee, simulation, team, function(resultsDataProductionLineTemplate, error){
                if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message })}
                if(resultsDataProductionLineTemplate){
                    if(resultsDataProductionLineTemplate.get("active") == true){
                        return resolve({ type: "ELIMINAR", data: null, error: "Sorry, you cannot remove the employee because he is active in "+resultsDataProductionLineTemplate.get("productionLineTDSptr").get("name")+", you must first unsubscribe"})
                    }else{
                        resultEmployee.set("exists",false)
                        resultEmployee.set("active",false)
                        
                        resultEmployee.save().then((result) => {
                            resultsDataProductionLineTemplate.set("exists",false)
                            resultsDataProductionLineTemplate.set("active",false)
                            
                            resultsDataProductionLineTemplate.save().then((resultDataTemplate) => {
                                return resolve({ type: "ELIMINAR", data: result, error: null})   
                            }, (error) => {
                                return resresolve({ type: "ELIMINAR", data: null, error: error.message })
                            })  
                        }, (error) => {
                            return resresolve({ type: "ELIMINAR", data: null, error: error.message })
                        })
                    }
                }
                resultEmployee.set("exists",false)
                resultEmployee.set("active",false)

                resultEmployee.save().then((result) => {
                    resolve({ type: "ELIMINAR", data: result, error: null})   
                }, (error) => {
                    resolve({ type: "ELIMINAR", data: null, error: error.message })
                })
            })
        })
    })
}

exports.GetEmployee = async (employeePtr, simulationPtr, teamPtr, callback) => {
    var Table = Parse.Object.extend("TDMEmployees")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr",simulationPtr)
    query.equalTo("teamPtr",teamPtr)
    query.equalTo("objectId",employeePtr)
    query.equalTo("exists",true)
    query.equalTo("active", true)

    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetEmployeeTDProductionLineTemplate = async (employeePtr, simulationPtr, teamPtr, callback) => {
    var Table = Parse.Object.extend("TDProductionLine")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr",simulationPtr)
    query.equalTo("teamPtr",teamPtr)
    query.equalTo("employeeTDMSprt",employeePtr)
    query.equalTo("exists",true)
    query.include("templateSDMPtr")
    query.include("productionLineTDSptr")

    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.GetAllEmployeesNoShift = function ( simulationPtr, teamPtr ) {
    var Simulations         = Parse.Object.extend("Simulations")
    var simulation          = new Simulations()
        simulation.id       = simulationPtr
        
    var SimulationsTeams    = Parse.Object.extend("SimulationsTeams")
    var team                = new SimulationsTeams()
        team.id             = teamPtr
    return new Promise(function (resolve, reject) {
        exports.AsyncGetSimulatioQtyShift( simulationPtr, function(resultsSimulation, error){
            if(error) { return resolve({ type: "CONSULTA", data: null, error: error.message })}
            exports.AsyncGetAllEmployeesNoShift( simulation, team, 0, [], function (results, error){
                if (error) { return resolve( { type: "CONSULTA", data: null, error: error.message } ) }
                const unicos = _.uniq(results, function (employee) {
                    return employee.get("salaryTabulatorPtr").get("department");
                });
                resolve( { type: "CONSULTA", data:results, dataUnicos: unicos, dataQtyShift: resultsSimulation.get("qtyTurns"), error: null })
            })
        })
    })
}

exports.AsyncGetAllEmployeesNoShift = async (simulationPtr, teamPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("TDMEmployees")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr",simulationPtr)
    query.equalTo("teamPtr",teamPtr)
    query.equalTo("exists",true)
    query.equalTo("active",true)
    //query.doesNotExist("shift")
    query.include("salaryTabulatorPtr")
    query.include("phaseSDMPtr")
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetAllEmployeesNoShift(simulationPtr, teamPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.SaveAllEmployeesShift = function ( data, simulationPtr, teamPtr ) {
    var Simulations         = Parse.Object.extend("Simulations")
    var simulation          = new Simulations()
        simulation.id       = simulationPtr

    var SimulationsTeams    = Parse.Object.extend("SimulationsTeams")
    var team                = new SimulationsTeams()
        team.id             = teamPtr
    return new Promise(function (resolve, reject) {
        exports.AsyncGetEmployeesNoShift(data["id"],simulation,team,0,[], function (results, error){
            if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message }) }
            var employeesPtrArray = []
            results.forEach(element => {
                element.set("shift",data["shift"])
                employeesPtrArray.push(element)
            });
            Parse.Object.saveAll(employeesPtrArray).then((result) => {
                resolve({ type: "ACTUALIZAR", data: result, error: null })
            }, (error) => {
                resolve({ type: "ACTUALIZAR", data: null, error: error.message })
            })
        })
    })
}

exports.AsyncGetEmployeesNoShift = async (employeesPtr,simulationPtr, teamPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("TDMEmployees")
    var query = new Parse.Query(Table)

    query.containedIn("objectId",employeesPtr)
    query.equalTo("simulationPtr",simulationPtr)
    query.equalTo("teamPtr",teamPtr)
    query.equalTo("exists",true)
    query.equalTo("active",true)
    //query.doesNotExist("shift")
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetAllEmployeesNoShift(simulationPtr, teamPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetSimulatioQtyShift = async (simulationPtr, callback) => {
    var Table = Parse.Object.extend("Simulations")
    var query = new Parse.Query(Table)

    query.equalTo("objectId",simulationPtr)
    query.equalTo("exists",true)
    query.equalTo("active", true)

    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }

}

exports.SearchRangeFinancialLog = function ( data, simulationPtr, teamPtr ){
    var Simulations         = Parse.Object.extend("Simulations")
    var simulation          = new Simulations()
        simulation.id       = simulationPtr

    var SimulationsTeams    = Parse.Object.extend("SimulationsTeams")
    var team                = new SimulationsTeams()
        team.id             = teamPtr

    return new Promise(function (resolve, reject) {
        exports.GetAllDataRangeFinancialLog ( data, simulation, team, 0, [], function (resultsFinancialLog, error){
            if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message })}
            resolve({ type: "CONSULTA", data: resultsFinancialLog, error: null})
        })
    })
}

exports.GetAllDataRangeFinancialLog = async ( data, simulationPtr, teamPtr, index, dataArray, callback ) => {
    var TDSimulationFinancialLog    = Parse.Object.extend("TDSimulationFinancialLog")
    var query                       = new Parse.Query(TDSimulationFinancialLog)

    if( data["type"] != "ALL" ) {
        query.equalTo("type",data["type"])
    }

    if( data["status"] != "ALL" ) {
        query.equalTo("status",data["status"])
    }
    query.equalTo("simulationPtr",simulationPtr)
    query.equalTo("teamPtr",teamPtr)
    query.equalTo("exists",true)
    query.equalTo("active",true)
    query.greaterThanOrEqualTo("simulationDate", parseInt(data["startDateFinancialLog"]))
    query.lessThanOrEqualTo("simulationDate",parseInt(data["endDateFinancialLog"]))
    query.ascending("simulationDate")
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply ( dataArray, results )
            callback ( dataArray, null )
        }else{
            dataArray.push.apply ( dataArray, results )
            exports.GetAllDataRangeFinancialLog( data, simulationPtr, teamPtr, (index + 1), dataArray, callback )
        }
    } catch (error) {
        callback(null, error)
    }

}

exports.SaleFixedAsset = function (objectId , dataFinancialLog, simulationPtr, teamPtr) {
    var Simulations         = Parse.Object.extend("Simulations")
    var simulation          = new Simulations()
        simulation.id       = simulationPtr

    var SimulationsTeams    = Parse.Object.extend("SimulationsTeams")
    var team                = new SimulationsTeams()
        team.id             = teamPtr

    return new Promise(function (resolve, reject) {
        var FixedAsset    = Parse.Object.extend("TDMActivosFijosInventario")
        var fixedAsset    = new FixedAsset()
            fixedAsset.id = objectId
        exports.AsyncGetFixedAssetTDProductionLineTemplate(fixedAsset, simulation, team, function(resultsDataProductionLineTemplate, error){
            if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message })}
            if(resultsDataProductionLineTemplate){
                if(resultsDataProductionLineTemplate.get("active") == true){
                    return resolve({ type: "ELIMINAR", data: null, error: "Sorry, you cannot sale the fixed asset because he is active in "+resultsDataProductionLineTemplate.get("productionLineTDSptr").get("name")+", you must first unsubscribe"})
                }else{
                    resultsDataProductionLineTemplate.set("exists",false)
                    resultsDataProductionLineTemplate.set("active",false)
                    
                    resultsDataProductionLineTemplate.save().then((resultDataTemplate) => {
                        exports.AsyncSearchTeam ( teamPtr, function ( resultTeam, error ) {
                            if (error) { return resolve({ type: "ACTUALIZAR", data: null, error: error.message })}
                
                            var currentMoney = parseFloat(resultTeam.get("teamCurrentMoney")) + parseFloat(dataFinancialLog["amountMoney"])
                            
                            resultTeam.set("teamCurrentMoney",currentMoney.toString())
                            resultTeam.save().then( ( resultTeamCurrent ) => {
                                exports.AsyncGetFixedAsset ( objectId, simulation, team, function( resultFixedAsset, error ) {
                                    if (error) { return resolve({ type: "ACTUALIZAR", data: null, error: error.message })}
                
                                    resultFixedAsset.set("exists", false)
                                    resultFixedAsset.set("active", false)
                                    resultFixedAsset.save().then( ( resultFixedAssetCurrent ) =>{
                                        exports.SaveFinacialLog( dataFinancialLog, resultFixedAsset.get("simulationPtr").get("currentDate"), simulationPtr, teamPtr ).then(function (results) {
                                            if (results.error) {
                                                resolve({ type: "AGREGAR", data: null, error: error.message })
                                            }else{
                                                resolve({ type: "AGREGAR", data: results, error: null })
                                            }
                                        })
                                    }, (error) => {
                                        resolve({ type: "ACTUALIZAR", data: null, error: error.message })
                                    })
                                })
                            },(error) => {
                                resolve({ type: "ACTUALIZAR", data: null, error: error.message })
                            })
                        })  
                    }, (error) => {
                        resresolve({ type: "ELIMINAR", data: null, error: error.message })
                    })
                }
            }else{
                exports.AsyncSearchTeam ( teamPtr, function ( resultTeam, error ) {
                    if (error) { return resolve({ type: "ACTUALIZAR", data: null, error: error.message })}
        
                    var currentMoney = parseFloat(resultTeam.get("teamCurrentMoney")) + parseFloat(dataFinancialLog["amountMoney"])
                    
                    resultTeam.set("teamCurrentMoney",currentMoney.toString())
                    resultTeam.save().then( ( resultTeamCurrent ) => {
                        exports.AsyncGetFixedAsset ( objectId, simulation, team, function( resultFixedAsset, error ) {
                            if (error) { return resolve({ type: "ACTUALIZAR", data: null, error: error.message })}
        
                            resultFixedAsset.set("exists", false)
                            resultFixedAsset.set("active", false)
                            resultFixedAsset.save().then( ( resultFixedAssetCurrent ) =>{
                                exports.SaveFinacialLog( dataFinancialLog, resultFixedAsset.get("simulationPtr").get("currentDate"), simulationPtr, teamPtr ).then(function (results) {
                                    if (results.error) {
                                        resolve({ type: "AGREGAR", data: null, error: error.message })
                                    }else{
                                        resolve({ type: "AGREGAR", data: results, error: null })
                                    }
                                })
                            }, (error) => {
                                resolve({ type: "ACTUALIZAR", data: null, error: error.message })
                            })
                        })
                    },(error) => {
                        resolve({ type: "ACTUALIZAR", data: null, error: error.message })
                    })
                }) 
            }
        })
        
    })
}

exports.ToAssignPhase = function (data, simulationPtr, teamPtr) {
    var Simulations         = Parse.Object.extend("Simulations")
    var simulation          = new Simulations()
        simulation.id       = simulationPtr

    var SimulationsTeams    = Parse.Object.extend("SimulationsTeams")
    var team                = new SimulationsTeams()
        team.id             = teamPtr
    return new Promise(function(resolve,reject) {
        
        exports.AsyncGetFixedAsset(data["objectId"], simulation, team, function( resultFixedAsset, error){
            if (error) { return resolve({ type: "ACTUALIZAR", data: null, error: error.message })}
            var Phase           = Parse.Object.extend("SDMProductionLinePhases")
            var phaseSDMPtr     = new Phase()
                phaseSDMPtr.id  = data["phaseSDMPtr"]
            resultFixedAsset.set("phaseSDMPtr",phaseSDMPtr)
            resultFixedAsset.save().then( ( resultFixedAssetCurrent ) =>{
                resolve({ type: "ACTUALIZAR", data: resultFixedAssetCurrent, error: null })
            }, (error) => {
                resolve({ type: "ACTUALIZAR", data: null, error: error.message })
            })
        })
    })
}

exports.AsyncGetFixedAsset = async ( fixedAssetPtr, simulationPtr, teamPtr, callback) => {
    var Table = Parse.Object.extend("TDMActivosFijosInventario")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr",simulationPtr)
    query.equalTo("teamPtr",teamPtr)
    query.equalTo("objectId",fixedAssetPtr)
    query.equalTo("exists",true)
    query.equalTo("active",true)
    query.include("simulationPtr")

    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetFixedAssetTDProductionLineTemplate = async (fixedAssetPtr, simulationPtr, teamPtr, callback) => {
    var Table = Parse.Object.extend("TDProductionLine")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr",simulationPtr)
    query.equalTo("teamPtr",teamPtr)
    query.equalTo("fixedAssetTDMSprt",fixedAssetPtr)
    query.equalTo("exists",true)
    query.include("templateSDMPtr")
    query.include("productionLineTDSptr")

    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.GetAllOrderBoxes = function ( simulationPtr, teamPtr ){
    var Simulations         = Parse.Object.extend("Simulations")
    var simulation          = new Simulations()
        simulation.id       = simulationPtr

    var SimulationsTeams    = Parse.Object.extend("SimulationsTeams")
    var team                = new SimulationsTeams()
        team.id             = teamPtr
    return new Promise(function (resolve, reject) {
        exports.AsyncGetFolioReceiptRawMaterialBox(simulation, team, 0, 0, function(resultFolio, error){
            exports.AsyncGetAllOrderBoxes( simulation, team, 0, [], function (results, error) {
                if (error) { return resolve( { type: "CONSULTA", data: null, error: error.message } ) }
                resolve({ type: "CONSULTA", data:results, folioReceiptNumber:resultFolio, error: null})
            })
        })
    })
}

exports.AsyncGetAllOrderBoxes = async (simulationPtr, teamPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("SimulationsDeliveredRawMaterial")
    var query = new Parse.Query(Table)

        query.equalTo("simulationPtr",simulationPtr)
        query.equalTo("teamPtr",teamPtr)
        query.equalTo("exists",true)
        query.equalTo("active", true)
        query.include("simulationOrderPurchaingPtr")
        query.include("simulationOrderSupplierPtr.DMRawMaterialPtr")
        query.include("simulationOrderSupplierPtr.SDMSupplierPtr")
        query.limit(1000)
        query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetAllOrderBoxes( simulationPtr, teamPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }

}

exports.AsyncGetFolioReceiptRawMaterialBox = async ( simulationPtr, teamPtr, index, folioNumber, callback) => {
    var folioTempo = undefined
    var Table = Parse.Object.extend("SimulationsInventory")
    var query = new Parse.Query(Table)

        query.equalTo("simulationPtr",simulationPtr)
        query.equalTo("teamPtr",teamPtr)
        query.equalTo("exists",true)
        query.equalTo("active",true)
        query.exists("receiptFolio")
        query.limit(1000)
        query.skip(index * 1000)

        try {
            var results = await query.find()
            if (results.length <= 0) {
                callback(Number(folioNumber),null)
            }else{
                var CurrentFolioNumber = results.reduce( function(prev, current){
                    return prev.get("receiptFolio") > current.get("receiptFolio") ? prev : current 
                })
                //log(CurrentFolioNumber.get("receiptFolio") +' > '+ folioNumber)
                folioTempo = Number(CurrentFolioNumber.get("receiptFolio")) > Number(folioNumber) ? CurrentFolioNumber.get("receiptFolio") : folioNumber
                //log(folioTempo)
                exports.AsyncGetFolioReceiptRawMaterialBox(simulationPtr,teamPtr,(index+1), Number(folioTempo), callback)
            }
        } catch (error) {
            callback(null, error)
        }

}

exports.ReceiveOrders = function ( data, simulationPtr, teamPtr ,user) {
    var Simulations         = Parse.Object.extend("Simulations")
    var simulation          = new Simulations()
        simulation.id       = simulationPtr

    var SimulationsTeams    = Parse.Object.extend("SimulationsTeams")
    var team                = new SimulationsTeams()
        team.id             = teamPtr
    return new Promise(function (resolve, reject) {
        exports.AsyncGetFolioReceiptRawMaterial(simulation, team, data['receiptDate'], data['idSuppliers'], 0, 0, function(resultFolio, error){
            //log(resultFolio, error)
            if (error) { return resolve({ type: "ACTUALIZAR", data: null, error: error.message }) }
            var resultFolioTempo = undefined
            if(resultFolio.dateFound == false){
                resultFolioTempo = Number(resultFolio.folioNumber) + 1
            }else{
                resultFolioTempo = Number(resultFolio.folioNumber) 
            }

            var arraObjectsToSave = []
            for (let i = 0; i < parseInt(data["quantityRawMaterial"]); i++) {
                let quality = globalFunctionality.getRandomInt(50,100)

                var RawMaterialPtr    = Parse.Object.extend("DMMateriaPrima")
                var rawMaterialPtr    = new RawMaterialPtr()
                    rawMaterialPtr.id =  data["rawMaterialPtr"]

                var OrdersSuppliers    = Parse.Object.extend("SimulationsOrdersSuppliers")
                var ordersSuppliers    = new OrdersSuppliers()
                    ordersSuppliers.id =  data["OrdersSuppliers"]

                var Table   = Parse.Object.extend("SimulationsInventory")
                var object  = new Table()

                object.set("simulationPtr",simulation)
                object.set("teamPtr",team)
                object.set("quality",Number(quality))
                object.set("productPtr",rawMaterialPtr)
                object.set("status","INVENTORY")
                object.set("receiptFolio", resultFolioTempo)
                object.set("daysReceiptDelay",Number(data['daysReceiptDelay']))
                object.set("receiptDate",Number(data['receiptDate']))
                object.set("simulationOrdersSuppliersPtr",ordersSuppliers)
                object.set("exists",true)
                object.set("active",true)

                arraObjectsToSave.push(object)
            }
            var quantityRawMaterial = parseInt(data["quantityRawMaterial"])
            exports.CreateObjects(arraObjectsToSave,quantityRawMaterial, 0, 1000, [], function (resultsRawMaterialInventory, error){
                if (error) { return resolve({ type: "ACTUALIZAR", data: null, error: error.message }) }
                exports.AsyncSearchOrderBoxe (data["objectIdBox"], function(resultsBox, error){
                    resultsBox.set("active",false)
                    resultsBox.save().then((resultsSaveBox)=>{
                        let id = resultsBox.get("simulationOrderPurchaingPtr").id
                        exports.AsyncSearchOrderPurchasing ( id, function(resultOrder, error) {
                            resultOrder.set("status","FINISHED")
                            resultOrder.save().then((resultSaveOrder) =>{
                                var messageComplete = data['messageLogsPart1']+' '+resultFolioTempo+' '+data['messageLogsPart2']
                                Bitacora.AddSimulationLog("Receive order boxe",simulationPtr,teamPtr,user,'Raw Material',messageComplete).then(function (results){
                                    resolve({ type: "ACTUALIZAR", data:resultsRawMaterialInventory, error: null })
                                })
                            }, (error) => {
                                resolve({ type: "ACTUALIZAR", data: null, error:error.message })
                            })
                        })

                    },(error)=>{
                        resolve({ type: "ACTUALIZAR", data: null, error:error.message })
                    })
                })
            })
        })
    })
}

exports.CreateObjects = async (data, quantity, star, end, dataArray, callback) => {
    var rangeEnd = end
    if( end > data.length){ rangeEnd = data.length}
    
    try {
        if(quantity <= 0){
            callback(dataArray, null)
        }else{
            var arrayObjects = data.slice(star, rangeEnd)
            Parse.Object.saveAll(arrayObjects).then((results)=>{
                dataArray.push.apply(dataArray, results)
                exports.CreateObjects(data, (quantity-1000), (rangeEnd+1), (rangeEnd+1001), dataArray, callback)
            }, (error)=>{
                callback(null, error)
            })
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetFolioReceiptRawMaterial = async ( simulationPtr, teamPtr, date, ptrSuppliers, index, folioNumber, callback) => {
    var folioTempo = undefined
    var CurrentFolioNumber = undefined
    var resultDataForDate = undefined
    var Table = Parse.Object.extend("SimulationsInventory")
    var query = new Parse.Query(Table)

        query.equalTo("simulationPtr",simulationPtr)
        query.equalTo("teamPtr",teamPtr)
        query.equalTo("exists",true)
        query.equalTo("active",true)
        query.exists("receiptFolio")
        query.include("simulationOrdersSuppliersPtr")
        query.limit(1000)
        query.skip(index * 1000)

        try {
            var results = await query.find()
            if (results.length <= 0) {
                var requestData = {
                    folioNumber: Number(folioNumber),
                    dateFound : false
                }
                callback(requestData,null)
            }else{
                resultDataForDate = _.filter(results,function(current){
                    var dateDataCurrent = moment(Number(current.get("receiptDate")))//.format("DD/MM/YYYY").toString()
                    var dateDataToAdd = moment(Number(date))//.format("DD/MM/YYYY").toString()
                    //log(ptrSuppliers +' == '+ current.get("simulationOrdersSuppliersPtr").get("SDMSupplierPtr").id +' & '+ dateDataCurrent.format("DD/MM/YYYY") +' == '+ dateDataToAdd.format("DD/MM/YYYY"))
                    return ptrSuppliers == current.get("simulationOrdersSuppliersPtr").get("SDMSupplierPtr").id && dateDataCurrent.format("DD/MM/YYYY") == dateDataToAdd.format("DD/MM/YYYY")
                })
                //log(resultDataForDate)
                if(resultDataForDate.length > 0){
                    var requestData = {
                        folioNumber: Number(resultDataForDate[0].get("receiptFolio")),
                        dateFound : true
                    }
                    return callback(requestData,null)
                }else{
                    CurrentFolioNumber = results.reduce( function(prev, current){
                        return prev.get("receiptFolio") > current.get("receiptFolio") ? prev : current 
                    })
                }
                //log(CurrentFolioNumber.get("receiptFolio") +' > '+ folioNumber)
                folioTempo = Number(CurrentFolioNumber.get("receiptFolio")) > Number(folioNumber) ? CurrentFolioNumber.get("receiptFolio") : folioNumber
                //log(folioTempo)
                exports.AsyncGetFolioReceiptRawMaterial(simulationPtr,teamPtr,date, ptrSuppliers,(index+1), Number(folioTempo), callback)
            }
        } catch (error) {
            callback(null, error)
        }

}

exports.AsyncSearchOrderPurchasing = async (objectId, callback) => {
    var Table = Parse.Object.extend("SimulationsOrdersPurchasings")
    var query = new Parse.Query(Table)
        query.equalTo("objectId",objectId)
        query.equalTo("active", true)
        query.equalTo("exists",true)
    
    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncSearchOrderBoxe = async (objectId, callback) => {
    var Table = Parse.Object.extend("SimulationsDeliveredRawMaterial")
    var query = new Parse.Query(Table)
        query.equalTo("objectId",objectId)
        query.equalTo("active",true)
        query.equalTo("exists",true)

    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

/*exports.CreateObjects = async (data, simulation, team, length, dataArray, callback) => {
    var limitFor = 1000
    log(length)
    log("***********")
    
    if(limitFor >= length){ 
        limitFor = length
    }

    try {
        if( length == 0 ){
            callback(dataArray, null)
        }else{
            var arrayObjects = []
            for (let i = 0; i < parseInt(limitFor); i++) {
                let quality = globalFunctionality.getRandomInt(50,100)

                var RawMaterialPtr    = Parse.Object.extend("DMMateriaPrima")
                var rawMaterialPtr    = new RawMaterialPtr()
                    rawMaterialPtr.id =  data["rawMaterialPtr"]

                var Table   = Parse.Object.extend("SimulationsInventory")
                var object  = new Table()

                object.set("simulationPtr",simulation)
                object.set("teamPtr",team)
                object.set("quality",Number(quality))
                object.set("productPtr",rawMaterialPtr)
                object.set("status","INVENTORY")
                object.set("exists",true)
                object.set("active",true)

                arrayObjects.push(object)
            }    

            Parse.Object.saveAll(arrayObjects).then((results)=>{
                dataArray.push.apply(dataArray, results)
                exports.CreateObjects(data, simulation, team, (length-limitFor), dataArray, callback)
            }, (error)=>{
                callback(null, error)
            })
        }
    } catch (error) {
        callback(null, error)
    }
}*/

exports.GetAllRawMaterialSimulationInventory = function (simulationPtr, teamPtr){
    var Simulations         = Parse.Object.extend("Simulations")
    var simulation          = new Simulations()
        simulation.id       = simulationPtr
    
    var SimulationsTeams    = Parse.Object.extend("SimulationsTeams")
    var team                = new SimulationsTeams()
        team.id             = teamPtr
    
    return new Promise(function (resolve, reject) {
        exports.AsyncGetCountAllSimulationInventory(simulation, team, function(resultCount, error){
            if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message }) }
            if(resultCount > 0){
                exports.AsyncGetAllSimulationInventory(simulation, team, 0, [], function (resultsInventory, error){
                    if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message }) }

                    const datosUnicos = _.uniq(resultsInventory, function (current) {
                                                return current.get("productPtr").id;
                                        });
                    var arrayObjects = []
                    for (let i = 0; i < datosUnicos.length; i++) {
                        var RawMaterialInventory = _.filter(resultsInventory, function (obj){
                                                        return obj.get("productPtr").id == datosUnicos[i].get("productPtr").id
                                                    })
                        var json = {
                                        "quantity"      : RawMaterialInventory.length,
                                        "RawMaterial"   : datosUnicos[i] 
                                    }
                        arrayObjects.push(json)
                    }
                    resolve({ type: "CONSULTA", data: arrayObjects, error: null })
                })
            }else{
                exports.AsyncGetSDMMateriaPrimaInventario(simulation, 0, [], function(resultsSDMMateriaPrima, error){
                    if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message }) }

                    var arraObjectsToSave = []
                    for (let i = 0; i < resultsSDMMateriaPrima.length; i++) {
                        var quantityRawMaterialTempo = resultsSDMMateriaPrima[i].get("cantidad")
                        for (let j = 0; j < Number(quantityRawMaterialTempo); j++) {
                            let quality = globalFunctionality.getRandomInt(50,100)

                            var Table   = Parse.Object.extend("SimulationsInventory")
                            var object  = new Table()

                            object.set("simulationPtr",simulation)
                            object.set("teamPtr",team)
                            object.set("quality",Number(quality))
                            object.set("productPtr",resultsSDMMateriaPrima[i].get("materaPrimaPtr"))
                            object.set("status","INVENTORY")
                            object.set("exists",true)
                            object.set("active",true)
                            arraObjectsToSave.push(object)
                        }
                    }

                    var quantityRawMaterial = arraObjectsToSave.length
                    exports.CreateObjects(arraObjectsToSave,quantityRawMaterial, 0, 1000, [], function (resultsRawMaterialInventory, error){
                        if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message }) }
                        //resolve({ type: "CONSULTA", data: resultsRawMaterialInventory, error: null})
                        exports.AsyncGetAllSimulationInventory(simulation, team, 0, [], function (resultsInventory, error){
                            if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message }) }
        
                            const datosUnicos = _.uniq(resultsInventory, function (current) {
                                                    return current.get("productPtr").id;
                                                });
                            var arrayObjects = []
                            for (let i = 0; i < datosUnicos.length; i++) {
                                var RawMaterialInventory = _.filter(resultsInventory, function (obj){
                                                                return obj.get("productPtr").id == datosUnicos[i].get("productPtr").id
                                                            })
                                var json = {
                                                "quantity"      : RawMaterialInventory.length,
                                                "RawMaterial"   : datosUnicos[i] 
                                            }
                                arrayObjects.push(json)
                            }
                            resolve({ type: "CONSULTA", data: arrayObjects, error: null })
                        })
                    })
                })
            }
        })
    })
}

exports.AsyncGetAllSimulationInventory = async (simulationPtr, teamPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("SimulationsInventory")
    var query = new Parse.Query(Table)

        query.equalTo("simulationPtr",simulationPtr)
        query.equalTo("teamPtr",teamPtr)
        query.equalTo("active",true)
        query.equalTo("exists",true)
        query.equalTo("status","INVENTORY")
        query.include("productPtr")
        query.limit(1000)
        query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetAllSimulationInventory(simulationPtr, teamPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetCountAllSimulationInventory = async (simulationPtr, teamPtr, callback) => {
    var Table = Parse.Object.extend("SimulationsInventory")
    var query = new Parse.Query(Table)

        query.equalTo("simulationPtr",simulationPtr)
        query.equalTo("teamPtr",teamPtr)

    try {
        var results = await query.count()
        callback(results,null)
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetSDMMateriaPrimaInventario = async ( simulationPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("SDMMateriaPrimaInventario")
    var query = new Parse.Query(Table)

        query.equalTo("simulationPtr",simulationPtr)
        query.equalTo("active",true)
        query.equalTo("exists",true)
        query.limit(100)
        query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray,null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetSDMMateriaPrimaInventario(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.GetAllProductionLineTemplates = function ( simulationPtr, teamPtr ) {
    var Simulations         = Parse.Object.extend("Simulations")
    var simulation          = new Simulations()
        simulation.id       = simulationPtr
    
    var SimulationsTeams    = Parse.Object.extend("SimulationsTeams")
    var team                = new SimulationsTeams()
        team.id             = teamPtr
        
    return new Promise(function (resolve, reject) {
        /*exports.AsyncGetAllTDActivatedProductionLineTemplates ( simulation, team,  0, [], function (resultActivatedTemplate, error){
            if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message }) }
            var arrayIdsTemplate = []
            for (let i = 0; i < resultActivatedTemplate.length; i++) {
                arrayIdsTemplate.push(resultActivatedTemplate[i].get('templateSDMPtr').id)
            }*/
            exports.AsyncGetAllProductionLineTemplates ( simulation, /*arrayIdsTemplate,*/ 0, [], function (resultsTemplates, error){
                if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message }) }
                exports.AsyncGetProductionLinePhases ( simulation, 0, [], function (resultsPhases, error) {
                    if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message }) }
                    exports.AsyncGetEmployeesInSimulation ( simulation, team, 0, [], function (resultsEmployees, error) {
                        if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message }) }
                        exports.AsyncGetFixedAssetsInSimulation ( simulation, team, 0, [], function (resultsFixedAssets, error) {
                            if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message }) }
                            resolve({ type: "CONSULTA", data: resultsTemplates, dataPhases: resultsPhases, dataEmployees: resultsEmployees, dataFixedAssets: resultsFixedAssets,  error: null })
                        })
                    })

                })
                //resolve({ type: "CONSULTA", data: results, error: null })
            })
       // })
    })
}

exports.AsyncGetAllTDActivatedProductionLineTemplates = async (simulationPtr, teamPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("TDActivatedProductionLine")
    var query = new Parse.Query(Table)

        query.equalTo("simulationPtr",simulationPtr)
        query.equalTo("teamPtr",teamPtr)
        query.equalTo("exists",true)
        query.equalTo("active", true)
        query.limit(1000)
        query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetAllTDActivatedProductionLineTemplates( simulationPtr, teamPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetAllProductionLineTemplates = async ( simulationPtr, /*dataArrayTemplate,*/ index, dataArray, callback ) => {
    var Table = Parse.Object.extend("SDMProductionLineTemplates")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr",simulationPtr)
    //query.notContainedIn("objectId",dataArrayTemplate)
    query.equalTo("exists",true)
    query.equalTo("active",true)
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
            exports.AsyncGetAllProductionLineTemplates( simulationPtr, /*dataArrayTemplate,*/ (index + 1), dataArray, callback )
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetProductionLinePhases = async ( simulationPtr, index, dataArray, callback ) => {
    var Table = Parse.Object.extend("SDMProductionLinePhases")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr",simulationPtr)
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
            exports.AsyncGetProductionLinePhases( simulationPtr, (index + 1), dataArray, callback )
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetEmployeesInSimulation = async ( simulationPtr, teamPtr, index, dataArray, callback ) => {
    var Table = Parse.Object.extend("SDMSalaryTabulator")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr",simulationPtr)
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
            exports.AsyncGetEmployeesInSimulation( simulationPtr, teamPtr, (index + 1), dataArray, callback )
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetFixedAssetsInSimulation = async ( simulationPtr, teamPtr, index, dataArray, callback ) => {
    var Table = Parse.Object.extend("SDMActivosFijos")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr",simulationPtr)
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
            exports.AsyncGetFixedAssetsInSimulation( simulationPtr, teamPtr, (index + 1), dataArray, callback )
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetEfficiencyPercentage = async ( objectId, simulationPtr, teamPtr, callback) => {
    log(objectId, simulationPtr, teamPtr)
    var Table = Parse.Object.extend("TDActivatedProductionLine")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr",simulationPtr)
    query.equalTo("teamPtr",teamPtr)
    query.equalTo("objectId",objectId)
    query.equalTo("exists",true)
    query.equalTo("active",true)

    try {
        var results = await query.first()
            callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.saveEfficiencyPercentage = function ( data, simulationPtr, teamPtr ){
    log( data, simulationPtr, teamPtr )
    var Simulations         = Parse.Object.extend("Simulations")
    var simulation          = new Simulations()
        simulation.id       = simulationPtr
    
    var SimulationsTeams    = Parse.Object.extend("SimulationsTeams")
    var team                = new SimulationsTeams()
        team.id             = teamPtr

    return new Promise(function (resolve, reject) {
        exports.AsyncGetEfficiencyPercentage(data['objectId'], simulation, team, function(result, error){
            log(result, error)
            if (error) { return resolve({ type: "ACTUALIZAR", data: null, error: error.message })}

            result.set("efficiencyPercentage", Number(data["efficiencyPercentage"]))

            result.save().then((resultSaved) => { 
                resolve({ type: "AGREGAR", data: resultSaved, error: null})
            }, (error) => {
                resolve({ type: "AGREGAR", data: null, error: error.message })
            })
        })
    })

    
}

exports.SaveProductionLineTemplates = function ( data, simulationPtr, teamPtr ) {
    var Simulations         = Parse.Object.extend("Simulations")
    var simulation          = new Simulations()
        simulation.id       = simulationPtr
    
    var SimulationsTeams    = Parse.Object.extend("SimulationsTeams")
    var team                = new SimulationsTeams()
        team.id             = teamPtr
    return new Promise(function(resolve,reject) {
        //log(data)
        exports.AsyncGetProductionLineTemplate(data["objectIdTemplate"], simulation, function(resultTemplate, error){
            if (error) { return resolve({ type: "AGREGAR", data: null, error: error.message })}
            exports.AsyncGetProductionLinePhases(simulation, 0, [], function(resultPhases, error){
                if (error) { return resolve({ type: "AGREGAR", data: null, error: error.message })}  
                exports.AsyncGetAllSalaryTabulator(simulation, 0, [], function (resultsSalaryTabulator, error){
                    if (error) { return resolve({ type: "AGREGAR", data: null, error: error.message })} 
                    exports.AsyncGetFixedAssetsInSimulation(simulation, team, 0, [], function(resultFixedAssetsSDM, error){
                        if (error) { return resolve({ type: "AGREGAR", data: null, error: error.message })} 
                        exports.AsyncGetAllDataTDProductionLineTemplate(simulation, team, "FIXED_ASSET", 0, [], function(resultsFixedAssetsTD, error){
                            if (error) { return resolve({ type: "AGREGAR", data: null, error: error.message })}
                            var ArrayIdsFixedAssets = []
                            for (let i = 0; i < resultsFixedAssetsTD.length; i++) {
                                ArrayIdsFixedAssets.push(resultsFixedAssetsTD[i].get("fixedAssetTDMSprt").id)
                            }
                            exports.AsyncGetAllFixedAssetsAssignedToAPhase(simulation, team, ArrayIdsFixedAssets, 0, [], function(resultsFixedAssetsOfToPhases, error) {
                                if (error) { return resolve({ type: "AGREGAR", data: null, error: error.message })}
                                exports.AsyncGetAllDataTDProductionLineTemplate(simulation, team, "EMPLOYEE", 0, [], function(resultEmployee, error){
                                    if (error) { return resolve({ type: "AGREGAR", data: null, error: error.message })}
                                    var ArrayIdsEmployees = []
                                    for (let i = 0; i < resultEmployee.length; i++) {
                                        ArrayIdsEmployees.push(resultEmployee[i].get("employeeTDMSprt").id)
                                    }
                                    exports.AsyncGetAllEmployeeAssignedToAPhase(simulation, team, ArrayIdsEmployees, 0, [], function(resultsEmployeesOfToPhases, error) {
                                        if (error) { return resolve({ type: "AGREGAR", data: null, error: error.message })}
                                        var templateDataView                = data["objectIdTemplate"]
                                        var name                            = data["nameTemplate"]
                                        delete data["objectIdTemplate"]
                                        delete data["nameTemplate"]
                                        var dataSMDQantyTemplateFixedAsset  = resultTemplate.get("quantityFixedAssets")
                                        var dataPhasesSMD                   = resultTemplate.get("phases")
                                        var dataIsCorrect                   = true
                                        var messageErro                     = ''
                                        var employeesAndfixedAsseToSave = []

                                        for (const key in data) {

                                            let phaseInDataView     = key.split('_')
                                            let numberIndex         = dataPhasesSMD.indexOf(phaseInDataView[1])
                                            let tempoFixedAssetSMD  = dataSMDQantyTemplateFixedAsset[numberIndex]
                                            let dataView            = data[key]
                                            var phaseCurrent        = _.find(resultPhases,function(current){
                                                                            return current.id == phaseInDataView[1]
                                                                        })

                                            //Recorrer los datos datos pertenecinetes al template de los activos fijos que vienen de la vista 
                                            for (const keyFA in dataView) {

                                                if(dataIsCorrect == true){

                                                    //Recorrer los datos pertenecientes a los activos fijos del template que vinen de la base de datso
                                                    for ( const keyFASMD in tempoFixedAssetSMD ) {
                                                        if ( dataIsCorrect == true ) {  
                                                            if ( keyFA == "fixedAsset_" + keyFASMD ) {
                                                                //Comparar que el numero de activos fijo sea el correcto
                                                                if( Number(dataView[keyFA]) >= Number(tempoFixedAssetSMD[keyFASMD]) ){
                                                                    dataIsCorrect = true
                                                                    break
                                                                }else{
                                                                    let fixedA = _.find(resultFixedAssetsSDM,function(current){
                                                                                    return current.id == keyFASMD
                                                                                })
                                                                    messageErro = 'We are sorry the value of the fixed asset '+fixedA.get("nombre")+', in the phase '+phaseCurrent.get("name")+' is less than the minimum that is needed to activate the template'
                                                                    dataIsCorrect = false
                                                                    break
                                                                }
                                                            }
                                                        }else{ break }
                                                    }

                                                    //Recorrer los datos pertenecinetes a los employees de la pahase que vienen de la base de datos
                                                    let phase               = _.find(resultPhases,function(current){ return current.id == phaseInDataView[1] })
                                                    let employeesInPhase    = phase.get("quantityEmployees")

                                                    for (const keyEmployee in employeesInPhase) {
                                                        if(dataIsCorrect == true){
                                                            if ( keyFA == "employee_"+keyEmployee ) {
                                                                if( Number(dataView[keyFA]) >= Number(employeesInPhase[keyEmployee]) ){
                                                                    dataIsCorrect = true
                                                                    break
                                                                }else{
                                                                    let employeeTempo = _.filter(resultsSalaryTabulator,function(curent){
                                                                        return curent.id == keyEmployee
                                                                    })
                                                                    messageErro = 'We are sorry the value of the employees '+employeeTempo[0].get('department')+', in the phase '+phaseCurrent.get("name")+' is less than the minimum that is needed to activate the template'
                                                                    dataIsCorrect = false
                                                                    break
                                                                }
                                                            }
                                                        }else{ break }
                                                    }

                                                }else{ break }
                                            }
                                        }

                                        var dataSufficient = true
                                        if (dataIsCorrect == true) {
                                            for(const key in data){
                                                let dataPhase = data[key]
                                                let phaseInDataView = key.split('_')
                                                var phaseCurrent = _.find(resultPhases,function(current){
                                                    return current.id == phaseInDataView[1]
                                                })

                                                if (dataSufficient == true) {
                                                    for (const keyPhase in dataPhase) {

                                                        let keyPhaseTempo = keyPhase.split("_")

                                                        var templateTable   = Parse.Object.extend("SDMProductionLineTemplates")
                                                        var template        = new templateTable()
                                                            template.id     = templateDataView
                                                        
                                                        var PhaseTable      = Parse.Object.extend("SDMProductionLinePhases")
                                                        var PhaseTable      = new PhaseTable()
                                                            PhaseTable.id   = phaseInDataView[1]

                                                        if(keyPhaseTempo[0] == "fixedAsset" && dataSufficient == true){
                                                            let fixedAssetsEquals = _.filter(resultsFixedAssetsOfToPhases, function(current){
                                                                return current.get("fixedAssetPtr").id == keyPhaseTempo[1] && current.get("phaseSDMPtr").id == phaseInDataView[1]
                                                            })
                                                            
                                                            if(fixedAssetsEquals.length > 0 || fixedAssetsEquals == undefined ){
                                                                if ( Number(fixedAssetsEquals.length) >= Number(dataPhase[keyPhase]) ) {
                                                                    for (let i = 0; i < Number(dataPhase[keyPhase]); i++) {

                                                                        var templateTable = Parse.Object.extend("TDProductionLine")
                                                                        var objectTemplate = new templateTable ()

                                                                            objectTemplate.set("teamPtr",team)
                                                                            objectTemplate.set("simulationPtr",simulation)
                                                                            objectTemplate.set("templateSDMPtr",template)
                                                                            objectTemplate.set("phaseSDMPtr",PhaseTable)
                                                                            objectTemplate.set("fixedAssetTDMSprt",fixedAssetsEquals[i])
                                                                            objectTemplate.set("type","FIXED_ASSET")
                                                                            objectTemplate.set("exists",true)
                                                                            objectTemplate.set("active",true)

                                                                        employeesAndfixedAsseToSave.push(objectTemplate)
                                                                    }
                                                                }else{
                                                                    let missing =  Number(dataPhase[keyPhase]) - Number(fixedAssetsEquals.length)
                                                                    messageErro = 'Sorry, you have not purchased '+missing+' fixed asset '+fixedAssetsEquals[0].get("fixedAssetPtr").get("nombre")+' assigned to phase '+phaseCurrent.get("name")+', please buy it first and try again.'
                                                                    dataSufficient = false
                                                                    break
                                                                }
                                                            }else{
                                                                let fixerdAssetFound = _.find(resultFixedAssetsSDM,function(current){
                                                                    return current.id == keyPhaseTempo[1]
                                                                })
                                                                messageErro = 'Sorry, you have not purchased any fixed assets '+fixerdAssetFound.get("nombre")+' assigned to phase '+phaseCurrent.get("name")+', please buy it first and try again.'
                                                                    dataSufficient = false
                                                                    break
                                                            }

                                                        }else if(keyPhaseTempo[0] == "employee" && dataSufficient == true){
                                                            let employeeEquals = _.filter(resultsEmployeesOfToPhases, function(current){
                                                                                        return current.get("salaryTabulatorPtr").id == keyPhaseTempo[1] && current.get("phaseSDMPtr").id == phaseInDataView[1]
                                                                                    })
                                                            
                                                            if( employeeEquals.length > 0 || employeeEquals!= undefined ){
                                                                if ( Number(employeeEquals.length) >= Number(dataPhase[keyPhase]) ) {
                                                                    for (let i = 0; i < Number(dataPhase[keyPhase]); i++) {

                                                                        var templateTable = Parse.Object.extend("TDProductionLine")
                                                                        var objectTemplate = new templateTable()

                                                                            objectTemplate.set("teamPtr",team)
                                                                            objectTemplate.set("simulationPtr",simulation)
                                                                            objectTemplate.set("templateSDMPtr",template)
                                                                            objectTemplate.set("phaseSDMPtr",PhaseTable)
                                                                            objectTemplate.set("employeeTDMSprt",employeeEquals[i])
                                                                            objectTemplate.set("type","EMPLOYEE")
                                                                            objectTemplate.set("exists",true)
                                                                            objectTemplate.set("active",true)

                                                                        employeesAndfixedAsseToSave.push(objectTemplate)
                                                                    }
                                                                }else{
                                                                    let missing =  Number(dataPhase[keyPhase]) - Number(employeeEquals.length)
                                                                    messageErro = 'Sorry, you have not assigned a shift or have hired '+missing+' employee '+employeeEquals[0].get("salaryTabulatorPtr").get("department")+' assigned to phase '+phaseCurrent.get("name")+', please hire it first and try again.'
                                                                    dataSufficient = false
                                                                    break
                                                                }
                                                            }else{
                                                                let employeeFound = _.find(resultsSalaryTabulator,function(current){
                                                                    return current.id == keyPhaseTempo[1]
                                                                })
                                                                messageErro = 'Sorry, you have not assigned a shift or hired to any employee of from '+employeeFound.get("nombre")+' assigned to phase '+phaseCurrent.get("name")+', please hire it first and try again.'
                                                                    dataSufficient = false
                                                                    break
                                                            }

                                                        }else{ 
                                                            dataSufficient = false 
                                                            break 
                                                        }
                                                    }
                                                }else{ break }
                                            }
                                        }

                                        if(dataIsCorrect != true || dataSufficient != true){
                                            return resolve({ type: "AGREGAR", data: null, error: messageErro})
                                        }

                                        var activatedTemplateTable = Parse.Object.extend("TDActivatedProductionLine")
                                        var objectActivatedTemplate = new activatedTemplateTable ()

                                            objectActivatedTemplate.set("templateSDMPtr",resultTemplate)
                                            objectActivatedTemplate.set("teamPtr",team)
                                            objectActivatedTemplate.set("simulationPtr",simulation)
                                            objectActivatedTemplate.set("name", name)
                                            objectActivatedTemplate.set("exists",true)
                                            objectActivatedTemplate.set("active", true)
                                            if(resultTemplate.get("efficiencyPercentage")){
                                                objectActivatedTemplate.set("efficiencyPercentage", Number(resultTemplate.get("efficiencyPercentage")))
                                            }else{
                                                objectActivatedTemplate.set("efficiencyPercentage", Number( 0 ))
                                            }

                                            objectActivatedTemplate.save().then((resultActivatedProductionLine) => {
                                                employeesAndfixedAsseToSave.forEach(element => {
                                                    element.set("productionLineTDSptr",resultActivatedProductionLine)
                                                });
                                                Parse.Object.saveAll(employeesAndfixedAsseToSave).then((resutEmployeeFixedAsset) => { 
                                                    resolve({ type: "AGREGAR", data: resutEmployeeFixedAsset, error: null})
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
                })
            })
        })
    })
}

exports.AsyncGetProductionLineTemplate = async (objectId, simulationPtr, callback) => {
    var Table = Parse.Object.extend("SDMProductionLineTemplates")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr",simulationPtr)
    query.equalTo("objectId",objectId)
    query.equalTo("active",true)
    query.equalTo("exists",true)
    
    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetAllFixedAssetsAssignedToAPhase = async (simulationPtr, teamPtr, arrayIdsFixedAssets, index, dataArray, callback) => {
    var Table = Parse.Object.extend("TDMActivosFijosInventario")
    var query = new Parse.Query(Table)

    query.notContainedIn("objectId",arrayIdsFixedAssets)
    query.equalTo("simulationPtr",simulationPtr)
    query.equalTo("teamPtr",teamPtr)
    query.equalTo("exists",true)
    query.equalTo("active", true)
    query.exists("phaseSDMPtr")
    query.include("fixedAssetPtr")
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetAllFixedAssetsAssignedToAPhase(simulationPtr, teamPtr, arrayIdsFixedAssets, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetAllEmployeeAssignedToAPhase = async (simulationPtr, teamPtr, ArrayIdsEmployees, index, dataArray, callback) => {
    var Table = Parse.Object.extend("TDMEmployees")
    var query = new Parse.Query(Table)

    query.notContainedIn("objectId",ArrayIdsEmployees)
    query.equalTo("simulationPtr",simulationPtr)
    query.equalTo("teamPtr",teamPtr)
    query.equalTo("exists",true)
    query.equalTo("active", true)
    query.exists("phaseSDMPtr")
    query.exists("shift")
    query.include("salaryTabulatorPtr")
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetAllEmployeeAssignedToAPhase(simulationPtr, teamPtr, ArrayIdsEmployees, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetAllDataTDProductionLineTemplate = async (simulationPtr, teamPtr, type, index, dataArray, callback) => {
    var Table = Parse.Object.extend("TDProductionLine")
    var query = new Parse.Query(Table)

        query.equalTo("simulationPtr",simulationPtr)
        query.equalTo("teamPtr",teamPtr)
        query.equalTo("type",type)
        query.equalTo("exists",true)
        query.equalTo("active", true)
        query.limit(1000)
        query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetAllDataTDProductionLineTemplate(simulationPtr, teamPtr, type, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.GetAllTemplateActivated = function (simulationPtr, teamPtr) {
    var Simulations         = Parse.Object.extend("Simulations")
    var simulation          = new Simulations()
        simulation.id       = simulationPtr
    
    var SimulationsTeams    = Parse.Object.extend("SimulationsTeams")
    var team                = new SimulationsTeams()
        team.id             = teamPtr
    return new Promise(function (resolve, reject) {
        exports.AsyncGetAllTDProductionLineTemplateActivated ( simulation, team, 0, [], function (resultsActivatedTemplate, error) {
            if (error) { return resolve( { type: "CONSULTA", data: null, error: error.message } ) }
            var arraysIdsTemplate = []
            for (let i = 0; i < resultsActivatedTemplate.length; i++) {
                arraysIdsTemplate.push(resultsActivatedTemplate[i].get("templateSDMPtr"))
            }
            exports.AsyncGetAllDataTDProdcutionLineTemplate ( simulation, team, arraysIdsTemplate, 0, [], function(resultsDataProductionLine , error){
                if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message })}
                    var data        = []
                for (let i = 0; i < resultsActivatedTemplate.length; i++) {
                    var idTemplate           = resultsActivatedTemplate[i].get("templateSDMPtr").id
                    var idPhase              = resultsActivatedTemplate[i].get("templateSDMPtr").get("phases")
                    var newObject            = {} 
                    var arrayPhases          = []
                   var dataProdcutionLine = _.filter(resultsDataProductionLine, function (obj){
                        return obj.get("templateSDMPtr").id == idTemplate
                    })

                    for (let j = 0; j < idPhase.length; j++) {
                            
                        let arrayEmployesTempo   = []
                        let arrayFixedAssetTempo = []

                        var dataPhase = _.filter(dataProdcutionLine, function (obj){
                            return obj.get("phaseSDMPtr").id == idPhase[j]
                        })

                        for (let x = 0; x < dataPhase.length; x++) {
                            
                            if(dataPhase[x].get("type") == "EMPLOYEE"){
                                arrayEmployesTempo.push(dataPhase[x])
                            }
                            if(dataPhase[x].get("type") == "FIXED_ASSET"){
                                arrayFixedAssetTempo.push(dataPhase[x])
                            }
                        }
                        let obj = {
                                'phaseName': dataPhase[0].get("phaseSDMPtr").get("name"),
                                'objectId' : idPhase[j],
                                'fixedAssets' : arrayFixedAssetTempo,
                                'employees': arrayEmployesTempo
                        }

                        arrayPhases.push(obj)
                    }

                    newObject = {
                        'productionLine' : resultsActivatedTemplate[i],
                        'productionLineName' : resultsActivatedTemplate[i].get("name"),
                        'templateName' : resultsActivatedTemplate[i].get("templateSDMPtr").get("name"),
                        'templateActive' : resultsActivatedTemplate[i].get("active"),
                        'objectId' : idTemplate,
                        'objectiIdTemplateActivated' : resultsActivatedTemplate[i].id,
                        'phases' :arrayPhases
                    }

                    data.push(newObject)
                }

                resolve({ type: "CONSULTA", data: data, error: null })
            })
        })
    })
}

exports.AsyncGetAllTDProductionLineTemplateActivated = async (simulationPtr, teamPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("TDActivatedProductionLine")
    var query = new Parse.Query(Table)

        query.equalTo("simulationPtr",simulationPtr)
        query.equalTo("teamPtr",teamPtr)
        query.equalTo("exists",true)
        //query.equalTo("active", true)
        query.include("templateSDMPtr")
        query.limit(1000)
        query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetAllTDProductionLineTemplateActivated(simulationPtr, teamPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetAllDataTDProdcutionLineTemplate = async (simulationPtr, teamPtr, arraysIdsTemplate, index, dataArray, callback) => {
    var Table = Parse.Object.extend("TDProductionLine")
    var query = new Parse.Query(Table)

    query.containedIn("templateSDMPtr",arraysIdsTemplate)
    query.equalTo("simulationPtr",simulationPtr)
    query.equalTo("teamPtr",teamPtr)
    query.equalTo("exists",true)
    //query.equalTo("active", true)
    query.include("templateSDMPtr")
    query.include("phaseSDMPtr")
    query.include("fixedAssetTDMSprt.fixedAssetPtr")
    query.include("employeeTDMSprt.salaryTabulatorPtr")
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetAllDataTDProdcutionLineTemplate (simulationPtr, teamPtr, arraysIdsTemplate, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.ArchiveDataPhase = function (data, simulationPtr, teamPtr) {
    var Simulations         = Parse.Object.extend("Simulations")
    var simulation          = new Simulations()
        simulation.id       = simulationPtr
    
    var SimulationsTeams    = Parse.Object.extend("SimulationsTeams")
    var team                = new SimulationsTeams()
        team.id             = teamPtr
    return new Promise(function(resolve,reject) {
        exports.AsyncSearchTDDataProdcutionLine(data["objectId"], data["type"], simulation, team, 0, [], function (result, error) {
            if (error) { return resolve({ type: "ARCHIVAR", data: null, error: error.message })}
            if (data["seActiva"] == "true") {
                result.set("active", true)
            } else {
                result.set("active", false)
            }

            result.save().then((resultSave) => {
                resolve({ type: "ARCHIVAR", data: resultSave, error: null })
            }, (error) => {
                resolve({ type: "ARCHIVAR", data: null, error: error.message })
            })
        })
    })
}

exports.AsyncSearchTDDataProdcutionLine = async (objectId, type, simulationPtr, teamPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("TDProductionLine")
    var query = new Parse.Query(Table)

        query.equalTo("type",type)
        query.equalTo("objectId",objectId)
        query.equalTo("simulationPtr",simulationPtr)
        query.equalTo("teamPtr",teamPtr)
        query.equalTo("exists",true)
        //query.equalTo("active",true)
    
    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.ArchiveTemplateActivated = function(data, simulationPtr, teamPtr) {
    var Simulations         = Parse.Object.extend("Simulations")
    var simulation          = new Simulations()
        simulation.id       = simulationPtr
    
    var SimulationsTeams    = Parse.Object.extend("SimulationsTeams")
    var team                = new SimulationsTeams()
        team.id             = teamPtr   
    return new Promise(function(resolve,reject) {
        exports.AsyncSearchTDActivatedProdcutionLine(data["objectId"], simulation, team, function (result, error) {
            if(error) { return resolve({ type: "CONSULTA", data: null, error: error.message })}
            var Template    = Parse.Object.extend("SDMProductionLineTemplates")
            var template                = new Template()
                template.id             = data["templateId"]
            exports.AsyncGetAllTDProdcutionLineTemplate (simulation, team, template, 0, [], function(resultsDataProductionLineTemplate, error){
                if (error) { return resolve({ type: "ARCHIVAR", data: null, error: error.message })}

                if (resultsDataProductionLineTemplate.length < 0) {
                    if (data["seActiva"] == "true") {
                        result.set("active", true)
                    } else {
                        result.set("active", false)
                    }
    
                    result.save().then((resultSave) => {
                        resolve({ type: "ARCHIVAR", data: resultSave, error: null })
                    }, (error) => {
                        resolve({ type: "ARCHIVAR", data: null, error: error.message })
                    })
                }else{
                    resolve({ type: "ARCHIVAR", data: null, error: "Sorry, it could not be deactivated because you have fixed assets or active employees" })
                }
                
            })
        })
    })
}

exports.AsyncSearchTDActivatedProdcutionLine = async (objectId, simulationPtr, teamPtr, callback) => {
    var Table = Parse.Object.extend("TDActivatedProductionLine")
    var query = new Parse.Query(Table)

        query.equalTo("objectId",objectId)
        query.equalTo("simulationPtr",simulationPtr)
        query.equalTo("teamPtr",teamPtr)
        query.equalTo("exists",true)
        //query.equalTo("active",true)
    
    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetAllTDProdcutionLineTemplate = async (simulationPtr, teamPtr, templatePtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("TDProductionLine")
    var query = new Parse.Query(Table)

    query.equalTo("templateSDMPtr",templatePtr)
    query.equalTo("simulationPtr",simulationPtr)
    query.equalTo("teamPtr",teamPtr)
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
            exports.AsyncGetAllTDProdcutionLineTemplate (simulationPtr, teamPtr, templatePtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.GetAllEventsToProcess = function ( simulationPtr, teamPtr) {
    var Simulations         = Parse.Object.extend("Simulations")
    var simulation          = new Simulations()
        simulation.id       = simulationPtr
    
    var SimulationsTeams    = Parse.Object.extend("SimulationsTeams")
    var team                = new SimulationsTeams()
        team.id             = teamPtr  
    return new Promise(function (resolve, reject) {
        exports.AsyncGetAllEventsToProcess(simulation, 0, [], function (results, error) {
            if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message })}
            resolve({ type: "CONSULTA", data: results, error: null})
        })
    })
}

exports.AsyncGetAllEventsToProcess = async (simulationPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("SimulationsEvents")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr",simulationPtr)
    query.equalTo("exists",true)
    query.equalTo("active",true)
    query.addAscending("triggerTime")
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetAllEventsToProcess (simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.GetAllDataSimulationsLogs = function ( simulationPtr, teamPtr ) {
    var Simulations         = Parse.Object.extend("Simulations")
    var simulation          = new Simulations()
        simulation.id       = simulationPtr
    
    var SimulationsTeams    = Parse.Object.extend("SimulationsTeams")
    var team                = new SimulationsTeams()
        team.id             = teamPtr 
    return new Promise(function (resolve, reject) {
        exports.AsyncGetAllDataSimulationsLogs( simulation, 0, [], function(resultsLogs, error){
            if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message })}
            //resolve({ type: "CONSULTA", data: resultsLogs, error: null})
            exports.AsyncGetAllDataTeamSimulationsLogs( simulation,team, 0, [], function(resultsTeamLogs, error){
                if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message })}
                resolve({ type: "CONSULTA", data: resultsLogs, dataTeamLogs:resultsTeamLogs, error: null})
            })
        })
    })
}

exports.AsyncGetAllDataSimulationsLogs = async ( simulationPtr, index, dataArray, callback ) => {
    var Table = Parse.Object.extend("SimulationsLogs")
    var query = new Parse.Query(Table)

        query.equalTo("simulationPtr",simulationPtr)
        query.doesNotExist("teamPtr");
        query.doesNotExist("userPtr");
        query.equalTo("active",true)
        query.equalTo("exists",true)
        query.addDescending("createdAt")
        query.limit(1000)
        query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetAllDataSimulationsLogs (simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null,error)
    }
}

exports.AsyncGetAllDataTeamSimulationsLogs = async ( simulationPtr, teamPtr, index, dataArray, callback ) => {
    var Table = Parse.Object.extend("SimulationsLogs")
    var query = new Parse.Query(Table)

        query.equalTo("simulationPtr",simulationPtr)
        query.exists("teamPtr");
        query.equalTo("teamPtr",teamPtr)
        query.exists("userPtr");
        query.equalTo("active",true)
        query.equalTo("exists",true)
        query.include("userPtr");
        query.addDescending("createdAt")
        query.limit(1000)
        query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetAllDataTeamSimulationsLogs (simulationPtr, teamPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null,error)
    }
}

exports.GetCurrentMoneyTeam = function (simulationPtr, teamPtr) {
    return new Promise(function(resolve,reject) {
        exports.AsyncGetCurrenMoneyOfTeam(teamPtr,function( results, error){
            if(error) { return resolve({ type: "CONSULTA", data: null, error: error.message })}
            resolve({ type: "CONSULTA", data:results, error: null})
        })
    })
}

exports.AsyncGetCurrenMoneyOfTeam = async (teamPtr, callback) => {
    var Table = Parse.Object.extend("SimulationsTeams")
    var query = new Parse.Query(Table)

    query.equalTo("objectId",teamPtr)
    query.equalTo("exists",true)
    query.equalTo("active",true)

    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetSomeEmployeeTeam = async (simulationPtr, teamPtr, callback) => {
    var Table = Parse.Object.extend("TDMEmployees")
    var query = new Parse.Query(Table)

        query.equalTo("simulationPtr",simulationPtr)
        query.equalTo("teamPtr",teamPtr)

    try {
        var results = await query.count()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetAllSDMEmployees = async (simulationPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("SDMEmpleados")
    var query = new Parse.Query(Table)
        query.equalTo("simulationPtr",simulationPtr)
        query.equalTo("exists",true)
        query.equalTo("active", true)
        query.limit(1000)
        query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetAllSDMEmployees(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.GetAllProducFamily = function(simulationPtr, teamPtr){
    var Simulations         = Parse.Object.extend("Simulations")
    var simulation          = new Simulations()
        simulation.id       = simulationPtr

    var SimulationsTeams    = Parse.Object.extend("SimulationsTeams")
    var team                = new SimulationsTeams()
        team.id             = teamPtr
    return new Promise(function (resolve, reject) {
        exports.AsyncProductFamily(simulation, team, 0, [], function(results, error){
            if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message }) }
            exports.AsynOrderPurchasing(simulation, team, 0, [], function(resultsOrders,error){
                if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message }) }

                var numeroFolio = 1
                const unicos = _.uniq(resultsOrders, function (puchasing) {
                    return puchasing.get("folioNumber")
                })
                if (unicos.length!=0) {
                    var CurrentNumeroFolio = unicos.reduce(function(prev, current){
                        return prev.get("folioNumber") > current.get("folioNumber") ? prev : current 
                    })
                    numeroFolio=(CurrentNumeroFolio.get("folioNumber")+ 1)
                }

                resolve({ type: "CONSULTA", data: results, folioNumber: numeroFolio, error: null})
            })
        })
    })
}

exports.AsyncProductFamily = async (simulationPtr, teamPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("TDProductoFamilia")
    var query = new Parse.Query(Table)

        query.equalTo("simulationPtr",simulationPtr)
        query.equalTo("teamPtr",teamPtr)
        query.equalTo("exists",true)
        query.equalTo("active",true)
        query.exists("component")
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
            exports.AsyncProductFamily(simulationPtr, teamPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.GetSimulationRanking = function (simulationPtr, teamPtr){
    var Simulations         = Parse.Object.extend("Simulations")
    var simulation          = new Simulations()
        simulation.id       = simulationPtr

    var SimulationsTeams    = Parse.Object.extend("SimulationsTeams")
    var team                = new SimulationsTeams()
        team.id             = teamPtr
    return new Promise(function (resolve, reject) {
        exports.AsyncGetSimulationRanking(0, simulation, [], function(results, error){
            if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message }) }
            resolve({ type: "CONSULTA", data:results, error: null})
        })
    })
}

exports.AsyncGetSimulationRanking = async (index, simulationId, dataArray, callback) => {
    var Table = Parse.Object.extend("SimulationsTeams")
    var query = new Parse.Query(Table)

    /*var Simulations = Parse.Object.extend("Simulations")
    var pointerToSimulation = new Simulations()
    pointerToSimulation.id = simulationId*/

    query.equalTo("simulationPtr", simulationId)
    query.equalTo("exists", true)
    query.descending("teamOrdersAmount")
    query.addDescending("teamCurrentMoney")
    query.skip(index * 1000)
    query.limit(1000)

    try {
        const results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetSimulationRanking((index + 1), simulationId, dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}
exports.GetTeamActivityLog = function (simulationPtr, teamPtr){
    var Simulations         = Parse.Object.extend("Simulations")
    var simulation          = new Simulations()
        simulation.id       = simulationPtr
    
    var SimulationsTeams    = Parse.Object.extend("SimulationsTeams")
    var team                = new SimulationsTeams()
        team.id             = teamPtr
    return new Promise(function (resolve, reject) {
        exports.AsyncGetTeamActivityLog(simulation, team, 0, [], function(results, error){
            if(error) { return resolve( { type: "CONSULTA", data: null, error: error.message })}
            var menu = _.uniq(results, function(current){
                return current.get("optionSimulation")
            })
            
            var userTeamData = _.uniq(results, function(current){
                return current.get("userName")
            })
            
            resolve({ type: "CONSULTA", data:results, menuData:menu, userTeamData:userTeamData, error:null})
        })
    })
}

exports.AsyncGetTeamActivityLog = async (simulationPtr, teamPtr, index, dataArray, callback)=>{
    var Table = Parse.Object.extend("SimulationsLogs")
    var query = new Parse.Query(Table)

        query.equalTo("simulationPtr",simulationPtr)
        query.equalTo("teamPtr",teamPtr)
        query.exists("optionSimulation")
        query.equalTo("exists",true)
        query.equalTo("active",true)
        query.include("simulationPtr")
        query.include("teamPtr")
        query.include("userPtr")
        query.limit(1000)
        query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetTeamActivityLog(simulationPtr, teamPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

