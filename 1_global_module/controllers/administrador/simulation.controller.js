let SimulationsModel = require("../../models/administrador/simulation.model.js")
// let Permisos = require("../../models/administrador/permisos.model")
//let Bitacora = require("../../models/administrador/bitacora.model")
var moment           = require('moment')
var _                = require('underscore')
var multer           = require('multer')

var log = console.log

module.exports.test = async(req, res) => {
    res.status(200).send({ title: "success", message: "Welcome To Testing API" })
}

module.exports.SimulationsPrincipal = async(req, res) => {
    var error = req.query.e

    SimulationsModel.GetAllGroups().then(function (results) {
        var groups = results.data

        res.render('NovusTec/Administrador/Simulations/index', {
            title: "Simulations",
            description: "",
            content: "Simulations",
            menu_item: "Simulations",
            currentUser: req.currentUser,
            error: error,
            _:_,
            moment:moment,
            groups:groups
        });
    })    
}

module.exports.GetAllSimulations = async (req, res) => {  
    SimulationsModel.GetAllSimulations().then(function (results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }      
    })
}

module.exports.GetAllSimulationsAdviser = async (req, res) => {  
    SimulationsModel.GetAllGroupsAdviser(req.currentUser).then(function (results) {
        if(!results.error && results.data) {
            var groups = _.map(results.data, function(object) {
                return object.get("grupoPtr").id
            })
        
            SimulationsModel.GetAllSimulationsAdviser(groups).then(function (results) {
                if (!results.error && results.data) {
                    var data = results.data
                    res.status(200).json({ code: 200, msg: "OK", data: data })
                } else {
                    res.status(400).json({ code: 400, msg: "Error", error: results.error })
                }      
            })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

module.exports.GetAllGroups = async (req, res) => {
    SimulationsModel.GetAllGroups().then(function (results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

module.exports.AddingSimulation = async (req, res) => {
    SimulationsModel.AddingSimulation(req.body).then(function (results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

module.exports.ArchiveSimulation = async (req, res) => {
    SimulationsModel.ArchiveSimulation(req.body.objectId, req.body.seActiva).then(function (results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

module.exports.EraseSimulation = async (req, res) => {
    SimulationsModel.EraseSimulation(req.body.objectId).then(function (results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

module.exports.DetailSimulation = async(req, res) => {
    var error = req.query.e

    SimulationsModel.SearchSimulation(req.params.objectId).then(function (results) {
        var resultSimulation
        if (!results.error && results.data) {
            resultSimulation = results.data
        }else{
            resultSimulation = null
        }

        res.render('NovusTec/Advisers/Simulations/detail_simulation', {
            title: "Simulations",
            description: "",
            content: "Simulations",
            menu_item: "Simulations",
            currentUser: req.currentUser,
            error: error,
            _:_,
            moment:moment,
            simulation:resultSimulation
        });
    })
            
}

module.exports.UpdateSimulationSettings = async (req, res) => {
    SimulationsModel.UpdateSimulationSettings(req.params.objectId,req.body).then(function (results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

module.exports.GetAllStudentsInGroup = async (req, res) => {
    SimulationsModel.GetAllStudentsInGroup(req.params.objectId).then(function (results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

module.exports.AddingSimulationTeam = async (req, res) => {
    SimulationsModel.AddingSimulationTeam(req.params.simulationId,req.body).then(function (results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

module.exports.GetAllTeamsInSimulation = async (req, res) => {
    SimulationsModel.GetAllTeamsInSimulation(req.params.simulationId).then(function (results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

module.exports.ArchiveSimulationTeam = async (req, res) => {
    SimulationsModel.ArchiveSimulationTeam(req.body.objectId, req.body.seActiva).then(function (results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

module.exports.EraseSimulationTeam = async (req, res) => {
    SimulationsModel.EraseSimulationTeam(req.body.objectId).then(function (results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

module.exports.GetAllTeamsMembersInSimulationTeam = async (req, res) => {
    log(req.body)
    SimulationsModel.GetAllTeamsMembersInSimulationTeam(req.body.objectId,req.body.members).then(function (results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}