import * as admin from "firebase-admin";
import * as firebase_functions from "firebase-functions";

export const app = admin.initializeApp();

export const functions = firebase_functions.region("asia-northeast3");

const db = app.firestore();

export const plansCollection = db.collection("plans");
export const planItemsCollection = db.collection("planItems");
export const eventItemsCollection = db.collection("eventItems");
