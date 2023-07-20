var path       = require('path')
var fs         = require('fs')
var _          = require('underscore')
var Promise    = require('promise')
var request    = require('request')

var log        = console.log

//var FunctionsGeneral = require(path.join(__dirname, '../../functions/general.js'));
var Parse = require('parse/node')

const APP_ID = process.env.APP_ID
const MASTER_KEY = process.env.MASTER_KEY

Parse._initialize(APP_ID, "", MASTER_KEY)
Parse.serverURL = process.env.PUBLIC_SERVER_URL

/**
 * Modelo que maneja la lógica del módulo de Bitácora del sistema de administración
 * @namespace ModeloBitacora
 */

 /**
 * Función que permite conexión con controladores y manda llamar la función asíncrona para obtener todos 
 * los usuarios de la aplicación que hay en el sistema en estado de Registro
 *
 * @memberof ModeloUsuariosApp
 * @returns {Promise<Object>} JSON con el tipo de consulta, los datos de vuelta y el error en caso de existir
 */
exports.ObtenerTodasLasBitacorasDeUnUsuario = function(usuario){
	//log("Iniciando promesa")
	return new Promise(function(resolve,reject) {
		log("Iniciando recursión")
		//recursionInsuranceCarriers(0, data, resolve, reject)
		exports.AsyncObtenerTodasLasBitacorasDeUnUsuario(usuario,0, [], function(results,error){
			log("Resultados " + results.length)
			if(!error){
				resolve({type:"CONSULTA", data: results, error: null})
			}else{
				resolve({type:"CONSULTA", data: results, error: error.message})
			}
			
		})
	})
}

/**
 * Función asíncrona recursiva que manda llamar desde la base de datos todos los usuarios de administración que hay en el sistema
 *
 * @memberof ModeloUsuariosApp
 *
 * @param {Number} usuario Usuario del cual se obtendrá la bitácora
 * @param {Number} index Índice del nivel de recursión en el que se encuentra la función
 * @param {Array} data Lista de todos los objetos recuperados por toda la recursión
 * @param {function} callback Función callback para devolver la información
 *
 */
exports.AsyncObtenerTodasLasBitacorasDeUnUsuario = async(usuario,index,dataArray,callback) => {
	var user = Parse.Object.extend("UsuariosSistema")
    var userBuscar = new user()
	userBuscar.id=usuario

  var Table = Parse.Object.extend("Bitacora")
	var query = new Parse.Query(Table)

  query.equalTo("usuarioPtr", userBuscar)
  query.ascending("name")
  query.skip(index * 1000)
  query.limit(1000)
  query.include("usuarioPtr")
  try {
    const results = await query.find()
    if(results.length <= 0){
			//console.log("Finaliza")
			dataArray.push.apply(dataArray, results)
			callback(dataArray,null)
		}else{
			dataArray.push.apply(dataArray, results)
			//console.log("Avanzando")
			exports.AsyncObtenerTodasLasBitacorasDeUnUsuario(usuario,(index+1), dataArray,callback)
		}
  }catch (error) {
    //throw new Error(error)
    callback(dataArray,error)
  }
}

/**
 * Función que permite añadir una bitácora a la base de datos
 *
 * @memberof ModeloUsuariosApp
 *
 * @param {ParseObject} usuario Objeto responsable de la actividad a guardar en la bitácora
 * @param {String} epic Identificador del proceso que se está ejecutando
 * @param {String} actividad Descripción de la actividad realizada
 *
 * @returns {Promise<Object>} JSON con el tipo de consulta, los datos de vuelta y el error en caso de existir
 */
exports.AgregarBitacora = function(usuario,actividad){
	return new Promise(function(resolve,reject) {
		//log(usuario.id)
		const Table = Parse.Object.extend("Bitacora")
		const object = new Table();
		var nombreCompleto = usuario.get("nombre") + " " + usuario.get("apellidoPaterno") + " " + usuario.get("apellidoMaterno")

		object.set("usuarioPtr", usuario)
		object.set("actividad", actividad)
		object.set("recurso", nombreCompleto)
		object.set("active", true)
		object.set("exists", true)
		
		object.save()
		.then((object) => {
		  resolve({type:"AGREGAR", data: object, error: null})
		}, (error) => {
		  resolve({type:"AGREGAR", data: null, error: error.message})
		});  	
	});
}


exports.AddSimulationLog = function(activity,simulation,team,user,option, description){
	return new Promise(function(resolve,reject) {
		//log(usuario.id)
		const Table = Parse.Object.extend("SimulationsLogs")
		const object = new Table();
		
		if(user){
			var nombreCompleto = user.get("nombre") + " " + user.get("apellidoPaterno") + " " + user.get("apellidoMaterno")
			object.set("userPtr", user)
			object.set("userName", nombreCompleto)

		}
		if(team){
			var SimulationsTeams    = Parse.Object.extend("SimulationsTeams")
			var teamPtr               = new SimulationsTeams()
				teamPtr.id             = team

				object.set("teamPtr", teamPtr)
		}
		if(typeof(simulation) == 'string'){
			var Simulations         = Parse.Object.extend("Simulations")
			var simulationPtr         = new Simulations()
				simulationPtr.id       = simulation

			object.set("simulationPtr", simulationPtr)
		}else{
			object.set("simulationPtr", simulation)
		}
		if(option){
			object.set("optionSimulation", option)	
		}
		if(description){
			object.set("description", description)	
		}

		object.set("activity", activity)
		object.set("active", true)
		object.set("exists", true)
		
		object.save()
		.then((object) => {
		  resolve({type:"AGREGAR", data: object, error: null})
		}, (error) => {
		  resolve({type:"AGREGAR", data: null, error: error.message})
		});  	
	});
}
