const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../modals/db");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
require("dotenv").config();

const route = express.Router();

route.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  let database = await db.getDatabase();
  const collection = database.collection("appuser");
  await bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hashedpassword) => {
      const password = hashedpassword;
      let data = {
        name: name,
        email: email,
        password: password,
        role: role,
      };
      collection
        .insertOne(data)
        .then(() => {
          res.json("User added");
        })
        .catch((err) => res.status(400).json("Error:" + err));
    });
  });
});

route.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(req.body, "dfghjkxcvbnmfghjkl");
    let database = await db.getDatabase();
    const collection = database.collection("appuser");
    const user = await collection.findOne({ email: email });
    console.log(user, "uhfjksl");
    if (!user) {
      // console.log("etryuiop");
      return res.status(400).send("user not found");
    }

    const validDetails = await bcrypt.compare(password, user.password);
    // console.log(validDetails,'lll')
    if (!validDetails) {
      return res.status(400).send("password incorrect");
    }
    const userData = { email: email };

    const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN, {
      expiresIn: "20m",
    });
    // console.log(accessToken)
    res.status(200).json({ accesstoken: accessToken });
  } catch (err) {
    console.log(err);
  }
});

// route.post('/verify', verifyToken, (req,res)=>{
//   console.log(req.body , "req" )
//   return res.json( {"message" : req.body})
// })

route.get("/alluser", async (req, res) => {
  try {
    let database = await db.getDatabase();
    const collection = database.collection("appuser");

    const cursor = collection.find({});
    const projects = await cursor.toArray();

    res.status(200).json(projects);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

route.post("/delete", async (req, res) => {
  try {
    let data = req.body;
    // const userId = new ObjectId(data._id)
    let database = await db.getDatabase();
    const collection = database.collection("appuser");
    const cursor = await collection.find({ _id: new ObjectId(data._id) });
    let users = await cursor.toArray();
    if (users.length == 1) {
      await collection.deleteOne({ _id: new ObjectId(data._id) });
      return res.status(200).send({ message: "deleted successfully" });
    }
  } catch (err) {
    console.log(err);
  }
});

// route.post('/delete', async (req, res) => {
//   try {
//     const { _id } = req.body

//     if (!_id) {
//       return res.status(400).json({ error: "Missing _id parameter" });
//     }

//     const database = await db.getDatabase();
//     const collection = database.collection('appuser');

//     const user = await collection.findOne({ _id: ObjectId(_id) });

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const result = await collection.deleteOne({ _id: ObjectId(_id) });

//     if (result.deletedCount === 1) {
//       return res.status(200).json({ message: "User deleted successfully" });
//     } else {
//       return res.status(500).json({ error: "Failed to delete user" });
//     }
//   } catch (err) {
//     console.error("Error deleting user:", err);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// })
module.exports = route;
