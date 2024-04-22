// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const fileID = event.fileID; // 这里应该是你想要获取临时 URL 的文件的 fileID  
  const result = await cloud.getTempFileURL({  
    fileList: [fileID] // 只包含一个 fileID 的数组  
  });  
  // 返回结果中的第一个文件（也是唯一一个文件）的临时 URL  
  if (result.fileList && result.fileList.length > 0) {  
    return result.fileList[0].tempFileURL;  
  } else {  
    return { errMsg: 'Failed to get temp file URL' };  
  }  
}