Page({
  data: {
    vehicle: {},
    currentLocation: "",
    emergencyContacts: [
      { name: "园区应急中心", phone: "12350" },
      { name: "消防报警", phone: "119" },
      { name: "交警报警", phone: "122" },
    ],
  },
  onLoad: function () {
    this.loadVehicleInfo(), this.getCurrentLocation();
  },
  loadVehicleInfo: function () {
    var t = wx.getStorageSync("vehicleInfo") || {};
    this.setData({ vehicle: t });
  },
  getCurrentLocation: function () {
    var t = this;
    wx.getLocation({
      type: "gcj02",
      success: function (e) {
        t.setData({
          currentLocation: "经度: "
            .concat(e.longitude.toFixed(6), ", 纬度: ")
            .concat(e.latitude.toFixed(6)),
        }),
          t.reportLocation(e.longitude, e.latitude);
      },
    });
  },
  reportLocation: function (t, e) {
    wx.request({
      url: "https://your-api-domain.com/report-location",
      method: "POST",
      data: {
        plateNumber: this.data.vehicle.plateNumber,
        longitude: t,
        latitude: e,
      },
    });
  },
  triggerEmergency: function (t) {
    var e = this,
      n = t.currentTarget.dataset.type;
    wx.showModal({
      title: "紧急求助确认",
      content: "您正在报告".concat(
        {
          leak: "泄漏事故",
          fire: "火灾事故",
          crash: "碰撞事故",
          other: "其他事故",
        }[n],
        "，确认发送求助信号吗？"
      ),
      confirmText: "立即求助",
      confirmColor: "#F44336",
      success: function (t) {
        t.confirm && e.sendEmergencySignal(n);
      },
    });
  },
  sendEmergencySignal: function (t) {
    var e = this;
    wx.showLoading({ title: "发送求助中..." }),
      wx.getLocation({
        type: "gcj02",
        success: function (n) {
          wx.request({
            url: "https://your-api-domain.com/emergency",
            method: "POST",
            data: {
              type: t,
              plateNumber: e.data.vehicle.plateNumber,
              longitude: n.longitude,
              latitude: n.latitude,
              dangerousType: e.data.vehicle.dangerousType,
            },
            success: function () {
              wx.hideLoading(),
                wx.showToast({ title: "求助已发送", icon: "success" }),
                e.notifyInspectors();
            },
          });
        },
      });
  },
  notifyInspectors: function () {
    console.log("通知所有巡视人员事故位置");
  },
  callContact: function (t) {
    var e = t.currentTarget.dataset.index,
      n = this.data.emergencyContacts[e];
    wx.makePhoneCall({ phoneNumber: n.phone });
  },
  callPolice: function () {
    wx.makePhoneCall({ phoneNumber: "110" });
  },
});
