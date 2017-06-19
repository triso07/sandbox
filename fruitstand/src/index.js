/* ++++++++++ --------------- IMPORTS --------------- ++++++++++ */
import React from 'react';
import ReactDOM from 'react-dom';

import Items from './data/store_items.json';
import Header from './containers/header.js';
import Content from './containers/content.js';
import Sidebar from './containers/aside.js';

import './styles/index.css';



/* --------------- CONTAINER --------------- */
class Container extends React.Component {
	constructor() {
		super();
		this.state = {
			itemToAdd: {}
		}
		this.handleAddToCart = this.handleAddToCart.bind(this);
	}
	handleAddToCart(item) {
		console.log('---------- add item ----------');
		console.log(item);
		// need to keep track of quantity in cart so we stop re-rendering the page when we can no longer add an item
		this.setState({
			itemToAdd: item
		});
	}
	render() {
		return (
		  <div id="container">
		    <header id="header">
		      <div className="sizer">
		      	<Header title="Fruits" />
		      </div>
		    </header>
		    <article id="main">
		    	<div className="sizer">
			      <Content items={Items} handleAddToCart={this.handleAddToCart} />
			      <Sidebar itemToAdd={this.state.itemToAdd} />
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


