Page({
  data: { userInfo: {}, cacheSize: "20MB", version: "1.0.0" },
  onLoad: function () {
    this.loadUserInfo(), this.getCacheSize(), this.getVersion();
  },
  loadUserInfo: function () {
    var t = wx.getStorageSync("userInfo") || {};
    this.setData({ userInfo: t });
  },
  getCacheSize: function () {
    var t = this;
    wx.getStorageInfo({
      success: function (e) {
        var o = (e.currentSize / 1024).toFixed(2);
        t.setData({ cacheSize: "".concat(o, "KB") });
      },
    });
  },
  getVersion: function () {
    this.setData({ version: "1.0.0" });
  },
  navigateTo: function (t) {
    var e = t.currentTarget.dataset.url;
    wx.navigateTo({ url: e });
  },
  clearCache: function () {
    var t = this;
    wx.showModal({
      title: "清除缓存",
      content: "确定要清除所有缓存数据吗？",
      success: function (e) {
        e.confirm &&
          wx.clearStorage({
            success: function () {
              t.setData({ cacheSize: "0KB" }),
                wx.showToast({ title: "清除成功", icon: "success" });
            },
          });
      },
    });
  },
  checkUpdate: function () {
    wx.showLoading({ title: "检查中..." }),
      setTimeout(function () {
        wx.hideLoading(),
          wx.showToast({ title: "已是最新版本", icon: "success" });
      }, 1e3);
  },
  showLogoutDialog: function () {
    var t = this;
    wx.showModal({
      title: "退出登录",
      content: "确定要退出当前账号吗？",
      confirmText: "退出",
      confirmColor: "#F44336",
      success: function (e) {
        e.confirm && t.logout();
      },
    });
  },
  logout: function () {
    wx.removeStorageSync("userInfo"),
      wx.removeStorageSync("token"),
      wx.reLaunch({ url: "/pages/login/login" });
  },
});
