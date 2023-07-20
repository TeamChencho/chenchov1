var log = console.log

exports.ObtenerTodasLasSolicitudes = function () {
    return new Promise(function (resolve, reject) {
        exports.AsyncObtenerSolicitudes(0, [], function (results, error) {
            if (error) {
                return resolve({ type: "CONSULTA", data: null, error: error.message })
            }
            resolve({ type: "CONSULTA", data: results, error: null })
        })
    })
}

exports.AsyncObtenerSolicitudes = async (index, dataArray, callback) => {

    var Table = Parse.Object.extend("SolicitudesUsuarios")
    var query = new Parse.Query(Table)

    query.equalTo("exists", true)
    query.skip(index * 1000)
    query.limit(1000)
    query.ascending("nombre")

    try {
        const results = await query.find()
        if (results.length <= 0) {
            dataArray.push.apply(dataArray, results)
            callback(dataArray, null)
        } else {
            dataArray.push.apply(dataArray, results)
            exports.AsyncObtenerSolicitudes((index + 1), dataArray, callback)
        }
    } catch (error) {
        callback(dataArray, error)
    }
}

exports.EliminarSolicitud = function (idSolicitud) {
    return new Promise(function (resolve, reject) {
        exports.AsyncBuscarSolicitud(idSolicitud, function (solicitudEncotrada, error) {
            if (error) {
                return resolve({ type: "ELIMINAR", data: null, error: error.message })
            }
            if (!solicitudEncotrada) {
                return resolve({ type: "ELIMINAR", data: null, error: "Request not found" })
            }
            solicitudEncotrada.set("exists", false)
            solicitudEncotrada.set("active", false)

            solicitudEncotrada.save().then((solicitudGuardada) => {
                resolve({ type: "ELIMINAR", data: solicitudGuardada, error: null })
            }, (error) => {
                resolve({ type: "ELIMINAR", data: null, error: error.message })
            })
        })
    })
}

exports.AsyncBuscarSolicitud = async (idSolicitud, callback) => {
    var SolicitudesUsuarios = Parse.Object.extend("SolicitudesUsuarios")
    var query = new Parse.Query(SolicitudesUsuarios)

    query.equalTo("objectId", idSolicitud)
    query.equalTo("exists", true)

    try {
        var results = await query.first()
        callback(results, null)
    } catch (error) {
        callback(null, error)
    }
}

exports.SolicitudArchivar = function (idSolicitud, seActiva) {
    return new Promise(function (resolve, reject) {
        exports.AsyncBuscarSolicitud(idSolicitud, function (solicitudEncontrada, error) {
            if (error) {
                return resolve({ type: "ARCHIVAR", data: null, error: error.message })
            }
            if (!solicitudEncontrada) {
                return resolve({ type: "ARCHIVAR", data: null, error: "Request not found" })
            }

            if (seActiva === "true") {
                solicitudEncontrada.set("active", true)
            } else if (seActiva === "false") {
                solicitudEncontrada.set("active", false)
            }

            solicitudEncontrada.save().then((solicitud) => {
                resolve({ type: "ARCHIVAR", data: solicitud, error: null })
            }, (error) => {
                resolve({ type: "ARCHIVAR", data: null, error: error.message })
            })

        })
    })
}

exports.SolicitudCambiarStatus = function (data) {
    return new Promise(function (resolve, reject) {
        exports.AsyncBuscarSolicitud(data["idSolicitud"], function (solicitudEncontrada, error) {

            if (error) {
                resolve({ type: "EDITAR", data: null, error: error.message})
            }
            if(!solicitudEncontrada){
                resolve({ type: "EDITAR", data: null, error: "Request not found"})
            }

            if(data["status"]=='Pending'){
                solicitudEncontrada.set("status",'Pending')
            }
            if(data["status"]=='Checking'){
                solicitudEncontrada.set("status",'Checking')
            }
            if(data["status"]=='Approved'){
                solicitudEncontrada.set("status",'Approved')
            }
            if(data["status"]=='Rejected'){
                solicitudEncontrada.set("status",'Rejected')
            }

            solicitudEncontrada.save().then((reults)=>{
                resolve({ type: "EDITAR",data: reults, error: null})
            },(error)=>{
                resolve({ type: "EDITAR", data: null, error: error.message})
            })

        })
    })
}