//index.js
//获取应用实例
const app = getApp()
var model = require('../../model/model.js')
var show = false;
var item = {};

Page({
  data: {
    email:'',
    item: { show: show },
    modalState:false
  },
  is_phone:function(str){
    var reg=/^1\d{10}$/;
    if(reg.test(str))
      return true;
    else
      return false;
  },
  onLoad: function (option) {
    var _this = this
    var param = { mini:'mini',
                  openId:app.globalData.openId,
                  userId:app.globalData.userId
                }
    wx.request({
        url: app.globalData.host+'/member/userInfo2', 
        method:'GET',
        data: param,
        success: function (res) {
            //服务器返回的结果
            console.log(res);
            wx.hideLoading()
            if (res.data.errcode == 0) {
                _this.setData({date:res.data.birth.replace(/\//g,'-'),
                               sexCode:res.data.gender,
                               name:res.data.name,
                               email:res.data.email?res.data.email:'',
                               province: res.data.address,
                               city:'',
                               county: ''
                              })
            }
        }
    })
  },

  onReady: function (e) {
    var _this = this;
    model.updateAreaData(_this, 0, e);
  },
  //点击选择城市按钮显示picker-view
  translate: function (e) {
    model.animationEvents(this, 0, true,400);  
  },
  //隐藏picker-view
  hiddenFloatView: function (e) {
    model.animationEvents(this, 200, false,400);
  },
  //滑动事件
  bindChange: function (e) {
    model.updateAreaData(this, 1, e);
    item = this.data.item;
    console.log(item)
    this.setData({
      province: item.provinces[item.value[0]].name,
      city: item.citys[item.value[1]].name,
      county: item.countys[item.value[2]].name
    });
  },

  nameInput:function(e){
    this.setData({
        name: e.detail.value
    })
  },

  mailInput:function(e){
    this.setData({
        email: e.detail.value
    })
  },

  pwdInput:function(e){
    this.setData({
        psw: e.detail.value
    })
  },

  chooseSex:function(e){
     var sexCode = e.currentTarget.dataset.param
     this.setData({sexCode:sexCode})
  },

  bindDateChange:function(e){
    this.setData({
       date:e.detail.value
    })
  },

  is_email:function(str){
    var reg=/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    if(reg.test(str))
      return true;
    else
      return false;
  },

  completeFun: function(){
    var gender = this.data.sexCode,
        name = this.data.name,
        birth = this.data.date.replace(/(^\s*)|(\s*$)/g, ""),
        province = this.data.province=='undefinedundefinedundefined'?'':this.data.province,
        city = this.data.city,
        district = this.data.county
    
    //参数校验
    if(!name){
       wx.showModal({content:'请输入姓名'})
       return
    }

    if(!birth){
       wx.showModal({content:'请选择生日'})
       return
    }
    
    if(!province){
       wx.showModal({content:'请选择省市区'})
       return
    }
    
    var email = this.data.email
    if(email && !this.is_email(email)){
      wx.showModal({content:'请输入正确的邮箱'})
       return
    }

    var param = {
          "mini":"mini",
          "name":name,
          "birth":birth,
          "gender":gender,
          "openId":app.globalData.openId,
          "address":province+'-'+city+'-'+district,
          "email":this.data.email?this.data.email:''
    }
    var _this = this

    wx.showLoading({title:'加载中'})
    wx.request({
              url: app.globalData.host+"/member/updateMemberMini",
              method:'POST',
              header: {"Content-Type":"application/x-www-form-urlencoded"}, 
              data: param,
              success: function(res) {
                //服务器返回数据
                console.log(res)
                wx.hideLoading()
                if(res.data.errcode == 0){
                    wx.showToast({title:'修改成功'})
                }else{
                    _this.setData({modalState:true})
                }
              }
    })   

  },
  closeModal:function(){
     this.setData({modalState:false})
  },
  logOutFun:function(){
      wx.showModal({
       content:'确定要退出登陆吗？',
       success: function(res) {
            if (res.confirm) {
                var _this = this
                var param = {
                      "mini":"mini",
                      "openId":app.globalData.openId,
                      "userId":app.globalData.userId
                }
                wx.showLoading({title:'加载中'})
                wx.request({
                          url: app.globalData.host+"/member/logOutMini",
                          method:'POST',
                          header: {"Content-Type":"application/x-www-form-urlencoded"}, 
                          data: param,
                          success: function(res) {
                            //服务器返回数据
                            wx.hideLoading()
                            if(res.data.errcode == 0){
                                 app.globalData.userId = ''
                                 wx.setStorageSync('userId','')
                                 wx.switchTab({url:'../index/index'})
                            }else{
                                 wx.showModal({content:res.data.msg})
                            }
                          }
                })   
              }
            }
      })
  }

})
