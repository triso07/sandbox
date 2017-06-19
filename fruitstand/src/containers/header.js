/* ++++++++++ --------------- IMPORTS --------------- ++++++++++ */
import React from 'react';
import '../styles/header.css';


/* --------------- HEADER --------------- */
function Header(props) {	
	return (
		<h1>{props.title}</h1>
	);
}


/* ++++++++++ --------------- EXPORTS --------------- ++++++++++ */
export default Header;


