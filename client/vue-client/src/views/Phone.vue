<template>
  <div class="phone">
    <TopBar ref="topbar"></TopBar>
    <Content :ratio="ratio" ref="content"></Content>
    <BottomBar ref="bottombar"></BottomBar>
  </div>
</template>

<script>
  import TopBar from '@/components/phone/TopBar.vue'
  import Content from '@/components/phone/Content.vue'
  import BottomBar from '@/components/phone/BottomBar.vue'
  export default {
    name: 'Phone',
    components:{TopBar,Content,BottomBar},
    data() {
      return {
        contentHeight: 0
      }
    },
    created() {
      //设置根字体大小,以宽度为准换算 1rem对应设计值100px
      let designWidth = 375
      let ratio = window.innerWidth/designWidth

      let resize = () => {
        this.ratio = ratio
        document.querySelector('html').style.fontSize = ratio * 100 + 'px'
      }
      resize()
      window.onresize = resize
    },
    methods:{
      invoke(method, args){
        let content = this.$refs.content
        typeof content[method] === 'function' && content[method](args)
      }
    }
  }
</script>

<style scoped lang="stylus">
  a = 0.01rem
  .phone
    font-size 16 * a
    user-select none
    overflow hidden//防止滚动穿透
</style>