Page({
  data: {
    tips: [
      "请确保照片清晰可见，无反光",
      "危险品标识需完整展示",
      "行驶证信息需清晰可辨",
      "建议在光线充足环境下拍摄",
      "每张照片大小不超过5MB"
    ],
    images: { front: "", side: "", hazard: "", license: "" },
    uploadProgress: 0,
    canPreview: false,
    canSubmit: false
  },
  onLoad: function() {
    this.loadCachedImages();
  },
  loadCachedImages: function() {
    var images = wx.getStorageSync("vehicleImages") || {};
    this.setData({ images: images });
    this.checkSubmitStatus();
  },
  chooseImage: function(e) {
    var that = this;
    var type = e.currentTarget.dataset.type;
    wx.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: function(res) {
        var path = res.tempFilePaths[0];
        var images = {};
        for (var key in that.data.images) {
          images[key] = that.data.images[key];
        }
        images[type] = path;
        that.setData({ images: images });
        wx.setStorageSync("vehicleImages", images);
        that.checkSubmitStatus();
      },
      fail: function(err) {
        console.error("选择图片失败:", err);
        wx.showToast({ title: "选择图片失败", icon: "none" });
      }
    });
  },
  checkSubmitStatus: function() {
    var images = this.data.images;
    var canSubmit = images.front && images.side && images.hazard && images.license;
    var canPreview = images.front || images.side || images.hazard || images.license;
    this.setData({ canSubmit: canSubmit, canPreview: canPreview });
  },
  previewImages: function() {
    var images = this.data.images;
    var urls = [];
    if (images.front) urls.push(images.front);
    if (images.side) urls.push(images.side);
    if (images.hazard) urls.push(images.hazard);
    if (images.license) urls.push(images.license);
    if (urls.length === 0) {
      wx.showToast({ title: "没有可预览的图片", icon: "none" });
      return;
    }
    wx.previewImage({ current: urls[0], urls: urls });
  },
  submitImages: function() {
    var that = this;
    if (!this.data.canSubmit) {
      wx.showToast({ title: "请上传所有要求的照片", icon: "none" });
      return;
    }
    wx.showLoading({ title: "正在提交...", mask: true });
    var progress = 0;
    var timer = setInterval(function() {
      progress += 10;
      that.setData({ uploadProgress: progress });
      if (progress >= 100) {
        clearInterval(timer);
        setTimeout(function() {
          wx.hideLoading();
          that.setData({ uploadProgress: 0 });
          that.clearImages();
          wx.showToast({ title: "提交成功", icon: "success", duration: 1500 });
        }, 500);
      }
    }, 200);
  },
  clearImages: function() {
    this.setData({
      images: { front: "", side: "", hazard: "", license: "" },
      canPreview: false,
      canSubmit: false
    });
    wx.removeStorageSync("vehicleImages");
  }
});
