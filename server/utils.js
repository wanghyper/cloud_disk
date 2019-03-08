module.exports = {
  wrapperString(str) {
    str = String(str)
    str = str.replace(/'/g, '\'\'') || ''
    return '\'' + str + '\''
  },
  formatDateTime(date) {
    let Y = date.getFullYear(),
      M = (date.getMonth() + 1),
      D = date.getDate(),
      h = date.getHours(),
      m = date.getMinutes(),
      s = date.getSeconds()
    return Y + '-'
      + (M > 9 ? M : '0' + M)
      + '-'
      + (D > 9 ? D : '0' + D)
      + ' '
      + (h > 9 ? h : '0' + h)
      + ':'
      + (m > 9 ? m : '0' + m)
      + ':'
      + (s > 9 ? s : '0' + s)
  }
}