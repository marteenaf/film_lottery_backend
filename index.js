console.log("Starting backend!");
require('dotenv');
const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = 2500;

//middleware - need to research what these do...
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send("Got base route");
})

app.get('/users', (req, res) => {
  res.send("Users!!");
})


app.listen(PORT, () => {
  console.log("Listening to port", PORT);
})