// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  try {  
    const collection = db.collection('animal')  
    // 查询数据库，返回与 openid 相关的所有记录  
    const queryResult = await collection.orderBy('id', 'asc')
    .field({
      id: true,
      img: true,
      name: true
    }).get() 
  
    // 返回查询到的所有记录  
    return queryResult.data  
  } catch (err) {  
    console.error(err)  
    return err  
  }
}