// ---------- CLASSES ---------- //
class Budget {
	constructor(types) {
		this.types = types;
		this.addTypes();
		this.availBudget = 0;
	}
	addTypes() {
		// use map function to loop through array and create new type objects based on select option values
		this.types.map(type => this[type] = new BudgetType());
	}
	calculateBudget() {
		this.availBudget = this.inc.total - this.exp.total;
	}
	calculateTotals() {
		this.calculateBudget();
		let total = 0,
			props = [];
		for (let prop in this) {
			this.types.map((type, index) => {
				if (type === prop) {
					total += this[prop].total;
					props.push(prop);
				}
			});
		}
		props.map(prop => this[prop].percentage = calculatePercentage(this[prop].total, total));
	}
}
class BudgetType {
	constructor() {
		this.items = new Map();
		this.total = 0;
		this.percentage = 0;
	}
	calculateTotal() {
		this.total = 0;
		this.items.forEach((item, key) => {
			this.total += item.val;
		});
	}
	calculateItemPercentage() {
		this.items.forEach((item, key) => {
			item.percentage = calculatePercentage(item.val, this.total);
		});
	}
}
class BudgetItem {
	constructor(desc, val) {
		this.desc = desc;
		this.val = val;
		this.percentage = 0;
	}
}
function calculatePercentage(x, y) {
	const formula = Math.round((x / y) * 100);
	return isNaN(formula) ? 0 : formula;
}



// ---------- DATA CONTROLLER ---------- //
// should remain completely decoupled from UI so we can always create a new UI and reuse this module
// using the module pattern - IIFE (immediately invoked function expression) in combination with closure (inner function having access to outer function scope) to protect data and only expose what we desire publically)
const ctrlData = (function() {
	// +++++ SCOPED VARIABLES +++++ //
	let budget = {};

	// +++++ PRIVATE METHODS +++++ //
	this.addBudget = (types) => {
		// create new budget object and pass types taken from select dropdown
		budget = new Budget(types);
	};
	this.addItem = (itemType, domValues, cbDisplayChanges) => {
		// store new item in data map
		budget[itemType].items.set(domValues.id, new BudgetItem(domValues.desc, domValues.val));
		// calculate totals and percentages
		this.doCalculataions(itemType);
		// return to UI with data
		cbDisplayChanges(budget);
	};
	this.removeItem = (itemType, id, cbDisplayChanges) => {
		// delete item from data map
		budget[itemType].items.delete(id);
		// calculate totals and percentages
		this.doCalculataions(itemType);
		// return to UI with data
		cbDisplayChanges(budget);
	};
	this.doCalculataions = (itemType) => {
		budget[itemType].calculateTotal();
		budget[itemType].calculateItemPercentage();
		budget.calculateTotals();
	};

	// +++++ PUBLIC METHODS +++++ //
	return {
		addBudget: addBudget,
		addItem: addItem,
		removeItem: removeItem
	}
})();



// ---------- UI CONTROLLER ---------- //
const ctrlUI = (function(data) {
	// +++++ SCOPED VARIABLES +++++ //
	let counter = 0; // counter for unique ID
	// arrow function to set query selector to variable for DRY (don't repeat yourself) concept
	const getEl = (el) => document.querySelector(el);
	// create map of selectors for easy access
	const selector = new Map([
		['availBudget', getEl('.budget__value')],
		['incBudgetTotal', getEl('.budget__income--value')],
		['incBudgetPercentage', getEl('.budget__income--percentage')],
		['expBudgetTotal', getEl('.budget__expenses--value')],
		['expBudgetPercentage', getEl('.budget__expenses--percentage')],
		['fieldType', getEl('.add__type')],
		['fieldDesc', getEl('.add__description')],
		['fieldVal', getEl('.add__value')],
		['ctaGo', getEl('.ion-ios-checkmark-outline')],
		['incList', getEl('.income__list')],
		['expList', getEl('.expenses__list')]
	]);

	// +++++ PRIVATE METHODS +++++ //
	this.init = () => {
		// set event handlers
		this.setEvents();

		// get types of budget
		let types = [];
		for (let opt of selector.get('fieldType')) {
			types.push(opt.value);
		}

		// create budget object
		data.addBudget(types);
	};
	this.setEvents = () => {
		const handleItemAddition = () => {
			this.addItem();
		}
		selector.get('fieldType').addEventListener('change', function(e) {
			// update fields to reflect state change
			updateAllFields('', 'stateChange');
			selector.get('fieldDesc').focus();
		});
		getEl('body').addEventListener('click', function(e) {
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
		getEl('.add__container').addEventListener('keypress', function(e) {
			// if user hits enter in this input field
			if (e.charCode == 13) {
				handleItemAddition();
			}
		});
	};
	this.addItem = () => {
		// first check values to make sure a user has entered something
		if (this.checkValues()) {
			// increment counter for unique ID
			counter += 1;
			// retrieve and store DOM values in scoped var
			let domValues = this.getValues();
			// set item type
			let itemType = domValues.type;
			// add values as data to data structure
			data.addItem(itemType, domValues, function(budget) {
				// now that we've returned, pass DOM field values into HTML template and add it to the DOM
				selector.get(`${itemType}List`).insertAdjacentHTML('beforeend', this.template(domValues));
				// display totals and percentages
				this.displayTotals(budget);
				// clear fields
				updateAllFields('type', 'clear');
			});
		}
	};
	let removeItem = (itemType, id) => {
		// remove item from data structure first, then remove from DOM
		data.removeItem(itemType, id, function(budget) {
			// now that we've returned, pass DOM field values into HTML template and add it to the DOM
			getEl(`#${id}`).parentNode.removeChild(getEl(`#${id}`));
			// display totals and percentages
			this.displayTotals(budget);
		});
	};
	this.displayTotals = (budget) => {
		for (let prop in budget) {
			//console.log('-------- property --------');
			//console.log(prop);
			selector.forEach(function(value, key) {
				if (key === prop) {
					selector.get(prop).innerHTML = this.formatNumber(budget[prop]);
				} else if (key.includes(prop)) {
					//console.log('-------- key --------');
					//console.log(key);
					for (let subProp in budget[prop]) {
						if (key.toLowerCase().includes(subProp)) {
							//console.log('-------- sub prop --------');
							//console.log(subProp);
							let handlePercent = (passedProp) => key.toLowerCase().includes('percent') ? passedProp + '%' : this.formatNumber(passedProp, key.includes('inc'));
							selector.get(key).innerHTML = handlePercent(budget[prop][subProp]);
						} else if ((budget[prop].items != undefined) && (budget[prop].items.size > 0)) {
							budget[prop].items.forEach(function(value, key){
								getEl(`#${key} .item__percentage`).innerHTML = value.percentage + '%';
							});
						}
					}
				}
			});
		}
	};
	this.getValues = () => {
		return {
			id: selector.get('fieldDesc').value.replace(/[^A-Z0-9]+/ig, "").substring(0, 10).toLowerCase() + counter, // create unique ID
			type: selector.get('fieldType').value,
			desc: selector.get('fieldDesc').value,
			val: parseFloat(selector.get('fieldVal').value)
		};
	};
	this.template = (domValues) => {
		// using template literals (within backticks ``) to create an HTML template to insert into the DOM
		return `<div class="item clearfix ${domValues.type}" id="${domValues.id}">
                	<div class="item__description">${domValues.desc}</div>
                	<div class="right clearfix">
                    	<div class="item__value">${this.formatNumber(domValues.val, domValues.type === 'inc')}</div>
                    	<div class="item__percentage">%</div>
                    	<div class="item__delete">
                        	<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    	</div>
                	</div>
            	</div>
        `;
	};
	this.formatNumber = (num, condition) => {
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
	};
	this.checkValues = () => {
		// function to be used in conditional, so set boolean to return
		let allGood = false,
			klass = 'error';

		// add error classes and set conditional boolean
		selector.forEach(function(value, key) {
			if (key.includes('field')) {
				if ((value.value === '') || (value.value === undefined) || (value.value === null)) {
					value.classList.add(klass);
					allGood = false;
				} else {
					value.classList.remove(klass);
					allGood = true;
				}
			}
		});

		// set field to focus for better UX
		selector.forEach(function(value, key) {
			if (value.classList.value.includes(klass)) {
				value.focus();
			}
		});

		// return boolean for conditional statement
		return allGood;
	};
	let updateAllFields = (fieldToDiscard, action) => {
		selector.forEach(function(value, key, map) {
			if (key.toLowerCase().includes(fieldToDiscard) === false) {
				if (action == 'clear') {
					value.value = '';
					selector.get('fieldType').focus();
				} else if ((action == 'stateChange') && (key.toLowerCase().includes('field'))) {
					value.classList.toggle('red');
				}
			}
		});
	};

	// +++++ PUBLIC METHODS +++++ //
	return {
		init: init
	}
})(ctrlData);



// !!!!!!!!!! +++++++++++++++++++++++ INIT APP +++++++++++++++++++++++ !!!!!!!!!! //
ctrlUI.init();


