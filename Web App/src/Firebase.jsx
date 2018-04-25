import firebase from 'firebase'
import 'firebase/firestore'
import config from '../firebase.config'
let fire = firebase.initializeApp(config);
let db = firebase.firestore();

export { db, fire};
