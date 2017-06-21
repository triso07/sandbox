/* ++++++++++ --------------- IMPORTS --------------- ++++++++++ */
import React from 'react';
import ReactDOM from 'react-dom';

import Items from './data/store_items.json';
import Header from './containers/header.js';
import Content from './containers/content.js';
import Sidebar from './containers/sidebar.js';

import './styles/index.css';



/* --------------- CONTAINER --------------- */
class Container extends React.Component {
	constructor() {
		super();
		this.state = {
			items: Items,
			itemToAdd: {}
		}
		this.handleAddToCart = this.handleAddToCart.bind(this);
		this.updateGridItems = this.updateGridItems.bind(this);
	}
	handleAddToCart(item) {
		// passed down to grid items onclick as callback
		//console.log('---------- add item ----------');
		this.setState({
			itemToAdd: Object.assign({}, item) // create instance of this object so as not to mutate actual object data
		});
	}
	updateGridItems(...items) {
		// converting parameters to array using spread operator (done because items pass back may be an array or single object)
		//console.log('--------- update items --------');
		// create instance of items array
		let revisedItems = Object.assign([], this.state.items);
		// if a passed item exists in original items (checking by prop name), recalculate orig items remaining quantity
		items.forEach(passedItem => {
			revisedItems.forEach(revisedItem => {
				revisedItem.itemName === passedItem.itemName ? revisedItem.quantityRemaining -= passedItem.quantityInCart : null;
			});
		});
		// now set state to render
		this.setState({
			items: revisedItems
		});
	}
	render() {
		//console.log('**********------- render all -------**********');
		return (
		  <div id="container">
		    <header id="header">
		      <div className="sizer">
		      	<Header title="Fruits" />
		      </div>
		    </header>
		    <article id="main">
		    	<div className="sizer">
			      <Content items={this.state.items} handleAddToCart={this.handleAddToCart} />
			      <Sidebar itemToAdd={this.state.itemToAdd} updateGridItems={this.updateGridItems} />
			    </div>
		    </article>
		  </div>
		);
	}
}



/* ++++++++++ --------------- REACT DOM RENDER --------------- ++++++++++ */
ReactDOM.render(
	<Container />,
	document.getElementById('root')
);


