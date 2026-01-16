var SystemInfo = {
  globalData: {
    latitude: 39.916527,
    longitude: 116.397128,
    city: "北京市",
    bottomspace: 0,
    isNoShareLink: false,
    scalefactor: 2,
    windowHeight: 667,
    locationBtnLeftSpace: 8,
    platform: "",
    isIOS: false,
    isIPhoneX: false,
    statusBarHeight: 0,
    titleBarHeight: 0,
    totalTopHeight: 0,
    windowWidth: 0,
    bodyHeight: 0,
    containTitleHeight: 0
  },
  init: function() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.globalData.platform = res.platform;
        var bottomBarHeight = res.screenHeight - res.windowHeight;
        that.globalData.windowHeight = res.windowHeight;
        that.globalData.isIPhoneX = false;
        that.globalData.isIOS = false;
        
        if (res.system.indexOf("iOS") !== -1) {
          that.globalData.isIOS = true;
        }
        
        if (res.model.indexOf("iPhone X") !== -1 || 
            res.model.indexOf("iPhone 11") !== -1 || 
            res.model.indexOf("iPhone11") !== -1 || 
            res.model.indexOf("iPhone 12") !== -1) {
          that.globalData.bottomspace = 30;
          that.globalData.scalefactor = 2;
          that.globalData.windowHeight = res.screenHeight;
          that.globalData.locationBtnLeftSpace = 11;
          that.globalData.isIPhoneX = true;
          bottomBarHeight = 88;
        } else if ((res.model.indexOf("iPhone 6") !== -1 && res.model.indexOf("iPhone 6 Plus") === -1) ||
                   res.model.indexOf("iPhone 6 Plus") !== -1 ||
                   (res.model.indexOf("iPhone 7") !== -1 && res.model.indexOf("iPhone 7 Plus") === -1)) {
          that.globalData.scalefactor = 2;
          that.globalData.windowHeight = res.screenHeight;
          that.globalData.locationBtnLeftSpace = 8;
          bottomBarHeight = 64;
        } else if (res.model.indexOf("iPhone 7 Plus") !== -1) {
          that.globalData.scalefactor = 2;
          that.globalData.windowHeight = res.screenHeight;
          that.globalData.locationBtnLeftSpace = 9;
          bottomBarHeight = 64;
        } else if (res.model.indexOf("iPhone") !== -1) {
          that.globalData.scalefactor = 2;
          that.globalData.windowHeight = res.screenHeight;
          that.globalData.locationBtnLeftSpace = 8;
          bottomBarHeight = 64;
        } else {
          that.globalData.scalefactor = 1;
          that.globalData.windowHeight = res.screenHeight;
          if (res.model.indexOf("samsung") > -1) {
            bottomBarHeight = 72;
          } else {
            bottomBarHeight = 68;
            if (res.statusBarHeight === 34 || res.statusBarHeight === 43) {
              bottomBarHeight = 88;
            }
          }
        }
        
        that.globalData.titleBarHeight = bottomBarHeight - res.statusBarHeight;
        that.globalData.statusBarHeight = res.statusBarHeight;
        that.globalData.totalTopHeight = bottomBarHeight;
        that.globalData.windowWidth = res.windowWidth;
        that.globalData.windowHeight = that.globalData.windowHeight - bottomBarHeight;
        that.globalData.bodyHeight = res.screenHeight - bottomBarHeight;
        that.globalData.containTitleHeight = that.globalData.bodyHeight + that.globalData.titleBarHeight;
      },
      fail: function() {
        that.globalData.statusBarHeight = 0;
        that.globalData.titleBarHeight = 0;
        that.globalData.windowHeight = 0;
        that.globalData.windowWidth = 0;
      }
    });
  }
};

SystemInfo.init();

module.exports = SystemInfo;
module.exports.default = SystemInfo;
