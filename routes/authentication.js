const express = require('express');
const db = require('../config/database');
const router = express.Router();
const bcrypt = require('bcrypt');

async function encryptPassowrd(plain) {
  try {
    return bcrypt.hash(plain, 10);
  } catch (err) {
    console.error("Error encrypting password", err);
  }
}

async function register(req, res, err) {
  const database = await db.connection().db("auth");
  const collection = await database.collection("users");
  const user = await collection.find({ email: req.body.email }).limit(1).toArray();

  if (user.length > 0 || user[0]) {
    res.status(400).json({
      error: true,
      message: "A user with this email already exists. Try again with another email.",
    });
  } else {
    const newUser = req.body;
    //encrypt the password here
    const encryptedPassword = await encryptPassowrd(req.body.password);
    newUser.password = encryptedPassword;
    const result = await collection.insertOne(newUser);
    res.status(200).json({
      error: false,
      message: "User created",
      mongo: result
    });
  }

}

async function login(req, res) {
  const database = await db.connection().db("auth");
  const collection = await database.collection("users");
  const user = await collection.find({ email: req.body.email }).limit(1).toArray();

  if (user.length > 0 && user[0]) {
    console.log("found user");

    //compare passwords
    bcrypt.compare(req.body.password, user[0].password, function (err, result) {
      // result == true
      if (result) {
        console.log("Correct password, user autheticated");
        //here is where we will create a jwt for the session.
        res.status(200).json({
          error: false,
          message: "Authentication  successful!"
        })
      } else {
        console.log("Inccorect password, user NOT autheticated");
        res.status(400).json({
          error: true,
          message: "Incorrect password!"
        })
      }

    });

  } else {
    res.status(404).json({
      error: true,
      message: "User was not found. Try with another email."
    })
  }
}

router.post("/register", register);
router.post("/login", login);

module.exports = router;