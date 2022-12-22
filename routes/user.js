const express = require('express')
const router = express.Router()
const builder = require('../database')

router.get('/', async (req, res) => {
  const r = await builder('Users').select()
  console.log(r)
  res.send('hello')
})

module.exports = router
