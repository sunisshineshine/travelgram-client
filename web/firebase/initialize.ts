import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/functions";

import config from "../config.json";
const firebaseConfig = config.firebaseConfig;

export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const firebaseInstance = firebase;
