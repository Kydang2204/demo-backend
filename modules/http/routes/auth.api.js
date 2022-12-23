const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const knex = require('../../../database')

router.post('/sign-up', async (req, res) => {
  const { email, password, firstName, lastName } = req.body
  let result = _checkPassword(password)
  if (!result.valid) {
    return res.status(400).json(result)
  }

  result = await _checkEmail(email)
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

async function _checkEmail (email) {
  const partern = /\S+@\S+\.\S+/
  const valid = partern.test(email)
  if (!valid) {
    return {
      valid: false,
      reason: 'Email format is wrong'
    }
  }

  const user = await knex('Users').where('email', email).first()
  if (user) {
    return {
      valid: false,
      reason: 'Email is dupplicated'
    }
  }
  return { valid: true }
}

function _checkPassword (pw) {
  if (!pw || (pw.length <= 8 && pw.length >= 20)) {
    return {
      valid: false,
      reason: 'Password must be between 8-20 characters'
    }
  }
  return { valid: true }
}

module.exports = router
