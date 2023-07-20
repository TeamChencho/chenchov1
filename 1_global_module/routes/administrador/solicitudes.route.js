const express = require("express")
const router = express.Router()
const controller = require("../../controllers/administrador/solicitudes.controller")
const usuarioActual = require("../../middlewares/generales/usuario_actual.middleware.js")
const validarPermiso = require("../../middlewares/generales/validar_permiso.middleware.js")
const bitacora = require("../../middlewares/generales/bitacora.middleware.js")

router.get("/test", controller.test)

router.get("/",
    usuarioActual,
    validarPermiso.VerificacionPermiso("SUPERADMIN","solicitudes","lectura"),
    bitacora.AnadirBitacora("Consults view requests"),
    controller.SolicitudesPrincipal)

router.get("/datos",
    usuarioActual,
    validarPermiso.VerificacionPermiso("SUPERADMIN","solicitudes","lectura"),
    bitacora.AnadirBitacora("Consults the request list"),
    controller.ObtenerTodasLasSolicitudes)

router.post("/solicitud_eliminar",
    usuarioActual,
    validarPermiso.VerificacionPermiso("SUPERADMIN","solicitudes","eliminacion"),
    bitacora.AnadirBitacora("Delete request"),
    controller.EliminarSolicitud)

router.post("/solicitud_archivar",
    usuarioActual,
    validarPermiso.VerificacionPermiso("SUPERADMIN","solicitudes","eliminacion"),
    bitacora.AnadirBitacora("Archive requests"),
    controller.SolicitudArchivar)

router.post("/solicitud_cambiar_status",
    usuarioActual,
    validarPermiso.VerificacionPermiso("SUPERADMIN","solicitudes","edicion"),
    bitacora.AnadirBitacora("Change application request"),
    controller.SolicitudCambiarStatus)

module.exports = router