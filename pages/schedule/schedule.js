var MAP_KEY = "3PQBZ-H4OEV-3W4P5-5LVU7-2S55S-52FDE";

Page({
  data: {
    carTypes: [
      { id: 1, name: "小型货车" },
      { id: 2, name: "中型货车" },
      { id: 3, name: "大型货车" },
      { id: 4, name: "冷藏车" },
      { id: 5, name: "危险品运输车" }
    ],
    carTypeIndex: 0,
    today: "",
    maxDate: "",
    formData: {
      name: "",
      plateNumber: "",
      reservationDate: "",
      reservationTime: "",
      startPoint: "",
      endPoint: "",
      remark: ""
    },
    startResults: [],
    endResults: [],
    longitude: null,
    latitude: null,
    mapScale: 14,
    markers: [],
    polyline: [],
    includePoints: [],
    routeCalculated: false,
    routeDistance: "",
    routeDuration: "",
    mapReady: false,
    locationError: false,
    isCalculating: false,
    currentLocation: null
  },
  onLoad: function() {
    this.initDatePicker();
    this.initLocation();
  },
  initDatePicker: function() {
    var today = new Date();
    var maxDate = new Date();
    maxDate.setMonth(today.getMonth() + 3);
    this.setData({
      today: this.formatDate(today),
      maxDate: this.formatDate(maxDate)
    });
  },
  formatDate: function(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day);
  },
  initLocation: function() {
    var that = this;
    this.checkLocationPermission().then(function() {
      that.getUserLocation();
    }).catch(function() {
      that.setData({ mapReady: true, locationError: true });
    });
  },
  checkLocationPermission: function() {
    return new Promise(function(resolve, reject) {
      wx.getSetting({
        success: function(res) {
          if (res.authSetting["scope.userLocation"]) {
            resolve();
          } else {
            wx.authorize({
              scope: "scope.userLocation",
              success: resolve,
              fail: reject
            });
          }
        },
        fail: reject
      });
    });
  },
  getUserLocation: function() {
    var that = this;
    wx.showLoading({ title: "获取位置中...", mask: true });
    wx.getLocation({
      type: "gcj02",
      success: function(res) {
        wx.hideLoading();
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          currentLocation: res,
          markers: [{
            id: 0,
            latitude: res.latitude,
            longitude: res.longitude,
            iconPath: "/images/hu/location.png",
            width: 30,
            height: 30,
            callout: {
              content: "我的位置",
              color: "#1AAD19",
              fontSize: 14,
              borderRadius: 10,
              padding: 5,
              display: "ALWAYS"
            }
          }],
          mapReady: true,
          locationError: false
        });
      },
      fail: function(err) {
        wx.hideLoading();
        console.error("获取位置失败:", err);
        that.setData({ mapReady: true, locationError: true });
        wx.showToast({ title: "获取位置失败", icon: "none" });
      }
    });
  },
  bindCarTypeChange: function(e) {
    this.setData({ carTypeIndex: e.detail.value });
  },
  bindDateChange: function(e) {
    this.setData({ "formData.reservationDate": e.detail.value });
  },
  bindTimeChange: function(e) {
    this.setData({ "formData.reservationTime": e.detail.value });
  },
  searchStartPoint: function(e) {
    var that = this;
    var keyword = e.detail.value.trim();
    if (!keyword) {
      this.setData({ startResults: [] });
      return;
    }
    this.setData({ "formData.startPoint": keyword, startResults: [] });
    wx.request({
      url: "https://apis.map.qq.com/ws/place/v1/suggestion",
      method: "GET",
      data: { keyword: keyword, key: MAP_KEY, region: "全国", output: "json" },
      success: function(res) {
        if (res.data && res.data.data) {
          var results = res.data.data.map(function(item) {
            return {
              id: item.id,
              title: item.title,
              address: item.address,
              location: item.location
            };
          });
          that.setData({ startResults: results });
        }
      },
      fail: function(err) {
        console.error("起点搜索失败:", err);
        that.setData({ startResults: [] });
      }
    });
  },
  selectStartPoint: function(e) {
    var item = e.currentTarget.dataset.item;
    this.setData({
      "formData.startPoint": item.title,
      startResults: [],
      longitude: item.location.lng,
      latitude: item.location.lat
    });
    this.checkRouteConditions();
  },
  searchEndPoint: function(e) {
    var that = this;
    var keyword = e.detail.value.trim();
    if (!keyword) {
      this.setData({ endResults: [] });
      return;
    }
    this.setData({ "formData.endPoint": keyword, endResults: [] });
    wx.request({
      url: "https://apis.map.qq.com/ws/place/v1/suggestion",
      method: "GET",
      data: { keyword: keyword, key: MAP_KEY, region: "全国", output: "json" },
      success: function(res) {
        if (res.data && res.data.data) {
          var results = res.data.data.map(function(item) {
            return {
              id: item.id,
              title: item.title,
              address: item.address,
              location: item.location
            };
          });
          that.setData({ endResults: results });
        }
      },
      fail: function(err) {
        console.error("终点搜索失败:", err);
        that.setData({ endResults: [] });
      }
    });
  },
  selectEndPoint: function(e) {
    var item = e.currentTarget.dataset.item;
    this.setData({ "formData.endPoint": item.title, endResults: [] });
    this.checkRouteConditions();
  },
  checkRouteConditions: function() {
    if (this.data.formData.startPoint && this.data.formData.endPoint && !this.data.isCalculating) {
      this.calculateRoute();
    }
  },
  calculateRoute: function() {
    var that = this;
    if (!this.data.formData.startPoint || !this.data.formData.endPoint) {
      return;
    }
    this.setData({ isCalculating: true });
    wx.showLoading({ title: "路线计算中...", mask: true });
    wx.request({
      url: "https://apis.map.qq.com/ws/direction/v1/driving",
      method: "GET",
      data: {
        from: this.data.formData.startPoint,
        to: this.data.formData.endPoint,
        key: MAP_KEY,
        output: "json"
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data && res.data.result && res.data.result.routes) {
          var route = res.data.result.routes[0];
          var points = route.polyline.split(";").map(function(point) {
            var coords = point.split(",");
            return {
              longitude: parseFloat(coords[0]),
              latitude: parseFloat(coords[1])
            };
          });
          that.setData({
            markers: [
              {
                id: 1,
                longitude: points[0].longitude,
                latitude: points[0].latitude,
                iconPath: "/images/hu/start.png",
                width: 34,
                height: 34
              },
              {
                id: 2,
                longitude: points[points.length - 1].longitude,
                latitude: points[points.length - 1].latitude,
                iconPath: "/images/hu/end.png",
                width: 34,
                height: 34
              }
            ],
            polyline: [{ points: points, color: "#1AAD19", width: 6 }],
            includePoints: points,
            longitude: points[0].longitude,
            latitude: points[0].latitude,
            routeCalculated: true,
            routeDistance: (route.distance / 1000).toFixed(1) + "公里",
            routeDuration: that.formatDuration(route.duration),
            isCalculating: false
          });
        } else {
          wx.showToast({ title: "未找到合适路线", icon: "none" });
          that.setData({ isCalculating: false, routeCalculated: false });
        }
      },
      fail: function(err) {
        wx.hideLoading();
        console.error("路线计算失败:", err);
        that.setData({ isCalculating: false, routeCalculated: false });
        wx.showToast({ title: "路线计算失败，请检查地址", icon: "none" });
      }
    });
  },
  formatDuration: function(seconds) {
    var hours = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return hours + "小时" + minutes + "分钟";
    }
    return minutes + "分钟";
  },
  submitForm: function(e) {
    var formValue = e.detail.value;
    var formData = {
      name: formValue.name || this.data.formData.name,
      plateNumber: formValue.plateNumber || this.data.formData.plateNumber,
      reservationDate: this.data.formData.reservationDate,
      reservationTime: this.data.formData.reservationTime,
      startPoint: this.data.formData.startPoint,
      endPoint: this.data.formData.endPoint,
      remark: formValue.remark || this.data.formData.remark
    };
    if (!this.validateForm(formData)) {
      return;
    }
    wx.showLoading({ title: "提交中...", mask: true });
    var reservation = {
      id: Date.now(),
      reservationNumber: "RES" + Date.now(),
      name: formData.name,
      carType: this.data.carTypes[this.data.carTypeIndex].name,
      vehicleType: this.data.carTypes[this.data.carTypeIndex].name,
      licensePlate: formData.plateNumber,
      date: formData.reservationDate,
      time: formData.reservationTime,
      startPoint: formData.startPoint,
      endPoint: formData.endPoint,
      routePoints: this.data.polyline[0] ? this.data.polyline[0].points : [],
      plannedRoute: this.data.routeDistance ? (this.data.routeDistance + " / " + this.data.routeDuration) : "路线待规划",
      distance: this.data.routeDistance || "待规划",
      duration: this.data.routeDuration || "待规划",
      remark: formData.remark,
      status: "待确认",
      contact: formData.name,
      createTime: new Date().toISOString(),
      routeCalculated: this.data.routeCalculated
    };
    setTimeout(function() {
      wx.hideLoading();
      var reservations = wx.getStorageSync("reservations") || [];
      reservations.unshift(reservation);
      wx.setStorageSync("reservations", reservations);
      wx.showToast({
        title: "预约成功",
        icon: "success",
        duration: 2000,
        complete: function() {
          setTimeout(function() {
            wx.navigateBack();
          }, 2000);
        }
      });
    }, 1500);
  },
  validateForm: function(data) {
    if (!data.name) {
      wx.showToast({ title: "请输入姓名", icon: "none" });
      return false;
    }
    if (!data.plateNumber) {
      wx.showToast({ title: "请输入车牌号", icon: "none" });
      return false;
    }
    if (!data.reservationDate) {
      wx.showToast({ title: "请选择预约日期", icon: "none" });
      return false;
    }
    if (!data.reservationTime) {
      wx.showToast({ title: "请选择预约时间", icon: "none" });
      return false;
    }
    if (!data.startPoint) {
      wx.showToast({ title: "请选择起点", icon: "none" });
      return false;
    }
    if (!data.endPoint) {
      wx.showToast({ title: "请选择终点", icon: "none" });
      return false;
    }
    return true;
  }
});
