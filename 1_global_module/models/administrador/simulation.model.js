var path = require('path')
var fs = require('fs')
var _ = require('underscore')
var Promise = require('promise')
var request = require('request')
var CryptoJS = require("crypto-js")
var csvparser = require("csv-parser")
var moment = require('moment')

var log = console.log

let Seguridad = require(path.resolve(__dirname, '../../middlewares/utils/seguridad.util'))

//var FunctionsGeneral = require(path.join(__dirname, '../../functions/general.js'))
var Parse = require('parse/node')

const APP_ID = process.env.APP_ID
const MASTER_KEY = process.env.MASTER_KEY

Parse._initialize(APP_ID, "", MASTER_KEY)
Parse.serverURL = process.env.SERVER_URL

exports.GetAllSimulations = function() {
  //log("Iniciando promesa")
  return new Promise(function(resolve, reject) {
      
      exports.AsyncGetAllSimulations(0,[], function(results, error) {
          //log("Resultados " + results.length)
          if (!error) {
              resolve({ type: "CONSULTA", data: results, error: null })
          } else {
              resolve({ type: "CONSULTA", data: results, error: error.message })
          }
      })
  })
}

exports.AsyncGetAllSimulations = async(index,dataArray, callback) => {
  var Table = Parse.Object.extend("Simulations")
  var query = new Parse.Query(Table)

  query.equalTo("exists", true)
  query.descending("createdAt")
  query.skip(index * 1000)
  query.limit(1000)
  query.include("groupPtr")

  try {
      const results = await query.find()
      if (results.length <= 0) {
          dataArray.push.apply(dataArray, results)
          callback(dataArray, null)
      } else {
          dataArray.push.apply(dataArray, results)
              //console.log("Avanzando")
          exports.AsyncGetAllSimulations((index + 1), dataArray, callback)
      }
  } catch (error) {
      //throw new Error(error)
      callback(dataArray, error)
  }
}

exports.GetAllGroups = function() {
  //log("Iniciando promesa")
  return new Promise(function(resolve, reject) {
      
      exports.AsyncGetAllGroups(0,[], function(results, error) {
          //log("Resultados " + results.length)
          if (!error) {
              resolve({ type: "CONSULTA", data: results, error: null })
          } else {
              resolve({ type: "CONSULTA", data: results, error: error.message })
          }

      })
  })
}

exports.AsyncGetAllGroups = async(index,dataArray, callback) => {
  var Table = Parse.Object.extend("Grupos")
  var query = new Parse.Query(Table)
  //log(adviser.id)
  query.equalTo("active", true)
  query.equalTo("exists", true)
  
  query.descending("createdAt")
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
          exports.AsyncGetAllGroups((index + 1), dataArray, callback)
      }
  } catch (error) {
      //throw new Error(error)
      callback(dataArray, error)
  }
}

exports.GetAllSimulationsAdviser = function(groups) {
  //log("Iniciando promesa")
  return new Promise(function(resolve, reject) {
      
      exports.AsyncGetAllSimulationsAdviser(0,[],groups, function(results, error) {
          //log("Resultados " + results.length)
          if (!error) {
              resolve({ type: "CONSULTA", data: results, error: null })
          } else {
              resolve({ type: "CONSULTA", data: results, error: error.message })
          }
      })
  })
}

exports.AsyncGetAllSimulationsAdviser = async(index,dataArray,groups, callback) => {
  var Grupos = Parse.Object.extend("Grupos")
  var innerquery = new Parse.Query(Grupos)
  innerquery.containedIn("objectId", groups)

  var Table = Parse.Object.extend("Simulations")
  var query = new Parse.Query(Table)

  query.equalTo("exists", true)
  query.descending("createdAt")
  query.skip(index * 1000)
  query.limit(1000)
  query.include("groupPtr")
  query.matchesQuery("groupPtr", innerquery);

  try {
      const results = await query.find()
      if (results.length <= 0) {
          //console.log("Finaliza")
          dataArray.push.apply(dataArray, results)
          callback(dataArray, null)
      } else {
          dataArray.push.apply(dataArray, results)
              //console.log("Avanzando")
          exports.AsyncGetAllSimulationsAdviser((index + 1), dataArray,groups, callback)
      }
  } catch (error) {
      //throw new Error(error)
      callback(dataArray, error)
  }
}

exports.GetAllGroupsAdviser = function(adviser) {
  //log("Iniciando promesa")
  return new Promise(function(resolve, reject) {
      
      exports.AsyncGetAllGroupsAdviser(0,adviser,[], function(results, error) {
          //log("Resultados " + results.length)
          if (!error) {
              resolve({ type: "CONSULTA", data: results, error: null })
          } else {
              resolve({ type: "CONSULTA", data: results, error: error.message })
          }

      })
  })
}

exports.AsyncGetAllGroupsAdviser = async(index,adviser,dataArray, callback) => {
  var Table = Parse.Object.extend("GruposUsuarios")
  var query = new Parse.Query(Table)

  const Groups = Parse.Object.extend("Grupos")
  const innerQuery = new Parse.Query(Groups)
  innerQuery.equalTo("active", true)
  innerQuery.equalTo("exists", true)
  query.matchesQuery("grupoPtr", innerQuery);

  //log(adviser.id)
  query.equalTo("active", true)
  query.equalTo("exists", true)
  query.equalTo("usuarioPtr", adviser)
  query.descending("createdAt")
  query.skip(index * 1000)
  query.limit(1000)
  query.include("grupoPtr")

  try {
      const results = await query.find()
      if (results.length <= 0) {
          //console.log("Finaliza")
          dataArray.push.apply(dataArray, results)
          callback(dataArray, null)
      } else {
          dataArray.push.apply(dataArray, results)
              //console.log("Avanzando")
          exports.AsyncGetAllGroupsAdviser((index + 1),adviser, dataArray, callback)
      }
  } catch (error) {
      //throw new Error(error)
      callback(dataArray, error)
  }
}

exports.AddingSimulation = function(data) {

  return new Promise(function(resolve, reject) { 
      const Table = Parse.Object.extend("Simulations")
      const object = new Table()

      if (data["simulationName"]) {
          object.set("simulationName", data["simulationName"])
      }
      
      if(data["group"]){
        var Group = Parse.Object.extend("Grupos")
        var pointerToGroup = new Group()
        pointerToGroup.id = data["group"]
        object.set("groupPtr", pointerToGroup)
      }
      
      if(data["startDateHidden"]){
          object.set("currentDate", Number(data["startDateHidden"]))
      }
      
      object.set("nextHour", moment().valueOf())   
      object.set("speedSimulation", 60)
      object.set("status", "PAUSED")
      object.set("active", true)
      object.set("exists", true)                    

      object.save()
      .then((object) => {   
            resolve({ type: "AGREGAR", data: object, error: null })
      }, (error) => {
            resolve({ type: "AGREGAR", data: null, error: error.message })
      })
  })
}

exports.ArchiveSimulation = function(objectId, seActiva) {
  return new Promise(function(resolve, reject) {
      exports.AsyncSearchSimulation(objectId, function(object, error) {
          if (!error) {
              if (object) {
                  if (seActiva === "true") {
                      object.set("active", true)
                  } else if (seActiva === "false") {
                      object.set("active", false)
                      object.set("status", "PAUSED")
                  }



                  object.save()
                      .then((object) => {
                          resolve({ type: "ARCHIVAR", data: object, error: null })
                      }, (error) => {
                          resolve({ type: "ARCHIVAR", data: null, error: error.message })
                      })
              } else {
                  resolve({ type: "ARCHIVAR", data: null, error: "No se encontró el usuario" })
              }
          } else {
              resolve({ type: "ARCHIVAR", data: null, error: error.message })
          }

      })
  })
}

exports.EraseSimulation = function(objectId) {
  return new Promise(function(resolve, reject) {
      exports.AsyncSearchSimulation(objectId, function(object, error) {
          if (!error) {
              if (object) {
                object.set("status", "PAUSED")
                  object.set("active", false)
                  object.set("exists", false)

                  object.save()
                      .then((object) => {
                          resolve({ type: "ELIMINAR", data: object, error: null })
                      }, (error) => {
                          resolve({ type: "ELIMINAR", data: null, error: error.message })
                      })
              } else {
                  resolve({ type: "ELIMINAR", data: null, error: "User not found" })
              }
          } else {
              resolve({ type: "ELIMINAR", data: null, error: error.message })
          }
      })
  })
}

exports.SearchSimulation = function(objectId) {
  //console.log("object ID" + objectId)
  return new Promise(function(resolve, reject) {
      exports.AsyncSearchSimulation(objectId, function(object, error) {
          if (!error) {
              //console.log("ingreso al primer if en el metodo AsyncBuscarUsuarioAdministracion en BuscarUsuarioAdministracion en el usuarios_administracion.model")
              if (object) {
                  //console.log("ingreso al segundo if en el metodo AsyncBuscarUsuarioAdministracion en BuscarUsuarioAdministracion en el usuarios_administracion.model")
                  resolve({ type: "BÚSQUEDA", data: object, error: null })
              } else {
                  //console.log("ingreso al primer else en el metodo AsyncBuscarUsuarioAdministracion en BuscarUsuarioAdministracion en el usuarios_administracion.model")
                  resolve({ type: "BÚSQUEDA", data: null, error: "Simulation not found" })
              }
          } else {
              //console.log("ingreso al primer else en el metodo AsyncBuscarUsuarioAdministracion en BuscarUsuarioAdministracion en el usuarios_administracion.model")
              resolve({ type: "BÚSQUEDA", data: null, error: error.message })
          }
      })
  })
}

exports.AsyncSearchSimulation = async(objectId, callback) => {
  var Table = Parse.Object.extend("Simulations")
  var query = new Parse.Query(Table)
  query.equalTo("objectId", objectId)
  query.equalTo("exists", true)
  query.include("groupPtr")
  try {
      const results = await query.first()
      callback(results, null)
  } catch (error) {
      callback(null, error)
          //throw new Error(error)
  }
}

exports.UpdateSimulationSettings = function(objectId, data) {
  return new Promise(function(resolve, reject) {
      exports.AsyncSearchSimulation(objectId, function(object, error) {
          if (!error) {
              if (object) {
        if (data["simulation_speed"]) {
                object.set("speedSimulation", Number(data["simulation_speed"]))
            }

            if (data["simulation_status"]) {
                object.set("status", data["simulation_status"])
            }

                  object.save()
                      .then((object) => {
                          resolve({ type: "ARCHIVAR", data: object, error: null })
                      }, (error) => {
                          resolve({ type: "ARCHIVAR", data: null, error: error.message })
                      })
              } else {
                  resolve({ type: "ARCHIVAR", data: null, error: "No se encontró el usuario" })
              }
          } else {
              resolve({ type: "ARCHIVAR", data: null, error: error.message })
          }

      })
  })
}

exports.GetAllStudentsInGroup = function(groupId) {
  //log("Iniciando promesa")
  return new Promise(function(resolve, reject) {
      
      exports.AsyncGetAllStudentsInGroup(0,groupId,[], function(results, error) {
          //log("Resultados " + results.length)
          if (!error) {
            //log("Pre: " + results.length)
            results = _.filter(results, function(item){ 
              return item.get("usuarioPtr").get("permisoPtr").get("clave") === "ALUMNO"
            })
            //log("After: " + results.length)
              resolve({ type: "CONSULTA", data: results, error: null })
          } else {
              resolve({ type: "CONSULTA", data: results, error: error.message })
          }

      })
  })
}

exports.AsyncGetAllStudentsInGroup = async(index,groupId,dataArray, callback) => {
  var Table = Parse.Object.extend("GruposUsuarios")
  var query = new Parse.Query(Table)

  var Group = Parse.Object.extend("Grupos")
  var pointerToGroup = new Group()
  pointerToGroup.id = groupId

  query.equalTo("grupoPtr",pointerToGroup)
  query.equalTo("exists", true)
  query.equalTo("active", true)
  query.ascending("matricula")
  query.skip(index * 1000)
  query.limit(1000)
  query.include("grupoPtr")
  query.include("usuarioPtr")
  query.include("usuarioPtr.permisoPtr")

  try {
      const results = await query.find()
      if (results.length <= 0) {
          //console.log("Finaliza")
          dataArray.push.apply(dataArray, results)
          callback(dataArray, null)
      } else {
          dataArray.push.apply(dataArray, results)
              //console.log("Avanzando")
          exports.AsyncGetAllStudentsInGroup((index + 1),groupId, dataArray, callback)
      }
  } catch (error) {
      //throw new Error(error)
      callback(dataArray, error)
  }
}

exports.AddingSimulationTeam = function(simulationId,data) {
  return new Promise(function(resolve, reject) { 
      const Table = Parse.Object.extend("SimulationsTeams")
      const object = new Table()

      if (data["teamName"]) {
          object.set("teamName", data["teamName"])
      }

      if (data["teamMembers"]) {
          object.set("teamMembers", data["teamMembers"])
      }

      var Simulation = Parse.Object.extend("Simulations")
      var pointerToSimulation = new Simulation()
      pointerToSimulation.id = simulationId
      object.set("simulationPtr", pointerToSimulation)

      object.set("active", true)
      object.set("exists", true)                    

      object.save()
      .then((object) => {       
          resolve({ type: "AGREGAR", data: object, error: null })
      }, (error) => {
          resolve({ type: "AGREGAR", data: null, error: error.message })
      })
  })
}

exports.GetAllTeamsInSimulation = function(simulationId) {
  //log("Iniciando promesa")
  return new Promise(function(resolve, reject) {
      
      exports.AsyncGetAllTeamsInSimulation(0,simulationId,[], function(results, error) {
          if (!error) {
              resolve({ type: "CONSULTA", data: results, error: null })
          } else {
              resolve({ type: "CONSULTA", data: results, error: error.message })
          }

      })
  })
}

exports.AsyncGetAllTeamsInSimulation = async(index,simulationId,dataArray, callback) => {
  var Table = Parse.Object.extend("SimulationsTeams")
  var query = new Parse.Query(Table)

  //log(simulationId)
  var Simulations = Parse.Object.extend("Simulations")
  var pointerToSimulation = new Simulations()
  pointerToSimulation.id = simulationId

  query.equalTo("simulationPtr",pointerToSimulation)
  query.equalTo("exists", true)
  query.ascending("teamName")
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
          exports.AsyncGetAllTeamsInSimulation((index + 1),simulationId, dataArray, callback)
      }
  } catch (error) {
      //throw new Error(error)
      callback(dataArray, error)
  }
}

exports.ArchiveSimulationTeam = function(objectId, seActiva) {
  return new Promise(function(resolve, reject) {
      exports.AsyncSearchSimulationTeam(objectId, function(object, error) {
          if (!error) {
              if (object) {
                  if (seActiva === "true") {
                      object.set("active", true)
                  } else if (seActiva === "false") {
                      object.set("active", false)
                      object.set("status", "PAUSED")
                  }

                  object.save()
                      .then((object) => {
                          resolve({ type: "ARCHIVAR", data: object, error: null })
                      }, (error) => {
                          resolve({ type: "ARCHIVAR", data: null, error: error.message })
                      })
              } else {
                  resolve({ type: "ARCHIVAR", data: null, error: "No se encontró el usuario" })
              }
          } else {
              resolve({ type: "ARCHIVAR", data: null, error: error.message })
          }

      })
  })
}

exports.EraseSimulationTeam = function(objectId) {
  return new Promise(function(resolve, reject) {
      exports.AsyncSearchSimulationTeam(objectId, function(object, error) {
          if (!error) {
              if (object) {
                  object.set("active", false)
                  object.set("exists", false)

                  object.save()
                      .then((object) => {
                          resolve({ type: "ELIMINAR", data: object, error: null })
                      }, (error) => {
                          resolve({ type: "ELIMINAR", data: null, error: error.message })
                      })
              } else {
                  resolve({ type: "ELIMINAR", data: null, error: "User not found" })
              }
          } else {
              resolve({ type: "ELIMINAR", data: null, error: error.message })
          }
      })
  })
}

exports.SearchSimulationTeam = function(objectId) {
  //console.log("object ID" + objectId)
  return new Promise(function(resolve, reject) {
      exports.AsyncSearchSimulationTeam(objectId, function(object, error) {
          if (!error) {
              //console.log("ingreso al primer if en el metodo AsyncBuscarUsuarioAdministracion en BuscarUsuarioAdministracion en el usuarios_administracion.model")
              if (object) {
                  //console.log("ingreso al segundo if en el metodo AsyncBuscarUsuarioAdministracion en BuscarUsuarioAdministracion en el usuarios_administracion.model")
                  resolve({ type: "BÚSQUEDA", data: object, error: null })
              } else {
                  //console.log("ingreso al primer else en el metodo AsyncBuscarUsuarioAdministracion en BuscarUsuarioAdministracion en el usuarios_administracion.model")
                  resolve({ type: "BÚSQUEDA", data: null, error: "Simulation not found" })
              }
          } else {
              //console.log("ingreso al primer else en el metodo AsyncBuscarUsuarioAdministracion en BuscarUsuarioAdministracion en el usuarios_administracion.model")
              resolve({ type: "BÚSQUEDA", data: null, error: error.message })
          }
      })
  })
}

exports.AsyncSearchSimulationTeam = async(objectId, callback) => {
  var Table = Parse.Object.extend("SimulationsTeams")
  var query = new Parse.Query(Table)
  query.equalTo("objectId", objectId)
  query.equalTo("exists", true)
  query.include("simulationPtr")
  try {
      const results = await query.first()
      callback(results, null)
  } catch (error) {
      callback(null, error)
          //throw new Error(error)
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