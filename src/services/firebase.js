import firebase from "firebase";
//import firebase from 'firebase/app';
//import 'firebase/database';
//import 'firebase/auth';

const config = {
  apiKey: "AIzaSyDPuc-lkvlx2WVRYCT7_tY7_NlE5cnsjpA",
  authDomain: "rfdemo-52aa0.firebaseapp.com",
  databaseURL: "https://rfdemo-52aa0.firebaseio.com",
  projectId: "rfdemo-52aa0",
  storageBucket: "rfdemo-52aa0.appspot.com",
  messagingSenderId: "280966892753",
  appId: "1:280966892753:web:7bb88ef60fb1309b4489f0"
};

firebase.initializeApp(config);

export const auth = firebase.auth;
export const db = firebase.database();
export const storage = firebase.storage();