const express = require('express')
const bodyParser = require('body-parser');

const app = express()
const user = require('./routes/user')
app.use([ bodyParser.json(), bodyParser.urlencoded({ extended: true }) ]);
app.use('/test', user)

app.listen(3001, () => {
  console.log('Server is up and running on port numner')
})
