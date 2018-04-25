/**
 * Code that is deployed to Firebase cloud functions and handles server side business logic for order queue processing.
 */

const functions = require('firebase-functions');
let fetch = require('node-fetch');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const cors = require('cors')({origin: true});

const PARTICLE_DEVICE_ID = '350022000e47343432313031'; //redacted for security
const ACCESS_TOKEN = '280069fce3d1ce9b04b8c2431421a5615268c7cf'; //redacted for security

var db = admin.firestore();

exports.updateOrderStatus = functions.https.onRequest((req, res) => {
    const newStatus = req.query.newStatus;
    const orderId = req.query.orderId;

    if(newStatus !== 'waiting' && newStatus !== 'assembling' && newStatus !== 'toasting' && newStatus !== 'done') {
        res.send('error');
    }

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
                    if(newStatus === 'complete') {
                        startNextOrder();
                    }
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
        var receivedOrder = event.data.data();
        var userId = receivedOrder.userId;
        var time = receivedOrder.time;
        var orderId = event.data.id;

        var strippedDownOrder = createStrippedDownOrderObject(receivedOrder, orderId);

        return db.collection('queue').doc(event.data.id).set({
            time: time,
            userId: userId,
            status: 'waiting'
        }).then(function() {
            placeOrder(strippedDownOrder).then(response => {
                return true;
            });
        });
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
                return response.json()}
            )
            .catch(error => {
                res.err(JSON.stringify("Houston, we have a problem. In the sandwich order department."))
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
}

