import React from 'react';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import NavigationBar from "../NavigationBar";
import SideDrawer from "../SideDrawer";
import {RaisedButton, TextField} from "material-ui";


class Register extends React.Component {
	state = {
		email: '',
		password: '',
		error: null
	};

	handleSubmit(event) {
		event.preventDefault();
		firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
			.catch((error) => {
				this.setState({ error: error });
			});
	}

	onInputChange(name, event) {
		var change = {};
		change[name] = event.target.value;
		this.setState(change);
	}

    renderErrorMessage() {
        if(!this.state.error) {
            return null;
        }
        return (<div className="error-message">{this.state.error.message}</div>)
    }

	render() {
		let errors = this.state.error ? <p> {this.state.error} </p> : '';

        const styles = {
            errorStyle: {
                color: 'orange',
            },
            underlineStyle: {
                borderColor: 'orange',
            },
            floatingLabelStyle: {
                color: 'orange',
            },
            floatingLabelFocusStyle: {
                color: 'orange',
            },
        };
		return (
			<div>
				<NavigationBar/>
				<SideDrawer/>
				<div className="login-container">
					<div className="login-box">
						<div className="login-header">
							<span>Register</span>
						</div>
						<form className="login-form" onSubmit={this.handleSubmit.bind(this)}>
							<TextField type='email'
									   placeholder='Email'
									   value={this.state.email}
									   onChange={this.onInputChange.bind(this, 'email')}
									   id="email-input"
									   underlineStyle={styles.underlineStyle}
									   underlineFocusStyle={styles.underlineStyle}

							/>
							<br/>
							<TextField type='password'
									   placeholder='Password'
									   value={this.state.password}
									   onChange={this.onInputChange.bind(this, 'password')}
									   id="password-input"
									   underlineStyle={styles.underlineStyle}
									   underlineFocusStyle={styles.underlineStyle}

							/>
							{errors}
							<br/>
							<div className="login-footer">
								<RaisedButton type='submit' className="login-button">Register</RaisedButton>
                                {this.renderErrorMessage()}
							</div>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default connect()(Register);