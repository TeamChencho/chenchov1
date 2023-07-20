var path = require('path')
var fs = require('fs')
var _ = require('underscore')
var Promise = require('promise')
var request = require('request')
var CryptoJS = require("crypto-js")
var csvparser = require("csv-parser")
var moment = require("moment")
let CONSTANTS = require("../../../ConstantsProject")

const LIMIT_NUMBER_RESULTS = 1000

var log = console.log

let Seguridad = require(path.resolve(__dirname, '../../middlewares/utils/seguridad.util'))

//var FunctionsGeneral = require(path.join(__dirname, '../../functions/general.js'))
var Parse = require('parse/node')

const APP_ID = process.env.APP_ID
const MASTER_KEY = process.env.MASTER_KEY

Parse._initialize(APP_ID, "", MASTER_KEY)
Parse.serverURL = process.env.SERVER_URL

exports.GetAllSimulations = function (groups) {
    //log("Iniciando promesa")
    return new Promise(function (resolve, reject) {

        exports.AsyncGetAllSimulations(0, [], groups, function (results, error) {
            //log("Resultados " + results.length)
            if (!error) {
                resolve({ type: "CONSULTA", data: results, error: null })
            } else {
                resolve({ type: "CONSULTA", data: results, error: error.message })
            }

        })
    })
}

exports.AsyncGetAllSimulations = async (index, dataArray, groups, callback) => {
    var Grupos = Parse.Object.extend("Grupos")
    var innerquery = new Parse.Query(Grupos)
    innerquery.containedIn("objectId", groups)

    var Table = Parse.Object.extend("Simulations")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)
    query.descending("createdAt")
    query.skip(index * 1000)
    query.limit(1000)
    query.include("groupPtr")
    query.matchesQuery("groupPtr", innerquery);

    try {
        const results = await query.find()
        if (results.length <= 0) {
            //console.log("Finalizado")
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            //console.log("Avanzando")
            exports.AsyncGetAllSimulations((index + 1), dataArray, groups, callback)
        }
    } catch (error) {
        //throw new Error(error)
        callback(dataArray, error)
    }
}

exports.GetAllGroupsAdviser = function (adviser) {
    //log("Iniciando promesa")
    return new Promise(function (resolve, reject) {

        exports.AsyncGetAllGroupsAdviser(0, adviser, [], function (results, error) {
            //log("Resultados " + results.length)
            if (!error) {
                resolve({ type: "CONSULTA", data: results, error: null })
            } else {
                resolve({ type: "CONSULTA", data: results, error: error.message })
            }

        })
    })
}

exports.AsyncGetAllGroupsAdviser = async (index, adviser, dataArray, callback) => {
    var Table = Parse.Object.extend("GruposUsuarios")
    var query = new Parse.Query(Table)

    const Groups = Parse.Object.extend("Grupos")
    const innerQuery = new Parse.Query(Groups)
    innerQuery.equalTo("active", true)
    innerQuery.equalTo("exists", true)
    query.matchesQuery("grupoPtr", innerQuery);

    //log(adviser.id)
    query.equalTo("active", true)
    query.equalTo("exists", true)
    query.equalTo("usuarioPtr", adviser)
    query.descending("createdAt")
    query.skip(index * 1000)
    query.limit(1000)
    query.include("grupoPtr")

    try {
        const results = await query.find()
        if (results.length <= 0) {
            //console.log("Finaliza")
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            //console.log("Avanzando")
            exports.AsyncGetAllGroupsAdviser((index + 1), adviser, dataArray, callback)
        }
    } catch (error) {
        //throw new Error(error)
        callback(dataArray, error)
    }
}

exports.AddingSimulation = function (data) {
    return new Promise(function (resolve, reject) {
        log("Adding Simulation")
        const Table = Parse.Object.extend("Simulations")
        const object = new Table()

        if (data["simulationName"]) {
            object.set("simulationName", data["simulationName"])
        }

        if (data["group"]) {
            var Group = Parse.Object.extend("Grupos")
            var pointerToGroup = new Group()
            pointerToGroup.id = data["group"]
            object.set("groupPtr", pointerToGroup)
        }

        if (data["startDateHidden"]) {
            object.set("currentDate", Number(data["startDateHidden"]))
        }
        else if (data["startDateHidden"] == null || data["startDateHidden"] == undefined) {
            var date = moment();
            object.set("currentDate", Number(date.valueOf()))
        }


        object.set("initialAmount", data["amount"])
        object.set("salaryEmployees", data["salary"])
        object.set("qtyEmployees", data["employees"])
        object.set("qtyTurns", data["turns"])

        var impuestos = data["impuestos"]
        if(impuestos) {
            if (typeof(impuestos) === 'string') {
                impuestos = [impuestos]
            } 
        } else {
            impuestos = []
        }
        

        for(var i = 0; i < impuestos.length; i++) {
            if(impuestos[i] == "iva") {
                object.set("iva", true)
            }

            if(impuestos[i] == "isr") {
                object.set("isr", true)
            }

            if(impuestos[i] == "ieps") {
                object.set("ieps", true)
            }
        }

        if(data["depreciacion"]) {
            object.set("depreciacion", true)            
        }
         
        object.set("speedSimulation", 60)
        object.set("status", "PAUSED")
        object.set("active", true)
        object.set("exists", true)

        object.save().then((object) => {
            var simulation = object
            log("Simulation created successfully")
            exports.DataPipeEvents().then(function (results) {
                var pipeEvents = results.data
                log("After pipeEvents " + pipeEvents.length)
                var simulationPipeEventsArray = []
                for (var i = 0; i < pipeEvents.length; i++) {
                    const SimulationsEventPipe = Parse.Object.extend("SimulationsEventPipe")
                    const simulationPipeEvents = new SimulationsEventPipe()

                    simulationPipeEvents.set("simulationPtr", simulation);
                    simulationPipeEvents.set("event", pipeEvents[i].get("event"));
                    simulationPipeEvents.set("index", pipeEvents[i].get("index"));
                    simulationPipeEvents.set("active", true);
                    simulationPipeEvents.set("exists", true);

                    simulationPipeEventsArray.push(simulationPipeEvents)
                }

                Parse.Object.saveAll(simulationPipeEventsArray).then((list) => {
                    log("Event pipe created successfully " + list.length)

                    var simulationEvents = obtainArraySimulationEvents(simulation)

                    Parse.Object.saveAll(simulationEvents).then((list) => {
                        log("Events simulation created successfully")
                        //resolve({ type: "AGREGAR", data: simulation, error: null })
                        exports.GetAllInventoryRM().then(function (results) {
                            var inventoryRawMaterial = results.data
                            log("After inventory rm " + inventoryRawMaterial.length)
                            var simInventoryRawMaterial = []
                            for(var i = 0; i < inventoryRawMaterial.length; i++) {
                                const SimulationsInventoryRawMaterial = Parse.Object.extend("SDMMateriaPrimaInventario")
                                const simulationInventoryRawMaterial = new SimulationsInventoryRawMaterial()

                                simulationInventoryRawMaterial.set("simulationPtr", simulation);
                                simulationInventoryRawMaterial.set("materaPrimaPtr", inventoryRawMaterial[i].get("materaPrimaPtr"));
                                simulationInventoryRawMaterial.set("cantidad", inventoryRawMaterial[i].get("cantidad"));
                                simulationInventoryRawMaterial.set("referenciaId", inventoryRawMaterial[i].id);
                                simulationInventoryRawMaterial.set("active", true);
                                simulationInventoryRawMaterial.set("exists", true);

                                simInventoryRawMaterial.push(simulationInventoryRawMaterial)
                            }

                            Parse.Object.saveAll(simInventoryRawMaterial).then((rmilist) => {
                                log("Raw material inventory created successfully " + rmilist.length)
                                    
                                exports.GetAllProducts().then(function (results) {
                                    var productosFamilia = results.data
                                    log("After productos familia " + productosFamilia.length)
                                    var pfsimulacionArray = []
                                    for(var i = 0; i < productosFamilia.length; i++) {
                                        const SimulationsProductFamily = Parse.Object.extend("SDMProductoFamilia")
                                        const simulationProductsFamily = new SimulationsProductFamily()

                                        simulationProductsFamily.set("simulationPtr", simulation);
                                        simulationProductsFamily.set("nombre", productosFamilia[i].get("nombre"));
                                        simulationProductsFamily.set("codigo", productosFamilia[i].get("codigo"));
                                        simulationProductsFamily.set("imagen", productosFamilia[i].get("imagen"));
                                        simulationProductsFamily.set("component", productosFamilia[i].get("component"));
                                        simulationProductsFamily.set("videos", productosFamilia[i].get("videos"));
                                        simulationProductsFamily.set("referenciaId", productosFamilia[i].id);
                                        simulationProductsFamily.set("active", true);
                                        simulationProductsFamily.set("exists", true);

                                        pfsimulacionArray.push(simulationProductsFamily)
                                    }

                                    Parse.Object.saveAll(pfsimulacionArray).then((pflist) => {
                                        log("Products family created successfully " + pflist.length)

                                        exports.GetAllProviders().then(function (results) {
                                            var proveedores = results.data
                                            log("After proveedores" + proveedores.length)
                                            var proveedoresSimulacion = []

                                            for(var i = 0; i < proveedores.length; i++) {
                                                const SimulationsProviders = Parse.Object.extend("SDMProveedores")
                                                const simulationProviders = new SimulationsProviders()

                                                simulationProviders.set("simulationPtr", simulation);
                                                simulationProviders.set("nombre", proveedores[i].get("nombre"));
                                                simulationProviders.set("abreviatura", proveedores[i].get("abreviatura"));
                                                simulationProviders.set("cuentaBancaria", proveedores[i].get("cuentaBancaria"));
                                                simulationProviders.set("rsSocial", proveedores[i].get("rsSocial"));
                                                simulationProviders.set("paginaWeb", proveedores[i].get("paginaWeb"));
                                                simulationProviders.set("rfc", proveedores[i].get("rfc"));
                                                simulationProviders.set("telefono", proveedores[i].get("telefono"));
                                                simulationProviders.set("correoElectronico", proveedores[i].get("correoElectronico"));
                                                simulationProviders.set("diasCredito", proveedores[i].get("diasCredito"));
                                                simulationProviders.set("folio", proveedores[i].get("folio"));
                                                simulationProviders.set("referenciaId", proveedores[i].id);
                                                simulationProviders.set("active", true);
                                                simulationProviders.set("exists", true);

                                                proveedoresSimulacion.push(simulationProviders)
                                            }

                                            Parse.Object.saveAll(proveedoresSimulacion).then((pvlist) => {
                                                log("Providers created successfully " + pvlist.length)

                                                exports.GetAllProvidersRawMaterial().then(function (results) {
                                                    var providersRawMaterial = results.data
                                                    log("After proveedores materia prima" + providersRawMaterial.length)
                                                    var simulacionProviderRawMaterialArray = []

                                                    for(var i = 0; i < providersRawMaterial.length; i++) {
                                                        const SimulationsProvidersRawMaterial = Parse.Object.extend("SDMProveedoresMP")
                                                        const simulationProvidersRawMaterial = new SimulationsProvidersRawMaterial()

                                                        var proveedorRM = _.find(pvlist, function(obj) { 
                                                            return obj.get("referenciaId") == providersRawMaterial[i].get("proveedorPtr").id
                                                        });
                                                        simulationProvidersRawMaterial.set("proveedorPtr", proveedorRM);
                                                        simulationProvidersRawMaterial.set("simulationPtr", simulation);
                                                        simulationProvidersRawMaterial.set("materiaPrimaPtr", providersRawMaterial[i].get("materiaPrimaPtr"));
                                                        simulationProvidersRawMaterial.set("cantidadMinima", providersRawMaterial[i].get("cantidadMinima"));
                                                        simulationProvidersRawMaterial.set("costo", providersRawMaterial[i].get("costo"));
                                                        simulationProvidersRawMaterial.set("active", true);
                                                        simulationProvidersRawMaterial.set("exists", true);

                                                        simulacionProviderRawMaterialArray.push(simulationProvidersRawMaterial)
                                                    }

                                                    Parse.Object.saveAll(simulacionProviderRawMaterialArray).then((pvrmlist) => {
                                                        log("Providers raw material created successfully " + pvrmlist.length)
                                                        
                                                        exports.GetAllTransport().then(function (results) {
                                                            var transporte = results.data
                                                            log("After transporte" + transporte.length)
                                                            var simulacionTransporteArray = []
                                                            
                                                            for(var i = 0; i < transporte.length; i++) {
                                                                const SimulationsTransport = Parse.Object.extend("SDMTransporte")
                                                                const simulationTransport = new SimulationsTransport()

                                                                var proveedorRM = _.find(pvlist, function(obj) { return obj.get("referenciaId") == transporte[i].get("proveedorPtr").id });
                                                                simulationTransport.set("proveedorPtr", proveedorRM);
                                                                simulationTransport.set("simulationPtr", simulation);

                                                                simulationTransport.set("paisPtr", transporte[i].get("paisPtr"));
                                                                simulationTransport.set("productoPtr", transporte[i].get("productoPtr"));
                                                                simulationTransport.set("diasEntrega", transporte[i].get("diasEntrega"));
                                                                simulationTransport.set("cantidadMax", transporte[i].get("cantidadMax"));
                                                                simulationTransport.set("cantidadMin", transporte[i].get("cantidadMin"));
                                                                simulationTransport.set("lugarSalida", transporte[i].get("lugarSalida"));
                                                                simulationTransport.set("lugarDestino", transporte[i].get("lugarDestino"));
                                                                simulationTransport.set("tipoEnvio", transporte[i].get("tipoEnvio"));
                                                                simulationTransport.set("urgente", transporte[i].get("urgente"));
                                                                simulationTransport.set("precio", transporte[i].get("precio"));
                                                                simulationTransport.set("porcentajePrecio", transporte[i].get("porcentajePrecio"));

                                                                simulationTransport.set("active", true);
                                                                simulationTransport.set("exists", true);

                                                                simulacionTransporteArray.push(simulationTransport)
                                                            }

                                                            Parse.Object.saveAll(simulacionTransporteArray).then((transportlist) => {
                                                                log("Transport created successfully " + transportlist.length)
                                                                //resolve({ type: "AGREGAR", data: null, error: null })
                                                                continueSDMDatabase(simulation, function(error) {
                                                                    log("enter here to resolve")
                                                                    if(error) {
                                                                        resolve({ type: "AGREGAR", data: null, error: error.message })
                                                                    } else {
                                                                        resolve({ type: "AGREGAR", data: simulation, error: error })
                                                                    }
                                                                })
                                                            }, (error) => {
                                                                resolve({ type: "AGREGAR", data: null, error: error.message })
                                                            })
                                                        }, (error) => {
                                                            resolve({ type: "AGREGAR", data: null, error: error.message })
                                                        })
                                                    }, (error) => {
                                                      resolve({ type: "AGREGAR", data: null, error: error.message })
                                                    })
                                                })
                                            }, (error) => {
                                                resolve({ type: "AGREGAR", data: null, error: error.message })
                                            })
                                        })
                                    }, (error) => {
                                        resolve({ type: "AGREGAR", data: null, error: error.message })
                                    })
                                })
                            }, (error) => {
                                resolve({ type: "AGREGAR", data: null, error: error.message })
                            })
                        })
                    }, (error) => {
                        log(error.message)
                        resolve({ type: "AGREGAR", data: null, error: error.message })
                    })
                }, (error) => {
                    log(error.message)
                    resolve({ type: "AGREGAR", data: null, error: error.message })
                });
            })
        }, (error) => {
            resolve({ type: "AGREGAR", data: null, error: error.message })
        })
    })
}

function obtainArraySimulationEvents(simulation) {
    var eventsSimulationArray = []

    var nextTimeEvent = null

    var SimulationsEvents = Parse.Object.extend("SimulationsEvents");
    var event = new SimulationsEvents();
    event.set("simulationPtr", simulation);
    event.set("event", CONSTANTS.HOUR_CHANGE);
    event.set("index", 1);
    event.set("active", true);
    event.set("exists", true);
    nextTimeEvent = moment()
    nextTimeEvent = nextTimeEvent.add(-5,'seconds')
    event.set("triggerTime", nextTimeEvent.valueOf());

    eventsSimulationArray.push(event)

    event = new SimulationsEvents();
    event.set("simulationPtr", simulation);
    event.set("event", CONSTANTS.ORDER_CREATION);
    event.set("index", 2);
    event.set("active", true);
    event.set("exists", true);
    nextTimeEvent = moment()
    nextTimeEvent = nextTimeEvent.add(-5,'seconds')
    event.set("triggerTime", nextTimeEvent.valueOf());

    eventsSimulationArray.push(event)

    event = new SimulationsEvents();
    event.set("simulationPtr", simulation);
    event.set("event", CONSTANTS.SALARIES_WORKERS);
    event.set("index", 3);
    event.set("active", true);
    event.set("exists", true);
    nextTimeEvent = moment().add(simulation.get("speedSimulation")*24*15,'minutes')
    nextTimeEvent = nextTimeEvent.add(-5,'seconds')
    event.set("triggerTime", moment().valueOf());

    eventsSimulationArray.push(event)

    event = new SimulationsEvents();
    event.set("simulationPtr", simulation);
    event.set("event", CONSTANTS.ORDER_STATUS_UPDATE);
    event.set("index", 18);
    event.set("active", true);
    event.set("exists", true);
    nextTimeEvent = moment().add(simulation.get("speedSimulation")*24,'minutes')
    nextTimeEvent = nextTimeEvent.add(-5,'seconds')
    event.set("triggerTime", nextTimeEvent.valueOf());

    eventsSimulationArray.push(event)
    
    return eventsSimulationArray
}

function continueSDMDatabase(simulation, callback) {
    exports.GetAllFixedAssets().then(function (results) {
        var activosFijos = results.data
        log("After FixedAsssets" + activosFijos.length)
        var simulacionActivosFijosArray = []

        for(var i = 0; i < activosFijos.length; i++) {
            const SimulationsFixedAssets = Parse.Object.extend("SDMActivosFijos")
            const simulationFixedAsset = new SimulationsFixedAssets()

            simulationFixedAsset.set("simulationPtr", simulation);
            simulationFixedAsset.set("fechaAdquisicion", activosFijos[i].get("fechaAdquisicion"));
            simulationFixedAsset.set("numeroSerie", activosFijos[i].get("numeroSerie"));
            simulationFixedAsset.set("costo", activosFijos[i].get("costo"));
            simulationFixedAsset.set("departamento", activosFijos[i].get("departamento"));
            simulationFixedAsset.set("modelo", activosFijos[i].get("modelo"));
            simulationFixedAsset.set("precioVenta", activosFijos[i].get("precioVenta"));
            simulationFixedAsset.set("nombre", activosFijos[i].get("nombre"));
            simulationFixedAsset.set("tiempoVida", activosFijos[i].get("tiempoVida"));
            simulationFixedAsset.set("descripcion", activosFijos[i].get("descripcion"));
            simulationFixedAsset.set("cantidadMininma", activosFijos[i].get("cantidadMininma"));
            simulationFixedAsset.set("precioCosto", activosFijos[i].get("precioCosto"));
            simulationFixedAsset.set("marca", activosFijos[i].get("marca"));
            simulationFixedAsset.set("tarifaDepreciacion", activosFijos[i].get("tarifaDepreciacion"));
            simulationFixedAsset.set("referenciaId", activosFijos[i].id);

            simulationFixedAsset.set("active", true);
            simulationFixedAsset.set("exists", true);

            simulacionActivosFijosArray.push(simulationFixedAsset)
        }

        Parse.Object.saveAll(simulacionActivosFijosArray).then((falist) => {
            log("Fixed assets created successfully " + falist.length)

            exports.GetAllFixedAssetsInventory().then(function (results) {
                var activosFijosInventario = results.data
                log("After FixedAsssetsInventory" + activosFijosInventario.length)
                var simulacionActivosFijosInventarioArray = []
        
                for(var i = 0; i < activosFijosInventario.length; i++) {
                    const SimulationsFixedAssetsInventory = Parse.Object.extend("SDMActivosFijosInventario")
                    const simulationFixedAssetInventory = new SimulationsFixedAssetsInventory()
        
                    simulationFixedAssetInventory.set("simulationPtr", simulation);

                    var afijo = _.find(falist, function(obj) { return obj.get("referenciaId") == activosFijosInventario[i].get("activoFijoPtr").id });
                    simulationFixedAssetInventory.set("activoFijoPtr", afijo);
                    simulationFixedAssetInventory.set("cantidad", activosFijosInventario[i].get("cantidad"));
                    
                    simulationFixedAssetInventory.set("active", true);
                    simulationFixedAssetInventory.set("exists", true);
        
                    simulacionActivosFijosInventarioArray.push(simulationFixedAssetInventory)
                }
        
                Parse.Object.saveAll(simulacionActivosFijosInventarioArray).then((fixedassetslistinventory) => {
                    log("Fixed assets inventory created successfully " + fixedassetslistinventory.length)

                    exports.GetAllClients().then(function (results) {
                        var clientes = results.data
                        log("After Clients " + clientes.length)
                        var simulacionClientesArray = []

                        for(var i = 0; i < clientes.length; i++) {
                            const SimulationsClients = Parse.Object.extend("SDMClientes")
                            const simulationClient = new SimulationsClients()
                
                            simulationClient.set("simulationPtr", simulation);
                            simulationClient.set("codigoPostal", clientes[i].get("codigoPostal"));
                            simulationClient.set("tipoCliente", clientes[i].get("tipoCliente"));
                            simulationClient.set("estado", clientes[i].get("estado"));
                            simulationClient.set("calle", clientes[i].get("calle"));
                            simulationClient.set("nombre", clientes[i].get("nombre"));
                            simulationClient.set("suburbio", clientes[i].get("suburbio"));
                            simulationClient.set("apellidoMaterno", clientes[i].get("apellidoMaterno"));
                            simulationClient.set("apellidoPaterno", clientes[i].get("apellidoPaterno"));
                            simulationClient.set("telefono", clientes[i].get("telefono"));
                            simulationClient.set("ciudad", clientes[i].get("ciudad"));
                            simulationClient.set("numero", clientes[i].get("numero"));
                            simulationClient.set("creditoMonetario", clientes[i].get("creditoMonetario"));
                            simulationClient.set("email", clientes[i].get("email"));
                            
                            simulationClient.set("active", true);
                            simulationClient.set("exists", true);
                
                            simulacionClientesArray.push(simulationClient)  
                        }

                        Parse.Object.saveAll(simulacionClientesArray).then((clientslist) => {
                            log("Clients created successfully " + clientslist.length)

                            exports.GetAllEmployees().then(function (results) {
                                var empleados = results.data
                                log("After Employees " + empleados.length)
                                var simulacionEmpleadosArray = []
        
                                for(var i = 0; i < empleados.length; i++) {
                                    const SimulationsEmployees = Parse.Object.extend("SDMEmpleados")
                                    const simulationEmployee = new SimulationsEmployees()
                        
                                    simulationEmployee.set("simulationPtr", simulation);
                                    simulationEmployee.set("diaInicio", empleados[i].get("diaInicio"));
                                    simulationEmployee.set("imss", empleados[i].get("imss"));
                                    simulationEmployee.set("estado", empleados[i].get("estado"));
                                    simulationEmployee.set("idEmpleado", empleados[i].get("idEmpleado"));
                                    simulationEmployee.set("calle", empleados[i].get("calle"));
                                    simulationEmployee.set("trabajo", empleados[i].get("trabajo"));
                                    simulationEmployee.set("sexo", empleados[i].get("sexo"));
                                    simulationEmployee.set("nombre", empleados[i].get("nombre"));
                                    simulationEmployee.set("salarioHora", empleados[i].get("salarioHora"));
                                    simulationEmployee.set("suburbio", empleados[i].get("suburbio"));
                                    simulationEmployee.set("estadoCivil", empleados[i].get("estadoCivil"));
                                    simulationEmployee.set("rfc", empleados[i].get("rfc"));
                                    simulationEmployee.set("curp", empleados[i].get("curp"));
                                    simulationEmployee.set("apellidoPaterno", empleados[i].get("apellidoPaterno"));
                                    simulationEmployee.set("telefono", empleados[i].get("telefono"));
                                    simulationEmployee.set("fechaNacimiento", empleados[i].get("fechaNacimiento"));
                                    simulationEmployee.set("ciudad", empleados[i].get("ciudad"));
                                    simulationEmployee.set("numero", empleados[i].get("numero"));
                                    simulationEmployee.set("giro", empleados[i].get("giro"));
                                    simulationEmployee.set("apellidoMaterno", empleados[i].get("apellidoMaterno"));
                                    simulationEmployee.set("email", empleados[i].get("email"));
                                    simulationEmployee.set("DMsalaryTabulatorPtr", empleados[i].get("DMsalaryTabulatorPtr"));
                                    
                                    simulationEmployee.set("active", true);
                                    simulationEmployee.set("exists", true);
                        
                                    simulacionEmpleadosArray.push(simulationEmployee)  
                                }
        
                                Parse.Object.saveAll(simulacionEmpleadosArray).then((elist) => {
                                    log("Employees created successfully " + elist.length)
        
                                    exports.GetAllExpenses().then(function (results) {
                                        var gastos = results.data
                                        log("After Expenses " + gastos.length)
                                        var simulacionGastosArray = []
                
                                        for(var i = 0; i < gastos.length; i++) {
                                            const SimulationsExpenses = Parse.Object.extend("SDMGastos")
                                            const simulationExpense = new SimulationsExpenses()
                                
                                            simulationExpense.set("simulationPtr", simulation);
                                            simulationExpense.set("porcentaje", gastos[i].get("porcentaje"));
                                            simulationExpense.set("cuenta", gastos[i].get("cuenta"));
                                            simulationExpense.set("periodo", gastos[i].get("periodo"));
                                            simulationExpense.set("tipo", gastos[i].get("tipo"));
                                            simulationExpense.set("importar", gastos[i].get("importar"));
                                            
                                            simulationExpense.set("active", true);
                                            simulationExpense.set("exists", true);
                                
                                            simulacionGastosArray.push(simulationExpense)  
                                        }
                
                                        Parse.Object.saveAll(simulacionGastosArray).then((exlist) => {
                                            log("Expenses created successfully " + exlist.length)
                                            
                                            var simulationSalaryTabulatorArray = []
                                            exports.GetAllSalaryTabulator().then(function (salaryTabulator) {
                                                var  resultsSalaryTabulator = salaryTabulator.data
                                                log("After Salary tabulator " + resultsSalaryTabulator.length)
                                                for(var i = 0; i <resultsSalaryTabulator.length; i++){
                                                    const SimulationSalaryTabulator = Parse.Object.extend("SDMSalaryTabulator")
                                                    const simulationSalaryTabulator = new SimulationSalaryTabulator()
                                                    simulationSalaryTabulator.set("referenciaId",resultsSalaryTabulator[i].id)
                                                    simulationSalaryTabulator.set("simulationPtr", simulation);
                                                    simulationSalaryTabulator.set("area",resultsSalaryTabulator[i].get("area"))
                                                    simulationSalaryTabulator.set("department",resultsSalaryTabulator[i].get("department"))
                                                    simulationSalaryTabulator.set("salary",resultsSalaryTabulator[i].get("salary"))
                                                    simulationSalaryTabulator.set("exists",true)
                                                    simulationSalaryTabulator.set("active",true)
                                                    simulationSalaryTabulatorArray.push(simulationSalaryTabulator)
                                                }
                                                Parse.Object.saveAll(simulationSalaryTabulatorArray).then((listSalary)=>{
                                                    log("Salary tabulator created successfully " + listSalary.length)

                                                    exports.GetAllDMProductionTemplatePhases().then(function (resultsPahses) {
                                                          
                                                        var dataDMPhases = resultsPahses.dataDMPhases
                                                        log("After prodcution line phases " + dataDMPhases.length)
                                                        var dataDMSalaryTabulator = resultsPahses.dataDMSalaryTabulator
                                                        var dataSDMFixedAsset = simulacionActivosFijosArray
                                                        var dataSDMTabulator = simulationSalaryTabulatorArray
                                                        var arrayObjects = []
                                                        
                                                            //recorrer fase por fase
                                                        for (let i = 0; i <dataDMPhases.length; i++){
                                    
                                                            //activos fijos
                                                            var arregloTempoFA = dataDMPhases[i].get("fixedAssetDMPtr")
                                                            var jsonFixedAsset = {}
                                                            var jsonEmployees = {}
                                    
                                                            for (const key in arregloTempoFA) {
                                                                var foundDMFixedAsset = _.find(dataSDMFixedAsset, function (obj){
                                                                    return obj.get("referenciaId")== key
                                                                })
                                                                jsonFixedAsset[foundDMFixedAsset.id] = Number(arregloTempoFA[key])
                                                            }   
                                    
                                                            //tabulador de salario
                                                            var arregloTabulator = dataDMPhases[i].get("quantityEmployees")
                                                            for (const key in arregloTabulator) {
                                                                let employee = _.find(dataDMSalaryTabulator,function(obj){
                                                                    return obj.id == key
                                                                })
                                                                let employeeSDM = _.find(dataSDMTabulator,function(obj){
                                                                    return obj.get("department") == employee.get("department")
                                                                })
                                                                jsonEmployees[employeeSDM.id] = Number(arregloTabulator[key])
                                                            }
                                    
                                                            var Table = Parse.Object.extend("SDMProductionLinePhases")
                                                            var simulationProductionLinePhase = new Table()
                                    
                                                            simulationProductionLinePhase.set("name",dataDMPhases[i].get("name"))
                                                            simulationProductionLinePhase.set("fixedAssetSDMPtr",jsonFixedAsset)
                                                            simulationProductionLinePhase.set("quantityEmployees",jsonEmployees)
                                                            simulationProductionLinePhase.set("hoursFinishPhase",Number(dataDMPhases[i].get("hoursFinishPhase")))
                                                            simulationProductionLinePhase.set("simulationPtr", simulation)
                                                            simulationProductionLinePhase.set("referenceId",dataDMPhases[i].id )
                                                            simulationProductionLinePhase.set("description",dataDMPhases[i].get("description"))
                                                            simulationProductionLinePhase.set("exists",true)
                                                            simulationProductionLinePhase.set("active",true)
                                    
                                                            arrayObjects.push(simulationProductionLinePhase)
                                    
                                                        }
                                    
                                                        Parse.Object.saveAll(arrayObjects).then((SimualtioProductLinePhases) => {
                                                            log("Prodcution line phases created successfully " + SimualtioProductLinePhases.length)
                                                            exports.GetAllProdcutionLineTemplates(simulation).then(function (resultsTemplate,error) {
                                                                //log(resultsTemplate)
                                                                var dataTemplates = resultsTemplate.dataTemplates
                                                                log("After prodcution line templates " + dataTemplates.length)
                                                                var dataProductFamily = resultsTemplate.dataSDMProdcuFamily
                                                                var arrayObjectsTemplates = []
                                                                
                                                                for (let i = 0; i < dataTemplates.length; i++) {
                                                                    var productFamilyDMPtr = dataTemplates[i].get("productFamilyDMPtr")
                                                                    var arrayPhasesDM = dataTemplates[i].get("phases") 
                                                                    var QuantityFixedAsset = []
                                    
                                                                    var productPtr = _.find(dataProductFamily,function (obj){
                                                                        return obj.get("referenciaId") == productFamilyDMPtr.id
                                                                    })
                                    
                                                                    var newArrayPhases = []
                                                                    for (let j = 0; j < arrayPhasesDM.length; j++) {
                                                                            var phase = _.find(arrayObjects,function(obj){
                                                                                return obj.get("referenceId") == arrayPhasesDM[j]
                                                                            })
                                                                            newArrayPhases.push(phase.id)
                                                                    }

                                                                    var arrayquantyTemplateFixedAsset = dataTemplates[i].get("quantityFixedAssets")

                                                                    for (let x = 0; x < arrayquantyTemplateFixedAsset.length; x++) {
                                                                        var quantyTemplateFixedAsset = arrayquantyTemplateFixedAsset[x]
                                                                        var jsonNewQuantityFixedAssets = {}

                                                                        for (const key in quantyTemplateFixedAsset) {
                                                                            var FixedAsset = _.find(simulacionActivosFijosArray,function(obj){
                                                                                return obj.get("referenciaId")  == key
                                                                            })
                                                                            jsonNewQuantityFixedAssets[FixedAsset.id] = quantyTemplateFixedAsset[key]
                                                                        }
                                                                        QuantityFixedAsset.push(jsonNewQuantityFixedAssets)
                                                                    }
                                    
                                                                    var Table = Parse.Object.extend("SDMProductionLineTemplates")
                                                                    var simulationProductionLineTemplate = new Table()
                                                            
                                                                    simulationProductionLineTemplate.set("name",dataTemplates[i].get("name"))
                                                                    simulationProductionLineTemplate.set("productFamilySDMPtr",productPtr)
                                                                    simulationProductionLineTemplate.set("phases",newArrayPhases)
                                                                    simulationProductionLineTemplate.set("hoursFinalProduct",Number(dataTemplates[i].get("hoursFinalProduct")))
                                                                    simulationProductionLineTemplate.set("hoursPhases",dataTemplates[i].get("hoursPhases") )
                                                                    simulationProductionLineTemplate.set("quantityFixedAssets",QuantityFixedAsset)
                                                                    simulationProductionLineTemplate.set("simulationPtr", simulation)
                                                                    simulationProductionLineTemplate.set("referenceId",dataTemplates[i].id )
                                                                    simulationProductionLineTemplate.set("exists",true)
                                                                    simulationProductionLineTemplate.set("active",true)
                                    
                                                                    arrayObjectsTemplates.push(simulationProductionLineTemplate)
                                                                }
                                                                Parse.Object.saveAll(arrayObjectsTemplates).then((SimualtioProductLineTemplates) => {
                                                                    log("Prodcution line templates created successfully " + SimualtioProductLineTemplates.length)

                                                                    exports.getAllSMDSalaryTabulatorAndSMDEmployees(simulation).then(function (results) {
                                                                        log("After upadte employees" + results.dataSDMEmployees.length)
                                                                        var SDMSalaryTabulator = results.dataSDMTabulator
                                                                        var SDMEmployees = results.dataSDMEmployees
                                                                        var arrayEmployeesToSave = []

                                                                        SDMEmployees.forEach(element => {
                                                                            var DMSalaryTabulatorPtr = element.get("DMsalaryTabulatorPtr").id
                                                                            var found = _.filter(SDMSalaryTabulator, function(current){
                                                                                return current.get("referenciaId") == DMSalaryTabulatorPtr
                                                                            })
                                                                            if(found){
                                                                                element.set("SDMsalaryTabulatorPtr",found[0])
                                                                                arrayEmployeesToSave.push(element)
                                                                            }
                                                                        });
                                                                        Parse.Object.saveAll(arrayEmployeesToSave).then((resultEployeesUpadate)=>{
                                                                            log("Employees upadate successfully " + resultEployeesUpadate.length)
                                                                            log("Finish")
                                                                            callback(null)
                                                                        }, (error)=>{
                                                                            callback(error)
                                                                        })
                                                                        
                                                                    })
                                                                    
                                                                }, (error)=>{
                                                                    callback(error)
                                                                })
                                                                
                                                            })
                                                        }, (error)=>{
                                                            callback(error)
                                                        })
                                            
                                                    })
                                                }, (error)=>{
                                                    callback(error)
                                                })

                                            })
                                        }, (error) => {
                                            callback(error)
                                        })
                                    })                                          
                                }, (error) => {
                                    callback(error)
                                })
                            })
                        }, (error) => {
                            callback(error)
                        })
                    })
                }, (error) => {
                    callback(error)
                })
            })
        }, (error) => {
            callback(error)
        })
    })
}

exports.DataPipeEvents = function () {
    return new Promise(function (resolve, reject) {
        exports.AsyncDataPipeEvents(function (grupos, error) {
            if (!error) {
                log("Pipe events " + grupos.length)
                resolve({ type: "CONSULTA", data: grupos, error: null })
            } else {
                resolve({ type: "CONSULTA", data: grupos, error: error.message })
            }
        })
    })
}

exports.AsyncDataPipeEvents = async (callback) => {
    var GruposUsuarios = Parse.Object.extend("DMEventPipe")
    var query = new Parse.Query(GruposUsuarios)

    query.equalTo("exists", true)
    try {
        const results = await query.find()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.ArchiveSimulation = function (objectId, seActiva) {
    return new Promise(function (resolve, reject) {
        exports.AsyncSearchSimulation(objectId, function (object, error) {
            if (!error) {
                if (object) {
                    if (seActiva === "true") {
                        object.set("active", true)
                    } else if (seActiva === "false") {
                        object.set("active", false)
                        object.set("status", "PAUSED")
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

exports.EraseSimulation = function (objectId) {
    return new Promise(function (resolve, reject) {
        exports.DeleteSimulation(objectId).then(function (results) {
            if (results.error) { return resolve({ type: "ELIMINAR", data: null, error: results.error }) }
            resolve({ type: "ELIMINAR", data: results.data, error: null })
        })
        /*exports.AsyncSearchSimulation(objectId, function (object, error) {
            if (!error) {
                if (object) {
                    object.set("status", "PAUSED")
                    object.set("active", false)
                    object.set("exists", false)

                    object.save()
                        .then((object) => {
                            resolve({ type: "ELIMINAR", data: object, error: null })
                        }, (error) => {
                            resolve({ type: "ELIMINAR", data: null, error: error.message })
                        })
                } else {
                    resolve({ type: "ELIMINAR", data: null, error: "User not found" })
                }
            } else {
                resolve({ type: "ELIMINAR", data: null, error: error.message })
            }
        })*/
    })
}

exports.SearchSimulation = function (objectId) {
    //console.log("object ID" + objectId)
    return new Promise(function (resolve, reject) {
        exports.AsyncSearchSimulation(objectId, function (object, error) {
            if (!error) {
                //console.log("ingreso al primer if en el metodo AsyncBuscarUsuarioAdministracion en BuscarUsuarioAdministracion en el usuarios_administracion.model")
                if (object) {
                    //console.log("ingreso al segundo if en el metodo AsyncBuscarUsuarioAdministracion en BuscarUsuarioAdministracion en el usuarios_administracion.model")
                    resolve({ type: "BÚSQUEDA", data: object, error: null })
                } else {
                    //console.log("ingreso al primer else en el metodo AsyncBuscarUsuarioAdministracion en BuscarUsuarioAdministracion en el usuarios_administracion.model")
                    resolve({ type: "BÚSQUEDA", data: null, error: "Simulation not found" })
                }
            } else {
                //console.log("ingreso al primer else en el metodo AsyncBuscarUsuarioAdministracion en BuscarUsuarioAdministracion en el usuarios_administracion.model")
                resolve({ type: "BÚSQUEDA", data: null, error: error.message })
            }
        })
    })
}

exports.AsyncSearchSimulation = async (objectId, callback) => {
    var Table = Parse.Object.extend("Simulations")
    var query = new Parse.Query(Table)
    query.equalTo("objectId", objectId)
    query.equalTo("exists", true)
    query.include("groupPtr")
    try {
        const results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
        //throw new Error(error)
    }
}

exports.UpdateSimulationSettings = function (objectId, data, userPtr) {
    log(data)
    return new Promise(function (resolve, reject) {
        exports.AsyncSearchSimulation(objectId, async function (object, error) {
            if (!error) {
                if (object) {
                    if (data["simulation_speed"]) {
                        object.set("speedSimulation", Number(data["simulation_speed"]))
                    }

                    if (data["simulation_status"]) {
                        //object.set("status", data["simulation_status"])
                        if(data["simulation_status"] == 'RUNNING'){
                            var json = { 'objectId' : objectId, 'sePausa' :  'true' }
                            await exports.PauseOrRunSimulation( json, userPtr)
                        }else{
                            var json = { 'objectId' : objectId, 'sePausa' :  'false' }
                            await exports.PauseOrRunSimulation( json, userPtr)
                        }
                        
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

exports.GetAllStudentsInGroup = function (groupId) {
    //log("Iniciando promesa")
    return new Promise(function (resolve, reject) {

        exports.AsyncGetAllStudentsInGroup(0, groupId, [], function (results, error) {
            //log("Resultados " + results.length)
            if (!error) {
                //log("Pre: " + results.length)
                results = _.filter(results, function (item) {
                    return item.get("usuarioPtr").get("permisoPtr").get("clave") === "ALUMNO" || item.get("usuarioPtr").get("permisoPtr").get("clave") === "MODERADOR"
                })
                //log("After: " + results.length)
                resolve({ type: "CONSULTA", data: results, error: null })
            } else {
                resolve({ type: "CONSULTA", data: results, error: error.message })
            }

        })
    })
}

exports.AsyncGetAllStudentsInGroup = async (index, groupId, dataArray, callback) => {
    var Table = Parse.Object.extend("GruposUsuarios")
    var query = new Parse.Query(Table)

    var Group = Parse.Object.extend("Grupos")
    var pointerToGroup = new Group()
    pointerToGroup.id = groupId

    query.equalTo("grupoPtr", pointerToGroup)
    query.equalTo("exists", true)
    query.equalTo("active", true)
    query.ascending("matricula")
    query.skip(index * 1000)
    query.limit(1000)
    query.include("grupoPtr")
    query.include("usuarioPtr")
    query.include("usuarioPtr.permisoPtr")

    try {
        const results = await query.find()
        if (results.length <= 0) {
            //console.log("Finaliza")
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            //console.log("Avanzando")
            exports.AsyncGetAllStudentsInGroup((index + 1), groupId, dataArray, callback)
        }
    } catch (error) {
        //throw new Error(error)
        callback(dataArray, error)
    }
}

exports.AddingSimulationTeam = function (simulationId, data) {
    return new Promise(function (resolve, reject) {
        exports.AsyncGetAllSimulation( simulationId, function ( resultSimulation, error ) {

            if (error){return resolve({ type: "CONSULTA", data: null, error: error.message })}

            const Table = Parse.Object.extend("SimulationsTeams")
            const object = new Table()

            if (data["teamName"]) {
                object.set("teamName", data["teamName"])
            }

            if (data["teamMembers"]) {
                object.set("teamMembers", data["teamMembers"])
            }

            var Simulation = Parse.Object.extend("Simulations")
            var pointerToSimulation = new Simulation()
            pointerToSimulation.id = simulationId
            object.set("simulationPtr", pointerToSimulation)

            var money = exports.RemoveCommas( resultSimulation.get("initialAmount") )
            object.set("teamCurrentMoney",money)
            object.set("active", true)
            object.set("exists", true)

            object.save()
                .then((object) => {
                    resolve({ type: "AGREGAR", data: object, error: null })
                }, (error) => {
                    resolve({ type: "AGREGAR", data: null, error: error.message })
                })
        })
    })
}

exports.AsyncGetAllSimulation = async ( simulationId, callback ) => {
    var Table = Parse.Object.extend("Simulations")
    var query = new Parse.Query(Table)

        query.equalTo("objectId",simulationId)
        query.equalTo("exists",true)
        query.equalTo("active",true)

    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
        
}

exports.RemoveCommas = function ( text ) {
    var textWithoutCommas = ''
    for (let i = 0; i < text.length; i++) {
        if( text.charAt(i) != ',' ){
            textWithoutCommas += text.charAt(i)
        }
    }
    return textWithoutCommas
}

exports.GetAllTeamsInSimulation = function (simulationId) {
    //log("Iniciando promesa")
    return new Promise(function (resolve, reject) {

        exports.AsyncGetAllTeamsInSimulation(0, simulationId, [], function (results, error) {
            if (!error) {
                resolve({ type: "CONSULTA", data: results, error: null })
            } else {
                resolve({ type: "CONSULTA", data: results, error: error.message })
            }

        })
    })
}

exports.AsyncGetAllTeamsInSimulation = async (index, simulationId, dataArray, callback) => {
    var Table = Parse.Object.extend("SimulationsTeams")
    var query = new Parse.Query(Table)

    //log(simulationId)
    var Simulations = Parse.Object.extend("Simulations")
    var pointerToSimulation = new Simulations()
    pointerToSimulation.id = simulationId

    query.equalTo("simulationPtr", pointerToSimulation)
    query.equalTo("exists", true)
    query.ascending("teamName")
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
            exports.AsyncGetAllTeamsInSimulation((index + 1), simulationId, dataArray, callback)
        }
    } catch (error) {
        //throw new Error(error)
        callback(dataArray, error)
    }
}

exports.ArchiveSimulationTeam = function (objectId, seActiva) {
    return new Promise(function (resolve, reject) {
        exports.AsyncSearchSimulationTeam(objectId, function (object, error) {
            if (!error) {
                if (object) {
                    if (seActiva === "true") {
                        object.set("active", true)
                        object.set("status", "")
                    } else if (seActiva === "false") {
                        object.set("active", false)
                        object.set("status", "PAUSED")
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

exports.EraseSimulationTeam = function (objectId) {
    return new Promise(function (resolve, reject) {
        exports.AsyncSearchSimulationTeam(objectId, function (object, error) {
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
                    resolve({ type: "ELIMINAR", data: null, error: "User not found" })
                }
            } else {
                resolve({ type: "ELIMINAR", data: null, error: error.message })
            }
        })
    })
}

exports.SearchSimulationTeam = function (objectId) {
    //console.log("object ID" + objectId)
    return new Promise(function (resolve, reject) {
        exports.AsyncSearchSimulationTeam(objectId, function (object, error) {
            if (!error) {
                //console.log("ingreso al primer if en el metodo AsyncBuscarUsuarioAdministracion en BuscarUsuarioAdministracion en el usuarios_administracion.model")
                if (object) {
                    //console.log("ingreso al segundo if en el metodo AsyncBuscarUsuarioAdministracion en BuscarUsuarioAdministracion en el usuarios_administracion.model")
                    resolve({ type: "BÚSQUEDA", data: object, error: null })
                } else {
                    //console.log("ingreso al primer else en el metodo AsyncBuscarUsuarioAdministracion en BuscarUsuarioAdministracion en el usuarios_administracion.model")
                    resolve({ type: "BÚSQUEDA", data: null, error: "Simulation not found" })
                }
            } else {
                //console.log("ingreso al primer else en el metodo AsyncBuscarUsuarioAdministracion en BuscarUsuarioAdministracion en el usuarios_administracion.model")
                resolve({ type: "BÚSQUEDA", data: null, error: error.message })
            }
        })
    })
}

exports.AsyncSearchSimulationTeam = async (objectId, callback) => {
    var Table = Parse.Object.extend("SimulationsTeams")
    var query = new Parse.Query(Table)
    query.equalTo("objectId", objectId)
    query.equalTo("exists", true)
    query.include("simulationPtr")
    try {
        const results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
        //throw new Error(error)
    }
}

exports.GetAllTeamsMembersInSimulationTeam = function (simulationId, members) {
    return new Promise(function (resolve, reject) {
        log(typeof(members) + " --> "+ members)
        exports.AsyncGetAllTeamsMembersInSimulationTeam(0, members.split(","), [], function (results, error) {
            if (!error) {
                resolve({ type: "CONSULTA", data: results, error: null })
            } else {
                resolve({ type: "CONSULTA", data: results, error: error.message })
            }
        })
    })
}

exports.AsyncGetAllTeamsMembersInSimulationTeam = async (index, members, dataArray, callback) => {
    var Table = Parse.Object.extend("UsuariosSistema")
    var query = new Parse.Query(Table)

    query.containedIn("objectId", members)
    query.equalTo("active", true)
    query.equalTo("exists", true)
    query.ascending("matricula")
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
            exports.AsyncGetAllTeamsMembersInSimulationTeam((index + 1), members, dataArray, callback)
        }
    } catch (error) {
        //throw new Error(error)
        callback(dataArray, error)
    }
}

exports.DeleteMemberTeam = function (teamObjectId, memberObjectId) {
    return new Promise(function (resolve, reject) {
        //log(teamObjectId, memberObjectId)
        exports.AsyncGetTeam(teamObjectId, memberObjectId, function (results, error) {
            log(results, error)
            if(error) { return resolve({ type: "ELIMINAR", data: null, error: error.message })}

            var teamMembers = _.difference(results.get("teamMembers"),[memberObjectId])
            
            results.set("teamMembers",teamMembers)
            results.save().then((resulDelete) => {

                if (teamMembers.length == 0) {
                    exports.ArchiveSimulationTeam(teamObjectId,"false").then(function (results){
                        if (results.error) {
                            resolve({ type: "ELIMINAR", data: null, error: results.error })
                        }else{
                            resolve({ type: "ELIMINAR", data: teamMembers, error: null})
                        }
                    })
                }else{
                    resolve({ type: "ELIMINAR", data: teamMembers, error: null})
                }

            }, (error) => {
                resolve({ type: "ELIMINAR", data: null, error: error.message })
            })
        })
    })
}

exports.AsyncGetTeam =  async (teamObjectId, memberObjectId, callback) => {
    var Table = Parse.Object.extend("SimulationsTeams")
    var query = new Parse.Query(Table)

        query.equalTo("objectId",teamObjectId)
        query.containedIn("teamMembers",[memberObjectId])
        //query.equalTo("active",true)
        query.equalTo("exists",true)

    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.AddMembersUpdateTeam = function (objectIdTeam ,teamMembers) {
    return new Promise(function (resolve, reject) {
        exports.AsyncGetTeamToUpdate(objectIdTeam, function (result, error){
            if(error) { return resolve({ type: "ELIMINAR", data: null, error: error.message })}
            log(result)
            var membersTempo   = result.get("teamMembers")
            var membersCurrent = _.union(membersTempo, teamMembers)
            result.set("teamMembers",membersCurrent)
            result.save().then((resulAdd) => {
                if(membersTempo == 0){
                    exports.ArchiveSimulationTeam(objectIdTeam,"true").then(function (results){
                        if (results.error) {
                            resolve({ type: "ELIMINAR", data: null, error: results.error })
                        }else{
                            resolve({ type: "AGREGAR", data: membersCurrent, error: null })
                        }
                    })
                }else{
                    resolve({ type: "AGREGAR", data: membersCurrent, error: null })
                }
            }, (error) => {
                resolve({ type: "AGREGAR", data: null, error: error.message })
            })
        })
    })
}

exports.AsyncGetTeamToUpdate =  async (teamObjectId, callback) => {
    var Table = Parse.Object.extend("SimulationsTeams")
    var query = new Parse.Query(Table)
        query.equalTo("objectId",teamObjectId)
        //query.equalTo("active",true)
        query.equalTo("exists",true)

    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.GetAllTeamsInSimulationlivequery = function (simulationId) {
    //log("Iniciando promesa")
    return new Promise(function (resolve, reject) {

        exports.AsyncGetAllTeamsInSimulationLivequery(0, simulationId, [], function (results, error) {
            if (!error) {
                resolve({ type: "CONSULTA", data: results, error: null })
            } else {
                resolve({ type: "CONSULTA", data: results, error: error.message })
            }

        })
    })
}

exports.AsyncGetAllTeamsInSimulationLivequery = async (index, simulationId, dataArray, callback) => {
    var Table = Parse.Object.extend("SimulationsTeams")
    var query = new Parse.Query(Table)

    //log(simulationId)
    var Simulations = Parse.Object.extend("Simulations")
    var pointerToSimulation = new Simulations()
    pointerToSimulation.id = simulationId

    query.equalTo("simulationPtr", pointerToSimulation)
    query.equalTo("exists", true)
    query.descending("teamOrdersAmount")
    query.addDescending("teamCurrentMoney")
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
            exports.AsyncGetAllTeamsInSimulation((index + 1), simulationId, dataArray, callback)
        }
    } catch (error) {
        //throw new Error(error)
        callback(dataArray, error)
    }
}

/* Copia de los datos maestros */
exports.GetAllInventoryRM = function (data) {
    return new Promise(function(resolve, reject) {
        exports.AsyncGetAllInventoryRM(0, [], function (results, error) {
            if (!error) {
                resolve({ type: "AGREGAR", data: results, error: null })
            } else {
                log(error)
                resolve({ type: "AGREGAR", data: null, error: error.message })
            }
        })
    })
}

exports.AsyncGetAllInventoryRM = async (index, dataArray, callback) => {
    var Table = Parse.Object.extend("DMMateriaPrimaInventario")
    var query = new Parse.Query(Table)
   
    query.equalTo("exists", true)
    query.equalTo("active", true)
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
            exports.AsyncGetAllInventoryRM((index + 1), dataArray, callback)
        }
    } catch (error) {
        //throw new Error(error)
        callback(dataArray, error)
    }
}

exports.GetAllProducts = function (data) {
    return new Promise(function (resolve, reject) {
        exports.AsyncGetAllProducts(0, [], function (results, error) {
            if (!error) {
                resolve({ type: "AGREGAR", data: results, error: null })
            } else {
                resolve({ type: "AGREGAR", data: null, error: error.message })
            }
        })
    })
}

exports.AsyncGetAllProducts = async (index, dataArray, callback) => {
    var Table = Parse.Object.extend("DMProductoFamilia")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)
    query.equalTo("active", true)
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
            exports.AsyncGetAllProducts((index + 1), dataArray, callback)
        }
    } catch (error) {
        //throw new Error(error)
        callback(dataArray, error)
    }
}

exports.GetAllProviders = function (data) {
    return new Promise(function (resolve, reject) {
        exports.AsyncGetAllProviders(0, [], function (results, error) {
            if (!error) {
                resolve({ type: "AGREGAR", data: results, error: null })
            } else {
                resolve({ type: "AGREGAR", data: null, error: error.message })
            }
        })
    })
}

exports.AsyncGetAllProviders = async (index, dataArray, callback) => {
    var Table = Parse.Object.extend("DMProveedores")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)
    query.equalTo("active", true)
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
            exports.AsyncGetAllProviders((index + 1), dataArray, callback)
        }
    } catch (error) {
        //throw new Error(error)
        callback(dataArray, error)
    }
}

exports.GetAllProvidersRawMaterial = function (data) {
    return new Promise(function (resolve, reject) {
        exports.AsyncGetAllProvidersRawMaterial(0, [], function (results, error) {
            if (!error) {
                resolve({ type: "AGREGAR", data: results, error: null })
            } else {
                resolve({ type: "AGREGAR", data: null, error: error.message })
            }
        })
    })
}

exports.AsyncGetAllProvidersRawMaterial = async (index, dataArray, callback) => {
    var Table = Parse.Object.extend("DMProveedoresMP")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)
    query.equalTo("active", true)
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
            exports.AsyncGetAllProvidersRawMaterial((index + 1), dataArray, callback)
        }
    } catch (error) {
        //throw new Error(error)
        callback(dataArray, error)
    }
}

exports.GetAllTransport = function (data) {
    return new Promise(function (resolve, reject) {
        exports.AsyncGetAllTransport(0, [], function (results, error) {
            if (!error) {
                resolve({ type: "AGREGAR", data: results, error: null })
            } else {
                resolve({ type: "AGREGAR", data: null, error: error.message })
            }
        })
    })
}

exports.AsyncGetAllTransport = async (index, dataArray, callback) => {
    var Table = Parse.Object.extend("DMTransporte")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)
    query.equalTo("active", true)
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
            exports.AsyncGetAllTransport((index + 1), dataArray, callback)
        }
    } catch (error) {
        //throw new Error(error)
        callback(dataArray, error)
    }
}

exports.GetAllFixedAssets = function (data) {
    return new Promise(function (resolve, reject) {
        exports.AsyncGetAllFixedAssets(0, [], function (results, error) {
            if (!error) {
                resolve({ type: "AGREGAR", data: results, error: null })
            } else {
                resolve({ type: "AGREGAR", data: null, error: error.message })
            }
        })
    })
}

exports.AsyncGetAllFixedAssets = async (index, dataArray, callback) => {
    var Table = Parse.Object.extend("DMActivosFijos")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)
    query.equalTo("active", true)
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
            exports.AsyncGetAllFixedAssets((index + 1), dataArray, callback)
        }
    } catch (error) {
        //throw new Error(error)
        callback(dataArray, error)
    }
}

exports.GetAllFixedAssetsInventory = function (data) {
    return new Promise(function (resolve, reject) {
        exports.AsyncGetAllFixedAssetsInventory(0, [], function (results, error) {
            if (!error) {
                resolve({ type: "AGREGAR", data: results, error: null })
            } else {
                resolve({ type: "AGREGAR", data: null, error: error.message })
            }
        })
    })
}

exports.AsyncGetAllFixedAssetsInventory = async (index, dataArray, callback) => {
    var Table = Parse.Object.extend("DMActivosFijosInventario")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)
    query.equalTo("active", true)
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
            exports.AsyncGetAllFixedAssetsInventory((index + 1), dataArray, callback)
        }
    } catch (error) {
        //throw new Error(error)
        callback(dataArray, error)
    }
}

exports.GetAllClients = function (data) {
    return new Promise(function (resolve, reject) {
        exports.AsyncGetAllClients(0, [], function (results, error) {
            if (!error) {
                resolve({ type: "AGREGAR", data: results, error: null })
            } else {
                resolve({ type: "AGREGAR", data: null, error: error.message })
            }
        })
    })
}

exports.AsyncGetAllClients = async (index, dataArray, callback) => {
    var Table = Parse.Object.extend("DMClientes")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)
    query.equalTo("active", true)
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
            exports.AsyncGetAllClients((index + 1), dataArray, callback)
        }
    } catch (error) {
        //throw new Error(error)
        callback(dataArray, error)
    }
}

exports.GetAllEmployees = function (data) {
    return new Promise(function (resolve, reject) {
        exports.AsyncGetAllEmployees(0, [], function (results, error) {
            if (!error) {
                resolve({ type: "AGREGAR", data: results, error: null })
            } else {
                resolve({ type: "AGREGAR", data: null, error: error.message })
            }
        })
    })
}

exports.AsyncGetAllEmployees = async (index, dataArray, callback) => {
    var Table = Parse.Object.extend("DMEmpleados")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)
    query.equalTo("active", true)
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
            exports.AsyncGetAllEmployees((index + 1), dataArray, callback)
        }
    } catch (error) {
        //throw new Error(error)
        callback(dataArray, error)
    }
}

exports.GetAllExpenses = function (data) {
    return new Promise(function (resolve, reject) {
        exports.AsyncGetAllExpenses(0, [], function (results, error) {
            if (!error) {
                resolve({ type: "AGREGAR", data: results, error: null })
            } else {
                resolve({ type: "AGREGAR", data: null, error: error.message })
            }
        })
    })
}

exports.AsyncGetAllExpenses = async (index, dataArray, callback) => {
    var Table = Parse.Object.extend("DMGastos")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)
    query.equalTo("active", true)
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
            exports.AsyncGetAllExpenses((index + 1), dataArray, callback)
        }
    } catch (error) {
        //throw new Error(error)
        callback(dataArray, error)
    }
}

exports.GetAllSalaryTabulator = function(){
    return new Promise(function (resolve, reject) {
        exports.AsyncGetAllSalaryTabulator(0, [], function (results, error){
            if(error){return resolve({ type: "AGREGAR", data: null, error: error.message })}
            resolve({ type: "AGREGAR", data: results, error: null})
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

exports.GetAllSalaryTabulatorSDM = function(simulationPtr){
    var Simulation = Parse.Object.extend("Simulations")
    var pointerToSimulation = new Simulation()
        pointerToSimulation.id = simulationPtr
    return new Promise(function (resolve, reject) {
        exports.AsyncGetAllSalaryTabulatorSDM(pointerToSimulation, 0, [], function (results, error){
            if(error){return resolve({ type: "CONSULTA", data: null, error: error.message })}
            resolve({ type: "CONSULTA", data: results, error: null})
        })
    })
}

exports.AsyncGetAllSalaryTabulatorSDM = async (pointerToSimulation, index, dataArray, callback) =>{
    var Table = Parse.Object.extend("SDMSalaryTabulator")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr",pointerToSimulation)
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
            exports.AsyncGetAllSalaryTabulatorSDM( pointerToSimulation, (index + 1), dataArray, callback )
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.UpdateSalaryTabulator = function(simulationPtr, salaryTabulatorPtr, salary){
    var Simulation = Parse.Object.extend("Simulations")
    var pointerToSimulation = new Simulation()
        pointerToSimulation.id = simulationPtr
    return new Promise(function (resolve, reject) {
        exports.AsyncGetSalaryTabulator(pointerToSimulation, salaryTabulatorPtr, function (results, error){
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

exports.AsyncGetSalaryTabulator = async (pointerToSimulation, salaryTabulatorPtr, callback) => {
    var Table = Parse.Object.extend("SDMSalaryTabulator")
    var query = new Parse.Query(Table)

    query.equalTo("objectId",salaryTabulatorPtr)
    query.equalTo("simulationPtr",pointerToSimulation)
    query.equalTo("exists",true)
    query.equalTo("active",true)

    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.GetAllDMProductionTemplatePhases = function () {
    return new Promise(function (resolve, reject) {
        exports.AsyncGetAllProdcutionLinePhases (0, [], function(resultsDMPhases, error){
            if (error) {
                resolve({ type: "CONSULTA", data: null, error: error.message })
            }else{
                exports.AsyncGetAllSalaryTabulator(0, [], function (resultsDMSalaryTabulator, error){
                    resolve({ type: "CONSULTA", dataDMPhases: resultsDMPhases, dataDMSalaryTabulator: resultsDMSalaryTabulator, error: null })
                })
            }
        })
    })
}

exports.AsyncGetAllProdcutionLinePhases = async ( index, dataArray, callback ) => {
    var Table = Parse.Object.extend("DMProductionLinePhases")
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
            exports.AsyncGetAllProdcutionLinePhases( (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
} 

exports.GetAllProdcutionLineTemplates = function (simulation) {
    return new Promise(function (resolve, reject) {
        exports.AsyncGetAllProdcutionLineTemplates (0, [], function(resultsTemplates, error){
            if (error) {
                resolve({ type: "CONSULTA", data: null, error: error.message })
            }else{
                exports.AsyncGetAllSDMProductFamily (simulation, 0, [], function(resultsProductFamily, error){
                    if (error) {
                        resolve({ type: "CONSULTA", data: null, error: error.message })
                    }else{
                        resolve({ type: "CONSULTA", dataTemplates: resultsTemplates, dataSDMProdcuFamily: resultsProductFamily, error: null })
                    }
                })
            }
        })
    })
}

exports.AsyncGetAllProdcutionLineTemplates = async ( index, dataArray, callback ) => {
    var Table = Parse.Object.extend("DMProductionLineTemplates")
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
            exports.AsyncGetAllProdcutionLineTemplates((index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
} 

exports.AsyncGetAllSDMProductFamily = async (simulationPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("SDMProductoFamilia")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr",simulationPtr)
    query.equalTo("exists", true)
    query.equalTo("active", true)
    query.skip(index * 1000)
    query.limit(1000)
    try {
        const results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            //console.log("Avanzando")
            exports.AsyncGetAllSDMProductFamily( simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        //throw new Error(error)
        callback(dataArray, error)
    }
}

//Delete simulation logs

exports.DeleteSimulationThousand = function () {

    return new Promise(function (resolve, reject) {

        exports.AsyncGetSimulationLogs(0, [], function (results, error){

            var pointerSimualtion = []
            for (let i = 0; i < results.length; i++) {
                pointerSimualtion.push(results[i].get("simulationPtr"))
            }

            exports.AsyncGetThousandSimulationsLogs(pointerSimualtion, 0, 3, 0, [], function (resultsSimulationsLogs, error) {
                
                if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }

                log("before to delete " + resultsSimulationsLogs.length + " data from table SimulationsLogs")

                exports.AsyncDeleteDataBD(resultsSimulationsLogs, [], function (resultsDeletedSimulationsLogs, error) {
                    if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                    log("after to delete " + resultsDeletedSimulationsLogs.length + " data from table SimulationsLogs")

                    //log(results)
                    exports.AsyncLogsDeletePtr(results, 0, [], function(resultsLogsDelete, error){
                        if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                        
                        /*log("------")
                        log(resultsLogsDelete, error)
                        log("--------")*/

                        log("before to delete " + resultsLogsDelete.length + " data from table LogsDelete")
                        exports.AsyncDeleteDataBD(resultsLogsDelete, [], function (resultLogsDelete, error) {
                        if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }

                        log("after to delete " + resultLogsDelete.length + " data from table LogsDelete")
                        resolve({ type: "ELIMINAR", data: resultLogsDelete, error: null }) 
                            
                        })
                    })
                    
                        
                })

            })

        })
    })
}

exports.AsyncGetSimulationLogs = async (index, dataArray, callback) => {
    var Table = Parse.Object.extend("LogsDelete")
    var query = new Parse.Query(Table)

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
                exports.AsyncGetSimulationLogs((index + 1), dataArray, callback)
            }
        } catch (error) {
            callback(null, error)
        }
            
}

exports.AsyncLogsDeletePtr = async (data, index, dataArray, callback) => {

    try {

        if( data.length == index ){
            callback(dataArray, null)
        }else{
            var simulationPtr = data[index].get("simulationPtr")
            exports.AsyncGetSimulationsLogsPtr(simulationPtr, 0, function (results, error){
                if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }

                if(results.length <= 0){
                    dataArray.push( data[index])
                }

                exports.AsyncLogsDeletePtr(data, (index + 1), dataArray, callback)
            })
        }
        
    } catch (error) {
        callback(null, error)
    }
    
}

exports.AsyncGetSimulationsLogsPtr = async (simulationPtr, index, callback) => {
    var Table = Parse.Object.extend("SimulationsLogs")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr", simulationPtr)
    query.limit(2)

    try {
        var results = await query.find()
        callback(results, null)
        /*if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetSimulationsLogs(simulationPtr, (index + 1), dataArray, callback)
        }*/
    } catch (error) {
        callback(null, error)
    }
}

//Delete simulation

exports.DeleteSimulation = function (simulationPtr) {

    var Simulation = Parse.Object.extend("Simulations")
    var pointerToSimulation = new Simulation()
    pointerToSimulation.id = simulationPtr

    return new Promise(function (resolve, reject) {

        var Table = Parse.Object.extend("LogsDelete")
        var object = new Table()
            //i1rr46ET95
            object.set("simulationPtr", pointerToSimulation)
            object.set("active", true)
            object.set("exists", true)
        
        object.save().then((result)=>{

            //Table Simualtion
            exports.AsyncGetSimulation(simulationPtr, function (resulSimulation, error) {
                if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                var array = []
                array.push(resulSimulation)
                log("before to delete " + array.length + " data from table Simualtion")
                exports.AsyncDeleteDataBD(array, [], function (resultsDeletedSimulation, error) {
                    if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                    log("after to delete " + resultsDeletedSimulation.length + " data from table Simualtion")

                    //Table SimualtionEvents
                    exports.AsyncGetSimulationtEvents(pointerToSimulation, 0, [], function (resultsSimulationEvents, error) {
                        if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                        log("before to delete " + resultsSimulationEvents.length + " data from table SimualtionEvents")
                        exports.AsyncDeleteDataBD(resultsSimulationEvents, [], function (resultsDeletedSimulationEvents, error) {
                            if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                            log("after to delete " + resultsDeletedSimulationEvents.length + " data from table SimualtionEvents")

                            //Table SimualtionEventsPipe
                            exports.AsyncGetSimulationsEventPipe(pointerToSimulation, 0, [], function (resultsSimulationEventsPipe, error) {
                                if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                log("before to delete " + resultsSimulationEventsPipe.length + " data from table SimualtionEventsPipe")
                                exports.AsyncDeleteDataBD(resultsSimulationEventsPipe, [], function (resultsDeletedSimulationEventsPipe, error) {
                                    if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                    log("after to delete " + resultsDeletedSimulationEventsPipe.length + " data from table SimualtionEventsPipe")

                                    //Table SimulationsDeliveredRawMaterial
                                    exports.AsyncGetSimulationsDeliveredRawMaterial(pointerToSimulation, 0, [], function (resultsSimulationsDeliveredRawMaterial, error) {
                                        if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                        log("before to delete " + resultsSimulationsDeliveredRawMaterial.length + " data from table SimulationsDeliveredRawMaterial")
                                        exports.AsyncDeleteDataBD(resultsSimulationsDeliveredRawMaterial, [], function (resultsDeletedSimulationsDeliveredRawMaterial, error) {
                                            if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                            log("after to delete " + resultsDeletedSimulationsDeliveredRawMaterial.length + " data from table SimulationsDeliveredRawMaterial")

                                            //Table SimulationsInventory
                                            exports.AsyncGetSimulationsInventory(pointerToSimulation, 0, [], function (resultsSimulationsInventory, error) {
                                                if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                                log("before to delete " + resultsSimulationsInventory.length + " data from table SimulationsInventory")
                                                exports.AsyncDeleteDataBD(resultsSimulationsInventory, [], function (resultsDeletedSimulationsInventory, error) {
                                                    if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                                    log("after to delete " + resultsDeletedSimulationsInventory.length + " data from table SimulationsInventory")

                                                    //Table SimulationsLogs
                                                    /*exports.AsyncGetSimulationsLogs(pointerToSimulation, 0, [], function (resultsSimulationsLogs, error) {
                                                        if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                                        log("before to delete " + resultsSimulationsLogs.length + " data from table SimulationsLogs")
                                                        exports.AsyncDeleteDataBD(resultsSimulationsLogs, [], function (resultsDeletedSimulationsLogs, error) {
                                                            if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                                            log("after to delete " + resultsDeletedSimulationsLogs.length + " data from table SimulationsLogs")*/

                                                            //Table SimulationsOrders
                                                            exports.AsyncGetSimulationsOrders(pointerToSimulation, 0, [], function (resultsSimulationsOrders, error) {
                                                                if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                                                log("before to delete " + resultsSimulationsOrders.length + " data from table SimulationsOrders")
                                                                exports.AsyncDeleteDataBD(resultsSimulationsOrders, [], function (resultsDeletedSimulationsOrders, error) {
                                                                    if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                                                    log("after to delete " + resultsDeletedSimulationsOrders.length + " data from table SimulationsOrders")

                                                                    //Table SimulationsOrdersPurchasings
                                                                    exports.AsyncGetSimulationsOrdersPurchasings(pointerToSimulation, 0, [], function (resultsSimulationsOrdersPurchasings, error) {
                                                                        if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                                                        log("before to delete " + resultsSimulationsOrdersPurchasings.length + " data from table SimulationsOrdersPurchasings")
                                                                        exports.AsyncDeleteDataBD(resultsSimulationsOrdersPurchasings, [], function (resultsDeletedSimulationsOrdersPurchasings, error) {
                                                                            if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                                                            log("after to delete " + resultsDeletedSimulationsOrdersPurchasings.length + " data from table SimulationsOrdersPurchasings")

                                                                            //Table SimulationsOrdersSuppliers
                                                                            exports.AsyncGetSimulationsOrdersSuppliers(pointerToSimulation, 0, [], function (resultsSimulationsOrdersSuppliers, error) {
                                                                                if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                                                                log("before to delete " + resultsSimulationsOrdersSuppliers.length + " data from table SimulationsOrdersSuppliers")
                                                                                exports.AsyncDeleteDataBD(resultsSimulationsOrdersSuppliers, [], function (resultsDeletedSimulationsOrdersSuppliers, error) {
                                                                                    if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                                                                    log("after to delete " + resultsDeletedSimulationsOrdersSuppliers.length + " data from table SimulationsOrdersSuppliers")

                                                                                    //Table SimulationsTeams
                                                                                    exports.AsyncGetSimulationsTeams(pointerToSimulation, 0, [], function (resultsSimulationsTeams, error) {
                                                                                        if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                                                                        log("before to delete " + resultsSimulationsTeams.length + " data from table SimulationsTeams")
                                                                                        exports.AsyncDeleteDataBD(resultsSimulationsTeams, [], function (resultsDeletedSimulationsTeams, error) {
                                                                                            if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                                                                            log("after to delete " + resultsDeletedSimulationsTeams.length + " data from table SimulationsTeams")

                                                                                            //Table SimulationsPurchasing
                                                                                            exports.AsyncGetSimulationsPurchasing(resultsDeletedSimulationsTeams, 0, [], function (resultsSimulationsPurchasing, error) {
                                                                                                if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                                                                                log("before to delete " + resultsSimulationsPurchasing.length + " data from table SimulationsPurchasing")
                                                                                                exports.AsyncDeleteDataBD(resultsSimulationsPurchasing, [], function (resultsDeletedSimulationsPurchasing, error) {
                                                                                                    if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                                                                                    log("after to delete " + resultsDeletedSimulationsPurchasing.length + " data from table SimulationsPurchasing")

                                                                                                    exports.DeleteTDSimulation(pointerToSimulation, function (error) {
                                                                                                        if (error) {
                                                                                                            resolve({ type: "ELIMINAR", data: null, error: error})
                                                                                                        } else {
                                                                                                            log("Success")
                                                                                                            resolve({ type: "ELIMINAR", data: resultsDeletedSimulation, error: null })
                                                                                                        }
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
                                                            })

                                                        /*})
                                                    })*/

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

        },(error)=>{
            resolve({ type: "AGREGAR", data: null, error: error.message })
        })

    })
}

exports.DeleteTDSimulation  = function(pointerToSimulation, callback) {
    //Table TDActivatedProductionLine
    exports.AsyncGetTDActivatedProductionLine(pointerToSimulation, 0, [], function (resultsTDActivatedProductionLine, error) {
        if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
        log("before to delete " + resultsTDActivatedProductionLine.length + " data from table TDActivatedProductionLine")
        exports.AsyncDeleteDataBD(resultsTDActivatedProductionLine, [], function (resultsDeletedTDActivatedProductionLine, error) {
            if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
            log("after to delete " + resultsDeletedTDActivatedProductionLine.length + " data from table TDActivatedProductionLine")

            //Table TDMActivosFijosInventario
            exports.AsyncGetTDMActivosFijosInventario(pointerToSimulation, 0, [], function (resultsTDMActivosFijosInventario, error) {
                if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                log("before to delete " + resultsTDMActivosFijosInventario.length + " data from table TDMActivosFijosInventario")
                exports.AsyncDeleteDataBD(resultsTDMActivosFijosInventario, [], function (resultsDeletedTDMActivosFijosInventario, error) {
                    if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                    log("after to delete " + resultsDeletedTDMActivosFijosInventario.length + " data from table TDMActivosFijosInventario")

                    //Table TDMEmployees
                    exports.AsyncGetTDMEmployees(pointerToSimulation, 0, [], function (resultsTDMEmployees, error) {
                        if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                        log("before to delete " + resultsTDMEmployees.length + " data from table TDMEmployees")
                        exports.AsyncDeleteDataBD(resultsTDMEmployees, [], function (resultsDeletedTDMEmployees, error) {
                            if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                            log("after to delete " + resultsDeletedTDMEmployees.length + " data from table TDMEmployees")

                            //Table TDProductionLine
                            exports.AsyncGetTDProductionLine(pointerToSimulation, 0, [], function (resultsTDProductionLine, error) {
                                if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                log("before to delete " + resultsTDProductionLine.length + " data from table TDProductionLine")
                                exports.AsyncDeleteDataBD(resultsTDProductionLine, [], function (resultsDeletedTDProductionLine, error) {
                                    if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                    log("after to delete " + resultsDeletedTDProductionLine.length + " data from table TDProductionLine")

                                    //Table TDProductoFamilia
                                    exports.AsyncGetTDProductoFamilia(pointerToSimulation, 0, [], function (resultsTDProductoFamilia, error) {
                                        if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                        log("before to delete " + resultsTDProductoFamilia.length + " data from table TDProductoFamilia")
                                        exports.AsyncDeleteDataBD(resultsTDProductoFamilia, [], function (resultsDeletedTDProductoFamilia, error) {
                                            if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                            log("after to delete " + resultsDeletedTDProductoFamilia.length + " data from table TDProductoFamilia")

                                            //Table TDSimulationFinancialLog
                                            exports.AsyncGetTDSimulationFinancialLog(pointerToSimulation, 0, [], function (resultsTDSimulationFinancialLog, error) {
                                                if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                                log("before to delete " + resultsTDSimulationFinancialLog.length + " data from table TDSimulationFinancialLog")
                                                exports.AsyncDeleteDataBD(resultsTDSimulationFinancialLog, [], function (resultsDeletedTDSimulationFinancialLog, error) {
                                                    if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                                    log("after to delete " + resultsDeletedTDSimulationFinancialLog.length + " data from table TDSimulationFinancialLog")

                                                    exports.DeleteSDMSimulation(pointerToSimulation, function (error) {
                                                        if (error) {
                                                            callback(error)
                                                        } else {
                                                            callback(null)
                                                        }
                                                    })
                                                    //callback(null)
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

        })
    })
}

exports.DeleteSDMSimulation = function (pointerToSimulation, callback) {
     //Table SDMActivosFijos
     exports.AsyncGetSDMActivosFijos(pointerToSimulation, 0, [], function (resultsSDMActivosFijos, error) {
        if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
        log("before to delete " + resultsSDMActivosFijos.length + " data from table SDMActivosFijos")
        exports.AsyncDeleteDataBD(resultsSDMActivosFijos, [], function (resultsDeletedSDMActivosFijos, error) {
            if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
            log("after to delete " + resultsDeletedSDMActivosFijos.length + " data from table SDMActivosFijos")
            //callback(null)

            //Table SDMActivosFijosInventario
            exports.AsyncGetSDMActivosFijosInventario(pointerToSimulation, 0, [], function (resultsSDMActivosFijosInventario, error) {
                if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                log("before to delete " + resultsSDMActivosFijosInventario.length + " data from table SDMActivosFijosInventario")
                exports.AsyncDeleteDataBD(resultsSDMActivosFijosInventario, [], function (resultsDeletedSDMActivosFijosInventario, error) {
                    if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                    log("after to delete " + resultsDeletedSDMActivosFijosInventario.length + " data from table SDMActivosFijosInventario")
                    //callback(null)

                    //Table SDMClientes
                    exports.AsyncGetSDMClientes(pointerToSimulation, 0, [], function (resultsSDMClientes, error) {
                        if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                        log("before to delete " + resultsSDMClientes.length + " data from table SDMClientes")
                        exports.AsyncDeleteDataBD(resultsSDMClientes, [], function (resultsDeletedSDMClientes, error) {
                            if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                            log("after to delete " + resultsDeletedSDMClientes.length + " data from table SDMClientes")
                            //callback(null)

                            //Table SDMEmpleados
                            exports.AsyncGetSDMEmpleados(pointerToSimulation, 0, [], function (resultsSDMEmpleados, error) {
                                if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                log("before to delete " + resultsSDMEmpleados.length + " data from table SDMEmpleados")
                                exports.AsyncDeleteDataBD(resultsSDMEmpleados, [], function (resultsDeletedSDMEmpleados, error) {
                                    if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                    log("after to delete " + resultsDeletedSDMEmpleados.length + " data from table SDMEmpleados")
                                    //callback(null)

                                    //Table SDMGastos
                                    exports.AsyncGetSDMGastos(pointerToSimulation, 0, [], function (resultsSDMGastos, error) {
                                        if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                        log("before to delete " + resultsSDMGastos.length + " data from table SDMGastos")
                                        exports.AsyncDeleteDataBD(resultsSDMGastos, [], function (resultsDeletedSDMGastos, error) {
                                            if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                            log("after to delete " + resultsDeletedSDMGastos.length + " data from table SDMGastos")
                                            //callback(null)

                                            //Table SDMMateriaPrimaInventario
                                            exports.AsyncGetSDMMateriaPrimaInventario(pointerToSimulation, 0, [], function (resultsSDMMateriaPrimaInventario, error) {
                                                if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                                log("before to delete " + resultsSDMMateriaPrimaInventario.length + " data from table SDMMateriaPrimaInventario")
                                                exports.AsyncDeleteDataBD(resultsSDMMateriaPrimaInventario, [], function (resultsDeletedSDMMateriaPrimaInventario, error) {
                                                    if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                                    log("after to delete " + resultsDeletedSDMMateriaPrimaInventario.length + " data from table SDMMateriaPrimaInventario")
                                                    //callback(null)

                                                    //Table SDMProductionLinePhases
                                                    exports.AsyncGetSDMProductionLinePhases(pointerToSimulation, 0, [], function (resultsSDMProductionLinePhases, error) {
                                                        if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                                        log("before to delete " + resultsSDMProductionLinePhases.length + " data from table SDMProductionLinePhases")
                                                        exports.AsyncDeleteDataBD(resultsSDMProductionLinePhases, [], function (resultsDeletedSDMProductionLinePhases, error) {
                                                            if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                                            log("after to delete " + resultsDeletedSDMProductionLinePhases.length + " data from table SDMProductionLinePhases")
                                                            //callback(null)

                                                            //Table SDMProductionLineTemplates
                                                            exports.AsyncGetSDMProductionLineTemplates(pointerToSimulation, 0, [], function (resultsSDMProductionLineTemplates, error) {
                                                                if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                                                log("before to delete " + resultsSDMProductionLineTemplates.length + " data from table SDMProductionLineTemplates")
                                                                exports.AsyncDeleteDataBD(resultsSDMProductionLineTemplates, [], function (resultsDeletedSDMProductionLineTemplates, error) {
                                                                    if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                                                    log("after to delete " + resultsDeletedSDMProductionLineTemplates.length + " data from table SDMProductionLineTemplates")
                                                                    //callback(null)

                                                                    //Table SDMProductoFamilia
                                                                    exports.AsyncGetSDMProductoFamilia(pointerToSimulation, 0, [], function (resultsSDMProductoFamilia, error) {
                                                                        if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                                                        log("before to delete " + resultsSDMProductoFamilia.length + " data from table SDMProductoFamilia")
                                                                        exports.AsyncDeleteDataBD(resultsSDMProductoFamilia, [], function (resultsDeletedSDMProductoFamilia, error) {
                                                                            if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                                                            log("after to delete " + resultsDeletedSDMProductoFamilia.length + " data from table SDMProductoFamilia")
                                                                            //callback(null)

                                                                            //Table SDMProveedores
                                                                            exports.AsyncGetSDMProveedores(pointerToSimulation, 0, [], function (resultsSDMProveedores, error) {
                                                                                if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                                                                log("before to delete " + resultsSDMProveedores.length + " data from table SDMProveedores")
                                                                                exports.AsyncDeleteDataBD(resultsSDMProveedores, [], function (resultsDeletedSDMProveedores, error) {
                                                                                    if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                                                                    log("after to delete " + resultsDeletedSDMProveedores.length + " data from table SDMProveedores")
                                                                                    //callback(null)

                                                                                    //Table SDMProveedoresMP
                                                                                    exports.AsyncGetSDMProveedoresMP(pointerToSimulation, 0, [], function (resultsSDMProveedoresMP, error) {
                                                                                        if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                                                                        log("before to delete " + resultsSDMProveedoresMP.length + " data from table SDMProveedoresMP")
                                                                                        exports.AsyncDeleteDataBD(resultsSDMProveedoresMP, [], function (resultsDeletedSDMProveedoresMP, error) {
                                                                                            if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                                                                            log("after to delete " + resultsDeletedSDMProveedoresMP.length + " data from table SDMProveedoresMP")
                                                                                            //callback(null)

                                                                                            //Table SDMSalaryTabulator
                                                                                            exports.AsyncGetSDMSalaryTabulator(pointerToSimulation, 0, [], function (resultsSDMSalaryTabulator, error) {
                                                                                                if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                                                                                log("before to delete " + resultsSDMSalaryTabulator.length + " data from table SDMSalaryTabulator")
                                                                                                exports.AsyncDeleteDataBD(resultsSDMSalaryTabulator, [], function (resultsDeletedSDMSalaryTabulator, error) {
                                                                                                    if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                                                                                    log("after to delete " + resultsDeletedSDMSalaryTabulator.length + " data from table SDMSalaryTabulator")
                                                                                                    //callback(null)

                                                                                                    //Table SDMTransporte
                                                                                                    exports.AsyncGetSDMTransporte(pointerToSimulation, 0, [], function (resultsSDMTransporte, error) {
                                                                                                        if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                                                                                        log("before to delete " + resultsSDMTransporte.length + " data from table SDMTransporte")
                                                                                                        exports.AsyncDeleteDataBD(resultsSDMTransporte, [], function (resultsDeletedSDMTransporte, error) {
                                                                                                            if (error) { return resolve({ type: "ELIMINAR", data: null, error: error.message }) }
                                                                                                            log("after to delete " + resultsDeletedSDMTransporte.length + " data from table SDMTransporte")

                                                                                                            callback(null)
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

                        })
                    })

                })
            })
        })
    })
}

//metodos para eliminar los datos de la BD de la simulación
exports.AsyncDeleteDataBD = async (data, dataArray, callback) => {
    try {
        if (data.length <= 0) {
            callback(dataArray, null)
        } else {
            var dataThousand = exports.GetThousandDataArray(data)
            var newData = exports.DeletedThousandDataArray(data)

            Parse.Object.destroyAll(dataThousand).then((result) => {

                //log("result deleted " + result)
                dataArray.push.apply(dataArray, dataThousand)
                exports.AsyncDeleteDataBD(newData, dataArray, callback)

            }, (error) => {

                //log("error " + error.message)
                dataArray.push.apply(dataArray, dataThousand)
                exports.AsyncDeleteDataBD(newData, dataArray, callback)

            })
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.DeletedThousandDataArray = function(data) {
    if (data.length <= 1000) {
        var length = data.length
        for (let i = 0; i < length; i++) {
            data.shift();
        }
    } else {
        for (let i = 0; i < 1000; i++) {
            data.shift();
        }
    }
    return data
}

exports.GetThousandDataArray =  function(data) {
    var arrayThousandData = []
    if (data.length <= 1000) {
        var length = data.length
        for (let i = 0; i < length; i++) {
            arrayThousandData.push(data[i])
        }
    } else {
        for (let i = 0; i < 1000; i++) {
            arrayThousandData.push(data[i])
        }
    }
    return arrayThousandData
}

//metodos para la busqueda de información de cada tabla a eliminar en la simulación
exports.AsyncGetSimulation = async (simulationPtr, callback) => {
    var Table = Parse.Object.extend("Simulations")
    var query = new Parse.Query(Table)

    query.equalTo("objectId", simulationPtr)

    try {
        const results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetSimulationtEvents = async (simulationPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("SimulationsEvents")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr", simulationPtr)
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetSimulationtEvents(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetSimulationsEventPipe = async (simulationPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("SimulationsEventPipe")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr", simulationPtr)
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetSimulationsEventPipe(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetSimulationsDeliveredRawMaterial = async (simulationPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("SimulationsDeliveredRawMaterial")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr", simulationPtr)
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetSimulationsDeliveredRawMaterial(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetSimulationsInventory = async (simulationPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("SimulationsInventory")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr", simulationPtr)
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetSimulationsInventory(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetSimulationsLogs = async (simulationPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("SimulationsLogs")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr", simulationPtr)
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetSimulationsLogs(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetThousandSimulationsLogs = async (simulationPtr, numberCicle, numberStop , index, dataArray, callback) => {
    var Table = Parse.Object.extend("SimulationsLogs")
    var query = new Parse.Query(Table)

    query.containedIn("simulationPtr", simulationPtr)
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        //callback(results, null)
        if (numberCicle == numberStop ) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetThousandSimulationsLogs(simulationPtr, (numberCicle + 1), numberStop, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetSimulationsOrders = async (simulationPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("SimulationsOrders")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr", simulationPtr)
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetSimulationsOrders(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetSimulationsOrdersPurchasings = async (simulationPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("SimulationsOrdersPurchasings")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr", simulationPtr)
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetSimulationsOrdersPurchasings(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetSimulationsOrdersSuppliers = async (simulationPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("SimulationsOrdersSuppliers")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr", simulationPtr)
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetSimulationsOrdersSuppliers(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetTDActivatedProductionLine = async (simulationPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("TDActivatedProductionLine")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr", simulationPtr)
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetTDActivatedProductionLine(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetTDMActivosFijosInventario = async (simulationPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("TDMActivosFijosInventario")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr", simulationPtr)
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetTDMActivosFijosInventario(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetTDMEmployees = async (simulationPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("TDMEmployees")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr", simulationPtr)
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetTDMEmployees(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetTDProductionLine = async (simulationPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("TDProductionLine")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr", simulationPtr)
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetTDProductionLine(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetTDProductoFamilia = async (simulationPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("TDProductoFamilia")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr", simulationPtr)
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetTDProductoFamilia(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetTDSimulationFinancialLog = async (simulationPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("TDSimulationFinancialLog")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr", simulationPtr)
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetTDSimulationFinancialLog(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetSimulationsTeams = async (simulationPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("SimulationsTeams")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr", simulationPtr)
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetSimulationsTeams(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetSimulationsPurchasing = async (simulationPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("SimulationsPurchasing")
    var query = new Parse.Query(Table)

    query.containedIn("teamPtr", simulationPtr)
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetSimulationsPurchasing(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetSDMActivosFijos = async (simulationPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("SDMActivosFijos")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr", simulationPtr)
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetSDMActivosFijos(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetSDMActivosFijosInventario = async (simulationPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("SDMActivosFijosInventario")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr", simulationPtr)
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetSDMActivosFijosInventario(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetSDMClientes = async (simulationPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("SDMClientes")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr", simulationPtr)
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetSDMClientes(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetSDMEmpleados = async (simulationPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("SDMEmpleados")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr", simulationPtr)
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetSDMEmpleados(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetSDMGastos = async (simulationPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("SDMGastos")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr", simulationPtr)
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetSDMGastos(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetSDMMateriaPrimaInventario = async (simulationPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("SDMMateriaPrimaInventario")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr", simulationPtr)
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetSDMMateriaPrimaInventario(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetSDMProductionLinePhases = async (simulationPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("SDMProductionLinePhases")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr", simulationPtr)
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetSDMProductionLinePhases(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetSDMProductionLineTemplates = async (simulationPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("SDMProductionLineTemplates")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr", simulationPtr)
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetSDMProductionLineTemplates(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetSDMProductoFamilia = async (simulationPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("SDMProductoFamilia")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr", simulationPtr)
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetSDMProductoFamilia(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetSDMProveedores = async(simulationPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("SDMProveedores")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr", simulationPtr)
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetSDMProveedores(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetSDMProveedoresMP = async (simulationPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("SDMProveedoresMP")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr", simulationPtr)
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetSDMProveedoresMP(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetSDMSalaryTabulator = async (simulationPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("SDMSalaryTabulator")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr", simulationPtr)
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetSDMSalaryTabulator(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetSDMTransporte = async (simulationPtr, index, dataArray, callback) => {
    var Table = Parse.Object.extend("SDMTransporte")
    var query = new Parse.Query(Table)

    query.equalTo("simulationPtr", simulationPtr)
    query.limit(1000)
    query.skip(index * 1000)

    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetSDMTransporte(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.GetEmployees = function(){
    return new Promise(function (resolve, reject) {
        exports.AsyncGetEmployees(0,[], function (results, error){
            if(error) { return resolve({ type: "CONSULTA", data: null, error: error.message })}
            resolve({ type: "CONSULTA", data: results, error: null})
        })
    })
}

exports.AsyncGetEmployees = async (index, dataArray, callback)=> {
    var Table = Parse.Object.extend("DMEmpleados")
    var query = new Parse.Query(Table)

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
            exports.AsyncGetEmployees((index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.getAllSMDSalaryTabulatorAndSMDEmployees = function(simulationPtr){
   /* var Simulations             = Parse.Object.extend("Simulations")
    var pointerToSimulation     = new Simulations()
        pointerToSimulation.id  = simulationPtr*/
    return new Promise(function (resolve, reject) {
        exports.AsyncGetAllSDMSalaryTabulator(simulationPtr,0,[], function (resultsTabulator, error){
            if(error){ return resolve({ type: "CONSULTA", data: null, error: error.message }) }
            exports.AsyncGetAllSDEmployees(simulationPtr,0,[], function (resultsEmployees, error){
                if (error) { return resolve({ type: "CONSULTA", data: null, error: error.message }) }
                resolve({ type: "CONSULTA", dataSDMTabulator: resultsTabulator, dataSDMEmployees:resultsEmployees })
            })
        })
    })
}

exports.AsyncGetAllSDMSalaryTabulator = async(simulationPtr,index, dataArray, callback)=>{
    var Table = Parse.Object.extend("SDMSalaryTabulator")
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
            exports.AsyncGetAllSDMSalaryTabulator(simulationPtr,(index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncGetAllSDEmployees = async(simulationPtr, index, dataArray, callback)=>{
    var Table = Parse.Object.extend("SDMEmpleados")
    var query = new Parse.Query(Table)

        query.equalTo("simulationPtr",simulationPtr)
        query.equalTo("exists",true)
        query.equalTo("active", true)
        query.include("DMsalaryTabulatorPtr")
        query.limit(1000)
        query.skip(index * 1000)
    
    try {
        var results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        }else{
            dataArray.push.apply(dataArray, results)
            exports.AsyncGetAllSDEmployees(simulationPtr,(index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

exports.PauseOrRunSimulation = async ( data, objectId ) => {

        try {
            var results = await AsyncGetSimulationObject( data['objectId'] )
        } catch (error) {
            log(error)
            return { data : null, error: error.error }
        }
    
        if(data["sePausa"] == 'false'){

            var simulacionPause = results.data
            simulacionPause.set("status","PAUSED")
            try {
                var resultsSave = await simulacionPause.save()
            } catch (error) {
                log(error)
                return { data : null, error: error.error }
            }
            
            return { data:resultsSave, error: null}
        }

        try {
            var resultsEquipos = await exports.AsynBuscarEquiposProfesor(objectId)
        } catch (error) {
            log(error)
            return { data : null, error: error.error }
        }

        var groups = _.map(resultsEquipos.data, function(object) {
            return object.get("grupoPtr").id
        })

        try {
            var simuations = await exports.AsynBuscarGruposProfesor(groups)
        } catch (error) {
            log(error)
            return { data: null, error: error.error}
        }

        var simulationRunning = results.data

        var simulationPauseAll = _.filter( simuations.data, function(current) {
            return current.get('groupPtr').id== simulationRunning.get('groupPtr').id
        })

        var simulationPause = _.filter( simulationPauseAll, function(current) {
            return current.id != simulationRunning.id
        })

        for (let i = 0; i < simulationPause.length; i++) {
            if(i > 1){
                simulationPause[i].set( "status", "PAUSED" )
            }
        }

        try {
            await Parse.Object.saveAll(simulationPause)
        } catch (error) {
            log(error)
            return { data: null, error: error.error}
        }

        simulationRunning.set( "status", "RUNNING" )

        try {
            var results = await simulationRunning.save()
        } catch (error) {
            log(error)
            return { data: null, error: error.error}
        }

        return { data: results, error: null}
    
}

async function AsyncGetSimulationObject( simulationPtr ){
    var Table = Parse.Object.extend("Simulations")
    var query = new Parse.Query(Table)

    query.equalTo("objectId", simulationPtr)

    try {
        var results = await query.first()
    } catch (error) {
        log( error )
        return { data : null, error: error }
    }
    return { data: results, error: null }
}

exports.AsynBuscarEquiposProfesor = async ( objectId ) => {
    var Table = Parse.Object.extend("GruposUsuarios")
    var query = new Parse.Query(Table)
    
	var count = 0
	try {
		count = await query.count()
	} catch (error) {
		log(error)
		return { results: null, error: error.error }
	}

	var results = []
	var noQueries = Math.ceil(count / LIMIT_NUMBER_RESULTS)

	for (let i = 0; i < noQueries; i++) {
        var Groups = Parse.Object.extend("Grupos")
        var innerQuery = new Parse.Query(Groups)

        innerQuery.equalTo("exists", true)
        query.matchesQuery("grupoPtr", innerQuery);

        //log(adviser.id)
        query.equalTo("exists", true)
        query.equalTo("usuarioPtr", objectId)
        query.include("grupoPtr")

		query.limit( LIMIT_NUMBER_RESULTS )
		query.skip( i*LIMIT_NUMBER_RESULTS )

		try {
			var tempResult = await query.find()
			results.push.apply( results, tempResult )
		} catch (error) {
			log(error)
			return { results: null, error: error.error }
		}
	}

	return { data: results, error: null}
}

exports.AsynBuscarGruposProfesor = async ( groups ) => {
    var Table = Parse.Object.extend("Simulations")
    var query = new Parse.Query(Table)
    
	var count = 0
	try {
		count = await query.count()
	} catch (error) {
		log(error)
		return { results: null, error: error.error }
	}

	var results = []
	var noQueries = Math.ceil(count / LIMIT_NUMBER_RESULTS)

	for (let i = 0; i < noQueries; i++) {
        var Grupos = Parse.Object.extend("Grupos")
        var innerquery = new Parse.Query(Grupos)
        innerquery.containedIn("objectId", groups)

        query.equalTo("exists", true)
        query.include("groupPtr")
        query.descending("status")
        query.addDescending("updateAt")
        query.matchesQuery("groupPtr", innerquery);

		query.limit( LIMIT_NUMBER_RESULTS )
		query.skip( i*LIMIT_NUMBER_RESULTS )

		try {
			var tempResult = await query.find()
			results.push.apply( results, tempResult )
		} catch (error) {
			log(error)
			return { results: null, error: error.error }
		}
	}

	return { data: results, error: null}
}

exports.restartEmployees = async ( objectId ) => {
    var Table = Parse.Object.extend("Simulations")
    var simulationPtr = new Table()
        simulationPtr.id = objectId
    log("profesor restablecer modelo")
    try {
        var EmployeesSalaryPtrNotFoundTempo = await exports.GetAllData( "SDMEmpleados", simulationPtr )
        var EmployeesSalaryPtrNotFound = EmployeesSalaryPtrNotFoundTempo.data
        var DMSalaryTabulatorTempo = await exports.GetAllData( "SDMSalaryTabulator", simulationPtr )
        var DMSalaryTabulator = DMSalaryTabulatorTempo.data
    } catch (error) {
        log( error )
        return { data: null, error: error.error }
    }

    var SaveEmployeesSalaryPtrNotFound = _.filter( EmployeesSalaryPtrNotFound, function(current){
        return current.get("SDMsalaryTabulatorPtr") == undefined
    })

    var index = 0
    for (let i = 0; i < SaveEmployeesSalaryPtrNotFound.length; i++) {
        if( DMSalaryTabulator.length-1 == i ){
            index = 0
        }
        var DMSalaryTabulatorTable = Parse.Object.extend("DMSalaryTabulator")
        var salary = new DMSalaryTabulatorTable()
            salary.id = DMSalaryTabulator[index].get("referenciaId")
        SaveEmployeesSalaryPtrNotFound[i].set( "SDMsalaryTabulatorPtr", DMSalaryTabulator[index] )
        SaveEmployeesSalaryPtrNotFound[i].set( "DMsalaryTabulatorPtr", salary )
        index++
    }
    log(SaveEmployeesSalaryPtrNotFound.length)
    var EmployeesSalaryPtrEmpty = _.filter( EmployeesSalaryPtrNotFound, function(current){
        return current.get("SDMsalaryTabulatorPtr").get("area") == undefined
    })

    log(EmployeesSalaryPtrEmpty.length)
    var index = 0
    for (let i = 0; i < EmployeesSalaryPtrEmpty.length; i++) {
        if( DMSalaryTabulator.length-1 == i ){
            index = 0
        }
        var DMSalaryTabulatorTable = Parse.Object.extend("DMSalaryTabulator")
        var salary = new DMSalaryTabulatorTable()
            salary.id = DMSalaryTabulator[index].get("referenciaId")
        SaveEmployeesSalaryPtrNotFound[i].set( "SDMsalaryTabulatorPtr", DMSalaryTabulator[index] )
        SaveEmployeesSalaryPtrNotFound[i].set( "DMsalaryTabulatorPtr", salary )
        index++
    }

    var EmployeesReferenceIdEmpty = _.filter( EmployeesSalaryPtrNotFound, function(current){
        return current.get("DMsalaryTabulatorPtr") == undefined
    })

    log(EmployeesReferenceIdEmpty.length)
    var index = 0
    for (let i = 0; i < EmployeesReferenceIdEmpty.length; i++) {
        if( DMSalaryTabulator.length-1 == i ){
            index = 0
        }
        var DMSalaryTabulatorTable = Parse.Object.extend("DMSalaryTabulator")
        var salary = new DMSalaryTabulatorTable()
            salary.id = DMSalaryTabulator[index].get("referenciaId")
        EmployeesReferenceIdEmpty[i].set( "SDMsalaryTabulatorPtr", DMSalaryTabulator[index] )
        EmployeesReferenceIdEmpty[i].set( "DMsalaryTabulatorPtr", salary )
        index++
    }

    try {
        var resultSave = await Parse.Object.saveAll( SaveEmployeesSalaryPtrNotFound )
        var resultSave2 = await Parse.Object.saveAll( EmployeesSalaryPtrEmpty )
        var resultSave3 = await Parse.Object.saveAll( EmployeesReferenceIdEmpty )
    } catch (error) {
        log( error )
        return { data: null, error: error.error }
    }
    resultSave.push( resultSave2 )
    return { data: resultSave, error: null }
}

exports.GetAllData = async ( TableName, objectId ) => {
    var Table = Parse.Object.extend( TableName )
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
        query.equalTo( "simulationPtr", objectId )
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

exports.restartSDMSalary = async ( simulationId, type ) => {
    var result = undefined
    if( type == 'SALARY' ){
        try {
            result = await exports.AddReferenceIdSDMSarestartSalarylaryTabulator ( simulationId )
        } catch (error) {
            log( error )
            return { data: null, error: error.error }
        }
    }else if( type == 'RESTART_SALARY_EMPLOYEES'){
        try {
            result = await  exports.RestartSalryAndEmployees ( simulationId )
        } catch (error) {
            log( error )
            return { data: null, error: error.error }
        }
       
    }

    return { data: result, error: null }
}

exports.AddReferenceIdSDMSarestartSalarylaryTabulator = async ( simulationId ) => {
    var Table = Parse.Object.extend("Simulations")
    var simulationPtr = new Table()
        simulationPtr.id = simulationId

    try {
        var DMsalaryTempo = await exports.GetDMSalaryTabulator()
        var DMsalary = DMsalaryTempo.data

        var SDMsalaryTempo = await  exports.GetAllData( "SDMSalaryTabulator", simulationPtr )
        var SDMsalary = SDMsalaryTempo.data
    } catch (error) {
        log( error )
        return { data: null, error: error.error }
    }

    for (let i = 0; i < SDMsalary.length; i++) {
        var salary = _.find( DMsalary, function(current) {
            return current.get("area") == SDMsalary[i].get("area") && current.get("department") == SDMsalary[i].get("department")
        })
        if(salary){
            SDMsalary[i].set( "referenciaId", salary.id )
        }
    }

    try {
        var resultsSave = await Parse.Object.saveAll( SDMsalary )
    } catch (error) {
        log( error )
        return { data: null, error: error.error }
    }
    return { data: resultsSave, error: null }

}

exports.GetDMSalaryTabulator = async() => {
    var Table = Parse.Object.extend( "DMSalaryTabulator" )
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

exports.RestartSalryAndEmployees = async ( simulationId ) => {

    var Table = Parse.Object.extend("Simulations")
    var simulationPtr = new Table()
        simulationPtr.id = simulationId

    try {

       var salaryRestart = await exports.AddReferenceIdSDMSarestartSalarylaryTabulator ( simulationId )

        var salaryTempo = await  exports.GetAllData( "SDMSalaryTabulator", simulationPtr )
        var salary = salaryTempo.data

        var EmployeesTempo = await exports.GetAllData( "SDMEmpleados", simulationPtr )
        var Employees = EmployeesTempo.data

    } catch (error) {
        log( error )
        return { data: null, error: error.error }
    }

    var index = 0
    for (let i = 0; i < Employees.length; i++) {
        if( salary.length-1 == i ){
            index = 0
        }

        var DMSalaryTabulatorTable = Parse.Object.extend("DMSalaryTabulator")
        var salaryPtr = new DMSalaryTabulatorTable()
            salaryPtr.id = salary[index].get("referenciaId")

        Employees[i].set( "SDMsalaryTabulatorPtr", salary[index] )
        Employees[i].set( "DMsalaryTabulatorPtr", salaryPtr )
        index++
    }

    try {
        var result = await Parse.Object.saveAll( Employees )
    } catch (error) {
        log( error )
        return { data: null, error: error.error }
    }
    log(salaryRestart.data.length)
    log(result.length)

    result.push.apply(result, salaryRestart.data)
    log(result.length)

    return { data: result, error: null }
}