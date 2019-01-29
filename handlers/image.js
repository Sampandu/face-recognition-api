const handleImage = (req, res, db) => {
  const { id } = req.body
  db('users').where('id', '=', id)
    .increment('submition', 1)
    .returning('submition')
    .then(submition => res.json(submition))
    .catch(err => res.status(400).json('error getting submition'))
}

module.export = { handleImage }
