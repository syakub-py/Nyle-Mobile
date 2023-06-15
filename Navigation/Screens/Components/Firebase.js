import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import 'firebase/compat/firestore'
import {getFirestore} from 'firebase/firestore/lite'
import "firebase/compat/analytics"
import 'firebase/compat/storage'
import dotenv from "dotenv";
import _ from "lodash"
dotenv.config()

let app;

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

// Initialize Firebase
if (_.isEmpty(firebase.apps)) app = firebase.initializeApp(firebaseConfig);
else app = firebase.app()

const firestore = firebase.firestore()

const firestoreLite = getFirestore(app)

const auth = firebase.auth()

const getstorage = firebase.storage()

export {auth, firestoreLite, firestore, getstorage};
