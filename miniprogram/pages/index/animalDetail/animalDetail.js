// pages/index/animalDetail/animalDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    animal: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const animalId = options.id;
    console.log(animalId);  
    // 假设您有一个获取动物详情的函数 getAnimalDetailById  
    this.getAnimalDetailById(animalId);
  },
  getAnimalDetailById: function(animalId) {
    wx.cloud.callFunction({  
      name: 'getAnimalDetail', // 云函数名称  
      data: {
        id: animalId
      },  
      success: res => {
        console.log(res.result);
        this.setData({
          animal: res.result[0]
        })
      },
      fail: err => {  
        console.error('云函数调用失败', err)  
        // 这里处理调用失败的情况，如显示错误信息等  
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