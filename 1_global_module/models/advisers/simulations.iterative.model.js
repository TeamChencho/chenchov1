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

exports.GetAllSimulations = async (groups) => {

    try {
        var results = await exports.AsyncGetAllSimulations( groups )
    } catch (error) {
        log( error )
        return { data: null, error: error.error }
    }
    return { data: results.data, error: null }

}

exports.AsyncGetAllSimulations = async ( groups ) => {
    
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
        query.descending("createdAt")
        query.include("groupPtr")
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

exports.GetAllGroupsAdviser = async (adviser) => {

    try {
        var results = await exports.AsyncGetAllGroupsAdviser( adviser )
    } catch (error) {
        log( error )
        return { data: null, error: error.error }
    }
    return { data: results.data, error: null}

}

exports.AsyncGetAllGroupsAdviser = async ( adviser ) => {
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

        innerQuery.equalTo( "active", true )
        innerQuery.equalTo( "exists", true )

        query.matchesQuery( "grupoPtr", innerQuery );
        query.equalTo( "active", true )
        query.equalTo( "exists", true )
        query.equalTo( "usuarioPtr", adviser )
        query.descending( "createdAt" )
        query.include( "grupoPtr" )

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

exports.ArchiveSimulation = async ( objectId, seActiva ) => {

    try {
        var results = await exports.AsyncSearchSimulation ( objectId )
    } catch (error) {
        log( error )
        return { data: null, error: error.error }
    }

    var object = results.data

    if (seActiva === "true") {
        object.set("active", true)
    } else if (seActiva === "false") {
        object.set("active", false)
        object.set("status", "PAUSED")
    }

    try {
        var resultUpdated = await object.save()
    } catch (error) {
        log( error )
        return { data: null, error: error.error }
    }

    return { data: resultUpdated, error: null }
}

exports.AsyncSearchSimulation = async ( objectId ) => {
    var Table = Parse.Object.extend("Simulations")
    var query = new Parse.Query(Table)

        query.equalTo("objectId", objectId)
        query.equalTo("exists", true)
        query.include("groupPtr")
    try {
        const results = await query.first()
        return { data: results, error: null }
    } catch (error) {
        return { data: null, error: error }
    }
}

exports.EraseSimulation = async ( objectId ) => {

    try {
        var results = await exports.DeleteSimulation( objectId )
    } catch (error) {
        log( error )
        return { results: null, error: error.error }
    }
    return { data: results.data, error: null }
}

exports.DeleteSimulation = async (simulationPtr) => {

    var Simulation = Parse.Object.extend("Simulations")
    var pointerToSimulation = new Simulation()
    pointerToSimulation.id = simulationPtr

    var Table = Parse.Object.extend("LogsDelete")
    var object = new Table()
        //i1rr46ET95
        object.set("simulationPtr", pointerToSimulation)
        object.set("active", true)
        object.set("exists", true)

    try {
        var resultSaveLogsDelete = await object.save()

            //Table Simualtion
        var simualtionToDelete    = await exports.AsyncSearchSimulation( simulationPtr )
            log("before to delete 1 data from table Simualtion" + simualtionToDelete.data.id)
        var simulationDeleted    = await exports.DeleteDataDB( [ simualtionToDelete.data ] )
            log("after to delete " + simulationDeleted.data.length + " data from table Simualtion")
        
            //Table SimualtionEvents
        var simulationEventsToDelete = await exports.GetAllDataGeneric ( pointerToSimulation, 'SimulationsEvents')
            log("before to delete " + simulationEventsToDelete.data.length + " data from table SimualtionEvents")
        var simulationEventsDeleted    = await exports.DeleteDataDB( simulationEventsToDelete.data )
            log("after to delete " + simulationEventsDeleted.data.length + " data from table SimualtionEvents")

            //Table SimualtionEventsPipe
        var SimulationsEventPipeToDelete = await exports.GetAllDataGeneric ( pointerToSimulation, 'SimulationsEventPipe')
            log("before to delete " + SimulationsEventPipeToDelete.data.length + " data from table SimualtionEventsPipe")
        var SimulationsEventPipeDeleted    = await exports.DeleteDataDB( SimulationsEventPipeToDelete.data )
            log("after to delete " + SimulationsEventPipeDeleted.data.length + " data from table SimualtionEventsPipe")

            //Table SimulationsDeliveredRawMaterial
        var SimulationsDeliveredRawMaterialToDelete = await exports.GetAllDataGeneric ( pointerToSimulation, 'SimulationsDeliveredRawMaterial')
            log("before to delete " + SimulationsDeliveredRawMaterialToDelete.data.length + " data from table SimulationsDeliveredRawMaterial")
        var SimulationsDeliveredRawMaterialDeleted    = await exports.DeleteDataDB( SimulationsDeliveredRawMaterialToDelete.data )
            log("after to delete " + SimulationsDeliveredRawMaterialDeleted.data.length + " data from table SimulationsDeliveredRawMaterial")

            //Table SimulationsInventory
        var SimulationsInventoryToDelete = await exports.GetAllDataGeneric ( pointerToSimulation, 'SimulationsInventory')
            log("before to delete " + SimulationsInventoryToDelete.data.length + " data from table SimulationsInventory")
        var SimulationsInventoryDeleted    = await exports.DeleteDataDB( SimulationsInventoryToDelete.data )
            log("after to delete " + SimulationsInventoryDeleted.data.length + " data from table SimulationsInventory")
        
            //Table SimulationsOrders
        var SimulationsOrdersToDelete = await exports.GetAllDataGeneric ( pointerToSimulation, 'SimulationsOrders')
            log("before to delete " + SimulationsOrdersToDelete.data.length + " data from table SimulationsOrders")
        var SimulationsOrdersDeleted    = await exports.DeleteDataDB( SimulationsOrdersToDelete.data )
            log("after to delete " + SimulationsOrdersDeleted.data.length + " data from table SimulationsOrders")

            //Table SimulationsOrdersPurchasings
        var SimulationsOrdersPurchasingsToDelete = await exports.GetAllDataGeneric ( pointerToSimulation, 'SimulationsOrdersPurchasings')
            log("before to delete " + SimulationsOrdersPurchasingsToDelete.data.length + " data from table SimulationsOrdersPurchasings")
        var SimulationsOrdersPurchasingsDeleted    = await exports.DeleteDataDB( SimulationsOrdersPurchasingsToDelete.data )
            log("after to delete " + SimulationsOrdersPurchasingsDeleted.data.length + " data from table SimulationsOrdersPurchasings")

            //Table SimulationsOrdersSuppliers
        var SimulationsOrdersSuppliersToDelete = await exports.GetAllDataGeneric ( pointerToSimulation, 'SimulationsOrdersSuppliers')
            log("before to delete " + SimulationsOrdersSuppliersToDelete.data.length + " data from table SimulationsOrdersSuppliers")
        var SimulationsOrdersSuppliersDeleted    = await exports.DeleteDataDB( SimulationsOrdersSuppliersToDelete.data )
            log("after to delete " + SimulationsOrdersSuppliersDeleted.data.length + " data from table SimulationsOrdersSuppliers")

            //Table SimulationsTeams
        var SimulationsTeamsToDelete = await exports.GetAllDataGeneric ( pointerToSimulation, 'SimulationsTeams')
            log("before to delete " + SimulationsTeamsToDelete.data.length + " data from table SimulationsTeams")
        var SimulationsTeamsDeleted    = await exports.DeleteDataDB( SimulationsTeamsToDelete.data )
            log("after to delete " + SimulationsTeamsDeleted.data.length + " data from table SimulationsTeams")

            //Table SimulationsPurchasing
        var SimulationsPurchasingToDelete = await exports.GetAllDataGeneric ( pointerToSimulation, 'SimulationsPurchasing')
            log("before to delete " + SimulationsPurchasingToDelete.data.length + " data from table SimulationsPurchasing")
        var SimulationsPurchasingDeleted    = await exports.DeleteDataDB( SimulationsPurchasingToDelete.data )
            log("after to delete " + SimulationsPurchasingDeleted.data.length + " data from table SimulationsPurchasing")

        //------- Eliminar Datos de tablas TD ---------

            //Table TDActivatedProductionLine
        var TDActivatedProductionLineToDelete = await exports.GetAllDataGeneric ( pointerToSimulation, 'TDActivatedProductionLine')
            log("before to delete " + TDActivatedProductionLineToDelete.data.length + " data from table TDActivatedProductionLine")
        var TDActivatedProductionLineDeleted    = await exports.DeleteDataDB( TDActivatedProductionLineToDelete.data )
            log("after to delete " + TDActivatedProductionLineDeleted.data.length + " data from table TDActivatedProductionLine")

            //Table TDMActivosFijosInventario
        var TDMActivosFijosInventarioToDelete = await exports.GetAllDataGeneric ( pointerToSimulation, 'TDMActivosFijosInventario')
            log("before to delete " + TDMActivosFijosInventarioToDelete.data.length + " data from table TDMActivosFijosInventario")
        var TDMActivosFijosInventarioDeleted    = await exports.DeleteDataDB( TDMActivosFijosInventarioToDelete.data )
            log("after to delete " + TDMActivosFijosInventarioDeleted.data.length + " data from table TDMActivosFijosInventario")

            //Table TDMEmployees
        var TDMEmployeesToDelete = await exports.GetAllDataGeneric ( pointerToSimulation, 'TDMEmployees')
            log("before to delete " + TDMEmployeesToDelete.data.length + " data from table TDMEmployees")
        var TDMEmployeesDeleted    = await exports.DeleteDataDB( TDMEmployeesToDelete.data )
            log("after to delete " + TDMEmployeesDeleted.data.length + " data from table TDMEmployees")

            //Table TDProductionLine
        var TDProductionLineToDelete = await exports.GetAllDataGeneric ( pointerToSimulation, 'TDProductionLine')
            log("before to delete " + TDProductionLineToDelete.data.length + " data from table TDProductionLine")
        var TDProductionLineDeleted    = await exports.DeleteDataDB( TDProductionLineToDelete.data )
            log("after to delete " + TDProductionLineDeleted.data.length + " data from table TDProductionLine")

            //Table TDProductoFamilia
        var TDProductoFamiliaToDelete = await exports.GetAllDataGeneric ( pointerToSimulation, 'TDProductoFamilia')
            log("before to delete " + TDProductoFamiliaToDelete.data.length + " data from table TDProductoFamilia")
        var TDProductoFamiliaDeleted    = await exports.DeleteDataDB( TDProductoFamiliaToDelete.data )
            log("after to delete " + TDProductoFamiliaDeleted.data.length + " data from table TDProductoFamilia")

            //Table TDSimulationFinancialLog
        var TDSimulationFinancialLogToDelete = await exports.GetAllDataGeneric ( pointerToSimulation, 'TDSimulationFinancialLog')
            log("before to delete " + TDSimulationFinancialLogToDelete.data.length + " data from table TDSimulationFinancialLog")
        var TDSimulationFinancialLogDeleted    = await exports.DeleteDataDB( TDSimulationFinancialLogToDelete.data )
            log("after to delete " + TDSimulationFinancialLogDeleted.data.length + " data from table TDSimulationFinancialLog")
        
        //---------Eliminar datos de tablas SDM --------
            //Table SDMActivosFijos
        var SDMActivosFijosToDelete = await exports.GetAllDataGeneric ( pointerToSimulation, 'SDMActivosFijos')
            log("before to delete " + SDMActivosFijosToDelete.data.length + " data from table SDMActivosFijos")
        var SDMActivosFijosDeleted    = await exports.DeleteDataDB( SDMActivosFijosToDelete.data )
            log("after to delete " + SDMActivosFijosDeleted.data.length + " data from table SDMActivosFijos")

            //Table SDMActivosFijosInventario
        var SDMActivosFijosInventarioToDelete = await exports.GetAllDataGeneric ( pointerToSimulation, 'SDMActivosFijosInventario')
            log("before to delete " + SDMActivosFijosInventarioToDelete.data.length + " data from table SDMActivosFijosInventario")
        var SDMActivosFijosInventarioDeleted    = await exports.DeleteDataDB( SDMActivosFijosInventarioToDelete.data )
            log("after to delete " + SDMActivosFijosInventarioDeleted.data.length + " data from table SDMActivosFijosInventario")

            //Table SDMClientes
        var SDMClientesToDelete = await exports.GetAllDataGeneric ( pointerToSimulation, 'SDMClientes')
            log("before to delete " + SDMClientesToDelete.data.length + " data from table SDMClientes")
        var SDMClientesDeleted    = await exports.DeleteDataDB( SDMClientesToDelete.data )
            log("after to delete " + SDMClientesDeleted.data.length + " data from table SDMClientes")

            //Table SDMEmpleados
        var SDMEmpleadosToDelete = await exports.GetAllDataGeneric ( pointerToSimulation, 'SDMEmpleados')
            log("before to delete " + SDMEmpleadosToDelete.data.length + " data from table SDMEmpleados")
        var SDMEmpleadosDeleted    = await exports.DeleteDataDB( SDMEmpleadosToDelete.data )
            log("after to delete " + SDMEmpleadosDeleted.data.length + " data from table SDMEmpleados")

            //Table SDMGastos
        var SDMGastosToDelete = await exports.GetAllDataGeneric ( pointerToSimulation, 'SDMGastos')
            log("before to delete " + SDMGastosToDelete.data.length + " data from table SDMGastos")
        var SDMGastosDeleted    = await exports.DeleteDataDB( SDMGastosToDelete.data )
            log("after to delete " + SDMGastosDeleted.data.length + " data from table SDMGastos")

            //Table SDMMateriaPrimaInventario
        var SDMMateriaPrimaInventarioToDelete = await exports.GetAllDataGeneric ( pointerToSimulation, 'SDMMateriaPrimaInventario')
            log("before to delete " + SDMMateriaPrimaInventarioToDelete.data.length + " data from table SDMMateriaPrimaInventario")
        var SDMMateriaPrimaInventarioDeleted    = await exports.DeleteDataDB( SDMMateriaPrimaInventarioToDelete.data )
            log("after to delete " + SDMMateriaPrimaInventarioDeleted.data.length + " data from table SDMMateriaPrimaInventario")

            //Table SDMProductionLinePhases
        var SDMProductionLinePhasesToDelete = await exports.GetAllDataGeneric ( pointerToSimulation, 'SDMProductionLinePhases')
            log("before to delete " + SDMProductionLinePhasesToDelete.data.length + " data from table SDMProductionLinePhases")
        var SDMProductionLinePhasesDeleted    = await exports.DeleteDataDB( SDMProductionLinePhasesToDelete.data )
            log("after to delete " + SDMProductionLinePhasesDeleted.data.length + " data from table SDMProductionLinePhases")

            //Table SDMProductionLineTemplates
        var SDMProductionLineTemplatesToDelete = await exports.GetAllDataGeneric ( pointerToSimulation, 'SDMProductionLineTemplates')
            log("before to delete " + SDMProductionLineTemplatesToDelete.data.length + " data from table SDMProductionLineTemplates")
        var SDMProductionLineTemplatesDeleted    = await exports.DeleteDataDB( SDMProductionLineTemplatesToDelete.data )
            log("after to delete " + SDMProductionLineTemplatesDeleted.data.length + " data from table SDMProductionLineTemplates")
        
            //Table SDMProductoFamilia
        var SDMProductoFamiliaToDelete = await exports.GetAllDataGeneric ( pointerToSimulation, 'SDMProductoFamilia')
            log("before to delete " + SDMProductoFamiliaToDelete.data.length + " data from table SDMProductoFamilia")
        var SDMProductoFamiliaDeleted    = await exports.DeleteDataDB( SDMProductoFamiliaToDelete.data )
            log("after to delete " + SDMProductoFamiliaDeleted.data.length + " data from table SDMProductoFamilia")

            //Table SDMProveedores
        var SDMProveedoresToDelete = await exports.GetAllDataGeneric ( pointerToSimulation, 'SDMProveedores')
            log("before to delete " + SDMProveedoresToDelete.data.length + " data from table SDMProveedores")
        var SDMProveedoresDeleted    = await exports.DeleteDataDB( SDMProveedoresToDelete.data )
            log("after to delete " + SDMProveedoresDeleted.data.length + " data from table SDMProveedores")

            //Table SDMProveedoresMP
        var SDMProveedoresMPToDelete = await exports.GetAllDataGeneric ( pointerToSimulation, 'SDMProveedoresMP')
            log("before to delete " + SDMProveedoresMPToDelete.data.length + " data from table SDMProveedoresMP")
        var SDMProveedoresMPDeleted    = await exports.DeleteDataDB( SDMProveedoresMPToDelete.data )
            log("after to delete " + SDMProveedoresMPDeleted.data.length + " data from table SDMProveedoresMP")

            //Table SDMSalaryTabulator
        var SDMSalaryTabulatorToDelete = await exports.GetAllDataGeneric ( pointerToSimulation, 'SDMSalaryTabulator')
            log("before to delete " + SDMSalaryTabulatorToDelete.data.length + " data from table SDMSalaryTabulator")
        var SDMSalaryTabulatorDeleted    = await exports.DeleteDataDB( SDMSalaryTabulatorToDelete.data )
            log("after to delete " + SDMSalaryTabulatorDeleted.data.length + " data from table SDMSalaryTabulator")

            //Table SDMTransporte
        var SDMTransporteToDelete = await exports.GetAllDataGeneric ( pointerToSimulation, 'SDMTransporte')
            log("before to delete " + SDMTransporteToDelete.data.length + " data from table SDMTransporte")
        var SDMTransporteDeleted    = await exports.DeleteDataDB( SDMTransporteToDelete.data )
            log("after to delete " + SDMTransporteDeleted.data.length + " data from table SDMTransporte")
            
    } catch (error) {
        log( error )
        return { data : null, error: error.error }
    }

    log("Success")

    return { data: 'success deleted', error: null }
}

exports.GetAllDataGeneric = async ( simulationPtr, nameTable ) => {

    var Table = Parse.Object.extend( nameTable )
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

        query.equalTo("simulationPtr", simulationPtr)
		
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

exports.DeleteSimulationThousand = async () => {
    try {
        var resultsSimulations = await exports.GetAllDataSimualtion( "LogsDelete" )
        var resultsSimulationsData = resultsSimulations.data
    } catch (error) {
        log( error )
        return { data : null, error: error.error }
    }

    var pointerSimualtion = []
    for (let i = 0; i < resultsSimulationsData.length; i++) {
        pointerSimualtion.push(resultsSimulationsData[i].get("simulationPtr"))
    }

    var arregoRetornar  = []
    for (let i = 0; i < 5; i++) {

        try {

            var resultsSimulationslogs = await exports.AsyncGetThousandSimulationsLogs( pointerSimualtion )
            //log("before to delete " + resultsSimulationslogs.data.length + " data from table SimulationsLogs")
            var resultsDeletedSimulationsLogs = await exports.DeleteDataDB( resultsSimulationslogs.data )
            //log("after to delete " + resultsDeletedSimulationsLogs.data.length + " data from table SimulationsLogs")
            arregoRetornar.push.apply(arregoRetornar, resultsDeletedSimulationsLogs.data)

        } catch (error) {
            log( error )
            return { data : null, error: error.error }
        }

    }

    var simulationLogsDelete = []
    for (let i = 0; i < resultsSimulationsData.length; i++) {

        var count = await exports.AsyncGetCountSimulationsLogs( resultsSimulationsData[i].get("simulationPtr") )

        if(count.data <= 0){
            simulationLogsDelete.push(  resultsSimulationsData[i] )
        }

    }

    try {
        await exports.DeleteDataDB( simulationLogsDelete )
    } catch (error) {
        log( error )
    }
    
    return { data: arregoRetornar, error: null }

}

exports.AsyncGetThousandSimulationsLogs = async ( pointerSimualtion ) => {
    var Table = Parse.Object.extend( 'SimulationsLogs' )
    var query = new Parse.Query( Table )

        query.containedIn( "simulationPtr", pointerSimualtion )
        query.limit( 1000 )

    try {
        var tempResult = await query.find()
    } catch (error) {
        log(error)
        return { results: null, error: error.error }
    }

	return { data: tempResult, error: null}
}

exports.AsyncGetCountSimulationsLogs = async ( pointerSimualtion ) => {
    var Table = Parse.Object.extend( 'SimulationsLogs' )
    var query = new Parse.Query( Table )

        query.equalTo( "simulationPtr", pointerSimualtion )

    try {
        var resultCount = await query.count()
    } catch (error) {
        log(error)
        return { results: null, error: error.error }
    }

	return { data: resultCount, error: null}
}

//------ Función Eliminar -------
exports.DeleteDataDB = async ( data ) => {
    //log(data)
    var arrayDelete = []
    var arrayToReturn = []
    for (let i = 0; i < data.length; i++) {

        arrayDelete.push(data[i])

        if( arrayDelete.length == 1000 || i == data.length -1){
            try {
                var results = await Parse.Object.destroyAll(arrayDelete)
                arrayToReturn.push.apply(arrayToReturn, results)
                arrayDelete = []
            } catch (error) {
                return { results: null, error: error }
            }
            
        }
    }

    return { data: arrayToReturn, error: null}

}

//------ Función para crear una nueva simulación ---------
exports.AddAllConfigurationNewSimulation= async ( data ) => {

    try {

        log("Adding Simulation")
        var savedSimualtion = await exports.CreateSimulation( data )
        var simulation = savedSimualtion.data
        log("Simulation created successfully")

        var pipeEvents = await exports.GetAllDataToAdd( "DMEventPipe" )
        log("Pipe events " + pipeEvents.data.length)
        var pipeEventsSaved = await exports.SavePipeEvents( pipeEvents.data, simulation )
        log("Event pipe created successfully " + pipeEventsSaved.data.length)

        var simulationEvents = await exports.obtainArraySimulationEvents(simulation)
        log("Events simulation " + simulationEvents.length)
        var simulationEventsToSaved = await exports.SaveSimulationEvents( simulationEvents )
        log("Events simulation created successfully " + simulationEventsToSaved.data.length)

        var inventoryRawMaterial = await exports.GetAllDataIterativeToAdd( "DMMateriaPrimaInventario" )
        log("After inventory rm " + inventoryRawMaterial.data.length)
        var inventoryRawMaterialSaved = await exports.SaveInventoryRawMaterial( inventoryRawMaterial.data, simulation )
        log("Raw material inventory created successfully " + inventoryRawMaterialSaved.data.length)

        var productosFamilia = await exports.GetAllDataIterativeToAdd( "DMProductoFamilia" )
        log("After productos familia " + productosFamilia.data.length)
        var productosFamiliaSaved = await exports.SaveProductosFamilia( productosFamilia.data, simulation )
        log("Products family created successfully " + productosFamiliaSaved.data.length)

        var proveedores = await exports.GetAllDataIterativeToAdd( "DMProveedores" )
        log("After proveedores " + proveedores.data.length)
        var proveedoresSaved = await exports.SaveProveedores( proveedores.data, simulation )
        log("Providers created successfully " + proveedoresSaved.data.length)

        var providersRawMaterial = await exports.GetAllDataIterativeToAdd( "DMProveedoresMP" )
        log("After proveedores materia prima " + providersRawMaterial.data.length)
        var providersRawMaterialSave = await exports.SaveProvidersRawMaterial( providersRawMaterial.data, simulation, proveedoresSaved.data )
        log("Providers raw material created successfully " + providersRawMaterialSave.data.length)

        var transporte = await exports.GetAllDataIterativeToAdd( "DMTransporte" )
        log("After transporte " + transporte.data.length)
        var transporteSaved = await exports.SaveTransporte( transporte.data, simulation, proveedoresSaved.data )
        log("Transport created successfully " + transporteSaved.data.length)

        //--------- SDM Data Base 
        var activosFijos = await exports.GetAllDataIterativeToAdd( "DMActivosFijos" )
        log("After FixedAsssets " + activosFijos.data.length)
        var activosFijosSaved = await exports.SaveActivosFijos( activosFijos.data, simulation )
        log("Fixed assets created successfully " + activosFijosSaved.data.length)

        var activosFijosInventario = await exports.GetAllDataIterativeToAdd( "DMActivosFijosInventario" )
        log("After FixedAsssetsInventory " + activosFijosInventario.data.length)
        var activosFijosInventarioSaved = await exports.SaveActivosFijosInventario( activosFijosInventario.data, simulation, activosFijosSaved.data )
        log("Fixed assets inventory created successfully " + activosFijosInventarioSaved.data.length)

        var clientes = await exports.GetAllDataIterativeToAdd( "DMClientes" )
        log("After Clients " + clientes.data.length)
        var clientesSaved = await exports.SaveClientes( clientes.data, simulation )
        log("Clients created successfully " + clientesSaved.data.length)

        var empleados = await exports.GetAllDataIterativeToAdd( "DMEmpleados" )
        log("After Employees " + empleados.data.length)
        var empleadosSaved = await exports.SaveEmpleados( empleados.data, simulation )
        log("Employees created successfully " + empleadosSaved.data.length)

        var gastos = await exports.GetAllDataIterativeToAdd( "DMGastos" )
        log("After Expenses " + gastos.data.length)
        var gastosSaved = await exports.SaveGastos( gastos.data, simulation )
        log("Expenses created successfully " + gastosSaved.data.length)

        var resultsSalaryTabulator = await exports.GetAllDataIterativeToAdd( "DMSalaryTabulator" )
        log("After Salary tabulator " + resultsSalaryTabulator.data.length)
        var resultsSalaryTabulatorSaved = await exports.SaveResultsSalaryTabulator( resultsSalaryTabulator.data, simulation )
        log("Salary tabulator created successfully " + resultsSalaryTabulatorSaved.data.length)

        var dataDMPhases = await exports.GetAllDataIterativeToAdd( "DMProductionLinePhases" )
        log("After prodcution line phases " + dataDMPhases.data.length)
        var dataDMPhasesSaved = await exports.SaveDataDMPhases( dataDMPhases.data, resultsSalaryTabulator.data, activosFijosSaved.newDataAF, resultsSalaryTabulatorSaved.newDataSalary, simulation)
        log("Prodcution line phases created successfully " + dataDMPhasesSaved.data.length)

        var dataProductFamily = await exports.GetAllDataIterativeToAddForSimulationId( simulation, "SDMProductoFamilia" )
        var dataTemplates = await exports.GetAllDataIterativeToAdd( "DMProductionLineTemplates" )
        log("After prodcution line templates " + dataTemplates.data.length)
        var dataTemplatesSave = await exports.SaveDataTemplates( dataTemplates.data, dataProductFamily.data, dataDMPhasesSaved.newDataPhases, activosFijosSaved.newDataAF, simulation )
        log("Prodcution line templates created successfully " + dataTemplatesSave.data.length)

        var SDMSalaryTabulator = await exports.GetAllDataIterativeToAddForSimulationId( simulation, "SDMSalaryTabulator" )
        var SDMEmployees = await exports.GetAllDataIterativeToAddForSimulationId( simulation, "SDMEmpleados" )
        log("After upadte employees " + SDMEmployees.data.length)
        var SDMEmployeesSaved = await exports.SaveSDMEmployees( SDMEmployees.data, SDMSalaryTabulator.data, simulation )
        log("Employees upadate successfully " + SDMEmployeesSaved.data.length)

    } catch (error) {
        log( error )
        return { data: null, error: error.error }
    }

    return { data: savedSimualtion, error: null }
}

//----- Funciones para agregar simualción ------
//---Crear simualción
exports.CreateSimulation = async ( data ) => {
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

    try {
        var results = await object.save()
    } catch (error) {
        log( error )
        return { data : null, error: error.error }
    }
    
    return { data: results, error: null }
}

exports.SavePipeEvents = async ( pipeEvents, simulation) => {

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

    try {
        var results = await Parse.Object.saveAll(simulationPipeEventsArray)
    } catch (error) {
        log( error )
        return { data: null, error: error.error }
    }
    return { data: results, error: null }

}

exports.obtainArraySimulationEvents = async ( simulation ) => {
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

exports.SaveSimulationEvents = async ( data ) => {
    try {
        var results = await Parse.Object.saveAll( data )
    } catch (error) {
        log( error )
        return { data: null, error: error.error }
    }
    return { data: results, error: null }
}

exports.SaveInventoryRawMaterial = async ( inventoryRawMaterial, simulation ) => {
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

    try {
        var results = await Parse.Object.saveAll( simInventoryRawMaterial )
    } catch (error) {
        log( error )
        return { data: null, error: error.error }
    }
    return { data: results , error: null }
}

exports.SaveProductosFamilia = async ( productosFamilia, simulation ) => {
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

    try {
        var results = await Parse.Object.saveAll( pfsimulacionArray )
    } catch (error) {
        log( error )
        return { data: null, error: error.error }
    }
    return { data: results , error: null }

}

exports.SaveProveedores = async ( proveedores, simulation ) => {
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

    try {
        var results = await Parse.Object.saveAll( proveedoresSimulacion )
    } catch (error) {
        log( error )
        return { data: null, error: error.error }
    }
    return { data: results, error: null }

}

exports.SaveProvidersRawMaterial = async ( providersRawMaterial, simulation, pvlist ) => {
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

    try {
        var results = await Parse.Object.saveAll( simulacionProviderRawMaterialArray )
    } catch (error) {
        log( error )
        return { data: null, error: error.error }
    }
    return { data: results, error: null }

}

exports.SaveTransporte = async ( transporte, simulation, pvlist ) => {
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

    try {
        var results = await Parse.Object.saveAll( simulacionTransporteArray )
    } catch (error) {
        log( error )
        return { data: null, error: error.error }
    }
    return { data: results, error: null }

}

exports.SaveActivosFijos = async ( activosFijos, simulation ) => {
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

    try {
        var results = await Parse.Object.saveAll( simulacionActivosFijosArray )
    } catch (error) {
        log( error )
        return { data: null, error: error.error }
    }
    return { data: results, newDataAF: simulacionActivosFijosArray, error: null }
}

exports.SaveActivosFijosInventario = async ( activosFijosInventario, simulation, falist ) => {
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

    try {
        var results = await Parse.Object.saveAll( simulacionActivosFijosInventarioArray )
    } catch (error) {
        log( error )
        return { data: null, error: error.error }
    }
    return { data: results, error: null }

}

exports.SaveClientes = async ( clientes, simulation ) => {
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

    try {
        var results = await Parse.Object.saveAll( simulacionClientesArray )
    } catch (error) {
        log( error )
        return { data: null, error: error.error }
    }
    return { data: results, error: null }

}

exports.SaveEmpleados = async ( empleados, simulation ) => {
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

    try {
        var results = await Parse.Object.saveAll( simulacionEmpleadosArray )
    } catch (error) {
        log( error )
        return { data: null, error: error.error }
    }
    return { data: results, error: null }
}

exports.SaveGastos = async ( gastos, simulation ) => {
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

    try {
        var results = await Parse.Object.saveAll( simulacionGastosArray )
    } catch (error) {
        log( error )
        return { data: null, error: error.error }
    }
    return { data: results, error: null }

}

exports.SaveResultsSalaryTabulator = async ( resultsSalaryTabulator, simulation ) => {
    var simulationSalaryTabulatorArray = []
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

    try {
        var results = await Parse.Object.saveAll( simulationSalaryTabulatorArray )
    } catch (error) {
        log( error )
        return { data : null, error: error.error }
    }
    return { data: results, newDataSalary: simulationSalaryTabulatorArray, error: null }

}

exports.SaveDataDMPhases = async ( dataDMPhases, dataDMSalaryTabulator, dataSDMFixedAsset, dataSDMTabulator, simulation) => {
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

    try {
        var results = await Parse.Object.saveAll( arrayObjects )
    } catch (error) {
        log( error )
        return { data : null, error: error.error }
    }
    return { data: results, newDataPhases: arrayObjects, error: null }

}

exports.SaveDataTemplates = async ( dataTemplates, dataProductFamily, arrayObjects, simulacionActivosFijosArray, simulation ) => {
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

    try {
        var results = await Parse.Object.saveAll( arrayObjectsTemplates )
    } catch (error) {
        log( error )
        return { data : null, error: error.error }
    }
    return { data: results, error: null }

}

exports.SaveSDMEmployees = async ( SDMEmployees, SDMSalaryTabulator, simulation) => {
    var arrayEmployeesToSave = []
    try {
        var SDMSalaryTabulatorTableTempo = await exports.GetAllDataIterativeToAddForSimulationId( simulation, "SDMSalaryTabulator" )
        var SDMSalaryTabulatorTable = SDMSalaryTabulatorTableTempo.data
    } catch (error) {
        
    }
    SDMEmployees.forEach(element => {
        if(element.get("DMsalaryTabulatorPtr") != undefined ){
            if( element.get("DMsalaryTabulatorPtr").get("area") != undefined){
                var DMSalaryTabulatorPtr = element.get("DMsalaryTabulatorPtr").id
                var found = _.find(SDMSalaryTabulator, function(current){
                    return current.get("referenciaId") == DMSalaryTabulatorPtr
                })
                if(found){

                    element.set("SDMsalaryTabulatorPtr",found)
                    arrayEmployeesToSave.push(element)
                }
            }else{
                var found = _.find(SDMSalaryTabulatorTable, function(current){
                    return current.get("area") == 'Oper' &&  current.get("department") == 'Production line'
                })
                if(found){
                    var Table = Parse.Object.extend( 'DMSalaryTabulator' )
                    var objectPtr = new Table( )
                        objectPtr.id = found.get("referenciaId")
    
                    element.set("SDMsalaryTabulatorPtr",found)
                    element.set("DMsalaryTabulatorPtr",objectPtr)
                    arrayEmployeesToSave.push(element)
                }
            }
        }else{
            var found = _.find(SDMSalaryTabulatorTable, function(current){
                return current.get("area") == 'Oper' &&  current.get("department") == 'Production line'
            })
            if(found){
                var Table = Parse.Object.extend( 'DMSalaryTabulator' )
                var objectPtr = new Table( )
                    objectPtr.id = found.get("referenciaId")

                element.set("SDMsalaryTabulatorPtr",found)
                element.set("DMsalaryTabulatorPtr",objectPtr)
                arrayEmployeesToSave.push(element)
            }
        }
    });

    try {
        var results = await Parse.Object.saveAll( arrayEmployeesToSave )
    } catch (error) {
        log( error )
        return { data : null, error: error.error }
    }
    return { data: results, error: null }

}

//----Funciones genericas para agregar simualción
exports.GetAllDataToAdd = async ( nameTable ) => {
    
    var Table = Parse.Object.extend( nameTable )
    var query = new Parse.Query( Table )

        query.equalTo( "exists", true )

    try {
        const results = await query.find()
        return { data: results, error: null }
    } catch (error) {
        log( error )
        return { data: results, error: null }
    }
}

exports.GetAllDataIterativeToAdd = async ( nameTable ) => {
    
    var Table = Parse.Object.extend( nameTable )
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

        query.equalTo("exists", true)
        query.equalTo("active", true)
		
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

exports.GetAllDataIterativeToAddForSimulationId = async ( simulationPtr ,nameTable ) => {
    
    var Table = Parse.Object.extend( nameTable )
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
        query.equalTo("simulationPtr",simulationPtr)
        query.equalTo("exists", true)
        query.equalTo("active", true)
        query.includeAll()

        if( nameTable == "SDMEmpleados"){
            query.include("DMsalaryTabulatorPtr")
        }
		
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

exports.GetAllDataSimualtion = async ( nameTable ) => {
    
    var Table = Parse.Object.extend( nameTable )
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

        query.equalTo("exists", true)
        query.equalTo("active", true)
		
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

exports.AddDateSimulations = async () => {
    try {
        var resultsSimulations = await exports.IterativeGetUndatedSimulation ()
        var simulations = resultsSimulations.data
    } catch (error) {
        log( error )
        return { data: null, error: error.error }
    }

    var dateTosave = []
    for (let i = 0; i < simulations.length; i++) {
        var currentDate = moment().valueOf()
        simulations[i].set( "currentDate", currentDate )
        dateTosave.push( simulations[i] )
    }

    try {
        var resultsSaved = await exports.IterativeSaveSimulation ( dateTosave )
    } catch (error) {
        log( error )
        return { data: null, error: error.error }
    }
    return { data: resultsSaved.data, error: null }
}

exports.IterativeGetUndatedSimulation = async () => {

    var Table = Parse.Object.extend( "Simulations" )
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
        query.doesNotExist( "currentDate" )

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

exports.IterativeSaveSimulation = async ( data ) => {

    var dataReturn = []
    var dataSave = [] 
    for (let i = 0; i < data.length; i++) {

        dataSave.push( data[i] )
        if ( dataSave.length == LIMIT_NUMBER_RESULTS || i == data.length-1 ) {
            
            try {
                var resultsTempo = await Parse.Object.saveAll( dataSave )
                dataReturn.push.apply( dataReturn, resultsTempo )
            } catch (error) {
                log( error )
                return { data: null, error: error.error }
            }

        }

    }
    return { data: dataReturn, error: null }
}