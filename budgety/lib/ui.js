(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(['exports', 'data'], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require('data'));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.data);
		global.ui = mod.exports;
	}
})(this, function (exports, _data) {
	'use strict';

	// !!!!!!!!!!!!!!!!!!!! IMPORTS !!!!!!!!!!!!!!!!!!!! //

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.init = undefined;


	// ---------- UI CONTROLLER ---------- //


	// +++++ VARIABLES +++++ //
	let counter = 0; // counter for unique ID
	let types = []; // array of budget types (income/expense)

	// arrow function to set query selector to variable for DRY (don't repeat yourself) concept
	const getEl = el => document.querySelector(el);

	// create map of selectors for easy access
	const selector = new Map([['users', getEl('.users')], ['stateSelectUser', getEl('.select__user')], ['stateAddUser', getEl('.new__user')], ['fieldSelectUser', getEl('.user__select')], ['ctaNewUser', getEl('.new__user__btn')], ['fieldAddUser', getEl('.user__name')], ['ctaAddUser', getEl('.add__user__btn')], ['availBudget', getEl('.budget__value')], ['incBudgetTotal', getEl('.budget__income--value')], ['incBudgetPercentage', getEl('.budget__income--percentage')], ['expBudgetTotal', getEl('.budget__expenses--value')], ['expBudgetPercentage', getEl('.budget__expenses--percentage')], ['fieldType', getEl('.add__type')], ['fieldDesc', getEl('.add__description')], ['fieldVal', getEl('.add__value')], ['ctaGo', getEl('.ion-ios-checkmark-outline')], ['incList', getEl('.income__list')], ['expList', getEl('.expenses__list')]]);

	// +++++ INIT +++++ //
	function init() {
		// set types of budget (income/expense) to use when creating new user
		for (let opt of selector.get('fieldType')) {
			types.push(opt.value);
		}

		// set event handlers
		setEvents();

		// first clear out display
		clearDisplay();

		// restore users
		restoreUserDisplay();

		// add class for animations
		setTimeout(function () {
			getEl('body').classList.add('ready');
			selector.get('fieldAddUser').focus();
		}, 500);
	}

	// +++++ SET EVENTS +++++ //
	function setEvents() {
		const handleItemAddition = () => {
			addItem();
		};
		selector.get('fieldSelectUser').addEventListener('change', function (e) {
			updateUser(this.value, true);
			selector.get('fieldDesc').focus();
		});
		selector.get('ctaNewUser').addEventListener('click', function (e) {
			updateUserDisplayState('add');
			selector.get('fieldAddUser').focus();
		});
		selector.get('fieldAddUser').addEventListener('keypress', function (e) {
			// if user hits enter in this input field
			if (e.charCode == 13) {
				addUser();selector.get('fieldDesc').focus();
			}
		});
		selector.get('ctaAddUser').addEventListener('click', function (e) {
			addUser();
		});
		selector.get('fieldType').addEventListener('change', function (e) {
			// update fields to reflect state change
			updateAllFields('%%%', 'stateChange');
			selector.get('fieldDesc').focus();
		});
		getEl('body').addEventListener('click', function (e) {
			switch (e.target.className) {
				case 'top':
					selector.get('fieldSelectUser').value !== '' ? updateUserDisplayState('select') : null;
					break;
				case 'ion-ios-checkmark-outline':
					handleItemAddition();
					break;
				case 'ion-ios-close-outline':
					// traverse DOM structure to get parent element
					let parentItem = e.target.parentNode.parentNode.parentNode.parentNode;
					// get item type
					let itemType = parentItem.classList.value.includes('inc') ? 'inc' : 'exp';
					// now get curr user
					let currUser = getValues().user;
					// now remove proper item
					removeItem(currUser, itemType, parentItem.id);
					break;
			}
		});
		getEl('.add__container').addEventListener('keypress', function (e) {
			// if user hits enter in this input field
			if (e.charCode == 13) {
				handleItemAddition();
			}
		});
		window.addEventListener('unload', function (e) {
			(0, _data.storeLocalData)();
			//localStorage.clear();
		});
	}

	// +++++ CLEAR DISPLAY +++++ //
	function clearDisplay() {
		selector.forEach(function (value, key) {
			if (key.includes('Budget')) {
				if (key.includes('Percent')) {
					value.innerHTML = 0 + '%';
				} else {
					value.innerHTML = parseFloat(0).toFixed(2);
				}
			} else if (key.includes('List')) {
				value.innerHTML = '';
			}
		});
	}

	// +++++ RESTORE USER DISPLAY +++++ //
	function restoreUserDisplay() {
		(0, _data.getLocalData)(function (users) {
			let activeUser;
			// if map has items, then localstorage returned data and we need to recreate the UI
			if (users.size > 0) {
				users.forEach((value, key) => {
					addUserDropDownOptions(key);
					if (value.active === true) {
						activeUser = value;
					}
				});
				updateUser(activeUser.name, false);
				updateUserDisplayState('select');
			}
		});
	}

	// +++++ ADD USER +++++ //
	function addUser() {
		if (checkValues('fieldAddUser')) {
			(0, _data.addDataUser)(selector.get('fieldAddUser').value, types, true, function (user) {
				// add user to dropdown
				addUserDropDownOptions(user.name);
				// select active user from dropdown, clear display of current user, display active users data
				updateUser(user.name, false);
				// show user select dropdown
				updateUserDisplayState('select');
			});
		}
	}

	// +++++ ADD SELECT OPTIONS +++++ //
	function addUserDropDownOptions(user) {
		// add user to dropdown
		let opt = document.createElement('option');
		opt.value = user;
		opt.innerHTML = user;
		selector.get('fieldSelectUser').appendChild(opt);
	}

	// +++++ SELECT ACTIVE USER +++++ //
	function selectActiveUserFromDropDown(user) {
		// select newly created user
		for (let opt of selector.get('fieldSelectUser')) {
			opt.value === user ? opt.selected = true : opt.selected = false;
		}
	}

	// +++++ UPDATE USER +++++ //
	function updateUser(newUser, fromDropDown) {
		clearDisplay();
		// if we're coming from user interaction with dropdown, then just setActiveUser in data map, else we're coming from restoreUI because of localstorage so just select active user given in data
		fromDropDown ? (0, _data.setActiveUser)(newUser) : selectActiveUserFromDropDown(newUser);
		(0, _data.getUserBudget)(newUser, function (budget) {
			reCreateItems(budget, function () {
				displayTotals(budget);
			});
		});
	}

	// +++++ UPDATE USER DISPLAY STATE +++++ //
	function updateUserDisplayState(state) {
		switch (state) {
			case 'add':
				selector.get('stateAddUser').classList.add('active');
				selector.get('stateSelectUser').classList.remove('active');
				getEl('body').classList.remove('budgetItemsReady');
				break;
			case 'select':
				selector.get('stateAddUser').classList.remove('active');
				selector.get('stateSelectUser').classList.add('active');
				getEl('body').classList.add('budgetItemsReady');
				selector.get('fieldAddUser').value = '';
				break;
		}
	}

	// +++++ RECREATE ITEMS +++++ //
	function reCreateItems(budget, cb) {
		let domValues = {};
		//console.log(budget);
		budget.types.map(type => {
			for (let items in budget[type]) {
				if (budget[type][items].size > 0) {
					budget[type][items].forEach(function (item, key) {
						domValues = { id: key, type: type, desc: item.desc, val: item.val };
						//console.log(domValues);
						selector.get(`${type}List`).insertAdjacentHTML('beforeend', template(domValues));
					});
				}
			}
		});
		cb(); // displayTotals()
	}

	// +++++ ADD UI ITEM +++++ //
	function addItem() {
		// first check values to make sure a user has entered something
		if (checkValues('fieldType', 'fieldDesc', 'fieldVal')) {
			// increment counter for unique ID
			counter += 1;
			// retrieve and store DOM values in scoped var
			let domValues = getValues();
			// set item type
			let itemType = domValues.type;
			// add values as data to data structure
			(0, _data.addDataItem)(itemType, domValues, function (budget) {
				// now that we've returned, pass DOM field values into HTML template and add it to the DOM
				selector.get(`${itemType}List`).insertAdjacentHTML('beforeend', template(domValues));
				// display totals and percentages
				displayTotals(budget);
				// clear fields
				updateAllFields('type', 'clear');
			});
		}
	}

	// +++++ REMOVE UI ITEM +++++ //
	function removeItem(currUser, itemType, id) {
		// remove item from data structure first, then remove from DOM
		(0, _data.removeDataItem)(currUser, itemType, id, function (budget) {
			// now that we've returned, pass DOM field values into HTML template and add it to the DOM
			getEl(`#${id}`).parentNode.removeChild(getEl(`#${id}`));
			// display totals and percentages
			displayTotals(budget);
		});
	}

	// +++++ DISPLAY TOTALS +++++ //
	function displayTotals(budget) {
		for (let prop in budget) {
			//console.log('-------- property --------');
			//console.log(prop);
			selector.forEach(function (value, key) {
				if (key === prop) {
					selector.get(prop).innerHTML = formatNumber(budget[prop]);
				} else if (key.includes(prop)) {
					//console.log('-------- key --------');
					//console.log(key);
					for (let subProp in budget[prop]) {
						if (key.toLowerCase().includes(subProp)) {
							//console.log('-------- sub prop --------');
							//console.log(subProp);
							let handlePercent = passedProp => key.toLowerCase().includes('percent') ? passedProp + '%' : formatNumber(passedProp, key.includes('inc'));
							selector.get(key).innerHTML = handlePercent(budget[prop][subProp]);
						} else if (budget[prop].items != undefined && budget[prop].items.size > 0) {
							budget[prop].items.forEach(function (value, key) {
								getEl(`#${key} .item__percentage`).innerHTML = value.percentage + '%';
							});
						}
					}
				}
			});
		}
	}

	// +++++ GET VALUES +++++ //
	function getValues() {
		return {
			user: selector.get('fieldSelectUser').value,
			id: selector.get('fieldDesc').value.replace(/[^A-Z0-9]+/ig, "").substring(0, 10).toLowerCase() + counter, // create unique ID
			type: selector.get('fieldType').value,
			desc: selector.get('fieldDesc').value,
			val: parseFloat(selector.get('fieldVal').value)
		};
	}

	// +++++ TEMPLATE +++++ //
	function template(domValues) {
		// using template literals (within backticks ``) to create an HTML template to insert into the DOM
		return `<div class="item clearfix ${domValues.type}" id="${domValues.id}">
            	<div class="item__description">${domValues.desc}</div>
            	<div class="right clearfix">
                	<div class="item__value">${formatNumber(domValues.val, domValues.type === 'inc')}</div>
                	<div class="item__percentage">%</div>
                	<div class="item__delete">
                    	<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                	</div>
            	</div>
        	</div>
    `;
	}

	// +++++ FORMAT NUMBER +++++ //
	function formatNumber(num, condition) {
		// convert number to decimal places (is now an array object)
		let newNum = Math.abs(num).toFixed(2).split('.');
		// store integer part of array
		let numInt = newNum[0];
		// 1,200 add comma separator if more than 3 places occurs
		numInt = numInt.length > 3 ? numInt.substr(0, numInt.length - 3) + ',' + numInt.substr(numInt.length - 3, 3) : numInt;
		// store decimal part of array
		let numDec = newNum[1];
		// handle sign
		let sign = condition == undefined && num > 0 ? '+ ' : condition == undefined && num < 0 ? '- ' : condition ? '+ ' : '- ';
		// return formatted num
		return sign + numInt + '.' + numDec;
	}

	// +++++ CHECK VALUES +++++ //
	function checkValues(...fields) {
		// function to be used in conditional, so set boolean to return
		let allGood = false,
		    klass = 'error';

		// add error classes and set conditional boolean
		fields.map(field => {
			selector.forEach(function (value, key) {
				if (key.includes(field)) {
					if (value.value === '' || value.value === undefined || value.value === null) {
						value.classList.add(klass);
						allGood = false;
					} else {
						value.classList.remove(klass);
						allGood = true;
					}
				}
			});
		});

		// set field to focus for better UX
		for (let [key, value] of selector) {
			if (value.classList.value.includes(klass)) {
				value.focus();
				break;
			}
		}

		// return boolean for conditional statement
		return allGood;
	}

	// +++++ UPDATE ALL FIELDS +++++ //
	function updateAllFields(fieldToDiscard, action) {
		selector.forEach(function (value, key, map) {
			if (!key.toLowerCase().includes(fieldToDiscard) && key.includes('field') && !key.includes('fieldSelectUser')) {
				switch (action) {
					case 'clear':
						value.value = '';
						selector.get('fieldDesc').focus();
						break;
					case 'stateChange':
						value.classList.toggle('red');
						break;
				}
			}
		});
	}

	// !!!!!!!!!!!!!!!!!!!! EXPORTS !!!!!!!!!!!!!!!!!!!! //
	exports.init = init;
});