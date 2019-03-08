<template>
  <div class="content" :style="clientHeight-ratio*(100+60)+'px'">
    <div class="breadcrumb">
      <span class="dirpath" @click="levelBack" v-show="dirPath.length>0">
        <span>上一级</span> |
      </span>
      <span class="dirpath">
        <span @click="setDirPath('')">{{$store.state.fileListType.name}}</span>
      </span>
      <span v-for="(path,index) in dirPath" class="dirpath level">
        <span @click="setDirPath(index+1)">{{path}}</span>
      </span>
      <div class="selectAll" @click="selectAll">
        <span>全选&nbsp;</span>
        <i :class="[allSelected?'icon-checkbox-checked':'icon-checkbox-unchecked']"></i>
      </div>
    </div>

    <div class="lists"  :style="{height: clientHeight-ratio*(100+60+30)+'px'}">
      <!--空空如也-->
      <div class="list no-content" v-show="fileList.length<1">{{fileTip}}</div>
      <!--文件列表-->
      <div class="list" v-for="(file,index) in fileList">
        <i class="fileType"
           :class="'icon-file-'+classify(file)"></i>
        <div class="info">
          <div class="name">
            <span @click="openFile(file)">{{file.name}}</span>
          </div>
          <span>修改时间：{{file.create_time}}</span>
          <span v-if="file.type!=='folder'">大小：{{formatSize(file.size)}}</span>
        </div>
        <i class="checkbox"
           :class="[file.hasSelected?'icon-checkbox-checked':'icon-checkbox-unchecked']"
           @click="setSelect(index)"></i>
      </div>
    </div>
    <!--tip条-->
    <transition name="tip">
      <div class="tip" v-show="showTip">
        {{tip}}
      </div>
    </transition>
  </div>
</template>

<script>
  import services from '../../services'
  import {mapState} from 'vuex'

  export default {
    name: 'Content',
    props: {
      ratio: Number //宽度比
    },
    data() {
      return {
        clientHeight: window.innerHeight,
        fileList: [],
        fileTip: '加载中',
        sortType: '',
        allSelected: false,
        tip:'',
        showTip:false
      }
    },
    methods: {
      getFileList() {
        services.getFileList(this.fileListType, this.currentDir)
          .then((res) => {
            if (res.data.status) {
              this.fileList = res.data.data;
              if (this.fileList.length < 1) {
                this.fileTip = '空空如也'
              }
              this.sortFile('')
            } else {
              this.$router.replace('/login')
            }
          })
      },
      sortFile(type) {
        let sortFun = null
        if (this.sortType === type && type) {
          return this.fileList.reverse()
        }
        if (type === 'size') {
          sortFun = (a, b) => a.size - b.size
        } else if (type === 'time') {
          sortFun = (a, b) => a.create_time.localeCompare(b.create_time)
        } else {
          sortFun = (a, b) => {
            if (a.type === 'folder' && b.type !== 'folder') {
              return -1
            }
            if (a.type !== 'folder' && b.type === 'folder') {
              return 1
            }
            return a.name.localeCompare(b.name)
          }
        }
        this.fileList.sort(sortFun)
        this.sortType = type
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
      classify(file) {
        if (file.type === 'folder') {
          return file.type
        }
        let types = [
          {type: 'music', extend: /audio/},
          {type: 'picture', extend: /image/},
          {type: 'text', extend: /text/},
          {type: 'video', extend: /video/},
          {type: 'zip', extend: /gzip|tar|zip/},
          {type: 'excel', extend: /excel|sheet/},
          {type: 'word', extend: /msword|document/},
          {type: 'pdf', extend: /pdf/}
        ]
        let res = types.find((element) => {
          return element.extend.test(file.type)
        })
        return res && res.type || 'other'
      },
      openFile(file) {
        let currentFilename = this.currentDir + file.name
        let type = this.classify(file)
        switch (type) {
          case 'picture':
          case 'music':
          case 'text':
          // case 'word':
          case 'video':
          case 'pdf':
            this.$router.push('./player?type='+type
              +'&name='+encodeURIComponent(currentFilename)
              +'&src='+encodeURIComponent(services.getFileUrl(currentFilename)))
            break
          case 'folder':
            this.$store.commit('setCurrentDir', currentFilename)
            this.getFileList()
            break
          default:
            console.log('other')
        }
      },
      setSelect(index) {
        this.allSelected = false
        let file = this.fileList[index]
        this.$set(file, 'hasSelected', !file.hasSelected)
      },
      setDirPath(index) {
        let path = ''
        if (index) {
          path = this.dirPath.slice(0, index).join('/')
        }
        this.$store.commit('setCurrentDir', path)
        this.getFileList()
      },
      levelBack() {
        let path = this.dirPath.slice(0, -1).join('/')
        this.$store.commit('setCurrentDir', path)
        this.getFileList()
      },
      selectAll() {
        this.allSelected = !this.allSelected
        this.fileList.forEach((value) => {
          this.$set(value, 'hasSelected', this.allSelected)
        })
      },
      deleteFile() {
        if(this.selectedFiles.length<1){
          this.showToast('请先勾选要删除的项')
          return
        }
        if (!confirm('确定要删除'+this.selectedFiles.length+'项?')) {
          return
        }
        this.allSelected = false
        let files = this.selectedFiles
          .map(value => ({name: value.name, path: value.path}))
        services.deleteFile(files)
          .then((res) => {
            this.$store.commit('setUserInfo', res.data)
            this.getFileList()
          })
      },
      downloadFile() {
        if(this.selectedFiles.length<1){
          this.showToast('请先勾选要下载的项')
          return
        }
        let files = this.selectedFiles
        if (files.length > 1 && !confirm('确定要一次下载多个文件?')) {
          return
        }
        files.forEach(value => {
          if(value.type==='folder'){
            this.showToast('暂不支持文件夹下载')
            return
          }
          let a = document.createElement("a");
          a.style.display = "none"
          a.style.height = 0
          a.download = value.name
          a.href = services.getFileUrl(
            this.currentDir + value.name)
          document.body.appendChild(a)
          a.click()
          setTimeout(() => {
            a.remove()
          }, 5 * 1000)
        })
      },
      showToast(msg){
        clearTimeout(this.timer)
        this.tip = msg
        this.showTip = true
        this.timer = setTimeout(()=>{
          this.showTip = false
        }, 1000)
      }
    },
    computed: {
      dirPath() {
        let path = this.$store.state.currentDir.split('/')
        path.splice(-1, 1)
        return path
      },
      selectedFiles() {
        return this.fileList.filter(value => value.hasSelected)
      },
      ...mapState(['currentDir', 'fileListType', 'userInfo'])
    },
    watch: {
      fileListType(){
        this.getFileList()
      }
    },
    created() {
      this.clientHeight = window.innerHeight
      this.getFileList()
    }
  }
</script>

<style scoped lang="stylus">
  clientWidth = 375
  a = 0.01rem
  .content
    color #111
  .breadcrumb
    height 30*a
    width 100%
    box-sizing border-box
    line-height @height
    font-size 11*a
    background: #fff
    padding 0 5*a
    border-bottom 1px solid #f4f4f4
    .dirpath
      span
        padding 1*a 3*a
        border-radius 10*a
        background: #f0f0f0
      &.level:before
        content " > "
    .selectAll
      float right
      font-size 16*a
      i:before
        display inline-block
        width 30*a
        line-height @height
        vertical-align top

  .lists
    padding 0 5 *a
    overflow-y auto
    .list
      border-bottom 1px solid #f4f4f4
      &.no-content
        line-height 90*a
        text-align center
        color #666888
        border-bottom none

    .fileType
      display inline-block
      height 50 *a
      line-height @height
      font-size 30 *a
      vertical-align top
      color #0087ff
      &.icon-file-folder
        color #e0a964


    .info
      display inline-block
      padding-left 5*a
      height 50 *a
      vertical-align top
      .name
        height 35 *a
        width 280*a
        overflow hidden
        line-height @height
        text-overflow ellipsis
        white-space nowrap


      &>span
        font-size 11 *a
        line-height @font-size
        color #4c4c4c
        padding-right 18 *a
        vertical-align top



    .checkbox:before
      display inline-block
      float right
      width 30*a
      height 50 *a
      line-height @height

  .tip
    position absolute
    right 0
    top 100*a
    z-index 100
    height 20*a
    line-height @height
    padding 5*a 10*a
    color: #fff
    border-top-left-radius 15*a
    border-bottom-left-radius 15*a
    background: #008fff
    .tip-enter-active,.tip-leave-active
      transition all 0.5s
    .tip-enter,.tip-leave-to
      opacity  0
</style>