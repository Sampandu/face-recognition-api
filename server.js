const express = require('express')
const bodyParser = require('body-parser')

const database = {
  users: [
    {
      name: 'Peter',
      email: 'peter@gmail.com',
      password: 1234,
      submition: 0,
      join: new Date()
    },
    {
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
  res.send('<h1>server is working</h1>')
})

app.post('/signin', (req, res) => {
  if(req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
    res.json('success')
  } else {
    res.status(400).json('fail to login')
  }
})

app.post('/register', (req, res) => {
  const {name, email, password} = req.body
  database.users.push({
    name,
    email,
    password,
    submition: 0,
    join: new Date()
  })
  res.json(database.users[database.users.length - 1])
})

app.listen(3000, () => {
  console.log('The server is listening on port 3000')
})



