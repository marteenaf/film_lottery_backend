
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@dev.jgmxowi.mongodb.net/`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri);

let connection;

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    connection = await client.connect();
    console.log("------------------");
    console.log("Connected to mongo");
    console.log("------------------");
  } catch (e) {
    // Ensures that the client will close when you finish/error
    //await client.close();
    console.error("Error with mongo connection", e);
  }
}

function getConnection() {
  return client;
}

module.exports.init = run;
module.exports.connection = getConnection;
