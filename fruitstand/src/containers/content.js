/* ++++++++++ --------------- IMPORTS --------------- ++++++++++ */
import React from 'react';
import Item from '../components/item.js';
import '../styles/content.css';


/* --------------- CONTENT --------------- */
function Content(props) {
	return (
		<section id="content">
  			<Item items={props.items} handleAddToCart={props.handleAddToCart} />
  		</section>
	);
}


/* ++++++++++ --------------- EXPORTS --------------- ++++++++++ */
export default Content;


