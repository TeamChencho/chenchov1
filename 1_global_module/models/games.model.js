var path       = require('path')
var fs         = require('fs')
var _          = require('underscore')
var Promise    = require('promise')
var request    = require('request')
var moment     = require('moment')

var log        = console.log

var Parse = require('parse/node');

const APP_ID = process.env.APP_ID
const MASTER_KEY = process.env.MASTER_KEY
const SECRET_KEY_USERS = process.env.SECRET_KEY_USERS

Parse._initialize(APP_ID, "", MASTER_KEY)
Parse.serverURL = process.env.PUBLIC_SERVER_URL

exports.IniciarSesion = function(correo,contrasena){
  return new Promise(function(resolve,reject) {  
    exports.AsyncBuscarUsuarioAdministracionCorreoElectronico(correo,function(object,error){
      //log("Regreso")
      if(!error){
        if(object){
          //log("Objeto " + object.id)
          var bytes  = Seguridad.desencriptar(object.get("password"), SECRET_KEY_USERS);
          var plaintext = bytes.toString(CryptoJS.enc.Utf8);

          log(" aqui " + contrasena + " " + plaintext)
          if(contrasena === plaintext){
            //console.log("-----");
            resolve({type:"BÚSQUEDA", data: object, error: null});
          }else{
            resolve({type:"BÚSQUEDA", data: null, error: "La contraseña es incorrecta"});
          }
        }else{
          resolve({type:"BÚSQUEDA", data: null, error: "No se encontró el usuario"});
        }
      }else{
        resolve({type:"BÚSQUEDA", data: null, error: error.message})  
      } 
    })
  });
}