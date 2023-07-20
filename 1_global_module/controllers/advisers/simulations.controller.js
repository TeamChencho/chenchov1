let SimulationsModel = require("../../models/advisers/simulations.model.js")
let SimulationsModelIterative = require("../../models/advisers/simulations.iterative.model.js")
let MasterData = require("../../models/advisers/master_data_simulacion.js")
// let Permisos = require("../../models/administrador/permisos.model")
//let Bitacora = require("../../models/administrador/bitacora.model")
var moment = require('moment')
var _ = require('underscore')
var multer = require('multer')
var path = require('path')
var fs = require('fs')

var log = console.log

module.exports.test = async (req, res) => {
    res.status(200).send({ title: "success", message: "Welcome To Testing API" })
}

module.exports.SimulationsPrincipal = async (req, res) => {
    var error = req.query.e
     
    var permission = true
    if(req.cookies.permission != "SUPERADMIN"){
        permission = false
    }

    SimulationsModel.GetAllGroupsAdviser(req.currentUser).then(function (results) {
        var groups
        if (!results.error && results.data) {
            groups = results.data
        } else {
            groups = null
        }
        res.render('NovusTec/Advisers/Simulations/index', {
            title: "Simulations",
            description: "",
            content: "Simulations",
            menu_item: "Simulations",
            currentUser: req.currentUser,
            permission: permission,
            error: error,
            _: _,
            moment: moment,
            groups: groups
        });
    })
}

module.exports.GetAllSimulations = async (req, res) => {

    try {
        var resultsAllGroupsAdviser = await SimulationsModelIterative.GetAllGroupsAdviser( req.currentUser )
        var groups = _.map(resultsAllGroupsAdviser.data, function(object) {
            return object.get("grupoPtr").id
        })
        var resultsSimulations = await SimulationsModelIterative.GetAllSimulations(groups)
    } catch (error) {
        log( error )
        return res.status(400).json({ code: 400, msg: "Error", error: error.error })
    }

    return res.status(200).json({ code: 200, msg: "OK", data: resultsSimulations.data })

}

module.exports.GetAllGroupsAdviser = async (req, res) => {
    SimulationsModel.GetAllGroupsAdviser().then(function (results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

module.exports.AddingSimulation = async (req, res) => {

    try {
        var results = await SimulationsModelIterative.AddAllConfigurationNewSimulation( req.body ) //SimulationsModel.AddingSimulation(req.body)
    } catch (error) {
        log( error )
        return res.status(400).json({ code: 400, msg: "Error", error: error.message })
    }

    return res.status(200).json({ code: 200, msg: "OK", data: results.data })

}
module.exports.GetEmployees = async (req, res) => {
    SimulationsModel.GetEmployees().then(function (results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

module.exports.ArchiveSimulation = async (req, res) => {

    try {
        var results = await SimulationsModelIterative.ArchiveSimulation( req.body.objectId, req.body.seActiva )
    } catch (error) {
        log( error )
        return res.status(400).json({ code: 400, msg: "Error", error: error.message })
    }

    return res.status(200).json({ code: 200, msg: "OK", data: results.data })
}

module.exports.EraseSimulation = async (req, res) => {

    try {
        var results = await SimulationsModelIterative.EraseSimulation(req.body.objectId)
    } catch (error) {
        log( error )
        return res.status(400).json({ code: 400, msg: "Error", error: error.message })
    }

    return res.status(200).json({ code: 200, msg: "OK", data: results.data })
}

module.exports.DetailSimulation = async (req, res) => {
    var error = req.query.e

    SimulationsModel.SearchSimulation(req.params.objectId).then(function (results) {
        var resultSimulation
        if (!results.error && results.data) {
            resultSimulation = results.data
        } else {
            resultSimulation = null
        }

        var permission = true
        if(req.cookies.permission != "SUPERADMIN"){
            permission = false
        }

        res.render('NovusTec/Advisers/Simulations/detail_simulation', {
            title: "Simulations",
            description: "",
            content: "Simulations",
            menu_item: "Simulations",
            currentUser: req.currentUser,
            permission: permission,
            error: error,
            _: _,
            moment: moment,
            simulation: resultSimulation
        });
    })

}

module.exports.UpdateSimulationSettings = async (req, res) => {
    log(req)
    SimulationsModel.UpdateSimulationSettings(req.params.objectId, req.body, req.currentUser).then(function (results) {
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
    SimulationsModel.AddingSimulationTeam(req.params.simulationId, req.body).then(function (results) {
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
    //log(req.body)
    SimulationsModel.GetAllTeamsMembersInSimulationTeam(req.body.objectId, req.body.members).then(function (results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

module.exports.DeleteMemberTeam = async (req, res) => {
    //log(req.body)
    SimulationsModel.DeleteMemberTeam( req.body.objectIdTeam , req.body.objectId).then(function (results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

module.exports.AddMembersUpdateTeam = async (req, res) => {
    SimulationsModel.AddMembersUpdateTeam(req.body.objectIdTeam, req.body.teamMembers).then(function (results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

// master data methods

module.exports.GetRawMaterials = async (req, res) => {
    MasterData.ObtenerTodaLaMateriaPrima().then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.GetAllProducts = async (req, res) => {
    MasterData.ObtenerTodosLosProductos(req.params.simulationId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.AddProductFamily = async (req, res) => {

    await exports.CreateContentFileArchives( 'public/assets/families_videos' )
    await exports.CreateContentFileArchives( 'public/assets/families' )

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            if(file.fieldname == 'videos'){
                cb(null, 'public/assets/families_videos')
            }else{
                cb(null, 'public/assets/families')
            }
        },
        filename: function (require, file, cb) {
            var type = file.originalname.split('.')
            if(file.fieldname == 'videos'){
                cb(null, moment().valueOf() + "_" + req.body.codigo + "." + type[type.length-1])
            }else{
                cb(null, moment().valueOf() + "_" + req.body.codigo + "." + type[type.length-1])
            }
        }
    })

    var pathArchivo = ""
    var pathArchivoVideo = []
    var upload = multer({ storage: storage }).fields([{ name: 'imagen', maxCount: 1 },{ name: 'videos', maxCount: 6 }])
    upload(req, res, function (err) {
        if (err) {
            if(err.code=='LIMIT_UNEXPECTED_FILE'){
                return  res.status(400).json({ code: 400, msg: "Error", error: "Files to be uploaded are exceeded, only 6 are allowed" })
            }else{
                return  res.status(400).json({ code: 400, msg: "Error", error: err })//res.send("Error uploading file.");
            }
        }
        if (req.files && req.files['imagen']) {
            pathArchivo = req.files['imagen'][0].path;
        }
        if (req.files && req.files['videos']) {
            var pathsArchivo = req.files['videos']
            for (let i = 0; i < pathsArchivo.length; i++) {
                pathArchivoVideo.push(pathsArchivo[i].path)
            }
        }

        MasterData.AgregarProductoFamilia(req.body, req.params.simulationId, pathArchivo, pathArchivoVideo).then(function (results) {
            
            if (!results.error && results.data) {
                var data = results.data
                res.status(200).json({ code: 200, msg: "OK", data: data, withoutTransport: results.withoutTransport, withoutSRM: results.withoutSRM, dataUniq: results.dataUniq })
            } else {
                res.status(400).json({ code: 400, msg: "Error", error: results.error })
            }
        })
    })
}

module.exports.DeleteProductFamily = async (req, res) => {
    MasterData.EliminarProducto(req.body.objectId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ArchiveProductFamily = async (req, res) => {
    MasterData.ArchivarProducto(req.body.objectId, req.body.seActiva).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ArchiveVariousDataProductFamily = async (req, res) => {
    MasterData.ArchiveVariousDataProductFamily(req.body, req.params.simulationId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.UpdateProductFamily = async (req, res) => {

    await exports.CreateContentFileArchives( 'public/assets/families' )

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/assets/families')
        },
        filename: function (require, file, cb) {
            cb(null, moment().valueOf() + "_" + req.body.codigo + "." + file.originalname.split('.')[1])
        }
    })
    var pathArchivo = ""
    var upload = multer({ storage: storage }).fields([{ name: 'imagen', maxCount: 1 }])
    upload(req, res, function (err) {
        if (err) {
            return res.end("Error uploading file.");
        }

        if (req.files && req.files['imagen']) {
            pathArchivo = req.files['imagen'][0].path;
        }
        MasterData.ActualizarProducto(req.body, pathArchivo).then(function (results) {
            if (results.error) {
                return res.status(400).json({ code: 400, msg: "Error", error: results.error })
            }
            res.status(200).json({ code: 200, msg: "OK", data: results.data })
        })
    })
}

module.exports.AddVideoProductoFamily = async (req, res) => {
    //var upload = multer({ storage: multerS3({ s3: s3, bucket: process.env.AWS_BUCKET, key: function (req, file, cb) { cb(null, Date.now() + "_" + file.originalname) } }) }).fields([{ name: 'imagenPerfil', maxCount: 1 }])
    
    await exports.CreateContentFileArchives( 'public/assets/families_videos' )

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            if(file.fieldname == 'videos'){
                cb(null, 'public/assets/families_videos')
            }
        },
        filename: function (require, file, cb) {
            var type = file.originalname.split('.')
            if(file.fieldname == 'videos'){
                cb(null, moment().valueOf() + "_" + req.body.codigo + "." + type[type.length-1])
            }
        }
    })

    var pathArchivoVideo = []
    var upload = multer({ storage: storage }).fields([{ name: 'videos', maxCount: 6 }])
    upload(req, res, function (err) {
        if (err) {
            if(err.code=='LIMIT_UNEXPECTED_FILE'){
                return  res.status(400).json({ code: 400, msg: "Error", error: "Files to be uploaded are exceeded, only 6 are allowed" })
            }else{
                return  res.status(400).json({ code: 400, msg: "Error", error: err })//res.send("Error uploading file.");
            }
        }

        if (req.files && req.files['videos']) {
            var pathsArchivo = req.files['videos']
            for (let i = 0; i < pathsArchivo.length; i++) {
                pathArchivoVideo.push(pathsArchivo[i].path)
            }
        }

        MasterData.AddVideoProductoFamily(req.params.objectId,req.body.objectId,pathArchivoVideo).then(function (results) {
            if (!results.error && results.data) {
                var data = results.data
                res.status(200).json({ code: 200, msg: "OK", data: data })
            } else {
                res.status(400).json({ code: 400, msg: "Error", error: results.error })
            }
        })
    })
}

module.exports.DeleteVideoProductoFamily = async (req, res) => {
    MasterData.DeleteVideoProductoFamily(req.params.objectId,req.body.objectId, req.body.pathVideo).then(function (results){
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data})
    })
}

module.exports.ImportClients = async (req, res) => {

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'excel/csv')
        },
        filename: function (req, file, cb) {
            cb(null, "PlantillaClientes.csv")
        }
    })

    var upload = multer({ storage: storage }).fields([{ name: 'archivo', maxCount: 1 }])
    upload(req, res, function (err) {
        if (err) {
            return res.end("Error uploading file.");
        }

        var pathArchivo = ""
        if (req.files && req.files['archivo']) {
            pathArchivo = req.files['archivo'][0].path;
        }

        MasterData.ImportarClientes(req.params.simulationId, pathArchivo).then(function (results) {
            if (!results.error) {
                res.status(200).json({ code: 200, msg: "OK", data: results.data })
            } else {
                res.status(400).json({ code: 400, msg: "Error", error: results.error })
            }
        })
    })
}

module.exports.GetAllClients = async (req, res) => {
    MasterData.ObtenerTodosLosClientes(req.params.simulationId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.DeleteClient = async (req, res) => {
    MasterData.EliminarCliente(req.body.objectId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ArchiveClient = async (req, res) => {
    MasterData.ArchivarCliente(req.body.objectId, req.body.seActiva).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.UpdateClient = async (req, res) => {
    MasterData.ActualizarCliente(req.body).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ImportSuppliers = async (req, res) => {

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'excel/csv')
        },
        filename: function (req, file, cb) {
            cb(null, "PlantillaProveedores.csv")
        }
    })

    var upload = multer({ storage: storage }).fields([{ name: 'archivo', maxCount: 1 }])
    upload(req, res, function (err) {
        if (err) {
            return res.end("Error uploading file.");
        }

        var pathArchivo = ""
        if (req.files && req.files['archivo']) {
            pathArchivo = req.files['archivo'][0].path;
        }

        MasterData.ImportarProveedores(req.params.simulationId, pathArchivo).then(function (results) {
            if (!results.error) {
                res.status(200).json({ code: 200, msg: "OK", data: results.data })
            } else {
                res.status(400).json({ code: 400, msg: "Error", error: results.error })
            }
        })
    })
}

module.exports.GetAllSuppliers = async (req, res) => {
    MasterData.ObtenerTodosLosProveedores(req.params.simulationId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.DeleteSuppliers = async (req, res) => {
    MasterData.EliminarProveedor(req.body.objectId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ArchveSuppliers = async (req, res) => {
    MasterData.ArchivarProveedor(req.body.objectId, req.body.seActiva).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.UpdateSuppliers = async (req, res) => {
    MasterData.ActualizarProveedor(req.body).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.GetAllEmployee = async (req, res) => {
    MasterData.ObtenerTodosLosEmpleados(req.params.simulationId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ImportEmployees = async (req, res) => {

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'excel/csv')
        },
        filename: function (req, file, cb) {
            cb(null, "PlantillaEmpleados.csv")
        }
    })

    var upload = multer({ storage: storage }).fields([{ name: 'archivo', maxCount: 1 }])
    upload(req, res, function (err) {
        if (err) {
            return res.end("Error uploading file.");
        }

        var pathArchivo = ""
        if (req.files && req.files['archivo']) {
            pathArchivo = req.files['archivo'][0].path;
        }

        MasterData.ImportarEmpleados(req.params.simulationId, pathArchivo).then(function (results) {
            if (!results.error) {
                res.status(200).json({ code: 200, msg: "OK", data: results.data })
            } else {
                res.status(400).json({ code: 400, msg: "Error", error: results.error })
            }
        })
    })
}

module.exports.DeleteEmployee = async (req, res) => {
    MasterData.EliminarEmpledo(req.body.objectId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ArchiveEmployee = async (req, res) => {
    MasterData.ArchivarEmpleado(req.body.objectId, req.body.seActiva).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.UnpdateEmployee = async (req, res) => {
    MasterData.ActualizarEmpleado(req.body).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.IportExpenses = async (req, res) => {

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'excel/csv')
        },
        filename: function (req, file, cb) {
            cb(null, "PlantillaGastos.csv")
        }
    })

    var upload = multer({ storage: storage }).fields([{ name: 'archivo', maxCount: 1 }])
    upload(req, res, function (err) {
        if (err) {
            return res.end("Error uploading file.");
        }

        var pathArchivo = ""
        if (req.files && req.files['archivo']) {
            pathArchivo = req.files['archivo'][0].path;
        }

        MasterData.ImportarGastos(req.params.simulationId, pathArchivo).then(function (results) {
            if (!results.error) {
                res.status(200).json({ code: 200, msg: "OK", data: results.data })
            } else {
                res.status(400).json({ code: 400, msg: "Error", error: results.error })
            }
        })
    })
}

module.exports.GetAllExpenses = async (req, res) => {
    MasterData.ObtenerTodosLosGastos(req.params.simulationId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.DeleteExpense = async (req, res) => {
    MasterData.EliminarGasto(req.body.objectId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ArchiveExpense = async (req, res) => {
    MasterData.ArchivarGasto(req.body.objectId, req.body.seActiva).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.UpdateExpense = async (req, res) => {
    MasterData.ActualizarGasto(req.body).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ImportFixAssets = async (req, res) => {

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'excel/csv')
        },
        filename: function (req, file, cb) {
            cb(null, "PlantillaActivosFijos.csv")
        }
    })

    var upload = multer({ storage: storage }).fields([{ name: 'archivo', maxCount: 1 }])
    upload(req, res, function (err) {
        if (err) {
            return res.end("Error uploading file.");
        }

        var pathArchivo = ""
        if (req.files && req.files['archivo']) {
            pathArchivo = req.files['archivo'][0].path;
        }

        MasterData.ImportarActivosFijos(req.params.simulationId, pathArchivo).then(function (results) {
            if (!results.error) {
                res.status(200).json({ code: 200, msg: "OK", data: results.data })
            } else {
                res.status(400).json({ code: 400, msg: "Error", error: results.error })
            }
        })
    })
}

module.exports.GetAllFixAssets = async (req, res) => {
    MasterData.ObtenerTodosLosActivosFijos(req.params.simulationId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.DeleteFixAsset = async (req, res) => {
    MasterData.EliminarActivoFijo(req.body.objectId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ArchiveFixAsset = async (req, res) => {
    MasterData.ArchivarActivoFijo(req.body.objectId, req.body.seActiva).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.UpdateFixAsset = async (req, res) => {
    MasterData.ActualizarActivoFijo(req.body).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.GetAllCountries = async (req, res) => {
    MasterData.ObtenerTodosLosPaises().then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.AddTransport = async (req, res) => {
    MasterData.AgregarTransporte(req.body, req.params.simulationId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.GetAllTransports = async (req, res) => {
    MasterData.ObtenertodosLosTransportes(req.params.simulationId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.DeleteTransport = async (req, res) => {
    MasterData.EliminarTransporte(req.body.objectId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ArchiveTranspor = async (req, res) => {
    MasterData.ArchivarTransporte(req.body.objectId, req.body.seActiva).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.UpdateTranspor = async (req, res) => {
    MasterData.ActualizarTransporte(req.body).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.GetAllRawMaterialsInventory = async (req, res) => {
    MasterData.ObtenerTodosElInventario(req.params.simulationId).then(function (results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

module.exports.UpdateInventoryBase = async (req, res) => {
    MasterData.ObtenerTotalDeInventario(req.params.simulationId).then(function (results) {
        if (!results.error) {
            if (results.data > 0) {
                MasterData.ActualizarBaseInventario(req.body, req.params.simulationId).then(function (results) {
                    if (!results.error && results.data) {
                        var data = results.data
                        res.status(200).json({ code: 200, msg: "OK", data: data })
                    } else {
                        res.status(400).json({ code: 400, msg: "Error", error: results.error })
                    }
                })
            } else {
                MasterData.AgregarBaseInventario(req.body, req.params.simulationId).then(function (results) {
                    if (!results.error && results.data) {
                        var data = results.data
                        res.status(200).json({ code: 200, msg: "OK", data: data })
                    } else {
                        res.status(400).json({ code: 400, msg: "Error", error: results.error })
                    }
                })
            }
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

module.exports.DeleteRawMaterialInventory = async (req, res) => {
    MasterData.EliminarInventarioMateriaPrima(req.body.objectId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ArchiveRawMaterialInventory = async (req, res) => {
    MasterData.ArchivarInventarioMateriaPrima(req.body.objectId, req.body.seActiva).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.UpdateRawMaterialInventory = async (req, res) => {
    MasterData.ActualizarInventarioMateriaPrima(req.body).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.UpdateInventoryFixedAssets = async (req, res) => {
    MasterData.ObtenerTotalAsyncInventarioActivosFijos(req.params.simulationId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }

        if (results.data > 0) {
            MasterData.ActualizarInventarioActivosFijos(req.body, req.params.simulationId).then(function (results) {
                if (results.error) {
                    return res.status(400).json({ code: 400, msg: "Error", error: results.error })
                }
                res.status(200).json({ code: 200, msg: "OK", data: results.data })
            })

        } else {
            MasterData.AgregarBaseInventarioActivosFijos(req.body, req.params.simulationId).then(function (results) {
                if (results.error) {
                    return res.status(400).json({ code: 400, msg: "Error", error: results.error })
                }
                res.status(200).json({ code: 200, msg: "OK", data: results.data })
            })
        }

    })
}

module.exports.GetAllInventoryFixedAssets = async (req, res) => {
    MasterData.ObtenerTodoInventarioActivosFijos(req.params.simulationId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.UpdateFixedAssetsInventory = async (req, res) => {
    MasterData.ActualizarInventarioActivosFijo(req.body).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.GetAllSuppliersAndRawMaterials = async (req, res) => {
    MasterData.ObtenerTodaLosProvedoresMateriaPrima(req.params.simulationId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.AddSupplierAndRawMaterial = async (req, res) => {
    MasterData.AgregarProvedoreMateriaPrima(req.body, req.params.simulationId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.DeleteSupplierAndRawMaterial = async (req, res) => {
    MasterData.EliminarProvedoreMateriaPrima(req.body.objectId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ArchiveSupplierAndRawMaterial = async (req, res) => {
    MasterData.ArchivarProvedoreMateriaPrima(req.body.objectId, req.body.seActiva).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.UpdateSupplierAndRawMaterial = async (req, res) => {
    MasterData.ActualizarProvedoreMateriaPrima(req.body).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ImportSuppliersAndRawMaterials = async (req, res) => {
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'excel/csv')
        },
        filename: function (req, file, cb) {
            cb(null, "PlantillaProveedorMateriaPrima.csv")
        }
    })

    var upload = multer({ storage: storage }).fields([{ name: 'archivo', maxCount: 1 }])
    upload(req, res, function (err) {
        if (err) {
            return res.end("Error uploading file.");
        }

        var pathArchivo = ""
        if (req.files && req.files['archivo']) {
            pathArchivo = req.files['archivo'][0].path;
        }

        MasterData.ImportarProveedoresMateriasPrimas(req.params.simulationId, pathArchivo).then(function (results) {
            if (results.error) {
                return res.status(400).json({ code: 400, msg: "Error", error: results.error })
            }
            res.status(200).json({ code: 200, msg: "OK", data: results.data })
        })
    })
}

module.exports.GetAllTeamsInSimulationLivequery = async (req, res) => {
    SimulationsModel.GetAllTeamsInSimulationlivequery(req.params.simulationId).then(function (results){
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.GetAllSalaryTabulator = async (req, res) => {
    SimulationsModel.GetAllSalaryTabulatorSDM(req.params.simulationId).then(function (results) {
        if(results.error){
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.UpdateSalaryTabulator = async (req, res) => {
    SimulationsModel.UpdateSalaryTabulator(req.params.simulationId, req.body.salaryTabulatorPtr, req.body.salary).then(function (results) {
        if(results.error){
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

exports.GetProductionLinePhases = async (req, res) => {
    MasterData.GetProductionLinePhases(req.params.simulationId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data, dataFixedAsset: results.dataFixedAsset, dataTabulator: results.dataTabulator})
    })
}

exports.SaveProductionLinePhases = async (req, res) => {
    MasterData.SaveProductionLinePhases(req.body, req.params.simulationId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

exports.ArchiveProductionLinePhase = async (req, res) => {
    
    MasterData.ArchiveProductionLinePhase(req.body.objectId, req.body.seActiva, req.params.simulationId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

exports.DeleteProductionLinePhase = async (req, res) => {
    MasterData.DeleteProductionLinePhase(req.body.objectId, req.params.simulationId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

exports.EditProductionLinePhase = async (req, res) => {
    MasterData.EditProductionLinePhase(req.body, req.params.simulationId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

exports.GetAllProdcutionLineTemplates = async (req, res) => {
    MasterData.GetAllProdcutionLineTemplates(req.params.simulationId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data, dataProductFamily: results.dataProductFamily, dataPhases: results.dataPhases, dataTabulatorFixedAssets: results.dataTabulatorFixedAssets})
    })
}

exports.SaveProductionLineTemplate = async (req, res) => {
    MasterData.SaveProductionLineTemplate(req.body, req.params.simulationId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

exports.ArchiveProductionLineTemplate = async (req, res) => {
    
    MasterData.ArchiveProductionLineTemplate(req.body.objectId, req.body.seActiva, req.params.simulationId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

exports.DeleteProductionLineTemplate = async (req, res) => {
    MasterData.DeleteProductionLineTemplate(req.body.objectId, req.params.simulationId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

exports.EditProductionLineTemplate = async (req, res) => {
    MasterData.EditProductionLineTemplate(req.body, req.params.simulationId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.UpdateVariousDataClient = async (req, res) => {
    MasterData.UpdateVariousDataClient(req.body, req.params.simulationId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.UpdateVariousDataSuppliers = async (req, res) => {
    MasterData.UpdateVariousDataSuppliers(req.body, req.params.simulationId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.UpdateVariousDataEmployees = async (req, res) => {
    MasterData.UpdateVariousDataEmployees(req.body, req.params.simulationId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.UpdateVariousDataExpenses = async (req, res) => {
    MasterData.UpdateVariousDataExpenses(req.body, req.params.simulationId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.UpdateVariousDataFixedAssets = async (req, res) => {
    MasterData.UpdateVariousDataFixedAssets(req.body, req.params.simulationId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.UpdateVariousDataTransports = async (req, res) => {
    MasterData.UpdateVariousDataTransports(req.body, req.params.simulationId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.UpdateVariousDataRawmaterialInv = async (req, res) => {
    MasterData.UpdateVariousDataRawmaterialInv(req.body, req.params.simulationId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.UpdateVariousDataFixAssetsInv = async (req, res) => {
    MasterData.UpdateVariousDataFixAssetsInv(req.body, req.params.simulationId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.UpdateVariousDataSuppliersRawMaterial = async (req, res) => {
    MasterData.UpdateVariousDataSuppliersRawMaterial(req.body, req.params.simulationId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

//---------------------
module.exports.UpdateVariousDataSalaryTabulator = async (req, res) => {
    MasterData.UpdateVariousDataSalaryTabulator(req.body, req.params.simulationId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.UpdateVariousProductionLinePhases = async (req, res) => {
    MasterData.UpdateVariousProductionLinePhases(req.body, req.params.simulationId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.UpdateVariousProductionLineTemplates = async (req, res) => {
    MasterData.UpdateVariousProductionLineTemplates(req.body, req.params.simulationId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.PauseOrRunSimulation = async (req, res) => {
    try {
        var results = await SimulationsModel.PauseOrRunSimulation( req.body, req.currentUser )
    } catch (error) {
        log( error )
        return res.status(400).json({ code: 400, msg: "Error", error:error.err})
    }
    return res.status(200).json({ code: 200, msg: "OK", data: results.data })
}

exports.CreateContentFileArchives = async( ruta ) => {
    var ruta = path.join(__dirname, "./../../../"+ruta)
    try {
        var encontrado = fs.existsSync(ruta)
        //log(encontrado)
    } catch (error) {
        log( error )
        return { results: null, error: error.erro }
    }

    var results = undefined
    if( !encontrado ){
        fs.mkdirSync( ruta );
    }else{
        results = ruta
    }

    return { data: results, error: null}

}

exports.restartEmployees = async (req, res) => {
    log("profesor  restablecer controlador")
    try {
        var results = await SimulationsModel.restartEmployees( req.params.simulationId )
    } catch (error) {
        log( error )
        return res.status(400).json( { code: 400, msg: "Error", error: error.error } )
    }
    res.status(200).json({ code: 200, msg: "OK", data: results.data })
}


exports.restartSDMSalary = async (req, res) => {
    log("profesor  restablecer controlador")
    try {
        var results = await SimulationsModel.restartSDMSalary( req.params.simulationId, req.body.type )
    } catch (error) {
        log( error )
        return res.status(400).json( { code: 400, msg: "Error", error: error.error } )
    }
    res.status(200).json({ code: 200, msg: "OK", data: results.data })
}