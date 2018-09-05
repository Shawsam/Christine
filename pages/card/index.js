var isInitSelfShow = false
var page = 0
var time = 0
var touchDot = 0 
var interval
const app = getApp()
const swiperWidth = parseInt(wx.getSystemInfoSync().screenWidth/750*615)


Page({
  data: {
    cardType:1,
    page:page
  },
  onShow:function(){
    isInitSelfShow && this.onLoad()
  },
  onHide() {
    isInitSelfShow = true;
  },
  onLoad:function(){
    this.setData({userInfo:app.globalData.userInfo})
    
    var _this = this,
    param = {
      mini:'mini',
      openId:app.globalData.openId,
      userId:app.globalData.userId,
      cardNo:app.globalData.cardNo,
      userInfo:app.globalData.userInfo
    }
    
    page = 0
    var animation = wx.createAnimation()
    animation.translateX(-1*page*swiperWidth).step()
    this.setData({
      animationData:animation.export()
    })

    wx.showLoading({title:'加载中'})
    wx.request({
        url: app.globalData.host+'/card/cardList', 
        header: {  "Content-Type": "application/x-www-form-urlencoded" }, 
        method:'GET',
        data: param,
        success: function (res) {
            //服务器返回的结果
            console.log(res);
            wx.hideLoading()
            if (res.data.errcode == 0) {
               var cards = res.data.data
               var eCard,entityCards=[]
               cards.map(function(item){
                   item.bala = item.bala.toFixed(2)
                   item.cardImg = _this.getSrc(item.typeId)
                   if(item.cardAttr==3){
                      eCard = item
                   }else{
                      entityCards.push(item)
                   }
               }) 

               console.log(entityCards)
               _this.setData({
                 eCard:eCard,
                 entityCards:entityCards
               })
            }else{
               var errMsg = res.data.msg
               wx.redirectTo({ url:'../view_state/index?error='+res.statusCode+'&errorMsg='+errMsg})
            }
        }
    })

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
  },
  openCard:function(e){
     var cardType = e.currentTarget.dataset.param
     this.setData({cardType:cardType})
  },

  openCharge:function(){
     wx.navigateTo({url:'../charge/index'})
  },

  openTrade:function(){
     wx.navigateTo({url:'../tradelist/index'})
  },

  TobindCard:function(){
     wx.navigateTo({url:'../bindcard/index'})
  },

  openAccount:function(){
     wx.navigateTo({url:'../account/index'})
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
