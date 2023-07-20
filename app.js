// Import the top-level function of express
const express = require('express')
const fs = require('fs')
const ParseServer = require('parse-server').ParseServer
const http = require('http')
const path = require('path')
const expressLayouts = require('express-ejs-layouts')
const moment = require('moment')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const ParseDashboard = require('parse-dashboard')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const CryptoJS = require("crypto-js")
const Querystring = require('querystring')
const Request = require('request')
const crypto = require('crypto')
const compression = require('compression')
const cors = require('cors')
const zip = require('express-easy-zip')
const schedule = require('node-schedule')
const _ = require('underscore')
const log = console.log
const SocketFunctionality = require('./1_global_module/functionalities/sockets.functionality')

const CONSTANTS  = require('./ConstantsProject')//ConstantsProject({})

let SimulationModel = require("./1_global_module/models/simulation.model") 
let CronerModel     = require("./1_global_module/models/croner.model") 
let BusinessRuleEngine = require('./1_global_module/business_rule_engine/business_rule_engine')
let Simulation = require('./1_global_module/models/advisers/simulations.model')
let SimulationsIterative = require("./1_global_module/models/advisers/simulations.iterative.model.js")

/*********************************************/
/******************CONFIG*********************/
/*********************************************/
var databaseUri = process.env.DATABASE_URI || TESTING_ENVIRONMENT.DATABASE_URI
if (!databaseUri) {
    console.log('DATABASE_URI not specified, falling back to localhost.')
}

/*********************************************/
/*********************************************/
/*******************PARSE*********************/
log(databaseUri)
var api = new ParseServer({
    databaseURI: databaseUri,
    cloud: __dirname + '/cloud/main.js',
    appId: process.env.APP_ID || TESTING_ENVIRONMENT.APP_ID,
    masterKey: process.env.MASTER_KEY || TESTING_ENVIRONMENT.MASTER_KEY,
    serverURL: process.env.SERVER_URL || TESTING_ENVIRONMENT.SERVER_URL,
    appName: process.env.APP_NAME || TESTING_ENVIRONMENT.APP_NAME,
})
/*************************************************/
/*************************************************/
/*******************DASHBOARD*********************/

var dashboard = new ParseDashboard({
    "apps": [{
        "serverURL": process.env.SERVER_URL || TESTING_ENVIRONMENT.SERVER_URL,
        "appId": process.env.APP_ID || TESTING_ENVIRONMENT.APP_ID,
        "masterKey": process.env.MASTER_KEY || TESTING_ENVIRONMENT.MASTER_KEY,
        "appName": process.env.NAME || TESTING_ENVIRONMENT.NAME
    }],
    "users": [{
        "user": "admin",
        "pass": "admin"
    }]
}, { allowInsecureHTTP: true })

var app = express()
app.use(cors())
app.use(compression({ level: 9 }))
app.use(helmet({
    contentSecurityPolicy: false,
  }))
app.use(helmet.xssFilter())
app.use(helmet.referrerPolicy({ policy: 'no-referrer-when-downgrade' }))
app.use(helmet.hsts({ maxAge: 15768000 }))
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', ['1_global_module/views'])
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use(methodOverride())
app.use(bodyParser.json())
app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(bodyParser.json({limit: "500mb"}));
app.use(bodyParser.urlencoded({limit: "500mb", extended: true, parameterLimit:1000000 } ));
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))
app.use(bodyParser.text({ type: 'text/html' }))
app.use(cookieParser())

app.use('/parse', api)
app.use('/dashboard', dashboard)

// Routes HTTP GET requests to the specified path "/" with the specified callback function

app.get('/test', function(req, res) {
    res.status(200).send({status:"success",message:"Welcome To Testing API"})
})

app.get('/', function(req,res) {
    res.render('NovusTec/Landing/index', {
        title: "NovusTec",
        description: "",
        content: "NovusTec",
        currentUser: req.currentUser,
        _: _,
        moment: moment
    });
})

var administrador = require('./1_global_module/routes/administrador.route')
app.use('/administrador', administrador)

var advisers = require('./1_global_module/routes/advisers.route')
app.use('/advisers', advisers)

var alumnos = require('./1_global_module/routes/alumnos.route')
app.use('/alumnos', alumnos)

var simulation = require('./1_global_module/routes/simulation.route')
app.use('/simulation', simulation)

var acceso = require('./1_global_module/routes/acceso.route')
app.use('/acceso', acceso)

var registro = require('./1_global_module/routes/registro.route')
app.use('/registro', registro)

var games = require('./1_global_module/routes/games.route')
app.use('/games', games)

app.get('*', function(req, res){
  res.status(404)

  // respond with html page
  if (req.accepts('html')) {
    res.render('NovusTec/error/error-page/index', {
      title: "Principal", 
      description:"", 
      content:"Guias",
      error:"0",
      errorType: "warning",
      flash: "",
      error_no: "404",
      error_title: "Sorry! The page you were looking cannot be found!",
      error_msg: "We are soyrry, the page you were looking it doesn't exist, it has been modified or deleted.",
      redirect_url: "/"
    })
    return
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' })
    return
  }

  // default to plain-text. send()
  res.type('txt').send('Not found')
  
    
});

/*log("Croners")

var tick = 0
const campaignId = "MY_CUSTOM_ID"
schedule.scheduleJob(campaignId,'', function(){
  tick++
  if(tick == 2){
    var currentJob = schedule.scheduledJobs[campaignId]
    log(currentJob)
    currentJob.cancel()
    currentJob.deleteFromSchedule()
    log(schedule.scheduledJobs)
  }
  
  //console.log(tick + ' The answer to life, the universe, and everything!');
  log(schedule.scheduledJobs)
});*/
log("Iniciando Server")  

//var port = process.env.PORT || portApp;
var httpServer = require('http').createServer(app)
const io = require('socket.io')(httpServer);
const session_handler = require('io-session-handler').from(io, { timeout: 5000 })

session_handler.connectionListener((connection) => {
    //{ id: 'oaZchHEi7kJH8kXbAAAA', token: 'TqHHQJvYxo', status: 1 }
    log(connection)
    if(connection.status == 1){
        SocketFunctionality.search_simulation(session_handler,connection)
    }
})

session_handler.onMessageDelivered((connection) =>{
    switch(connection.type){
        case CONSTANTS.ASK_FOR_SIMULATION:
            //log("Ask for simulation")
            SocketFunctionality.search_simulation(session_handler,connection)
        break;
    }
})

async function processExecution(){
    var results = await CronerModel.GetAllActiveEventNextSimulationsIterative()
    log(results.data.length)

    var simulationsArrayIds = []
    for(var i = 0; i < results.data.length; i++){
        //log("Simulation " + results.data[i].get("simulationPtr").id )
        simulationsArrayIds.push(results.data[i].get("simulationPtr").id)
    }
    
    simulationsArrayIds =  _.uniq(simulationsArrayIds)
    //log(simulationsArrayIds)

    var finalEventsOrderedBySiulationAndIndex = []
    for(var i = 0; i < simulationsArrayIds.length; i++){
        //log("NEW SIMULATION PIPE")
        //log(simulationsArrayIds[i])
        var actualSimulationEvents = _.filter(
            results.data, 
            function(item){ 
                return item.get("simulationPtr").id === simulationsArrayIds[i]
            });
        
        actualSimulationEvents = _.sortBy(actualSimulationEvents, function(item){ return item.get("index") }).reverse()
        for(var j = 0; j < actualSimulationEvents.length; j++){
            finalEventsOrderedBySiulationAndIndex.push(actualSimulationEvents[j])
        }
        //log(" ")
    }

    BusinessRuleEngine.executeProcessEngine(
        finalEventsOrderedBySiulationAndIndex,
        session_handler
    )
}

const PORT = process.env.PORT || TESTING_ENVIRONMENT.PORT
app.set("port", PORT)
httpServer.listen(PORT, function() {
    log('parse-server-example running on port ' + PORT + '.')

    var dispatcherEventos = schedule.scheduleJob('* * * * *', function(){
        //log("Dispatcher de eventos")
        processExecution()
    })
    //Limpiar solicitudes cada 15 minutos
    var desactivarSolicitudesRecuperarContrasena = schedule.scheduleJob('*/15 * * * *', function() {
        log("Limpiando solicitudes de recuperación de contraseña")
        CronerModel.desactivarSolicitudesRecuperarContraseña().then(function(results) {
            //log(results.data.length)
            log("Finalizando eliminación de solicitudes de recuperación de contraseña")
        })
    })

    // ejecutar todos los días a las 3:AM
    var deleteSimualtionLogs = schedule.scheduleJob('0 3 * * *', async () => {
        log("Limpiando simulationLog")
        var logsDeleted = await SimulationsIterative.DeleteSimulationThousand()
        log("Finalizando eliminación de SimulationLogs " + logsDeleted.data.length)
    })

    // ejecutar todos los días a las 12:00
    var addDateSimulations = schedule.scheduleJob('0 12 * * *', async () => {
        log("Agregando fechas a simulaciones sin fecha")
        var simulations = await SimulationsIterative.AddDateSimulations()
        log("Finalizando la asignación de fechas a simulaciones sin fechas " + simulations.data.length)
    })
    
})

module.exports = app