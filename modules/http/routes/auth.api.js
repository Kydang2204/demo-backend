const express = require('express')
const bcrypt = require('bcrypt')
const knex = require('../../../database')
const jwt = require('jsonwebtoken')
const cookie = require('cookie')
const expressjwt = require('express-jwt')
const auth = require('../helpers/auth.js')
const router = express.Router()

const cookieOpts = {
  httpOnly: true,
  secure: false,
  domain: 'localhost',
  path: '/',
  sameSite: false
}

router.post('/sign-up', async (req, res) => {
  const { email, password, firstName, lastName } = req.body
  let result = auth.checkPasswordLength(password)
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
      email: email.toLowerCase(),
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

router.post('/sign-in', async (req, res) => {
  const { email, password } = req.body

  let result = auth.checkEmailFormat(email)
  if (!result.valid) {
    return res.status(400).json(result)
  }

  result = auth.checkPasswordLength(password)

  if (!result.valid) {
    return res.status(400).json(result)
  }

  const user = await knex('Users').where('email', email.toLowerCase()).first()
  result = await bcrypt.compare(password, user.password)
  if (!result) {
    return res.status(400).json({
      valid: false,
      reason: 'Password is wrong'
    })
  }

  const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
  const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' })

  const createdAt = new Date().toISOString().replace('Z', '').replace('T', ' ')
  await knex('Tokens').insert({
    userId: user.id,
    refreshToken,
    expiresIn: new Date(Date.now() + 30 * 864e5).toISOString(),
    createdAt,
    updatedAt: createdAt
  })

  res.cookie('accessToken', accessToken, cookieOpts)
  return res.status(200).json({
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email,
      displayName: user.firstName + ' ' + user.lastName
    },
    accessToken,
    refreshToken
  })
})

module.exports = router
