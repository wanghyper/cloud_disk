<template>
  <div class="searchbar">
    <label>
      <input type="text" v-model="filename" placeholder="请输入关键字">
      <button @click="search">搜索</button>
    </label>
  </div>
</template>

<script>
  export default {
    name: 'SearchBar',
    data() {
      return {
        filename: ''
      }
    },
    methods: {
      search() {
        //在Content.vue已经watch
        this.$store.commit('setFileListType', {name: '搜索结果', id: 'search', filename: this.filename})
      }
    }
  }
</script>
<style scoped lang="stylus">
  label
    display inline-block
    height 30px
    line-height @height

  input,
  button
    outline none
    line-height 30px
    padding 0
    color #478de4
    border-radius 4px
    border 1px solid #478de4
    background-color rgba(255, 255, 255, .35)

  input
    box-sizing border-box
    padding 0 5px
    float left
    width 150px
    border-bottom-right-radius 0
    border-top-right-radius 0
    &:focus,
    &:focus + button
      border-color #00a8ff


  button
    box-sizing border-box
    padding 0 3px
    float right
    font-size 14px
    width 40px
    border-bottom-left-radius 0
    border-top-left-radius 0
    border-left 0
    &:hover
      color #00a8ff
</style>