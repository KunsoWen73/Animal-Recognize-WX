// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()  
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()  
  try {  
    const { nickname, avatarUrl } = event  
    const userInfoCollection = db.collection('user')  
    const updateResult = await userInfoCollection.where({  
      openid: wxContext.OPENID // 使用 wxContext.OPENID 来获取当前用户的 openid  
    }).update({  
      data: { // 直接在这里提供要更新的数据  
        nickname: nickname,  
        avatarUrl: avatarUrl  
      }  
    })  
    // 读取更新后的用户信息  
    const queryResult = await cloud.database().collection('user').where({  
      openid: wxContext.OPENID  
    }).get() //新增代码，如果存在对应记录，则将userData更新为数据库中的记录
    if (queryResult.data && queryResult.data.length > 0) {  
      // 如果记录存在，返回记录 
      const record = queryResult.data[0];
      const nickname = record.nickname;
      const avatarUrl = record.avatarUrl;
    }  
    // 返回更新结果，可以根据实际情况调整返回内容  
    return {  
      success: true,  
      message: 'User info updated successfully',  
      // 如果数据库操作返回了更新影响的文档数，也可以返回这个信息 
      nickname: nickname, // 将更新后的用户信息返回 
      avatarUrl: avatarUrl,
      updatedCount: updateResult.updated 
    }  
  } catch (error) {  
    console.error(error)  
    return {  
      success: false,  
      error: error.message  
    }  
  }  
}