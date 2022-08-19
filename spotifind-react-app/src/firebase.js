

// -=-=-=-=-=-=-=-=-=- DON'T TOUCH ANYTHING IN HERE -=-=-=-=-=-=-=-=-=- //

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

// Initialize Firebase
const firebaseConfig = {
   apiKey: process.env.REACT_APP_API_KEY,
   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
   projectId: process.env.REACT_APP_PROJECT_ID,
   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
   messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER,
   appId: process.env.REACT_APP_APP_ID
};


firebase.initializeApp(firebaseConfig);
export const firebaseAuth = firebase.auth();
export const firestore = firebase.firestore();
export const firebaseStorageRef = firebase.storage().ref();


// -=-=-=-=-=-=-=-=-=- DON'T TOUCH ANYTHING IN HERE -=-=-=-=-=-=-=-=-=- //
