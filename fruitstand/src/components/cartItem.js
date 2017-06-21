/* ++++++++++ --------------- IMPORTS --------------- ++++++++++ */
import React from 'react';
import Utils from '../utils.js';
import '../styles/cartItem.css';
import '../styles/buttons.css';



/* --------------- CART ITEM --------------- */
function CartItem(props) {
	const item = props.itemToAdd;
	return (
		<div className="cart-item" id={`cart-item-${item.itemName.toLowerCase()}`}>
			<div className="group">
  				<span className="cart-item-icon">
  					<img src={`images/fruit/${item.imgSrc}`} alt={item.itemName} />
  				</span>
  				<span className="cart-item-quantity">
  					<button className="btn icon remove" title="Remove one" onClick={props.decrementQuantity.bind(this, item)}>-</button>
  					<span className="quantity-value">{item.quantityInCart}</span>
  					<button className="btn icon add" title="Add another" onClick={props.incrementQuantity.bind(this, item)}>+</button>
  				</span>
  			</div>
  			<div className="group">
  				<span className="cart-item-values">
  					@ <span className="item-price">{Utils.formatNumber(item.price)}</span> <span className="clump">each = <span className="item-total">{Utils.formatNumber(item.totalItemPrice)}</span></span>
  				</span>
  				<span className="cart-item-cta">
  					<button className="btn text delete" onClick={props.removeItem.bind(this, item)}>Delete</button>
  				</span>
  			</div>
		</div>
	);
}



/* ++++++++++ --------------- EXPORTS --------------- ++++++++++ */
export default CartItem;

