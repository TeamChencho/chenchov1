const express = require("express")
const router = express.Router()
const controller = require("../../controllers/moderadores/grupos.controller.js")
const usuarioActual = require("../../middlewares/generales/usuario_actual.middleware.js")
const validarPermiso = require("../../middlewares/generales/validar_permiso.middleware.js")
//const bitacora = require("../../middlewares/generales/bitacora.middleware.js")

var log = console.log

/*validarPermiso.VerificacionPermiso(COLUMNA,MODULO,PERMISO)*/

router.get("/test", controller.test)

router.get("/",/*usuarioActual,validarPermiso.VerificacionPermiso("administracion","permisos","lectura"),*/controller.Principal)

module.exports = router