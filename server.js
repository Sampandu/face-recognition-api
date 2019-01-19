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

const database = {
  users: [
    {
      id: '110',
      name: 'Peter',
      email: 'peter@gmail.com',
      password: '1234',
      submition: 0,
      join: new Date()
    },
    {
      id: '111',
      name: 'Lili',
      email: 'lili@gmail.com',
      password: '5678',
      submition: 0,
      join: new Date()
    }
  ]
}

const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
  res.json(database.users)
})

app.post('/signin', (req, res) => {
  if(req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
    res.status(200).json(database.users[0])
  } else {
    res.status(400).json('fail to login')
  }
})

app.post('/register', (req, res) => {
  const { name, email } = req.body
  db('users')
    .returning('*')
    .insert({
      name: name,
      email: email,
      joined: new Date()
    })
    .then(user => res.json(user[0]))
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
  let found = false
  database.users.forEach(user => {
    if(id === user.id) {
      found = true
      user.submition++
      return res.json(user.submition)
    }
  })
  if(!found) res.status(400).json('user not found')
})

app.listen(3001, () => {
  console.log('The server is listening on port 3000')
})



