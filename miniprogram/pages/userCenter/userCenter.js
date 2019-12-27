//userCenter.js
const config = require('../../config.js')
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    queryResult: {},
    ABOTypes: ["A", "B", "O", "AB"],

    RHTypes: ["RH阳性", "RH阴性"],

    sexs: ["男", "女"],

// 用户中心模块
    list: [
      {
        id: 'infoManagement',
        name: '社员信息管理',
        open: false,
        pages: [{ name: '完善个人信息', url: config.navs.addPersonalInfo }],
        icon: 'bussiness-card.png'
      },
      // {
      //   id: 'activities',
      //   name: '活动报名',
      //   open: false,
      //   pages: [{ name: '进入getgetme.com', url: '' }],
      //   icon: 'compass.png'
      // },
      // {
      //   id: 'forum',
      //   name: '凌峰论坛',
      //   open: false,
      //   pages: [{ name: '凌峰论坛', url: 'forum' }],
      //   icon: 'link.png'
      // },
      // {
      //   id: 'other',
      //   name: '其他',
      //   open: false,
      //   pages: [{ name: '关于', url: 'about' }, { name: '问题反馈', url: 'issue' }],
      //   icon: 'code.png'
      // }
    ]
//
  },

  onLoad: function () {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    //获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo,
                logged:true,
              })
            }
          })
        }
      }
    })
    
  },

  onShow: function () {
    if(!this.data.logged)
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo,
                logged: true,
              })
            }
          })
        }
      }
    })
  },


// 点击模块dropDown菜单显示函数
  kindToggle: function (e) {
    var id = e.currentTarget.id, list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list: list
    });
  },
//

})
