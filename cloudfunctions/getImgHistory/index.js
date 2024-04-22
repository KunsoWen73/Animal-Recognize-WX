// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  try {  
    const wxContext = cloud.getWXContext()   
    const collection = db.collection('imgHistory')  
    const openid = wxContext.OPENID // 从云函数的上下文中获取 openid  
  
    // 查询数据库，返回与 openid 相关的所有记录  
    const queryResult = await collection.where({  
      openid: openid  
    }).orderBy('createdAt', 'desc').field({
      imgResult: true,
      fileID: true,
      createdAt: true
    }).get() 
  
    // 返回查询到的所有记录  
    return queryResult.data  
  } catch (err) {  
    console.error(err)  
    return err  
  }
}