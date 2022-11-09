import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import 'firebase/compat/firestore'
import {getFirestore} from 'firebase/firestore/lite'
import {getStorage} from 'firebase/storage'
import "firebase/compat/analytics"
import {API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSEGING_SENDER_ID, APP_ID, MEASUREMENT_ID} from 'react-native-dotenv';

var app = "";

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSEGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID
};

// Initialize Firebase
if(!firebase.apps.length){
  app = firebase.initializeApp(firebaseConfig);
}else{
  app = firebase.app()
}


const firestore = getFirestore(app)

const auth = firebase.auth()

const getstorage = getStorage(app)

const analytics = firebase.analytics(app)

export {auth, firestore, getstorage, analytics};






