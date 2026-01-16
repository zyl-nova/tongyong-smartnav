Page({
  data: {
    currentTab: 0,
    appointments: [
      {
        id: 1,
        vehiclePlate: "沪A·12345",
        status: 1,
        startPoint: "上海化工园区",
        endPoint: "江苏物流园",
        transportTime: "2023-06-15 08:00 - 12:00",
        dangerousGoods: "3类易燃液体",
        createTime: "2023-06-10 14:30",
      },
    ],
  },
  computed: {
    filteredAppointments: function () {
      var t = this;
      return 0 === this.data.currentTab
        ? this.data.appointments
        : this.data.appointments.filter(function (e) {
            return e.status === t.data.currentTab;
          });
    },
  },
  onLoad: function () {
    this.loadAppointments();
  },
  loadAppointments: function () {
    var t = this;
    wx.request({
      url: "https://your-api-domain.com/appointments",
      method: "GET",
      success: function (e) {
        e.data.success && t.setData({ appointments: e.data.list });
      },
    });
  },
  switchTab: function (t) {
    this.setData({ currentTab: parseInt(t.currentTarget.dataset.tab) });
  },
  createNewAppointment: function () {
    wx.navigateTo({ url: "/pages/appointment/create" });
  },
  viewAppointmentDetail: function (t) {
    var e = t.currentTarget.dataset.id;
    wx.navigateTo({ url: "/pages/appointment/detail?id=".concat(e) });
  },
  getStatusText: function (t) {
    return ["", "待审核", "已通过", "已拒绝", "已完成"][t] || "";
  },
  getStatusClass: function (t) {
    return ["", "pending", "approved", "rejected", "completed"][t] || "";
  },
});
