const express = require("express")
const router = express.Router()
const controller = require("../../controllers/administrador/simulation.controller.js")
const usuarioActual = require("../../middlewares/generales/usuario_actual.middleware.js")
const validarPermiso = require("../../middlewares/generales/validar_permiso.middleware.js")
const bitacora = require("../../middlewares/generales/bitacora.middleware.js")

var log = console.log

router.get("/test", controller.test)

router.get("/",
	usuarioActual,
	validarPermiso.VerificacionPermiso("SUPERADMIN","simulaciones","lectura"),
	bitacora.AnadirBitacora("Consults view simulations"),
	controller.SimulationsPrincipal
)

router.get("/datos",
	usuarioActual,
	validarPermiso.VerificacionPermiso("SUPERADMIN", "simulaciones", "lectura"),
	bitacora.AnadirBitacora("Consults simulation list"),
	controller.GetAllSimulations
)

router.get("/datos_admin",
	usuarioActual,
	validarPermiso.VerificacionPermiso("SUPERADMIN", "simulaciones", "lectura"),
	bitacora.AnadirBitacora("Consults adviser simulation list"),
	controller.GetAllSimulationsAdviser
)

module.exports = router