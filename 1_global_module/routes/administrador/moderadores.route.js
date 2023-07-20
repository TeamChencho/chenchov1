const express = require("express")
const router = express.Router()
const controller = require("../../controllers/administrador/usuarios_administracion.controller.js")
const usuarioActual = require("../../middlewares/generales/usuario_actual.middleware.js")
const validarPermiso = require("../../middlewares/generales/validar_permiso.middleware.js")
//const bitacora = require("../../middlewares/generales/bitacora.middleware.js")

var log = console.log

router.get("/test", controller.test)

router.get("/",/*usuarioActual,*/controller.UsuariosAdministracionPrincipal)

router.get("/datos",controller.ObtenerTodosLosUsuariosAdministracion)

router.get("/datos_permisos", controller.ObtenerPermisosAdministrador)

router.post("/datos_agregar", controller.AgregarUsuarioAdministracion)

router.post("/datos_editar", controller.EditarUsuarioAdministracion)

router.post("/datos_archivar", controller.ArchivarUsuarioAdministracion)
 
router.post("/datos_eliminar", controller.EliminarUsuarioAdministracion)

module.exports = router