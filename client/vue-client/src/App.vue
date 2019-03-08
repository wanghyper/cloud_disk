<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<style lang="stylus">
  html
  body
    height 100%
    margin  0

  #app
    font-family 'Avenir', Helvetica, Arial, sans-serif
    -webkit-font-smoothing antialiased
    -moz-osx-font-smoothing grayscale
    height 100%
</style>
<script>
  import services from './services'
  export default {
    beforeCreate() {
      services.loginCheck().then((res) => {
        if (res.data.status) {
          this.$store.commit('setUserInfo', res.data.userInfo)
          let userAgent = window.navigator.userAgent.toLowerCase()
          if(!!userAgent.match(/iphone|android/)){
            this.$router.replace('/phone')
          }else{
            this.$router.replace('/home')
          }
        } else {
          this.$router.replace('/login')
        }
      })
    }
  }
</script>