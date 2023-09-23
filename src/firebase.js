// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth , GoogleAuthProvider} from "firebase/auth";
import {getFirestore , doc, setDoc} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDnuYXlD80r81R6VAMvNH4mYNAtuE702SI",
  authDomain: "financely-3e539.firebaseapp.com",
  projectId: "financely-3e539",
  storageBucket: "financely-3e539.appspot.com",
  messagingSenderId: "865451752992",
  appId: "1:865451752992:web:a726d615201f8428294645",
  measurementId: "G-JZV2FGCT81"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db=getFirestore(app);
const auth=getAuth(app);
const provider=new GoogleAuthProvider();
export { db, auth , provider ,doc ,setDoc};