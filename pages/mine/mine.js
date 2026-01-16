Page({
  data: {
    userInfo: {
      nickName: "张师傅",
      avatarUrl: "",
      phone: "138****1234",
      certified: true
    },
    vehicleInfo: {
      plateNumber: "沪A·12345",
      type: "危险品运输车",
      load: "10吨"
    },
    unreadCount: 3
  },
  onLoad: function() {
    var userInfo = wx.getStorageSync("userInfo");
    var vehicleInfo = wx.getStorageSync("vehicleInfo");
    if (userInfo) {
      this.setData({ userInfo: userInfo });
    }
    if (vehicleInfo) {
      this.setData({ vehicleInfo: vehicleInfo });
    }
  },
  onShow: function() {},
  navigateToCertify: function() {
    wx.navigateTo({ url: "/pages/mine-part/certification/certification" });
  },
  navigateToVehicleManage: function() {
    wx.navigateTo({ url: "/pages/mine-part/vehicle/vehicle" });
  },
  navigateToMyAppointments: function() {
    wx.navigateTo({ url: "/pages/mine-part/reservation/reservation" });
  },
  navigateToViolations: function() {
    wx.navigateTo({ url: "/pages/mine-part/violation/violation" });
  },
  navigateToVehicleinfo: function() {
    wx.navigateTo({ url: "/pages/mine-part/vehicle-info/vehicle-info" });
  },
  navigateToRouteHistory: function() {
    wx.navigateTo({ url: "/pages/mine-part/history-route/history-route" });
  },
  navigateToSettings: function() {
    wx.navigateTo({ url: "/pages/mine-part/settings/settings" });
  },
  navigateToFeedback: function() {
    wx.navigateTo({ url: "/pages/mine-part/feedback/feedback" });
  },
  navigateToAbout: function() {
    wx.navigateTo({ url: "/pages/mine-part/about/about" });
  },
  showLogoutDialog: function() {
    var that = this;
    wx.showModal({
      title: "退出登录",
      content: "确定要退出当前账号吗？",
      confirmText: "退出",
      confirmColor: "#F44336",
      success: function(res) {
        if (res.confirm) {
          that.logout();
        }
      }
    });
  },
  logout: function() {
    wx.removeStorageSync("userInfo");
    wx.removeStorageSync("token");
    wx.showToast({ title: "已退出登录", icon: "success" });
  }
});
