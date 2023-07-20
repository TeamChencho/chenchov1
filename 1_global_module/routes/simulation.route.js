const express = require("express")
const router = express.Router()
const controller = require("../controllers/simulation.controller.js")
const usuarioActual = require("../middlewares/generales/usuario_actual.middleware.js")
const validarPermiso = require("../middlewares/generales/validar_permiso.middleware.js")
const bitacora = require("../middlewares/generales/bitacora.middleware.js")

router.get("/test", controller.test)
router.get("/",
	usuarioActual,
	//validarPermiso.VerificacionPermiso("SUPERADMIN", "simulaciones", "lectura"),
	//bitacora.AddSimulationLog("Consulta vista simulaciones administración"),
	controller.Principal)

router.get("/:simulationId/:teamId",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "lectura"),
	bitacora.AddSimulationLog("Enter the simulation",null,null,null,'Simulation'),
	controller.MainSimulation)

router.get("/:simulationId/:teamId/bom",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "lectura"),
	bitacora.AddSimulationLog("Consult view simulation product Family ",null,null,null,'BOM'),
	controller.BomSimulation)

router.post("/:simulationId/:teamId/bom/guardar",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "edicion"),
	bitacora.AddSimulationLog("Edit simulation product Family ",null,null,null,'BOM'),
	controller.BomSaveSimulation)

router.post("/:simulationId/:teamId/bom/archivar",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "edicion"),
	bitacora.AddSimulationLog("Archive simulation product Family ",null,null,null,'BOM'),
	controller.BomArchivarSimulation)

router.post("/:simulationId/:teamId/bom/explsionRM",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "edicion"),
	bitacora.AddSimulationLog("Update simulation product Family ",null,null,null,'BOM'),
	controller.BomExplosionRMSimulation)

router.get("/:simulationId/:teamId/order_purchasing/data",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "lectura"),
	bitacora.AddSimulationLog("Get all simulation orders purchasing ",null,null,null,'Purchasing'),
	controller.GetAllOrdersPurchasing)
	
router.post("/:simulationId/:teamId/order_purchasing/save",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "edicion"),
	bitacora.AddSimulationLog("Add simulation order purchasing ",null,null,null,'Purchasing'),
	controller.SaveOrderPurchasing)

router.get("/:simulationId/:teamId/purchasing/data_product_family",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "edicion"),
	bitacora.AddSimulationLog("Get the family of products from the simulation",null,null,null,'Purchasing'),
	controller.GetAllProducFamily)
	
router.get("/:simulationId/:teamId/purchasing/raw_material/inventory/data",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "lectura"),
	bitacora.AddSimulationLog("Get all data inventory",null,null,null,'Purchasing'),
	controller.GetAllRawMaterialSimulationInventory)

router.get("/:simulationId/:teamId/finance/fixed_asset_inventary/data",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "lectura"),
	bitacora.AddSimulationLog(" Get fixed asset inventory team simulation ",null,null,null,'Finance'),
	controller.GetFixedAssetInventory)

router.get("/:simulationId/:teamId/finance/fixed_asset/data",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "lectura"),
	bitacora.AddSimulationLog(" Get fixed asset team simulation ",null,null,null,'Finance'),
	controller.GetFixedAsset)

router.post("/:simulationId/:teamId/finance/fixed_asset/save",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "lectura"),
	bitacora.AddSimulationLog(" Save fixed asset team simulation ",null,null,null,'Finance'),
	controller.SaveFixedAsset)

router.post("/:simulationId/:teamId/finance/fixed_asset/sale",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "lectura"),
	bitacora.AddSimulationLog(" Sale fixed asset team simulation ",null,null,null,'Finance'),
	controller.SaleFixedAsset)

router.post("/:simulationId/:teamId/finance/fixed_asset_inventary/to_assign_phase",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "edicion"),
	bitacora.AddSimulationLog(" To assign phase fixed asset team simulation ",null,null,null,'Finance'),
	controller.ToAssignPhase)

router.get("/:simulationId/:teamId/purchasing/data",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "lectura"),
	bitacora.AddSimulationLog("Get all purchasing data",null,null,null,'Purchasing'),
	controller.GetAllPurchasing)

router.post("/:simulationId/:teamId/purchasing/save_default_suppliers_first_entry",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "edicion"),
	bitacora.AddSimulationLog("Save default providers"),
	controller.SaveDefaultSuppliersFirstEntry)

router.post("/:simulationId/:teamId/purchasing/save",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "edicion"),
	bitacora.AddSimulationLog("Update simulation purchasing data",null,null,null,'Purchasing'),
	controller.SavePurchasing)

router.get("/:simulationId/:teamId/sales/data",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "lectura"),
	bitacora.AddSimulationLog("Get all sales data",null,null,null,'Sales'),
	controller.GetAllSales)

router.post("/:simulationId/:teamId/sales/save",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "edicion"),
	bitacora.AddSimulationLog("Save all prices of sales products",null,null,null,'Sales'),
	controller.SaveSales)

router.get("/:simulationId/:teamId/employees/data",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "lectura"),
	bitacora.AddSimulationLog("Get all employees data",null,null,null,'Employees'),
	controller.GetAllEmployees)

router.post("/:simulationId/:teamId/employees/save",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "edicion"),
	bitacora.AddSimulationLog("Add new employees data",null,null,null,'Employees'),
	controller.SaveTDEmployees)

router.post("/:simulationId/:teamId/employees/delete",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "eliminacion"),
	bitacora.AddSimulationLog("Delete employee simulation",null,null,null,'Employees'),
	controller.DeleteTDEmployee)

router.get("/:simulationId/:teamId/employees/shift/data",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "lectura"),
	bitacora.AddSimulationLog("Get All employee no shift simulation",null,null,null,'Employees'),
	controller.GetAllEmployeesNoShift)

router.post("/:simulationId/:teamId/employees/shift/save",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "edicion"),
	bitacora.AddSimulationLog("Save employees shift simulation",null,null,null,'Employees'),
	controller.SaveAllEmployeesShift)

router.post("/:simulationId/:teamId/finanacial_log/search",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "lectura"),
	bitacora.AddSimulationLog("Get Range Financial Log simulation",null,null,null,'Finanacial Log'),
	controller.SearchRangeFinancialLog)
	
router.post("/client_orders/:simulationId/:teamId",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "lectura"),
	bitacora.AddSimulationLog("Consult data of client orders",null,null,null,'Orders'),
	controller.ClientOrders)

router.post("/client_orders_team/:simulationId/:teamId",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "lectura"),
	bitacora.AddSimulationLog("Consult data of client orders team",null,null,null,'Orders'),
	controller.ClientOrdersTeam)

router.post("/client_orders_assign/:simulationId/:teamId/:orderId",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "lectura"),
	bitacora.AddSimulationLog("Assign client order",null,null,null,'Orders'),
	controller.ClientOrdersAssign)

router.get("/:simulationId/:teamId/raw_material/received_orders/data",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "lectura"),
	bitacora.AddSimulationLog("Get all order boxes",null,null,null,'Raw Material'),
	controller.GetAllOrderBoxes)

router.post("/:simulationId/:teamId/raw_material/received_orders/receive",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "edicion"),
	bitacora.AddSimulationLog("Receive order boxe"),
	controller.ReceiveOrders)

router.get("/:simulationId/:teamId/raw_material/inventory/data",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "lectura"),
	bitacora.AddSimulationLog("Get all raw material inventory",null,null,null,'Raw Material'),
	controller.GetAllRawMaterialSimulationInventory)

router.get("/:simulationId/:teamId/production_line_template/data",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "lectura"),
	bitacora.AddSimulationLog("Get all prodcution line templates in simulation",null,null,null,'Production Line'),
	controller.GetAllProductionLineTemplates)

router.post("/:simulationId/:teamId/production_line_template/save",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "edicion"),
	bitacora.AddSimulationLog("Save prodcution line template in simulation",null,null,null,'Production Line'),
	controller.SaveProductionLineTemplates)

router.post("/:simulationId/:teamId/production_line_template/save/efficiency_percentage",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "edicion"),
	bitacora.AddSimulationLog("Save prodcution line template in simulation",null,null,null,'Production Line'),
	controller.saveEfficiencyPercentage)

router.get("/:simulationId/:teamId/production_line_template/template_activated/data",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "lectura"),
	bitacora.AddSimulationLog("Get all prodcution line templates activated in team simulation",null,null,null,'Production Line'),
	controller.GetAllTemplateActivated)

router.post("/:simulationId/:teamId/production_line_template/template_activated/archive",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "lectura"),
	bitacora.AddSimulationLog("Archive prodcution line templates activated in team simulation",null,null,null,'Production Line'),
	controller.ArchiveTemplateActivated)

router.post("/:simulationId/:teamId/production_line_template/data_phase/archive",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "lectura"),
	bitacora.AddSimulationLog("Archive data in phase in team simulation",null,null,null,'Production Line'),
	controller.ArchiveDataPhase)

router.get("/:simulationId/:teamId/events_simulation/data",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "lectura"),
	bitacora.AddSimulationLog("Get all events of team simulation"),
	controller.GetAllEventsToProcess)

router.get("/:simulationId/:teamId/simulation_logs/data",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "lectura"),
	bitacora.AddSimulationLog("Get all data simulation logs of team simulation"),
	controller.GetAllDataSimulationsLogs)

router.get("/:simulationId/:teamId/currency_money/data",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "lectura"),
	bitacora.AddSimulationLog("Get current money of team simulation"),
	controller.GetCurrentMoneyTeam)

router.post("/:simulationId/:teamId/ranking/data",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "lectura"),
	bitacora.AddSimulationLog("Get the ranking of the teams of the simulation",null,null,null,'Ranking'),
	controller.GetSimulationRanking)

router.get("/:simulationId/:teamId/team_activity_log/data",
	usuarioActual,
	validarPermiso.VerificacionPermiso("ALUMNO", "simulaciones", "lectura"),
	bitacora.AddSimulationLog("Get team activity log",null,null,null,'Team Activity Log'),
	controller.GetTeamActivityLog)

module.exports = router