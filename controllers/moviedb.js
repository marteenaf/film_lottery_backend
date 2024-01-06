async function queryMovieDatabase(url) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + process.env.MOVIE_DB_KEY
    }
  }
  const result = await fetch(url, options)
    .then(response => response.json())
    .catch(err => console.error(err));
  return result;
}

async function forwardRequest(req, res, next) {
  console.log("------------CONNECT TO MOVIE DB------------");
  if (req.body?.url) {
    const dbResult = await queryMovieDatabase(req.body.url);
    if (dbResult) {
      res.send(dbResult).status(200);
    } else {
      res.status(400).send("Error in url");
    }
  } else {
    res.status(400).send("No url found in request");
  }
}

module.exports.forwardRequest = forwardRequest;