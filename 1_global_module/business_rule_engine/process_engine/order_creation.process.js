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

exports.executeProcess = async function(event){
	if(!event.get("simulationPtr")){
		//log("Cannot change hour of simulation, please check " + event.get("simulationPtr").id)
		return false
	}

	//log("Started order creation process")
	var clients = null
	var models  = null
	var teams   = null
	clients = await getAllClients(event)
	models  = await getAllModels(event)
	teams   = await getAllTeamsInSimulation(event)
	await generateOrder(event,clients,models,teams)
	await updateCurrentEvent(event)
	//log("Finished order creation process")
	return true
}


async function getAllClients(event){
	var simulation = event.get("simulationPtr")
	var query = new Parse.Query('SDMClientes');
	query.equalTo("simulationPtr",simulation)
	query.equalTo('active', true)
	query.equalTo('exists', true)
	query.limit(1000)

	var results = await query.find()

    return results
}

async function getAllModels(event){
	var simulation = event.get("simulationPtr")
	var query = new Parse.Query('SDMProductoFamilia');
	query.equalTo("simulationPtr",simulation)
	query.equalTo('active', true)
	query.equalTo('exists', true)
	query.limit(1000)
	var results = await query.find()

	return results
}

async function getAllTeamsInSimulation(event){
	var simulation = event.get("simulationPtr")
	var query = new Parse.Query('SimulationsTeams');
	query.equalTo("simulationPtr",simulation)
	query.equalTo('active', true)
	query.equalTo('exists', true)
	query.limit(1000)
	var results = await query.find()

	return results
}

async function generateOrder(event,clients,models,teams){
	var simulation = event.get("simulationPtr")

	var newOrders = []
	var numberOfNewOrders = teams.length * 5

	for(var i = 0; i < numberOfNewOrders; i++){
		const Table = Parse.Object.extend("SimulationsOrders")
	    const object = new Table()

		object.set("clientPtr", clients[GlobalFunctionality.getRandomInt(0,clients.length)])

		var quantityModels = GlobalFunctionality.getRandomInt(1,models.length + 1)
		//log(quantityModels)
		var modelsAvailable = _.shuffle(models)
		var orderModels = []
		for(var j = 0; j < quantityModels; j++){
			var selectedModel = modelsAvailable[j]
			
			
			var simpleOrder = {
				model:selectedModel.get("nombre"),
				quantity: GlobalFunctionality.getRandomInt(30,1003)
			}
			orderModels.push(simpleOrder)
			//log(simpleOrder)
		}
		//log(orderModels)
		var daysFromNow  = GlobalFunctionality.getRandomInt(1,31)
		var deliveryDate = moment(simulation.get("currentDate")).add(daysFromNow,'days')
		//log(deliveryDate.format("DD/MM/YYYY"))

		object.set("simulationPtr", simulation)
		object.set("order", orderModels)
		object.set("expectedTime", deliveryDate.valueOf())
		object.set("negotiationValue",GlobalFunctionality.getRandomInt(0,51))
		object.set("active", true)
	    object.set("exists", true)


	    newOrders.push(object)
	}

	//log("New ordes created: " + newOrders.length)
	await Parse.Object.saveAll(newOrders)
	return
}


async function updateCurrentEvent(event){
	var nextTimeEvent = moment().add(event.get("simulationPtr").get("speedSimulation")*24,'minutes')
	event.set("triggerTime", nextTimeEvent.valueOf())
	await event.save()
	return
}
