console.log("Starting backend!");
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

const corsOptions = require('./config/cors');
const db = require('./config/database');

const { verify } = require('./middleware/verification')
const errorHandler = require('./middleware/errorhandler');


const app = express();
const PORT = process.env.PORT;

//middleware - need to research what these do...They run before each request I believe
app.use(require('./middleware/credentials'));
app.use(verify);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send("Got base route");
});

app.use(errorHandler);
//routes
app.use('/mongo/api', require('./routes/mongoEndpoints'));
app.use('/auth', require('./routes/authenticationEndpoints'));
app.use('/moviedb', require('./routes/moviedbEndpoint'));

(async () => {
  await db.init();

  app.listen(PORT, (err) => {
    console.log(`Server listening to ${PORT}`);
  });
})();