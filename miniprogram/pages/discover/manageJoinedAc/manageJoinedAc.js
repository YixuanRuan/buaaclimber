const app = getApp()
const confg = require('../../../config.js')

Page({

  data: {
    searchId: "",
    activityInfo: {

    },
    acJoinedId: "",
    del1: false,
    del2: false,
    acJoined: {
      joinedAcList: []
    }
  },

  onLoad: function (options) {
    this.setData({
      searchId: options.id,
    })
    this.getActivityInfo()
  },

  quit: function () {
    this.updateActivityInfo()
  },

  //获取云端活动信息
  getActivityInfo: function () {
    const db = wx.cloud.database()
    var that = this
    wx.cloud.callFunction({
      name: "getCertainAcInfo",
      data: {
        searchId: that.data.searchId,
      }, success: function (res) {
        if (res.result.data.length != 0) { // 如果有记录，赋值给personalInfo
          that.setData({
            activityInfo: res.result.data[0],
          })
          console.log('云端活动详情查询成功 acInfo=', that.data.activityInfo)
        } else {
          wx.showToast({
            icon: 'none',
            title: '活动取消了'
          })
          console.log('shit happend')
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  },

  // 检查活动人数处理申请
  updateActivityInfo: function () {
    const db = wx.cloud.database()
    db.collection('activities').where({
      _id: this.data.searchId
    }).get({
      success: res => {
        this.updateAc()
      },
      fail: err => {
        console.error('[数据库] [更新记录] 失败：', err)
      }
    })
  },
  //
  jumpBack: function () {
    if (this.data.del1 && this.data.del2) {
      wx.showToast({
        title: '鸽子鸽了！'
      })
      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        });
      }, 1500)
    } else {
      wx.showToast({
        icon: 'none',
        title: 'soooorrry~ 数据库出了点small问题'
      })
      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        });
      }, 1000)
    }
  },
  //更新活动人数
  updateAc: function () {
    const mb = this.data.activityInfo.members
    for (var i = 0, len = mb.length;i<len;i++){
      
      if(mb[i]==app.globalData.openId){
        console.log("mb splice前", mb)
        mb.splice(i, 1)
        i--
        console.log("mb splice后", mb)
      }
      
    }
    const newCurrentNum = this.data.activityInfo.currentNum - 1
    const db = wx.cloud.database()
    const that = this
    wx.cloud.callFunction({
      name: "updateAcMb",
      data: {
        searchId: that.data.activityInfo._id,
        members: mb,
        currentNum: newCurrentNum,
      },
      success: res => {
        that.data.del1 = true
        console.log("成功更新活动参与人数")
        console.log(that.data.del1)
        that.getAllJoinedAc()
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '数据库炸了~'
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          });
        }, 1000)
        console.error('[数据库] [更新记录] 失败：', err)
      }
    })
  },
  //更新自己参与的活动
  updatePersonalAc: function () {
    console.log("添加前acJoined:", this.data.acJoined)
    const ac = this.data.acJoined.joinedAcList
    for (var i = 0, len = ac.length; i < len; i++) {
      if (ac[i] == this.data.searchId){
        ac.splice(i, 1)
        i--
      }
      console.log("添加前acJoined:", this.data.acJoined)
    }
    const db = wx.cloud.database()
    db.collection('personalAcInfo').doc(this.data.acJoinedId).update({
      data: {
        joinedAcList: ac,
      },
      success: res => {
        console.log("添加后acJoined:", this.data.acJoined)
        this.data.del2 = true
        console.log("成功更新个人参与活动")
        this.jumpBack()
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '数据库炸了~'
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          });
        }, 1000)
        console.error('[数据库] [更新记录] 失败：', err)
      }
    })
  },
  //获取所有参加的活动
  getAllJoinedAc: function () {
    const db = wx.cloud.database()
    db.collection("personalAcInfo").where({
      _openid: app.globalData.openId
    }).get({
      success: res => {
        if (res.data.length != 0) { // 如果有记录，赋值给personalInfo
          this.setData({
            acJoined: res.data[0],
            acJoinedId: res.data[0]._id,
          })
          delete this.data.acJoined._id
          delete this.data.acJoined._openid
          console.log('参加的活动查询成功, acJoined= ', this.data.acJoined)
          this.updatePersonalAc()
        } else {
          console.log('没有记录，添加记录')
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      },
    })
  },
})