let log        = console.log
var path       = require('path')
var fs         = require('fs')
/**
 * Validar token para uso de API en el sistema
 * @namespace ApiTokenMiddleWare
 */


/**
 * Validación de token módulo de {API}
 * @memberof ApiTokenMiddleWare
 * @param {Object} req Objeto request HTTP
 * @param {Object} res Objeto response HTTP
 * @param {Object} next Objeto next HTTP, continua el flujo del request
 */
exports.validarToken = function(req, res, next) {
  //log("Middleware permiso de lectura");
  let APP_ID = process.env.APP_ID
  //log(req.headers.authorization)
  if(req.headers.authorization && req.headers.authorization.includes(APP_ID)){
    next();
  }else{
    res.status(400).json({code:400,msg:"Error",error:"El usuario no está autenticado, intente nuevamente"})
  }
}