const express = require('express')
const app = express()
const user = require('./routers/user')

app.use('/test', user)

app.listen(3001, () => {
  console.log('Server is up and running on port numner')
})
