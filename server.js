const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const { handleRegister } = require('./handlers/register');
const { handleSignin } = require('./handlers/signin');
const { handleProfileGet } = require('./handlers/profile');
const { handleImage, handleAPIcall } = require('./handlers/image');

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  },
});

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => res.send('heroku works'));
app.post('/signin', (req, res) => handleSignin(req, res, db, bcrypt));
app.post('/register', (req, res) => handleRegister(req, res, db, bcrypt));
app.get('/profile/:id', (req, res) => handleProfileGet(req, res, db));
app.put('/image', (req, res) => handleImage(req, res, db));
app.post('/imageurl', (req, res) => handleAPIcall(req, res));

app.listen(process.env.PORT || 3001, () => {
  console.log(`The server is listening on port ${process.env.PORT} `);
});
