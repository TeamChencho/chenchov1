var path       = require('path')
var fs         = require('fs')
var _          = require('underscore')
var Promise    = require('promise')
var request    = require('request')

var CryptoJS   = require("crypto-js")
let Seguridad  = require(path.resolve(__dirname, '../middlewares/utils/seguridad.util'))
var log        = console.log

const SECRET_KEY_USERS = process.env.SECRET_KEY_USERS 

//var FunctionsGeneral = require(path.join(__dirname, '../../functions/general.js'));

var Parse = require('parse/node');

const APP_ID = process.env.APP_ID 
const MASTER_KEY = process.env.MASTER_KEY 

Parse._initialize(APP_ID, "", MASTER_KEY)
Parse.serverURL = process.env.PUBLIC_SERVER_URL 