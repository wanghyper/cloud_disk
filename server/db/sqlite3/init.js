const DAO = require('./dao')
const dbPath = require('../config').dbPath

const dao = new DAO(dbPath)
module.exports = async function () {
  const tables = {
    user_sql: `
      CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE ,
        password TEXT)`,
    file_sql: `
      CREATE TABLE IF NOT EXISTS file (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        name        TEXT,
        size        NUMBER,
        type        TEXT,
        path        TEXT,
        user_name   TEXT,
        create_time DATETIME)`,
    size_sql: `
      CREATE TABLE IF NOT EXISTS size (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        user_name        TEXT,
        size        NUMBER,
        total       NUMBER
        )`
  }
  let tasks = Object.entries(tables).map(async value => {
    await dao.run(value[1])
    console.log('run '+ value[0])
  })
  await Promise.all(tasks)
}
