import * as admin from "firebase-admin";

export const app = admin.initializeApp();
const db = app.firestore();

export const plansCollection = db.collection("plans");

export const getTimestampNow = admin.firestore.Timestamp.now;
