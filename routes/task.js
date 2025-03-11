const express = require("express");
const db = require("../modals/db");
const { Cursor } = require("mongoose");
const { ObjectId } = require("mongodb");

const routes = express.Router();
const auth = require("./auth");

routes.get("/all", async (req, res) => {
  try {
    let database = await db.getDatabase();
    const collection = database.collection("projectCols");

    const cursor = collection.find({});
    const projects = await cursor.toArray();

    res.status(200).json(projects);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});
// routes.post("/add", auth.verifyToken, async (req, res) => {
//   try {
//     const {
//         ProjectName,
//         ProjectEmail,
//         ProjectDescription,
//         ProjectRequirement,
//         ProjectDeadline,
//         ProjectStatus,
//     } = req.body;

//     let database = await db.getDatabase();
//     const addedproject = await database
//       .collection("projectCols")
//       .insertOne(req.body);
//     res.status(201).json({ message: "Project Added successfully" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });
routes.post("/add", auth.verifyToken, async (req, res) => {
  try {
    const {
      ProjectName,
      ProjectEmail,
      ProjectDescription,
      ProjectRequirement,
      ProjectDeadline,
      ProjectStatus,
    } = req.body;

    // Check if the required fields are present
    if (
      !ProjectName ||
      !ProjectEmail ||
      !ProjectDescription ||
      !ProjectRequirement ||
      !ProjectDeadline ||
      ProjectStatus
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    let database = await db.getDatabase();
    const addedproject = await database
      .collection("projectCols")
      .insertOne(req.body);

    res
      .status(201)
      .json({ message: "Project added successfully", project: addedproject });
  } catch (error) {
    console.error("Error adding project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

routes.post("/edit", async (req, res) => {
  try {
    let data = req.body;
    const userId = new ObjectId(data._id);
    let database = await db.getDatabase();
    const collection = database.collection("projectCols");

    const cursor = await collection.findOne({ _id: new ObjectId(data._id) });

    if (cursor) {
      await collection.updateOne(
        { _id: new ObjectId(data._id) },
        { $set: { ProjectStatus: data.ProjectStatus } }
      );
      return res.status(200).send({ message: "updated successfully" });
    }
  } catch (err) {
    console.log(err);
  }
});
module.exports = routes;
