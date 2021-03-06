import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router';
import SandwichCard from "./SandwichCard";
import NavigationBar from "./NavigationBar";
import SideDrawer from "./SideDrawer";

class Home extends React.Component {
	render() {
		return (
			<div>
				<NavigationBar/>
				<SideDrawer/>
				<div className="home-welcome-banner">
				<h1>Welcome to the future of fresh, fast and affordable.</h1>
				</div>
			</div>
		)
	}
}

export default connect()(Home);
