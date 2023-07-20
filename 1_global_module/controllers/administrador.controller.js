let Administrador    = require("../models/administrador.model") 
var moment           = require('moment')
var _                = require('underscore')

var log = console.log

module.exports.test = async(req, res) => {
    res.status(200).send({ status: "success", message: "Welcome To Testing API" })
}

module.exports.Principal = async(req, res) => {
    res.redirect("administrador/usuarios_administracion")
}

module.exports.Acceso = async(req, res) => {
    var error = req.query.e
    if(req.cookies.type  || req.cookies.usr_id){
        res.redirect("/administrador")
    }else{
        res.render('NovusTec/Administrador/Acceso/index', {
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
    res.redirect("/administrador/acceso");
}