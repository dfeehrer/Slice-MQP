import React from 'react';
import { connect } from 'react-redux';
import {fire, db} from '../../Firebase'
import {clearOrderId} from "../../actions/order";

class OrderStatus extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			status: 'waiting'
		};
	}

	componentDidMount() {
        db.collection('queue').doc(this.props.orderId)
            .onSnapshot((doc) => {
                console.log("updated status: ", doc.data());
                this.setState({status: doc.data().status});
            });
	}

	renderCurrentStatus() {
		if(this.state.status === 'complete') {
			return (
				<div className="order-status">
					<div className="status-item complete">
						<div className="status-item-title">
							<img className="status-icon" src="done.svg"/>
							<h2>Ready for pickup! </h2>
							<a onClick={this.props.onOrderComplete.bind(this)}>Done.</a>
						</div>
					</div>
				</div>
			);
		} else {
			return (
				<div className="order-status">
					<div className={"status-item waiting " + ((this.state.status === 'waiting' ||  this.state.status === 'sent') ? 'active' : "")}>
						<div className="status-item-title">
							<img className="status-icon" src="waiting.svg"/>
							<h2>Waiting...</h2>
						</div>
					</div>
					<div className={"status-item assembling " + (this.state.status === 'assembling' ? 'active' : "")}>
						<div className="status-item-title">
							<img className="status-icon" src="assembling.svg"/>
							<h2>Assembling...</h2>
						</div>
					</div>
					<div className={"status-item toasting " + (this.state.status === 'toasting' ? 'active' : "")}>
						<div className="status-item-title">
							<img className="status-icon" src="toasting.svg"/>
							<h2>Toasting to perfection...</h2>
						</div>
					</div>
				</div>
			);
		}
	}

	render() {
		return this.renderCurrentStatus();
	}
}

export default connect(state => ({ orderId: state.order.orderId}), dispatch => ({
	onOrderComplete() {
		dispatch(clearOrderId());
	}
}))(OrderStatus);