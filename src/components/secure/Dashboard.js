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

	render() {
		return (
			<div>
				<NavigationBar
				/>
				<SandwichCard/>
				<SandwichCard/>
				<SandwichCard/>
				<SideDrawer/>
				<OrderStatus/>
			</div>
		)
	}

    // render() {
    //     return (
		// 	<div>
		// 		<NavigationBar
		// 		/>
		// 		<OrderStatus/>
		// 	</div>
    //     )
    // }
}

export default connect()(Dashboard);


/*
 <h1>Dashboard</h1>
 Welcome
 <br/>
 <Link to='/profile'>Profile</Link>
 <br/>
 <Link to='/logout'>Logout</Link>
 */