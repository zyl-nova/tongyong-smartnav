Page({
  data: {
    userInfo: {},
    vehicleInfo: {},
    notice:
      "园区通知：所有危险品车辆入园前必须提前预约路线，并按照预约路线行驶。",
    currentReservation: {
      routeName: "东门入口 → 3号危险品仓库",
      status: "已通过",
      reservationTime: "2023-05-15 09:30",
      entryTime: "",
      licensePlate: "浙B12345",
      routeId: "001",
    },
    quickActions: [
      { icon: "share-o", text: "导航", action: "navigation" },
      { icon: "photo-o", text: "车辆照片", action: "vehiclePhoto" },
      { icon: "location-o", text: "园区地图", action: "map" },
      { icon: "warning-o", text: "紧急求助", action: "emergency" },
    ],
    frequentRoutes: [
      { name: "东门→3号仓", desc: "化学品专用路线", id: "001" },
      { name: "北门→5号仓", desc: "燃气专用路线", id: "002" },
      { name: "东门→7号仓", desc: "常规危险品", id: "003" },
      { name: "西门→9号仓", desc: "特殊危险品", id: "004" },
    ],
  },
  goReserve: function () {
    wx.switchTab({
      url: "/pages/schedule/schedule",
      success: function () {
        console.log("跳转到tabBar页面成功");
      },
      fail: function (e) {
        console.error("跳转失败原因：", e);
      },
    });
  },
  goDetail: function () {
    var e,
      o =
        null === (e = this.data.currentReservation) || void 0 === e
          ? void 0
          : e.routeId;
    o
      ? wx.navigateTo({
          url: "/pages/home-part/reserve-detail/reserve-detail?id=".concat(o),
          success: function () {
            return console.log("跳转成功");
          },
          fail: function (e) {
            console.error("跳转失败详情:", e),
              wx.showToast({
                title: "打开失败: ".concat(e.errMsg),
                icon: "none",
                duration: 3e3,
              });
          },
        })
      : wx.showToast({ title: "无效的路线ID", icon: "none" });
  },
  goNav: function () {
    wx.navigateTo({ url: "/pages/home-part/navigation/navigation" });
  },
  goPhoto: function () {
    wx.navigateTo({ url: "/pages/home-part/photo/photo" });
  },
  goMap: function () {
    wx.navigateTo({ url: "/pages/home-part/map/map" });
  },
  makeCall: function () {
    wx.navigateTo({
      url: "/pages/home-part/emergency/emergency",
      fail: function (e) {
        console.error("跳转失败:", e);
        wx.showToast({ title: "跳转失败", icon: "none" });
      },
    });
  },
  goAllRoute: function () {
    wx.navigateTo({
      url: "/pages/home-part/route/route",
      success: function () {
        return console.log("跳转成功");
      },
      fail: function (e) {
        return console.error("跳转失败:", e);
      },
    });
  },
  selectRoute: function (e) {
    var o = e.currentTarget.dataset.route;
    wx.navigateTo({ url: "/pages/reserve/index?routeId=".concat(o.id) });
  },
});
