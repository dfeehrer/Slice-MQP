import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import {Link} from "react-router";
import {IconButton} from "material-ui";

import {NavigationClose} from "material-ui/svg-icons/index";
import {connect} from "react-redux";
import {closeDrawer} from "../actions/drawer";

class SideDrawer extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Drawer open={this.props.open}>
                    <IconButton onClick={this.props.onCloseClick.bind(this)}>
                        <NavigationClose/>
                    </IconButton>

                    {this.props.user ?
                        <MenuItem containerElement={<Link to="/logout"/>} onClick={this.props.onCloseClick.bind(this)}>Logout</MenuItem>
                            :
                        <div>
                            <MenuItem containerElement={<Link to="/login"/>} onClick={this.props.onCloseClick.bind(this)}>Login</MenuItem>
                            <MenuItem containerElement={<Link to="/register"/>} onClick={this.props.onCloseClick.bind(this)}>Register</MenuItem>
                        </div>
                    }

                </Drawer>
            </div>
        );
    }
}


export default connect(state => ({ open: state.drawer.open, user: state.auth.user}), dispatch => ({
    onCloseClick: () => {
        dispatch(closeDrawer());
    }
}))(SideDrawer);