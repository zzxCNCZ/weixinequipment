// 引入配置
var config = require('../../config');
var bmap = require('../../libs/bmap-wx.min.js'); 
var wxMarkerData = [];

// pages/upload/upload.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tupian1: false,//图片1
    tupian2: false,//图片2
    tupian3: false,//图片3
    baidulongitude:'',
    baidulatitude:'',
    tempFilePaths:[],
    userInfo: {},
    txt_sheshi: '*请选择设施类型',//预计时长
    txt_guzhang: '*请选择故障类型',
    arraysheshi: ['*请选择设施类型', '信号灯', '大屏',  ],//设施列表
    index_sheshi: 0,

    arraydengguzhang: ['信号灯不亮', '信号灯黄闪', '红绿黄等同时亮', '设备破损', '信号灯亮度不足','行人灯按钮失效','其他'],//故障列表
    arraypingguzhang: [ '屏幕显示不全', '屏幕不亮', '屏幕显示乱码', '其他'],//故障列表
    arrayguzhang: ['*请选择故障类型'],

    index_dengguzhang: 0,
    index_pingguzhang: 0,
    index_guzhang:0,
    txt_xzqh:"",

    sslx:"",

    Height: 0,
    scale: 13,
    latitude: "",
    longitude: "",
    markers: [],
    circles: [],
    controls: [{
      id: 1,
      iconPath: '/images/locateHL.png',
      position: {
        left: 10,
        top: 10,
        width: 30,
        height: 30
      },
      clickable: true
    }],
  
  },
//选择设施
  choosess: function (e) {
    var that = this;
    
    this.xuanzesheshi(e)
  },
  xuanzesheshi: function (e) {
    var that = this
    that.setData({
      index_sheshi: e.detail.value,
      txt_sheshi: that.data.arraysheshi[e.detail.value],
      ssle:'1'
    })
    if (e.detail.value=='0'){
      that.setData({
        txt_guzhang: that.data.arrayguzhang[0]
      })
    } else if (e.detail.value == '1') {
      that.setData({
        txt_guzhang: that.data.arraydengguzhang[0]
      })
    } else if (e.detail.value == '2') {
      that.setData({
        txt_guzhang: that.data.arraypingguzhang[0]
      })
    }
    console.log(that.data.txt_guzhang)
  },
  //选择故障
  showtip:function(e){
    wx.showToast({
      title: '请先选择设施类型！',
      icon: 'success'
    })
  },
  xuanzeguzhang: function (e) {
    var that = this
    console.log(that.data.index_sheshi)
    
    if (that.data.index_sheshi == '0') {
      wx.showToast({
        title: '请先选择设备类型！',
        icon: 'success'
      })
      that.setData({
        index_guzhang: e.detail.value,
        txt_guzhang: that.data.arrayguzhang[e.detail.value]
      })
    }else if (that.data.index_sheshi == '1') {
    that.setData({
      index_dengguzhang: e.detail.value,
      txt_guzhang: that.data.arraydengguzhang[e.detail.value]
    })
    } else if (that.data.index_sheshi == '2') {
    that.setData({
      index_pingguzhang: e.detail.value,
      txt_guzhang: that.data.arraypingguzhang[e.detail.value]
    }) 
  }
    console.log(that.data.txt_guzhang)
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
   
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        //设置map高度，根据当前设备宽高满屏显示
        _this.setData({
          view: {
            Height: res.windowHeight
          }
        })
      }
    })
    baidudinwei(that);
  
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        _this.setData({
          latitude: res.latitude,
          longitude: res.longitude,   
        })
      },
      complete:function(res){
        dilidingwei(that);
      }
    })
    
    

  },

//扫一扫
  scanning:function(e){
  const that = this;
  wx.scanCode({
    success: (res) => {
      console.log(res)
      that.setData({
        tupian1: true,
        tupian_url1: res.result
      }),
      wx.request({
        url: res.result,
        success: function (res) {
          console.log(res)
        }
      })
    }
  })
},
//定位
  dingwei: function (e) {
    const that = this;
    wx.showToast({
      title: '正在定位',
      icon: 'success'
    })
  dilidingwei(that);
   baidudinwei(that);
  },
//图片选择位置
  controltap(e) {
    var that = this;
    console.log("111111111111")
    that.chooseloc();
  },
//选择位置
  chooseloc() {
    var _this = this;
    wx.chooseLocation({
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        console.log("latitude:" + latitude)
        console.log("longitude:" + longitude)
        _this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          markers: [{
            id: "1",
            latitude: res.latitude,
            longitude: res.longitude,
            width: 50,
            height: 50
          }],
        })
        dilidingwei(_this);
        baidudinwei(_this);
      },
      cancel: function (res) { },
      fail: function (res) { },
      complete: function (res) {
      },
    })
  },

//提交操作
  bindSaveTap: function (e) {
    console.log(e)
    var that=this;
    var user_name = e.detail.value.user_name;
    var sheshi = that.data.txt_sheshi;
    var guzhang = that.data.txt_guzhang;
    var tupian_url1 = that.data.tupian_url1;
    console.log(tupian_url1);
    console.log(sheshi);
    console.log(guzhang);

    
    if (sheshi == '请选择设施类型' || typeof (sheshi) == 'undefined') {
      wx.showToast({
        title: '请选择设施类型',
        icon: 'success'
      })
      return;
    }
    if (guzhang == '请选择故障类型' || typeof (guzhang) == 'undefined') {
      wx.showToast({
        title: '请选择故障类型',
        icon: 'success'
      })
      return;
    }
    if (typeof (that.data.tupian_url1) == 'undefined') {
      wx.showToast({
        title: '请选择照片',
        icon: 'success'
      })
      return;
    }

    var filePaths=new Array();
    console.log(that.data.tupian_url1);
    console.log(that.data.tupian_url2);
    console.log(that.data.tupian_url3);
    if ( typeof (that.data.tupian_url1) !='undefined'){
      filePaths.push(that.data.tupian_url1);
      console.log(filePaths);
    } 
    if ( typeof (that.data.tupian_url2) != 'undefined'){
      filePaths.push(that.data.tupian_url2);
      console.log(filePaths);
    } 
    if ( typeof (that.data.tupian_url3) != 'undefined'){
      filePaths.push(that.data.tupian_url3);
      console.log(filePaths);
    }
    console.log(filePaths.length);
    var successUp = 0; //成功个数
    var failUp = 0; //失败个数
    var length = filePaths.length; //总共个数
    var i = 0; //第几个
   
    wx.showLoading({
      title: '上传中',
    })
    var formData = {
     
      latitude: that.data.baidulatitude,
      longitude: that.data.baidulongitude,
      location: that.data.txt_weizhi,
      sheshi: that.data.txt_sheshi,
      guzhang: that.data.txt_guzhang,
      xzqh:that.data.txt_xzqh,
      bz: e.detail.value.txt_beizhu,
      phonenumber:e.detail.value.txt_shoujihao
    }
    console.log(formData)
    this.uploadDIY(filePaths, successUp, failUp, i, length, formData);  
  }, 
//上传图片
  uploadDIY(filePaths, successUp, failUp, i, length, formData) {
    let _this = this;
    wx.uploadFile({
      url:config.service.uploadUrl,
      // url: 'http://localhost/up/upload/write',
      filePath: filePaths[i],
      name: 'image',
      header: {
        'content-type': 'multipart/form-data'
      }, // 设置请求的 header
      formData: formData, // HTTP 请求中其他额外的 form data
      success: function (res) {
        console.log(res);
        successUp++;
        if (res.statusCode == 200 && !res.data.result_code) {
          typeof success == "function" && success(res.data);
        } else {
          typeof fail == "function" && fail(res);
        }
      },
      fail: function (res) {
        console.log(res);
        failUp++;
        typeof fail == "function" && fail(res);
      },
      complete: function (res) {
        i++;
        if (i == length) {
          wx.showToast({
            title: '总共' + successUp + '张上传至北京交警后台!' ,
            icon: 'success'
          })
        }
        else {  //递归调用uploadDIY函数
          _this.uploadDIY(filePaths, successUp, failUp, i, length,formData);
        }
      }
    })
  } ,

  //选择图片
  chooseImageTap: function (e) {
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            _this.chooseWxImage('album',e)
          } else if (res.tapIndex == 1) {
            _this.chooseWxImage('camera',e)
          }
        }
      }
    })
  },

  chooseWxImage: function (type,e) {
    let _this = this;
    const that = this
    var index = e.currentTarget.dataset.index;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res);
        //设置图片
        if (index == '1') {
          that.setData({
            tupian1: true,
            tupian_url1: res.tempFilePaths[0]
          })
        }
        if (index == '2') {
          that.setData({
            tupian2: true,
            tupian_url2: res.tempFilePaths[0]
          })
        }
        if (index == '3') {
          that.setData({
            tupian3: true,
            tupian_url3: res.tempFilePaths[0]
          })
        }
        _this.setData({
          logo: res.tempFilePaths[0],
        })
      }
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})    
//百度定位
function baidudinwei(that){
  
  var BMap = new bmap.BMapWX({
    ak: '45nP1p61iW7TVCUXAs2HH4CHRWSKSxYF'
  }); 
  var fail = function (data) {
    console.log(data)
  };
  var success = function (data) {
    wxMarkerData = data.wxMarkerData;
    console.log(data)
    that.setData({
      markers: wxMarkerData,
      //latitude: wxMarkerData[0].latitude,
      //longitude: wxMarkerData[0].longitude,
      //txt_weizhi: wxMarkerData[0].address,
      baidulongitude: data.originalData.result.location.lng,
      baidulatitude: data.originalData.result.location.lat
    });
  }
  // 发起regeocoding检索请求
  console.log(that.data.latitude)
  if (that.data.latitude == '') {
    BMap.regeocoding({
      fail: fail,
      success: success,
      iconPath: '../../images/marker_red.png',
      iconTapPath: '../../images/marker_red.png'
    }); 
  }else{
    BMap.regeocoding({
      location: that.data.latitude + ',' + that.data.longitude,
      fail: fail,
      success: success,
      iconPath: '../../images/marker_red.png',
      iconTapPath: '../../images/marker_red.png'
    }); 
  }
  
}

//地理定位
function dilidingwei(that) {

  wx.showToast({
    title: '正在定位',
    icon: 'success'
  })
 
  //获得地址位置
  wx.getLocation({
    
    success: function (res) {
      var latitude = that.data.latitude
      var longitude = that.data.longitude
      console.log('https://apis.map.qq.com/ws/geocoder/v1/?location=' + latitude + ',' + longitude + '&key=635BZ-QRSKF-6O2JD-J3SFC-OB24T-UHBD6');
      wx.request({
        url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + latitude + ',' + longitude + '&key=635BZ-QRSKF-6O2JD-J3SFC-OB24T-UHBD6', //仅为示例，并非真实的接口地址
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          //var str = JSON.stringify(res.data);
          // console.log('str:' + str)
          wx.hideToast();
          var info = res.data;
          if (info.status != 0) {
            wx.showToast({
              title: info.message,
              icon: 'success'
            })
            return;
          }
          that.setData({
            province: info.result.address_component.province
          })
          that.setData({
            city: info.result.address_component.city
          })
          that.setData({
            district: info.result.address_component.district
          })

          that.setData({
            txt_weizhi: info.result.address_component.province + '-' + info.result.address_component.city + '-' + info.result.formatted_addresses.rough,
            txt_xzqh: info.result.ad_info.adcode
          })
        },
        fail: function (res) {
          wx.navigateTo({
            //url: '../error/error?error=' + res.data
          })
        }
      })
    },
    fail: function (res) {
      that.setData({
        txt_weizhi: '重新定位'
      });
    }
  })
}
