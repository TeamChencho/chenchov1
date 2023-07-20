let MasterDataModel = require("../../models/administrador/master_data.model")
var moment = require('moment')
var _ = require('underscore')
var multer = require('multer')
const { isArray, object } = require("underscore")
var path = require('path')
var fs = require('fs')

var log = console.log

module.exports.test = async (req, res) => {
    res.status(200).send({ status: "success", message: "Welcome To Testing API" })
}

module.exports.MasterDataPrincipal = async (req, res) => {
    var error = req.query.e
    res.render('NovusTec/Administrador/MasterData/index', {
        title: "Master Data",
        description: "",
        content: "MasterData",
        menu_item: "MasterData",
        currentUser: req.currentUser,
        error: error,
        _: _,
        moment: moment
    });
}

module.exports.ObtenerTodaLaMateriaPrima = async (req, res) => {
    MasterDataModel.ObtenerTodaLaMateriaPrima().then(function (results) {
        if (!results.error && results.data) {
            var data = results.data
            var cate = results.dataCategoria
            //log(cate)
            res.status(200).json({ code: 200, msg: "OK", data: data, dataCategoria: cate })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

module.exports.AgregarMateriaPrima = async (req, res) => {

    await exports.CreateContentFileArchives( 'public/assets/imagesRawMaterial' )

    var storage = multer.diskStorage({
        destination: async (req, file, cb) => {
            cb(null, 'public/assets/imagesRawMaterial')
        },
        filename: function (require, file, cb) {
            var typeArchive = file.originalname.split('.')
            cb(null, moment().valueOf() + "_image." + file.originalname.split('.')[typeArchive.length-1])
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

        MasterDataModel.AgregarMateriaPrima(req.body, pathArchivo).then(function (results) {
            if (results.error) {
                return res.status(400).json({ code: 400, msg: "Error", error: results.error })
            }
            res.status(200).json({ code: 200, msg: "OK", data: results.data })
        })
    })
}

module.exports.ImportRawMaterial = async (req, res) => {

    var storage = multer.diskStorage({
        destination :   function (req, file, cb) {
                            cb(null, 'excel/csv')
                        },
        filename    :   function (req, file, cb) {
                            cb(null, "PlantillaMateriaPrima.csv")
                        }
    })

    var upload = multer({ storage: storage }).fields([{ name: 'archivo', maxCount: 1 }])
        upload(req, res, async (err) => {
            
            if (err) { return res.end("Error uploading file."); }

            var pathArchivo = ""
            if (req.files && req.files['archivo']) {
                pathArchivo = req.files['archivo'][0].path;
            }

            try {
                var results = await MasterDataModel.ImportRawMaterial( req.body, pathArchivo )
            } catch (error) {
                log( error )
                return res.status(400).json( { code: 400, msg: "Error", error: error.error } )
            }
            return res.status(200).json( { code: 200, msg: "OK", data: results.data } )
        })
}

module.exports.EditarMateriaPrima = async (req, res) => {

    await exports.CreateContentFileArchives( 'public/assets/imagesRawMaterial' )

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/assets/imagesRawMaterial')
        },
        filename: function (require, file, cb) {
            var typeArchive = file.originalname.split('.')
            cb(null, moment().valueOf() + "_image." + file.originalname.split('.')[typeArchive.length-1])
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

        MasterDataModel.EditarMateriaPrima(req.body, pathArchivo).then(function (results) {
            if (results.error) {
                return res.status(400).json({ code: 400, msg: "Error", error: results.error })
            }
            res.status(200).json({ code: 200, msg: "OK", data: results.data })
        })
    })
}

module.exports.ObtenerTodosLosProductos = async (req, res) => {
    MasterDataModel.ObtenerTodosLosProductos().then(function (results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

module.exports.AgregarProductoFamilia = async (req, res) => {
    //var upload = multer({ storage: multerS3({ s3: s3, bucket: process.env.AWS_BUCKET, key: function (req, file, cb) { cb(null, Date.now() + "_" + file.originalname) } }) }).fields([{ name: 'imagenPerfil', maxCount: 1 }])
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
        MasterDataModel.AgregarProductoFamilia(req.body, pathArchivo, pathArchivoVideo).then(function (results) {
            if (!results.error && results.data) {
                var data = results.data
                res.status(200).json({ code: 200, msg: "OK", data: data, withoutTransport: results.withoutTransport, withoutSRM: results.withoutSRM, dataUniq: results.dataUniq })
            } else {
                res.status(400).json({ code: 400, msg: "Error", error: results.error })
            }
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

        MasterDataModel.AddVideoProductoFamily(req.body.objectId,pathArchivoVideo).then(function (results) {
            if (!results.error && results.data) {
                var data = results.data
                res.status(200).json({ code: 200, msg: "OK", data: data })
            } else {
                res.status(400).json({ code: 400, msg: "Error", error: results.error })
            }
        })
    })
}

module.exports.EliminarProducto = async (req, res) => {
    MasterDataModel.EliminarProducto(req.body.objectId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ArchivarProducto = async (req, res) => {
    MasterDataModel.ArchivarProducto(req.body.objectId, req.body.seActiva).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ActualizarProducto = async (req, res) => {
    
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
        MasterDataModel.ActualizarProducto(req.body, pathArchivo).then(function (results) {
            if (results.error) {
                return res.status(400).json({ code: 400, msg: "Error", error: results.error })
            }
            res.status(200).json({ code: 200, msg: "OK", data: results.data })
        })
    })
}

module.exports.DeleteVideoProductoFamily = async (req, res) => {
    MasterDataModel.DeleteVideoProductoFamily(req.body.objectId, req.body.pathVideo).then(function (results){
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data})
    })
}

module.exports.ActualizarProveedor = async (req, res) => {
    MasterDataModel.ActualizarProveedor(req.body).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ObtenerTodosElInventario = async (req, res) => {
    MasterDataModel.ObtenerTodosElInventario().then(function (results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

module.exports.ActualizarBaseInventario = async (req, res) => {
    MasterDataModel.ObtenerTotalDeInventario().then(function (results) {
        if (!results.error) {
            if (results.data > 0) {
                MasterDataModel.ActualizarBaseInventario(req.body).then(function (results) {
                    if (!results.error && results.data) {
                        var data = results.data
                        res.status(200).json({ code: 200, msg: "OK", data: data })
                    } else {
                        res.status(400).json({ code: 400, msg: "Error", error: results.error })
                    }
                })
            } else {
                MasterDataModel.AgregarBaseInventario(req.body).then(function (results) {
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

module.exports.EliminarInventarioMateriaPrima = async (req, res) => {
    MasterDataModel.EliminarInventarioMateriaPrima(req.body.objectId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ArchivarInventarioMateriaPrima = async (req, res) => {
    MasterDataModel.ArchivarInventarioMateriaPrima(req.body.objectId, req.body.seActiva).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ActualizarInventarioMateriaPrima = async (req, res) => {
    MasterDataModel.ActualizarInventarioMateriaPrima(req.body).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ImportarProveedores = async (req, res) => {

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'excel/csv')
        },
        filename: function (req, file, cb) {
            cb(null, "PlantillaProveedores.csv")
        }
    })

    var upload = multer({ storage: storage }).fields([{ name: 'archivo', maxCount: 1 }])
    upload(req, res, async (err) => {
        if (err) {
            return res.end("Error uploading file.");
        }

        var pathArchivo = ""
        if (req.files && req.files['archivo']) {
            pathArchivo = req.files['archivo'][0].path;
        }

        try {
            var results = await MasterDataModel.ImportarProveedores( pathArchivo )
        } catch (error) {
            log( error )
            return res.status(400).json( { code: 400, msg: "Error", error: error.error } )
        }
        return res.status(200).json( { code: 200, msg: "OK", data: results.data } )
    })
}

module.exports.ObtenerTodosLosProveedores = async (req, res) => {
    MasterDataModel.ObtenerTodosLosProveedores().then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.EliminarProveedor = async (req, res) => {
    MasterDataModel.EliminarProveedor(req.body.objectId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ArchivarProveedor = async (req, res) => {
    MasterDataModel.ArchivarProveedor(req.body.objectId, req.body.seActiva).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ImportarClientes = async (req, res) => {

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'excel/csv')
        },
        filename: function (req, file, cb) {
            cb(null, "PlantillaClientes.csv")
        }
    })

    var upload = multer({ storage: storage }).fields([{ name: 'archivo', maxCount: 1 }])
    upload(req, res, async (err) => {
        if (err) {
            return res.end("Error uploading file.");
        }

        var pathArchivo = ""
        if (req.files && req.files['archivo']) {
            pathArchivo = req.files['archivo'][0].path;
        }

        try {
            var results = await MasterDataModel.ImportarClientes(pathArchivo)
        } catch (error) {
            log( error )
            return res.status(400).json( { code: 400, msg: "Error", error: error.error } )
        }
        return res.status(200).json( { code: 200, msg: "OK", data: results.data } )
    })
}

module.exports.ObtenerTodosLosClientes = async (req, res) => {
    MasterDataModel.ObtenerTodosLosClientes().then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.EliminarCliente = async (req, res) => {
    MasterDataModel.EliminarCliente(req.body.objectId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ArchivarCliente = async (req, res) => {
    MasterDataModel.ArchivarCliente(req.body.objectId, req.body.seActiva).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ActualizarCliente = async (req, res) => {
    MasterDataModel.ActualizarCliente(req.body).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ImportarEmpleados = async (req, res) => {

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'excel/csv')
        },
        filename: function (req, file, cb) {
            cb(null, "PlantillaEmpleados.csv")
        }
    })

    var upload = multer({ storage: storage }).fields([{ name: 'archivo', maxCount: 1 }])
    upload(req, res, async (err) => {
        if (err) {
            return res.end("Error uploading file.");
        }

        var pathArchivo = ""
        if (req.files && req.files['archivo']) {
            pathArchivo = req.files['archivo'][0].path;
        }
        log("controlador")

        try {
            var results = await MasterDataModel.ImportarEmpleados( pathArchivo, req.body.salaryTabulatorPtr )
        } catch (error) {
            log( error )
            return res.status(400).json( { code: 400, msg: "Error", error: error.error } )
        }
        return res.status(200).json( { code: 200, msg: "OK", data: results.data } )

    })
}

module.exports.EliminarEmpledo = async (req, res) => {
    MasterDataModel.EliminarEmpledo(req.body.objectId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ArchivarEmpleado = async (req, res) => {
    MasterDataModel.ArchivarEmpleado(req.body.objectId, req.body.seActiva).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ObtenerTodosLosEmpleados = async (req, res) => {
    MasterDataModel.ObtenerTodosLosEmpleados().then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data, dataTabulator: results.dataTabulator })
    })
}

module.exports.ActualizarEmpleado = async (req, res) => {
    MasterDataModel.ActualizarEmpleado(req.body).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ImportarGastos = async (req, res) => {

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'excel/csv')
        },
        filename: function (req, file, cb) {
            cb(null, "PlantillaGastos.csv")
        }
    })

    var upload = multer({ storage: storage }).fields([{ name: 'archivo', maxCount: 1 }])
    upload(req, res, async (err) => {
        if (err) {
            return res.end("Error uploading file.");
        }

        var pathArchivo = ""
        if (req.files && req.files['archivo']) {
            pathArchivo = req.files['archivo'][0].path;
        }

        try {
            var results = await MasterDataModel.ImportarGastos( pathArchivo )
        } catch (error) {
            log( error )
            return res.status(400).json( { code: 400, msg: "Error", error: error.error } )
        }
        return res.status(200).json( { code: 200, msg: "OK", data: results.data } )
    })
}

module.exports.ObtenerTodosLosGastos = async (req, res) => {
    MasterDataModel.ObtenerTodosLosGastos().then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.EliminarGasto = async (req, res) => {
    MasterDataModel.EliminarGasto(req.body.objectId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ArchivarGasto = async (req, res) => {
    MasterDataModel.ArchivarGasto(req.body.objectId, req.body.seActiva).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ActualizarGasto = async (req, res) => {
    MasterDataModel.ActualizarGasto(req.body).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ImportarActivosFijos = async (req, res) => {

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'excel/csv')
        },
        filename: function (req, file, cb) {
            cb(null, "PlantillaActivosFijos.csv")
        }
    })

    var upload = multer({ storage: storage }).fields([{ name: 'archivo', maxCount: 1 }])
    upload(req, res, async (err) => {
        if (err) {
            return res.end("Error uploading file.");
        }

        var pathArchivo = ""
        if (req.files && req.files['archivo']) {
            pathArchivo = req.files['archivo'][0].path;
        }

        try {
            var results = await MasterDataModel.ImportarActivosFijos( pathArchivo )
        } catch (error) {
            log( error )
            return res.status(400).json( { code: 400, msg: "Error", error: error.error } )
        }
        return res.status(200).json( { code: 200, msg: "OK", data: results.data } )
    })
}

module.exports.ObtenerTodosLosActivosFijos = async (req, res) => {
    MasterDataModel.ObtenerTodosLosActivosFijos().then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.EliminarActivoFijo = async (req, res) => {
    MasterDataModel.EliminarActivoFijo(req.body.objectId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ArchivarActivoFijo = async (req, res) => {
    MasterDataModel.ArchivarActivoFijo(req.body.objectId, req.body.seActiva).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ActualizarActivoFijo = async (req, res) => {
    MasterDataModel.ActualizarActivoFijo(req.body).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ActualizarInventarioActivosFijos = async (req, res) => {
    MasterDataModel.ObtenerTotalAsyncInventarioActivosFijos().then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }

        if (results.data > 0) {
            MasterDataModel.ActualizarInventarioActivosFijos(req.body).then(function (results) {
                if (results.error) {
                    return res.status(400).json({ code: 400, msg: "Error", error: results.error })
                }
                res.status(200).json({ code: 200, msg: "OK", data: results.data })
            })

        } else {
            MasterDataModel.AgregarBaseInventarioActivosFijos(req.body).then(function (results) {
                if (results.error) {
                    return res.status(400).json({ code: 400, msg: "Error", error: results.error })
                }
                res.status(200).json({ code: 200, msg: "OK", data: results.data })
            })
        }

    })
}

module.exports.ObtenerTodoElInventarioActivosFijo = async (req, res) => {
    MasterDataModel.ObtenerTodoInventarioActivosFijos().then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ActualizarInventarioActivosFijo = async (req, res) => {
    MasterDataModel.ActualizarInventarioActivosFijo(req.body).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ObtenerHistoricoOrdenes = async (req, res) => {
    MasterDataModel.ObtenerHistoricoOrdenes().then(function(results) {
        if(results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })   
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.AgregarHistoricoOrdenes = async(req, res) => {
    console.log("here 2")
    MasterDataModel.AgregarHistoricoOrdenes(req.body).then(function(results) {
        if(results.error) {
            console.log("here 3")
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })   
        }
        console.log("here 4")
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ObtenerTodaLosProvedoresMateriaPrima = async (req, res) => {
    MasterDataModel.ObtenerTodaLosProvedoresMateriaPrima().then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.AgregarProvedoreMateriaPrima = async (req, res) => {
    MasterDataModel.AgregarProvedoreMateriaPrima(req.body).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.EliminarProvedoreMateriaPrima = async (req, res) => {
    MasterDataModel.EliminarProvedoreMateriaPrima(req.body.objectId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ArchivarProvedoreMateriaPrima = async (req, res) => {
    MasterDataModel.ArchivarProvedoreMateriaPrima(req.body.objectId, req.body.seActiva).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ActualizarProvedoreMateriaPrima = async (req, res) => {
    MasterDataModel.ActualizarProvedoreMateriaPrima(req.body).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ImportarProveedoresMateriasPrimas = async (req, res) => {
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'excel/csv')
        },
        filename: function (req, file, cb) {
            cb(null, "PlantillaProveedorMateriaPrima.csv")
        }
    })

    var upload = multer({ storage: storage }).fields([{ name: 'archivo', maxCount: 1 }])
    upload(req, res, async (err) => {
        if (err) {
            return res.end("Error uploading file.");
        }

        var pathArchivo = ""
        if (req.files && req.files['archivo']) {
            pathArchivo = req.files['archivo'][0].path;
        }

        try {
            var results = await MasterDataModel.ImportarProveedoresMateriasPrimas( pathArchivo )
        } catch (error) {
            log( error )
            return res.status(400).json( { code: 400, msg: "Error", error: error.error } )
        }
        return res.status(200).json( { code: 200, msg: "OK", data: results.data } )
    })
}

module.exports.ObtenerTodosLosPaises = async (req, res) => {
    MasterDataModel.ObtenerTodosLosPaises().then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.AgregarTransporte = async (req, res) => {
    MasterDataModel.AgregarTransporte(req.body).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ObtenertodosLosTransportes = async (req, res) => {
    MasterDataModel.ObtenertodosLosTransportes().then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.EliminarTransporte = async (req, res) => {
    MasterDataModel.EliminarTransporte(req.body.objectId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ArchivarTransporte = async (req, res) => {
    MasterDataModel.ArchivarTransporte(req.body.objectId, req.body.seActiva).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ActualizarTransporte = async (req, res) => {
    MasterDataModel.ActualizarTransporte(req.body).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.GetAllSalaryTabulator = async (req, res) => {
    MasterDataModel.GetAllSalaryTabulator().then(function (results) {
        if(results.error){
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.UpdateSalaryTabulator = async (req, res) => {
    MasterDataModel.UpdateSalaryTabulator(req.body.salaryTabulatorPtr, req.body.salary).then(function (results) {
        if(results.error){
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

exports.GetProductionLinePhases = async (req, res) => {
    MasterDataModel.GetProductionLinePhases().then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data, dataFixedAsset: results.dataFixedAsset, dataTabulator: results.dataTabulator})
    })
}

exports.SaveProductionLinePhases = async (req, res) => {
    MasterDataModel.SaveProductionLinePhases(req.body).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

exports.ArchiveProductionLinePhase = async (req, res) => {
    
    MasterDataModel.ArchiveProductionLinePhase(req.body.objectId, req.body.seActiva).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

exports.DeleteProductionLinePhase = async (req, res) => {
    MasterDataModel.DeleteProductionLinePhase(req.body.objectId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

exports.EditProductionLinePhase = async (req, res) => {
    MasterDataModel.EditProductionLinePhase(req.body).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

exports.GetAllProdcutionLineTemplates = async (req, res) => {
    MasterDataModel.GetAllProdcutionLineTemplates().then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data, dataProductFamily: results.dataProductFamily, dataPhases: results.dataPhases, dataTabulatorFixedAssets: results.dataTabulatorFixedAssets})
    })
}

exports.SaveProductionLineTemplate = async (req, res) => {
    MasterDataModel.SaveProductionLineTemplate(req.body).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

exports.ArchiveProductionLineTemplate = async (req, res) => {
    
    MasterDataModel.ArchiveProductionLineTemplate(req.body.objectId, req.body.seActiva).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

exports.DeleteProductionLineTemplate = async (req, res) => {
    MasterDataModel.DeleteProductionLineTemplate(req.body.objectId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

exports.EditProductionLineTemplate = async (req, res) => {
    MasterDataModel.EditProductionLineTemplate(req.body).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
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
    log("restablecer controlador")
    try {
        var results = await MasterDataModel.restartEmployees()
    } catch (error) {
        log( error )
        return res.status(400).json( { code: 400, msg: "Error", error: error.error } )
    }
    res.status(200).json({ code: 200, msg: "OK", data: results.data })
}