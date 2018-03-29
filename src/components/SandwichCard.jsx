import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import {fire, db} from '../Firebase'
import * as firebase from 'firebase';
import {Checkbox, Slider, Toggle} from "material-ui";
import {connect} from "react-redux";


class SandwichCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            cheeseSlices: 2,
            toastLevel: 2,
            chips: false
        };
    }

    // Does an authenticated request to a Firebase Functions endpoint using an Authorization header.
    startFunctionsRequest() {
        fire.auth().currentUser.getToken().then(function(token) {
            console.log('Sending request with ID token in Authorization header.');
            var req = new XMLHttpRequest();
            req.onload = function() {
                //this.responseContainer.innerText = req.responseText;
                console.log(req.responseText);
            }.bind(this);
            req.onerror = function() {
                console.log('Error');
            }.bind(this);
            req.open('GET', 'https://us-central1-slice-mqp.cloudfunctions.net/app/hello', true);
            req.setRequestHeader('Authorization', 'Bearer ' + token);
            req.send();
        }.bind(this));
    };

    placeOrder() {
        let test = {
            userId: this.props.user.uid,
            chips: this.state.chips ? 1 : 0,
            toast: this.state.toastLevel,
            cheese: this.state.cheeseSlices,
            time: firebase.firestore.FieldValue.serverTimestamp()
        };
        let newOrderRef = db.collection("orders").doc();
        console.log("Made a new order ref: ", newOrderRef);
        console.log(this.props.user);

        newOrderRef.set(test)
            .then(function() {
                //console.log("Document successfully written!");
            })
            .catch(function(error) {
                //console.error("Error writing document: ", error);
            });
    }

    handleCheeseSliderChange= (event, value) => {
        this.setState({cheeseSlices: value});
        console.log(this.state);
        console.log(value);
    }

    handleToastSliderChange = (event, value) => {
        this.setState({toastLevel: value});
        console.log(value);
    }

    handleChipsCheckboxChange = (event, value) => {
        this.setState({chips: event.target.checked});
        console.log(this.state);
    }

    render() {
        return (
            <Card className="sandwichCard">
                <CardMedia
                    overlay={<CardTitle title="World Famous Grilled Cheese"/>}
                >
                    <img src="grilled-cheese.jpg" alt="" />
                </CardMedia>
                <CardText>
                    Two slices of toasted bread with a warm slice of cheese in the middle. It's grrrrreat!
                </CardText>
                <CardActions>
                    <label htmlFor="toastiness-slider">Toast level</label>

                    <Slider
                        step={1}
                        value={this.state.toastLevel}
                        min={1}
                        max={3}
                        name={'toastiness-slider'}
                        onChange={this.handleToastSliderChange.bind(this)}
                    />

                    <label htmlFor="cheese-slider">Cheese level</label>

                    <Slider
                        step={1}
                        value={this.state.cheeseSlices}
                        min={1}
                        max={3}
                        name={'cheese-slider'}
                        onChange={this.handleCheeseSliderChange.bind(this)}
                    />

                    <Checkbox
                        label="Chips"
                        checked={this.state.chips}
                        onCheck={this.handleChipsCheckboxChange.bind(this)}
                    />
                    <FlatButton label="Order Now" onClick={this.placeOrder.bind(this)}/>
                </CardActions>
            </Card>
        );
    }

};

export default connect(state => ({ next: state.auth.next, user: state.auth.user }), dispatch => ({

}))(SandwichCard);

