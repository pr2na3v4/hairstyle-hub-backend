import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config(); // MUST be called before accessing process.env

const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceAccountVar) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT is missing in .env file");
}

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceAccountVar))
});

export default admin;