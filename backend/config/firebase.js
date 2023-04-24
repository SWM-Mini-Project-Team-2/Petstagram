// Import the functions you need from the SDKs you need
import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore, Timestamp, FieldValue } from "firebase-admin/firestore";

import serviceAccount from "./firebase-config.js";

initializeApp({
    credential: cert(serviceAccount),
});

const db = getFirestore();

export default db;
