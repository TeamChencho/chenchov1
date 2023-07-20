let UsuariosAdmin = require("../../models/administrador/usuarios_administracion.model") 
let log = console.log

module.exports = function(req, res, next) {
  //log("Middleware obteniendo usuario actual");
  if(req.cookies.type === "account" || req.cookies.type === "normal"){
    //log("cookie "+ req.cookies.type)
    UsuariosAdmin.BuscarUsuarioAdministracion(req.cookies.usr_id).then(function(results){
      if(!results.error && results.data){
      var data = results.data
          req.currentUser = data;
          next();
      }else{
        res.render('NovusTec/error/error-page', {
        title: "Principal", 
        description:"", 
        content:"Activos",
        error:"0",
        errorType: "warning",
        flash: "",
        error_no: "401",
        error_title: "¡Oops! ¡No tienes permiso de ver esta página!",
        error_msg: "Lo sentimos, la página que estas intentando acceder esta protegida.",
        redirect_url: "/acceso"
      });
      }     
    }) 
  }else{
    res.render('NovusTec/error/error-page', {
      title: "Principal", 
      description:"", 
      content:"Activos",
      error:"0",
      errorType: "warning",
      flash: "",
      error_no: "401",
      error_title: "¡Oops! ¡No tienes permiso de ver esta página!",
      error_msg: "Lo sentimos, la página que estas intentando acceder esta protegida.",
      redirect_url: "/acceso"
    });
  }
}
