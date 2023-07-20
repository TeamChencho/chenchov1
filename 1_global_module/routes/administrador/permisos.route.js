const express = require("express")
const router = express.Router()
const controller = require("../../controllers/administrador/permisos.controller.js")
const usuarioActual = require("../../middlewares/generales/usuario_actual.middleware.js")
const validarPermiso = require("../../middlewares/generales/validar_permiso.middleware.js")
//const bitacora = require("../../middlewares/generales/bitacora.middleware.js")

var log = console.log

/*validarPermiso.VerificacionPermiso(COLUMNA,MODULO,PERMISO)*/

router.get("/test", controller.test)

router.get("/",/*usuarioActual,validarPermiso.VerificacionPermiso("permisos","lectura"),*/controller.PermisosPrincipal)

router.get("/datos", controller.ObtenerTodosLosPermisos)

router.post("/datos_agregar", controller.AgregarPermiso)

router.post("/datos_editar", controller.EditarPermiso)

router.post("/datos_archivar", controller.ArchivarPermiso)

router.post("/datos_eliminar", controller.EliminarPermiso)

module.exports = router