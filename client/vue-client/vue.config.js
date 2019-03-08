module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/',
  productionSourceMap: false,
  devServer: {
    host: '0.0.0.0',
    proxy:{
      '/api':{
        target: 'http://localhost:3000',
        // pathRewrite: {'^/api' : ''}
      }
    }
  }
}