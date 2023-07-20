let GroupsModel = require("../../models/advisers/groups.model")
// let Permisos = require("../../models/administrador/permisos.model")
//let Bitacora = require("../../models/administrador/bitacora.model")
var moment = require('moment')
var _ = require('underscore')
var multer = require('multer')

var log = console.log

module.exports.test = async (req, res) => {
    res.status(200).send({ title: "success", message: "Welcome To Testing API" })
}

module.exports.GruposPrincipal = async (req, res) => {
    var error = req.query.e
    
    var permission = true
    if(req.cookies.permission != "SUPERADMIN"){
        permission = false
    }

    GroupsModel.ObtenerTodosLosProfesores().then(function (results, error) {
        if (!results.error && results.data) {
            res.render('NovusTec/Advisers/Groups/index', {
                title: "Groups",
                description: "",
                content: "Groups",
                menu_item: "Groups",
                currentUser: req.currentUser,
                moderadores: results.data,
                permission: permission,
                error: error,
                permisos: [],
                _: _,
                moment: moment
            });
        }

    })
}

module.exports.DatosGrupos = async (req, res) => {
    GroupsModel.ObtenerTodosLosGrupos(req.cookies.usr_id).then(function (results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

module.exports.AgregarGrupo = async (req, res) => {
    GroupsModel.AgregarGrupo(req.body).then(function (results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "Ok", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

module.exports.EliminarGrupo = async (req, res) => {
    GroupsModel.EliminarGrupo(req.body.idGrupo, req.currentUser.id).then(function (results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

module.exports.ArchivarGrupo = async (req, res) => {
    GroupsModel.ArchivarGrupo(req.body.idGrupo, req.body.seActiva).then(function (results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

module.exports.EditarGrupo = async (req, res) => {
    GroupsModel.EditarGrupo(req.body).then(function (results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

module.exports.ObtenerAlumnos = async (req, res) => {
    GroupsModel.ObtenerAlumnos(req.params.objectId).then(function (results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

module.exports.DetalleGrupo = async (req, res) => {
    var error = req.query.e
    var grupoId = req.params.objectId

    var permission = true
    if(req.cookies.permission != "SUPERADMIN"){
        permission = false
    }
    
    GroupsModel.ObtenerGrupo(grupoId).then(function (results) {
        if (!results.error && results.data) {
            var grupo = results.data
            res.render('NovusTec/Advisers/Groups/detalle', {
                title: "Grupos",
                description: "",
                content: "Grupos",
                menu_item: "Grupos",
                currentUser: req.currentUser,
                permission: permission,
                grupo: grupo,
                error: error,
                permisos: [],
                _: _,
                moment: moment
            });
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

module.exports.ObtenerDatosGrupo = async (req, res) => {
    GroupsModel.ObtenerDatosGrupo(req.body.idGrupo, req.body.idModerador).then(function (results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

module.exports.SalirDelGrupo = async (req, res) => {
    GroupsModel.SalirDelGrupo(req.currentUser, req.body.idGrupo).then(function (results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

module.exports.AgregarAlumno = async (req, res) => {
    var fullUrl = req.protocol + '://' + req.get('host') + '/registro';
    GroupsModel.AgregarAlumno(req.body, fullUrl).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.ArchivarAlumno = async (req, res) => {
    GroupsModel.ArchivarAlumno(req.body.objectId, req.body.seActiva).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.EliminarAlumno = async (req, res) => {
    GroupsModel.EliminarAlumno(req.body.objectId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.EditarAlumno = async (req, res) => {
    GroupsModel.EditarAlumno(req.body).then(function (results) {

        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }

        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.InportarAlumnos = async (req, res) => {
    var fullUrl = req.protocol + '://' + req.get('host') + '/registro';
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'excel/csv')
        },
        filename: function (req, file, cb) {
            cb(null, "GrupoAlumnos.csv")
        }
    })

    var upload = multer({ storage: storage }).fields([{ name: 'archivo', maxCount: 1 }])
    upload(req, res, async function (err) {
        if (err) {
            return res.end("Error uploading file.");
        }

        var pathArchivo = ""
        if (req.files && req.files['archivo']) {
            pathArchivo = req.files['archivo'][0].path;
        }

        /*GroupsModel.ImportarAlumnos(pathArchivo, req.body.grupoId, fullUrl).then(function (results) {
            if (results.error) {
                return res.status(400).json({ code: 400, msg: "Error", error: results.error })
            }
            res.status(200).json({ code: 200, msg: "OK", data: results.data, usuariosConOtroPermiso: results.usuariosConOtroPermiso, alumnosNuevosSistema: results.alumnosNuevosSistema, alumnosNuevosGrupo: results.alumnosNuevosGrupo, alumnosExistentesGrupo: results.alumnosExistentesGrupo })

        })*/

        try {
            var results = await GroupsModel.IterativoImportarAlumnos( pathArchivo, req.body.grupoId, fullUrl )
        } catch (error) {
            log( error )
            return res.status(400).json( { code: 400, msg: "Error", error: error.error } )
        }
        return res.status(200).json({ code: 200, msg: "OK", data: results.data, usuariosConOtroPermiso: results.usuariosConOtroPermiso, alumnosNuevosSistema: results.alumnosNuevosSistema, alumnosNuevosGrupo: results.alumnosNuevosGrupo, alumnosExistentesGrupo: results.alumnosExistentesGrupo } )
        
    })
}
