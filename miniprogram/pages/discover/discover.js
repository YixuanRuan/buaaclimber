// pages/discover/discover.js
const app = getApp()
const confg = require('../../config.js')
const util = require('../../utils.js')
Page({

  /**
   * Page initial data
   */
  data: {
    acJoined:[],
    acJoinedDetail:[],
    acUnjoinedDetail:[],
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.onGetUserInfo()
  },

  // 获取云端活动详细信息
  getAllUnjoinedAcDetail: function () {
    var acList = this.data.acJoined
    const db = wx.cloud.database()
    var that = this
    // 查询当前用户所有的 counters
    wx.cloud.callFunction({
      name:'getAllAcDetail',
      data:{
      },success:function(res){
        console.log("从云端获取的活动信息：",res)
        if (res.result.data.length != 0) { // 如果有记录，赋值给personalInfo
          for (var j = 0, len0 = res.result.data.length;j<len0;j++){
            var scan=false
            for(var i=0,len=acList.length;i<len;i++){
              if (res.result.data[j]._id==acList[i]) scan=true
            }
            if (!scan) {
              that.data.acUnjoinedDetail.push(res.result.data[j])
              console.log('未报名活动添加成功,acInfo= ', res.result.data[j])
            }
          }
          that.setData({
            acJoinedDetail: that.data.acJoinedDetail,
            acUnjoinedDetail: that.data.acUnjoinedDetail,
          })
          console.log(that.data.acJoinedDetail)
          console.log(that.data.acUnjoinedDetail)
        } else {    // 如果没有记录，增加一条空白记录
          console.log('shit happend')
        }
    },fail:function(res){
        console.log("从云端获取信息失败：",res)
      }
    })
    // })
    // db.collection('activities').where({
    //   outdated:false,
    // }).get({
    //   success: res => {

    //   },
    //   fail: err => {
    //     wx.showToast({
    //       icon: 'none',
    //       title: '查询记录失败'
    //     })
    //     console.error('[数据库] [查询记录] 失败：', err)
    //   },
    // })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  joinAc: function(e){
    var id=e.currentTarget.id
    console.log(e)
    wx.navigateTo({
      url: "/pages/discover/joinActivity/joinActivity?id="+id,
    })
  },

  manageJoinedAc: function (e) {
    var id = e.currentTarget.id
    console.log(e)
    wx.navigateTo({
      url: "/pages/discover/manageJoinedAc/manageJoinedAc?id=" + id,
    })
  },
  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    this.setData({
      acJoined:[],
      acJoinedDetail:[],
      acUnjoinedDetail:[],
    })
    this.getAllJoinedAcList()
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },

  // 自动登录函数
  onGetUserInfo: function () {
    if (!this.logged) {
      this.setData({
        logged: true,
      })

      // 调用云函数，获取openId
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          console.log('[云函数] [login] user openid: ', res.result.openid)
          app.globalData.openId = res.result.openid
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
        }
      })
    }
  },
  //查询所有加入的活动
  getAllJoinedAcList: function () {
    const db = wx.cloud.database()
    db.collection("personalAcInfo").where({
      _openid: app.globalData.openId
    }).get({
      success: res => {
        if (res.data.length != 0) { // 如果有记录，赋值给personalInfo
          this.setData({
            acJoined: res.data[0].joinedAcList,
          })
          console.log('[数据库] [查询记录] 成功, acJoined= ', this.data.acJoined)
          this.getAllJoinedAcDetail()
          this.getAllUnjoinedAcDetail()
        } else {
          console.log('没有记录，添加记录')
          this.addBlankAcJoin()
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
  //获取所有参加了的活动信息
  getAllJoinedAcDetail: function(){
    const ac = this.data.acJoined
    const db = wx.cloud.database()
    var that = this
    for(var i=0,len=ac.length;i<len;i++){
      console.log("ac["+i+"]=",ac[i])
      wx.cloud.callFunction({
        name: "getCertainAcInfo",
        data: {
          searchId: ac[i],
        }, success: function (res) {
          if (res.result.data.length != 0) { // 如果有记录，赋值给personalInfo
            that.data.acJoinedDetail.push(res.result.data[0])
            console.log("pushed", res.result.data[0])
            that.setData({
              acJoinedDetail: that.data.acJoinedDetail,
            })
          } else {
            console.log('没有记录')
          }
        }
      })
    }
    
    console.log('参加活动获取成功, acJoinedDetail=', this.data.acJoinedDetail)

      // db.collection("activities").where({
      //   _id:ac[i],
      //   outdated:false,
      // }).get({
      //   success: res => {
      //     if (res.data.length != 0) { // 如果有记录，赋值给personalInfo
      //       var time = util.formatTime(new Date())
      //       if (time < res.data.stopTime){
      //         this.updateOutdated(ac[i])
      //         console.log("shit outdated")
      //       } else{
      //         this.data.acJoinedDetail.push(res.data[0])
      //         console.log("pushed",res.data[0])
      //       }
      //       this.setData({
      //         acJoinedDetail:this.data.acJoinedDetail,
      //       })
      //       console.log('参加活动获取成功, acJoinedDetail=', this.data.acJoinedDetail)
      //     } else {
      //       console.log('没有记录')
      //     }
      //   },
      //   fail: err => {
      //     console.error('[数据库] [查询记录] 失败：', err)
      //   },
      // })
  },
  //更新活动到过期
  updateOutdated:function(id){
    const db = wx.cloud.database()
    db.collection('personalAcInfo').doc(id).update({
      data: {
        outdated: true
      },
      success: res => {
        console.log("活动"+id+"已过报名时间")
      },
      fail: err => {
        console.error('[数据库] [更新记录] 失败：', err)
      }
    })
  },
  //添加空白记录
  addBlankAcJoin: function () {
    const db = wx.cloud.database()
    db.collection("personalAcInfo").add({
      data: {
        joinedAcList:this.data.acJoined,
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res)
        this.getAllUnjoinedAcDetail()
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
})