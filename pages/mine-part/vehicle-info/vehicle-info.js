Page({
  data: {
    vehicle: {
      licensePlate: "浙C12345",
      type: "危险品运输车",
      company: "上海危险品运输有限公司",
      brand: "解放",
      model: "JH6 危险品专用",
      load: 18.5,
      color: "红色",
      lastInspection: "2023-03-15",
      nextInspection: "2024-03-14",
      insuranceExpiry: "2024-02-28",
    },
  },
  updateInfo: function () {
    wx.showToast({ title: "请联系管理员更新", icon: "none" });
  },
});
