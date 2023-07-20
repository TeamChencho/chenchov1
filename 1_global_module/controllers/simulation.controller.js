let SimulationModel = require("../models/simulation.model")
let CONSTANTS = require("../../ConstantsProject")
var moment = require('moment')
var _ = require('underscore')
var moment = require('moment')

var log = console.log

module.exports.test = async (req, res) => {
    res.status(200).send({ status: "success", message: "Welcome To Testing API" })
}

module.exports.Principal = async (req, res) => {
    var error = req.query.error
    res.render('NovusTec/Simulation/Main/index', {
        title: "Principal",
        description: "",
        content: "Principal",
        error: error
    });
}

module.exports.MainSimulation = async (req, res) => {
    var error = req.query.error
    SimulationModel.SearchTeam(req.params.teamId).then(function (results) {
        var team = null
        if (!results.error && results.data) {
            team = results.data
        }

        //log(team.id)
        //log(team.get("simulationPtr").id)
        res.render('NovusTec/Simulation/1_main/index', {
            CONSTANTS: CONSTANTS,
            title: "Principal",
            description: "",
            content: "Principal",
            error: error,
            team: team,
            simulation: team.get("simulationPtr")
        });
    })
}

module.exports.BomSimulation = async (req, res) => {
    SimulationModel.ObtenerFamiliaProductos(req.params.simulationId, req.params.teamId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data, dataMateriaPrima: results.dataMateriaPrima, dataPurchasing: results.dataPurchasing})
    })
}

module.exports.BomSaveSimulation = async (req, res) => {
    delete req.body.messageLogs
    SimulationModel.BomSaveSimulation(req.body, req.params.simulationId, req.params.teamId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data, dataMateriaPrima: results.dataMateriaPrima, esIgual: results.esIgual })
    })
}

module.exports.BomExplosionRMSimulation = async (req, res) => {
    delete req.body.messageLogs
    SimulationModel.BomExplosionRMSimulation(req.body, req.params.simulationId, req.params.teamId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data })
    })
}

module.exports.BomArchivarSimulation = async (req, res) => {
    delete req.body.messageLogs
    SimulationModel.BomArchivarSimulation(req.body, req.params.simulationId, req.params.teamId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data, dataMateriaPrima: results.dataMateriaPrima })
    })
}

module.exports.ClientOrders = async (req, res) => {
    SimulationModel.GetAllClientOrders(req.params.simulationId,req.params.teamId).then(function (results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data, listPrice:results.listPrice })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

module.exports.ClientOrdersTeam = async (req, res) => {
    SimulationModel.GetAllClientOrdersTeam(req.params.teamId).then(function (results) {
        if (!results.error && results.data) {
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

module.exports.ClientOrdersAssign = async (req, res) => {
    SimulationModel.ClientOrdersAssign(req.params.teamId, req.params.orderId,req.body.revenue).then(function (results) {
        if (!results.error && results.data) {
            log("Resultado ok")
            var data = results.data
            res.status(200).json({ code: 200, msg: "OK", data: data })
        } else {
            res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
    })
}

module.exports.GetAllPurchasing = async (req, res) => {
    SimulationModel.GetAllPurchasing(req.params.simulationId, req.params.teamId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data, dataMateriaPtr: results.dataMateriaPtr, money: results.money })
    })
}

module.exports.SaveDefaultSuppliersFirstEntry = async (req, res) => {
    SimulationModel.SaveDefaultSuppliersFirstEntry(req.body.objectIdSupliersSimualtionTeam, req.params.simulationId, req.params.teamId).then(function (results){
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data,})
    })
}

module.exports.SavePurchasing = async (req, res) => {
    delete req.body.messageLogs
    SimulationModel.SavePurchasing(req.body, req.params.simulationId, req.params.teamId).then(function (results){
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data,})
    })
}

module.exports.GetAllSales = async (req, res) => {
    SimulationModel.GetAllSales( req.params.simulationId, req.params.teamId ).then( function (results){
        if (results.error) {
            return res.status(400).json( { code: 400, msg: "Error", error: results.error } )
        }
        res.status(200).json( { code: 200, msg: "OK", data: results.data} )
    })
}

module.exports.SaveSales = async (req, res) => {
    SimulationModel.SaveSales(req.body, req.params.simulationId, req.params.teamId).then(function (results){
        if(results.error){
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data})
    })
}

module.exports.GetAllOrdersPurchasing = async (req, res) => {
    SimulationModel.GetAllOrdersPurchasing(req.params.simulationId, req.params.teamId).then(function (results){
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data})
    })
}

module.exports.SaveOrderPurchasing = async (req, res) => {
    delete req.body.messageLogs
    //log(req.body)
    SimulationModel.SaveOrderPurchasing(req.body.dataFinancialLog, req.body.totalCost, req.body.json, req.params.simulationId, req.params.teamId).then(function (results){
        if(results.error){
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data, money: results.money, folioNumber: results.numeroFolio})
    })
}

module.exports.GetAllProducFamily = async (req, res) => {
    SimulationModel.GetAllProducFamily(req.params.simulationId, req.params.teamId).then(function (results){
        if(results.error){
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data, folioNumber: results.folioNumber})
    })
}

module.exports.GetFixedAssetInventory = async (req, res) => {
    SimulationModel.GetFixedAssetInventory(req.params.simulationId, req.params.teamId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data, dataPhase: results.dataPhase, dataProductionLine: results.dataProductionLine})
    })
}

module.exports.GetFixedAsset =  async (req, res) => {
    SimulationModel.GetFixedAsset(req.params.simulationId, req.params.teamId).then(function (results){
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data, money: results.money})
    })
}

module.exports.SaveFixedAsset = async (req,res)=> {
    delete req.body.messageLogs
    SimulationModel.SaveFixedAsset(req.body.dataFinancialLog, req.body.totalCost, req.body.json, req.params.simulationId, req.params.teamId).then(function (results){
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data, money: results.money})
    })
}

module.exports.SaleFixedAsset = async (req,res)=> {
    delete req.body.messageLogs
    SimulationModel.SaleFixedAsset(req.body.objectId, req.body.dataFinancialLog, req.params.simulationId, req.params.teamId).then(function (results){
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data, money: results.money})
    })
}

module.exports.ToAssignPhase = async (req,res)=> {
    SimulationModel.ToAssignPhase(req.body, req.params.simulationId, req.params.teamId).then(function (results){
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data, money: results.money})
    })
}

module.exports.GetAllEmployees = async (req, res) => {
    SimulationModel.GetAllEmployees(req.params.simulationId, req.params.teamId).then(function (results){
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data, dataSalary: results.dataSalary, dataPhases: results.dataPhases, dataProductionLine: results.dataProductionLine})
    })
}

module.exports.SaveTDEmployees = async (req, res) => {
    delete req.body.messageLogs
    SimulationModel.SaveTDEmployees(req.body, req.params.simulationId, req.params.teamId).then(function (results){
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data})
    })
}

module.exports.DeleteTDEmployee = async (req, res) => {
    delete req.body.messageLogs
    SimulationModel.DeleteTDEmployee(req.body.objectId, req.params.simulationId, req.params.teamId).then(function (results) {
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data})
    })
}

module.exports.GetAllEmployeesNoShift = async (req, res) => {
    SimulationModel.GetAllEmployeesNoShift(req.params.simulationId, req.params.teamId).then(function (results){
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data, dataUnicos: results.dataUnicos, dataQtyShift: results.dataQtyShift })
    })
}

module.exports.SaveAllEmployeesShift = async (req, res) => {
    delete req.body.messageLogs
    SimulationModel.SaveAllEmployeesShift(req.body, req.params.simulationId, req.params.teamId).then(function (results){
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data})
    })
}

module.exports.SearchRangeFinancialLog = async (req, res) => {
    delete req.body.messageLogs
    SimulationModel.SearchRangeFinancialLog(req.body, req.params.simulationId, req.params.teamId).then(function (results){
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        var dataGraph = CrateJsonGraphFinancialLog(req.body,results)
        res.status(200).json({ code: 200, msg: "OK", data: results.data, dataGraph: dataGraph})
    })
}

function CrateJsonGraphFinancialLog (dataBody, dataResultConsult){
    var start       = Number(dataBody["startDateFinancialLog"])
    var end         = Number(dataBody["endDateFinancialLog"])//moment(Number(req.body["endDateFinancialLog"]))
    var dateTempo   = start
    var dataDate    = dataResultConsult.data
    var xAxis       = []
    var dataIncome  = []
    var dataExpense = []
    var sumaIncome  = 0
    var sumaExpense = 0
    var dataGraph   = []
    var arrayMonts  = []
    var series = []
        //Obtenemos los meses del rango obtener 
    for ( let i = moment(dateTempo).endOf("month"); i <= moment(end).endOf("month"); i.add(1, 'months') ) {
        arrayMonts.push(i.format("MMMM YYYY"))
    }
        //se recorre la consulta obtenida y se verifica que fechas coinciden con los meses del rango obtenido anteriormente
        //y se realiza las sumas de los gastos e ingreso de pendiendo la consulta
    for (let i = 0; i < arrayMonts.length; i++) {
        sumaIncome  = 0
        sumaExpense = 0
       for (let j = 0; j < dataDate.length; j++) {
           var resultDateTempo = moment( Number( dataDate[j].get("simulationDate") ) )
           if( arrayMonts[i] == resultDateTempo.format("MMMM YYYY") ){
               switch (dataDate[j].get("type")) {
                    case "EXPENSE":
                        sumaExpense += parseFloat( dataDate[j].get("amountMoney") )
                       break;
                    case "INCOME":
                        sumaIncome  += parseFloat( dataDate[j].get("amountMoney") )
                        break;
               }
           }
       }
       xAxis.push( arrayMonts[i] )
       dataIncome.push( sumaIncome )
       dataExpense.push( sumaExpense )
    }

        //se crean los objetos de gastos e ingresos 
    var expeses =   {
        name: 'Expense',
        color: '#cc0000',
        data: dataExpense 
    }
    var income =   {
        name: 'Income',
        color: '#8fce00',
        data: dataIncome
    }

        //dependiendo de la consulta se agrega los gastos o ingresos a la variable que será retornada en objeto 
    if( dataBody.type == "EXPENSE" ){
        series.push(expeses)
    }
    if ( dataBody.type == "INCOME" ){
        series.push(income)
    }
    if ( dataBody.type == "ALL" ){
        series.push(expeses)
        series.push(income)
    }

        //Se crea el objeto final con los datos de los meses y gastos o ingreso dependiendo la consulta
    var dataGraph =  {
                    "xAxis"  : xAxis,
                    "series" : series
                }
        //se retorna el objeto terminado
    return dataGraph
}

module.exports.GetAllOrderBoxes = async (req, res) => {
    SimulationModel.GetAllOrderBoxes(req.params.simulationId, req.params.teamId).then(function (results){
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data, folioReceiptNumber: results.folioReceiptNumber})
    })
}

module.exports.ReceiveOrders = async (req, res) => {
    delete req.body.messageLogs
    SimulationModel.ReceiveOrders(req.body, req.params.simulationId, req.params.teamId,req.currentUser).then(function (results){
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data})
    })
}

module.exports.GetAllRawMaterialSimulationInventory = async (req, res) => {
    SimulationModel.GetAllRawMaterialSimulationInventory(req.params.simulationId, req.params.teamId).then(function (results){
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data})
    })
}

module.exports.GetAllProductionLineTemplates = async (req, res) => {
    SimulationModel.GetAllProductionLineTemplates(req.params.simulationId, req.params.teamId).then(function (results){
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data, dataPhases: results.dataPhases, dataEmployees: results.dataEmployees, dataFixedAssets: results.dataFixedAssets} )
    })
}

module.exports.SaveProductionLineTemplates = async (req, res) => {
    delete req.body.messageLogs
    SimulationModel.SaveProductionLineTemplates(req.body, req.params.simulationId, req.params.teamId).then(function (results){
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data, dataPhases: results.dataPhases, dataEmployees: results.dataEmployees, dataFixedAssets: results.dataFixedAssets} )
    })
}

module.exports.saveEfficiencyPercentage = async (req, res) => {
    delete req.body.messageLogs
    log(req.body)
    SimulationModel.saveEfficiencyPercentage(req.body, req.params.simulationId, req.params.teamId).then(function (results){
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data} )
    })
}

module.exports.GetAllTemplateActivated = async (req, res) => {
    SimulationModel.GetAllTemplateActivated(req.params.simulationId, req.params.teamId).then(function (results){
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data} )
    })
}

module.exports.ArchiveDataPhase = async (req, res) => {
    delete req.body.messageLogs
    SimulationModel.ArchiveDataPhase(req.body, req.params.simulationId, req.params.teamId).then(function (results){
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data} )
    })
}

module.exports.ArchiveTemplateActivated = async (req, res) => {
    delete req.body.messageLogs
    SimulationModel.ArchiveTemplateActivated(req.body, req.params.simulationId, req.params.teamId).then(function (results){
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data} )
    })
}

module.exports.GetAllEventsToProcess = async (req, res) => {
    SimulationModel.GetAllEventsToProcess(req.params.simulationId, req.params.teamId).then(function (results){
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data} )
    })
}

module.exports.GetAllDataSimulationsLogs = async (req, res) => {
    SimulationModel.GetAllDataSimulationsLogs(req.params.simulationId, req.params.teamId).then(function (results){
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data, dataTeamLogs: results.dataTeamLogs } )
    })
}

module.exports.GetCurrentMoneyTeam = async (req, res) => {
    SimulationModel.GetCurrentMoneyTeam(req.params.simulationId, req.params.teamId).then(function (results){
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data } )
    })
}

module.exports.GetSimulationRanking = async (req, res) => {
    SimulationModel.GetSimulationRanking(req.params.simulationId, req.params.teamId).then(function (results){
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data } )
    })
}

module.exports.GetTeamActivityLog = async (req, res) => {
    SimulationModel.GetTeamActivityLog(req.params.simulationId, req.params.teamId).then(function (results){
        if (results.error) {
            return res.status(400).json({ code: 400, msg: "Error", error: results.error })
        }
        res.status(200).json({ code: 200, msg: "OK", data: results.data, menuData: results.menuData, userTeamData: results.userTeamData} )
    })
}