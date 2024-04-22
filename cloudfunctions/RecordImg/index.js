// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  try {  
    // 从event中提取fileid和openid  
    const { fileID, openid , imgResult} = event  
  
    // 检查参数是否存在  
    if (!fileID || !openid || !imgResult) {  
      return {  
        error: 'fileID,openid或imgResult缺失',  
        code: 400  
      }  
    }  
  
    // 构造要新增的记录  
    const record = {  
      fileID: fileID,  
      openid: openid,
      imgResult: imgResult  
    }  
    // 在 record 对象中添加 createdAt 字段作为创建时间戳  
    record.createdAt = new Date().getTime();
    // 调用数据库API新增记录  
    const db = cloud.database()  
    const collection = db.collection('imgHistory')  
    const res = await collection.add({  
      data: record
    })  
  
    // 返回新增记录的ID  
    return {  
      id: res._id,  
      code: 200,  
      msg: '记录新增成功'  
    }  
  } catch (err) {  
    // 处理错误  
    console.error(err)  
    return {  
      error: err.message,  
      code: 500  
    }  
  }  
}