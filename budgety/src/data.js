// !!!!!!!!!!!!!!!!!!!! IMPORTS !!!!!!!!!!!!!!!!!!!! //
import { Budget, BudgetItem } from 'classes'; 



// ---------- DATA CONTROLLER ---------- //


// +++++ VARIABLES +++++ //
let budget = {};


// +++++ ADD DATA BUDGET +++++ //
function addDataBudget(types) {
	// create new budget object and pass types taken from select dropdown
	budget = new Budget(types);
}


// +++++ ADD DATA ITEM +++++ //
function addDataItem(itemType, domValues, cbDisplayChanges) {
	// store new item in data map
	budget[itemType].items.set(domValues.id, new BudgetItem(domValues.desc, domValues.val));
	// calculate totals and percentages
	doCalculataions(itemType);
	// return to UI with data
	cbDisplayChanges(budget);
}


// +++++ REMOVE DATA ITEM +++++ //
function removeDataItem(itemType, id, cbDisplayChanges) {
	// delete item from data map
	budget[itemType].items.delete(id);
	// calculate totals and percentages
	doCalculataions(itemType);
	// return to UI with data
	cbDisplayChanges(budget);
}


// +++++ DO CALCULATIONS +++++ //
function doCalculataions(itemType) {
	budget[itemType].calculateTotal();
	budget[itemType].calculateItemPercentage();
	budget.calculateTotals();
}



// !!!!!!!!!!!!!!!!!!!! EXPORTS !!!!!!!!!!!!!!!!!!!! //
export { addDataBudget, addDataItem, removeDataItem }; 


