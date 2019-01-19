const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const knex = require('knex')

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

app.post('/signin', (req, res) => {
  db.select('email', 'hash')
    .from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if(isValid) {
        return db.select('*')
                  .from('users')
                  .where('email', '=', req.body.email)
                  .then(user => res.status(200).json(user[0]))
      } else {
        res.status(400).json('unable to login')
      }
    })
    .catch(err => res.status(400).json('unable to login'))
})

app.post('/register', (req, res) => {
  const { name, email, password } = req.body
  const hash = bcrypt.hashSync(password)   //hashSync not hash

  db.transaction(trx => {
    trx.insert({email, hash})
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')     //return
                .returning('*')
                .insert({
                  name: name,
                  email: loginEmail[0],
                  joined: new Date()
                })
                .then(user => res.json(user[0]))
        })
      .then(trx.commit)
      .catch(trx.rollback)
  })
  .catch(err => res.status(400).json('unable to register'))
})

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



