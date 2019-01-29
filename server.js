const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const knex = require('knex')

const { handleRegister } = require('./handlers/register')
const { handleSignin } = require('./handlers/signin')

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

app.get('/profile/:id', (req, res) => {
  const id = Number(req.params.id)
  db.select('*').from('users').where({id})
    .then(user => {
      if(user.length) res.json(user)
      else res.status(400).json('user not found')
    })
    .catch(err => res.status(400).json('error'))
})

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



