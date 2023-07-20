var moment = require('moment')
var _      = require('underscore')
var log    = console.log

let CONSTANTS           = require("../../../ConstantsProject")
let SocketFunctionality = require('../../functionalities/sockets.functionality')
let GlobalFunctionality = require('../../functionalities/global.functionality')

var Parse = require('parse/node');
const { object, functions } = require('underscore')

const APP_ID = process.env.APP_ID 
const MASTER_KEY = process.env.MASTER_KEY

Parse._initialize(APP_ID, "", MASTER_KEY)
Parse.serverURL = process.env.PUBLIC_SERVER_URL

const LIMIT_NUMBER_RESULTS = 1000

exports.executeProcess = async function(event){
	if(!event.get("simulationPtr")){
		//log("Cannot change hour of simulation, please check " + event.get("simulationPtr").id)
		return false
	}

	//log("Started order delete process")
	var overdueOrders   = null
	var penalizedOrders = null
	
	overdueOrders = await getAllOverdueOrders(event)
	if(overdueOrders.length > 0) await deleteAllOverdueOrders(overdueOrders)
	
	penalizedOrders = await getAllPenalizedOrders(event)
	if(penalizedOrders.length > 0) await penalizeOrders(penalizedOrders)

	//log("Finished order delete process")
	return true
}

/*
* First delete the ones not used 
*/
async function getAllOverdueOrders(event){
	//log("Starting overdue orders function")
	var simulation = event.get("simulationPtr")
	//log(simulation.id)

	var currentTimeSimulation = simulation.get("currentDate")
	//log(currentTimeSimulation)

	var query = new Parse.Query('SimulationsOrders');

    query.equalTo("simulationPtr",simulation)
	query.equalTo('active', true)
	query.equalTo('exists', true)
	query.lessThanOrEqualTo("expectedTime",currentTimeSimulation)
	query.doesNotExist("completed")
	query.doesNotExist("teamPtr")

    var count = 0
    try{
        count = await query.count()
    }catch(error){
        return {results: null, error: error}
    }

    //log(count)
    var results = []
    var noQueries = Math.ceil(count / LIMIT_NUMBER_RESULTS)

    for(var i = 0; i < noQueries; i++){
        //log("Index " + (i+1) + " / " + noQueries)
        query.skip(i*LIMIT_NUMBER_RESULTS)
        query.limit(LIMIT_NUMBER_RESULTS)
        try{
            const tempResult = await query.find()
            results = results.concat(tempResult)
        }catch(error){
            return []
        }
    }

    return results
}

async function deleteAllOverdueOrders(overdueOrders){
	//log("Number of overdue orders: " + overdueOrders.length)
	var numberOfDeletes = Math.ceil(overdueOrders.length / LIMIT_NUMBER_RESULTS)
	for(var i = 0; i < numberOfDeletes; i++){
		var subarray = overdueOrders.slice((i*LIMIT_NUMBER_RESULTS), ((i+1)*(LIMIT_NUMBER_RESULTS-1)))
		//log("To delete: " + subarray.length)
		await Parse.Object.destroyAll(overdueOrders)
	}
	
	return
}

async function getAllPenalizedOrders(event){
	//log("Starting penalized overdue orders function")
	var simulation = event.get("simulationPtr")

	var currentTimeSimulation = simulation.get("currentDate")
	//log(currentTimeSimulation)

	var query = new Parse.Query('SimulationsOrders');

    query.equalTo("simulationPtr",simulation)
	query.equalTo('active', true)
	query.equalTo('exists', true)
	query.lessThanOrEqualTo("expectedTime",currentTimeSimulation)
	query.doesNotExist("completed")
	query.exists("teamPtr")
	query.exists("total")
	query.include("teamPtr")

    var count = 0
    try{
        count = await query.count()
    }catch(error){
        return {results: null, error: error}
    }

    //log(count)
    var results = []
    var noQueries = Math.ceil(count / LIMIT_NUMBER_RESULTS)

    for(var i = 0; i < noQueries; i++){
        //log("Index " + (i+1) + " / " + noQueries)
        query.skip(i*LIMIT_NUMBER_RESULTS)
        query.limit(LIMIT_NUMBER_RESULTS)
        try{
            const tempResult = await query.find()
            results = results.concat(tempResult)
        }catch(error){
            return []
        }
    }

    return results
}

async function penalizeOrders(event,penalizedOrdersList) {
	//log("Number of penalized orders: " + penalizedOrdersList.length)
	for(var i = 0; i < penalizedOrdersList.length; i++){
		var penzalizedOrderObject = penalizedOrdersList[index]

		//TODO: Penalizar orden con dinero

		await penzalizedOrderObject.save()
	}
	return
}
