// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const axios = require('axios'); // 引入axios库用于发起HTTP请求  
const MODEL_API_URL = "https://aip.baidubce.com/rpc/2.0/ai_custom_bml/v1/classification/shark_resnet_3_8";
const API_KEY = "2Io2TwDh6adpfs1mINqAxdLP";
const SECRET_KEY = "Sa6cx8qy6G0AD1sCbGoJ4ZkQpZgiiFFQ";
const topNum = 1;
exports.main = async (event, context) => {  
  const { fileID } = event; // 确保event中有fileID字段
  try{
    // 获取图片二进制数据
    const response = await axios({
      url: fileID,
      responseType: 'arraybuffer'
    });
    // 转换为base64
    const imageBase64 = Buffer.from(response.data).toString('base64');
    // 2. 获取百度API的Access Token  
    const accessToken = await getAccessToken();  
  
    // 3. 调用图像分类API  
    const result = await classifyImage(imageBase64, accessToken);  
  
    return result;  
  } catch (err) {  
    console.error(err);  
    return {  
      error: err.message  
    };  
  }  
};  
  
// 获取百度API的Access Token  
function getAccessToken() {  
  const authUrl = 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=2Io2TwDh6adpfs1mINqAxdLP&client_secret=Sa6cx8qy6G0AD1sCbGoJ4ZkQpZgiiFFQ'; 
  
  return new Promise((resolve, reject) => {  
    axios.get(authUrl)  
      .then(response => {  
        if (response.status === 200) {  
          const data = response.data;  
          const accessToken = data.access_token;  
          resolve(accessToken);  
        } else {  
          reject(new Error('Failed to fetch access token'));  
        }  
      })  
      .catch(error => {  
        reject(error);  
      });  
  });  
}  
  
async function classifyImage(imageBase64, accessToken) {  
  try {  
    // 构造请求体  
    const requestData = JSON.stringify({
      image: imageBase64,
      top_num: topNum 
    });
  
    // 发送POST请求到图像分类API  
    const apiResponse = await axios.post(`${MODEL_API_URL}?access_token=${accessToken}`, requestData, {  
      headers: {  
        'Content-Type': 'application/json' // 注意header属性名首字母大写  
      }  
    });  
  
    // 检查响应状态并返回结果  
    if (apiResponse.status === 200) {  
      return apiResponse.data;  
    } else {  
      throw new Error('Failed to classify image: API did not return 200 status');  
    }  
  } catch (error) {  
    console.error('Error classifying image:', error);  
    throw error; // 可以选择是否再次抛出错误，取决于你的错误处理策略  
  }  
}