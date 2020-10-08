import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/functions";
import "firebase/firestore";

import config from "../../config.json";
const firebaseConfig = config.firebaseConfig;

export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const firebaseInstance = firebase;

export const firebaseFunctions = firebaseApp.functions("asia-northeast3");
export const firestore = firebaseApp.firestore();

// use simulator when running locally
if (window.location.hostname === "localhost") {
  console.log("using emulators");
  firebaseFunctions.useFunctionsEmulator("http://localhost:5001");
  firestore.settings({ host: "localhost:8080", ssl: false });
}
