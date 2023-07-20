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
	if(!event.get("simulationPtr")){
		//log("Cannot change hour of simulation, please check " + event.get("simulationPtr").id)
		return false
	}

	//log("Started salaries carriers process")
	
	//TODO: CUERPO PROCESO

	//log("Finished salaries carriers process")
	return true
}
