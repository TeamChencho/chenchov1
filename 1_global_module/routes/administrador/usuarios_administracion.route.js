const express = require("express")
const router = express.Router()
const controller = require("../../controllers/administrador/usuarios_administracion.controller.js")
const usuarioActual = require("../../middlewares/generales/usuario_actual.middleware.js")
const validarPermiso = require("../../middlewares/generales/validar_permiso.middleware.js")
const bitacora = require("../../middlewares/generales/bitacora.middleware.js")

var log = console.log

router.get("/test", controller.test)

router.get("/",
	usuarioActual,
	validarPermiso.VerificacionPermiso("SUPERADMIN","usuariosAdministrador","lectura"),
	bitacora.AnadirBitacora("Consults view user administration"),
	controller.UsuariosAdministracionPrincipal
	)

router.get("/datos",
	usuarioActual,
	validarPermiso.VerificacionPermiso("SUPERADMIN","usuariosAdministrador","lectura"),
	bitacora.AnadirBitacora("Consults the administration user list"),
	controller.ObtenerTodosLosUsuariosAdministracion
	)

router.get("/datos_permisos",
	usuarioActual,
	validarPermiso.VerificacionPermiso("SUPERADMIN","usuariosAdministrador","lectura"),
	bitacora.AnadirBitacora("Consults the list of permissions in administration users"),
	controller.ObtenerPermisosAdministrador
	)

router.post("/datos_agregar",
	usuarioActual,
	validarPermiso.VerificacionPermiso("SUPERADMIN","usuariosAdministrador","edicion"),
	bitacora.AnadirBitacora("Add user administration"),
	controller.AgregarUsuarioAdministracion
	)

router.post("/datos_editar",
	usuarioActual,
	validarPermiso.VerificacionPermiso("SUPERADMIN","usuariosAdministrador","edicion"),
	bitacora.AnadirBitacora("Edit user administration"),
	controller.EditarUsuarioAdministracion
	)

router.post("/datos_archivar",
	usuarioActual,
	validarPermiso.VerificacionPermiso("SUPERADMIN","usuariosAdministrador","eliminacion"),
	bitacora.AnadirBitacora("Archive user administration"),
	controller.ArchivarUsuarioAdministracion
	)
 
router.post("/datos_eliminar",
	usuarioActual,
	validarPermiso.VerificacionPermiso("SUPERADMIN","usuariosAdministrador","eliminacion"),
	bitacora.AnadirBitacora("Delete user administration"),
	controller.EliminarUsuarioAdministracion
	)

router.get("/historial/:objectId",
	usuarioActual,
	validarPermiso.VerificacionPermiso("SUPERADMIN","usuariosAdministrador","lectura"),
	bitacora.AnadirBitacora("Consults the user's history view"),
	controller.UsuarioHistorial
	)

router.get("/datos_historial",
	usuarioActual,
	validarPermiso.VerificacionPermiso("SUPERADMIN","usuariosAdministrador","lectura"),
	bitacora.AnadirBitacora("Consults the user's history list"),
	controller.ObtenerTodasLasBitacorasDeUnUsuario
	)

module.exports = router