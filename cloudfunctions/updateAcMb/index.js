// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var st=false
  var acId = event.searchId
  return await db.collection('activities').doc(acId).update({
    data:{
      members: event.members,
      currentNum: event.currentNum,
    }
  })
}