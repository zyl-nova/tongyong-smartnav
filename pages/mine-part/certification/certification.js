Page({
  data: { 
    realName: "", 
    idNumber: "", 
    licenseImage: "", 
    permitImage: "",
    canSubmit: false
  },
  onInputName: function(e) {
    this.setData({ realName: e.detail.value });
    this.checkCanSubmit();
  },
  onInputIdNumber: function(e) {
    this.setData({ idNumber: e.detail.value });
    this.checkCanSubmit();
  },
  checkCanSubmit: function() {
    var canSubmit = this.data.realName && this.data.idNumber && 
                    this.data.licenseImage && this.data.permitImage;
    this.setData({ canSubmit: canSubmit });
  },
  chooseLicenseImage: function () {
    var e = this;
    wx.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: function (t) {
        e.setData({ licenseImage: t.tempFilePaths[0] });
        e.checkCanSubmit();
      },
    });
  },
  choosePermitImage: function () {
    var e = this;
    wx.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: function (t) {
        e.setData({ permitImage: t.tempFilePaths[0] });
        e.checkCanSubmit();
      },
    });
  },
  submitCertification: function () {
    if (!this.data.canSubmit) {
      wx.showToast({ title: "请填写完整信息", icon: "none" });
      return;
    }
    wx.showLoading({ title: "提交中..." });
    setTimeout(function () {
      wx.hideLoading();
      wx.showToast({ title: "提交成功", icon: "success" });
      var e = wx.getStorageSync("userInfo") || {};
      e.certified = true;
      wx.setStorageSync("userInfo", e);
      setTimeout(function () {
        wx.navigateBack();
      }, 1500);
    }, 2000);
  },
});
