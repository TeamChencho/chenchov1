var path = require('path')
var fs = require('fs')
var _ = require('underscore')
var moment = require('moment')
var Promise = require('promise')
var request = require('request')
var CryptoJS = require("crypto-js")

var log = console.log

let Seguridad = require(path.resolve(__dirname, '../middlewares/utils/seguridad.util'))

//var FunctionsGeneral = require(path.join(__dirname, '../../functions/general.js'))
var Parse = require('parse/node')

const APP_ID = process.env.APP_ID
const MASTER_KEY = process.env.MASTER_KEY

Parse._initialize(APP_ID, "", MASTER_KEY)
Parse.serverURL = process.env.PUBLIC_SERVER_URL

const LIMIT_NUMBER_RESULTS = 1000

exports.GetAllActiveEventNextSimulationsIterative = async() => {
    var Simulations = Parse.Object.extend("Simulations")
    var innerquery = new Parse.Query(Simulations)
    innerquery.equalTo("status", "RUNNING")
    innerquery.exists("currentDate")
    innerquery.equalTo("active", true)
    innerquery.equalTo("exists", true)

    var Table = Parse.Object.extend("SimulationsEvents")
    var query = new Parse.Query(Table)

    query.matchesQuery("simulationPtr",innerquery)
    query.equalTo("active", true)
    query.equalTo("exists", true)
    query.lessThanOrEqualTo("triggerTime", moment().valueOf())
    query.ascending("index")
    query.include("simulationPtr")

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
            return {results: null, error: error}
        }
    }

    return {data: results, error: null} 
}


exports.desactivarSolicitudesRecuperarContraseña = function() {

    return new Promise(function(resolve, reject) {

        exports.AsyncObtenerDatosVigencia(0, [], function(results, error) {
            if (!error) {

                var datos = results
                for (var i = 0; i < datos.length; i++) {
                    datos[i].set("active", false)
                    datos[i].set("exists", false)
                }
                Parse.Object.saveAll(datos)
                    .then((list) => {
                        resolve({ type: "EDITAR", data: list, error: null })
                    }, (error) => {
                        resolve({ type: "EDITAR", data: null, error: error.message })
                    });
            } else {
                resolve({ type: "EDITAR", data: null, error: error.message })
            }

        })
    })
}

exports.AsyncObtenerDatosVigencia = async(index, dataArray, callback) => {
   
    var Table = Parse.Object.extend("Recoveries")
    var query = new Parse.Query(Table)
    query.equalTo("active", true)
    query.lessThanOrEqualTo("expirationTime", moment().valueOf());
    query.skip(index * 1000)
    query.limit(1000)

    try {
        const results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncObtenerDatosVigencia((index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(dataArray, error)
    }
}
