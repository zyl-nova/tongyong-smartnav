Page({
  data: {
    feedbackTypes: [
      { name: "功能建议", value: "suggestion" },
      { name: "问题反馈", value: "problem" },
      { name: "投诉举报", value: "complaint" },
      { name: "其他", value: "other" }
    ],
    typeIndex: 0,
    content: "",
    images: [],
    contact: ""
  },
  changeType: function(e) {
    this.setData({ typeIndex: e.detail.value });
  },
  inputContent: function(e) {
    this.setData({ content: e.detail.value });
  },
  inputContact: function(e) {
    this.setData({ contact: e.detail.value });
  },
  chooseImage: function() {
    var that = this;
    wx.chooseImage({
      count: 3 - this.data.images.length,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: function(res) {
        var newImages = res.tempFilePaths.map(function(path) {
          return { path: path };
        });
        var allImages = that.data.images.concat(newImages);
        that.setData({ images: allImages });
      }
    });
  },
  deleteImage: function(e) {
    var index = e.currentTarget.dataset.index;
    var images = this.data.images.slice();
    images.splice(index, 1);
    this.setData({ images: images });
  },
  submitFeedback: function() {
    var that = this;
    if (!this.data.content) {
      wx.showToast({ title: "请填写问题描述", icon: "none" });
      return;
    }
    wx.showLoading({ title: "提交中..." });
    setTimeout(function() {
      wx.hideLoading();
      wx.showToast({ title: "提交成功", icon: "success" });
      that.setData({ content: "", images: [], contact: "" });
      setTimeout(function() {
        wx.navigateBack();
      }, 1500);
    }, 2000);
  }
});
