const allowedOrigins = require('./allowedOrigins');
const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    //console.log("origin", origin);
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));

    }
  },

}

module.exports = corsOptions;