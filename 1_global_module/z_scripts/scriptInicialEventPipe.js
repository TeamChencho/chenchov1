var path       = require('path')
var fs         = require('fs')
var _          = require('underscore')
var Promise    = require('promise')
var request    = require('request')
var CryptoJS   = require("crypto-js");
let CONSTANTS  = require("../../ConstantsProject") 

var log = console.log

let Seguridad  = require(path.resolve(__dirname, '../middlewares/utils/seguridad.util'));

//var FunctionsGeneral = require(path.join(__dirname, '../../functions/general.js'));
var rawdataTesting       = fs.readFileSync(path.resolve(__dirname, '../../prod-novustec.json'))
var TESTING_ENVIRONMENT  = JSON.parse(rawdataTesting)

//log(TESTING_ENVIRONMENT.apps[0].env)

var Parse = require('parse/node');

const APP_ID = process.env.APP_ID || TESTING_ENVIRONMENT.apps[0].env.APP_ID
const MASTER_KEY = process.env.MASTER_KEY || TESTING_ENVIRONMENT.apps[0].env.MASTER_KEY

Parse._initialize(APP_ID, "", MASTER_KEY)
Parse.serverURL = process.env.PUBLIC_SERVER_URL || TESTING_ENVIRONMENT.apps[0].env.PUBLIC_SERVER_URL


/*PIPE GENERAL DE EVENTOS*/

var pipeEventosArray = []
var DMEventPipe = Parse.Object.extend("DMEventPipe");
var pipeEventos = new DMEventPipe();
pipeEventos.set("event", CONSTANTS.HOUR_CHANGE);
pipeEventos.set("index", 1);
pipeEventos.set("active", true);
pipeEventos.set("exists", true);
pipeEventosArray.push(pipeEventos)

var DMEventPipe = Parse.Object.extend("DMEventPipe");
var pipeEventos = new DMEventPipe();
pipeEventos.set("event", CONSTANTS.ORDER_CREATION);
pipeEventos.set("index", 2);
pipeEventos.set("active", true);
pipeEventos.set("exists", true);
pipeEventosArray.push(pipeEventos)

var DMEventPipe = Parse.Object.extend("DMEventPipe");
var pipeEventos = new DMEventPipe();
pipeEventos.set("event", CONSTANTS.SALARIES_WORKERS);
pipeEventos.set("index", 3);
pipeEventos.set("active", true);
pipeEventos.set("exists", true);
pipeEventosArray.push(pipeEventos)

var DMEventPipe = Parse.Object.extend("DMEventPipe");
var pipeEventos = new DMEventPipe();
pipeEventos.set("event", CONSTANTS.SALARIES_CARRIERS);
pipeEventos.set("index", 4);
pipeEventos.set("active", true);
pipeEventos.set("exists", true);
pipeEventosArray.push(pipeEventos)

var DMEventPipe = Parse.Object.extend("DMEventPipe");
var pipeEventos = new DMEventPipe();
pipeEventos.set("event", CONSTANTS.OPERATIVE_EXPENSES);
pipeEventos.set("index", 5);
pipeEventos.set("active", true);
pipeEventos.set("exists", true);
pipeEventosArray.push(pipeEventos)

var DMEventPipe = Parse.Object.extend("DMEventPipe");
var pipeEventos = new DMEventPipe();
pipeEventos.set("event", CONSTANTS.DEBTS_TO_PAY);
pipeEventos.set("index", 6);
pipeEventos.set("active", true);
pipeEventos.set("exists", true);
pipeEventosArray.push(pipeEventos)

var DMEventPipe = Parse.Object.extend("DMEventPipe");
var pipeEventos = new DMEventPipe();
pipeEventos.set("event", CONSTANTS.ACCOUNTS_RECEIVABLE);
pipeEventos.set("index", 7);
pipeEventos.set("active", true);
pipeEventos.set("exists", true);
pipeEventosArray.push(pipeEventos)

var DMEventPipe = Parse.Object.extend("DMEventPipe");
var pipeEventos = new DMEventPipe();
pipeEventos.set("event", CONSTANTS.ACCOUNTING);
pipeEventos.set("index", 8);
pipeEventos.set("active", true);
pipeEventos.set("exists", true);
pipeEventosArray.push(pipeEventos)

var DMEventPipe = Parse.Object.extend("DMEventPipe");
var pipeEventos = new DMEventPipe();
pipeEventos.set("event", CONSTANTS.PLEASANT_CUSTOMERS);
pipeEventos.set("index", 9);
pipeEventos.set("active", true);
pipeEventos.set("exists", true);
pipeEventosArray.push(pipeEventos)

var DMEventPipe = Parse.Object.extend("DMEventPipe");
var pipeEventos = new DMEventPipe();
pipeEventos.set("event", CONSTANTS.SUPPLIER_QUALIFICATION);
pipeEventos.set("index", 10);
pipeEventos.set("active", true);
pipeEventos.set("exists", true);
pipeEventosArray.push(pipeEventos)

var DMEventPipe = Parse.Object.extend("DMEventPipe");
var pipeEventos = new DMEventPipe();
pipeEventos.set("event", CONSTANTS.INVENTORY);
pipeEventos.set("index", 11);
pipeEventos.set("active", true);
pipeEventos.set("exists", true);
pipeEventosArray.push(pipeEventos)

var DMEventPipe = Parse.Object.extend("DMEventPipe");
var pipeEventos = new DMEventPipe();
pipeEventos.set("event", CONSTANTS.ASSIGNMENT_OF_DELIVERIES_TO_CARRIERS);
pipeEventos.set("index", 12);
pipeEventos.set("active", true);
pipeEventos.set("exists", true);
pipeEventosArray.push(pipeEventos)

var DMEventPipe = Parse.Object.extend("DMEventPipe");
var pipeEventos = new DMEventPipe();
pipeEventos.set("event", CONSTANTS.CLIENT_DELIVERY);
pipeEventos.set("index", 13);
pipeEventos.set("active", true);
pipeEventos.set("exists", true);
pipeEventosArray.push(pipeEventos)

var DMEventPipe = Parse.Object.extend("DMEventPipe");
var pipeEventos = new DMEventPipe();
pipeEventos.set("event", CONSTANTS.SHIFT_CHANGE);
pipeEventos.set("index", 14);
pipeEventos.set("active", true);
pipeEventos.set("exists", true);
pipeEventosArray.push(pipeEventos)

var DMEventPipe = Parse.Object.extend("DMEventPipe");
var pipeEventos = new DMEventPipe();
pipeEventos.set("event", CONSTANTS.DEPRECIATION_OF_FIXED_ASSETS);
pipeEventos.set("index", 15);
pipeEventos.set("active", true);
pipeEventos.set("exists", true);
pipeEventosArray.push(pipeEventos)

var DMEventPipe = Parse.Object.extend("DMEventPipe");
var pipeEventos = new DMEventPipe();
pipeEventos.set("event", CONSTANTS.TAX_COLLECTION);
pipeEventos.set("index", 16);
pipeEventos.set("active", true);
pipeEventos.set("exists", true);
pipeEventosArray.push(pipeEventos)

var DMEventPipe = Parse.Object.extend("DMEventPipe");
var pipeEventos = new DMEventPipe();
pipeEventos.set("event", CONSTANTS.PROBABILITY_EVENTS);
pipeEventos.set("index", 17);
pipeEventos.set("active", true);
pipeEventos.set("exists", true);
pipeEventosArray.push(pipeEventos)

var DMEventPipe = Parse.Object.extend("DMEventPipe");
var pipeEventos = new DMEventPipe();
pipeEventos.set("event", CONSTANTS.ORDER_STATUS_UPDATE);
pipeEventos.set("index", 18);
pipeEventos.set("active", true);
pipeEventos.set("exists", true);
pipeEventosArray.push(pipeEventos)


Parse.Object.saveAll(pipeEventosArray)
.then((list) => {
  log("Pipe eventos creados correctamente")
}, (error) => {
	log(error.message)
});