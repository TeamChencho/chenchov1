const express = require("express")
const router = express.Router()
const controller = require("../../controllers/administrador/master_data.controller.js")
const usuarioActual = require("../../middlewares/generales/usuario_actual.middleware.js")
const validarPermiso = require("../../middlewares/generales/validar_permiso.middleware.js")
const bitacora = require("../../middlewares/generales/bitacora.middleware.js")

var log = console.log

router.get("/test", controller.test)

router.get("/",
    usuarioActual,
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros", "lectura"),
    bitacora.AnadirBitacora("Consults master data view"),
    controller.MasterDataPrincipal)

router.get("/raw_material/datos",
    usuarioActual,
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros", "lectura"),
    bitacora.AnadirBitacora("Consults raw material list"),
    controller.ObtenerTodaLaMateriaPrima)

router.post("/raw_material/add_raw_material",
    usuarioActual,
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros", "lectura"),
    bitacora.AnadirBitacora("Add raw material in admin"),
    controller.AgregarMateriaPrima)

router.post("/raw_material/import_raw_material",
    usuarioActual,
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros", "edicion"),
    bitacora.AnadirBitacora("Add raw material in bulk from master data"),
    controller.ImportRawMaterial)
    
router.post("/raw_material/edit_raw_material",
    usuarioActual,
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros", "lectura"),
    bitacora.AnadirBitacora("Edit raw material in admin"),
    controller.EditarMateriaPrima)

router.get("/product_family/datos",
    usuarioActual,
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros", "lectura"),
    bitacora.AnadirBitacora("Consults all the products"),
    controller.ObtenerTodosLosProductos)

router.post("/product_family/datos_agregar",
    usuarioActual,
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros", "edicion"),
    bitacora.AnadirBitacora("Add products"),
    controller.AgregarProductoFamilia)

router.post("/product_family/eliminar_producto",
    usuarioActual,
    bitacora.AnadirBitacora("Delete producto from master data"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","eliminacion"),
    controller.EliminarProducto)

router.post("/product_family/archivar_producto",
    usuarioActual,
    bitacora.AnadirBitacora("Archive producto from master data"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","eliminacion"),
    controller.ArchivarProducto)

router.post("/product_family/datos_editar", 
    usuarioActual,
    bitacora.AnadirBitacora("Update product family from master data"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","edicion"),
    controller.ActualizarProducto)

router.post("/product_family/add_videos", 
    usuarioActual,
    bitacora.AnadirBitacora("Add family product video from master data"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","edicion"),
    controller.AddVideoProductoFamily)

router.post("/product_family/delete_video", 
    usuarioActual,
    bitacora.AnadirBitacora("Delete family product video from master data"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","deleted"),
    controller.DeleteVideoProductoFamily)

router.get("/raw_material_inventory/datos",
    usuarioActual,
    //validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros", "lectura"),
    //bitacora.AnadirBitacora("Consults the entire list of raw material inventory"),
    controller.ObtenerTodosElInventario)

router.post("/raw_material_inventory/datos_agregar",
    usuarioActual,
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros", "edicion"),
    bitacora.AnadirBitacora("Update inventory"),
    controller.ActualizarBaseInventario)

router.post("/raw_material_inventory/eliminar_inventario_materia_prima",
    usuarioActual,
    bitacora.AnadirBitacora("Delete inventory from master data"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","eliminacion"),
    controller.EliminarInventarioMateriaPrima)

router.post("/raw_material_inventory/archivar_inventario_materia_prima",
    usuarioActual,
    bitacora.AnadirBitacora("Archive inventory from master data"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","eliminacion"),
    controller.ArchivarInventarioMateriaPrima)

router.post("/raw_material_inventory/datos_editar", 
    usuarioActual,
    bitacora.AnadirBitacora("Update raw material inventory family from master data"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","edicion"),
    controller.ActualizarInventarioMateriaPrima)

router.post("/suppliers/importar_proveedores",
    usuarioActual,
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros", "edicion"),
    bitacora.AnadirBitacora("Add suppliers in bulk from master data"),
    controller.ImportarProveedores)

router.get("/suppliers/datos",
    usuarioActual,
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros", "lectura"),
    bitacora.AnadirBitacora("Consults raw suppliers list"),
    controller.ObtenerTodosLosProveedores)

router.post("/suppliers/eliminar_proveedor",
    usuarioActual,
    bitacora.AnadirBitacora("Delete supplier from master data"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","eliminacion"),
    controller.EliminarProveedor)

router.post("/suppliers/archivar_proveedor",
    usuarioActual,
    bitacora.AnadirBitacora("Archive supplier from master data"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","eliminacion"),
    controller.ArchivarProveedor)

router.post("/suppliers/datos_editar", 
    usuarioActual,
    bitacora.AnadirBitacora("Update supplier from master data"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","edicion"),
    controller.ActualizarProveedor)

router.post("/customers/importar_clientes",
    usuarioActual,
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros", "edicion"),
    bitacora.AnadirBitacora("Add customers in bulk from master data"),
    controller.ImportarClientes)

router.get("/customers/datos",
    usuarioActual,
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros", "lectura"),
    bitacora.AnadirBitacora("Consults raw customers list"),
    controller.ObtenerTodosLosClientes)

router.post("/customers/eliminar_cliente",
    usuarioActual,
    bitacora.AnadirBitacora("Delete customer from master data"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","eliminacion"),
    controller.EliminarCliente)

router.post("/customers/archivar_cliente",
    usuarioActual,
    bitacora.AnadirBitacora("Archive customer from master data"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","eliminacion"),
    controller.ArchivarCliente)

router.post("/customers/datos_editar", 
    usuarioActual,
    bitacora.AnadirBitacora("Update customer from master data"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","edicion"),
    controller.ActualizarCliente)

router.post("/employees/importar_empleados",
    usuarioActual,
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros", "edicion"),
    bitacora.AnadirBitacora("Add employees in bulk from master data"),
    controller.ImportarEmpleados)

router.get("/employees/datos",
    usuarioActual,
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros", "lectura"),
    bitacora.AnadirBitacora("Consults raw employees list"),
    controller.ObtenerTodosLosEmpleados)

router.post("/employees/eliminar_empleado",
    usuarioActual,
    bitacora.AnadirBitacora("Delete employee from master data"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","eliminacion"),
    controller.EliminarEmpledo)

router.post("/employees/archivar_empleado",
    usuarioActual,
    bitacora.AnadirBitacora("Archive employee from master data"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","eliminacion"),
    controller.ArchivarEmpleado)

router.post("/employees/datos_editar", 
    usuarioActual,
    bitacora.AnadirBitacora("Update employee from master data"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","edicion"),
    controller.ActualizarEmpleado)

router.post("/expenses/importar_gastos",
    usuarioActual,
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros", "edicion"),
    bitacora.AnadirBitacora("Add expenses in bulk from master data"),
    controller.ImportarGastos)

router.get("/expenses/datos",
    usuarioActual,
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros", "lectura"),
    bitacora.AnadirBitacora("Consults raw expenses list"),
    controller.ObtenerTodosLosGastos)

router.post("/expenses/eliminar_gasto",
    usuarioActual,
    bitacora.AnadirBitacora("Delete expense from master data"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","eliminacion"),
    controller.EliminarGasto)

router.post("/expenses/archivar_gasto",
    usuarioActual,
    bitacora.AnadirBitacora("Archive expense from master data"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","eliminacion"),
    controller.ArchivarGasto)

router.post("/expenses/datos_editar", 
    usuarioActual,
    bitacora.AnadirBitacora("Update expense from master data"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","edicion"),
    controller.ActualizarGasto)

router.post("/fix_assets/importar_activos_fijos",
    usuarioActual,
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros", "edicion"),
    bitacora.AnadirBitacora("Add fix assets in bulk from master data"),
    controller.ImportarActivosFijos)

router.get("/fix_assets/datos",
    usuarioActual,
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros", "lectura"),
    bitacora.AnadirBitacora("Consults raw fix assets list"),
    controller.ObtenerTodosLosActivosFijos)

router.post("/fix_assets/eliminar_activo_fijo",
    usuarioActual,
    bitacora.AnadirBitacora("Delete fix asset from master data"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","eliminacion"),
    controller.EliminarActivoFijo)

router.post("/fix_assets/archivar_activo_fijo",
    usuarioActual,
    bitacora.AnadirBitacora("Archive fix asset from master data"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","eliminacion"),
    controller.ArchivarActivoFijo)

router.post("/fix_assets/datos_editar", 
    usuarioActual,
    bitacora.AnadirBitacora("Update fix asset from master data"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","edicion"),
    controller.ActualizarActivoFijo)

router.post("/fix_assets_inventary/datos_agregar",
    usuarioActual,
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros", "edicion"),
    bitacora.AnadirBitacora("Update fix assets inventary"),
    controller.ActualizarInventarioActivosFijos)

router.get("/fix_assets_inventary/datos",
    usuarioActual,
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros", "lectura"),
    bitacora.AnadirBitacora("Consults the entire list of fix assets inventary"),
    controller.ObtenerTodoElInventarioActivosFijo)

router.post("/fix_assets_inventary/datos_editar", 
    usuarioActual,
    bitacora.AnadirBitacora("Update fix asset inventary from master data"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","edicion"),
    controller.ActualizarInventarioActivosFijo)

router.get("/order_history/datos",
    usuarioActual,
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMestros", "lectura"),
    bitacora.AnadirBitacora("Consults order history list"),
    controller.ObtenerHistoricoOrdenes)

router.post("/order_history/datos_agregar",
    usuarioActual,
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMestros", "edicion"),
    bitacora.AnadirBitacora("Add order history element"),
    controller.AgregarHistoricoOrdenes)

router.get("/suppliers_raw_material/datos",
    usuarioActual,
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros", "lectura"),
    bitacora.AnadirBitacora("Consults suppliers raw material list"),
    controller.ObtenerTodaLosProvedoresMateriaPrima)

router.post("/suppliers_raw_material/datos_agregar",
    usuarioActual,
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros", "edicion"),
    bitacora.AnadirBitacora("Add supplier raw material"),
    controller.AgregarProvedoreMateriaPrima)

router.post("/suppliers_raw_material/eliminar_proveedor_materia_prima",
    usuarioActual,
    bitacora.AnadirBitacora("Delete supplier raw material from master data"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","eliminacion"),
    controller.EliminarProvedoreMateriaPrima)

router.post("/suppliers_raw_material/archivar_proveedor_materia_prima",
    usuarioActual,
    bitacora.AnadirBitacora("Archive supplier raw material from master data"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","eliminacion"),
    controller.ArchivarProvedoreMateriaPrima)

router.post("/suppliers_raw_material/datos_editar", 
    usuarioActual,
    bitacora.AnadirBitacora("Update supplier raw material from master data"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","edicion"),
    controller.ActualizarProvedoreMateriaPrima)

router.post("/suppliers_raw_material/importar_gastos",
    usuarioActual,
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros", "edicion"),
    bitacora.AnadirBitacora("Add supplier raw material in bulk from master data"),
    controller.ImportarProveedoresMateriasPrimas)

router.get("/countries/datos",
    usuarioActual,
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros", "lectura"),
    bitacora.AnadirBitacora("Consults the entire list of fix countries"),
    controller.ObtenerTodosLosPaises)

router.post("/transport/datos_agregar",
    usuarioActual,
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros", "edicion"),
    bitacora.AnadirBitacora("Add transport"),
    controller.AgregarTransporte)

router.get("/transport/datos",
    usuarioActual,
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros", "lectura"),
    bitacora.AnadirBitacora("Consults the entire list of transport"),
    controller.ObtenertodosLosTransportes)

router.post("/transport/eliminar_transporte",
    usuarioActual,
    bitacora.AnadirBitacora("Delete transport from master data"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","eliminacion"),
    controller.EliminarTransporte)

router.post("/transport/archivar_transporte",
    usuarioActual,
    bitacora.AnadirBitacora("Archive transport from master data"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","eliminacion"),
    controller.ArchivarTransporte)

router.post("/transport/datos_editar", 
    usuarioActual,
    bitacora.AnadirBitacora("Update transport from master data"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","edicion"),
    controller.ActualizarTransporte)

router.get("/salary_tabulator/data", 
    usuarioActual,
    bitacora.AnadirBitacora("Get All master data salary tabulator"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","lectura"),
    controller.GetAllSalaryTabulator)

router.post("/salary_tabulator/update", 
    usuarioActual,
    bitacora.AnadirBitacora("Update master data salary tabulator"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","edicion"),
    controller.UpdateSalaryTabulator)

router.get("/production_line/phases/data", 
    usuarioActual,
    bitacora.AnadirBitacora("Get all master data production line phases"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","lectura"),
    controller.GetProductionLinePhases)

router.post("/production_line/phases/save", 
    usuarioActual,
    bitacora.AnadirBitacora("Save master data production line phase"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","edicion"),
    controller.SaveProductionLinePhases)

router.post("/production_line/phases/archive", 
    usuarioActual,
    bitacora.AnadirBitacora("Archive master data production line phase"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","eliminacion"),
    controller.ArchiveProductionLinePhase)

router.post("/production_line/phases/delete", 
    usuarioActual,
    bitacora.AnadirBitacora("Delete master data production line phase"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","eliminacion"),
    controller.DeleteProductionLinePhase)

router.post("/production_line/phases/edit", 
    usuarioActual,
    bitacora.AnadirBitacora("Edit master data production line phase"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","edicion"),
    controller.EditProductionLinePhase)

router.get("/production_line/templates/data", 
    usuarioActual,
    bitacora.AnadirBitacora("Get all master data production line templates"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","lectura"),
    controller.GetAllProdcutionLineTemplates)

router.post("/production_line/templates/save", 
    usuarioActual,
    bitacora.AnadirBitacora("Save master data production line template"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","edicion"),
    controller.SaveProductionLineTemplate)

router.post("/production_line/templates/archive", 
    usuarioActual,
    bitacora.AnadirBitacora("Archive master data production line template"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","eliminacion"),
    controller.ArchiveProductionLineTemplate)

router.post("/production_line/templates/delete", 
    usuarioActual,
    bitacora.AnadirBitacora("Delete master data production line template"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","eliminacion"),
    controller.DeleteProductionLineTemplate)

router.post("/production_line/templates/edit", 
    usuarioActual,
    bitacora.AnadirBitacora("Edit master data production line template"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","edicion"),
    controller.EditProductionLineTemplate)

router.get("/employees/restart", 
    usuarioActual,
    //bitacora.AnadirBitacora("Edit master data production line template"),
    validarPermiso.VerificacionPermiso("SUPERADMIN", "datosMaestros","edicion"),
    controller.restartEmployees)

/*router.get("/datos_permisos", controller.ObtenerPermisosAdministrador)

router.post("/datos_agregar", controller.AgregarUsuarioAdministracion)

router.post("/datos_editar", controller.EditarUsuarioAdministracion)

router.post("/datos_archivar", controller.ArchivarUsuarioAdministracion)
 
router.post("/datos_eliminar", controller.EliminarUsuarioAdministracion)*/

module.exports = router