const express = require("express");
const { jwtGenerate, jwtValidate } = require("./middleware/jwt");
const userModel = require("./models/user");

require("dotenv").config();

const cors = require("cors");

const app = express();
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// const db = firebaseAdmin.firestore();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/testAuth", jwtValidate, (req, res) => {
  res.send("Hello World!, you are authenticated");
});

app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;

  let user;
  // Find user
  if (username && password) {
    user = await userModel.validateUser(username, password);
    if (!user) {
      return res.sendStatus(401);
    }
  }

  const access_token = jwtGenerate(user);

  console.log(user, access_token);

  res.cookie("access_token", access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + 1000 * 60 * 30),
  });

  res.json({
    user,
  });
});

app.post("/auth/logout", (req, res) => {
  res.clearCookie("access_token");
  res.status(200).send("Logged out successfully");
});

// app.get("/data", async (req, res) => {
//   try {
//     const snapshot = await db.collection("properties").get();
//     const data = snapshot.docs.map((doc) => {
//       const docData = doc.data();
//       return {
//         id: doc.id,
//         ...docData,
//         date: docData.date.toDate(),
//       };
//     });
//     res.status(200).json(data);
//   } catch (error) {
//     res.status(500).send("Error getting data from Firestore: " + error.message);
//   }
// });

// app.post("/data", jwtValidate, async (req, res) => {
//   try {
//     const newProperty = {
//       title: "Property 3",
//       description: "Description for Property 3",
//       location: "Location 3",
//       date: firebaseAdmin.firestore.Timestamp.fromDate(new Date()),
//       imageUrlList: ["url5", "url6"],
//       bodyText: "Body text for Property 3",
//       price: 300000,
//       pricePerUnit: 3000,
//       pricePerRiai: 1500,
//       finalPrice: 285000,
//       tags: ["tag5", "tag6"],
//     };

//     const docRef = await db.collection("properties").add(newProperty);
//     res.status(201).json({ id: docRef.id, ...newProperty });
//   } catch (error) {
//     res.status(500).send("Error adding data to Firestore: " + error.message);
//   }
// });

// app.put("/data/:id", jwtValidate, async (req, res) => {
//   try {
//     const id = req.params.id;
//     const propertyRef = db.collection("properties").doc(id);
//     const property = await propertyRef.get();

//     if (!property.exists) {
//       res.status(404).send("Property not found");
//       return;
//     }

//     if (typeof req.body !== "object" || req.body === null) {
//       res.status(400).send("Invalid data format");
//       return;
//     }
//     await propertyRef.update({ ...req.body });
//     res.status(200).send("Property updated successfully");
//   } catch (error) {
//     res.status(500).send("Error updating data in Firestore: " + error.message);
//   }
// });

// app.get("/data/:id", async (req, res) => {
//   try {
//     console.log(req.params.id);
//     const id = req.params.id;
//     const propertyRef = db.collection("properties").doc(id);
//     const property = await propertyRef.get();

//     if (!property.exists) {
//       res.status(404).send("Property not found");
//       return;
//     }

//     const data = property.data();
//     res
//       .status(200)
//       .json({ id: property.id, ...data, date: data.date.toDate() });
//   } catch (error) {
//     res.status(500).send("Error getting data from Firestore: " + error.message);
//   }
// });
