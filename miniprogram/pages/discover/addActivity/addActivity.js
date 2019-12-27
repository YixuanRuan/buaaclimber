// pages/addInfo/addInfo.js
const app = getApp()
const confg = require('../../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTopTips: false,
    tips: "",

    types: ['轻装', '重装'],
    typeIndex: 0,

    // personalInfo dic
    activityInfo: {
      leader: "",
      phone: "",
      sex: "",
      joinTime: "",
      location: "",
      intro:"",
      beginTime: "",
      endTime:"",
      stopTime:"2019-04-23",
      currentNum: 0,
      num:0,
      budget:"",
      type:"",
      moneyName:"",
      moneyPhone:"",
      money:"20",
      members:[],
      outdated:false,
    }
    //
  },

  onLoad: function (options) {
    this.getPersonalInfo()
  },


  // MARK: - 云端数据库操作

  // 获取云端个人详细信息
  getPersonalInfo: function () {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('personalInfo').where({
      _openid: app.globalData.openId
    }).get({
      success: res => {
        if (res.data.length != 0) { // 如果有记录，赋值给personalInfo
          var leader = "activityInfo.leader"
          var phone = "activityInfo.phone"
          var sex = "activityInfo.sex"
          var joinTime = "activityInfo.joinTime"
          var moneyName ="activityInfo.moneyName"
          var moneyPhone="activityInfo.moneyPhone"
          this.setData({
            personalInfoId: res.data[0]._id,
            [leader]: res.data[0].name,
            [phone]: res.data[0].cellphoneNum,
            [sex]: res.data[0].sex,
            [joinTime]: res.data[0].joinTime,
            [moneyName]: res.data[0].name,
            [moneyPhone]: res.data[0].cellphoneNum,
          })
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
  
  // MARK: - 信息改变 UI 

  // 改变出队类型列表
  bindTypeChange: function (e) {
    console.log('picker Type 发生选择改变，携带值为', e.detail.value);
    this.setData({
      typeIndex: e.detail.value,
    })
  },

  // MARK: - 表单检验与提交

  // 显示必填信息未填提示
  showTopTips: function (tips) {
    var that = this;
    this.setData({
      showTopTips: true,
      tips: tips
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false,
      });
    }, 3000);
  },

  // 检查是否为空
  isEmpty: function (content) {
    return (content == null) || (content.trim().length == 0);
  },

  // 表单检验与提交
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var data = e.detail.value
    var that = this
    if (this.isEmpty(data.leader)) {
      this.showTopTips("领队姓名不能为空！");
    } else if (this.isEmpty(data.phone)) {
      this.showTopTips("领队电话不能为空！");
    } else if (this.isEmpty(data.sex)) {
      this.showTopTips("领队性别不能为空！");
    } else if (this.isEmpty(data.joinTime)) {
      this.showTopTips("领队入社时间不能为空！");
    } else if (this.isEmpty(data.location)) {
      this.showTopTips("出队地点不能为空！");
    } else if (this.isEmpty(data.intro)) {
      this.showTopTips("出队简介不能为空！");
    } else if (this.isEmpty(data.beginTime)) {
      this.showTopTips("出发时间不能为空！");
    } else if (this.isEmpty(data.endTime)) {
      this.showTopTips("返回时间不能为空！");
    } else if (this.isEmpty(data.num)) {
      this.showTopTips("出队人数不能为空！");
    } else if (this.isEmpty(data.currentNum)) {
      this.showTopTips("当前人数不能为空！");
    } else if (this.isEmpty(data.budget)) {
      this.showTopTips("出队预算不能为空！");
    } else if (this.isEmpty(data.moneyName)) {
      this.showTopTips("财务姓名不能为空！");
    } else if (this.isEmpty(data.moneyPhone)) {
      this.showTopTips("财务电话不能为空！");
    } else if (this.isEmpty(data.money)) {
      this.showTopTips("防鸽费不能为空！");
    } else {
      wx.showModal({
        title: '表单提交',
        content: '确认要提交吗？',
        confirmText: "确认",
        cancelText: "返回",
        success: function (res) {
          console.log(res);
          if (res.confirm) {
            console.log('用户点击确认操作')
            that.setData({
              'activityInfo.leader': data.leader,
              'activityInfo.phone': data.phone,
              'activityInfo.sex': data.sex,
              'activityInfo.joinTime': data.joinTime,
              'activityInfo.location': data.location,
              'activityInfo.intro': data.intro,
              'activityInfo.beginTime': data.beginTime,
              'activityInfo.endTime': data.endTime,
              'activityInfo.num': parseInt(data.num),
              'activityInfo.currentNum': parseInt(data.currentNum),
              'activityInfo.budget': data.budget,
              'activityInfo.type': that.data.types[that.data.typeIndex],
              'activityInfo.moneyName': data.moneyName,
              'activityInfo.moneyPhone': data.moneyPhone,
              'activityInfo.money': data.money,
            });
            that.addActivityInfo()
          } else {
            console.log('用户点击返回操作')
          }
        }
      });
    }

  },
  formReset: function () {
    console.log('form发生了reset事件')
  },
  //

  // 新增一条空白记录
  addActivityInfo: function () {
    const db = wx.cloud.database()
    db.collection('activities').add({
      data: this.data.activityInfo,
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        wx.showToast({
          title: '活动添加成功',
        });
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res);
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 1000);
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '活动添加失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
  //

  bindDateChange: function (e) {
    this.setData({
      'activityInfo.stopTime': e.detail.value
    })
  },

})

