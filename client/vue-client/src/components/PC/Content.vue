<template>
  <div class="content">
    <!--工具栏-->
    <div class="tool">
      <div style="position: relative">
        <i class="icon-upload"></i>
        <span>上传文件</span>
        <input type="file" class="uploader file" multiple
               @change="setUploadFiles($event)">
      </div>
      <div @click="setCreateDir">
        <i class="icon-folder-plus"></i>
        <span>新建文件夹</span>
      </div>
      <div @click="downloadFile" v-show="selectedFiles.length>0">
        <i class="icon-download"></i>
        <span>下载文件</span>
        <a href="" ref="download"></a>
      </div>
      <div @click="deleteFile" v-show="selectedFiles.length>0">
        <i class="icon-delete"></i>
        <span>删除文件</span>
      </div>
      <!--搜索-->
      <SearchBar class="search"></SearchBar>
    </div>
    <!--面包屑导航-->
    <div class="breadcrumb">
      <span class="dirpath" @click="levelBack" v-show="dirPath.length>0">
        <span>返回上一级</span>&nbsp;|&nbsp;
      </span>
      <span class="dirpath">
        <span @click="setDirPath('')">{{fileListType.name}}</span>
      </span>
      <span v-for="(path,index) in dirPath" class="dirpath level">
        <span @click="setDirPath(index+1)">{{path}}</span>
      </span>
    </div>
    <!--列表表头-->
    <div class="title">
        <span class="col1">
          <i class="checkbox"
             :class="[allSelected?'icon-checkbox-checked':'icon-checkbox-unchecked']"
             @click="selectAll()"></i>
          &nbsp;
          <span @click="sortFile('name')" class="sort">文件名</span>
        </span>
      <span class="col2 sort" @click="sortFile('size')">大小</span>
      <span class="col3 sort" @click="sortFile('time')">修改时间</span>
    </div>
    <!--文件列表部分-->
    <div class="wrapper" ref="list_wrapper">
      <div class="lists">
        <div class="no-content" v-if="this.fileList.length<1&&noFile&&!isCreateDir">当前文件列表为空</div>
        <div class="list dirname" v-if="isCreateDir">
          <i class="checkbox icon-checkbox-unchecked"></i>
          &nbsp;
          <i class="fileType icon-file-folder"></i>
          <input type="text" v-model="dirname" ref="dirInput">
          <i class="icon-cross" @click="cancelCreateDir"></i>
          &nbsp;
          <i class="icon-checkmark" @click="createDir"></i>
        </div>

        <div class="list" v-for="(file, index) in fileList">
          <span class="col1">
            <i class="checkbox"
               :class="[file.hasSelected?'icon-checkbox-checked':'icon-checkbox-unchecked']"
               @click="setSelect(index)"></i>
            &nbsp;
          <i class="fileType" :class="'icon-file-'+classify(file)"></i>
           <span class="name" @click="openFile(file)"
                 :title="file.name"> {{file.name}}</span>
        </span>
          <span class="col2">{{file.type==='folder'?'-':formatSize(file.size)}}</span>
          <span class="col3">{{file.create_time}}</span>
        </div>
      </div>
    </div>
    <!--文件上传列表部分-->
    <div class="uploadlist" v-show="showUploadList"
         :class="{down:slideDown}">
      <div class="header">上传文件列表
        <span class="close icon-cancel-circle"
              @click="showUploadList=false"></span>
        <span class="close"
              :class="[slideDown?'icon-circle-up':'icon-circle-down']"
              @click="slideDown=!slideDown"></span>
      </div>
      <div class="head filelist"><span>文件名</span><span>大小</span><span>上传状态</span></div>
      <div class="wrapper">
        <ul>
          <li v-for="(file, index) in uploadFileList" class="filelist">
            <span>{{file.name}}</span>
            <span>{{formatSize(file.file.size)}}</span>
            <span>
            <i class="progress" :style="{width:file.uploadStatus+'%'}">
            </i>
            <i>
            {{file.status}} {{file.status==='上传中'?file.uploadStatus+'%':''}}
            </i>
          </span>
          </li>
        </ul>
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
  import SearchBar from '@/components/PC/SearchBar.vue'

  export default {
    name: 'Content',
    components:{SearchBar},
    data() {
      return {
        noFile: false,
        fileList: [],
        dirname: '新建文件夹',
        isCreateDir: false,
        allSelected: false,
        uploadFileList: [],
        showUploadList: false,
        slideDown: false, //上传列表是否向下收起

        downloadSrc: '',
        downloadName: '',
        sortType: '',
        tip:'',
        showTip:false
      }
    },
    methods: {
      getFileList() {
        services.getFileList(this.fileListType, this.currentDir)
          .then((res) => {
              if(res.data.status){
                this.fileList = res.data.data;
                if (this.fileList.length < 1) {
                  this.noFile = true
                }
                this.sortFile('')
              }else{
                this.$router.replace('/login')
              }
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
      setSelect(index) {
        this.allSelected = false
        let file = this.fileList[index]
        this.$set(file, 'hasSelected', !file.hasSelected)
      },
      selectAll() {
        this.allSelected = !this.allSelected
        this.fileList.forEach((value) => {
          this.$set(value, 'hasSelected', this.allSelected)
        })
      },
      setUploadFiles(event) {
        this.slideDown = false
        this.showUploadList = true
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
        file.name = file.file.name
        if (file.file.size > 200 * 1000000) {
          file.status = '文件过大 '
          return
        }
        file.status = '上传中 '
        //相同文件重命名
        let i = 0
        while (this.fileList.find((value => file.name === value.name))) {
          i++
          if (i > 100) {
            return
          }
          if (/\(\d*\)./.test(file.name)) {
            file.name = file.name.replace(/\(\d*\)/, '(' + i + ')')
          } else {
            let name = file.name.split('.').reverse()
            name[1] += '(1)'
            file.name = name.reverse().join('.')
          }
        }
        services.uploadFile(
          file.file,
          file.name,
          this.currentDir,
          (event) => {
            let progress = event.loaded / event.total * 100
            file.uploadStatus = progress.toFixed(1)
          }
        ).then((res) => {
          this.$store.commit('setUserInfo', res.data)
          file.status = '完成'
          this.getFileList()
        }).catch(e => {
          file.status = '未完成'
        })
      },
      deleteFile() {
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
      setCreateDir() {
        this.isCreateDir = true
        // this.$refs.list_wrapper.scrollTop = 0
        this.$nextTick(() => {
          this.$refs.dirInput.focus()
          this.$refs.dirInput.select()
        })
      },
      createDir() {
        services.createDir(this.currentDir, this.dirname)
          .then((res) => {
            this.cancelCreateDir()
            this.getFileList()
          })
      },
      cancelCreateDir() {
        this.isCreateDir = false
        this.dirname = '新建文件夹'
      },
      downloadFile() {
        let files = this.selectedFiles
        if (files.length > 1 && !confirm('确定要下载多个文件?')) {
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
            // case 'excel':
            this.$router.push('./player?type='+type
              +'&name='+currentFilename
              +'&src='+encodeURIComponent(services.getFileUrl(currentFilename)))
            //window.open(services.getFileUrl(currentFilename))
            break
          case 'folder':
            this.$store.commit('setCurrentDir', currentFilename)
            this.getFileList()
            break
          default:
            console.log('other')
        }
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
      selectedFiles() {
        return this.fileList.filter(value => value.hasSelected)
      },
      dirPath() {
        let path = this.currentDir.split('/')
        path.splice(-1, 1)
        return path
      },
      ...mapState(['currentDir', 'fileListType', 'userInfo'])
    },
    watch: {
      fileListType() {
        this.getFileList()
        this.$store.commit('setCurrentDir', '')
      }
    },
    created() {
      this.getFileList()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
  @import '../../assets/iconfont.css'
  .content
    position absolute
    top 0
    left 0
    font-size 14px
    width 100%
    min-width 850px
    height 100%
    padding 60px 0 0 180px
    background: rgba(255, 255, 255, .75)
    background-clip content-box
    overflow hidden
    box-sizing border-box

  ::-webkit-scrollbar {
    width 10px
    height 10px
  }

  ::-webkit-scrollbar-track-piece {
    //background-color rgba(255, 255, 255, 0.8)
    -webkit-border-radius 7px
  }

  ::-webkit-scrollbar-thumb {
    height 30px
    background-color #999
    -webkit-border-radius 7px
  }

  ::-webkit-scrollbar-thumb:hover {
    height 30px
    background-color #9f9f9f
    -webkit-border-radius 8px
  }

  $blue = #478de4

  .tool
    height $height = 50px
    box-sizing border-box
    padding 5px 0 5px 20px

    & > div
      display inline-block
      height 30px
      line-height @height
      padding 0 9px
      margin 9px 10px 0 0
      color $blue
      border 1px solid $blue
      border-radius 4px
      &.search
        float right
        border none
        padding 0
      i
        font-size 22px
        line-height 10px
        vertical-align -3px

      & > span
        display inline-block

      &:hover
        color $blue * 1.2

      .uploader
        position absolute
        top 0
        left 0
        border 0
        width 100%
        height 100%

        &.file
          opacity 0


    .icon-folder-plus,
    .icon-upload3,
    .icon-download3
      margin-right 3px

  .breadcrumb
    height 40px
    line-height 40px
    padding-left 20px

    .dirpath
      & > span
        &:hover
          color: $blue
          text-decoration underline

      &.level:before
        text-decoration none
        content "/"
        padding 0 5px

  .title
    color #444444
    border-top 1px solid #ccc
    border-bottom 1px solid #ccc
    padding-left 20px

    .sort:hover
      color $blue
      background: rgba(149, 250, 255, 0.9)

  .title, .lists
    box-sizing border-box
    height 40px
    min-width $width = 600px

    & span
      display inline-block
      height 40px
      line-height 40px
      text-align left
      white-space nowrap
      overflow hidden
      text-overflow ellipsis
      width 100%

    .col1
      width calc(100% - 285px)
      margin-right 5px


    .col2
      width 100px

    .col3
      width 180px

    i:before
      display inline-block
      height 40px
      line-height @height
      padding-right 5px
      vertical-align top

  .checkbox
    color #888

  .fileType
    font-size 22px
    color: #3192e0

  .fileType.icon-file-folder
    color #e0a964

  .wrapper
    width 100%
    height calc(100% - 130px)
    overflow-y auto
    overflow-x hidden

  .lists
    padding-bottom 5px
    width 100%

    .list
      padding-left 20px
      height 40px
      color #424e67
      border-bottom 1px solid #ccc

      &.dirname
        color #888

        i:not(.fileType):hover
          color $blue

        input
          display inline-block
          height 26px
          padding 0
          width 180px
          text-indent 4px
          margin 7px 10px 7px 0
          background rgba(255, 255, 255, .6)
          border none
          outline none

          &:focus
            box-shadow 0 0 1px 1px #00e0ff

      &:hover
        background: rgba(149, 250, 255, 0.6)

      & .name
        color #424e67

        &:hover
          color $blue

    .no-content
      line-height 100px
      color #999
      width 100%
      text-align center

  .uploadlist
    position: absolute
    right: 0
    bottom 0
    width 520px
    height 352px
    transition height 0.4s
    border 1px solid #6689d8
    box-sizing border-box
    overflow hidden
    background: rgba(255, 255, 255, .9)

    &.down
      height 32px

    .header
      display: block
      height 30px
      line-height @height
      text-indent 10px
      color: #fff
      background: #63a5e6

      .close
        display inline-block
        font-size 22px
        float right
        margin-right 10px
        line-height 30px

    .head
      font-size 0.8em
      padding-left 10px
      height 20px
      line-height @height
      border-bottom 1px solid #dcdcdc

    .wrapper
      height 350px - 30px - 20px
    $ul_width = 500px
    $width = $ul_width - 10px

    ul
      padding 0
      margin 0
      font-size 13px

      li
        list-style none
        height 30px
        padding-left 10px
        line-height @height
        border-bottom 1px solid #dcdcdc

    .filelist span
      display inline-block
      height 100%
      overflow hidden
      white-space nowrap
      text-overflow ellipsis

      &:nth-child(1)
        width $width * 0.6

      &:nth-child(2)
        width 0.2 * $width

      &:nth-child(3)
        position relative
        width 0.2 * $width - 2px
        text-align center

        i
          position: absolute
          top 5px
          left 0
          display inline-block
          height 20px
          width 100%
          line-height @height
          background transparent

          &.progress
            background #02ff10

  .tip
    position absolute
    right 0
    top 112px
    height 20px
    line-height @height
    padding 5px 10px
    color: #fff
    border-top-left-radius 15px
    border-bottom-left-radius 15px
    background: #008fff
  .tip-enter-active,.tip-leave-active
    transition all 0.5s
  .tip-enter,.tip-leave-to
    opacity  0
</style>