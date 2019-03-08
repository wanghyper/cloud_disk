const fs = require('fs')
const config = require('./config')
const db_init = require('./db/sqlite3/init')
const service = require('./db/sqlite3/service')


if(!fs.existsSync(config.folder)){
  fs.mkdirSync(config.folder)
  console.log('create file folder '+ config.folder)
}
db_init().then(res => {
  console.log('database init done')
  console.log('create default user 123')
  new service().createUser({name: 123, password: 123})
})