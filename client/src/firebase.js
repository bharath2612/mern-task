import firebase from "firebase/app";
import "firebase/auth";

// Your web app's Firebase configuration
const config = {
  apiKey: "AIzaSyD3hP0WVAlHD9qZfaxh2mKf__XbFzOtV14",
  authDomain: "spa-project-8cad5.firebaseapp.com",
  projectId: "spa-project-8cad5",
  storageBucket: "spa-project-8cad5.appspot.com",
  messagingSenderId: "558068903219",
  appId: "1:558068903219:web:9327a21f022f76026ae246",
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

//export
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export default firebase;
