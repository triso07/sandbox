(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(['exports', 'classes'], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require('classes'));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.classes);
		global.data = mod.exports;
	}
})(this, function (exports, _classes) {
	'use strict';

	// !!!!!!!!!!!!!!!!!!!! IMPORTS !!!!!!!!!!!!!!!!!!!! //

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.removeDataItem = exports.addDataItem = exports.addDataUser = exports.getUserBudget = exports.setActiveUser = exports.storeLocalData = exports.getLocalData = undefined;


	// ---------- DATA CONTROLLER ---------- //


	// +++++ VARIABLES +++++ //
	let users = new Map();

	// +++++ GET USER BUDGET +++++ //
	function getUserBudget(newUser, cb) {
		cb(users.get(newUser).budget);
	}

	// +++++ SET ACTIVE USER +++++ //
	function setActiveUser(newUser) {
		users.forEach((value, user) => {
			user === newUser ? value.active = true : value.active = false;
		});
	}

	// +++++ RESTORE USERS +++++ //
	function restoreUsers(cb) {
		// set users map equal to returned map from localstorage
		if (getLocalData() !== null) {
			users = getLocalData();
			cb(users);
		}
	}

	// +++++ ADD DATA USER +++++ //
	function addDataUser(name, types, active, cb) {
		users.set(name, new _classes.User(name, new _classes.Budget(types), active));
		if (cb) {
			cb(users.get(name));
		}
	}

	// +++++ ADD DATA ITEM +++++ //
	function addDataItem(itemType, domValues, cbDisplayChanges) {
		// set current user to correct map item
		let currUser = users.get(domValues.user);
		// store new item in data map
		currUser.budget[itemType].items.set(domValues.id, new _classes.BudgetItem(domValues.desc, domValues.val));
		// calculate totals and percentages
		doCalculataions(currUser.budget, itemType);
		// return to UI with data
		if (cbDisplayChanges) {
			cbDisplayChanges(currUser.budget);
		}
	}

	// +++++ REMOVE DATA ITEM +++++ //
	function removeDataItem(user, itemType, id, cbDisplayChanges) {
		// set current user to correct map item
		let currUser = users.get(user);
		// delete item from data map
		currUser.budget[itemType].items.delete(id);
		// calculate totals and percentages
		doCalculataions(currUser.budget, itemType);
		// return to UI with data
		cbDisplayChanges(currUser.budget);
	}

	// +++++ DO CALCULATIONS +++++ //
	function doCalculataions(budget, itemType) {
		budget[itemType].calculateTotal();
		budget[itemType].calculateItemPercentage();
		budget.calculateTotals();
	}

	// +++++ STRING TO MAP +++++ //
	function stringToMap(localStorageUsers) {
		// parse string from local storate and create outer map (store in users map declared at top of file)
		localStorageUsers = new Map(JSON.parse(localStorageUsers));
		// parse inner items strings and create inner map
		localStorageUsers.forEach((value, key) => {
			value.budget.types.map(type => {
				value.budget[type].items = new Map(JSON.parse(value.budget[type].items));
			});
		});
		// create objects for each user
		localStorageUsers.forEach((currUser, key) => {
			// create user objects
			addDataUser(currUser.name, currUser.budget.types, currUser.active);
			// create income/expense items
			currUser.budget.types.map(type => {
				currUser.budget[type].items.forEach((value, key) => {
					//(itemType, domValues, cbDisplayChanges)
					addDataItem(type, { user: currUser.name, id: key, type: type, desc: value.desc, val: value.val });
				});
			});
		});
	}

	// +++++ STORE LOCAL DATA +++++ //
	function storeLocalData() {
		//window.localStorage.setItem('users', JSON.stringify(users));
		//localStorage.users = JSON.stringify(Array.from(users.entries()));
		// stringify inner map (because multidimensional maps dont work)
		users.forEach((value, key) => {
			value.budget.types.map(type => {
				value.budget[type].items = JSON.stringify(Array.from(value.budget[type].items.entries()));
			});
		});
		// now stringify entire map and save to localstorage key
		localStorage.users = JSON.stringify(Array.from(users.entries()));
	}

	// +++++ GET LOCAL DATA +++++ //
	function getLocalData(cb) {
		//return JSON.parse(window.localStorage.getItem('users'));
		//return localStorage.users !== undefined ? new Map(JSON.parse(localStorage.users)) : null;
		// pull data from localstorage and return it to map form and store it in global var only accessible in this file
		localStorage.users !== undefined ? stringToMap(localStorage.users) : users = new Map();
		// return user data to restoreUserDisplay function
		cb(users);
	}

	// !!!!!!!!!!!!!!!!!!!! EXPORTS !!!!!!!!!!!!!!!!!!!! //
	exports.getLocalData = getLocalData;
	exports.storeLocalData = storeLocalData;
	exports.setActiveUser = setActiveUser;
	exports.getUserBudget = getUserBudget;
	exports.addDataUser = addDataUser;
	exports.addDataItem = addDataItem;
	exports.removeDataItem = removeDataItem;
});