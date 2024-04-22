// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  try {  
    const name = event.name;
    const collection = db.collection('animal');  
    const queryResult = await collection.where({
      name: name
    }).field({
      id: true
    }).get() 
  
    // 返回查询到的所有记录  
    return queryResult.data  
  } catch (err) {  
    console.error(err)  
    return err  
  }
}