const express = require("express")
const router = express.Router()
const controller = require("../controllers/advisers.controller.js")
const usuarioActual = require("../middlewares/generales/usuario_actual.middleware.js")

router.get("/test", controller.test)

router.get("/",controller.Principal)

var profile = require('./advisers/profile.route')
router.use('/profile', profile)

var groups = require('./advisers/groups.route');
router.use('/groups', groups);

var simulations = require('./advisers/simulations.route');
router.use('/simulations', simulations);

/*router.use('/permisos', permisos);
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
*/

module.exports = router