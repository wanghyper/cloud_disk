import axios from 'axios'

// let baseURL = location.protocol+'//'+location.hostname+'./',
  let baseURL = './api',
  headers = {'X-Custom-Header': 'cloud disk'}

const req = axios.create({
  baseURL,
  // timeout: 20000,
  headers,
  withCredentials: true
});
export default {
  loginCheck() {
    return req.get('/login')
  },
  login(data) {
    return req.post('/login', data)
  },
  logout() {
    return req.delete('/logout')
  },
  getFileList(type, currentDir) {
    if (type.id === 'all') {
      return req.get('/getFileList', {params: {path: currentDir}})
    } else if (type.id === 'search') {
      return req.get('/searchFile', {params: {filename: type.filename}})
    } else {
      return req.get('/getTypeFileList', {params: {type:type.id}})
    }
  },
  uploadFile(file, name, currentDir, progressFun) {
    if (!file) {
      return
    }
    let formData = new FormData()
    formData.append('uploadFile', file)
    let url = "/uploadFile?filename=" + encodeURIComponent(name)
      + '&path=' + currentDir
    return req.post(url, formData, {onUploadProgress: progressFun})
  },
  createDir(path, dirname) {
    return req.get('/createDir', {params: {path, dirname}})
  },
  deleteFile(files) {
    return req.delete('/deleteFile',
      {data: {files}})
  },
  getFileUrl(filename) {
    return baseURL+ '/getFile/' + filename
  }
  
}