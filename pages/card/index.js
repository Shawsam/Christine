var page = 0
const app = getApp()
const swiperWidth = parseInt(wx.getSystemInfoSync().screenWidth/750*560)


Page({
  data: {
    cardType:1,
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
            console.log(res);
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
  onShow:function(){
     this.onLoad()
  }
})
