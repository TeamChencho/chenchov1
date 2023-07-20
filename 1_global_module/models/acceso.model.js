var path       = require('path')
var fs         = require('fs')
var _          = require('underscore')
var Promise    = require('promise')
var request    = require('request')
var moment     = require('moment')
var CryptoJS   = require("crypto-js")
let Seguridad  = require(path.resolve(__dirname, '../middlewares/utils/seguridad.util'))

var log        = console.log

//var FunctionsGeneral = require(path.join(__dirname, '../../functions/general.js'));
var Parse = require('parse/node');

const APP_ID = process.env.APP_ID
const MASTER_KEY = process.env.MASTER_KEY
const SECRET_KEY_USERS = process.env.SECRET_KEY_USERS

Parse._initialize(APP_ID, "", MASTER_KEY)
Parse.serverURL = process.env.PUBLIC_SERVER_URL

/**
 * Modelo que maneja la lógica del módulo de Acceso del sistema 
 * @namespace ModeloAcceso
 */

/**
 * Función que permite iniciar sesión de usuario administrador.
 *
 * @memberof ModeloAcceso
 *
 * @returns {Promise<Object>} JSON con el tipo de consulta, los datos de vuelta y el error en caso de existir
 */
exports.IniciarSesion = function(correo,contrasena){
  return new Promise(function(resolve,reject) {  
    exports.AsyncBuscarUsuarioAdministracionCorreoElectronico(correo,function(object,error){
      //log("Regreso")
      if(!error) {
        if(object) {
          log("Objeto " + object.id)

          if(object.get('contrasena')) {
            var bytes = Seguridad.desencriptar(object.get("contrasena"), SECRET_KEY_USERS);
            var plaintext = bytes.toString(CryptoJS.enc.Utf8);

            //log(" aqui " + contrasena + " " + plaintext)
            if(contrasena === plaintext){
              //log("-----");
              resolve({type:"BÚSQUEDA", data: object, error: null});
            }else{
              resolve({type:"BÚSQUEDA", data: null, error: "La contraseña es incorrecta"});
            }
          } else {
            resolve({type:"BÚSQUEDA", data: null, error: "Verifica que al momento de registrarte haya salido un mensaje de éxito y que la contraseña cumpla con todos los requerimientos"});
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

/**
 * Función asíncrona que manda llamar desde la base de datos un usuario que hay en el sistema a través de su correo electrónico
 *
 * @memberof ModeloAcceso
 *
 * @param {String} correoElectronico Correo electrónico del usuario
 * @param {function} callback Función callback para devolver la información
 *
 */
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

exports.ComprobraUsuario = function ( correo ){

  return new Promise( function ( resolve, reject ) {
    
      exports.AsyncBuscarCorreo( correo, function( object, error ) {
          
          if( error ){ return resolve({ type: 'CONSULTA', data: null, error: error.message }) }
          if( !object ){ return resolve({ type: 'CONSULTA', data: null, error: 'Email verification error' }) }
          resolve({ type: 'CONSULTA', data: object, error: null })

      })
  })
}

exports.AsyncBuscarCorreo = async ( correo, callback ) => {

  var Table = Parse.Object.extend("UsuariosSistema")
  var query = new Parse.Query(Table)

      query.equalTo("correoElectronico", correo)
      query.equalTo("exists", true)
      query.equalTo("active", true)

  try {
      var results = await query.first()
      callback(results, null)
  } catch (error) {
      callback(null,error)
  }

}

exports.RegistrarCodigoRecuperacion = function( correo, codigo ) {

  return new Promise(function(resolve, reject) {

      exports.AsyncBuscarCorreoPeticion(0, [], function( resultPetciones,error ){

          var noBorrarPeticion = false
          if( error ){ return resolve({ type: 'CONSULTA', data: null, error: error.message }) }

          var peticionExistente = _.find(resultPetciones, function(current){
                                              var SECRET_KEY_USERS = process.env.SECRET_KEY_USERS || TESTING_ENVIRONMENT.SECRET_KEY_USERS
                                              var bytes  = Seguridad.desencriptar(current.get("email"), SECRET_KEY_USERS);
                                              var correoDesemcriptado =  bytes.toString(CryptoJS.enc.Utf8);

                                              return correoDesemcriptado == correo
                                       })

          if(peticionExistente){
              noBorrarPeticion = true
          }

          var vigencia = moment().add(15, 'minutes')

          const Table = Parse.Object.extend("Recoveries")
          const object = new Table()

          var SECRET_KEY_USERS = process.env.SECRET_KEY_USERS || TESTING_ENVIRONMENT.SECRET_KEY_USERS
          var correoEncriptado = Seguridad.encriptar(correo, SECRET_KEY_USERS)
          object.set("email",correoEncriptado.toString(CryptoJS.enc.Utf8))
          object.set("code", codigo)
          object.set("expirationTime", vigencia.valueOf());
          object.set("active", true)
          object.set("exists", true)

          object.save().then((object) => {

              if(noBorrarPeticion){
                  peticionExistente.set("exists", false)
                  peticionExistente.set("active", false)
                  peticionExistente.save().then((result) => {
                      resolve({ type: "AGREGAR", data: object, error: null })
                  },(error) => {
                      resolve({ type: "AGREGAR", data: null, error: error.message })
                  })
              }else{
                  resolve({ type: "AGREGAR", data: object, error: null })
              }
              
          },(error) => {
              resolve({ type: "AGREGAR", data: null, error: error.message })
          })

      })

      
  });

}

exports.AsyncBuscarCorreoPeticion = async ( index, dataArray, callback) => {
  var Table = Parse.Object.extend("Recoveries")
  var query = new Parse.Query(Table)

      query.equalTo("exists", true)
      query.equalTo("active", true)
      query.limit(1000)
      query.skip(index * 1000)

  try {
      var results = await query.find()
      if(results.length <= 0){
          dataArray.push.apply(dataArray, results)
          callback(dataArray, null)
      }else{
          dataArray.push.apply(dataArray, results)
          exports.AsyncBuscarCorreoPeticion( (index + 1), dataArray, callback)
      }
  } catch (error) {
      callback(null, error)
  }
}

exports.ValidarCodigoRecuperacion = function ( codigo, correo ){
    
  return new Promise( function ( resolve, reject ) {

      exports.AsyncBuscarCodigo( codigo, function( object, error ) {

          if( error ){ return resolve({ type: 'CONSULTA', data: null, error: 'The code is not correct', codigoCaducado: false }) }

          var SECRET_KEY_USERS = process.env.SECRET_KEY_USERS || TESTING_ENVIRONMENT.SECRET_KEY_USERS
          var bytes  = Seguridad.desencriptar(object.get("email"), SECRET_KEY_USERS);
          var correoDesemcriptado =  bytes.toString(CryptoJS.enc.Utf8);

          if( correoDesemcriptado != correo){
              return resolve({ type: 'CONSULTA', data: null, error: "A problem was found while verifying your code", codigoCaducado: false })
          }

          var correoEncriptado = object.get("email")
          exports.AsyncBuscarCodigoCorreo( codigo, correoEncriptado, function( object, error ) {
              
              if( error ){ return resolve({ type: 'CONSULTA', data: null, error: 'The code is not correct', codigoCaducado: false }) }
              if( !object ){ return resolve({ type: 'CONSULTA', data: null, error: 'The code is not correct', codigoCaducado: false }) }
              if( object ){ 
                  if( !object.get("exists") && !object.get("active") ){
                      return resolve({ type: 'CONSULTA', data: null, error: 'The code has expired', codigoCaducado: true })
                  }
              }
              resolve({ type: 'CONSULTA', data: object, error: null })

          })
      })
  })
}

exports.AsyncBuscarCodigoCorreo = async ( codigo, correo, callback ) => {

  var Table = Parse.Object.extend("Recoveries")
  var query = new Parse.Query(Table)

      query.equalTo("code", codigo)
      query.equalTo("email", correo)

  try {
      var results = await query.first()
      callback(results, null)
  } catch (error) {
      callback(null,error)
  }

} 

exports.AsyncBuscarCodigo = async ( codigo, callback ) => {

  var Table = Parse.Object.extend("Recoveries")
  var query = new Parse.Query(Table)

      query.equalTo("code", codigo)

  try {
      var results = await query.first()
      callback(results, null)
  } catch (error) {
      callback(null,error)
  }

} 

exports.ActualizarContraseña =  function( data , contrasena, correo) {
    
  return new Promise(function(resolve,reject) {

      exports.AsyncObtenerUsuario( correo, function( object,error){
          
          if( error ){ return resolve({ type: 'CONSULTA', data: null, error: error.message }) }

          var SECRET_KEY_USERS = process.env.SECRET_KEY_USERS || TESTING_ENVIRONMENT.SECRET_KEY_USERS
          var ciphertext = Seguridad.encriptar(contrasena, SECRET_KEY_USERS)
          object.set("contrasena",ciphertext.toString(CryptoJS.enc.Utf8))

          object.save().then( (resultUsuario) => {
              data.set("active", false)
              data.set("exists",false)
              data.save().then( (result) => {
                  resolve({ type: "AGREGAR", data: resultUsuario, error: null})
              }, (error) => {
                  resolve({type:"AGREGAR", data: null, error: error.message})
              })
          }, (error) => {
              resolve({type:"AGREGAR", data: null, error: error.message})
          })

      } )

  })

}

exports.AsyncObtenerUsuario = async ( correo, callback ) => {
  var Table = Parse.Object.extend("UsuariosSistema")
  var query = new Parse.Query(Table)

      query.equalTo("correoElectronico", correo)
      query.equalTo("exists", true)
      query.equalTo("active", true)

  try {
      var results = await query.first()
      callback(results, null)
  } catch (error) {
      callback(null, error)
  }
}
