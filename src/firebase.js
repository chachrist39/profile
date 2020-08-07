// This import loads the firebase namespace along with all its type information.
import * as firebase from 'firebase/app'

// These imports load individual services into the firebase namespace.
import 'firebase/firestore'



// Initialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyD-QLLzi9415EL_qzhSUeRzYJI8ZvBwDYw",
  authDomain: "profile-vue-test.firebaseapp.com",
  databaseURL: "https://profile-vue-test.firebaseio.com",
  projectId: "profile-vue-test",
  storageBucket: "profile-vue-test.appspot.com",
  messagingSenderId: "276887287100",
  appId: "1:276887287100:web:f3589b207f43f7deac9a39"
};
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore()