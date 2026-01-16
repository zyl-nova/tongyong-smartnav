App({
  onLaunch: function () {
    var n = wx.getStorageSync("logs") || [];
    n.unshift(Date.now());
    wx.setStorageSync("logs", n);
    wx.login({ success: function (n) {} });
  },
  globalData: { 
    userInfo: null,
    readMessages: []
  },
});
