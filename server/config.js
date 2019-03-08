const path = require('path')

module.exports = {
  folder: path.join(__dirname, './files'),
  maxFieldsSize: 100 * 1024 * 1024, //上传文件大小
  diskSize: 500 * 1000 * 1000 //网盘总大小
}