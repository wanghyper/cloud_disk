const DAO = require('./dao')
const dbPath = require('../config').dbPath
const wrapper = require('../../utils').wrapperString
const config = require('../../config')

let file_table = 'file', user_table = 'user', size_table = 'size'
module.exports = class Service extends DAO {
  constructor() {
    super(dbPath)
  }
  
  createUser({name, password}) {
    console.log('insert user done')
    return Promise.all([
      this.insert({
        table: user_table,
        data: {
          name: wrapper(name),
          password: wrapper(password)
        }
      }),
      this.insert({
        table: size_table,
        data: {
          user_name: wrapper(name),
          size: 0,
          total: config.diskSize
        }
      })
    ])
  }
  updateSize(user_name, size){
    return this.update({
      table: size_table,
      data: {
        size,
      },
      where: {user_name:wrapper(user_name)}
    })
  }
  async getDiskSize(user_name){
    let res = await this.get(`SELECT SUM(SIZE) AS currentSize FROM file WHERE user_name='${user_name}'`)
    await this.updateSize(user_name, res.currentSize||0)
    return this.query({table: size_table, where: {user_name: wrapper(user_name)}})
  }
  userCheck({name, password}) {
    return this.query({table: user_table, where: {name: wrapper(name), password: wrapper(password)}})
  }
  
  updateFile({id, name, size, type, path, user_name, create_time}) {
    return this.update({
      table: file_table,
      data: {
        name: wrapper(name),
        size,
        type: wrapper(type),
        path: wrapper(path),
        user_name: wrapper(user_name),
        create_time: wrapper(create_time)
      },
      where: {id}
    })
  }
  
  insertFile({name, size, type, path, user_name, create_time}) {
    return this.insert({
      table: file_table,
      data: {
        name: wrapper(name),
        size,
        type: wrapper(type),
        path: wrapper(path),
        user_name: wrapper(user_name),
        create_time: wrapper(create_time)
      }
    })
  }
  
  deleteFileByPath({user_name, path}) {
    return this.run(`DELETE FROM ${file_table} WHERE PATH LIKE '${path}%' AND user_name = '${user_name}'`)
  }
  
  deleteFileByName({name, path, user_name}) {
    return this.delete({table:file_table, where: {name: wrapper(name), path: wrapper(path), user_name: wrapper(user_name)}});
  }
  
  getFileList({user_name, path}) {
    return this.queryAll({table: file_table, where: {user_name: wrapper(user_name), path: wrapper(path)}})
  }
  getTypeFileList(type){
    let sql = `SELECT * FROM ${file_table} WHERE TYPE LIKE '${type}%'`
    console.log(sql)
    return this.all(sql)
  }
  searchFile(filename){
    let sql = `SELECT * FROM ${file_table} WHERE name LIKE '%${filename}%'`
    console.log(sql)
    return this.all(sql)
  }
}

// new Service(dbPath).userCheck({name:123,password:123}).then(res =>{
//   console.log(res)
// })