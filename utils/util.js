function formatTime(date) {
  var date = new Date(date)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 是否为空对象
function isEmptyObject(e) {
    var t;
    for (t in e)
        return !1;
    return !0
}



var barcode = require('./barcode.js');
var qrcode = require('./qrcode.js');

function convert_length(length) {
    return Math.round(wx.getSystemInfoSync().windowWidth * length / 750);
}

function barc(id, code, width, height) {
    barcode.code128(wx.createCanvasContext(id), code, convert_length(width), convert_length(height))
}

function qrc(id, code, width, height) {
    qrcode.api.draw(code, {
        ctx: wx.createCanvasContext(id),
        width: convert_length(width),
        height: convert_length(height)
    })
}


module.exports = {
  formatTime: formatTime,
  isEmptyObject:isEmptyObject,
  barcode: barc,
  qrcode: qrc
}
