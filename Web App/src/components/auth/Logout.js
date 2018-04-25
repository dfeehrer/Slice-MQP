import React  from 'react';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import {logout} from "../../actions/auth";


class Logout extends React.Component {
	componentDidMount() {
		firebase.auth().signOut();
		this.props.logout();
		this.props.onRedirect('/');
	}

	render() {
		return null;
	}
}

export default connect(null, dispatch => ({
	logout: () => {
        dispatch(logout());

    },
	onRedirect: (path) => {
		dispatch(push(path));
	}
}))(Logout);
