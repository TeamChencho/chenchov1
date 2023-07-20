var path = require('path')
var fs = require('fs')
var _ = require('underscore')
var Promise = require('promise')
var request = require('request')
var CryptoJS = require("crypto-js");

var log = console.log
var cserror = console.error

let Seguridad = require(path.resolve(__dirname, '../middlewares/utils/seguridad.util'));

//var FunctionsGeneral = require(path.join(__dirname, '../../functions/general.js'));
var rawdataTesting = fs.readFileSync(path.resolve(__dirname, '../../dev-novustec.json'))
var TESTING_ENVIRONMENT = JSON.parse(rawdataTesting)

//log(TESTING_ENVIRONMENT.apps[0].env)

var Parse = require('parse/node');

const APP_ID = process.env.APP_ID || TESTING_ENVIRONMENT.apps[0].env.APP_ID
const MASTER_KEY = process.env.MASTER_KEY || TESTING_ENVIRONMENT.apps[0].env.MASTER_KEY

Parse._initialize(APP_ID, "", MASTER_KEY)
Parse.serverURL = process.env.PUBLIC_SERVER_URL || TESTING_ENVIRONMENT.apps[0].env.PUBLIC_SERVER_URL

DeleteSimulation("iyIUDWUTVY")

function DeleteSimulation(simulationPtr) {

    var Simulation = Parse.Object.extend("Simulations")
    var pointerToSimulation = new Simulation()
    pointerToSimulation.id = simulationPtr

    return new Promise(function (resolve, reject) {

        //Table Simualtion
        AsyncGetSimulation(simulationPtr, function (resulSimulation, error) {
            var array = []
            array.push(resulSimulation)
            log("before to delete " + array.length + " data from table Simualtion")
            AsyncDeleteDataBD(array, [], function (resultsDeletedSimulation, error) {
                log("after to delete " + resultsDeletedSimulation.length + " data from table Simualtion")

                //Table SimualtionEvents
                AsyncGetSimulationtEvents(pointerToSimulation, 0, [], function (resultsSimulationEvents, error) {
                    log("before to delete " + resultsSimulationEvents.length + " data from table SimualtionEvents")
                    AsyncDeleteDataBD(resultsSimulationEvents, [], function (resultsDeletedSimulationEvents, error) {
                        log("after to delete " + resultsDeletedSimulationEvents.length + " data from table SimualtionEvents")

                        //Table SimualtionEventsPipe
                        AsyncGetSimulationsEventPipe(pointerToSimulation, 0, [], function (resultsSimulationEventsPipe, error) {
                            log("before to delete " + resultsSimulationEventsPipe.length + " data from table SimualtionEventsPipe")
                            AsyncDeleteDataBD(resultsSimulationEventsPipe, [], function (resultsDeletedSimulationEventsPipe, error) {
                                log("after to delete " + resultsDeletedSimulationEventsPipe.length + " data from table SimualtionEventsPipe")

                                //Table SimulationsDeliveredRawMaterial
                                AsyncGetSimulationsDeliveredRawMaterial(pointerToSimulation, 0, [], function (resultsSimulationsDeliveredRawMaterial, error) {
                                    log("before to delete " + resultsSimulationsDeliveredRawMaterial.length + " data from table SimulationsDeliveredRawMaterial")
                                    AsyncDeleteDataBD(resultsSimulationsDeliveredRawMaterial, [], function (resultsDeletedSimulationsDeliveredRawMaterial, error) {
                                        log("after to delete " + resultsDeletedSimulationsDeliveredRawMaterial.length + " data from table SimulationsDeliveredRawMaterial")

                                        //Table SimulationsInventory
                                        AsyncGetSimulationsInventory(pointerToSimulation, 0, [], function (resultsSimulationsInventory, error) {
                                            log("before to delete " + resultsSimulationsInventory.length + " data from table SimulationsInventory")
                                            AsyncDeleteDataBD(resultsSimulationsInventory, [], function (resultsDeletedSimulationsInventory, error) {
                                                log("after to delete " + resultsDeletedSimulationsInventory.length + " data from table SimulationsInventory")

                                                //Table SimulationsLogs
                                                AsyncGetSimulationsLogs(pointerToSimulation, 0, [], function (resultsSimulationsLogs, error) {
                                                    log("before to delete " + resultsSimulationsLogs.length + " data from table SimulationsLogs")
                                                    AsyncDeleteDataBD(resultsSimulationsLogs, [], function (resultsDeletedSimulationsLogs, error) {
                                                        log("after to delete " + resultsDeletedSimulationsLogs.length + " data from table SimulationsLogs")

                                                        //Table SimulationsOrders
                                                        AsyncGetSimulationsOrders(pointerToSimulation, 0, [], function (resultsSimulationsOrders, error) {
                                                            log("before to delete " + resultsSimulationsOrders.length + " data from table SimulationsOrders")
                                                            AsyncDeleteDataBD(resultsSimulationsOrders, [], function (resultsDeletedSimulationsOrders, error) {
                                                                log("after to delete " + resultsDeletedSimulationsOrders.length + " data from table SimulationsOrders")

                                                                //Table SimulationsOrdersPurchasings
                                                                AsyncGetSimulationsOrdersPurchasings(pointerToSimulation, 0, [], function (resultsSimulationsOrdersPurchasings, error) {
                                                                    log("before to delete " + resultsSimulationsOrdersPurchasings.length + " data from table SimulationsOrdersPurchasings")
                                                                    AsyncDeleteDataBD(resultsSimulationsOrdersPurchasings, [], function (resultsDeletedSimulationsOrdersPurchasings, error) {
                                                                        log("after to delete " + resultsDeletedSimulationsOrdersPurchasings.length + " data from table SimulationsOrdersPurchasings")

                                                                        //Table SimulationsOrdersSuppliers
                                                                        AsyncGetSimulationsOrdersSuppliers(pointerToSimulation, 0, [], function (resultsSimulationsOrdersSuppliers, error) {
                                                                            log("before to delete " + resultsSimulationsOrdersSuppliers.length + " data from table SimulationsOrdersSuppliers")
                                                                            AsyncDeleteDataBD(resultsSimulationsOrdersSuppliers, [], function (resultsDeletedSimulationsOrdersSuppliers, error) {
                                                                                log("after to delete " + resultsDeletedSimulationsOrdersSuppliers.length + " data from table SimulationsOrdersSuppliers")

                                                                                //Table SimulationsTeams
                                                                                AsyncGetSimulationsTeams(pointerToSimulation, 0, [], function (resultsSimulationsTeams, error) {
                                                                                    log("before to delete " + resultsSimulationsTeams.length + " data from table SimulationsTeams")
                                                                                    AsyncDeleteDataBD(resultsSimulationsTeams, [], function (resultsDeletedSimulationsTeams, error) {
                                                                                        log("after to delete " + resultsDeletedSimulationsTeams.length + " data from table SimulationsTeams")

                                                                                        //Table SimulationsPurchasing
                                                                                        AsyncGetSimulationsPurchasing(resultsDeletedSimulationsTeams, 0, [], function (resultsSimulationsPurchasing, error) {
                                                                                            log("before to delete " + resultsSimulationsPurchasing.length + " data from table SimulationsPurchasing")
                                                                                            AsyncDeleteDataBD(resultsSimulationsPurchasing, [], function (resultsDeletedSimulationsPurchasing, error) {
                                                                                                log("after to delete " + resultsDeletedSimulationsPurchasing.length + " data from table SimulationsPurchasing")

                                                                                                DeleteTDSimulation(pointerToSimulation, function (error) {
                                                                                                    if (error) {
                                                                                                        log(error)
                                                                                                    } else {
                                                                                                        log("Simulation Succes Deleted")
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
            /*
            Parse.Object.destroyAll(array).then((result) => {

                log("result deleted "+ result)

                AsyncGetSimulationtEvents (pointerToSimulation, 0, [], function (resultsSimulationEvents, error) {
                    log(resultsSimulationEvents)
                })

            },(error) => {

                cserror("error "+ error.message)

                AsyncGetSimulationtEvents (pointerToSimulation, 0, [], function (resultsSimulationEvents, error) {
                    log(resultsSimulationEvents) 
                })

            })*/
        })

    })
}

function DeleteTDSimulation(pointerToSimulation, callback) {
    //Table TDActivatedProductionLine
    AsyncGetTDActivatedProductionLine(pointerToSimulation, 0, [], function (resultsTDActivatedProductionLine, error) {
        log("before to delete " + resultsTDActivatedProductionLine.length + " data from table TDActivatedProductionLine")
        AsyncDeleteDataBD(resultsTDActivatedProductionLine, [], function (resultsDeletedTDActivatedProductionLine, error) {
            log("after to delete " + resultsDeletedTDActivatedProductionLine.length + " data from table TDActivatedProductionLine")

            //Table TDMActivosFijosInventario
            AsyncGetTDMActivosFijosInventario(pointerToSimulation, 0, [], function (resultsTDMActivosFijosInventario, error) {
                log("before to delete " + resultsTDMActivosFijosInventario.length + " data from table TDMActivosFijosInventario")
                AsyncDeleteDataBD(resultsTDMActivosFijosInventario, [], function (resultsDeletedTDMActivosFijosInventario, error) {
                    log("after to delete " + resultsDeletedTDMActivosFijosInventario.length + " data from table TDMActivosFijosInventario")

                    //Table TDMEmployees
                    AsyncGetTDMEmployees(pointerToSimulation, 0, [], function (resultsTDMEmployees, error) {
                        log("before to delete " + resultsTDMEmployees.length + " data from table TDMEmployees")
                        AsyncDeleteDataBD(resultsTDMEmployees, [], function (resultsDeletedTDMEmployees, error) {
                            log("after to delete " + resultsDeletedTDMEmployees.length + " data from table TDMEmployees")

                            //Table TDProductionLine
                            AsyncGetTDProductionLine(pointerToSimulation, 0, [], function (resultsTDProductionLine, error) {
                                log("before to delete " + resultsTDProductionLine.length + " data from table TDProductionLine")
                                AsyncDeleteDataBD(resultsTDProductionLine, [], function (resultsDeletedTDProductionLine, error) {
                                    log("after to delete " + resultsDeletedTDProductionLine.length + " data from table TDProductionLine")

                                    //Table TDProductoFamilia
                                    AsyncGetTDProductoFamilia(pointerToSimulation, 0, [], function (resultsTDProductoFamilia, error) {
                                        log("before to delete " + resultsTDProductoFamilia.length + " data from table TDProductoFamilia")
                                        AsyncDeleteDataBD(resultsTDProductoFamilia, [], function (resultsDeletedTDProductoFamilia, error) {
                                            log("after to delete " + resultsDeletedTDProductoFamilia.length + " data from table TDProductoFamilia")

                                            //Table TDSimulationFinancialLog
                                            AsyncGetTDSimulationFinancialLog(pointerToSimulation, 0, [], function (resultsTDSimulationFinancialLog, error) {
                                                log("before to delete " + resultsTDSimulationFinancialLog.length + " data from table TDSimulationFinancialLog")
                                                AsyncDeleteDataBD(resultsTDSimulationFinancialLog, [], function (resultsDeletedTDSimulationFinancialLog, error) {
                                                    log("after to delete " + resultsDeletedTDSimulationFinancialLog.length + " data from table TDSimulationFinancialLog")

                                                    DeleteSDMSimulation(pointerToSimulation, function (error) {
                                                        if (error) {
                                                            log(error)
                                                        } else {
                                                            log("Simulation Succes Deleted")
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

function DeleteSDMSimulation(pointerToSimulation, callback) {
     //Table SDMActivosFijos
     AsyncGetSDMActivosFijos(pointerToSimulation, 0, [], function (resultsSDMActivosFijos, error) {
        log("before to delete " + resultsSDMActivosFijos.length + " data from table SDMActivosFijos")
        AsyncDeleteDataBD(resultsSDMActivosFijos, [], function (resultsDeletedSDMActivosFijos, error) {
            log("after to delete " + resultsDeletedSDMActivosFijos.length + " data from table SDMActivosFijos")
            //callback(null)

            //Table SDMActivosFijosInventario
            AsyncGetSDMActivosFijosInventario(pointerToSimulation, 0, [], function (resultsSDMActivosFijosInventario, error) {
                log("before to delete " + resultsSDMActivosFijosInventario.length + " data from table SDMActivosFijosInventario")
                AsyncDeleteDataBD(resultsSDMActivosFijosInventario, [], function (resultsDeletedSDMActivosFijosInventario, error) {
                    log("after to delete " + resultsDeletedSDMActivosFijosInventario.length + " data from table SDMActivosFijosInventario")
                    //callback(null)

                    //Table SDMClientes
                    AsyncGetSDMClientes(pointerToSimulation, 0, [], function (resultsSDMClientes, error) {
                        log("before to delete " + resultsSDMClientes.length + " data from table SDMClientes")
                        AsyncDeleteDataBD(resultsSDMClientes, [], function (resultsDeletedSDMClientes, error) {
                            log("after to delete " + resultsDeletedSDMClientes.length + " data from table SDMClientes")
                            //callback(null)

                            //Table SDMEmpleados
                            AsyncGetSDMEmpleados(pointerToSimulation, 0, [], function (resultsSDMEmpleados, error) {
                                log("before to delete " + resultsSDMEmpleados.length + " data from table SDMEmpleados")
                                AsyncDeleteDataBD(resultsSDMEmpleados, [], function (resultsDeletedSDMEmpleados, error) {
                                    log("after to delete " + resultsDeletedSDMEmpleados.length + " data from table SDMEmpleados")
                                    //callback(null)

                                    //Table SDMGastos
                                    AsyncGetSDMGastos(pointerToSimulation, 0, [], function (resultsSDMGastos, error) {
                                        log("before to delete " + resultsSDMGastos.length + " data from table SDMGastos")
                                        AsyncDeleteDataBD(resultsSDMGastos, [], function (resultsDeletedSDMGastos, error) {
                                            log("after to delete " + resultsDeletedSDMGastos.length + " data from table SDMGastos")
                                            //callback(null)

                                            //Table SDMMateriaPrimaInventario
                                            AsyncGetSDMMateriaPrimaInventario(pointerToSimulation, 0, [], function (resultsSDMMateriaPrimaInventario, error) {
                                                log("before to delete " + resultsSDMMateriaPrimaInventario.length + " data from table SDMMateriaPrimaInventario")
                                                AsyncDeleteDataBD(resultsSDMMateriaPrimaInventario, [], function (resultsDeletedSDMMateriaPrimaInventario, error) {
                                                    log("after to delete " + resultsDeletedSDMMateriaPrimaInventario.length + " data from table SDMMateriaPrimaInventario")
                                                    //callback(null)

                                                    //Table SDMProductionLinePhases
                                                    AsyncGetSDMProductionLinePhases(pointerToSimulation, 0, [], function (resultsSDMProductionLinePhases, error) {
                                                        log("before to delete " + resultsSDMProductionLinePhases.length + " data from table SDMProductionLinePhases")
                                                        AsyncDeleteDataBD(resultsSDMProductionLinePhases, [], function (resultsDeletedSDMProductionLinePhases, error) {
                                                            log("after to delete " + resultsDeletedSDMProductionLinePhases.length + " data from table SDMProductionLinePhases")
                                                            //callback(null)

                                                            //Table SDMProductionLineTemplates
                                                            AsyncGetSDMProductionLineTemplates(pointerToSimulation, 0, [], function (resultsSDMProductionLineTemplates, error) {
                                                                log("before to delete " + resultsSDMProductionLineTemplates.length + " data from table SDMProductionLineTemplates")
                                                                AsyncDeleteDataBD(resultsSDMProductionLineTemplates, [], function (resultsDeletedSDMProductionLineTemplates, error) {
                                                                    log("after to delete " + resultsDeletedSDMProductionLineTemplates.length + " data from table SDMProductionLineTemplates")
                                                                    //callback(null)

                                                                    //Table SDMProductoFamilia
                                                                    AsyncGetSDMProductoFamilia(pointerToSimulation, 0, [], function (resultsSDMProductoFamilia, error) {
                                                                        log("before to delete " + resultsSDMProductoFamilia.length + " data from table SDMProductoFamilia")
                                                                        AsyncDeleteDataBD(resultsSDMProductoFamilia, [], function (resultsDeletedSDMProductoFamilia, error) {
                                                                            log("after to delete " + resultsDeletedSDMProductoFamilia.length + " data from table SDMProductoFamilia")
                                                                            //callback(null)

                                                                            //Table SDMProveedores
                                                                            AsyncGetSDMProveedores(pointerToSimulation, 0, [], function (resultsSDMProveedores, error) {
                                                                                log("before to delete " + resultsSDMProveedores.length + " data from table SDMProveedores")
                                                                                AsyncDeleteDataBD(resultsSDMProveedores, [], function (resultsDeletedSDMProveedores, error) {
                                                                                    log("after to delete " + resultsDeletedSDMProveedores.length + " data from table SDMProveedores")
                                                                                    //callback(null)

                                                                                    //Table SDMProveedoresMP
                                                                                    AsyncGetSDMProveedoresMP(pointerToSimulation, 0, [], function (resultsSDMProveedoresMP, error) {
                                                                                        log("before to delete " + resultsSDMProveedoresMP.length + " data from table SDMProveedoresMP")
                                                                                        AsyncDeleteDataBD(resultsSDMProveedoresMP, [], function (resultsDeletedSDMProveedoresMP, error) {
                                                                                            log("after to delete " + resultsDeletedSDMProveedoresMP.length + " data from table SDMProveedoresMP")
                                                                                            //callback(null)

                                                                                            //Table SDMSalaryTabulator
                                                                                            AsyncGetSDMSalaryTabulator(pointerToSimulation, 0, [], function (resultsSDMSalaryTabulator, error) {
                                                                                                log("before to delete " + resultsSDMSalaryTabulator.length + " data from table SDMSalaryTabulator")
                                                                                                AsyncDeleteDataBD(resultsSDMSalaryTabulator, [], function (resultsDeletedSDMSalaryTabulator, error) {
                                                                                                    log("after to delete " + resultsDeletedSDMSalaryTabulator.length + " data from table SDMSalaryTabulator")
                                                                                                    //callback(null)

                                                                                                    //Table SDMTransporte
                                                                                                    AsyncGetSDMTransporte(pointerToSimulation, 0, [], function (resultsSDMTransporte, error) {
                                                                                                        log("before to delete " + resultsSDMTransporte.length + " data from table SDMTransporte")
                                                                                                        AsyncDeleteDataBD(resultsSDMTransporte, [], function (resultsDeletedSDMTransporte, error) {
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
async function AsyncDeleteDataBD(data, dataArray, callback) {
    try {
        if (data.length <= 0) {
            callback(dataArray, null)
        } else {
            var dataThousand = GetThousandDataArray(data)
            var newData = DeletedThousandDataArray(data)

            Parse.Object.destroyAll(dataThousand).then((result) => {

                //log("result deleted " + result)
                dataArray.push.apply(dataArray, dataThousand)
                AsyncDeleteDataBD(newData, dataArray, callback)

            }, (error) => {

                //log("error " + error.message)
                dataArray.push.apply(dataArray, dataThousand)
                AsyncDeleteDataBD(newData, dataArray, callback)

            })
        }
    } catch (error) {
        callback(null, error)
    }
}

function DeletedThousandDataArray(data) {
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

function GetThousandDataArray(data) {
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
async function AsyncGetSimulation(simulationPtr, callback) {
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

async function AsyncGetSimulationtEvents(simulationPtr, index, dataArray, callback) {
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
            AsyncGetSimulationtEvents(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

async function AsyncGetSimulationsEventPipe(simulationPtr, index, dataArray, callback) {
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
            AsyncGetSimulationsEventPipe(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

async function AsyncGetSimulationsDeliveredRawMaterial(simulationPtr, index, dataArray, callback) {
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
            AsyncGetSimulationsDeliveredRawMaterial(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

async function AsyncGetSimulationsInventory(simulationPtr, index, dataArray, callback) {
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
            AsyncGetSimulationsInventory(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

async function AsyncGetSimulationsLogs(simulationPtr, index, dataArray, callback) {
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
            AsyncGetSimulationsLogs(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

async function AsyncGetSimulationsOrders(simulationPtr, index, dataArray, callback) {
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
            AsyncGetSimulationsOrders(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

async function AsyncGetSimulationsOrdersPurchasings(simulationPtr, index, dataArray, callback) {
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
            AsyncGetSimulationsOrdersPurchasings(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

async function AsyncGetSimulationsOrdersSuppliers(simulationPtr, index, dataArray, callback) {
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
            AsyncGetSimulationsOrdersSuppliers(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

async function AsyncGetTDActivatedProductionLine(simulationPtr, index, dataArray, callback) {
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
            AsyncGetTDActivatedProductionLine(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

async function AsyncGetTDMActivosFijosInventario(simulationPtr, index, dataArray, callback) {
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
            AsyncGetTDMActivosFijosInventario(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

async function AsyncGetTDMEmployees(simulationPtr, index, dataArray, callback) {
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
            AsyncGetTDMEmployees(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

async function AsyncGetTDProductionLine(simulationPtr, index, dataArray, callback) {
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
            AsyncGetTDProductionLine(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

async function AsyncGetTDProductoFamilia(simulationPtr, index, dataArray, callback) {
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
            AsyncGetTDProductoFamilia(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

async function AsyncGetTDSimulationFinancialLog(simulationPtr, index, dataArray, callback) {
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
            AsyncGetTDSimulationFinancialLog(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

async function AsyncGetSimulationsTeams(simulationPtr, index, dataArray, callback) {
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
            AsyncGetSimulationsTeams(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

async function AsyncGetSimulationsPurchasing(simulationPtr, index, dataArray, callback) {
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
            AsyncGetSimulationsPurchasing(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

async function AsyncGetSDMActivosFijos(simulationPtr, index, dataArray, callback) {
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
            AsyncGetSDMActivosFijos(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

async function AsyncGetSDMActivosFijosInventario(simulationPtr, index, dataArray, callback) {
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
            AsyncGetSDMActivosFijosInventario(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

async function AsyncGetSDMClientes(simulationPtr, index, dataArray, callback) {
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
            AsyncGetSDMClientes(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

async function AsyncGetSDMEmpleados(simulationPtr, index, dataArray, callback) {
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
            AsyncGetSDMEmpleados(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

async function AsyncGetSDMGastos(simulationPtr, index, dataArray, callback) {
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
            AsyncGetSDMGastos(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

async function AsyncGetSDMMateriaPrimaInventario(simulationPtr, index, dataArray, callback) {
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
            AsyncGetSDMMateriaPrimaInventario(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

async function AsyncGetSDMProductionLinePhases(simulationPtr, index, dataArray, callback) {
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
            AsyncGetSDMProductionLinePhases(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

async function AsyncGetSDMProductionLineTemplates(simulationPtr, index, dataArray, callback) {
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
            AsyncGetSDMProductionLineTemplates(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

async function AsyncGetSDMProductoFamilia(simulationPtr, index, dataArray, callback) {
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
            AsyncGetSDMProductoFamilia(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

async function AsyncGetSDMProveedores(simulationPtr, index, dataArray, callback) {
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
            AsyncGetSDMProveedores(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

async function AsyncGetSDMProveedoresMP(simulationPtr, index, dataArray, callback) {
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
            AsyncGetSDMProveedoresMP(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

async function AsyncGetSDMSalaryTabulator(simulationPtr, index, dataArray, callback) {
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
            AsyncGetSDMSalaryTabulator(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}

async function AsyncGetSDMTransporte(simulationPtr, index, dataArray, callback) {
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
            AsyncGetSDMTransporte(simulationPtr, (index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(null, error)
    }
}