<template>
  <div class="topbar">
    <header>
      <div class="user">
        <i class="icon-user"></i>
        <span>{{$store.state.userInfo.user_name}}</span>
      </div>
      <div class="search">
        <input type="search" placeholder="搜索" v-model="searchText"
               @search="search">
        <i class="icon-search" @click="search"></i>
      </div>
      <div class="logout" @click="logout">
        <i class="icon-exit"></i>
        <span>退出</span>
      </div>
    </header>
    <div class="size">
      <div class="total">
        <div class="current" :style="{width: size.percent}">
          <div class="linear"></div>
        </div>
      </div>
      <div class="number">
        {{size.curSize}}/{{size.total}}
      </div>
    </div>
    <!--分类列表-->
    <div class="fileType">
      <div class="type"
           :class="{curr: index === fileTypeIndex}"
           v-for="(type, index) in fileListType"
           @click="setFileListType(type, index)">
        {{type.alias||type.name}}
        <div class="bar"></div>
      </div>
    </div>


  </div>
</template>

<script>
  import services from '../../services'
  export default {
    name: 'TopBar',
    data() {
      return {
        searchText:'',
        fileListType: [
          {name:'全部文件',id: 'all',alias:'全部'},
          {name:'图片', id:'image'},
          {name:'视频',id: 'video'},
          {name:'文档',id: 'text'},
          {name:'音乐',id: 'audio'}
        ],
        fileTypeIndex: 0,

      }
    },
    methods:{
      getFileList(){
        this.Content.getFileList()
      },
      search() {
        this.$store.commit('setFileListType', {name: '搜索结果', id: 'search', filename: this.searchText})
        this.$store.commit('setCurrentDir', '')
      },
      setFileListType(type, index){
        this.fileTypeIndex = index
        //Content.vue已watch，可自动刷新
        this.$store.commit('setFileListType', type)
        this.$store.commit('setCurrentDir', '')
      },
      formatSize(size) {
        let kb = size / 1000
        if (kb > 1) {
          let mb = kb / 1000
          if (mb > 1) {
            return mb.toFixed(1) + 'M'
          } else {
            return kb.toFixed(1) + 'KB'
          }
        } else {
          return kb + 'B'
        }
      },
      logout() {
        services.logout().then(res => {
          if (res.data.status) {
            this.$store.commit('setUserInfo', {})
            this.$router.replace('./login')
          }
        })
      },

    },
    computed:{
      size(){
        let curSize = this.$store.state.userInfo.size,
          total = this.$store.state.userInfo.total
        return {
          percent: (curSize/total*100).toFixed(1)+'%',
          curSize: this.formatSize(curSize),
          total: this.formatSize(total)
        }
      },
      Content(){
        return this.$parent.$refs.content
      }
    },
    beforeCreate() {
      //设置根字体大小,以宽度为准换算 1rem对应设计值100px
      let designWidth = 375
      function resize(){
        document.querySelector('html').style.fontSize = window.innerWidth/designWidth * 100 + 'px'
      }
      resize()
      window.onresize = resize
    }
  }
</script>

<style scoped lang="stylus">
  @import '../../assets/iconfont.css'
  clientWidth = 375
  a = 0.01rem
  .topbar
    width 100%
    height 100%
    background #f0f0f0
  header
    display flex
    justify-content space-between
    align-items center
    height 45 * a
    width 100%
    box-sizing border-box
    line-height @height
    padding 5*a 5*a
    font-size 16 * a
    .user
      .icon-user:before
        line-height @height
      & span
        vertical-align top
    .search
      position relative
      float right
      height 24*a
      width 200*a
      border-radius 1*a
      border 1px solid #909090
      input
        outline none
        border none
        padding 0
        height @height
        line-height @height
        width @width - 25*a
        vertical-align top
        font-size 14*a
        text-indent 5*a
        margin-right 4*a
        background transparent

      .icon-search:before
        line-height @height
        color #909090

        vertical-align top
    .logout
      & span
        line-height @height
        vertical-align top
      .icon-exit:before
        line-height @height

  .size
    position relative
    padding 0 5*a
    height 15*a
    line-height @height
    font-size 11*a
    .total
      height 100%
      border-radius 10*a
      background rgba(0, 0, 0, 0.2)
      .current
        border-radius 10*a
        width 0
        height 100%
        overflow hidden
        transition width 0.5s
        .linear
          height 100%
          width (clientWidth - 10)*a
          background: linear-gradient(to right, #08ff06, #ff3700)
    .number
      position absolute
      top 0
      left 0
      width 365*a
      text-align center
      color #fff

  .fileType
    display flex
    justify-content space-between
    padding 5*a
    height 30*a
    .type
      display inline-block
      width 70*a
      text-align center
      &.curr .bar
        width 100%
        text-align center
        &:after
          display block
          content ''
          width 20*a
          height 4*a
          margin 3*a auto
          border-radius 2*a
          background #00a8ff

</style>