const handleImage = (req, res, db) => {
  const { id } = req.body
  console.log('endPoint', id)
  db('users').where('id', '=', id)
    .increment('submition', 1)
    .returning('submition')
    .then(submition => res.json(submition))
    .catch(err => res.status(400).json('error getting submition'))
}

module.exports = { handleImage }
