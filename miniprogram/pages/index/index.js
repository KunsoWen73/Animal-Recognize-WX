// index.js
// const app = getApp()
const { envList } = require('../../envList.js');
const systemInfo = wx.getSystemInfoSync();
const statusBarHeight = systemInfo.statusBarHeight;
Page({  
  data: {
    animalList:[],
    button1Pressed: false,  
    button2Pressed: false,  
    button3Pressed: false, 
    currentTab: 'recognize', // 默认显示识别页面的内容：recognize，atlas，profile
    imgSrc: '',
    isWaiting: false,
    fileName: '',
    FileContent: '',
    userInfo: null, // 添加一个userInfo字段来存储用户信息
    nickname: '',
    avatarUrl: '',
    testimg: '',  //识别图片的url
    imgResult: '',  //识别结果
    imgID:'',  //图片云存储id
  }, 
  goToDetail: function(e) {  
    const animalID = e.currentTarget.dataset.id;  
    // 这里简化处理，直接传递ID到详情页，您可以在详情页根据ID请求后端数据  
    wx.navigateTo({  
      url: '/pages/index/animalDetail/animalDetail?id=' + animalID  
    });  
  }, 
  switchTab(e) {  
    const tab = e.currentTarget.dataset.tab;  
    this.setData({  
      currentTab: tab  
    });  
  },  
  ChooseImage: function() {  
    var that = this;
    that.setData({  
      button2Pressed: true,  
    })
    setTimeout(() => {  
      this.setData({  
        button2Pressed: false  
      });  
    }, 200);  
    wx.chooseImage({  
      count: 1, // 默认9  
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {  
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        that.setData({  
          imgSrc: res.tempFilePaths[0],
          fileName: res.tempFilePaths[0].split('/').pop()  
        })  
      }  
    })  
  },
  
  TakePhoto: function() {  
    const that = this;
    that.setData({  
      button1Pressed: true,  
    })
    setTimeout(() => {  
      this.setData({  
        button1Pressed: false  
      });  
    }, 200);  
    wx.chooseImage({  
      count: 1, // 默认9  
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['camera'], // 从相机拍照  
      success(res) {  
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        const tempFilePaths = res.tempFilePaths;
        const filename = tempFilePaths[0].split('/').pop();  
        that.setData({  
          imgSrc: tempFilePaths[0], // 更新图片路径到页面数据  
          fileName: filename
        });  
      }  
    });  
  }, 

  StartRecognition: function() { 
    const that = this; 
    const imgSrc = this.data.imgSrc;
    const tempFilePath = this.data.imgSrc;
    that.setData({  
      button3Pressed: true,  
    })
    setTimeout(() => {  
      this.setData({  
        button3Pressed: false  
      });  
    }, 200);  
    if (imgSrc) {
      wx.getFileSystemManager().readFile({  
        filePath: tempFilePath, // 第一个文件路径  
        encoding: 'base64', // 编码格式  
        success: function(res) {  
          that.setData({  
            FileContent: res.data
          }),
          that.uploadImageToCloud(); 
        },
        fail: err => {  
          console.error('读取文件失败:', err);  
        } 
      });
    } else {  
      wx.showToast({  
        title: '请先选择一张图片',  
        icon: 'none',  
        duration: 2000 //默认1500ms  
      });  
    }  
  },

  uploadImageToCloud: function() {
    const that = this;
    const filepath = this.data.imgSrc;
    const filename = this.data.fileName;
    const cloudpath = "user_images/" + filename + ".jpg";
    wx.cloud.uploadFile({  
      cloudPath: cloudpath,  
      filePath: filepath,  
      success: res => {  
        console.log('图片上传成功', res);
        that.setData({
          imgID: res.fileID,
        })
        // 在这里处理上传成功后的逻辑，如获取文件ID等
        // 显示“等待中”  
        that.setData({  
          isWaiting: true  
          });
          wx.showToast({  
            title: '等待中...',  
            icon: 'none',  
            duration: 2500 //默认1500ms
          });    
          that.Recognition(); 
      },  
      fail: err => {  
        console.error('图片上传失败', err);  
        // 在这里处理上传失败后的逻辑  
      }  
    });
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
  Recognition: function() {
    const that = this;
    const fileID = this.data.imgID;
    Promise.all([  
      that.getFileUrl(fileID),   
    ])  
    .then(([imgUrl]) => {  
      // 两个图片都成功获取临时 URL，更新数据  
      console.log('图片获取URL成功', imgUrl);
      that.setData({  
        testimg: imgUrl,  
      });
      wx.cloud.callFunction({  
        name: "ImageRecognize",  
        data: {
          fileID: imgUrl,
        },  
        success(res) {
           console.log(res.result);
           that.setData({
             imgResult: res.result.results[0].name,
             isWaiting: false
           })
           that.RecordImg();
        }
      })  
    })  
    .catch(error => {  
      // 如果有任何一个请求失败，catch 会被触发  
      console.error('获取图片临时 URL 失败', error);  
      // 可以在这里进行错误处理，比如显示错误提示等  
    }); 
  },

  RecordImg: function(){
    const fileID = this.data.imgID;
    const openid = this.data.userInfo.openid;
    const imgResult = this.data.imgResult;
    const that = this;
    wx.cloud.callFunction({  
      name: 'RecordImg',  
      data: {  
        fileID: fileID,  
        openid: openid,
        imgResult: imgResult  
      },  
      success: res => {  
        console.log('云函数调用成功', res.result)  
        // 这里可以根据需要处理成功后的逻辑，如提示用户等
        that.showRecognitionResult();  
      },  
      fail: err => {  
        console.error('云函数调用失败', err)  
        // 这里处理调用失败的情况，如显示错误信息等  
      }  
    })
  },
  navigateToHistory: function(){
    wx.navigateTo({  
      url: '/pages/index/userHistory/userHistory'
    });  
  },
  navigateToUserset: function(){
    wx.navigateTo({  
      url: '/pages/index/UserSet/UserSet'
    });  
  },
  onLoad: function() {
    // 获取应用实例  
    const app = getApp();  
    
    // 从全局数据中获取 userInfo  
    const userInfo = app.globalData.userInfo;  
  
    if (userInfo) {  
      // 用户信息存在  
      console.log('用户信息：', userInfo);  
      this.setData({ userInfo: userInfo }); // 将用户信息设置到页面数据中  
  
      // 单独获取头像和昵称  
      const avatarUrl = userInfo.avatarUrl;  
      const nickname = userInfo.nickname;  
  
      // 设置到页面数据  
      this.setData({  
        avatarUrl: avatarUrl,  
        nickname: nickname  
      });  
    } else {  
      // 用户信息不存在时的处理逻辑  
      console.log('用户信息不存在');  
      // 可以选择跳转到登录页面或其他处理  
    }
    wx.cloud.callFunction({  
      name: 'getAnimal', // 云函数名称  
      data: {
      },  
      success: res => {
        console.log(res.result);
        this.setData({
          animalList: res.result
        })
      },
      fail: err => {  
        console.error('云函数调用失败', err)  
        // 这里处理调用失败的情况，如显示错误信息等  
      } 
    });
  },
  onShow: function() {  
    // 每次页面显示时检查全局nickname是否更新  
    const app = getApp(); 
    const userInfo = app.globalData.userInfo; 
    if (this.data.nickname !== app.globalData.userInfo.nickname || this.data.avatarUrl !== app.globalData.userInfo.avatarUrl) {  
      this.setData({  
        nickname: userInfo.nickname,
        avatarUrl: userInfo.avatarUrl
      });  
    }  
  },
  showRecognitionResult: function() { 
    const that = this; 
    const animalname = that.data.imgResult;
    wx.showModal({  
      title: '识别结果',  
      content: '识别结果：' + animalname,  
      showCancel: true, // 不显示取消按钮  
      confirmText: '查看介绍',
      cancelText: '确定',  
      success: function (res) {  
        if (res.confirm) {  
          // 用户点击了确认按钮，可以在这里进行其他操作，比如关闭页面或跳转到其他页面  
          console.log('用户点击了查看介绍按钮');
          wx.cloud.callFunction({  
            name: 'getAnimalId', // 云函数名称  
            data: {
              name: animalname
            },  
            success: res => {
              console.log(res.result);
              const aid = res.result[0].id
              wx.navigateTo({  
                url: '/pages/index/animalDetail/animalDetail?id=' + aid  
              });
            },
            fail: err => {  
              console.error('云函数调用失败', err)  
              // 这里处理调用失败的情况，如显示错误信息等  
            } 
          });  
        } else if (res.cancel) {  
          // 用户点击了“确定”按钮，这里可以执行其他操作，比如关闭页面或显示消息等  
          console.log('用户点击了确认按钮');  
        }   
      }  
    });  
  },
  
})

