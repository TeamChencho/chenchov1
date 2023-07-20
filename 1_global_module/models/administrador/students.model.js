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

