Page({
  data: { version: "1.0.0" },
  onLoad: function () {
    this.setData({ version: "1.0.0" });
  },
  callCustomerService: function () {
    wx.makePhoneCall({ phoneNumber: "4001234567" });
  },
  copyWechat: function () {
    wx.setClipboardData({
      data: "危险品运输平台",
      success: function () {
        wx.showToast({ title: "已复制微信公众号", icon: "success" });
      },
    });
  },
  navigateToFeedback: function () {
    wx.navigateTo({ url: "/pages/mine-part/feedback/feedback" });
  },
});
