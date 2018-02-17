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
                    <MenuItem containerElement={<Link to="/login"/>} onClick={this.props.onCloseClick.bind(this)}>Login</MenuItem>
                    <MenuItem containerElement={<Link to="/register"/>} onClick={this.props.onCloseClick.bind(this)}>Register</MenuItem>
                </Drawer>
            </div>
        );
    }
}


export default connect(state => ({ open: state.drawer.open }), dispatch => ({
    onCloseClick: () => {
        dispatch(closeDrawer());
    }
}))(SideDrawer);