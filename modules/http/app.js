require('dotenv-safe').config()
const express = require('express')
const bodyParser = require('body-parser')
const { expressjwt: expressJwt } = require('express-jwt')
const app = express()
const auth = require('./routes/auth.api.js')
app.use([bodyParser.json(), bodyParser.urlencoded({ extended: true })])

app.use('/', expressJwt({
  secret: process.env.ACCESS_TOKEN_SECRET,
  algorithms: ['HS256']
}).unless({ path: ['/sign-in', '/sign-up'] }))

app.use('/', auth)

app.listen(3001)
