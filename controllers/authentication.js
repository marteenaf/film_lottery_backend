const bcrypt = require('bcrypt');
const db = require('../config/database');
const jwt = require('jsonwebtoken');

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
  const email = req.body.email.toLowerCase();
  const user = await collection.find({ email: email }).limit(1).toArray();

  if (user.length > 0 || user[0]) {
    res.status(400).json({
      error: true,
      message: "A user with this email already exists. Try again with another email.",
    });
  } else {
    const newUser = req.body;
    newUser.email = email;
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
  const user = await collection.findOne({ email: req.body.email });

  if (user) {
    console.log("found user");

    //compare passwords
    bcrypt.compare(req.body.password, user.password, async function (err, result) {
      // result == true
      if (result) {
        console.log("Correct password, user autheticated");

        //use id or uuid to create the token to make sure it is unique
        const token = jwt.sign({ id: user.uuid }, process.env.ACEES_TOKEN, {
          expiresIn: '1800s'
        })

        const refresh_token = jwt.sign({ id: user.uuid }, process.env.REFRESH_TOKEN, {
          expiresIn: '1d'
        })

        //add the refresh token to the user document
        await collection.updateOne({ uuid: user.uuid }, { $set: { "refresh_token": refresh_token } });

        res.cookie('refresh_token', refresh_token, {
          httpOnly: true,
          domain: undefined,
          maxAge: 24 * 60 * 60 * 1000,
          sameSite: "none",
          secure: true
        });
        //here is where we will create a jwt for the session. Send the token in headers to front-end
        res.status(200).json({
          error: false,
          message: "Authentication  successful!",
          token: token,
          isAuthenticated: true,
          user: user.email
        });
      } else {
        console.log("Incorect password, user NOT autheticated");
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

async function logout(req, res) {

  console.log("-----LOGOUT------");

  const cookie = req.cookies.refresh_token;
  if (!cookie) return res.sendStatus(204);

  const database = await db.connection().db("auth");
  const collection = await database.collection("users");
  const user = await collection.findOne({ refresh_token: cookie });
  //console.log("My user", user);

  if (!user) {
    res.clearCookie("refresh_token", { httpOnly: true, sameSite: "None", secure: true })
    return res.sendStatus(204);
  } else {

    await collection.updateOne({ email: user.email }, { $set: { "refresh_token": null } });
    res.clearCookie("refresh_token", { httpOnly: true, sameSite: "None", secure: true })
    return res.sendStatus(204);
  }

}

async function refresh(req, res) {
  console.log("-------------- REFRESH");
  //console.log(req.cookies);
  const cookie = req.cookies.refresh_token;
  if (!cookie) return res.status(401).json({
    error: true,
    message: "Could not find refresh token in cookies"
  });

  const database = await db.connection().db("auth");
  const collection = await database.collection("users");
  const user = await collection.findOne({ refresh_token: cookie });
  //console.log("My user", user);

  if (!user) return res.sendStatus(403);

  jwt.verify(
    cookie,
    process.env.REFRESH_TOKEN,
    (err, decoded) => {
      if (err || user.uuid !== decoded.id) return res.sendStatus(403);

      const token = jwt.sign({ id: user.uuid }, process.env.ACEES_TOKEN, {
        expiresIn: '1800s'
      });

      res.status(200).json({
        error: false,
        message: "Refresh  successful!",
        token: token,
        isAuthenticated: true,
        user: user.email
      });
    }
  )
}

async function getUser(req, res) {
  //user verification here.
  console.log("--------- GETTING USER ---------");
  const database = await db.connection().db("auth");
  const collection = await database.collection("users");
  const { email } = await collection.findOne({ uuid: req.user.id });
  const user = email;
  res.json({
    error: false,
    message: "Request for user details successful!",
    user: user
  })
}

module.exports.login = login;
module.exports.register = register;
module.exports.logout = logout;
module.exports.refresh = refresh;
module.exports.user = getUser;