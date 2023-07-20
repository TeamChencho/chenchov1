const express = require("express")
const router = express.Router()
const controller = require("../../controllers/advisers/groups.controller.js")
const usuarioActual = require("../../middlewares/generales/usuario_actual.middleware.js")
const validarPermiso = require("../../middlewares/generales/validar_permiso.middleware.js")
const bitacora = require("../../middlewares/generales/bitacora.middleware.js")

var log = console.log

router.get("/test", controller.test)

router.get("/",
	usuarioActual,
	validarPermiso.VerificacionPermiso("MODERADOR", "grupos", "lectura"),
	bitacora.AnadirBitacora("Consults view groups"),
	controller.GruposPrincipal
)

router.get("/datos", 
	usuarioActual,
	validarPermiso.VerificacionPermiso("MODERADOR", "grupos", "lectura"),
	bitacora.AnadirBitacora("Consults group list"), 
	controller.DatosGrupos)

router.post("/datos_agregar", 
	usuarioActual,
	validarPermiso.VerificacionPermiso("MODERADOR", "grupos", "edicion"),
	bitacora.AnadirBitacora("Add group"), 
	controller.AgregarGrupo)

router.post("/datos_eliminar", 
	usuarioActual,
	validarPermiso.VerificacionPermiso("MODERADOR", "grupos", "eliminacion"),
	bitacora.AnadirBitacora("Delete group"), 
	controller.EliminarGrupo)

router.post("/datos_archivar", 
	usuarioActual,
	validarPermiso.VerificacionPermiso("MODERADOR", "grupos", "eliminacion"),
	bitacora.AnadirBitacora("Archive group"), 
	controller.ArchivarGrupo)

router.post("/datos_editar", 
	usuarioActual,
	validarPermiso.VerificacionPermiso("MODERADOR", "grupos", "edicion"),
	bitacora.AnadirBitacora("Edit group"), 
	controller.EditarGrupo)

router.post("/datos_grupo", 
	usuarioActual,
	validarPermiso.VerificacionPermiso("MODERADOR", "grupos", "lectura"),
	bitacora.AnadirBitacora("Consults the list of moderators in a group"), 
	controller.ObtenerDatosGrupo)

router.post("/salir_grupo", 
	usuarioActual,
	validarPermiso.VerificacionPermiso("MODERADOR", "grupos", "eliminacion"),
	bitacora.AnadirBitacora("Leave the group"), 
	controller.SalirDelGrupo)

router.get("/:objectId", 
	usuarioActual,
	validarPermiso.VerificacionPermiso("MODERADOR", "grupos", "lectura"),
	bitacora.AnadirBitacora("Consults students view from group"), 
	controller.DetalleGrupo)

router.get("/:objectId/alumnos/datos", 
	usuarioActual,
	validarPermiso.VerificacionPermiso("MODERADOR", "grupos", "lectura"),
	bitacora.AnadirBitacora("consults the list of students from the group"), 
	controller.ObtenerAlumnos)

router.post("/:objectId/alumnos/datos_agregar", 
	usuarioActual,
	validarPermiso.VerificacionPermiso("MODERADOR", "grupos", "edicion"),
	bitacora.AnadirBitacora("Add student from group"), 
	controller.AgregarAlumno)

router.post("/:objectId/alumnos/datos_archivar", 
	usuarioActual,
	validarPermiso.VerificacionPermiso("MODERADOR", "grupos", "eliminacion"),
	bitacora.AnadirBitacora("Archive student from group"), 
	controller.ArchivarAlumno)

router.post("/:objectId/alumnos/datos_eliminar", 
	usuarioActual,
	validarPermiso.VerificacionPermiso("MODERADOR", "grupos", "eliminacion"),
	bitacora.AnadirBitacora("Delete student from group"), 
	controller.EliminarAlumno)

router.post("/:objectId/alumnos/datos_editar", 
	usuarioActual,
	validarPermiso.VerificacionPermiso("MODERADOR", "grupos", "edicion"),
	bitacora.AnadirBitacora("Edit student from group"), 
	controller.EditarAlumno)

router.post("/:objectId/alumnos/datos_importar", 
	usuarioActual,
	validarPermiso.VerificacionPermiso("MODERADOR", "grupos", "edicion"),
	bitacora.AnadirBitacora("Add students in bulk from group"), 
	controller.InportarAlumnos)

module.exports = router