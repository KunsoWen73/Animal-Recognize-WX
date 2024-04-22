// pages/index/userHistory/userHistory.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgHistoryList: [] // 用于存储查询结果的数组 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 调用云函数  
    wx.cloud.callFunction({  
      name: 'getImgHistory', // 云函数名称  
      data: {
      },  
      success: res => {
        console.log(res.result)  
        const imgHistoryArray = res.result;  
        // 遍历数组，将每个对象的 createdAt 时间戳转换为日期，并创建一个新对象包含所有需要的信息  
        const updatedImgHistoryArray = imgHistoryArray.map(item => {    
          // 确保 createdAt 存在且是数字  
          if (item.createdAt && typeof item.createdAt === 'number') {  
            const date = new Date(item.createdAt);  
            // 格式化日期  
            const formattedDate = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)} ${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}`;  
            // 创建一个新对象，包含 fileID, imgResult 和 formattedDate  
            return {  
              fileID: item.fileID,  
              imgResult: item.imgResult,  
              createdAt: formattedDate  
            };  
          } else {  
            // 如果 createdAt 不存在或不是数字，返回一个错误或默认对象  
            console.error('Invalid timestamp for item:', item);  
            return {  
              fileID: item.fileID,  
              imgResult: item.imgResult,  
              createdAt: 'Invalid Date'  
            };  
          }  
        });  
          
        // 云函数执行成功，更新数据到页面  
        this.setData({      
          imgHistoryList: updatedImgHistoryArray    
        });  
          
        // 打印更新后的列表  
        console.log(this.data.imgHistoryList);  
      },      
      fail: err => {      
        // 云函数执行失败，处理错误      
        console.error(err);    
      }     
    });    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})