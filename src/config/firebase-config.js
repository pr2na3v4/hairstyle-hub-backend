import admin from 'firebase-admin';
import { readFile } from 'fs/promises';

// Read service account file
const serviceAccount = JSON.parse(
  await readFile(new URL('../../firebase/firebase-service-account.json', import.meta.url))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export default admin;


//../../firebase/firebase-service-account.json