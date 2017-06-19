/* ++++++++++ --------------- IMPORTS --------------- ++++++++++ */
import React from 'react';
import Utils from '../utils.js';
import CartItem from '../components/cartItem.js';
import '../styles/cart.css';



/* --------------- HELPERS --------------- */
// initial store object properties
function getInitialStore() {
    return {
        cartItems: [],
		totalItems: 0,
		totalPrice: 0
    };
}
// store for cart items (to be passed to state)
let store = getInitialStore();



/* --------------- CART --------------- */
class Cart extends React.Component {
	constructor(props) {
		super(props);
		this.state = getInitialStore();
	}
	componentWillReceiveProps(nextProps) {
		// compare props prevProps and nextProps first before updating state
		//if (this.props.itemToAdd !== nextProps.itemToAdd) {
		this.addToCart(nextProps.itemToAdd);
	}
	addToCart(item) {
		// store item if it doesnt exist and update totals
		if (!store.cartItems.includes(item)) {
			// no matching item in cart exists
			// add properties to item
			item.quantityInCart = 1;
			item.totalItemPrice = item.price;
			// push new item to array
			store.cartItems.push(item);
			// update totals
			this.updateTotalItems(item, 'add');
			this.updateTotalCartPrice('add');
			this.updateState();
		} else {
			// item already exists in cart
			//this.updateTotalCartPrice('add');
			this.incrementQuantity(item);
		}
	}
	removeFromCart(item) {
		console.log('---------- remove item ----------');
		console.log(item);
		// update total items in cart
		this.updateTotalItems(item, 'subtract');
		// remove item from store
		store.cartItems = store.cartItems.filter(currItem => currItem !== item);
		// now that we've removed item re-total prices
		this.updateTotalCartPrice('subtract');
		// and of course update state to trigger render
		this.updateState();
		// log updated store
		console.log(store.cartItems);
	}
	emptyCart() {
		console.log('------- empty cart -------');
		console.log('*** before store reset ***');
		console.log(store);
  		store = getInitialStore();
  		console.log('*** after store reset ***');
  		console.log(store);
  		this.updateState();
	}
	incrementQuantity(item) {
		console.log('------- increment -------');
		if (item.quantityInCart < item.quantityRemaining) {
			item.quantityInCart += 1;
			this.updateTotalItemPrice(item, 'add');
			this.updateTotalCartPrice('add');
			this.updateState();
			console.log(item);
		}
	}
	decrementQuantity(item) {
		console.log('------- decrement -------');
		if (item.quantityInCart === 1) {
			item.quantityInCart -= 1;
			this.removeFromCart(item);
		} else {
			item.quantityInCart -= 1;
			this.updateTotalItemPrice(item, 'subtract');
			this.updateTotalCartPrice('subtract');
		}
		this.updateState();
		console.log(item);
	}
	updateTotalItemPrice(item, mathType) {
		item.totalItemPrice = Utils.doMath(mathType, parseFloat(item.totalItemPrice), parseFloat(item.price));
	}
	updateTotalCartPrice(mathType) {
		let total = 0;
		store.cartItems.map(currItem => total = Utils.doMath(mathType, total, parseFloat(currItem.totalItemPrice)));
		store.totalPrice = total;
	}
	updateTotalItems(item, mathType) {
		store.totalItems = Utils.doMath(mathType, store.totalItems, 1);
	}
	updateState(obj=store) {
		this.setState(obj);
	}
	render() {
		console.log('render');
		console.log(store.cartItems);
		return (
			<div id="cart">
	  			<div id="cart-head">
		  			<h2>Shopping Cart</h2>
		  			<p><span className="cart-quantity">{this.state.totalItems}</span> items</p>
		  		</div>
		  		<div id="cart-body">
		  			{
		  				// loop through cart items and generate template
		  				this.state.cartItems.map(item => <CartItem key={item.itemName} itemToAdd={item} removeItem={this.removeFromCart.bind(this)} incrementQuantity={this.incrementQuantity.bind(this)} decrementQuantity={this.decrementQuantity.bind(this)} />)
		  			}
		  		</div>
		  		<div id="cart-foot">
		  			<div className="cart-total">
		  				<p>Total: <span className="total-value">{Utils.formatNumber(this.state.totalPrice)}</span></p>
		  			</div>
		  			<div className="cart-controls">
		  				<button className="btn text empty" onClick={this.emptyCart.bind(this)}>Empty Cart</button><br />
		  				<button className="btn round type-2 confirm">Confirm Purchase</button>
		  			</div>
		  		</div>
	  		</div>
		);
	}
}



/* ++++++++++ --------------- EXPORTS --------------- ++++++++++ */
export default Cart;


