const express = require("express")
const router = express.Router()
const controller = require("../../controllers/advisers/simulations.controller.js")
const usuarioActual = require("../../middlewares/generales/usuario_actual.middleware.js")
const validarPermiso = require("../../middlewares/generales/validar_permiso.middleware.js")
const bitacora = require("../../middlewares/generales/bitacora.middleware.js")

var log = console.log

router.get("/test", controller.test)

router.get("/",
	usuarioActual,
	validarPermiso.VerificacionPermiso("MODERADOR","simulaciones","lectura"),
	bitacora.AnadirBitacora("View of simulations"),
	controller.SimulationsPrincipal)

router.get("/data",
	usuarioActual,
	validarPermiso.VerificacionPermiso("MODERADOR","simulaciones","lectura"),
	bitacora.AnadirBitacora("Query list of simulations"),
	controller.GetAllSimulations)

router.get("/datos_groups",
	usuarioActual,
	validarPermiso.VerificacionPermiso("MODERADOR","grupos","lectura"),
	bitacora.AnadirBitacora("CQuery list of groups"),
	controller.GetAllGroupsAdviser
	)

router.post("/add_simulation",
	usuarioActual,
	validarPermiso.VerificacionPermiso("MODERADOR","simulaciones","edicion"),
	bitacora.AnadirBitacora("Adding simulation"),
	controller.AddingSimulation)

router.get("/get_employes",
	usuarioActual,
	validarPermiso.VerificacionPermiso("MODERADOR","simulaciones","edicion"),
	bitacora.AnadirBitacora("Get employees in simulation"),
	controller.GetEmployees)

router.post("/data_archive",
	usuarioActual,
	validarPermiso.VerificacionPermiso("MODERADOR","simulaciones","eliminacion"),
	bitacora.AnadirBitacora("Archiving simulation"),
	controller.ArchiveSimulation)
 
router.post("/data_erase",
	usuarioActual,
	validarPermiso.VerificacionPermiso("MODERADOR","simulaciones","eliminacion"),
	bitacora.AnadirBitacora("Erasing simulation"),
	controller.EraseSimulation)

router.get("/detail_simulation/:objectId",
	usuarioActual,
	validarPermiso.VerificacionPermiso("MODERADOR","simulaciones","lectura"),
	bitacora.AnadirBitacora("View of detail simulation"),
	controller.DetailSimulation)

router.post("/update_simulation_settings/:objectId",
	usuarioActual,
	validarPermiso.VerificacionPermiso("MODERADOR","simulaciones","edicion"),
	bitacora.AnadirBitacora("Update simulation settings"),
	controller.UpdateSimulationSettings)

router.get("/data_students_group/:objectId",
	usuarioActual,
	validarPermiso.VerificacionPermiso("MODERADOR","alumnos","lectura"),
	bitacora.AnadirBitacora("Query list of students in group"),
	controller.GetAllStudentsInGroup)

router.post("/add_team/:simulationId",
	usuarioActual,
	validarPermiso.VerificacionPermiso("MODERADOR","simulaciones","edicion"),
	bitacora.AnadirBitacora("Adding team to simulation"),
	controller.AddingSimulationTeam)

router.get("/data_teams_simulation/:simulationId",
	usuarioActual,
	validarPermiso.VerificacionPermiso("MODERADOR","simulaciones","lectura"),
	bitacora.AnadirBitacora("Query list of teams in simulation"),
	controller.GetAllTeamsInSimulation)

router.post("/data_team_archive",
	usuarioActual,
	validarPermiso.VerificacionPermiso("MODERADOR","simulaciones","eliminacion"),
	bitacora.AnadirBitacora("Archiving team simulation"),
	controller.ArchiveSimulationTeam)
 
router.post("/data_team_erase",
	usuarioActual,
	validarPermiso.VerificacionPermiso("MODERADOR","simulaciones","eliminacion"),
	bitacora.AnadirBitacora("Erasing team simulation"),
	controller.EraseSimulationTeam)

router.post("/data_team_members",
	usuarioActual,
	validarPermiso.VerificacionPermiso("MODERADOR","simulaciones","lectura"),
	bitacora.AnadirBitacora("Query list of teams members in simulation team"),
	controller.GetAllTeamsMembersInSimulationTeam)

router.post("/data_member_erase",
	usuarioActual,
	validarPermiso.VerificacionPermiso("MODERADOR","simulaciones","lectura"),
	bitacora.AnadirBitacora("Delete member of a team in the simulation"),
	controller.DeleteMemberTeam)

router.post("/data_member_upadate_team",
	usuarioActual,
	validarPermiso.VerificacionPermiso("MODERADOR","simulaciones","lectura"),
	bitacora.AnadirBitacora("Add member of a team in the simulation"),
	controller.AddMembersUpdateTeam)
 
// Data master data routes
router.get("/master_data/raw_material/data",
	usuarioActual,
	validarPermiso.VerificacionPermiso("MODERADOR","simulaciones","lectura"),
	bitacora.AnadirBitacora("Query raw materials list"),
	controller.GetRawMaterials)

router.get("/master_data/product_family/datos/:simulationId",
    usuarioActual,
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones", "lectura"),
    bitacora.AnadirBitacora("Consults all the products"),
    controller.GetAllProducts)

router.post("/master_data/product_family/datos_agregar/:simulationId",
    usuarioActual,
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones", "edicion"),
    bitacora.AnadirBitacora("Add products"),
    controller.AddProductFamily)

router.post("/master_data/product_family/eliminar_producto",
    usuarioActual,
    bitacora.AnadirBitacora("Delete producto from master data"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","eliminacion"),
    controller.DeleteProductFamily)

router.post("/master_data/product_family/archivar_producto",
    usuarioActual,
    bitacora.AnadirBitacora("Archive producto from master data"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","eliminacion"),
    controller.ArchiveProductFamily)

router.post("/master_data/product_family/update_all_data/:simulationId",
    usuarioActual,
    bitacora.AnadirBitacora("Archive producto from master data"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","eliminacion"),
    controller.ArchiveVariousDataProductFamily)

router.post("/master_data/product_family/datos_editar", 
    usuarioActual,
    bitacora.AnadirBitacora("Update product family from master data"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","edicion"),
    controller.UpdateProductFamily)

router.post("/master_data/product_family/add_videos/:objectId", 
    usuarioActual,
    bitacora.AnadirBitacora("Add family product video from master data"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","edicion"),
    controller.AddVideoProductoFamily)

router.post("/master_data/product_family/delete_video/:objectId", 
    usuarioActual,
    bitacora.AnadirBitacora("Delete family product video from master data simulation"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","deleted"),
    controller.DeleteVideoProductoFamily)

router.post("/master_data/customers/importar_clientes/:simulationId",
    usuarioActual,
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones", "edicion"),
    bitacora.AnadirBitacora("Add customers in bulk from master data"),
    controller.ImportClients)

router.get("/master_data/customers/datos/:simulationId",
    usuarioActual,
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones", "lectura"),
    bitacora.AnadirBitacora("Consults raw customers list"),
    controller.GetAllClients)

router.post("/master_data/customers/eliminar_cliente",
    usuarioActual,
    bitacora.AnadirBitacora("Delete customer from master data"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","eliminacion"),
    controller.DeleteClient)

router.post("/master_data/customers/archivar_cliente",
    usuarioActual,
    bitacora.AnadirBitacora("Archive customer from master data"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","eliminacion"),
    controller.ArchiveClient)

router.post("/master_data/customers/datos_editar", 
    usuarioActual,
    bitacora.AnadirBitacora("Update customer from master data"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","edicion"),
    controller.UpdateClient)

router.post("/master_data/suppliers/importar_proveedores/:simulationId",
    usuarioActual,
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones", "edicion"),
    bitacora.AnadirBitacora("Add suppliers in bulk from master data"),
    controller.ImportSuppliers)

router.get("/master_data/suppliers/datos/:simulationId",
    usuarioActual,
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones", "lectura"),
    bitacora.AnadirBitacora("Consults raw suppliers list"),
    controller.GetAllSuppliers)

router.post("/master_data/suppliers/eliminar_proveedor",
    usuarioActual,
    bitacora.AnadirBitacora("Delete supplier from master data"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","eliminacion"),
    controller.DeleteSuppliers)

router.post("/master_data/suppliers/archivar_proveedor",
    usuarioActual,
    bitacora.AnadirBitacora("Archive supplier from master data"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","eliminacion"),
    controller.ArchveSuppliers)

router.post("/master_data/suppliers/datos_editar", 
    usuarioActual,
    bitacora.AnadirBitacora("Update supplier from master data"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","edicion"),
    controller.UpdateSuppliers)

router.post("/master_data/employees/importar_empleados/:simulationId",
    usuarioActual,
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones", "edicion"),
    bitacora.AnadirBitacora("Add employees in bulk from master data"),
    controller.ImportEmployees)

router.get("/master_data/employees/datos/:simulationId",
    usuarioActual,
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones", "lectura"),
    bitacora.AnadirBitacora("Consults raw employees list"),
    controller.GetAllEmployee)

router.post("/master_data/employees/eliminar_empleado",
    usuarioActual,
    bitacora.AnadirBitacora("Delete employee from master data"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","eliminacion"),
    controller.DeleteEmployee)

router.post("/master_data/employees/archivar_empleado",
    usuarioActual,
    bitacora.AnadirBitacora("Archive employee from master data"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","eliminacion"),
    controller.ArchiveEmployee)

router.post("/master_data/employees/datos_editar", 
    usuarioActual,
    bitacora.AnadirBitacora("Update employee from master data"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","edicion"),
    controller.UnpdateEmployee)

router.post("/master_data/expenses/importar_gastos/:simulationId",
    usuarioActual,
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones", "edicion"),
    bitacora.AnadirBitacora("Add expenses in bulk from master data"),
    controller.IportExpenses)

router.get("/master_data/expenses/datos/:simulationId",
    usuarioActual,
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones", "lectura"),
    bitacora.AnadirBitacora("Consults raw expenses list"),
    controller.GetAllExpenses)

router.post("/master_data/expenses/eliminar_gasto",
    usuarioActual,
    bitacora.AnadirBitacora("Delete expense from master data"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","eliminacion"),
    controller.DeleteExpense)

router.post("/master_data/expenses/archivar_gasto",
    usuarioActual,
    bitacora.AnadirBitacora("Archive expense from master data"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","eliminacion"),
    controller.ArchiveExpense)

router.post("/master_data/expenses/datos_editar", 
    usuarioActual,
    bitacora.AnadirBitacora("Update expense from master data"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","edicion"),
    controller.UpdateExpense)

router.post("/master_data/fix_assets/importar_activos_fijos/:simulationId",
    usuarioActual,
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones", "edicion"),
    bitacora.AnadirBitacora("Add fix assets in bulk from master data"),
    controller.ImportFixAssets)

router.get("/master_data/fix_assets/datos/:simulationId",
    usuarioActual,
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones", "lectura"),
    bitacora.AnadirBitacora("Consults raw fix assets list"),
    controller.GetAllFixAssets)

router.post("/master_data/fix_assets/eliminar_activo_fijo",
    usuarioActual,
    bitacora.AnadirBitacora("Delete fix asset from master data"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","eliminacion"),
    controller.DeleteFixAsset)

router.post("/master_data/fix_assets/archivar_activo_fijo",
    usuarioActual,
    bitacora.AnadirBitacora("Archive fix asset from master data"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","eliminacion"),
    controller.ArchiveFixAsset)

router.post("/master_data/fix_assets/datos_editar", 
    usuarioActual,
    bitacora.AnadirBitacora("Update fix asset from master data"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","edicion"),
    controller.UpdateFixAsset)

router.get("/master_data/countries/datos",
    usuarioActual,
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones", "lectura"),
    bitacora.AnadirBitacora("Consults the entire list of fix countries"),
    controller.GetAllCountries)

router.post("/master_data/transport/datos_agregar/:simulationId",
    usuarioActual,
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones", "edicion"),
    bitacora.AnadirBitacora("Add transport"),
    controller.AddTransport)

router.get("/master_data/transport/datos/:simulationId",
    usuarioActual,
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones", "lectura"),
    bitacora.AnadirBitacora("Consults the entire list of transport"),
    controller.GetAllTransports)

router.post("/master_data/transport/eliminar_transporte",
    usuarioActual,
    bitacora.AnadirBitacora("Delete transport from master data"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","eliminacion"),
    controller.DeleteTransport)

router.post("/master_data/transport/archivar_transporte",
    usuarioActual,
    bitacora.AnadirBitacora("Archive transport from master data"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","eliminacion"),
    controller.ArchiveTranspor)

router.post("/master_data/transport/datos_editar", 
    usuarioActual,
    bitacora.AnadirBitacora("Update transport from master data"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","edicion"),
    controller.UpdateTranspor)

router.get("/master_data/raw_material_inventory/datos/:simulationId",
    usuarioActual,
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones", "lectura"),
    bitacora.AnadirBitacora("Consults the entire list of raw material inventory"),
    controller.GetAllRawMaterialsInventory)

router.post("/master_data/raw_material_inventory/datos_agregar/:simulationId",
    usuarioActual,
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones", "edicion"),
    bitacora.AnadirBitacora("Update inventory"),
    controller.UpdateInventoryBase)

router.post("/master_data/raw_material_inventory/eliminar_inventario_materia_prima",
    usuarioActual,
    bitacora.AnadirBitacora("Delete inventory from master data"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","eliminacion"),
    controller.DeleteRawMaterialInventory)

router.post("/master_data/raw_material_inventory/archivar_inventario_materia_prima",
    usuarioActual,
    bitacora.AnadirBitacora("Archive inventory from master data"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","eliminacion"),
    controller.ArchiveRawMaterialInventory)

router.post("/master_data/raw_material_inventory/datos_editar", 
    usuarioActual,
    bitacora.AnadirBitacora("Update raw material inventory family from master data"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","edicion"),
    controller.UpdateRawMaterialInventory)

router.post("/master_data/fix_assets_inventary/datos_agregar/:simulationId",
    usuarioActual,
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones", "edicion"),
    bitacora.AnadirBitacora("Update fix assets inventary"),
    controller.UpdateInventoryFixedAssets)

router.get("/master_data/fix_assets_inventary/datos/:simulationId",
    usuarioActual,
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones", "lectura"),
    bitacora.AnadirBitacora("Consults the entire list of fix assets inventary"),
    controller.GetAllInventoryFixedAssets)

router.post("/master_data/fix_assets_inventary/datos_editar", 
    usuarioActual,
    bitacora.AnadirBitacora("Update fix asset inventary from master data"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","edicion"),
    controller.UpdateFixedAssetsInventory)

router.get("/master_data/suppliers_raw_material/datos/:simulationId",
    usuarioActual,
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones", "lectura"),
    bitacora.AnadirBitacora("Consults suppliers raw material list"),
    controller.GetAllSuppliersAndRawMaterials)

router.post("/master_data/suppliers_raw_material/datos_agregar/:simulationId",
    usuarioActual,
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones", "edicion"),
    bitacora.AnadirBitacora("Add supplier raw material"),
    controller.AddSupplierAndRawMaterial)

router.post("/master_data/suppliers_raw_material/eliminar_proveedor_materia_prima",
    usuarioActual,
    bitacora.AnadirBitacora("Delete supplier raw material from master data"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","eliminacion"),
    controller.DeleteSupplierAndRawMaterial)

router.post("/master_data/suppliers_raw_material/archivar_proveedor_materia_prima",
    usuarioActual,
    bitacora.AnadirBitacora("Archive supplier raw material from master data"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","eliminacion"),
    controller.ArchiveSupplierAndRawMaterial)

router.post("/master_data/suppliers_raw_material/datos_editar", 
    usuarioActual,
    bitacora.AnadirBitacora("Update supplier raw material from master data"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","edicion"),
    controller.UpdateSupplierAndRawMaterial)

router.post("/master_data/suppliers_raw_material/importar_proveedores_materia_prima/:simulationId",
    usuarioActual,
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones", "edicion"),
    bitacora.AnadirBitacora("Add supplier raw material in bulk from master data"),
    controller.ImportSuppliersAndRawMaterials)

router.get("/data_teams_simulation/score/:simulationId",
    usuarioActual,
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones", "lectura"),
    bitacora.AnadirBitacora("Query list teams simulation"),
    controller.GetAllTeamsInSimulationLivequery)

router.get("/salary_tabulator/data/:simulationId", 
    usuarioActual,
    bitacora.AnadirBitacora("Get All master data salary tabulator"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","lectura"),
    controller.GetAllSalaryTabulator)

router.post("/salary_tabulator/update/:simulationId", 
    usuarioActual,
    bitacora.AnadirBitacora("Update master data salary tabulator"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","edicion"),
    controller.UpdateSalaryTabulator)

//------- trabajando----

router.get("/master_data/production_line/phases/data/:simulationId", 
    usuarioActual,
    bitacora.AnadirBitacora("Get all master data production line phases"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","lectura"),
    controller.GetProductionLinePhases)

router.post("/master_data/production_line/phases/save/:simulationId", 
    usuarioActual,
    bitacora.AnadirBitacora("Save master data production line phase"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","edicion"),
    controller.SaveProductionLinePhases)

router.post("/master_data/production_line/phases/archive/:simulationId", 
    usuarioActual,
    bitacora.AnadirBitacora("Archive master data production line phase"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","eliminacion"),
    controller.ArchiveProductionLinePhase)

router.post("/master_data/production_line/phases/delete/:simulationId", 
    usuarioActual,
    bitacora.AnadirBitacora("Delete master data production line phase"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","eliminacion"),
    controller.DeleteProductionLinePhase)

router.post("/master_data/production_line/phases/edit/:simulationId", 
    usuarioActual,
    bitacora.AnadirBitacora("Edit master data production line phase"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","edicion"),
    controller.EditProductionLinePhase)

router.get("/master_data/production_line/templates/data/:simulationId", 
    usuarioActual,
    bitacora.AnadirBitacora("Get all master data production line templates"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","lectura"),
    controller.GetAllProdcutionLineTemplates)

router.post("/master_data/production_line/templates/save/:simulationId", 
    usuarioActual,
    bitacora.AnadirBitacora("Save master data production line template"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","edicion"),
    controller.SaveProductionLineTemplate)

router.post("/master_data/production_line/templates/archive/:simulationId", 
    usuarioActual,
    bitacora.AnadirBitacora("Archive master data production line template"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","eliminacion"),
    controller.ArchiveProductionLineTemplate)

router.post("/master_data/production_line/templates/delete/:simulationId", 
    usuarioActual,
    bitacora.AnadirBitacora("Delete master data production line template"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","eliminacion"),
    controller.DeleteProductionLineTemplate)

router.post("/master_data/production_line/templates/edit/:simulationId", 
    usuarioActual,
    bitacora.AnadirBitacora("Edit master data production line template"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","edicion"),
    controller.EditProductionLineTemplate)

router.post("/master_data/customers/update_all_data/:simulationId", 
    usuarioActual,
    bitacora.AnadirBitacora("Update customers from master data"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","edicion"),
    controller.UpdateVariousDataClient)

router.post("/master_data/suppliers/update_all_data/:simulationId", 
    usuarioActual,
    bitacora.AnadirBitacora("Update suppliers from master data"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","edicion"),
    controller.UpdateVariousDataSuppliers)

router.post("/master_data/employees/update_all_data/:simulationId", 
    usuarioActual,
    bitacora.AnadirBitacora("Update employees from master data"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","edicion"),
    controller.UpdateVariousDataEmployees)

router.post("/master_data/expenses/update_all_data/:simulationId", 
    usuarioActual,
    bitacora.AnadirBitacora("Update expenses from master data"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","edicion"),
    controller.UpdateVariousDataExpenses)

router.post("/master_data/fixed_assets/update_all_data/:simulationId", 
    usuarioActual,
    bitacora.AnadirBitacora("Update fixed assets from master data"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","edicion"),
    controller.UpdateVariousDataFixedAssets)

router.post("/master_data/transport/update_all_data/:simulationId", 
    usuarioActual,
    bitacora.AnadirBitacora("Update transports from master data"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","edicion"),
    controller.UpdateVariousDataTransports)

router.post("/master_data/raw_materia_inv/update_all_data/:simulationId", 
    usuarioActual,
    bitacora.AnadirBitacora("Update raw material inventory from master data"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","edicion"),
    controller.UpdateVariousDataRawmaterialInv)

router.post("/master_data/fixe_assets_inv/update_all_data/:simulationId", 
    usuarioActual,
    bitacora.AnadirBitacora("Update fixe assets inventory from master data"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","edicion"),
    controller.UpdateVariousDataFixAssetsInv)

router.post("/master_data/supplier_raw_material/update_all_data/:simulationId", 
    usuarioActual,
    bitacora.AnadirBitacora("Update suppliers raw material from master data"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","edicion"),
    controller.UpdateVariousDataSuppliersRawMaterial)

//--------

router.post("/master_data/salary_tabulator/update_all_data/:simulationId", 
    usuarioActual,
    bitacora.AnadirBitacora("Update salaries tabulator from master data"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","edicion"),
    controller.UpdateVariousDataSalaryTabulator)

router.post("/master_data/production_line/phases/update_all_data/:simulationId", 
    usuarioActual,
    bitacora.AnadirBitacora("Update production line phases from master data"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","edicion"),
    controller.UpdateVariousProductionLinePhases)
    
router.post("/master_data/production_line/templates/update_all_data/:simulationId", 
    usuarioActual,
    bitacora.AnadirBitacora("Update production line templates from master data"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","edicion"),
    controller.UpdateVariousProductionLineTemplates)

router.post("/simulations/pause", 
    usuarioActual,
    bitacora.AnadirBitacora("Pause or run the simulation"),
    validarPermiso.VerificacionPermiso("MODERADOR", "simulaciones","edicion"),
    controller.PauseOrRunSimulation)

router.get("/employees/restart/:simulationId", 
    usuarioActual,
    //bitacora.AnadirBitacora("Edit master data production line template"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","edicion"),
    controller.restartEmployees)

router.post("/salary/restart/:simulationId", 
    usuarioActual,
    //bitacora.AnadirBitacora("Edit master data production line template"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","edicion"),
    controller.restartSDMSalary)

module.exports = router