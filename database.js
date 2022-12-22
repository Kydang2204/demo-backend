const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: '178.128.109.9',
    port: 3306,
    user: 'test01',
    password: 'PlsDoNotShareThePass123@',
    database: 'entrance_test'
  }
})

module.exports = knex
