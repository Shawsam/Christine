var QR = require("../../utils/qrcode.js")
var wxbarcode = require('../../utils/util.js');


var page = 0
var time = 0
var touchDot = 0 
var interval
const app = getApp()
const swiperWidth = parseInt(wx.getSystemInfoSync().screenWidth/750*615)
var timer

Page({
  data: {
    page:page,
    qrcodeShow:false
  },
  onLoad:function(){
    this.setData({userInfo:app.globalData.userInfo})
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
               var eCard=[],entityCards=[]
               cards.map(function(item){
                   item.cardImg = _this.getSrc(item.typeId)
                   item.bala = item.bala.toFixed(2)
                   if(item.cardAttr==3){
                      item.typeId = 6549
                      eCard.push(item)
                   }else{
                      entityCards.push(item)
                   }
               }) 
               var Cards = eCard.concat(entityCards)

               var memberCode = Cards[0].cardNo
               _this.setData({
                 eCard:eCard,
                 entityCards:entityCards,
                 Cards:Cards,
                 memberCode:memberCode
               })
               wxbarcode.barcode('barcode',memberCode, 500, 150);

               
            }else{
               var errMsg = res.data.msg
               wx.redirectTo({ url:'../view_state/index?error='+res.statusCode+'&errorMsg='+errMsg})
            }
        }
    })
    
    if(getCurrentPages()[getCurrentPages().length-1].route=='pages/account/index'){
        clearInterval(timer)
        timer = setInterval(function(){
            _this.qrCodeFun()
        },60000)
    }

  },
  nextClick:function(){
    var page = this.data.page
    var cardNum = this.data.Cards.length

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
    var page = this.data.page
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
       // this.setData({canvasHidden:false})

       var _this = this,
           Cards =  this.data.Cards,
           param = {
              mini:'mini',
              openId:app.globalData.openId,
              userId:app.globalData.userId,
              cardNo:Cards[page].cardNo
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

      wxbarcode.barcode('barcode',this.data.memberCode, 500, 150);
  },

  openQrcode:function(){
      this.qrCodeFun()
      this.setData({qrcodeShow:true})
  },

  hideModal:function(){
      this.setData({qrcodeShow:false})
      wxbarcode.barcode('barcode',this.data.memberCode, 500, 150);
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
              // canvasHidden:true,
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
  },
  onUnload:function(){
    clearInterval(timer)
  },


  // 触摸开始事件
  touchStart: function (e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点
    interval = setInterval(function () {
      time++;
    }, 100);
  },
  // 触摸结束事件
  touchEnd: function (e) {
    var touchMove = e.changedTouches[0].pageX;
    // 向左滑动   
    if (touchMove - touchDot <= -40 && time < 10) {
      this.nextClick()
    }
    // 向右滑动   
    if (touchMove - touchDot >= 40 && time < 10) {
      this.prevClick()
    }
    clearInterval(interval); // 清除setInterval
    time = 0;
  },
  getSrc:function(id){
      switch(id){
        case 6545: return('../../image/6545.jpg');break;
        case 6546: return('../../image/6546.jpg');break;
        case 6547: return('../../image/6547.jpg');break;
        case 6548: return('../../image/6548.jpg');break;
        case 6549: return('../../image/6549.jpg');break;
        case 6550: return('../../image/6550.jpg');break;
        default: return('../../image/0000.jpg'); break;
      }
  }

})
