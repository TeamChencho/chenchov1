let Games = require("../models/games.model") 

var log = console.log

module.exports.test = async(req,res) =>{
  res.status(200).send({status:"success",message:"Welcome To Testing API"})
}

module.exports.Game1 = async(req,res) =>{
  res.render('NovusTec/Games/game1/index', {
	  title: "Game 1", 
	  description:"Carga de el juego más básico de los tutoriales, se usa con arquitectura de ejs",
	  content:""
	});
}


module.exports.Game2 = async(req,res) =>{
  res.render('NovusTec/Games/game2/index', {
	  title: "Game 2", 
	  description:"Carga un juego vacío, sirve como template para iniciar",
	  content:""
	});
}


module.exports.Game3 = async(req,res) =>{
  res.render('NovusTec/Games/game3/index', {
	  title: "Game 3", 
	  description:"Carga juego con texto de pantalla inicial",
	  content:""
	});
}

module.exports.Game4 = async(req,res) =>{
  res.render('NovusTec/Games/game4/index', {
	  title: "Game 4", 
	  description:"Carga del juego más básico de los tutoriales, se usa con arquitectura de ejs",
	  content:""
	});
}


module.exports.Game5 = async(req,res) =>{
  res.render('NovusTec/Games/game5/index', {
	  title: "Game 5", 
	  description:"Carga del juego nivel desde CSV, se mueve con flechas",
	  content:""
	});
}

module.exports.Game6 = async(req,res) =>{
  res.render('NovusTec/Games/game6/index', {
	  title: "Game 6", 
	  description:"Carga del juego nivel desde JSON pokemon, se mueve con flechas",
	  content:""
	});
}

module.exports.Game7 = async(req,res) =>{
  res.render('NovusTec/Games/game7/index', {
	  title: "Game 7", 
	  description:"Colisiones con personaje, se muestran hitboxes",
	  content:""
	});
}

module.exports.Game8 = async(req,res) =>{
  res.render('NovusTec/Games/game8/index', {
	  title: "Game 8", 
	  description:"Cambio de escenas",
	  content:""
	});
}

module.exports.Game9 = async(req,res) =>{
  res.render('NovusTec/Games/game9/index', {
	  title: "Game 9", 
	  description:"Tutorial plataformero",
	  content:""
	});
}

module.exports.Game10 = async(req,res) =>{
  res.render('NovusTec/Games/game10/index', {
	  title: "Game 10", 
	  description:"Tutorial plataformero assets finales",
	  content:""
	});
}
