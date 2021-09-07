import * as express from "express"
const app = express.default()

app.get('/api/chooseUserName', (req, res) => {
  return res.status(200).send('experip!')
})

module.exports = app
