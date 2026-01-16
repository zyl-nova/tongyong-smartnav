Page({
  data: {
    mode: "add",
    formData: { plateNumber: "", type: "", load: "", dangerousType: "" },
    vehicleTypes: ["小型轿车", "SUV", "商务车", "面包车", "其他"],
    dangerousTypes: ["非危险品车辆", "易燃液体", "压缩气体", "腐蚀品", "其他危险品"],
    typeIndex: 0,
    dangerousIndex: 0
  },
  onLoad: function(options) {
    var mode = options.mode || "add";
    this.setData({ mode: mode });
    wx.setNavigationBarTitle({ title: mode === 'edit' ? '编辑车辆' : '绑定新车辆' });
    if (mode === "edit" && options.plateNumber) {
      this.loadVehicleData(options);
    }
  },
  loadVehicleData: function(options) {
    var vehicle = {
      plateNumber: decodeURIComponent(options.plateNumber || ''),
      type: decodeURIComponent(options.type || ''),
      load: decodeURIComponent(options.load || ''),
      dangerousType: decodeURIComponent(options.dangerousType || '')
    };
    var typeIndex = this.data.vehicleTypes.indexOf(vehicle.type);
    var dangerousIndex = this.data.dangerousTypes.indexOf(vehicle.dangerousType);
    this.setData({
      formData: vehicle,
      typeIndex: typeIndex >= 0 ? typeIndex : 0,
      dangerousIndex: dangerousIndex >= 0 ? dangerousIndex : 0
    });
  },
  typeChange: function(e) {
    var index = e.detail.value;
    this.setData({
      typeIndex: index,
      "formData.type": this.data.vehicleTypes[index]
    });
  },
  dangerousChange: function(e) {
    var index = e.detail.value;
    this.setData({
      dangerousIndex: index,
      "formData.dangerousType": index === 0 ? "" : this.data.dangerousTypes[index]
    });
  },
  submitForm: function(e) {
    var formValue = e.detail.value;
    if (!formValue.plateNumber) {
      wx.showToast({ title: "请输入车牌号", icon: "none" });
      return;
    }
    var history = wx.getStorageSync("vehicleHistory") || [];
    var existIndex = -1;
    for (var i = 0; i < history.length; i++) {
      if (history[i].plateNumber === formValue.plateNumber) {
        existIndex = i;
        break;
      }
    }
    var vehicleData = {
      plateNumber: formValue.plateNumber,
      type: formValue.type || this.data.vehicleTypes[this.data.typeIndex],
      load: formValue.load,
      dangerousType: this.data.dangerousIndex === 0 ? "" : this.data.dangerousTypes[this.data.dangerousIndex],
      bindTime: new Date().toLocaleString()
    };
    if (existIndex >= 0) {
      history[existIndex] = vehicleData;
    } else {
      history.push(vehicleData);
    }
    wx.setStorageSync("vehicleHistory", history);
    wx.setStorageSync("currentVehicle", vehicleData);
    var that = this;
    wx.showToast({
      title: this.data.mode === "edit" ? "更新成功" : "绑定成功",
      icon: "success",
      complete: function() {
        setTimeout(function() {
          wx.navigateBack();
        }, 1500);
      }
    });
  }
});
