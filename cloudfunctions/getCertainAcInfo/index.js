// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var acData
  const acId = event.searchId
  return await db.collection('activities').where({
    _id:acId,
    outdated: false,
  }).get({
    success: res => {
      if (res.data.length != 0) { // 如果有记录，赋值给personalInfo
        acData = res.data
      } else {    // 如果没有记录，增加一条空白记录
        console.log('shit happend')
      }
    },
  })

  return {
    event,
    acDetail: acData,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}