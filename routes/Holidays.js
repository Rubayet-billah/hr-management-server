const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();

// database connection
const client = require("../db/mongodb");
const holidaysCollection = client.db("HrManager").collection("holidays");

router.get("/", async (req, res) => {
  const query = {};
  const events = await holidaysCollection.find(query).toArray();
  res.send(events);
});
module.exports = router;
