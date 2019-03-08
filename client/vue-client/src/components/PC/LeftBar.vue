<template>
  <div class="left">
    <div v-for="(type,index) in fileListType"
         @click="setFileListType(type)"
         class="type"
         :class="{curr: $store.state.fileListType.id === type.id}">
      {{type.name}}
    </div>
    <div class="size">
      <span>云盘空间：</span>
      <div class="total">
        <div class="current"
             :style="{width: size.percent}">
          <div class="linear"></div>
        </div>
      </div>
      <div class="number">
        {{size.curSize}}/{{size.total}}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'LeftBar',
    props: {
      currIndex: Number
    },
    data() {
      return {
        fileListType: [
          {name:'全部文件',id: 'all'},
          {name:'图片', id:'image'},
          {name:'视频',id: 'video'},
          {name:'文档',id: 'text'},
          {name:'音乐',id: 'audio'}
        ]
      }
    },
    methods:{
      setFileListType(type){
        this.$store.commit('setFileListType', type)
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
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .left
    position absolute
    top 0
    left 0
    z-index 10
    box-sizing border-box
    font-size 18px
    color: #fff
    width 180px
    height 100%
    padding-top 60px
    background-color rgba(255, 255, 255, .2)
    background-clip content-box

    & .type
      width 100%
      text-indent 35px
      line-height 45px

      &:hover
        background: rgba(255, 251, 255, 0.1)
      &.curr
        color: #00a8ff
        background rgba(255, 251, 255, 0.6)
  .size
    position absolute
    bottom 50px
    left 0
    padding-left 30px

    .total
      width 120px
      height 10px
      border-radius 5px
      box-shadow 0 0 1px 1px #e4e2e2
      background: rgba(255, 255, 255, 0.5)
      .current
        border-radius 5px
        height 100%
        overflow hidden
        .linear
          height 100%
          width 120px
          background: linear-gradient(to right, #08ff06, #ff3700)
    &>span,
    .number
      font-size 14px
      color #646464
      line-height 20px
</style>