const express = require('express')
const bcrypt = require('bcrypt')
const knex = require('../../../database')
const auth = require('../helpers/auth.js')
const router = express.Router()

router.post('/sign-up', async (req, res) => {
  const { email, password, firstName, lastName } = req.body
  let result = auth.checkPassword(password)
  if (!result.valid) {
    return res.status(400).json(result)
  }

  result = await auth.checkEmail(email)
  if (!result.valid) {
    return res.status(400).json(result)
  }

  const createdAt = new Date().toISOString().replace('Z', '').replace('T', ' ')
  try {
    await knex('Users').insert({
      email,
      password: await bcrypt.hash(password, 10),
      firstName,
      lastName,
      createdAt,
      updatedAt: createdAt
    })
    const result = await knex('Users').where('email', email).first()

    return res.status(201).json({
      id: result.id,
      firstName,
      lastName,
      email,
      displayName: firstName + ' ' + lastName
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: 'An internal error is occurring' })
  }
})

module.exports = router
