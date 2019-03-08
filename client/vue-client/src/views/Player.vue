<template>
  <div class="player">
    <h5>{{name}}</h5>
    <video :src="src" v-if="type==='video'" controls></video>
    <audio :src="src" v-else-if="type==='music'" controls></audio>
    <img :src="src" alt="" v-else-if="type==='picture'">
    <iframe :src="src" frameborder="0" v-else-if="type" width="100%" height="100%"></iframe>
  </div>
</template>

<script>
  export default {
    name: 'Player',
    data() {
      return {
        type: '',
        src: '',
        name: ''
      }
    },
    created() {
      this.type = this.$route.query.type
      this.src = this.$route.query.src
      this.name = this.$route.query.name
    }
  }
</script>

<style scoped>
  .player {
    font-size: 16px;
    width: 100%;
    height: 100%;
    text-align: center;
    overflow: auto;
  }
  video{
    width: 100%;
  }
</style>