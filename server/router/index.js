const Files = require('./files')
const User = require('./user')
const router = require('koa-router')()

router
  .get('/api/getFileList', Files.getFileList)
  .get('/api/getTypeFileList', Files.getTypeFileList)
  .get('/api/getFile/*', Files.sendFile)
  .post('/api/uploadFile', Files.uploadFile)
  .get('/api/createDir',Files.createDirectory)
  .delete('/api/deleteFile', Files.deleteFile)
  // .get('/api/renameFile', Files.renameFile)
  .delete('/api/logout', User.logout)
  .get('/api/searchFile', Files.searchFile)
module.exports = router