const firebaseAdmin = require("../config/firebase-admin");

const db = firebaseAdmin.firestore();

class User {
  constructor(id, username) {
    this.id = id;
    this.username = username;
  }

  static async getUserById(id) {
    const userRef = db.collection("users").doc(id);
    const doc = await userRef.get();
    if (!doc.exists) {
      throw new Error("No such user!");
    } else {
      return new User(doc.id, doc.data().username);
    }
  }

  static async validateUser(username, password) {
    const userRef = db.collection("users");
    const snapshot = await userRef
      .where("username", "==", username)
      .where("password", "==", password)
      .get();
    if (snapshot.empty) {
      return null;
    } else {
      const doc = snapshot.docs[0];
      return new User(doc.id, doc.data().username);
    }
  }

  static async updateUser(id, data) {
    const userRef = db.collection("users").doc(id);
    await userRef.update(data);
    return new User(id, data.username);
  }

  static async updatePassword(id, newPassword) {
    const userRef = db.collection("users").doc(id);
    await userRef.update({ password: newPassword });
    return true;
  }
}

module.exports = User;
