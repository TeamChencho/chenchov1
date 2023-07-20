var path = require('path')
var fs = require('fs')
var _ = require('underscore')
var Promise = require('promise')
var request = require('request')

var log = console.log

//var FunctionsGeneral = require(path.join(__dirname, '../../functions/general.js'));

var Parse = require('parse/node');
const { object, functions } = require('underscore')

const APP_ID = process.env.APP_ID 
const MASTER_KEY = process.env.MASTER_KEY

Parse._initialize(APP_ID, "", MASTER_KEY)
Parse.serverURL = process.env.PUBLIC_SERVER_URL

exports.DataPipeEvents = function () {
    return new Promise(function (resolve, reject) {
        exports.AsyncDataPipeEvents(function (grupos, error) {
            if (!error) {
                resolve({ type: "CONSULTA", data: grupos, error: null })
            } else {
                resolve({ type: "CONSULTA", data: grupos, error: error.message })
            }
        })
    })
}

exports.AsyncDataPipeEvents = async (callback) => {
    var GruposUsuarios = Parse.Object.extend("DMEventPipe")
    var query = new Parse.Query(GruposUsuarios)

    query.equalTo("exists", true)
    try {
        const results = await query.find()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.AsyncSearchPipeEvent = async (idEvent, callback) => {
    var Grupos = Parse.Object.extend("DMEventPipe")
    var query = new Parse.Query(Grupos)

    query.equalTo("objectId", idEvent)
    query.equalTo("exists", true)

    try {
        const results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.ArchivePipeEvent = function (idEvent, seActiva) {
    return new Promise(function (resolve, reject) {
        exports.AsyncSearchPipeEvent(idEvent, function (pipeEvent, error) {

            if (seActiva === "true") {
                pipeEvent.set("active", true)
            } else if (seActiva === "false") {
                pipeEvent.set("active", false)
            }

            pipeEvent.save().then((pipeEvent) => {
                resolve({ type: "ARCHIVAR", data: pipeEvent, error: null })
            }, (error) => {
                resolve({ type: "ARCHIVAR", data: null, error: error.message })
            })

        })
    })
}
