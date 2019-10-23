require('../secrets');
const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: process.env.Clarifai_apikey,
});

const handleAPIcall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(response => res.json(response))
    .catch(err => console.log(err));
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users')
    .where('id', '=', id)
    .increment('submition', 1)
    .returning('submition')
    .then(submition => res.json(submition))
    .catch(err => res.status(400).json('error getting submition'));
};

module.exports = { handleImage, handleAPIcall };
