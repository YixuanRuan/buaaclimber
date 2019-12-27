// pages/userCenter/memberInfoManage/addHiking/addHiking.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTopTips: false,
    delBtnWidth: 180,//删除按钮宽度单位（rpx）
    tips: "",
    userOutdoorExperiences: [],
    outdoorExperiences: ['阳台山'],
    outdoorExperienceIndex: 0,

    outdoorJobs: ['后勤'],
    outdoorJobIndex: 0,
    date: "2010-01-01"

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getStorage({
      key: 'outdoorExperiences',
      success: function (res) {
        that.setData({
          outdoorExperiences: res.data
        })
      }
    })
    wx.getStorage({
      key: 'outdoorJobs',
      success: function (res) {
        that.setData({
          outdoorJobs: res.data
        })
      }
    })
    qcloud.request({
      url: config.service.getUserOutdoorExperiencesUrl,
      login: true,
      success: function(res) {
        console.log(res.data)
        var oldUserOutdoorExperiences = JSON.parse(res.data.data[0].outdoor_experiences)
        that.setData({
          userOutdoorExperiences: oldUserOutdoorExperiences
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  bindEditTap: function(e) {
    this.setData({
      showDelete: !this.data.showDelete
    })
  },
  bindOutdoorExperienceChange: function(e) {
    console.log('picker OutdoorExperience 发生选择改变，携带值为', e.detail.value);
    this.setData({
      outdoorExperienceIndex: e.detail.value
    })
  },
  bindOutdoorJobChange: function(e) {
    console.log('picker OutdoorJob 发生选择改变，携带值为', e.detail.value);
    this.setData({
      outdoorJobIndex: e.detail.value
    })
  },
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  showTopTips: function(tips) {
    var that = this;
    this.setData({
      showTopTips: true,
      tips: tips
    });
    setTimeout(function() {
      that.setData({
        showTopTips: false,
      });
    }, 3000);
  },
  isEmpty: function(content) {
    return (content == null) || (content.trim().length == 0);
  },
  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var data = e.detail.value
    var that = this
    wx.showModal({
      title: '表单提交',
      content: '确认要提交吗？',
      confirmText: "确认",
      cancelText: "返回",
      success: function(res) {
        console.log(res);
        if (res.confirm) {
          console.log('用户点击确认操作')
          var newUserOutdoorExperiences = that.data.userOutdoorExperiences
          newUserOutdoorExperiences.push(data)
          that.setData({
            userOutdoorExperiences: newUserOutdoorExperiences
          });
          console.log(that.data.userOutdoorExperiences)
          qcloud.request({
            login: true,
            url: config.service.addUserOutdoorExperiencesUrl,
            data: {
              outdoor_experiences: that.data.userOutdoorExperiences
            },
            success: function(response) {
              console.log(response);
            },
            fail: function(err) {
              console.log(err);
            }
          });
        } else {
          console.log('用户点击返回操作')
        }
      }
    });
  },
  formReset: function() {
    console.log('form发生了reset事件')
  },

  touchS: function(e) {

    if (e.touches.length == 1) {

      this.setData({

        //设置触摸起始点水平方向位置

        startX: e.touches[0].clientX

      });

    }

  },

  touchM: function(e) {

    if (e.touches.length == 1) {

      //手指移动时水平方向位置

      var moveX = e.touches[0].clientX;

      //手指起始点位置与移动期间的差值

      var disX = this.data.startX - moveX;

      var delBtnWidth = this.data.delBtnWidth;

      var txtStyle = "";

      if (disX == 0 || disX < 0) { //如果移动距离小于等于0，文本层位置不变

        txtStyle = "left:0px";

      } else if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离

        txtStyle = "left:-" + disX + "px";

        if (disX >= delBtnWidth) {

          //控制手指移动距离最大值为删除按钮的宽度

          txtStyle = "left:-" + delBtnWidth + "px";

        }

      }

      //获取手指触摸的是哪一项

      var index = e.currentTarget.dataset.index;

      var userOutdoorExperiences = this.data.userOutdoorExperiences;

      userOutdoorExperiences[index].txtStyle = txtStyle;

      //更新列表的状态

      this.setData({

        userOutdoorExperiences: userOutdoorExperiences

      });

    }

  },



  touchE: function(e) {

    if (e.changedTouches.length == 1) {

      //手指移动结束后水平位置

      var endX = e.changedTouches[0].clientX;

      //触摸开始与结束，手指移动的距离

      var disX = this.data.startX - endX;

      var delBtnWidth = this.data.delBtnWidth;

      //如果距离小于删除按钮的1/2，不显示删除按钮

      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";

      //获取手指触摸的是哪一项

      var index = e.currentTarget.dataset.index;

      var userOutdoorExperiences = this.data.userOutdoorExperiences;

      userOutdoorExperiences[index].txtStyle = txtStyle;

      //更新列表的状态

      this.setData({

        userOutdoorExperiences: userOutdoorExperiences

      });

    }

  },

  //获取元素自适应后的实际宽度

  getEleWidth: function(w) {

    varreal = 0;

    try {

      var res = wx.getSystemInfoSync().windowWidth;

      var scale = (750 / 2) / (w / 2); //以宽度750px设计稿做宽度的自适应

      // console.log(scale);

      real = Math.floor(res / scale);

      return real;

    } catch (e) {

      return false;

      // Do something when catch error

    }

  },

  initEleWidth: function() {

    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);

    this.setData({

      delBtnWidth: delBtnWidth

    });

  },

  //点击删除按钮事件

  delItem: function(e) {

    //获取列表中要删除项的下标
    var that = this

    var index = e.target.dataset.index;

    var userOutdoorExperiences = this.data.userOutdoorExperiences;

    wx.showModal({
      title: '删除确认',
      content: '确认要删除吗？',
      confirmText: "确认",
      cancelText: "返回",
      success: function(res) {
        console.log(res);
        if (res.confirm) {
          console.log('用户点击确认操作')
          //移除列表中下标为index的项
          userOutdoorExperiences.splice(index, 1);
          //更新列表的状态
          that.setData({
            userOutdoorExperiences: userOutdoorExperiences
          });
          console.log(that.data.userOutdoorExperiences)
          qcloud.request({
            login: true,
            url: config.service.addUserOutdoorExperiencesUrl,
            data: {
              outdoor_experiences: that.data.userOutdoorExperiences
            },
            success: function(response) {
              console.log(response);
            },
            fail: function(err) {
              console.log(err);
            }
          });
        } else {
          console.log('用户点击返回操作')
        }
      }
    });

    

  },
})