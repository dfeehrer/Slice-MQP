import React from 'react';
import { connect } from 'react-redux';
import SideDrawer from "../SideDrawer";
import NavigationBar from "../NavigationBar";
import MenuList from "./MenuList";
import OrderStatus from "./OrderStatus";
import {db} from '../../Firebase'


class Dashboard extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			menuItems: []
		};
	}

    componentDidMount() {
		let items = [];
        db.collection("menu").get().then((querySnapshot) => {

        	querySnapshot.forEach((doc) => {
                items.push(doc.data());
			});

        	this.setState({menuItems: items});
		});
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
					<SideDrawer/>
					<MenuList
						menuItems={this.state.menuItems}
					/>
				</div>
		);

			/*return (
				<div>
					<NavigationBar/>
					<div className="menu-container">
						<SandwichCard
							title="Original Toasted Cheese"
							img="grilled-cheese.jpg"
							description="Our original claim to fame."
							bread={2}
						/>
						<SandwichCard
							title="The Reynold's Special"
							img="grilled-cheese.jpg"
							description="Open faced"
							bread={1}
						/>
						<SandwichCard
							title="The Turtleboy"
							img="grilled-cheese.jpg"
							description="A local favorite."
							bread={2}
							cheese=""
						/>
					</div>
					<SideDrawer/>
				</div>
			);*/
		}
	}

	render() {
		return this.renderOrderOrStatusPage();
	}
}

export default connect(state => ({ orderId: state.order.orderId, user: state.auth.user}), dispatch => ({

}))(Dashboard);

/*
 <div>
 <NavigationBar/>
 <div className="menu-container">
 <SandwichCard
 title="Original Toasted Cheese"
 img="grilled-cheese.jpg"
 description="Our original claim to fame."
 bread={2}
 />
 <SandwichCard
 title="The Reynold's Special"
 img="grilled-cheese.jpg"
 description="Open faced"
 bread={1}
 />
 <SandwichCard
 title="The Turtleboy"
 img="grilled-cheese.jpg"
 description="A local favorite."
 bread={2}
 cheese=""
 />
 </div>
 <SideDrawer/>
 </div>
*/

