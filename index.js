console.log("Starting backend!");
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/cors');
const cookieParser = require('cookie-parser');
const { verify } = require('./middleware/verification')

const db = require('./config/database');

const path = require('path');
const app = express();
const PORT = process.env.PORT;

app.use(require('./middleware/credentials'));
app.use(verify);
//middleware - need to research what these do...
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send("Got base route");
});

//routes
app.use('/mongo/api', require('./routes/mongoEndpoints'));
app.use('/auth', require('./routes/authenticationEndpoints'));

(async () => {
  await db.init();

  app.listen(PORT, (err) => {
    console.log(`Server listening to ${PORT}`);
  });
})();