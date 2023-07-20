let Administrador = require("../models/alumnos.model") 
var moment           = require('moment')
var _                = require('underscore')

var log = console.log

module.exports.test = async(req, res) => {
    res.status(200).send({ status: "success", message: "Welcome To Testing API" })
}

module.exports.Principal = async(req, res) => {
    var error = req.query.e
    if(req.currentUser){
        //res.redirect("/profesores/usuarios_administracion")
        //Verificar el permiso del usuario obteniendo el usuario actual
        if(req.currentUser.get("permisoPtr")){
            if(req.currentUser.get("permisoPtr").get("administracion")){
                if(_.has(req.currentUser.get("permisoPtr").get("administracion"), "administracion" )
                && _.has(req.currentUser.get("permisoPtr").get("administracion").administracion, "usuarios")
                && _.has(req.currentUser.get("permisoPtr").get("administracion").administracion.usuarios, "lectura")){
                    res.redirect("/alumnos/permisos")   
                }else{
                    log("Usuario sin permiso básico de alumnos")
                    res.redirect("/alumnos/acceso")
                }
            }else{
                log("Usuario sin permisos de alumnos")
                res.redirect("/alumnos/acceso")
            }
        }else{
            log("Usuarion sin permiso asignado")
            res.redirect("/alumnos/acceso")
        }
    }else{
        log("Usuario no encontrado")
        res.redirect("/alumnos/acceso")
    }
}

module.exports.Acceso = async(req, res) => {
    var error = req.query.e
    if(req.cookies.type  || req.cookies.usr_id){
        res.redirect("/alumnos/simulaciones")
    }else{
        res.render('NovusTec/Alumnos/Acceso/index', {
            title: "Iniciar Sesión",
            description: "",
            content: "Iniciar Sesión",
            error: error
        });
    }
}

module.exports.IniciarSesion = async(req, res) => {
    var email = req.body.email
    var password = req.body.password
    log(email)
    log(password)
    Administrador.IniciarSesion(email,password).then(function(results){
        if(!results.error && results.data){
            res.cookie("usr_id", results.data.id);
            res.cookie("type" , "account");
            res.status(200).send({ status: "success", message: "Inicio de sesión correcto" })
        }else{
            //log("Error incompleto " + results.error)
            //log("/acceso?e="+results.error)
            res.status(400).send({ status: "error", error: results.error })
        }
    })

    
}

module.exports.CerrarSesion = async(req, res) => {
    log("Cerrar Sesión")

    res.clearCookie("usr_id");
    res.clearCookie("type");
    res.redirect("/alumnos/acceso");
}