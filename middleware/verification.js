const jwt = require('jsonwebtoken');

//improve this
function verify(req, res, next) {
  console.log("---------VERIFYING MIDDLEWARE---------");
  const header = req.header("Authorization");
  if (!header) {
    req.user = {}
    return next();
  } else {

    const token = header.startsWith("Bearer") ? header.split(" ")[1] : null;
    try {
      const verification = jwt.verify(token, process.env.ACCESS_TOKEN);
      req.user = verification;
      return next();
    } catch (error) {
      console.error("Token did not work", error);
      req.user = {};
      return next();
    }
  }
}

function verifyUser(req, res, next) {
  console.log("-------VERIFY USER---------");
  //console.log("user?", req.user);
  if (req.user?.id) {
    return next();
  } else {
    return res.status(401).json({
      error: true,
      message: "Not authorised for this request"
    });
  }
}

module.exports.verifyUser = verifyUser;
module.exports.verify = verify;