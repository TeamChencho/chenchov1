const express = require("express")
const router = express.Router()
const controller = require("../controllers/acceso.controller")

router.get("/test",controller.test)
router.get("/",controller.AccesoPrincipal)
router.post("/iniciar_sesion",controller.AccesoIniciarSesion)
router.get("/cerrar_sesion",controller.AccesoCerrarSesion)
router.post("/enviar_codigo_recuperacion",controller.EnviarCodigoRecuperacion)
router.post("/validar_codigo_recuperacion",controller.ValidarCodigoRecuperacion)
router.post("/actualizar_contrasena",controller.ActualizarContraseña)

module.exports = router