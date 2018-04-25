import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { connect } from 'react-redux';
import {Link} from "react-router";
import {NavigationMenu} from "material-ui/svg-icons/index";
import {openDrawer} from "../actions/drawer";

class Login extends Component {
    static muiName = 'FlatButton';

    render() {
        return (
            <div className="nav-login-button">
                <FlatButton
                    containerElement={<Link to="/login" />}
                    linkButton={true}
                    label={'Login'}
                />
            </div>
        );
    }
}

const Logged = (props) => (
    <IconMenu
        {...props}
        iconButtonElement={
            <IconButton><MoreVertIcon /></IconButton>
        }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
    >
        <MenuItem containerElement={<Link to="/logout"/>}>Logout</MenuItem>

    </IconMenu>
);

Logged.muiName = 'IconMenu';

class NavigationBar extends Component {
    state = {
        logged: true,
    };

    handleChange = (event, logged) => {
        this.setState({logged: logged});
    };

    render() {
        return (
            <div>
                <AppBar
                    title="Slice"
                    iconElementLeft={<IconButton onClick={this.props.onOpenClick.bind(this)}><NavigationMenu/>
                    </IconButton>}
                    iconElementRight={this.props.user ? <Logged /> : <Login />}
                    style={{'backgroundColor': 'orange'}}
                />
            </div>
        );
    }
}

export default connect(state => ({ open: state.drawer.open, user: state.auth.user }), dispatch => ({
    onOpenClick: () => {
        dispatch(openDrawer());
    }
}))(NavigationBar);