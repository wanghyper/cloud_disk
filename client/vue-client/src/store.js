import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {
      user_name: '',
      size: 0,
      total: 0
    },
    currentDir: '', // '' 'xxx/' 'xxx/xxx/'
    fileListType: {
      name:'全部文件',
      id: 'all'
    }, // all image video  audio doc other
  },
  mutations: {
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    setFileListType(state, type){
      state.fileListType = type
    },
    setCurrentDir(state, dir) {
      if (dir) {
        state.currentDir = dir + '/'
      }else{
        state.currentDir = ''
      }
    }
  },
  actions: {}
})
