const koa = require('koa')
const koa2_cors = require('koa2-cors')
const session = require('koa-session')
const _static = require('koa-static')

const User = require('./router/user')
const app = new koa()
const router = require('./router')

app.use(_static('./client'))
// app.use(koa2_cors({
//   origin: function(ctx) {
//     if (ctx.url === '/test') {
//       return false;
//     }
//     return ctx.request.header.origin;
//   },
//   credentials: true
// }))

app.keys = ['beautiful flowers'];
const CONFIG = {
  key: 'iceyue:disk', /** (string) cookie key (default is koa:sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000,
  autoCommit: true, /** (boolean) automatically commit headers (default true) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};
app.use(session(CONFIG, app));

app.use(User.userCheck);

app.use(router.routes())
  .use(router.allowedMethods())



app.on('error', err => {
  console.error('server error', err)
});
let port = 3000
app.listen(port, function () {
  console.log('server start at', port)
})