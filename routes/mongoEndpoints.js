const express = require('express');
const db = require('../config/database');
const router = express.Router();
const { verify } = require('../controllers/authentication');

async function getCollection(req) {
  const database = await db.connection().db(req.params.database);
  const collection = await database.collection(req.params.collection);
  return collection;
}

router.get(`/:database/:collection/aggregate`, verify, async (req, res) => {
  console.log("------------");
  console.log(req.params);
  console.log(JSON.parse(req.query.pipeline));
  console.log("------------");
  let collection = await getCollection(req);
  const pipeline = JSON.parse(req.query.pipeline);
  let results = await collection.aggregate(pipeline)
    .limit(50)
    .toArray();
  res.send(results).status(200);
});

router.get(`/:database/:collection`, verify, async (req, res) => {
  console.log("-----GET COLLECTION-------");
  console.log(req.params, req.user);
  console.log("------------");
  let collection = await getCollection(req)
  let results = await collection.find({})
    .limit(50)
    .toArray();
  res.send(results).status(200);
});

//should we run checks here to error handle?
router.post('/:database/:collection', verify, async (req, res) => {
  console.log("-----POST TO COLLECTION-------");
  console.log(req.statusCode);
  console.log("params", req.params);
  console.log("body", req.body);
  console.log("------------");

  try {

    let collection = await getCollection(req);
    let documents = req.body;
    let inserted = await collection.insertMany(documents);
    console.log("IDs", inserted.insertedIds);
    console.log("Count", inserted.insertedCount);
    console.log("Acknowledgement", inserted.acknowledged);

    res.send("Posted!").status(200);
  } catch (e) {
    console.log("------------");
    console.log("ERROR", e);
    res.send("Error posting").status(500);
  }
})

router.patch('/:database/:collection', verify, async (req, res) => {

  console.log("-----PATCH TO COLLECTION-------");
  console.log(req.statusCode);
  console.log("params", req.params);
  console.log("body", req.body);
  let body = req.body;
  console.log("uuid", body.uuid);
  console.log("data", body.data);
  console.log("-------------------------------");

  let collection = await getCollection(req);
  let original = await collection.findOneAndUpdate({ "uuid": req.body.uuid }, { "$set": req.body.data });
  console.log(original);

  res.send("Patching!");

});

module.exports = router;