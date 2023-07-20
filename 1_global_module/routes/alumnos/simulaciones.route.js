const express = require("express")
const router = express.Router()
const controller = require("../../controllers/alumnos/simulaciones.controller.js")
const usuarioActual = require("../../middlewares/generales/usuario_actual.middleware.js")
const validarPermiso = require("../../middlewares/generales/validar_permiso.middleware.js")
const bitacora = require("../../middlewares/generales/bitacora.middleware.js")

var log = console.log

/*validarPermiso.VerificacionPermiso(COLUMNA,MODULO,PERMISO)*/

router.get("/test", controller.test)

router.get("/",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "lectura"),
	bitacora.AnadirBitacora("Consult student simulations"),
	controller.Principal)

router.get("/data",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO","simulaciones","lectura"),
	bitacora.AnadirBitacora("Query list of simulations"),
	controller.GetAllSimulations)

router.post("/data_team_members",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO","simulaciones","lectura"),
	bitacora.AnadirBitacora("Query list of teams members in simulation team"),
	controller.GetAllTeamsMembersInSimulationTeam)

module.exports = router