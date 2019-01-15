const express = require('express')
const bodyParser = require('body-parser')

const database = {
  users: [
    {
      id: 110,
      name: 'Peter',
      email: 'peter@gmail.com',
      password: 1234,
      submition: 0,
      join: new Date()
    },
    {
      id: 111,
      name: 'Lili',
      email: 'lili@gmail.com',
      password: 5678,
      submition: 0,
      join: new Date()
    }
  ]
}



const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.json(database.users)
})

app.post('/signin', (req, res) => {
  if(req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
    res.json('success')
  } else {
    res.status(400).json('fail to login')
  }
})

app.post('/register', (req, res) => {
  const { id, name, email, password} = req.body
  database.users.push({
    id,
    name,
    email,
    password,
    submition: 0,
    join: new Date()
  })
  res.json(database.users[database.users.length - 1])
})

app.get('/profile/:id', (req, res) => {
  const id = Number(req.params.id)
  let found = false
  database.users.forEach(user => {
    if (id === user.id) {
      found = true
      return res.json(user)
    }
  })
  if(!found) res.status(400).json('user not found')
})

app.put('/image', (req, res) => {
  const id = Number(req.body.id)
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

app.listen(3000, () => {
  console.log('The server is listening on port 3000')
})



