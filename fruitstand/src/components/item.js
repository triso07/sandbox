/* ++++++++++ --------------- IMPORTS --------------- ++++++++++ */
import React from 'react';
import objUtils from '../utils.js';
import '../styles/item.css';
import '../styles/buttons.css';



// +++++ TEMPLATE +++++ //
function Template(props) {
	const item = props.itemData;
	const stockType = item.quantityRemaining > 0 ? 'in-stock' : 'out-of-stock';
	return (
		<div className={`item ${stockType}`} id={`item-${item.itemName.toLowerCase()}`}>
			<div className="item-picture">
				<img src={`images/fruit/${item.imgSrc}`} alt={item.itemName} />
			</div>
			<div className="item-details">
				<div className="item-name">
					<h3>{item.itemName}</h3>
				</div>
				<div className="item-info">
					<span className="item-price">{objUtils.formatNumber(item.price)}</span>
					<span className="item-quantity"><span className="quantity-value">{item.quantityRemaining}</span> in stock</span>
				</div>
			</div>
			<div className="item-ctas">
				<button className="btn round type-1 addtocart" onClick={props.onClick}>Add to Cart</button>
			</div>
		</div>
	);
}



/* --------------- ITEM --------------- */
function Item(props) {
	return (
		<div className="items">
			{props.items.map(currItem => <Template key={currItem.itemName} itemData={currItem} onClick={props.handleAddToCart.bind(this, currItem)} />)}
		</div>
	);
}



/* ++++++++++ --------------- EXPORTS --------------- ++++++++++ */
export default Item;


