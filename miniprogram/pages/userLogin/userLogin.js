// pages/userLogin/userLogin.js
const { envList } = require('../../envList.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: 'cloud://cloud1-8ghautw7cbf2383e.636c-cloud1-8ghautw7cbf2383e-1324617939/Picture/panda.png',
    imgSrc2:'cloud://cloud1-8ghautw7cbf2383e.636c-cloud1-8ghautw7cbf2383e-1324617939/Picture/5.jpg',
    imgUrl1: '', // 临时用于存储图片1的URL  
    imgUrl2: '', // 临时用于存储图片2的URL
  },
  getFileUrl: function(fileID) {  
    return new Promise((resolve, reject) => {  
      wx.cloud.callFunction({  
        name: 'getFilePath', // 确保云函数名称与云控制台中的名称一致  
        data: {  
          fileID: fileID  
        },  
        success: res => {  
          // 检查返回的结果中是否包含 tempFileURL  
          if (res.result) {  
            resolve(res.result); // 成功获取到临时 URL，使用 resolve 返回  
          } else {  
            reject(new Error('云函数返回的结果中未包含 tempFileURL')); // 如果没有找到 tempFileURL，使用 reject 抛出错误  
          }  
        },  
        fail: err => {  
          reject(err); // 调用云函数失败，使用 reject 抛出错误  
        }  
      });  
    });  
  },  
  userLogin: function() {
    getApp().userLogin();
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const imgSrc = this.data.imgSrc;
    const imgSrc2 = this.data.imgSrc2;
    // 同时获取两个图片的临时 URL  
    Promise.all([  
      this.getFileUrl(imgSrc),  
      this.getFileUrl(imgSrc2)  
    ])  
    .then(([imgUrl1, imgUrl2]) => {  
      // 两个图片都成功获取临时 URL，更新数据  
      this.setData({  
        imgUrl1: imgUrl1,  
        imgUrl2: imgUrl2  
      });  
      // 可以在这里进行页面渲染或其他操作  
    })  
    .catch(error => {  
      // 如果有任何一个请求失败，catch 会被触发  
      console.error('获取图片临时 URL 失败', error);  
      // 可以在这里进行错误处理，比如显示错误提示等  
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