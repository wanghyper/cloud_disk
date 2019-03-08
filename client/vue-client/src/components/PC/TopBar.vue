<template>
  <div class="top">
    <div class="name">我的云盘</div>
    <div class="menu">
      <div>网盘</div>
      <div>分享</div>
      <div>其他资源</div>
      <div>更多</div>
    </div>
    <div class="user">
      <span class="username">
        <i class="icon-user"></i>
        {{$store.state.userInfo.user_name}}
      </span>
      &nbsp;
      <span @click="logout" class="logout">
        <i class="icon-exit"></i>
        退出登录
      </span>
    </div>
  </div>
</template>

<script>
  import services from '../../services'

  export default {
    name: 'TopBar',
    methods: {
      logout() {
        services.logout().then(res => {
          if (res.data.status) {
            this.$store.commit('setUserInfo', {})
            this.$router.replace('./login')
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus">
  .top
    position absolute
    top 0
    left 0
    z-index 20
    box-sizing border-box
    width 100%
    min-width 850px
    height 60px
    color: #fff
    text-align center
    background-color rgba(255, 255, 255, .08)

  .name
    float left
    text-indent 35px
    text-align left
    width 180px
    line-height 60px
    font-size 22px
    color #f9fdff

  .menu
    float left
    width 400px

    & > div
      display inline-block
      width 100px
      line-height 60px
  .user
    float right
    width 200px

    span,i:before
      display inline-block
      height 60px
      vertical-align top
      line-height 60px
    i
      font-size 24px
    .logout
      float right
      margin-right 10px
</style>