const express = require("express")
const router = express.Router()
const controller = require("../../controllers/administrador/events.controller.js")
const usuarioActual = require("../../middlewares/generales/usuario_actual.middleware.js")
const validarPermiso = require("../../middlewares/generales/validar_permiso.middleware.js")
const bitacora = require("../../middlewares/generales/bitacora.middleware.js")

var log = console.log

router.get("/test", controller.test)

router.get("/",
	usuarioActual,
	validarPermiso.VerificacionPermiso("SUPERADMIN", "eventos", "lectura"),
	bitacora.AnadirBitacora("Consults view events administration"),
	controller.EventosPrincipal)

router.get("/data",
	usuarioActual,
	validarPermiso.VerificacionPermiso("SUPERADMIN", "eventos", "lectura"),
	bitacora.AnadirBitacora("Consults pipe event list"),
	controller.DataPipeEvents)

router.post("/data_archive", 
	usuarioActual,
	validarPermiso.VerificacionPermiso("SUPERADMIN", "eventos", "eliminacion"),
	bitacora.AnadirBitacora("Archive pipe event"),
	controller.ArchivePipeEvent)
 

module.exports = router