const express = require("express")
const router = express.Router()
const controller = require("../controllers/alumnos.controller.js")
const usuarioActual = require("../middlewares/generales/usuario_actual.middleware.js")

router.get("/test", controller.test)
router.get("/",usuarioActual,controller.Principal)
router.get("/acceso", controller.Acceso)
router.post("/iniciar_sesion", controller.IniciarSesion)
router.get("/cerrar_sesion", controller.CerrarSesion)

var dashboard = require('./alumnos/dashboard.route');
router.use('/dashboard', dashboard);

var alumnos = require('./alumnos/simulaciones.route');
router.use('/simulaciones', alumnos);

var profile = require('./alumnos/profile.route');
router.use('/profile', profile);

module.exports = router