import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import SandwichCard from "../SandwichCard";
import SideDrawer from "../SideDrawer";
import NavigationBar from "../NavigationBar";
import MenuList from "./MenuList";
import OrderStatus from "./OrderStatus";

class Dashboard extends React.Component {

	constructor(props) {
		super(props);
	}

	renderOrderOrStatusPage() {
		if(this.props.orderId) {
			return (
				<div>
					<NavigationBar/>
					<OrderStatus/>
					<SideDrawer/>
				</div>
            );
        } else {
			return (
				<div>
					<NavigationBar/>
					<div className="menu-container">
						<SandwichCard/>
						<SandwichCard/>
						<SandwichCard/>
					</div>
					<SideDrawer/>
				</div>
			);
		}
	}

	render() {
		return this.renderOrderOrStatusPage();
	}
}

export default connect(state => ({ orderId: state.order.orderId, user: state.auth.user}), dispatch => ({

}))(Dashboard);

/*
 <h1>Dashboard</h1>
 Welcome
 <br/>
 <Link to='/profile'>Profile</Link>
 <br/>
 <Link to='/logout'>Logout</Link>
 */