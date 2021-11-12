import firebase from "firebase/app";
import "firebase/database";

let config = {
  apiKey: "AIzaSyCdhzEQzfQhzyLqXtA7000QZw7zuVLv5FQ",
  authDomain: "tictactoe-webgame-677ca.firebaseapp.com",
  databaseURL: "https://tictactoe-webgame-677ca-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tictactoe-webgame-677ca",
  storageBucket: "tictactoe-webgame-677ca.appspot.com",
  messagingSenderId: "163943786800",
  appId: "1:163943786800:web:af8249c681f67c92a880f5",
  measurementId: "G-F8Z73VQMV3"
};

firebase.initializeApp(config);

export default firebase.database();
