const express = require('express')
const router = express.Router()
const builder = require('../database')

router.post('/', async (req, res) => {
  /*await builder('Users').insert({
    firstName: 'NAM',
    lastName: 'NGUYEN',
    email: 'cuongnc@nexlesoft.com',
    password: '1234',
  })
*/
console.log(req.body)
  //const r = await builder('Users').select()
  //console.log(r)
  res.send("d,d")
})

module.exports = router
