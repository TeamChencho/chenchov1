const express = require("express")
const router = express.Router()
const controller = require("../controllers/administrador.controller.js")
const usuarioActual = require("../middlewares/generales/usuario_actual.middleware.js")

router.get("/test", controller.test)
router.get("/",controller.Principal)

var permisos = require('./administrador/permisos.route');
router.use('/permisos', permisos);
var usuarios_administracion = require('./administrador/usuarios_administracion.route');
router.use('/usuarios_administracion', usuarios_administracion);
var events = require('./administrador/events.route');
router.use('/events', events);
var advisers = require('./administrador/advisers.route');
router.use('/advisers', advisers);
var students = require('./administrador/students.route');
router.use('/students', students);
var master_data = require('./administrador/master_data.route');
router.use('/master_data', master_data);
var grupos = require('./administrador/grupos.route');
router.use('/grupos', grupos);
var solicitudes = require('./administrador/solicitudes.route');
router.use('/solicitudes', solicitudes);
var simulations = require('./administrador/simulations.route');
router.use('/simulaciones', simulations);

module.exports = router