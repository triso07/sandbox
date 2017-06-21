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
		//console.log('------- comp will receive props -------');
		if (this.props.itemToAdd !== nextProps.itemToAdd) {
			this.addToCart(nextProps.itemToAdd);
		}
	}
	addToCart(item) {
		// set later when we know which item to use 
		let properItem;

		// item argument passed here is an instance of an object so as to remain immutable, check to see if an object with a similar property already exists in our cart before going any further
		const found = store.cartItems.some(currItem => currItem.itemName === item.itemName);

		// handle things based on returned boolean
		if (found) { 
			// if similar item exists in cart, grab the cart item and pass it along, not the argument item (cart properties get dynamically added to cart items, but not original data)
			store.cartItems.map(currItem => currItem.itemName === item.itemName ? properItem = currItem : null);
			// item already exists in cart
			this.incrementQuantity(properItem);
		} else {
			// set proper item
			properItem = item;
			// no matching item in cart exists
			this.handleNewItem(properItem);
		}
	}
	handleNewItem(item) {
		// add cart specific properties
		//console.log('------- new item -------');
		item.quantityInCart = 1;
		item.totalItemPrice = item.price;
		// push new item to array
		store.cartItems.push(item);
		// update totals
		this.updateTotalItems(item, 'add');
		this.updateTotalCartPrice('add');
		// now update state to render
		this.updateCartState();
	}
	removeFromCart(item) {
		//console.log('---------- remove item ----------');
		// update total items in cart
		this.updateTotalItems(item, 'subtract');
		// zero out cart props
		item.quantityInCart = 0;
		item.totalItemPrice = 0;
		// remove item from store
		store.cartItems = store.cartItems.filter(currItem => currItem !== item);
		// now that we've removed item re-total prices
		this.updateTotalCartPrice('subtract');
		// and of course update state to trigger render
		this.updateCartState();
	}
	emptyCart() {
		//console.log('------- empty cart -------');
  		store = getInitialStore();
  		this.updateCartState();
	}
	confirmPurchase() {
		this.props.updateGridItems(...store.cartItems); // pass in cart items as individual objects instead of array using spread operator (done because we may want to pass a single object or array of objects)
		this.emptyCart();
	}
	incrementQuantity(item) {
		//console.log('------- increment -------');		
		if (item.quantityInCart < item.quantityRemaining) {
			// update quantity and totals, the set state to render
			item.quantityInCart += 1;
			this.updateTotalItemPrice(item, 'add');
			this.updateTotalCartPrice('add');
			this.updateCartState();
			// if quantities are equal, fire callback to update grid items in index.js
			//item.quantityInCart === item.quantityRemaining ? this.props.updateGridItems(item) : null;
		}
	}
	decrementQuantity(item) {
		//console.log('------- decrement -------');
		// if quantities are equal, fire callback to update grid items in index.js
		//item.quantityInCart === item.quantityRemaining ? this.props.updateGridItems(item) : null;
		// handle remove and decrement
		if (item.quantityInCart === 1) {
			// all items remove, update quantity and remove from cart
			item.quantityInCart -= 1;
			this.removeFromCart(item);
		} else {
			// decrement quantity and update totals
			item.quantityInCart -= 1;
			this.updateTotalItemPrice(item, 'subtract');
			this.updateTotalCartPrice('subtract');
		}
		// now that we've retotaled, update cart state to render
		this.updateCartState();
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
	updateCartState(obj=store) {
		this.setState(obj);
	}
	render() {
		//console.log('**********------- render cart -------**********');
		return (
			<div id="cart">
	  			<div id="cart-head">
		  			<h2>Shopping Cart</h2>
		  			<p><span className="cart-quantity">{this.state.totalItems}</span> items</p>
		  		</div>
		  		<div id="cart-body">
		  			{this.state.cartItems.map(item => <CartItem key={item.itemName} itemToAdd={item} removeItem={this.removeFromCart.bind(this)} incrementQuantity={this.incrementQuantity.bind(this)} decrementQuantity={this.decrementQuantity.bind(this)} />)}
		  		</div>
		  		<div id="cart-foot">
		  			<div className="cart-total">
		  				<p>Total: <span className="total-value">{Utils.formatNumber(this.state.totalPrice)}</span></p>
		  			</div>
		  			<div className="cart-controls">
		  				<button className="btn text empty" onClick={this.emptyCart.bind(this)}>Empty Cart</button><br />
		  				<button className="btn round type-2 confirm" onClick={this.confirmPurchase.bind(this)}>Confirm Purchase</button>
		  			</div>
		  		</div>
	  		</div>
		);
	}
}



/* ++++++++++ --------------- EXPORTS --------------- ++++++++++ */
export default Cart;


