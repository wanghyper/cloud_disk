<template>
  <div class="home">
    <TopBar/>
    <LeftBar :currIndex="0"></LeftBar>
    <Content></Content>
  </div>
</template>

<style lang="stylus">
  .home {
    font-size 16px
    width 100%
    height 100%
    min-width 850px
    background-image url("../assets/bg-cloudsky.jpg")
    background-size cover
    user-select none
  }
</style>
<script>
  // @ is an alias to /src
  import TopBar from '@/components/PC/TopBar.vue'
  import LeftBar from '@/components/PC/LeftBar.vue'
  import Content from '@/components/PC/Content.vue'

  export default {
    name: 'home',
    components: {
      TopBar,
      LeftBar,
      Content
    },
    methods: {},

  }
</script>
