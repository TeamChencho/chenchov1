var moment           = require('moment')
var _                = require('underscore')
let log = console.log

exports.VerificacionPermiso = function(modulo,columna,permiso) {
    return function(req, res, next) {
        //log(req.currentUser.get("permisoPtr").get(columna))
        //log("ingreso en el archivo validar_permiso.middleware")
        
        //log("Clave " + req.currentUser.get("clave") + " " + modulo)
        //log("Columna " + columna)
        //log("Módulo " + req.currentUser.get("permisoPtr").get(columna) + " " + permiso)

        if(req.currentUser.get("permisoPtr").get("clave") == modulo &&
            req.currentUser.get("permisoPtr").get(columna) && 
            req.currentUser.get("permisoPtr").get(columna).includes(permiso)
            ){
                //log("Si hay permiso")
                next() //Si hay permiso
        } else if(req.currentUser.get("permisoPtr").get("clave") == "SUPERADMIN") {
            next()
        }else{
            //log("No hay permiso")
            res.render('NovusTec/error/error-page', {
                title: "Principal",
                description: "",
                content: "",
                error: "0",
                errorType: "warning",
                flash: "",
                error_no: "401",
                error_title: "¡Oops! ¡No tienes permiso de ver esta página!",
                error_msg: "Lo sentimos, la página que estas intentando acceder esta protegida.",
                redirect_url: "/"
            });
        }
    }
}