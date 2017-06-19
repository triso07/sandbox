/* --------------- UTILITIES OBJECTS --------------- */
// to be shared across modules
const Utils = {
	formatNumber: function(num) {
		// convert number to decimal places (is now an array object)
		let newNum = Math.abs(num).toFixed(2).split('.');
		// store integer part of array
		let numInt = newNum[0];
		// 1,200 add comma separator if more than 3 places occurs
		numInt = numInt.length > 3 ? numInt.substr(0, numInt.length - 3) + ',' + numInt.substr(numInt.length - 3, 3) : numInt;
		// store decimal part of array
		let numDec = newNum[1];
		// return formatted num
		return `$${numInt}.${numDec}`;
	},
	doMath: function(mathType, num1, num2) {
		return mathType === 'add' ? (num1 + num2) : (num1 - num2);
	}
}


/* ++++++++++ --------------- EXPORTS --------------- ++++++++++ */
export default Utils;


