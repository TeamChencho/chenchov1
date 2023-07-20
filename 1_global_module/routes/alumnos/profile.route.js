const express = require("express")
const router = express.Router()
const usuarioActual = require("../../middlewares/generales/usuario_actual.middleware")
const controller= require("../../controllers/alumnos/profile.controller")
const validarPermiso = require("../../middlewares/generales/validar_permiso.middleware.js")
const bitacora = require("../../middlewares/generales/bitacora.middleware")

router.get("/test", controller.test)

router.get("/",
    usuarioActual,
    validarPermiso.VerificacionPermiso("ALUMNO", "perfil", "lectura"),
    bitacora.AnadirBitacora("Consults the profile view"),
    controller.ProfilePrincipal)

router.post("/revisar_contrasena",
    usuarioActual,
    validarPermiso.VerificacionPermiso("ALUMNO", "perfil", "lectura"),
    bitacora.AnadirBitacora("Consults the password from the profile"),
    controller.RevisarContrasena)

router.post("/actualizar_contrasena",
    usuarioActual,
    validarPermiso.VerificacionPermiso("ALUMNO", "perfil", "edicion"),
    bitacora.AnadirBitacora("Edit password from profile"),
    controller.ActualizarContrasena)

router.post("/actualizar_color_robot",
    usuarioActual,
    validarPermiso.VerificacionPermiso("ALUMNO", "perfil", "edicion"),
    bitacora.AnadirBitacora("Edit the robot color from the profile"),
    controller.ActualizarColorRobot)

module.exports = router