const express    = require("express")
const router     = express.Router()
const controller = require("../controllers/games.controller.js")

router.get("/test",controller.test)
router.get("/game1",controller.Game1)//Juego Básico
router.get("/game2",controller.Game2)//Juego Template Vacío
router.get("/game3",controller.Game3)//Juego pantalla de inicio con texto
router.get("/game4",controller.Game4)//Carga nivel de mario con arreglo, tileset el más simple
router.get("/game5",controller.Game5)//Carga nivel desde csv, movimiento con teclas del ratón
router.get("/game6",controller.Game6)//Carga nivel tiled pokemon, movimiento con teclas del ratón
router.get("/game7",controller.Game7)//Nivel con hitboxes y personaje
router.get("/game8",controller.Game8)//Nivel Cambiar escenas
router.get("/game9",controller.Game9)//Tutorial plataformas
router.get("/game10",controller.Game10)//Tutorial plataformas con assets finales

module.exports = router