var randomstring  = require("randomstring")
let Acceso = require("../models/acceso.model") 
let UsuariosAdmin = require("../models/acceso.model")
let RecuperarContrasena = require("../models/acceso.model")
let Correos		= require("../middlewares/utils/correos.util")

var log = console.log

/**
 * Controlador que maneja la lógica del módulo de Acceso del sistema de administración
 * @namespace ControladorAcceso
 */

/**
 * Carga la url de prueba como test de verificación de la clase
 * @memberof ControladorAcceso
 * @param {Object} req Objeto request HTTP
 * @param {Object} res Objeto response HTTP
 */
module.exports.test = async(req,res) =>{
  res.status(200).send({status:"success",message:"Welcome To Testing API"})
}

/**
 * Carga la url default del controlador de acceso
 * @memberof ControladorAcceso
 * @param {Object} req Objeto request HTTP
 * @param {Object} res Objeto response HTTP
 */
module.exports.AccesoPrincipal = async(req,res) =>{
  //log("Cargando acceso")
  var error = req.query.e
  /*log(req.cookies.type)
  log(req.cookies.usr_id)
  log(req.cookies.permission)
  log(process.env.APP_NAME)*/

  if(req.cookies.type || req.cookies.usr_id){
    //log("Redireccionando " + req.cookies.permission)
    if(req.cookies.permission == "SUPERADMIN"){
      res.redirect("/administrador")
    }else if(req.cookies.permission == "MODERADOR"){
      res.redirect("/advisers")
    }else if(req.cookies.permission == "ALUMNO"){
      res.redirect("/alumnos")
    }
    
  }else{
    res.render('NovusTec/Acceso/index', {
          title: "Iniciar Sesión", 
          description:"",
          content:"Iniciar Sesión",
          error:error,
      environment: process.env.APP_NAME
    });
  }
}

/**
 * Carga la url para iniciar sesión en el sistema de administración
 * @memberof ControladorAcceso
 * @param {Object} req Objeto request HTTP
 * @param {Object} res Objeto response HTTP
 */
module.exports.AccesoIniciarSesion = async(req,res) =>{
  //log("POST Cargando acceso")
  var correo     = req.body.correo
  var contrasena = req.body.contrasena
  //log(correo + " " + contrasena)
  Acceso.IniciarSesion(correo,contrasena).then(function(results){
    //log("Previo a validar")
    if(!results.error && results.data){
      //log(results.data.get("permisoPtr").get("clave"))
      res.cookie("usr_id", results.data.id);
      res.cookie("type" , "account");
      res.cookie("permission", results.data.get("permisoPtr").get("clave"))
      res.redirect("/acceso")
    }else{
      //log("Error incompleto " + results.error)
      //log("/acceso?e="+results.error)
      res.redirect("/acceso?e="+results.error)
    }
  }) 
}

/**
 * Carga la url para iniciar sesión en el sistema de administración
 * @memberof ControladorAcceso
 * @param {Object} req Objeto request HTTP
 * @param {Object} res Objeto response HTTP
 */
module.exports.AccesoCerrarSesion = async(req,res) =>{
  //log("Cerrar Sesión")
  res.clearCookie( "usr_id" );
  res.clearCookie( "type" );
  res.clearCookie( "permission" );

  res.redirect("/acceso");
}

module.exports.EnviarCodigoRecuperacion = async ( req, res ) =>{
  
  RecuperarContrasena.ComprobraUsuario( req.body.correo ).then( function( results ){

      if( results.error ){
          return res.status(400).json({ code: 200, msg: "Error", error: results.error })
      }

      var data    = results.data
      //Código de 6 dígitos con letras mayúsculas
      var codigo  = randomstring.generate({ length: 6, capitalization: 'uppercase' })

      RecuperarContrasena.RegistrarCodigoRecuperacion( req.body.correo, codigo ).then( function( results ){

          if( results.error ){
            return res.status(400).json({ code: 200, msg: "Error", error: results.error })
          }

          Correos.RecuperarContrasena(req.body.correo, codigo)
          res.status(200).json({ code: 200, msg: "OK", data: data })
      })

  })

}

module.exports.ValidarCodigoRecuperacion = async ( req, res ) => {

  RecuperarContrasena.ValidarCodigoRecuperacion(req.body.codigo, req.body.correo).then( function( results ){

      if( results.error ){
          return res.status(400).json({ code: 200, msg: "Error", error: results.error, codigoCaducado: results.codigoCaducado})
      }

      var data = results.data
      res.status(200).json({ code: 200, msg: "OK", data: data })

  })
}


module.exports.ActualizarContraseña = async ( req, res ) => {

    RecuperarContrasena.ValidarCodigoRecuperacion(req.body.codigo, req.body.correo).then( function( resultsCodigo ){

        if( resultsCodigo.error ){
            return res.status(400).json({ code: 200, msg: "Error", error: resultsCodigo.error, codigoCaducado: resultsCodigo.codigoCaducado})
        }

        var dataCodigo = resultsCodigo.data
        
        RecuperarContrasena.ActualizarContraseña( dataCodigo, req.body.contrasena, req.body.correo ).then( function( results ){

            if( resultsCodigo.error ){
                return res.status(400).json({ code: 200, msg: "Error", error: resultsCodigo.error, codigoCaducado: resultsCodigo.codigoCaducado})
            }

            var dataSave = results.data
            res.status(200).json({ code: 200, msg: "OK", data: dataSave })
        })

    })

}