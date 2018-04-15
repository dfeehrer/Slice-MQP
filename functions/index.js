const functions = require('firebase-functions');
let fetch = require('node-fetch');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
//const express = require('express');
//const cookieParser = require('cookie-parser')();
const cors = require('cors')({origin: true});

const PARTICLE_DEVICE_ID = '420030000c47343233323032';
const ACCESS_TOKEN = '280069fce3d1ce9b04b8c2431421a5615268c7cf';

//const app = express();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

var db = admin.firestore();

/*exports.placeOrder = functions.https.onRequest((req, res) => {
    // Grab the text parameter.
    const original = req.query.quantity;
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    admin.database().ref('/messages').push({original: original}).then(snapshot => {
        // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
        res.redirect(303, snapshot.ref);
    });
});*/

exports.updateOrderStatus = functions.https.onRequest((req, res) => {
    const newStatus = req.query.newStatus;
    const orderId = req.query.orderId;

    if(newStatus !== 'waiting' && newStatus !== 'assembling' && newStatus !== 'toasting' && newStatus !== 'done') {
        res.send('error');
    }
    //res.send(orderId + ' status changed successfully');

    var orderRef = db.collection('queue').doc(orderId);

    orderRef.get().catch(function(error) {
        console.error("Error updating document: ", error);
        res.send('error getting order doc');
    }).then(function(doc) {
        if (doc.exists) {

            if(newStatus === 'done') {
                orderRef.delete()
                .catch(function(error) {
                    res.send('error deleting finished order');
                }).then(function() {
                    // if(newStatus === 'complete') {
                    //     startNextOrder();
                    // }
                    res.send(orderId + ' successfully deleted from queue');
                });
            } else {
                orderRef.update({
                    status: newStatus
                }).catch(function(error) {
                    res.send('error updating');
                }).then(function() {
                    // if(newStatus === 'complete') {
                    //     startNextOrder();
                    // }
                    res.send(orderId + ' status changed successfully to ' + newStatus);
                });
            }

        } else {
            // doc.data() will be undefined in this case
            //console.log("No such document!");
            //return false;
            res.send('doc does not exist');
        }
    });

});

exports.createOrder = functions.firestore
    .document('orders/{orderId}')
    .onCreate(event => {
        // Get an object representing the document
        // e.g. {'name': 'Marie', 'age': 66}
        var receivedOrder = event.data.data();

        // access a particular field as you would any JS property
        var userId = receivedOrder.userId;
        var time = receivedOrder.time;
        var orderId = event.data.id;

        var strippedDownOrder = createStrippedDownOrderObject(receivedOrder, orderId);

        return db.collection('queue').doc(event.data.id).set({
            time: time,
            userId: userId,
            status: 'waiting'
        }).then(function() {
            //console.log("Document successfully updated!");
            placeOrder(strippedDownOrder).then(response => {
                return true;
            });
        });

        // perform desired operations ...
    });

function createStrippedDownOrderObject(completeOrder, orderId) {

    var userId = completeOrder.userId;
    var time = completeOrder.time;

    var strippedDownOrder = {};
    strippedDownOrder.cheese = completeOrder.cheese;
    strippedDownOrder.chips = completeOrder.chips;
    strippedDownOrder.toast = completeOrder.toast;
    strippedDownOrder.order = orderId;

    return strippedDownOrder;
}

function placeOrder(order) {
    let url = 'https://api.particle.io/v1/devices/'+ PARTICLE_DEVICE_ID + '/order?access_token=' + ACCESS_TOKEN;
    let data = {};
    data.args = JSON.stringify(order);

    return db.collection('queue').doc(order.order).update({
        status: 'sent'
    }).catch(function(error) {
        console.error('error setting order status to sent')
    }).then(function() {
        return fetch(url, {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
                //res.json({status: 'Successfully placed order'});
                //console.log('Success:', response)
                return response.json()}
            )
            .catch(error => {
                //res.json({status: 'Successfully placed order'});
                //res.err(JSON.stringify("Houston, we have a problem. In the sandwich order department."))

                //console.error('Error:', error)
            })
    });
}


function startNextOrder() {
    db.collection('queue').get().then(function(querySnapchat) {
        var numOrdersInQueue = querySnapchat.size;
        if(numOrdersInQueue > 0) {
            //get the single oldest order in the queue
            db.collection('queue').orderBy("time").limit(1).get().then(function(doc) {
                if(strippedDownOrder.status)
                var strippedDownOrder = createStrippedDownOrderObject(doc, doc.id);
                placeOrder(strippedDownOrder);
            });
        }
    });
/*
        .doc(event.data.id).set({
        time: time,
        userId: userId,
        status: 'waiting'
    }).then(function() {
        //console.log("Document successfully updated!");
    });
    */
}


// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
/*const validateFirebaseIdToken = (req, res, next) => {
    console.log('Check if request is authorized with Firebase ID token');

    if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
        !req.cookies.__session) {
        console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
            'Make sure you authorize your request by providing the following HTTP header:',
            'Authorization: Bearer <Firebase ID Token>',
            'or by passing a "__session" cookie.');
        res.status(403).send('Unauthorized');
        return;
    }

    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        console.log('Found "Authorization" header');
        // Read the ID Token from the Authorization header.
        idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
        console.log('Found "__session" cookie');
        // Read the ID Token from cookie.
        idToken = req.cookies.__session;
    }
    admin.auth().verifyIdToken(idToken).then(decodedIdToken => {
        console.log('ID Token correctly decoded', decodedIdToken);
        req.user = decodedIdToken;
        next();
    }).catch(error => {
        console.error('Error while verifying Firebase ID token:', error);
        res.status(403).send('Unauthorized');
    });
};

app.use(cors);
app.use(cookieParser);
app.use(validateFirebaseIdToken);
app.get('/hello', (req, res) => {
    res.send(`Hello ${req.user.name}`);
});
*/

// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
//exports.app = functions.https.onRequest(app);



/*

router.post('/order', function(req, res, next) {
    if(req) {
        let url = 'https://api.particle.io/v1/devices/2f001a000447343138333038/order?access_token=280069fce3d1ce9b04b8c2431421a5615268c7cf';
        let data = 'access_token=280069fce3d1ce9b04b8c2431421a5615268c7cf';
        fetch(url, {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(response => response.json())
            .catch(error => {
                //res.json({status: 'Successfully placed order'});
                res.err(JSON.stringify("Houston, we have a problem. With the order."))

                //console.error('Error:', error)
            })
            .then(response => {
                res.json({status: 'Successfully placed order'});
                res.err(JSON.stringify("Houston, we have a problem. With the order."))
                //console.log('Success:', response)
            });

    }

    //res.send('respond with a resource');

    // And insert something like this instead:
});

*/
/* GET users listing. */
/*
router.post('/listeningModeOn', function(req, res, next) {
    if(req && req.body && req.body.temp) {

    }
    //res.send('respond with a resource');

    // And insert something like this instead:
    res.json({'Status': 'Successfully POSTed to API - listening mode on'});
});

*/

/* GET users listing. */

/*
router.post('/listeningModeOff', function(req, res, next) {
    if(req && req.body && req.body.temp) {

    }
    //res.send('respond with a resource');

    // And insert something like this instead:
    res.json({'Status': 'Successfully POSTed to API - listening mode off'});
});

    */
