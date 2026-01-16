Page({
  data: { detail: null, loading: !0 },
  onLoad: function (e) {
    this.loadDetail(e.id);
  },
  loadDetail: function (e) {
    var t = this;
    setTimeout(function () {
      t.setData({
        loading: !1,
        detail: {
          id: e,
          status: "已通过",
          route: "东门入口 → 3号危险品仓库",
          licensePlate: "沪A12345",
          driverName: "张师傅",
          phone: "13800138000",
          dangerousType: "易燃液体",
          createTime: "2023-05-15 14:25",
          entryTime: "2023-05-20 09:30",
          actualEntryTime: "2023-05-20 09:28",
          reviewRemark: "请按时入园，注意安全",
          remarks: "需要协助装卸",
        },
      });
    }, 800);
  },
  cancelReservation: function () {
    wx.showModal({
      title: "确认取消",
      content: "确定要取消此预约吗？",
      success: function (e) {
        e.confirm &&
          (wx.showLoading({ title: "处理中..." }),
          setTimeout(function () {
            wx.hideLoading(),
              wx.showToast({
                title: "取消成功",
                icon: "success",
                success: function () {
                  setTimeout(function () {
                    wx.navigateBack();
                  }, 1500);
                },
              });
          }, 1e3));
      },
    });
  },
});
