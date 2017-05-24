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

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.init = undefined;


	// ---------- UI CONTROLLER ---------- //


	// +++++ VARIABLES +++++ //
	let counter = 0; // counter for unique ID

	// arrow function to set query selector to variable for DRY (don't repeat yourself) concept
	// !!!!!!!!!!!!!!!!!!!! IMPORTS !!!!!!!!!!!!!!!!!!!! //
	const getEl = el => document.querySelector(el);

	// create map of selectors for easy access
	const selector = new Map([['availBudget', getEl('.budget__value')], ['incBudgetTotal', getEl('.budget__income--value')], ['incBudgetPercentage', getEl('.budget__income--percentage')], ['expBudgetTotal', getEl('.budget__expenses--value')], ['expBudgetPercentage', getEl('.budget__expenses--percentage')], ['fieldType', getEl('.add__type')], ['fieldDesc', getEl('.add__description')], ['fieldVal', getEl('.add__value')], ['ctaGo', getEl('.ion-ios-checkmark-outline')], ['incList', getEl('.income__list')], ['expList', getEl('.expenses__list')]]);

	// +++++ INIT +++++ //
	function init() {
		// set event handlers
		setEvents();

		// get types of budget
		let types = [];
		for (let opt of selector.get('fieldType')) {
			types.push(opt.value);
		}

		// create budget object
		(0, _data.addDataBudget)(types);
	}

	// +++++ SET EVENTS +++++ //
	function setEvents() {
		const handleItemAddition = () => {
			addItem();
		};
		selector.get('fieldType').addEventListener('change', function (e) {
			// update fields to reflect state change
			updateAllFields('', 'stateChange');
			selector.get('fieldDesc').focus();
		});
		getEl('body').addEventListener('click', function (e) {
			switch (e.target.className) {
				case 'ion-ios-checkmark-outline':
					handleItemAddition();
					break;
				case 'ion-ios-close-outline':
					// traverse DOM structure to get parent element
					let parentItem = e.target.parentNode.parentNode.parentNode.parentNode;
					// get item type
					let itemType = parentItem.classList.value.includes('inc') ? 'inc' : 'exp';
					// now remove proper item
					removeItem(itemType, parentItem.id);
					break;
			}
		});
		getEl('.add__container').addEventListener('keypress', function (e) {
			// if user hits enter in this input field
			if (e.charCode == 13) {
				handleItemAddition();
			}
		});
	}

	// +++++ ADD UI ITEM +++++ //
	function addItem() {
		// first check values to make sure a user has entered something
		if (checkValues()) {
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
	function removeItem(itemType, id) {
		// remove item from data structure first, then remove from DOM
		(0, _data.removeDataItem)(itemType, id, function (budget) {
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
	function checkValues() {
		// function to be used in conditional, so set boolean to return
		let allGood = false,
		    klass = 'error';

		// add error classes and set conditional boolean
		selector.forEach(function (value, key) {
			if (key.includes('field')) {
				if (value.value === '' || value.value === undefined || value.value === null) {
					value.classList.add(klass);
					allGood = false;
				} else {
					value.classList.remove(klass);
					allGood = true;
				}
			}
		});

		// set field to focus for better UX
		selector.forEach(function (value, key) {
			if (value.classList.value.includes(klass)) {
				value.focus();
			}
		});

		// return boolean for conditional statement
		return allGood;
	}

	// +++++ UPDATE ALL FIELDS +++++ //
	function updateAllFields(fieldToDiscard, action) {
		selector.forEach(function (value, key, map) {
			if (key.toLowerCase().includes(fieldToDiscard) === false) {
				if (action == 'clear') {
					value.value = '';
					selector.get('fieldType').focus();
				} else if (action == 'stateChange' && key.toLowerCase().includes('field')) {
					value.classList.toggle('red');
				}
			}
		});
	}

	// !!!!!!!!!!!!!!!!!!!! EXPORTS !!!!!!!!!!!!!!!!!!!! //
	exports.init = init;
});