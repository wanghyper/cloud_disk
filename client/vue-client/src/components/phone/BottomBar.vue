<template>
  <footer class="bottombar">
    <div class="mask" v-show="activeClass!==''" @click="hideUploadList($event)">
      <!--上传-->
      <div class="wrapper" v-show="activeClass==='upload'">

        <div class="choseFile">
          <div class="uploader">
            <i class="icon-upload"></i>
            <span>选择文件</span>
            <input type="file" multiple
                   @change="setUploadFiles($event)">
          </div>
        </div>

        <div class="list">
          <div class="files" v-for="file in uploadFileList">
            <div class="name">{{file.name}}</div>
            <div class="info">
              <span>大小：{{formatSize(file.file.size)}}</span>
              <span>状态：{{file.status}}</span>
              <span>进度: 
                <span class="progress">
                  <i :style="{width: file.uploadStatus+'%'}"></i>
                   <span>{{file.uploadStatus+'%'}}</span>
                  </span>
                </span>
            </div>
          </div>
        </div>
      </div>
      <!--新建文件夹-->
      <div class="wrapper" v-show="activeClass==='addFolder'">
        <div class="folder">
          <input type="text" ref="folder" v-model="folderName">
          <button @click="addFolder">确定</button>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="upload enable"
           :class="[activeClass==='upload'?'active':activeClass===''?'':'disable']"
           @click="showUpload">
        <i class="icon-upload"></i>
        <span>上传</span>
      </div>
      <div class="download"
           :class="[activeClass==='download'?'active':activeClass===''?'':'disable']"
           @click="downloadFile">
        <i class="icon-download"></i>
        <span>下载</span>
      </div>
      <div class="delete"
           :class="[activeClass==='delete'?'active':activeClass===''?'':'disable']"
           @click="deleteFile">
        <i class="icon-delete"></i>
        <span>删除</span>
      </div>
      <div class="addFolder"
           :class="[activeClass==='addFolder'?'active':activeClass===''?'':'disable']"
           @click="showAddFolder">
        <i class="icon-folder-plus"></i>
        <span>新建</span>
      </div>
    </div>
  </footer>
</template>

<script>
  import services from '../../services'
  
  export default {
    name: 'BottomBar',
    data() {
      return {
        activeClass: '',
        uploadFileList: [],
        folderName: '新建文件夹'
      }
    },
    methods: {
      showUpload() {
        if (this.activeClass === '') {
          this.activeClass = 'upload'
        } else if (this.activeClass === 'upload') {
          this.activeClass = ''
        }
      },
      deleteFile() {
        this.activeClass === '' && this.Content.deleteFile()
      },
      downloadFile() {
        this.activeClass === '' && this.Content.downloadFile()
      },
      showAddFolder() {
        if (this.activeClass === '') {
          this.activeClass = 'addFolder'
          this.$nextTick(() => {
            this.$refs.folder.select()
          })
        } else if (this.activeClass === 'addFolder') {
          this.activeClass = ''
          this.folderName = '新建文件夹'
        }
      },
      addFolder() {
        if (this.folderName !== '') {
          services.createDir(
            this.$store.state.currentDir,
            this.folderName
          ).then((res) => {
            if (res.data.status) {
              this.showAddFolder()
              this.Content.getFileList()
            } else {
              this.Content.showToast(res.data.msg)
            }
          })
        }
      },
      setUploadFiles(event) {
        let files = event.target.files
        let fullSize = 0
        for (let i = 0; i < files.length; i++) {
          fullSize += files[i].size
          if (this.userInfo.size + fullSize >= this.userInfo.total) {
            alert('已超出网盘空间限制！')
            event.target.files = []
            return
          }
          let uploadFile = {
            file: files[i],
            status: '未上传',
            uploadStatus: 0
          }
          this.uploadFileList.unshift(uploadFile)
          this.uploadFiles(uploadFile)
        }
        event.target.value = ''
      },
      uploadFiles(file) {
        file.name = file.file.name.split('/').reverse()[0]
        if (file.file.size > 200 * 1000000) {
          file.status = '文件过大 '
          return
        }
        file.status = '上传中 '
        //相同文件重命名
        let i = 0
        while (this.Content.fileList.find((value => file.name === value.name))) {
          i++
          if (i > 100) {
            return
          }
          if (/\(\d*\)./.test(file.name)) {
            file.name = file.name.replace(/\(\d*\)/, '(' + i + ')')
          } else {
            let name = file.name.split('.').reverse()
            if (name.length > 1) {
              name[1] += '(1)'
              file.name = name.reverse().join('.')
            }else{
              file.name = file.name+'(1)'
            }
          }
        }
        services.uploadFile(
          file.file,
          file.name,
          this.$store.state.currentDir,
          (event) => {
            let progress = event.loaded / event.total * 100
            file.uploadStatus = progress.toFixed(1)
          }
        ).then((res) => {
          this.$store.commit('setUserInfo', res.data)
          file.status = '完成'
          this.Content.getFileList()
        }).catch(e => {
          console.error(e)
          file.status = '未完成'
        })
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
      hideUploadList(event) {
        // console.log(event)
        if (event.target.className === 'mask') {
          this.activeClass = ''
        }
      }
    },
    computed: {
      userInfo() {
        return this.$store.state.userInfo
      },
      Content() {
        return this.$parent.$refs.content
      }
    }
  }
</script>

<style scoped lang="stylus">
  a = 0.01rem
  .bottombar
    position: absolute
    bottom 0
    left 0
    width 100%

    .panel
      position relative
      z-index 50
      display flex
      justify-content space-between
      height 60 *a
      width 100%
      padding 5 *a 10 *a
      box-sizing border-box
      background #f7f7f7

      & > div
        text-align center

        &.disable
          color rgba(0, 0, 0, .5)

        &.active, &:active:not(.disable)
          color #008fff

        i
          font-size 25 *a
          line-height 25 *a

        span
          display block
          width 100%

    .mask
      position absolute
      bottom 0
      left 0
      z-index 40
      height 100vh
      width 100vw
      margin 0
      padding 0
      background rgba(0, 0, 0, .5)

    .wrapper
      position absolute
      left 0
      bottom 60 *a
      width 100%
      min-height 100 *a
      background rgba(255, 255, 255, .9)

    .choseFile
      padding 10 *a 0
      text-align center
      width 100%
      background #f7f7f7
      border-bottom 1px solid #bdbdbd
      .uploader
        position relative
        display inline-block
        font-size 18 *a
        padding: 0 9px;
        color: #478de4;
        border: 1px solid #478de4;
        border-radius: 4px;

        input
          position absolute
          top 0
          left 0
          width 100%
          height 100%
          border 0
          opacity 0


    .list
      width 100%
      max-height 500 *a
      overflow-y auto

      .files
        box-sizing border-box
        border-bottom 1px solid #bdbdbd
        margin 0 5 *a
        padding 2 *a 0

        .name
          font-size 16 *a
          line-height 20 *a
          overflow hidden
          white-space nowrap
          text-overflow ellipsis

        .info
          font-size 11 *a

          span
            display inline-block
            width 120 *a
            height 15 *a
            line-height @height

          .progress
            position relative
            display inline-block
            width 90 *a
            height 100%
            border 1px solid #9f9f9f
            box-sizing border-box

            i
              display inline-block
              background-color: #00f52d
              height 100%
              vertical-align top

            span
              display inline-block
              width 90 *a
              height 100%
              text-align center
              position absolute
              left 0
              top 0

    .folder
      line-height 100 *a
      text-align center

      input, button
        box-sizing border-box
        font-size 16 *a
        display inline-block
        height 30 *a
        outline none
        padding 3 *a 5 *a
        vertical-align middle
</style>