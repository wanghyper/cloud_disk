<template>
  <div class="login">
    <h1>欢迎登录</h1>
    <div class="panel">
        <input type="text" v-model="username" placeholder="用户名">
      <br>
        <input type="password" v-model="password" placeholder="密码">
      <div class="tip">{{tip}}</div>
      <button @click="commit">登录</button>
    </div>
  </div>
</template>
<script>
  import services from '../services'

  export default {
    name: 'login',
    data() {
      return {
        username: '',
        password: '',
        tip: ''
      }
    },
    methods: {
      commit() {
        if(!this.username || !this.password){
          this.tip = '请填写用户名或密码!'
          return
        }
        services.login({username: this.username, password: this.password}).then((res) => {
          if (res.data.status) {
            this.$store.commit('setUserInfo', res.data.userInfo)
            let userAgent = window.navigator.userAgent.toLowerCase()
            if(!!userAgent.match(/iphone|android/)){
              this.$router.replace('/phone')
            }else{
              this.$router.replace('/home')
            }
          } else {
            this.tip = '用户名或密码错误!'
          }
        })
      }
    }
  }
</script>
<style lang="stylus">
  h1
    color: #2f2f2f
    font-size 28px

  .login
    display flex
    flex-direction column
    justify-content center
    align-items center
    height 100%
    background-color #6ce8dd

    .panel
      font-size 16px
      margin 0
      width 300px
      padding 15px 25px
      background-color rgba(244, 244, 244, .25)

      input
      button
        font-size 18px
        margin 10px 0
        box-sizing border-box
        outline none
        width 100%
        border none
        padding 10px 16px
        border-radius 4px
        background-color rgba(255, 255, 255, .35)

      input
        box-shadow 0 0 1px 1px #b4b4b4

        &:focus
          box-shadow 0 0 1px 1px #008fff

      button
        color #ffffff
        background #1ab9e0

        &:hover
          background #1ed3ff

      .tip
        margin 0
        font-size 14px
        line-height 1.5em
        height 1.5em
        color red
        text-align center


</style>