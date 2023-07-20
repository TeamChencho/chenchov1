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

exports.IniciarSesion = function(correo,contrasena){
    return new Promise(function(resolve,reject) {  
      exports.AsyncBuscarUsuarioAdministracionCorreoElectronico(correo,function(object,error){
        //log("Regreso")
        if(!error){
          if(object){
            //log("Objeto " + object.id)
            var bytes  = Seguridad.desencriptar(object.get("contrasena"), SECRET_KEY_USERS);
            var plaintext = bytes.toString(CryptoJS.enc.Utf8);
  
            //log(" aqui " + contrasena + " " + plaintext)
            if(contrasena === plaintext){
                if(object.get("permisoPtr").get("administracion")){
                    //log("All ok")
                    resolve({type:"BÚSQUEDA", data: object, error: null});
                }else{
                    resolve({type:"BÚSQUEDA", data: null, error: "El usuario no cuenta con los permisos correctos"});
                }
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

  exports.AsyncBuscarUsuarioAdministracionCorreoElectronico = async(correoElectronico,callback) => {
    var Table = Parse.Object.extend("UsuariosSistema")
    var query = new Parse.Query(Table)
    query.equalTo("correoElectronico", correoElectronico)
    query.equalTo("exists",true)
    query.include("permisoPtr")
    try {
      const results = await query.first()
      callback(results,null)
    }catch (error) {
      //throw new Error(error)
      callback(null,error)
    }
  }