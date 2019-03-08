const fs = require('fs')
const koaBody = require('koa-body')
const mime = require('mime')
const db = require('../db')
const config = require('../config')
const Path = require('path')
const folder = config.folder
const utils = require('../utils')
module.exports = {
  async getFileList(ctx) {
    let filepath = Path.resolve(folder, ctx.session.user + '/' + ctx.request.query.path)
    if (!fs.existsSync(filepath)) {
      fs.mkdirSync(filepath)
    }
    ctx.body = {
      status: true,
      data: await db.getFileList({user_name: ctx.session.user, path: ctx.request.query.path})
    }
  },
  async getTypeFileList(ctx) {
    let type = ctx.request.query.type
    let res = await db.getTypeFileList(type)
    ctx.body = {
      status: true,
      data: res
    }
  },
  sendFile(ctx) {
    let filename = ctx.params[0];
    let filepath = Path.resolve(folder, ctx.session.user + '/' + filename)
    if (fs.existsSync(filepath)) {
      if(fs.statSync(filepath).isDirectory()){
        ctx.body = '暂不支持文件夹下载'
        return
      }
      ctx.res.setHeader('Content-Type', mime.getType(filename))
      ctx.body = fs.createReadStream(filepath)
    } else {
      ctx.body = '文件不存在'
    }
  },
  async uploadFile(ctx, next) {
    try {
      let diskSize = await db.getDiskSize(ctx.session.user)
      if(diskSize.size>=diskSize.total){
        ctx.body = {status:false, msg:'网盘空间已满'}
        return
      }
      await koaBody({
        multipart: true, // 支持文件上传
        formidable: {
          uploadDir: folder, // 设置文件上传目录
          keepExtensions: true,    // 保持文件的后缀
          maxFieldsSize: config.maxFieldsSize, // 单个文件上传大小
          onFileBegin(name, file) { // 文件上传前的设置
            file.path =  Path.join(folder, ctx.session.user + '/' + ctx.query.path + '/' + decodeURIComponent(ctx.query.filename))
          }
        }
      })(ctx, next)
      let file = ctx.request.files.uploadFile
      console.log('write file:', file.path)
      await db.insertFile({
        name: decodeURIComponent(ctx.query.filename),
        size: file.size,
        type: mime.getType(file.name),
        path: ctx.query.path,
        user_name: ctx.session.user,
        create_time: utils.formatDateTime(file.lastModifiedDate)
    
      })
      ctx.body = await db.getDiskSize(ctx.session.user)
    }catch (e) {
      console.error(e)
      ctx.body = {status: false}
    }
  },
  createDirectory(ctx, next) {
    let {path, dirname} = ctx.request.query
    let dir = Path.resolve(folder, ctx.session.user + '/' + path + dirname)
    if (fs.existsSync(dir)) {
      ctx.body = {status: false, msg: '文件夹已存在'}
    } else {
      fs.mkdirSync(dir)
      db.insertFile({
        name: dirname,
        user_name: ctx.session.user,
        type: 'folder',
        path,
        size: 0,
        create_time: utils.formatDateTime(new Date())
      })
      console.log('created dir', dir)
      ctx.body = {status: true, msg: '完成'}
    }
  },
  async deleteFile(ctx, next) {
    await koaBody({strict: false})(ctx, next)
    let files = ctx.request.body.files
    for (let i = 0; i < files.length; i++) {
      let file = files[i]
      let dir = Path.resolve(folder, ctx.session.user + '/' + file.path + '/' + file.name)
      if (fs.existsSync(dir)) {
        await db.deleteFileByName({name: file.name, path: file.path, user_name: ctx.session.user})
        let stat = fs.statSync(dir)
        if (stat.isDirectory()) {
          await db.deleteFileByPath({path: file.path + file.name + '/', user_name: ctx.session.user})
          deleteFolder(dir)
          console.log('delete dir', dir)
        } else {
          fs.unlinkSync(dir)
          console.log('delete file', dir)
        }
      } else {
      }
    }
    ctx.body = await db.getDiskSize(ctx.session.user)
  },
  // renameFile(ctx) {
  //   let old_dir = Path.resolve(folder, ctx.session.user + '/' + ctx.request.query.oldfilename)
  //   let new_dir = Path.resolve(folder, ctx.session.user + '/' + ctx.request.query.newfilename)
  //   if (fs.existsSync(old_dir)) {
  //     fs.renameSync(old_dir, new_dir)
  //     console.log('rename file', old_dir, '\n', new_dir)
  //     ctx.body = 'done'
  //   } else {
  //     ctx.body = 'not exist'
  //   }
  // },
  async searchFile(ctx){
    let filename = ctx.request.query.filename
    ctx.body = {
      status: true,
      data:await db.searchFile(filename)
    }
  }
  
}

var deleteFolder = function (path) {
  var files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(function (filename, index) {
      var curPath = path + "/" + filename;
      if (fs.statSync(curPath).isDirectory()) { // recurse
        deleteFolder(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};