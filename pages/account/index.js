var QR = require("../../utils/qrcode.js")
var page = 0
const app = getApp()
const swiperWidth = parseInt(wx.getSystemInfoSync().screenWidth/750*540)


Page({
  data: {
    page:page
  },
  onLoad:function(){
    var _this = this,
    param = {
      mini:'mini',
      openId:app.globalData.openId,
      userId:app.globalData.userId
    }

    wx.showLoading({title:'加载中'})
    wx.request({
        url: app.globalData.host+'/card/cardList', 
        header: {  "Content-Type": "application/x-www-form-urlencoded" }, 
        method:'GET',
        data: param,
        success: function (res) {
            //服务器返回的结果
            console.log(res)
            wx.hideLoading()
            if (res.data.errcode == 0) {
               var cards = res.data.data
               var eCard,entityCards=[]
               cards.map(function(item){
                   if(item.cardAttr==3){
                      eCard = item
                   }else{
                      entityCards.push(item)
                   }
               }) 
               _this.setData({
                 eCard:eCard,
                 entityCards:entityCards
               })
               _this.qrCodeFun()

               
            }else{
               var errMsg = res.data.msg
               wx.redirectTo({ url:'../view_state/index?error='+res.statusCode+'&errorMsg='+errMsg})
            }
        }
    })

    var timer = setInterval(function(){
        _this.qrCodeFun()
    },60000)

  },
  nextClick:function(){
    var cardNum = this.data.entityCards.length
    if(page == cardNum-1)  return
    page ++
    this.setData({page:page})
    var animation = wx.createAnimation()
    animation.translateX(-1*page*swiperWidth).step()
    this.setData({
      animationData:animation.export()
    })
    this.qrCodeFun()
  },
  prevClick:function(){
    if(page == 0)  return
    page --
    this.setData({page:page})
    var animation = wx.createAnimation()
    animation.translateX(-1*page*swiperWidth).step()
    this.setData({
      animationData:animation.export()
    })

    this.qrCodeFun()
  },
  qrCodeFun:function(){
       var _this = this,
           entityCards =  this.data.entityCards,
           param = {
              mini:'mini',
              openId:app.globalData.openId,
              userId:app.globalData.userId,
              cardNo:entityCards[page].cardNo
           }
      wx.request({
        url: app.globalData.host+'/member/QRCodeMini', 
        header: {  "Content-Type": "application/x-www-form-urlencoded" }, 
        method:'GET',
        data: param,
        success: function (res) {
          //服务器返回的结果
          console.log(res);
          if (res.data.errcode == 0) {
             var QRCode = res.data.QRCode
             var size = _this.setCanvasSize() //动态设置画布大小
             _this.createQrCode(QRCode,"mycanvas",size.w,size.h)
          }else{
              var errMsg = res.data.msg
              wx.showModal({content:errMsg})
          }
        }
      })
  },

  createQrCode:function(url,canvasId,cavW,cavH){
    //调用插件中的draw方法，绘制二维码图片
    wx.showLoading({title:'正在生成二维码'})
    QR.api.draw(url,canvasId,cavW,cavH);
    setTimeout(() => { 
      this.canvasToTempImage()
      wx.hideLoading()
    },500);
    
  },
    //适配不同屏幕大小的canvas
  setCanvasSize:function(){
    var size={};
    try {
        var res = wx.getSystemInfoSync();
        var scale = 750/668;  //不同屏幕下canvas的适配比例；设计稿是750宽
        var width = res.windowWidth/scale;
        var height = width;   //canvas画布为正方形
        size.w = width;
        size.h = height;
      } catch (e) {
        console.log("获取设备信息失败"+e);
      } 
    return size;
  } ,

  //获取临时缓存照片路径，存入data中
  canvasToTempImage:function(){
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {
          var tempFilePath = res.tempFilePath;
          that.setData({
              imagePath:tempFilePath
          });
      },
      fail: function (res) {
          console.log(res);
      }
    });
  },
  //点击图片进行预览，长按保存分享图片
  previewImg:function(e){
    var img = this.data.imagePath;
    console.log(img);
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    })
  }
})
