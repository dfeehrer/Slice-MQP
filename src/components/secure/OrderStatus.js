import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import SandwichCard from "../SandwichCard";
import SideDrawer from "../SideDrawer";
import NavigationBar from "../NavigationBar";
import MenuList from "./MenuList";

class OrderStatus extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="order-status">
				<div className="status-item waiting active">
					<div className="status-item-title">
						<img className="status-icon" src="toasting.gif"/>
						<h2>Waiting...</h2>
					</div>
				</div>
				<div className="status-item assembling active">
					<div className="status-item-title">
						<img className="status-icon" src="toasting.gif"/>
						<h2>Assembling...</h2>
					</div>
				</div>
				<div className="status-item toasting">
					<div className="status-item-title">
						<img className="status-icon" src="toasting.gif"/>
						<h2>Toasting to perfection...</h2>
					</div>
				</div>
			</div>
		)
	}
}

export default connect()(OrderStatus);


/*
 <h1>Dashboard</h1>
 Welcome
 <br/>
 <Link to='/profile'>Profile</Link>
 <br/>
 <Link to='/logout'>Logout</Link>
 */