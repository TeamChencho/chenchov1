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

const LIMIT_NUMBER_RESULTS = 1000

exports.executeProcess = async function(event){
	if(!event.get("simulationPtr")){
		//log("Cannot change hour of simulation, please check " + event.get("simulationPtr").id)
		return false
	}

	//log("Started salaries workers process")
	var teams     = null
	var outcome   = null
	teams         = await getAllTeamsInSimulation(event)
	outcome       = await getAllWorkersInTeamAndGetOutcome(event,teams)
	await saveOutcomeTeamsWorkers(event,teams,outcome)
	await updateCurrentEvent(event)
	//log("Finished salaries workers process")
	return true
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

async function getAllWorkersInTeamAndGetOutcome(event,teams) {
	//log("Getting data " + index + " - " + teams[index].id + ": " + teams.length)
	var simulation = event.get("simulationPtr")
	//log("Get all simulations orders suppliers thar are PENDING")

	var query = new Parse.Query('TDMEmployees');

    //log(count)
    var results = []
    var noQueries = Math.ceil(count / LIMIT_NUMBER_RESULTS)

    var outcome = []
    var resultOutcome = 0

    for(var i = 0; i < teams.length; i++){
    	query.equalTo("simulationPtr",simulation)
		query.equalTo("teamPtr",teams[i])
		query.equalTo('active', true)
		query.equalTo('exists', true)
		query.include("salaryTabulatorPtr")

	    var count = 0
	    try{
	        count = await query.count()
	    }catch(error){
	        return []
	    }

	    //log("Count: " + count)
	    results = []
    	for(var j = 0; j < noQueries; j++){
	        //log("Index " + (j+1) + " / " + noQueries)
	        query.skip(j*LIMIT_NUMBER_RESULTS)
	        query.limit(LIMIT_NUMBER_RESULTS)
	        try{
	            const tempResult = await query.find()
	            results = results.concat(tempResult)
	        }catch(error){
	            results = []
	        }
	    }

	    resultOutcome = 0
	    for(var j = 0; j < results.length; j++){
  			//log(results[j].get("salaryTabulatorPtr").get("salary"))
  			resultOutcome += Number(results[j].get("salaryTabulatorPtr").get("salary"))
  		}
  		outcome.push(resultOutcome)
    }

    return outcome
}

async function saveOutcomeTeamsWorkers(event,teams,outcome){
	var simulation = event.get("simulationPtr")
	//log("Saving outcome for teams")
	var financialLog = []
	for(var i = 0; i < teams.length; i++){
		var actualMoney = Number(teams[i].get("teamCurrentMoney"))
		var updatedMoney = actualMoney - outcome[i]
		//log(actualMoney + " - " + outcome[i] + " = " + updatedMoney)
		teams[i].set("teamCurrentMoney",""+actualMoney)

		const Table = Parse.Object.extend("TDSimulationFinancialLog")
	    const object = new Table()

	    object.set("simulationPtr", simulation)
	    object.set("amountMoney", outcome[i])
	    object.set("beforeAmount", actualMoney)
	    object.set("afterAmount", updatedMoney)
	    object.set("simulationDate", simulation.get("currentDate"))
	    object.set("type", "EXPENSE")
	    object.set("teamPtr",teams[i])
	    object.set("status", "SALARIES WORKERS")
	    object.set("active", true)
	    object.set("exists", true)
	    financialLog.push(object)
	}

	await Parse.Object.saveAll(teams)
	await Parse.Object.saveAll(financialLog)

	return
}

async function updateCurrentEvent(event){
	var nextTimeEvent = moment().add(event.get("simulationPtr").get("speedSimulation")*24*15,'minutes')
	//var nextTimeEvent = moment().add(event.get("simulationPtr").get("speedSimulation"),'minutes')
	nextTimeEvent = nextTimeEvent.add(-5,'seconds')
	//log("Next hour change will be at " + nextTimeEvent.format("DD/MM/YYYY HH:mm:ss"))

	event.set("triggerTime", nextTimeEvent.valueOf())
	await event.save()
	return
}
