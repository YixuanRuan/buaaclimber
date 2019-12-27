// pages/addInfo/addInfo.js
const app = getApp()
const confg = require('../../../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTopTips: false,
    tips: "",
    personalInfoId: "",
    isAgree: true,
    abilitiesCheckboxItems: [
      { id: 1, name: '摄影大佬', checked: false},
      { id: 2, name: '海报制作', checked: false },
      { id: 3, name: '推送排版', checked: false },
      { id: 4, name: '文案创作', checked: false },
      { id: 5, name: '小程序制作', checked: false },
      { id: 6, name: 'app开发', checked: false },
      { id: 7, name: '健身达人', checked: false },
      { id: 8, name: '攀岩大佬', checked: false }
    ],

    ABOTypes: ["A", "B", "O", "AB"],
    ABOIndex: 0,

    RHTypes: ["RH阳性", "RH阴性"],
    RHIndex: 0,

    departments: ['士谔书院', '冯如书院', '士嘉书院','守锷书院',
      '致真书院', '知行书院', '材料学院', '电子信息工程学院', '自动化科学与电气工程学院', '能源动力与工程学院', '航空科学与工程学院', '计算机学院', '机械工程及自动化专业', '经济管理学院', '数学与系统科学学院', '生物与医学工程学院', '人文社会科学学院', '外国语学院', '交通科学与工程学院', '可靠性与系统工程学院', '宇航学院', '飞行学院', '仪器科学与光电工程学院', '北京学院', '物理科学与核能工程学院', '法学院', '软件学院', '高等理工学院', '中法工程师学院', '国际学院', '新媒体艺术与设计学院', '化学学院', '马克思主义学院', '人文与社会科学高等研究院', '空间与环境学院', '国际通用工程学院', '网络空间安全学院','创业管理培训学院'],
    departmentIndex: 0,

    sexs: ['男','女'],
    sexIndex: 0,

// personalInfo dic
    personalInfo:{
      name:"",
      studentNum:"",
      department: "",
      cellphoneNum: "",
      wechat: "",
      qq: "",
      email: "",
      joinTime: "2001-09-01",
      sex: "",
      nation: "",
      ABOType: "",
      idCardNum: "",
      anamnesis: "",
      abilities: [],
      emergencyContactName: "",
      emergencyContactCellphoneNum: "",
      hikingExperience:"",
      snowExperience:"",
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
          this.setData({
            personalInfoId: res.data[0]._id,
            personalInfo: res.data[0]  
          })
          delete this.data.personalInfo._id
          delete this.data.personalInfo._openid
          console.log('[数据库] [查询记录] 成功, personalInfo= ', this.data.personalInfo)
          this.syncWithCloudPickerValue()
        } else {    // 如果没有记录，增加一条空白记录
          this.addPersonalInfo()
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

// 新增一条空白记录
  addPersonalInfo: function () {
    const db = wx.cloud.database()
    db.collection('personalInfo').add({
      data: this.data.personalInfo,
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        wx.showToast({
          title: '新增记录成功',
        });
        this.setData({
          'personalInfoId': res._id,
        });
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res)
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

// 更新云端信息
  updatePersonalInfo: function () {
    const db = wx.cloud.database()
    db.collection('personalInfo').doc(this.data.personalInfoId).update({
      data: this.data.personalInfo,
      success: res => {
        console.log("更新信息成功：", res);
        wx.showToast({
          title: '更新信息成功!',
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          });
        }, 1000)
      },
      fail: err => {
        icon: 'none',
          console.error('[数据库] [更新记录] 失败：', err)
      }
    })
  },
//


// MARK: - 未用到的生命周期函数
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onReady: function () {

  },





//


// MARK: - 信息改变 UI 

// 改变学院书院列表
  bindDepartmentChange: function (e) {
    console.log('picker Department 发生选择改变，携带值为', e.detail.value);
    this.setData({
      departmentIndex: e.detail.value,
    })
  },

// 改变时间
  bindDateChange: function (e) {
    this.setData({
      'personalInfo.joinTime': e.detail.value
    })
  },

// 改变性别选择
  bindSexChange: function (e) {
    console.log('picker Sex 发生选择改变，携带值为', e.detail.value);
    this.setData({
      sexIndex: e.detail.value,
    })
  },

// 改变血型选择
  bindBloodTypeABOChange: function (e) {
    console.log('picker BloodTypeABO 发生选择改变，携带值为', e.detail.value);

    this.setData({
      ABOIndex: e.detail.value
    })
  },
  // bindBloodTypeRHChange: function (e) {
  //   console.log('picker BloodTypeRH 发生选择改变，携带值为', e.detail.value);

  //   this.setData({
  //     RHIndex: e.detail.value
  //   })
  // },

// 改变技能选择列表
  bindAbilitiesCheckboxChange: function (e) {
    console.log('AbilitiesCheck发生change事件，携带value值为：', e.detail.value);

    var checkboxItems = this.data.abilitiesCheckboxItems, values = e.detail.value;
    
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].id == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }

    this.setData({
      abilitiesCheckboxItems: checkboxItems
    });
  },


// 改变同意书选择框
  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
  },


// 同步云端picker值
  syncWithCloudPickerValue: function(){
    var that = this
    var a = this.data.ABOTypes.findIndex(function(element){
      return (element.localeCompare(that.data.personalInfo.ABOType) == 0)
    })
    var b = this.data.departments.findIndex(function (element) {
      return (element.localeCompare(that.data.personalInfo.department) == 0)
    })
    var c = this.data.sexs.findIndex(function (element) {
      return (element.localeCompare(that.data.personalInfo.sex) == 0)
    })
    var x
    var boxes = this.data.abilitiesCheckboxItems
    for (x in this.data.personalInfo.abilities) {
      boxes[this.data.personalInfo.abilities[x]-1].checked = true
    }
    this.setData({
      ABOIndex: a,
      departmentIndex: b,
      sexIndex: c,
      abilitiesCheckboxItems: boxes
    })
  },
//


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
    if (this.isEmpty(data.name)) {
      this.showTopTips("姓名不能为空！");
    } else if (this.isEmpty(data.studentNum)) {
      this.showTopTips("学号不能为空！");
    } else if (this.isEmpty(data.cellphoneNum)) {
      this.showTopTips("手机号不能为空！");
    } else if (this.isEmpty(data.wechat)) {
      this.showTopTips("微信号不能为空！");
    } else if (this.isEmpty(data.qq)) {
      this.showTopTips("QQ号不能为空！");
    } else if (this.isEmpty(data.email)) {
      this.showTopTips("E-mail不能为空！");
    } else if (this.isEmpty(data.emergencyContactName) || this.isEmpty(data.emergencyContactCellphoneNum)) {
      this.showTopTips("紧急联系人及联系方式不能为空！");
    } else if (this.isEmpty(data.joinTime)) {
      this.showTopTips("入社时间不能为空！");
    } else if (this.isEmpty(data.nation)) {
      this.showTopTips("民族不能为空！");
    } else if (!this.data.isAgree) {
      this.showTopTips("请同意北航凌峰社小程序服务条款！");
    } else {
      wx.showModal({
        title: '表单提交',
        content: '确认要提交吗？（将覆盖原有信息）',
        confirmText: "确认",
        cancelText: "返回",
        success: function (res) {
          console.log(res);
          if (res.confirm) {
            console.log('用户点击确认操作')
            that.setData({
              'personalInfo.name': data.name,
              'personalInfo.studentNum': data.studentNum,
              'personalInfo.department': that.data.departments[data.department],
              'personalInfo.cellphoneNum': data.cellphoneNum,
              'personalInfo.wechat': data.wechat,
              'personalInfo.qq': data.qq,
              'personalInfo.email': data.email,
              'personalInfo.joinTime': data.joinTime,
              'personalInfo.sex': that.data.sexs[data.sex],
              'personalInfo.nation': data.nation,
              'personalInfo.ABOType': that.data.ABOTypes[data.bloodTypeAbo],
              'personalInfo.idCardNum': data.idCardNum,
              'personalInfo.anamnesis': data.anamnesis,
              'personalInfo.abilities': data.abilities,
              'personalInfo.emergencyContactName': data.emergencyContactName,
              'personalInfo.emergencyContactCellphoneNum': data.emergencyContactCellphoneNum,
              'personalInfo.hikingExperience': data.hikingExperience,
              'personalInfo.snowExperience': data.snowExperience,
            });
            that.updatePersonalInfo()
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


//

})

