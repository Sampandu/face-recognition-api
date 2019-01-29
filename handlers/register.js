const handleRegister = (req, res, db, bcrypt) => {
    const { name, email, password } = req.body

    //input validation
    if (!name || !email || !password) {
      return res.status(400).json('incorrect form submittion')
    }

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
}

module.exports = { handleRegister }

