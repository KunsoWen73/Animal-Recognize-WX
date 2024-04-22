// pages/index/UserSet/UserSet.js
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    theme: wx.getSystemInfoSync().theme,
    nickname: '',
    avatarUrl: '',
    openid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onLoad() {
    wx.onThemeChange((result) => {
      this.setData({
        theme: result.theme
      })
    })
    const app = getApp();
    console.log('App global data:', app.globalData); // 检查全局数据  
    console.log('User info in global data:', app.globalData.userInfo); // 检查用户信息
    if (app.globalData.userInfo.openid && app.globalData.userInfo.nickname && app.globalData.userInfo.avatarUrl) {  
      this.setData({  
        nickname: app.globalData.userInfo.nickname,  
        avatarUrl: app.globalData.userInfo.avatarUrl,
        openid: app.globalData.userInfo.openid  
      });  
    } else {  
      // 处理 userInfo 未定义或为空的情况  
      console.error('User info is not available.');  
    } 
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    })
  },
  inputNickname(e) {  
    this.setData({  
      nickname: e.detail.value  
    });  
  },  
  // 更新用户资料
  RenewUser: function(){
    const app = getApp();
    const openid = this.data.openid;
    let nickname = '';  
    let avatarUrl = '';  
    // 检查昵称是否为空  
    if (this.data.nickname) {  
      nickname = this.data.nickname;  
    } else {  
      // 昵称为空时显示提示消息框  
      wx.showToast({  
        title: '昵称不能为空',  
        icon: 'none',  
        duration: 2000  
      });  
      return; // 提前退出函数  
    }  
    
    // 检查头像URL是否为空，如果为空则使用全局数据中的头像URL  
    if (this.data.avatarUrl) {  
      avatarUrl = this.data.avatarUrl;  
    } else {  
      avatarUrl = app.globalData.userInfo.avatarUrl;  
    } 
     // 调用云函数  
     wx.cloud.callFunction({  
      name: 'updateUserInfo', // 云函数名称  
      data: {  
        openid: openid,  
        nickname: nickname,  
        avatarUrl: avatarUrl  
      },  
      success: res => {  
        // 云函数调用成功  
        if (res.result) {
          // 更新全局的 userInfo  
          const app = getApp();  
          app.globalData.userInfo.nickname = res.result.nickname; // 更新全局数据
          app.globalData.userInfo.avatarUrl = res.result.avatarUrl; // 更新全局数据
          wx.setStorageSync('userInfo', app.globalData.userInfo);
          wx.showToast({  
            title: '用户信息更新成功',  
            icon: 'success',  
            duration: 2000  
          });  
        } else {  
          // 更新失败，处理错误  
          wx.showToast({  
            title: '用户信息更新失败',  
            icon: 'none',  
            duration: 2000  
          });  
        }  
      },  
      fail: err => {  
        // 云函数调用失败  
        console.error('调用云函数失败', err);  
        wx.showToast({  
          title: '调用云函数失败',  
          icon: 'none',  
          duration: 2000  
        });  
      }  
    });  
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