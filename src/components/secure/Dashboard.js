import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import SandwichCard from "../SandwichCard";
import SideDrawer from "../SideDrawer";
import NavigationBar from "../NavigationBar";
import MenuList from "./MenuList";

class Dashboard extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
            drawerOpen: false
        };
	}

    handleDrawerToggle() {
		this.setState({
            drawerOpen: !this.state.drawerOpen
        })
	}

	render() {
		return (
			<div>
				<NavigationBar
					drawerOpen={this.state.drawerOpen}
					onDrawerToggle={this.handleDrawerToggle.bind(this)}
				/>
				<SandwichCard/>
				<SandwichCard/>
				<SandwichCard/>
				<SideDrawer/>
			</div>
		)
	}
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