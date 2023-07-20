let SimulationModel  = require("../models/simulation.model") 
let CONSTANTS        = require("../../ConstantsProject") 
var moment = require('moment')
var _      = require('underscore')

var log = console.log

//{ id: 'oaZchHEi7kJH8kXbAAAA', token: 'TqHHQJvYxo', status: 1 }

exports.search_simulation = function(session_handler,connection) {
    SimulationModel.SearchSimulation(connection.token).then(function (results) {
        var resultData = {
            type:CONSTANTS.ASK_FOR_SIMULATION,
            status:CONSTANTS.SUCCESS,
            data: null,
            error: null
        }
        if (!results.error && results.data) {
            resultData.data = results.data
            resultData.status = CONSTANTS.SUCCESS
        }else{
            resultData.error  = results.error
            resultData.status = CONSTANTS.ERROR
        }

        session_handler.pushMessage(connection.token, resultData)
    })       
}

exports.update_hour_change_simulation = function(session_handler,simulationId,currentTime) {
    var resultData = {
        type:CONSTANTS.HOUR_CHANGE,
        status:CONSTANTS.SUCCESS,
        data: {
            currentTime: currentTime
        },
        error: null
    }

    resultData.status = CONSTANTS.SUCCESS

    session_handler.pushMessage(simulationId, resultData)      
}
