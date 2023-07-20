var moment = require('moment')
var _      = require('underscore')
var log    = console.log

let CONSTANTS           = require("../../../ConstantsProject")
let SocketFunctionality = require('../../functionalities/sockets.functionality')

var Parse = require('parse/node');
const { object, functions } = require('underscore')

const APP_ID = process.env.APP_ID 
const MASTER_KEY = process.env.MASTER_KEY

Parse._initialize(APP_ID, "", MASTER_KEY)
Parse.serverURL = process.env.PUBLIC_SERVER_URL

exports.executeProcess = async function(event,session_handler){
	if(!event.get("simulationPtr") || !event.get("simulationPtr").get("currentDate")){
		//log("Cannot change hour of simulation, please check " + event.get("simulationPtr").id)
		return false
	}

	//log("Started hour change process")
	await changeHour(event)
	await updateUISimulationFromEvent(event,session_handler)
	await updateCurrentEvent(event)
	//log("Finished hour change process")
	return true
}

async function changeHour(event){
	var simulation = event.get("simulationPtr")
	//log("SimulationPtr " + simulation.id)
	var currentSimulationDate = moment(simulation.get("currentDate"))
	//log(currentSimulationDate.format("DD/MM/YYYY HH:mm:ss"))
	currentSimulationDate = currentSimulationDate.add(1, 'hours')
	//log(currentSimulationDate.format("DD/MM/YYYY HH:mm:ss"))

	simulation.set("currentDate", currentSimulationDate.valueOf())
	await simulation.save()

	return
}

async function updateUISimulationFromEvent(event,session_handler){
	SocketFunctionality.update_hour_change_simulation(session_handler,event.get("simulationPtr").id,event.get("simulationPtr").get("currentDate"))
	//log("Update UI simulation from event")
	return
}

async function updateCurrentEvent(event){
	var nextTimeEvent = moment().add(event.get("simulationPtr").get("speedSimulation"),'minutes')
	nextTimeEvent = nextTimeEvent.add(-5,'seconds')
	event.set("triggerTime", nextTimeEvent.valueOf())
	await event.save()
	return
}