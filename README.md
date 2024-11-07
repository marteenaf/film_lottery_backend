# Film Lottery (Back-end)
Backend server for film lottery project. Written with Node.js and Express. Uses MongoDB as a database and ['The Movie Database'](https://www.themoviedb.org/?language=en-GB) as a movie repository.

## Project Setup

Before running this project you will need to :
- Setup a database cluster in MongoDB
- Setup an API key for The Movie Database
- Setup secret tokens for authentication
- Setup an .env file

### Setting up a database in mongo

1. Follow the instructions [here](https://www.mongodb.com/resources/products/fundamentals/create-database) to setup a new db
2. Keep a record of your [connection string](https://www.mongodb.com/docs/manual/reference/connection-string/), username and password for this db
3. Setup the follwing databases and collections:
    - Database: 'auth', collection: 'users'
    - Database: 'local_development', collection: 'lists'

### Setting up an auth key for TMDB

1. Create an account for TMDB [here](https://www.themoviedb.org/signup)
2. Login
3. Follow the link on [this page](https://developer.themoviedb.org/docs/authentication-application) to get an API key
4. Keep a record of your API key

### Setting up secret tokens

1. In a terminal window run the following 

```
node
```
2. Then run:

```
require('crypto).randomBytes(64).toString('hex')
```
3. Exit node session with: Ctrl + C
4. Copy the resulting string. You will need to repeat this process 2 times.

### Setting up a .env file

In the root of the repository add an .env file with the following keys:
```{.env file}
PORT= #port number to run this project
FRONTEND_URL='https://localhost:<PORT for frontend>'
MONGO_URI='' #the end of your datbase connection string (everything after '@' symbol)
MONGO_USERNAME='' #your mongo username
MONGO_PASSWORD='' #your mongo password
MOVIE_DB_KEY='' #your tmdb api key
ACCESS_TOKEN='' #first key generated in the above step
REFRESH_TOKEN='' #second key generated in the above step
```

You will need some of the keys in this file to run the front-end of this project

### Run project locally

To run the project locally:
```
npm install
npm start
```

## Connect Frontend

Once you have successfully run this repository you can follow instructions to run the front-end [here](https://github.com/marteenaf/film_lottery)
