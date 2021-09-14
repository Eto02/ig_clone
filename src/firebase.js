import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDfeAjA0Ey_oveR5RqaryvhT34Q38_ytDs",
  authDomain: "ig-clone-61d40.firebaseapp.com",
  projectId: "ig-clone-61d40",
  storageBucket: "ig-clone-61d40.appspot.com",
  messagingSenderId: "643279779337",
  appId: "1:643279779337:web:76d1498cbdafafd65daad8"
};

const firebaseApp= firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider =new firebase.auth.GoogleAuthProvider();

export {auth,provider}
export default db;  