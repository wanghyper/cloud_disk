const sqlite3 = require('sqlite3').verbose()

class DAO {
  constructor(dbFilePath) {
    this.db = new sqlite3.Database(dbFilePath, (err) => {
      if (err) {
        console.log('Could not connect to database', err)
      } else {
        console.log('Connected to database')
      }
    })
  }
  
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          console.log('Error running sql ' + sql)
          console.log(err)
          reject(err)
        } else {
          resolve({id: this.lastID})
        }
      })
    })
  }
  
  get(sql, params = []) {
    console.log(sql)
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, result) => {
        if (err) {
          console.log('Error running sql: ' + sql)
          console.log(err)
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }
  
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          console.log('Error running sql: ' + sql)
          console.log(err)
          reject(err)
        } else {
          resolve(rows)
        }
      })
    })
  }
  
  insert({table, data}){
    const sql =
      `INSERT INTO ${table} (${Object.keys(data).join(',')})
        VALUES (${Object.values(data).join(',')})`
     return this.run(sql,)
  }
  update({table, data, where}) {
    return this.run(
      `UPDATE ${table} SET
      ${Object.entries(data).map(value =>  value.join('=')).join(',')}
      WHERE
      ${Object.entries(where).map(value =>  value.join('=')).join(' AND ')}`
    )
  }
  delete({table, where}) {
    return this.run(
      `DELETE FROM  ${table} WHERE
      ${Object.entries(where).map(value =>  value.join('=')).join(' AND ')}`
    )
  }
  query({table, where}){
    return this.get(
      `SELECT * FROM ${table} WHERE
      ${Object.entries(where).map(value =>  value.join('=')).join(' AND ')}`
    )
  }
  queryAll({table, where}){
    return this.all(
      `SELECT * FROM ${table} WHERE
      ${Object.entries(where).map(value =>  value.join('=')).join(' AND ')}`
    )
  }
}

module.exports = DAO