const knex = require('../../../database')

module.exports.checkEmail = async (email) => {
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

module.exports.checkPassword = (pw) => {
  if (!pw || (pw.length <= 8 && pw.length >= 20)) {
    return {
      valid: false,
      reason: 'Password must be between 8-20 characters'
    }
  }
  return { valid: true }
}
