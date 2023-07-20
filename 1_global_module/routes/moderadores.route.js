const express = require("express")
const router = express.Router()
const controller = require("../controllers/moderadores.controller.js")
const usuarioActual = require("../middlewares/generales/usuario_actual.middleware.js")

router.get("/test", controller.test)
router.get("/",usuarioActual,controller.Principal)
router.get("/acceso", controller.Acceso)
router.post("/iniciar_sesion", controller.IniciarSesion)
router.get("/cerrar_sesion", controller.CerrarSesion)

var dashboard = require('./moderadores/dashboard.route');
router.use('/dashboard', dashboard);
/*var usuarios_administracion = require('./administrador/usuarios_administracion.route');
router.use('/usuarios_administracion', usuarios_administracion);*/

var grupos = require('./moderadores/grupos.route');
router.use('/grupos', grupos);

var simulaciones = require('./moderadores/simulaciones.route');
router.use('/simulaciones', simulaciones);
// var pagos = require('./administrador/pagos.route');
// router.use('/pagos', pagos);
// var directorios = require('./administrador/directorios.route');
// router.use('/directorios', directorios);
// var soporte = require('./administrador/soporte.route');
// router.use('/soporte', soporte);
// var landingpage = require('./administrador/landingpage.route');
// router.use('/landingpage', landingpage);
// var estadisticas = require('./administrador/estadisticas.route');
// router.use('/estadisticas', estadisticas);

module.exports = router