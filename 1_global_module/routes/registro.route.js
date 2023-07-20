const express = require("express")
const router = express.Router()
const controller = require("../controllers/registro.controller")

router.get("/test",controller.test)
router.get("/",controller.AccesoPrincipal)
router.post("/verificar_usuario",controller.VerificarUsuario)
router.post("/contrasena",controller.AgregarContrasena)
router.post("/solicitud",controller.EnviarSolicitud)

module.exports = router