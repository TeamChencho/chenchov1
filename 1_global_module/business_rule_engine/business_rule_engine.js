let CONSTANTS         = require("../../ConstantsProject")

let HourChangeProcess                       = require('./process_engine/hour_change.process')
let OrderCreationProcess                    = require('./process_engine/order_creation.process')
let OrderDeleteProcess                     = require('./process_engine/order_delete.process')
let SalariesWorkersProcess                  = require('./process_engine/salaries_workers.process')
let SalariesCarriersProcess                 = require('./process_engine/salaries_carriers.process')
let OperativeExpensesProcess                = require('./process_engine/operative_expenses.process')
let DebtsToPayProcess                       = require('./process_engine/debts_to_pay.process')
let AccountsReceivableProcess               = require('./process_engine/accounts_receivable.process')
let AccountingProcess                       = require('./process_engine/accounting.process')
let PleasantCustomersProcess                = require('./process_engine/pleasant_customers.process')
let SupplierQualificationProcess            = require('./process_engine/supplier_qualification.process')
let InventoryProcess                        = require('./process_engine/inventory.process')
let AssignmentOfDeliveriesToCarriersProcess = require('./process_engine/assignment_of_deliveries_to_carriers.process')
let ClientDeliveryProcess                   = require('./process_engine/client_delivery.process')
let ShiftChangeProcess                      = require('./process_engine/shift_change.process')
let DepreciationOfFixedAssetsProcess        = require('./process_engine/depreciation_of_fixed_assets.process')
let TaxCollectionProcess                    = require('./process_engine/tax_collection.process')
let ProbabilityEventsProcess                = require('./process_engine/probability_events.process')
let OrderStatusUpdateProcess                = require('./process_engine/order_status_update.process')



const bitacora        = require("./../middlewares/generales/bitacora.middleware.js")
var moment            = require('moment')
var _                 = require('underscore')
var log               = console.log


//El session_hanlder es para el manejo de las notificaciones en la UI
exports.executeProcessEngine = async function(pendingEvents,session_handler){
	for(var i = 0; i < pendingEvents.length; i++){
		/*log(pendingEvents[i].id + " " + 
            pendingEvents[i].get("index") + " " + 
            pendingEvents[i].get("event") + " " + 
            moment(pendingEvents[i].get("triggerTime")).format("DD/MM/YYYY HH:mm")
            )*/
		log("Previo proceso " + pendingEvents[i].get("simulationPtr").id + " " + pendingEvents[i].get("event"))
		var results = await executeProcess(pendingEvents[i],session_handler)
		//log("After proceso " + pendingEvents[i].get("simulationPtr").id + " " + pendingEvents[i].get("event"))
	}
}

async function executeProcess(event,session_handler){
	switch(event.get("event")){
		case CONSTANTS.HOUR_CHANGE:
			var results = await HourChangeProcess.executeProcess(event,session_handler)
			//if(results) bitacora.AddSimulationLog(CONSTANTS.HOUR_CHANGE,event.get("simulationPtr"),null,null)
		return
		case CONSTANTS.ORDER_CREATION:
			var results = await OrderCreationProcess.executeProcess(event)
			//if(results) bitacora.AddSimulationLog(CONSTANTS.ORDER_CREATION,event.get("simulationPtr"),null,null)
			
			results = await OrderDeleteProcess.executeProcess(event)
			//if(results) bitacora.AddSimulationLog(CONSTANTS.ORDER_CREATION,event.get("simulationPtr"),null,null)
		return
	    case CONSTANTS.SALARIES_WORKERS:
			var results = await SalariesWorkersProcess.executeProcess(event)
			//if(results) bitacora.AddSimulationLog(CONSTANTS.SALARIES_WORKERS,event.get("simulationPtr"),null,null)
	    return
	    case CONSTANTS.SALARIES_CARRIERS: //TODO: FALTA CREAR
	    	var results = await SalariesCarriersProcess.executeProcess(event)
			//if(results) bitacora.AddSimulationLog(CONSTANTS.SALARIES_CARRIERS,event.get("simulationPtr"),null,null)
	    return
	    case CONSTANTS.OPERATIVE_EXPENSES: //TODO: FALTA CREAR
	    	var results = OperativeExpensesProcess.executeProcess(event)
	    	//if(results) bitacora.AddSimulationLog(CONSTANTS.OPERATIVE_EXPENSES,event.get("simulationPtr"),null,null)
	    return
	    case CONSTANTS.DEBTS_TO_PAY: //TODO: FALTA CREAR
	    	var results = DebtsToPayProcess.executeProcess(event)
	    	//if(results) bitacora.AddSimulationLog(CONSTANTS.DEBTS_TO_PAY,event.get("simulationPtr"),null,null)
	    return
	    case CONSTANTS.ACCOUNTS_RECEIVABLE: //TODO: FALTA CREAR
	    	var results = AccountsReceivableProcess.executeProcess(event)
	    	//if(results) bitacora.AddSimulationLog(CONSTANTS.ACCOUNTS_RECEIVABLE,event.get("simulationPtr"),null,null)
	    return
	    case CONSTANTS.ACCOUNTING: //TODO: FALTA CREAR
	    	var results = AccountingProcess.executeProcess(event)
	    	//if(results) bitacora.AddSimulationLog(CONSTANTS.ACCOUNTING,event.get("simulationPtr"),null,null)
	    return
	    case CONSTANTS.PLEASANT_CUSTOMERS: //TODO: FALTA CREAR
	    	var results = PleasantCustomersProcess.executeProcess(event)
	    	//if(results) bitacora.AddSimulationLog(CONSTANTS.PLEASANT_CUSTOMERS,event.get("simulationPtr"),null,null)
	    return
	    case CONSTANTS.SUPPLIER_QUALIFICATION: //TODO: FALTA CREAR
	    	var results = SupplierQualificationProcess.executeProcess(event)
	    	//if(results) bitacora.AddSimulationLog(CONSTANTS.SUPPLIER_QUALIFICATION,event.get("simulationPtr"),null,null)
	    return
	    case CONSTANTS.INVENTORY: //TODO: FALTA CREAR
	    	var results = SupplierQualificationProcess.executeProcess(event)
	    	//if(results) bitacora.AddSimulationLog(CONSTANTS.INVENTORY,event.get("simulationPtr"),null,null)
	    return
	    case CONSTANTS.ASSIGNMENT_OF_DELIVERIES_TO_CARRIERS: //TODO: FALTA CREAR
	    	var results = AssignmentOfDeliveriesToCarriersProcess.executeProcess(event)
	    	//if(results) bitacora.AddSimulationLog(CONSTANTS.ASSIGNMENT_OF_DELIVERIES_TO_CARRIERS,event.get("simulationPtr"),null,null)
	    return
	    case CONSTANTS.CLIENT_DELIVERY: //TODO: FALTA CREAR
	    	var results = ClientDeliveryProcess.executeProcess(event)
	    	//if(results) bitacora.AddSimulationLog(CONSTANTS.CLIENT_DELIVERY,event.get("simulationPtr"),null,null)
	    return
	    case CONSTANTS.SHIFT_CHANGE: //TODO: FALTA CREAR
	    	var results = ShiftChangeProcess.executeProcess(event)
	    	//if(results) bitacora.AddSimulationLog(CONSTANTS.SHIFT_CHANGE,event.get("simulationPtr"),null,null)
	    return
	    case CONSTANTS.DEPRECIATION_OF_FIXED_ASSETS: //TODO: FALTA CREAR
	    	var results = DepreciationOfFixedAssetsProcess.executeProcess(event)
	    	//if(results) bitacora.AddSimulationLog(CONSTANTS.DEPRECIATION_OF_FIXED_ASSETS,event.get("simulationPtr"),null,null)
    	return
	    case CONSTANTS.TAX_COLLECTION: //TODO: FALTA CREAR
	    	var results = TaxCollectionProcess.executeProcess(event)
	    	//if(results) bitacora.AddSimulationLog(CONSTANTS.TAX_COLLECTION,event.get("simulationPtr"),null,null)
    	return
	    case CONSTANTS.PROBABILITY_EVENTS: //TODO: FALTA CREAR
	    	var results = ProbabilityEventsProcess.executeProcess(event)
	    	//if(results) bitacora.AddSimulationLog(CONSTANTS.PROBABILITY_EVENTS,event.get("simulationPtr"),null,null)
    	return
	    case CONSTANTS.ORDER_STATUS_UPDATE:
	    	var results = OrderStatusUpdateProcess.executeProcess(event)
	    	//if(results) bitacora.AddSimulationLog(CONSTANTS.ORDER_STATUS_UPDATE,event.get("simulationPtr"),null,null)
	    return
	    default:
	    	log("Not execute process")
		return
	}
}
