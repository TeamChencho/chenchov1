var path = require('path')
var fs = require('fs')
var _ = require('underscore')
var Promise = require('promise')
var request = require('request')
var CryptoJS = require("crypto-js")
var csvparser = require("csv-parser")
var moment = require("moment")

var log = console.log

let Seguridad = require(path.resolve(__dirname, '../../middlewares/utils/seguridad.util'))

//var FunctionsGeneral = require(path.join(__dirname, '../../functions/general.js'))
var Parse = require('parse/node')

const APP_ID = process.env.APP_ID
const MASTER_KEY = process.env.MASTER_KEY

Parse._initialize(APP_ID, "", MASTER_KEY)
Parse.serverURL = process.env.SERVER_URL

exports.GetAllSimulations = function(student) {
    //log("Iniciando promesa")
    return new Promise(function(resolve, reject) {
        
        exports.AsyncGetAllSimulations(0,student,[], function(results, error) {
            //log("Resultados " + results.length)
            if (!error) {
                resolve({ type: "CONSULTA", data: results, error: null })
            } else {
                resolve({ type: "CONSULTA", data: results, error: error.message })
            }

        })
    })
}

exports.AsyncGetAllSimulations = async(index,student,dataArray, callback) => {
    var Table = Parse.Object.extend("SimulationsTeams")
    var query = new Parse.Query(Table)

    query.contains("teamMembers", student.id)
    query.equalTo("active", true)
    query.equalTo("exists", true)
    query.descending("name")
    query.skip(index * 1000)
    query.limit(1000)
    query.include("simulationPtr")
    query.include("simulationPtr.groupPtr")

    try {
        const results = await query.find()
        if (results.length <= 0) {
            //console.log("Finaliza")
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
                //console.log("Avanzando")
            exports.AsyncGetAllSimulations((index + 1),student, dataArray, callback)
        }
    } catch (error) {
        //throw new Error(error)
        log(error.message)
        callback(dataArray, error)
    }
}

exports.GetAllTeamsMembersInSimulationTeam = function(simulationId,members) {
    return new Promise(function(resolve, reject) {
        exports.AsyncGetAllTeamsMembersInSimulationTeam(0,members.split(","),[], function(results, error) {
            if (!error) {
            	
                resolve({ type: "CONSULTA", data: results, error: null })
            } else {
                resolve({ type: "CONSULTA", data: results, error: error.message })
            }
        })
    })
}

exports.AsyncGetAllTeamsMembersInSimulationTeam = async(index,members,dataArray, callback) => {
    var Table = Parse.Object.extend("UsuariosSistema")
    var query = new Parse.Query(Table)

	query.containedIn("objectId",members)
    query.equalTo("active", true)
    query.equalTo("exists", true)
    query.ascending("matricula")
    query.skip(index * 1000)
    query.limit(1000)

    try {
        const results = await query.find()
        if (results.length <= 0) {
            //console.log("Finaliza")
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
                //console.log("Avanzando")
            exports.AsyncGetAllTeamsMembersInSimulationTeam((index + 1),members, dataArray, callback)
        }
    } catch (error) {
        //throw new Error(error)
        callback(dataArray, error)
    }
}