import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import 'firebase/compat/firestore'
import {getFirestore} from 'firebase/firestore/lite'
import "firebase/compat/analytics"
import 'firebase/compat/storage'
var app = "";

const firebaseConfig = {
  apiKey: "AIzaSyAS0OLIeH01QAyHZQxILWWUu3I2PJm3xz4",
  authDomain: "nyle-bd594.firebaseapp.com",
  projectId: "nyle-bd594",
  storageBucket: "nyle-bd594.appspot.com",
  messagingSenderId: "616674242131",
  appId: "1:616674242131:web:7788508192e82a84b660a6",
  measurementId: "G-70E5N2DBMC"
};

// Initialize Firebase
if(!firebase.apps.length){
  app = firebase.initializeApp(firebaseConfig);
}else{
  app = firebase.app()
}


const firestore = firebase.firestore()

const firestoreLite = getFirestore(app)

const auth = firebase.auth()

const getstorage = firebase.storage()

export {auth, firestoreLite, firestore, getstorage};






