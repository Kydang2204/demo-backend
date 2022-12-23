const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const auth = require('./routes/auth.api.js')

app.use([bodyParser.json(), bodyParser.urlencoded({ extended: true })])
app.use('/', auth)

app.listen(3001)
