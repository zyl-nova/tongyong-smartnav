Page({
  data: { vehicle: null, history: [] },
  onLoad: function () {
    this.loadVehicleData();
  },
  loadVehicleData: function () {
    var e = {
      vehicle: {
        plateNumber: "沪A12345",
        type: "小型货车",
        load: "载重2吨",
        dangerousType: "危险品运输",
      },
      history: [
        {
          plateNumber: "浙B67890",
          type: "中型货车",
          bindTime: "2023-05-15 至 2023-08-20",
        },
        {
          plateNumber: "浙C24680",
          type: "大型货车",
          bindTime: "2022-10-10 至 2023-05-10",
        },
      ],
    };
    this.setData({ vehicle: e.vehicle, history: e.history });
  },
  editVehicle: function () {
    var vehicle = this.data.vehicle;
    wx.navigateTo({
      url: '/pages/mine-part/vehicle/bind/bind?mode=edit&plateNumber=' + encodeURIComponent(vehicle.plateNumber) + '&type=' + encodeURIComponent(vehicle.type) + '&load=' + encodeURIComponent(vehicle.load) + '&dangerousType=' + encodeURIComponent(vehicle.dangerousType)
    });
  },
  bindNewVehicle: function () {
    wx.navigateTo({
      url: '/pages/mine-part/vehicle/bind/bind?mode=add'
    });
  },
  selectHistory: function (e) {
    var t = this,
      i = e.currentTarget.dataset.index,
      a = this.data.history[i];
    wx.showModal({
      title: "选择历史车辆",
      content: "确定要绑定 ".concat(a.plateNumber, " 吗？"),
      success: function (e) {
        e.confirm &&
          (t.setData({ vehicle: a }),
          wx.showToast({ title: "绑定成功", icon: "success" }));
      },
    });
  },
});
