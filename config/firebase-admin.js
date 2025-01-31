const firebaseAdmin = require("firebase-admin");
require("dotenv").config();
// const serviceAccount = require("./serviceAccount.json");

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

module.exports = firebaseAdmin;
