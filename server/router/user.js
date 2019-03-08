const fs = require('fs')
const path = require('path')
const koaBody = require('koa-body')
const db = require('../db')

module.exports = {
  async userCheck(ctx, next) {
    if (ctx.url === '/api/login') {
      if (ctx.method === 'POST') { //post密码用户名登录
        await koaBody()(ctx, next)
        let {username, password} = ctx.request.body
        if (!username || !password) {
          ctx.body = {status: false}
          return
        }
        let hasLogin = await db.userCheck({name: username, password})
        if (!hasLogin) {
          ctx.body = {status: false}
          return
        }
        ctx.session.user = username
      } else if (ctx.method === 'GET') {//获取登录信息
        if (!ctx.session.user) {
          ctx.body = {status: false, msg: '请先登录'}
          return
        }
      }
      let diskStatus = await db.getDiskSize(ctx.session.user)
      ctx.body = {
        status: true,
        userInfo: diskStatus
      }
    } else {
      if (ctx.session.user) {
        await next()
      } else {
        ctx.body = {status: false, msg: '请先登录'}
      }
    }
  },
  logout(ctx) {
    if (ctx.session.user) {
      ctx.session.user = null
      ctx.body = {status: true}
    } else {
      ctx.body = {status: false}
    }
  }
}
