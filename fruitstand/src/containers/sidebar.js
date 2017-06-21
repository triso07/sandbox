/* ++++++++++ --------------- IMPORTS --------------- ++++++++++ */
import React from 'react';
import Cart from '../components/cart.js'
import '../styles/sidebar.css';



/* --------------- SIDEBAR --------------- */
function Sidebar(props) {
	return (
		<aside id="sidebar">
			<Cart itemToAdd={props.itemToAdd} updateGridItems={props.updateGridItems} />
  		</aside>
	);
}



/* ++++++++++ --------------- EXPORTS --------------- ++++++++++ */
export default Sidebar;


