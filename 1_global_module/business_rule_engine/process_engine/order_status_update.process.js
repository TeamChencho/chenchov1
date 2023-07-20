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

exports.executeProcess = async function(event){
	if(!event.get("simulationPtr") || !event.get("simulationPtr").get("currentDate")){
		//log("Cannot change hour of simulation, please check " + event.get("simulationPtr").id)
		return false
	}

	//log("Started order status update process")
	var orders               = null
	var deliveredRawMaterial = null

	orders = await getAllSimulationsOrdersSuppliersPending(event)
	orders = decreaseDaysDeliveryUpdateAndStatus(event,orders)
	if(orders.length > 0) await saveUpdatedOrdersSuppliers(event,orders)
	deliveredRawMaterial = createDeliveredRawMaterial(event,orders)
	if(deliveredRawMaterial > 0) await saveNewDeliveredRawMaterial(event,deliveredRawMaterial)
	await updateCurrentEvent(event)

	//log("Finished order status update process")
	return true
}

async function getAllSimulationsOrdersSuppliersPending(event){
	var simulation = event.get("simulationPtr")
	//log("Get all simulations orders suppliers thar are PENDING")

	var query = new Parse.Query('SimulationsOrdersSuppliers');
	query.equalTo("simulationPtr",simulation)
	query.equalTo('active', true)
	query.equalTo('exists', true)
	query.notEqualTo('status', "DONE")
	query.limit(1000)
	query.include("teamPtr")
	query.include("simulationOrderPurchaingPtr")
	query.include("SDMSupplierPtr")
	query.include("simulationPtr")
	query.include("DMRawMaterialPtr")

	var results = await query.find()
	return results
}

function decreaseDaysDeliveryUpdateAndStatus(event,orders){
	//log("Decrease days of delivery and update status")
	
	for(var i = 0; i < orders.length; i++){
		var actualDeliveryDays = Number(orders[i].get("deliveryDays"))
		var newDeliveryDays = actualDeliveryDays - 1

		orders[i].set("deliveryDays", "" + newDeliveryDays)
		if(newDeliveryDays <= 0){
			orders[i].set("status","DONE")
		}else{
			orders[i].set("status","ON GOING")
		}
		//log("Updating day from: " + actualDeliveryDays + " - " + newDeliveryDays)
	}

	return orders
}

async function saveUpdatedOrdersSuppliers(event,orders){
	//log("Save update orders of suppliers")
	await Parse.Object.saveAll(orders)
	return
}

function createDeliveredRawMaterial(event,orders){
	//log("Create delivered raw material")
	var deliveredRawMaterial = []

	for(var i = 0; i < orders.length; i++){
		var actualDeliveryDays = Number(orders[i].get("deliveryDays")) 
		if(actualDeliveryDays == 0){
			const Table = Parse.Object.extend("SimulationsDeliveredRawMaterial")
		    const object = new Table()

		    object.set("simulationPtr",orders[i].get("simulationPtr"))
		    object.set("teamPtr",orders[i].get("teamPtr"))
		    object.set("simulationOrderPurchaingPtr",orders[i].get("simulationOrderPurchaingPtr"))
		    object.set("simulationOrderSupplierPtr",orders[i])
		    object.set("totalAmountRawMaterial",Number(orders[i].get("totalAmountRawMaterial")))
		    object.set("active", true)
		    object.set("exists", true)

		    deliveredRawMaterial.push(object)
		}
	}

	//log("Delivered raw material: " + deliveredRawMaterial.length)
	return deliveredRawMaterial
}

async function saveNewDeliveredRawMaterial(event,deliveredRawMaterial){
	//log("Save new delivered raw material")
	await Parse.Object.saveAll(deliveredRawMaterial)
	return
}

async function updateCurrentEvent(event){
	var nextTimeEvent = moment().add(event.get("simulationPtr").get("speedSimulation")*24,'minutes')
	//var nextTimeEvent = moment().add(event.get("simulationPtr").get("speedSimulation"),'minutes')
	nextTimeEvent = nextTimeEvent.add(-5,'seconds')
	//log("Next hour change will be at " + nextTimeEvent.format("DD/MM/YYYY HH:mm:ss"))
	event.set("triggerTime", nextTimeEvent.valueOf())
	await event.save()
	return
}
