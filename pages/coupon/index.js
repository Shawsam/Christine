var QR = require("../../utils/qrcode.js")
var pageNo = 1
const app = getApp()

Page({
  data: {
    userInfo: null,
    modalState:false,
    imagePath:''
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
  },

  onLoad: function () {
    pageNo = 1   //重置页码为1
    this.setData({noMore:false})

    var param = { mini:'mini',
                  openId:app.globalData.openId,
                  userId:app.globalData.userId,
                  pageNo:pageNo,
                  pageSize:10
                }
    
    var _this = this
    wx.showLoading({title:'加载中'})
    wx.request({
        url: app.globalData.host+'/coupon/couponListMini', 
        method:'GET',
        data: param,
        success: function (res) {
            //服务器返回的结果
            console.log(res);
            wx.hideLoading()
            if (res.data.errcode == 0) {
                var couponData = res.data.data
                couponData.map(function(item){
                  item.dateString = item.endDate.substr(0,4)+'/'+item.endDate.substr(4,2)+'/'+item.endDate.substr(6,2)
                })
               _this.setData({couponData:couponData})
            }else{
               var errMsg = res.data.msg
               wx.redirectTo({ url:'../view_state/index?error='+res.statusCode+'&errorMsg='+errMsg})
            }
        }
    })

  },
  infoScan: function(e){
     var index =  e.currentTarget.dataset.param,
         currentItem = this.data.couponData[index],
         qrcodeVal = currentItem.cardNo
     var size = this.setCanvasSize() //动态设置画布大小
     this.createQrCode(qrcodeVal, "mycanvas",size.w,size.h)
     this.setData({modalState:true,
                   currentItem:currentItem
                 })
  },
  hideModal:function(){
     this.setData({modalState:false})
  },
  //分页加载
  loadMoreData:function(){   
     if(this.data.noMore) return  
     pageNo ++
     var param = { mini:'mini',
                  openId:app.globalData.openId,
                  userId:app.globalData.userId,
                  pageNo:pageNo,
                  pageSize:10
                }
    
    var _this = this
    wx.showLoading({title:'加载中'})
    wx.request({
        url: app.globalData.host+'/coupon/couponListMini', 
        method:'GET',
        data: param,
        success: function (res) {
            //服务器返回的结果
            console.log('第'+pageNo+'页:');console.log(res);
            wx.hideLoading()
            if (res.data.errcode == 0) {
                var couponData = res.data.data
                console.log(couponData)
                if(couponData.length){
                    couponData.map(function(item){
                      item.dateString = item.endDate.substr(0,4)+'/'+item.endDate.substr(4,2)+'/'+item.endDate.substr(6,2)
                    })
                    var _couponData = _this.data.couponData
                    couponData =  _couponData.concat(couponData)
                    _this.setData({couponData:couponData})
                }else{
                    _this.setData({noMore:true})
                }
            }else{
               var errMsg = res.data.msg
               wx.showModal({content:errMsg})
            }
        }
    })
  },
  refreshData:function(){
     this.onLoad()
  }
})
