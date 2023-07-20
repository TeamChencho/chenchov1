var path       = require('path')
var fs         = require('fs')
var _          = require('underscore')
var Promise    = require('promise')
var request    = require('request')
var CryptoJS   = require("crypto-js");

var log = console.log

let Seguridad  = require(path.resolve(__dirname, '../middlewares/utils/seguridad.util'));

//var FunctionsGeneral = require(path.join(__dirname, '../../functions/general.js'));
var rawdataTesting       = fs.readFileSync(path.resolve(__dirname, '../../prod-novustec.json'))
var TESTING_ENVIRONMENT  = JSON.parse(rawdataTesting)

//log(TESTING_ENVIRONMENT.apps[0].env)

var Parse = require('parse/node');

const APP_ID = process.env.APP_ID || TESTING_ENVIRONMENT.apps[0].env.APP_ID
const MASTER_KEY = process.env.MASTER_KEY || TESTING_ENVIRONMENT.apps[0].env.MASTER_KEY

Parse._initialize(APP_ID, "", MASTER_KEY)
Parse.serverURL = process.env.PUBLIC_SERVER_URL || TESTING_ENVIRONMENT.apps[0].env.PUBLIC_SERVER_URL


/*PERMISOS INICIALES*/

var permisosArray = []
var Permisos = Parse.Object.extend("Permisos");
var permiso = new Permisos();

permiso.set("nombre", "Super Administrador");
permiso.set("clave", "SUPERADMIN");
permiso.set("editable", false);
permiso.set("renombrable", false);
permiso.set("active", true);
permiso.set("exists", true);
permiso.set("permisos", ['lectura','edicion','eliminacion'])
permiso.set("usuariosAdministrador", ['lectura','edicion','eliminacion'])
permiso.set("grupos", ['lectura','edicion','eliminacion'])
permiso.set("datosMaestros", ['lectura','edicion','eliminacion'])
permiso.set("eventos", ['lectura','edicion','eliminacion'])
permiso.set("moderadores", ['lectura','edicion','eliminacion'])
permiso.set("simulaciones",['lectura','edicion','eliminacion'])
permiso.set("bitacora",['lectura','edicion','eliminacion'])
permiso.set("bitacoraSimulacion",['lectura'])
permiso.set("alumnos",['lectura','edicion','eliminacion'])
permiso.set("solicitudes",['lectura','edicion','eliminacion'])
permisosArray.push(permiso)

var Permisos = Parse.Object.extend("Permisos");
var permiso = new Permisos();
permiso.set("nombre", "Moderador");
permiso.set("clave", "MODERADOR");
permiso.set("editable", false);
permiso.set("renombrable", false);
permiso.set("active", true);
permiso.set("exists", true);
permiso.set("datosMaestros", ['lectura','edicion'])
permiso.set("grupos", ['lectura','edicion','eliminacion'])
permiso.set("eventos", ['lectura','edicion'])
permiso.set("simulaciones",['lectura','edicion','eliminacion','historial'])
permiso.set("bitacoraSimulacion",['lectura'])
permiso.set("alumnos",['lectura','edicion'])
permiso.set("perfil",['lectura','edicion'])
permisosArray.push(permiso)

var Permisos = Parse.Object.extend("Permisos");
var permiso = new Permisos();
permiso.set("nombre", "Alumno");
permiso.set("clave", "ALUMNO");
permiso.set("editable", false);
permiso.set("renombrable", false);
permiso.set("active", true);
permiso.set("exists", true);
permiso.set("simulaciones",['lectura','edicion','eliminacion'])
permiso.set("bitacora",['lectura','edicion','eliminacion'])
permiso.set("alumnos",['lectura','edicion','eliminacion'])
permiso.set("perfil",['lectura','edicion'])
permisosArray.push(permiso)

var Permisos = Parse.Object.extend("Permisos");
var permiso = new Permisos();
permiso.set("nombre", "Normal");
permiso.set("clave", "NORMAL");
permiso.set("editable", false);
permiso.set("renombrable", false);
permiso.set("active", true);
permiso.set("exists", true);
permisosArray.push(permiso)

Parse.Object.saveAll(permisosArray)
.then((list) => {
  log("Permisos creados correctamente")

  var usuariosIniciales = []

  for(var i = 0; i < list.length; i ++){
  	if(list[i].get("clave") === "SUPERADMIN"){
  		var UsuariosSistema = Parse.Object.extend("UsuariosSistema");
			var usuario = new UsuariosSistema();
			usuario.set("nombre", "Alejandro");
			usuario.set("apellidoPaterno", "Fernández");
			usuario.set("apellidoMaterno", "Vilchis");
			usuario.set("telefono", "4423155323");
			usuario.set("correoElectronico", "afdez@tec.mx");
			var SECRET_KEY_USERS = TESTING_ENVIRONMENT.apps[0].env.SECRET_KEY_USERS
			var ciphertext = Seguridad.encriptar("demo", SECRET_KEY_USERS)
			usuario.set("contrasena",ciphertext.toString(CryptoJS.enc.Utf8))
			usuario.set("permisoPtr",list[i])
			usuario.set("colorRobot", "blue")
			usuario.set("active", true);
			usuario.set("exists", true);

			usuariosIniciales.push(usuario)

			var UsuariosSistema = Parse.Object.extend("UsuariosSistema");
			var usuario = new UsuariosSistema();
			usuario.set("nombre", "Denisse");
			usuario.set("apellidoPaterno", "Maldonado");
			usuario.set("apellidoMaterno", "Flores");
			usuario.set("telefono", "4431972296");
			usuario.set("correoElectronico", "denisse.mf@tec.mx");
			var SECRET_KEY_USERS = TESTING_ENVIRONMENT.apps[0].env.SECRET_KEY_USERS
			var ciphertext = Seguridad.encriptar("demo", SECRET_KEY_USERS)
			usuario.set("contrasena",ciphertext.toString(CryptoJS.enc.Utf8))
			usuario.set("permisoPtr",list[i])
			usuario.set("colorRobot", "blue")
			usuario.set("active", true);
			usuario.set("exists", true);

			usuariosIniciales.push(usuario)

			var UsuariosSistema = Parse.Object.extend("UsuariosSistema");
			var usuario = new UsuariosSistema();
			usuario.set("nombre", "Karen");
			usuario.set("apellidoPaterno", "Zurita");
			usuario.set("apellidoMaterno", "Morales");
			usuario.set("telefono", "4422209131");
			usuario.set("correoElectronico", "karen@prueba.com");
			var SECRET_KEY_USERS = TESTING_ENVIRONMENT.apps[0].env.SECRET_KEY_USERS
			var ciphertext = Seguridad.encriptar("demo", SECRET_KEY_USERS)
			usuario.set("contrasena",ciphertext.toString(CryptoJS.enc.Utf8))
			usuario.set("permisoPtr",list[i])
			usuario.set("colorRobot", "blue")
			usuario.set("active", true);
			usuario.set("exists", true);

			usuariosIniciales.push(usuario)
  	}
  }

  Parse.Object.saveAll(usuariosIniciales)
	.then((list) => {
	  log("Usuarios creados correctamente")

	}, (error) => {
		log(error.message)
	});

}, (error) => {
	log(error.message)
});