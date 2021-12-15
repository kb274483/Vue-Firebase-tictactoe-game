import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

let config = {
  apiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "xxxxxxxxxxxxxxxxxxxxxxxxxx",
  databaseURL: "https://tictactoxxxxxxxxxxxxxxxsia-southeast1.firebasedatabase.app",
  projectId: "txxxxxxxxxxxxx77ca",
  storageBucket: "tixxxxxxxxxxxxxxxpot.com",
  messagingSenderId: "xxxx94xxxxxxxxx",
  appId: "1:1xxxxxxxxxxxxxxxxxxxxxxx880f5",
  measurementId: "xxx-ZxxxQx3"
};

firebase.initializeApp(config);
export const firebaseAuth = firebase.auth();
export default firebase.database();
