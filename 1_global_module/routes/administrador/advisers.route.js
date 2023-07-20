const express = require("express")
const router = express.Router()
const controller = require("../../controllers/administrador/advisers.controller.js")
const usuarioActual = require("../../middlewares/generales/usuario_actual.middleware.js")
const validarPermiso = require("../../middlewares/generales/validar_permiso.middleware.js")
const bitacora = require("../../middlewares/generales/bitacora.middleware.js")

var log = console.log

router.get("/test", controller.test)

router.get("/",
	usuarioActual,
	validarPermiso.VerificacionPermiso("SUPERADMIN", "moderadores", "lectura"),
	bitacora.AnadirBitacora("Consults moderators administration view"),
	controller.AdvisersPrincipal
	)

router.get("/datos",
	usuarioActual,
	validarPermiso.VerificacionPermiso("SUPERADMIN", "moderadores", "lectura"),
	bitacora.AnadirBitacora("Consults the list of moderators administration"),
	controller.ObtenerDatosModeradores)

router.post("/datos_agregar",
	usuarioActual,
	validarPermiso.VerificacionPermiso("SUPERADMIN", "moderadores", "edicion"),
	bitacora.AnadirBitacora("Add admin moderator"),
	controller.AgregarUsuarioModerador)

router.post("/datos_editar",
	usuarioActual,
	validarPermiso.VerificacionPermiso("SUPERADMIN", "moderadores", "edicion"),
	bitacora.AnadirBitacora("Edit moderator administration"),
	controller.EditarUsuarioModerador)

router.post("/datos_archivar",
	usuarioActual,
	validarPermiso.VerificacionPermiso("SUPERADMIN", "moderadores", "eliminacion"),
	bitacora.AnadirBitacora("Archive moderator administration"),
	controller.ArchivarUsuarioModerador)

router.post("/datos_eliminar",
	usuarioActual,
	validarPermiso.VerificacionPermiso("SUPERADMIN", "moderadores", "eliminacion"),
	bitacora.AnadirBitacora("Delete admin moderator"),
	controller.EliminarUsuarioModerador)

router.get("/historial/:objectId",
	usuarioActual,
	validarPermiso.VerificacionPermiso("SUPERADMIN", "bitacora", "lectura"),
	bitacora.AnadirBitacora("Check moderator history"),
	controller.UsuarioHistorialPrincipal)

router.get("/datos_historial",
	usuarioActual,
	validarPermiso.VerificacionPermiso("SUPERADMIN", "bitacora", "lectura"),
	bitacora.AnadirBitacora("Consult all user logs"),
	controller.ObtenerTodasLasBitacorasDeUnUsuario)

module.exports = router