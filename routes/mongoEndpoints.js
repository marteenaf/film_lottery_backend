const express = require('express');
const db = require('../config/database');
const router = express.Router();

router.get(`/:database/:collection/aggregate`, async (req, res) => {
  console.log("------------");
  console.log(req.params);
  console.log(JSON.parse(req.query.pipeline));
  console.log("------------");
  let database = await db.connection().db(req.params.database);
  let collection = await database.collection(req.params.collection);
  const pipeline = JSON.parse(req.query.pipeline);
  let results = await collection.aggregate(pipeline)
    .limit(50)
    .toArray();
  res.send(results).status(200);
});

router.get(`/:database/:collection`, async (req, res) => {
  console.log("------------");
  console.log(req.params);
  console.log("------------");
  let database = await db.connection().db(req.params.database);
  let collection = await database.collection(req.params.collection);
  let results = await collection.find({})
    .limit(50)
    .toArray();
  res.send(results).status(200);
});

module.exports = router;