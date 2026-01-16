Page({
  data: {
    routeInfo: {
      isDeviated: !0,
      plannedRoute: "宁波栎社国际机场→机场路高架→环城南路→快件中心国际货站",
      actualRoute: "宁波栎社国际机场→鄞州大道→环城南路",
      deviationDistance: 3.2,
      deviationTime: "2024-03-15 14:30:22",
      centerLongitude: 121.4665,
      centerLatitude: 29.8212,
    },
    markers: [
      {
        id: 1,
        latitude: 29.8268,
        longitude: 121.4619,
        iconPath: "/images/start.png",
        width: 30,
        height: 30,
        title: "宁波栎社国际机场",
      },
      {
        id: 2,
        latitude: 29.8386,
        longitude: 121.5432,
        iconPath: "/images/end.png",
        width: 30,
        height: 30,
        title: "快件中心国际货站",
      },
      {
        id: 3,
        latitude: 29.8321,
        longitude: 121.5023,
        iconPath: "/images/car.png",
        width: 34,
        height: 34,
        title: "当前车辆位置",
      },
    ],
    polyline: [
      {
        points: [
          { latitude: 29.8268, longitude: 121.4619 },
          { latitude: 29.8275, longitude: 121.4702 },
          { latitude: 29.8301, longitude: 121.4805 },
          { latitude: 29.8328, longitude: 121.4908 },
          { latitude: 29.8352, longitude: 121.5001 },
          { latitude: 29.837, longitude: 121.5104 },
          { latitude: 29.8386, longitude: 121.5432 },
        ],
        color: "#07C160",
        width: 6,
        dottedLine: !1,
      },
      {
        points: [
          { latitude: 29.8268, longitude: 121.4619 },
          { latitude: 29.827, longitude: 121.465 },
          { latitude: 29.8285, longitude: 121.475 },
          { latitude: 29.83, longitude: 121.485 },
          { latitude: 29.8321, longitude: 121.5023 },
        ],
        color: "#E64340",
        width: 6,
        dottedLine: !0,
      },
    ],
    violations: [
      {
        id: 1,
        type: "路线偏离",
        isSerious: !0,
        time: "2024-03-15 14:30:22",
        description:
          "车辆在鄞州大道偏离预定路线，转向环城南路方向，偏离距离3.2公里。",
        images: [],
      },
      {
        id: 2,
        type: "超速行驶",
        isSerious: !1,
        time: "2024-03-15 14:15:10",
        description:
          "在机场快速路段检测到超速行驶，最高时速达到95km/h(限速80km/h)。",
        images: [],
      },
      {
        id: 3,
        type: "违规停车",
        isSerious: !1,
        time: "2024-03-15 14:42:35",
        description: "在环城南路辅路非停车区域停车超过5分钟。",
        images: ["/images/violation3.jpg"],
      },
    ],
  },
  onLoad: function (t) {
    t.vehicleId && this.loadVehicleData(t.vehicleId);
  },
  loadVehicleData: function (t) {
    wx.showLoading({ title: "加载中..." }),
      setTimeout(function () {
        wx.hideLoading();
      }, 500);
  },
  previewImage: function (t) {
    var i = t.currentTarget.dataset.urls,
      e = t.currentTarget.dataset.current;
    wx.previewImage({ current: e, urls: i });
  },
});
