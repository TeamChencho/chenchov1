let Bitacora      = require("../../models/administrador/bitacora.model") 

let log = console.log

exports.AnadirBitacora = function(actividad) {
  return function(req,res,next){
    Bitacora.AgregarBitacora(req.currentUser,actividad)
	  next()     
  }
}

exports.AddSimulationLog = function(activity,simulation,team,user,option) {
  if(typeof(simulation) != 'string' && simulation != undefined) {
    //Para los procesos
    Bitacora.AddSimulationLog(activity,simulation,team,user)
  }else{
    //Para las rutas
    return function(req,res,next){
      //log(req.body)
      Bitacora.AddSimulationLog(activity,req.params.simulationId,req.params.teamId,req.currentUser,option,req.body.messageLogs)
      next()     
    }
  }
}