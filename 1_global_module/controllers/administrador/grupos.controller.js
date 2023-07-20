let Grupos = require("../../models/administrador/grupos.model.js")
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

    Grupos.ObtenerTodosLosProfesores().then(function (results) {
        if (!results.error && results.data) {
            res.render('NovusTec/Administrador/Grupos/index', {
                title: "Grupos",
                description: "",
                content: "Grupos",
                menu_item: "Grupos",
                currentUser: req.currentUser,
                moderadores: results.data,
                error: error,
                permisos: [],
                _: _,
                moment: moment
            });
        }
    })
}

/**
 * URL con punto de fin AJAX que obtiene todos los usuarios de administración del sistema
 * @memberof ControladorUsuariosAdmin
 * @param {Object} req Objeto request HTTP
 * @param {Object} res Objeto response HTTP
 */
module.exports.ObtenerTodosLosGrupos = async (req, res) => {
    Grupos.ObtenerTodosLosGrupos(req.currentUser.id).then(function (results) {
        if (!results.error && results.data) {
            var data = results.data
            var dataGrupos = results.dataGrupos
            res.status(200).json({ code: 200, msg: "OK", data: data, dataGrupos: dataGrupos })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

/**
 * URL con punto de fin AJAX que agrega un nuevo usuario de administración del sistema
 * @memberof ControladorUsuariosAdmin
 * @param {Object} req Objeto request HTTP
 * @param {Object} res Objeto response HTTP
 */
module.exports.AgregarGrupo = async (req, res) => {
    Grupos.AgregarGrupo(req.body).then(function (results) {

        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }

        if (!results.data) {
            return res.status(400).json({ code: 400, msg: "Error", error: "Group not found" })
        }

        var data = results.data
        res.status(200).json({ code: 200, msg: "OK", data: data })

    })
}

/**
 * URL con punto de fin AJAX que edita a un usuario de administración del sistema
 * @memberof ControladorUsuariosAdmin
 * @param {Object} req Objeto request HTTP
 * @param {Object} res Objeto response HTTP
 */
module.exports.EditarGrupo = async (req, res) => {
    Grupos.EditarGrupo(req.body).then(function (results) {

        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }

        if (!results.data) {
            return res.status(400).json({ code: 400, msg: "Error", error: "Group not found" })
        }

        var data = results.data
        res.status(200).json({ code: 200, msg: "OK", data: data })
    })
}

module.exports.ObtenerDatosGrupo = async (req, res) => {
    Grupos.ObtenerDatosGrupo(req.body.idGrupo, req.body.idUsuario).then(function (results) {

        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }

        if (!results.data) {
            return res.status(400).json({ code: 400, msg: "Error", error: "Group not found" })
        }

        var data = results.data
        res.status(200).json({ code: 200, msg: "OK", data: data })

    })
}

/**
 * URL con punto de fin AJAX que archiva a un usuario de administración del sistema
 * @memberof ControladorUsuariosAdmin
 * @param {Object} req Objeto request HTTP
 * @param {Object} res Objeto response HTTP
 */
module.exports.ArchivarGrupo = async (req, res) => {
    Grupos.ArchivarGrupo(req.body.objectId, req.body.seActiva).then(function (results) {

        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }

        if (!results.data) {
            return res.status(400).json({ code: 400, msg: "Error", error: "Group not found" })
        }

        var data = results.data
        res.status(200).json({ code: 200, msg: "OK", data: data })

    })
}

/**
 * URL con punto de fin AJAX que elimina a un usuario de administración del sistema
 * @memberof ControladorUsuariosAdmin
 * @param {Object} req Objeto request HTTP
 * @param {Object} res Objeto response HTTP
 */
module.exports.EliminarGrupo = async (req, res) => {
    Grupos.EliminarGrupo(req.body.idGrupo, req.currentUser.id, req.body.perteneceAdmin).then(function (results) {

        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }

        if (!results.data) {
            return res.status(400).json({ code: 400, msg: "Error", error: "Group not found" })
        }

        var data = results.data
        res.status(200).json({ code: 200, msg: "OK", data: data })

    })
}

module.exports.SalirDelGrupo = async (req, res) => {
    Grupos.SalirDelGrupo(req.currentUser, req.body.idGrupo).then(function (results) {

        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }

        if (!results.data) {
            return res.status(400).json({ code: 400, msg: "Error", error: "Group not found" })
        }

        var data = results.data
        res.status(200).json({ code: 200, msg: "OK", data: data })

    })
}

module.exports.DetalleGrupo = async (req, res) => {
    var error = req.query.e
    var grupoId = req.params.objectId

    Grupos.BuscarGrupo(grupoId).then(function (results) {
        if (!results.error && results.data) {
            var grupo = results.data
            res.render('NovusTec/Administrador/Grupos/detalle', {
                title: "Grupos",
                description: "",
                content: "Grupos",
                menu_item: "Grupos",
                currentUser: req.currentUser,
                grupo: grupo,
                error: error,
                permisos: [],
                _: _,
                moment: moment
            });
        }
    })
}

module.exports.ObtenerAlumnos = async (req, res) => {
    Grupos.ObtenerAlumnos(req.params.objectId).then(function (results) {

        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }

        if (!results.data) {
            return res.status(400).json({ code: 400, msg: "Error", error: "User not found" })
        }

        var data = results.data
        res.status(200).json({ code: 200, msg: "OK", data: data })

    })
}

module.exports.AgregarAlumno = async (req, res) => {
    var fullUrl = req.protocol + '://' + req.get('host') + '/registro';
    Grupos.AgregarAlumno(req.body, fullUrl).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }

        if (!results.data) {
            return res.status(400).json({ code: 400, msg: "Error", error: "User not found" })
        }
        var data = results.data
        res.status(200).json({ code: 200, msg: "OK", data: data })
    })
}

module.exports.EditarAlumno = async (req, res) => {
    Grupos.EditarAlumno(req.body).then(function (results) {

        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }

        if (!results.data) {
            return res.status(400).json({ code: 400, msg: "Error", error: "User not found" })
        }

        var data = results.data
        res.status(200).json({ code: 200, msg: "OK", data: data })

    })
}

module.exports.ArchivarAlumno = async (req, res) => {
    Grupos.ArchivarAlumno(req.body.objectId, req.body.seActiva).then(function (results) {

        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }

        if (!results.data) {
            return res.status(400).json({ code: 400, msg: "Error", error: "User not found" })
        }

        var data = results.data
        res.status(200).json({ code: 200, msg: "OK", data: data })

    })
}

module.exports.EliminarAlumno = async (req, res) => {
    Grupos.EliminarAlumno(req.body.objectId).then(function (results) {

        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }

        if (!results.data) {
            return res.status(400).json({ code: 400, msg: "Error", error: "User not found" })
        }

        var data = results.data
        res.status(200).json({ code: 200, msg: "OK", data: data })

    })
}

module.exports.ImportarAlumnos = async (req, res) => {

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
    upload(req, res, function (err) {
        if (err) {
            return res.end("Error uploading file.");
        }

        var pathArchivo = ""
        if (req.files && req.files['archivo']) {
            pathArchivo = req.files['archivo'][0].path;
        }

        Grupos.ImportarAlumnos(pathArchivo, req.body.grupoId, fullUrl).then(function (results) {
            if (!results.error) {
                res.status(200).json({ code: 200, msg: "OK", data: results.data, usuariosConOtroPermiso: results.usuariosConOtroPermiso, alumnosNuevosSistema: results.alumnosNuevosSistema, alumnosNuevosGrupo: results.alumnosNuevosGrupo, alumnosExistentesGrupo: results.alumnosExistentesGrupo })
            } else {
                res.status(400).json({ code: 400, msg: "Error", error: results.error })
            }
        })
    })
}

module.exports.IterativoImportarAlumnos = async (req, res) => {
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
    upload(req, res, async (err) => {
        if (err) {
            return res.end("Error uploading file.");
        }

        var pathArchivo = ""
        if (req.files && req.files['archivo']) {
            pathArchivo = req.files['archivo'][0].path;
        }

        try {
            var results = await Grupos.IterativoImportarAlumnos( pathArchivo, req.body.grupoId, fullUrl )
        } catch (error) {
            log( error )
            return res.status(400).json( { code: 400, msg: "Error", error: error.error } )
        }
        return res.status(200).json({ code: 200, msg: "OK", data: results.data, usuariosConOtroPermiso: results.usuariosConOtroPermiso, alumnosNuevosSistema: results.alumnosNuevosSistema, alumnosNuevosGrupo: results.alumnosNuevosGrupo, alumnosExistentesGrupo: results.alumnosExistentesGrupo } )
        
    })
}