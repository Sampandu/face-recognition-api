const handleProfileGet = (req, res, db) => {
  const id = Number(req.params.id)
  db.select('*').from('users').where({id})
    .then(user => {
      if(user.length) res.json(user)
      else res.status(400).json('user not found')
    })
    .catch(err => res.status(400).json('error'))
}

module.exports = { handleProfileGet }
