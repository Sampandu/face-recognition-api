const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const knex = require('knex')

const { handleRegister } = require('./handlers/register')
const { handleSignin } = require('./handlers/signin')
const { handleProfileGet } = require('./handlers/profile')

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user:'du',
    password:'',
    database:'face-recognition'
  }
})

const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors())

app.post('/signin', (req, res) => handleSignin(req, res, db, bcrypt))
app.post('/register', (req, res) => handleRegister(req, res, db, bcrypt))
app.get('/profile/:id', (req, res) => handleProfileGet(req, res, db))

app.put('/image', (req, res) => {
  const { id } = req.body
  db('users').where('id', '=', id)
    .increment('submition', 1)
    .returning('submition')
    .then(submition => res.json(submition))
    .catch(err => res.status(400).json('error getting submition'))
})

app.listen(3001, () => {
  console.log('The server is listening on port 3001')
})



