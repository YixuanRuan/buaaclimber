const app = getApp()
const confg = require('../../../config.js')

Page({

  data:{
    searchId:"",
    activityInfo: {
      
    },
    acJoinedId:"",
    added1:false,
    added2:false,
    acJoined:{
      joinedAcList:[]
    }
  },

  onLoad: function (options) {
    this.setData({
      searchId: options.id,
    })
    this.getActivityInfo()
  },

  join: function(){
    this.updateActivityInfo()
  },

  //获取云端活动信息
  getActivityInfo: function () {
    const db = wx.cloud.database()
    var that = this
    // 查询当前用户所有的 counters
    wx.cloud.callFunction({
      name:"getCertainAcInfo",
      data:{
        searchId:that.data.searchId,
      },success:function(res){
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
    var that = this
    // 查询当前用户所有的 counters
    wx.cloud.callFunction({
      name: "getCertainAcInfo",
      data: {
        searchId: that.data.searchId,
      }, success: function (res) {
        if ((res.result.data[0].num - res.result.data[0].currentNum)>0) { // 如果有记录，赋值给personalInfo
          console.log("人未满")
          that.updateAc()
          
        } else {
          console.log("hello")
          wx.showToast({
            icon: 'none',
            title: 'soooorrry~ 鸽子满了'
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            });
          }, 1000)
        }
      }, fail: function(res){
        wx.showToast({
          icon: 'none',
          title: '后台炸了 抢修中'
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          });
        }, 1000)
      }
    })
  },
  //
  jumpBack:function(){
    if (this.data.added1 && this.data.added2) {
      wx.showToast({
        title: '成功请交防鸽费'
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
  updateAc: function(){
    this.data.activityInfo.members.push(app.globalData.openId)
    const db = wx.cloud.database()
    this.data.activityInfo.currentNum++
    var that = this
    wx.cloud.callFunction({
      name:"updateAcMb",
      data:{
        searchId:that.data.searchId,
        members: that.data.activityInfo.members,
        currentNum: that.data.activityInfo.currentNum,
      }, 
      success: res => {
        that.data.added1 = true
        console.log("成功更新活动参与人数")
        console.log(that.data.added1)
        that.getAllJoinedAc()
        console.log(that.data.acJoined)
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
  updatePersonalAc: function(){
    console.log("添加前acJoined:", this.data.acJoined)
    this.data.acJoined.joinedAcList.push(this.data.searchId)
    const db = wx.cloud.database()
    db.collection('personalAcInfo').doc(this.data.acJoinedId).update({
      data:{
        joinedAcList:this.data.acJoined.joinedAcList,
      },
      success: res => {
        console.log("添加后acJoined:", this.data.acJoined)
        this.data.added2=true
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
  getAllJoinedAc:function(){
    const db = wx.cloud.database()
    db.collection("personalAcInfo").where({
      _openid: app.globalData.openId
    }).get({
      success: res => {
        if (res.data.length != 0) { // 如果有记录，赋值给personalInfo
          this.setData({
            acJoined: res.data[0],
            acJoinedId:res.data[0]._id,
          })
          delete this.data.acJoined._id
          delete this.data.acJoined._openid
          console.log('参加的活动查询成功, acJoined= ', this.data.acJoined)
          this.updatePersonalAc()
        } else {
          wx.showToast({
            icon: 'none',
            title: '数据库炸了~'
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            });
          }, 1000)
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