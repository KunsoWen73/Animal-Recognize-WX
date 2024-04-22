// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()  
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // 构造保存到数据库的数据对象  
  try {  
    // 查询 user 集合中是否存在 openid 对应的记录  
    const queryResult = await cloud.database().collection('user').where({  
      openid: wxContext.OPENID  
    }).get() //新增代码，如果存在对应记录，则将userData更新为数据库中的记录

    if (queryResult.data && queryResult.data.length > 0) {  
      // 如果记录存在，返回记录 
      const record = queryResult.data[0]  
      const userInfo = {  
        nickname: record.nickname,  
        avatarUrl: record.avatarUrl,
        openid: wxContext.openid,
        appid: wxContext.appid  
      }  
      return {  
        message: 'Record already exists',  
        openid: wxContext.OPENID,  
        appid: wxContext.APPID,  
        unionid: wxContext.UNIONID,
        userInfo:userInfo  
      }  
    } else {  
      // 如果记录不存在，则插入新记录 
      const userInfo = {  
        openid: wxContext.OPENID,  
        appid: wxContext.APPID,  
        nickname: '微信用户', // 假设event.userInfo包含nickname字段  
        avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0' // 假设event.userInfo包含avatarUrl字段  
      }
      const addResult = await db.collection('user').add({  
        data: userInfo  
      })
      return {  
        message: 'New record added',  
        openid: wxContext.OPENID,  
        appid: wxContext.APPID,  
        unionid: wxContext.UNIONID,  
        databaseResult: addResult, 
        userInfo: userInfo 
      }  
    }  
  } catch (error) {  
    // 如果查询或插入失败，返回错误信息  
    console.error(error)  
    return {  
      error: error.message  
    }  
  }  
}