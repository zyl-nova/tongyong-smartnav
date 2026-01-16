Page({
  data: {
    locationEnabled: true,
    personalizedEnabled: false
  },
  onLoad: function() {
    this.loadSettings();
  },
  loadSettings: function() {
    var settings = wx.getStorageSync('privacySettings') || {};
    this.setData({
      locationEnabled: settings.locationEnabled !== false,
      personalizedEnabled: settings.personalizedEnabled === true
    });
  },
  saveSettings: function() {
    wx.setStorageSync('privacySettings', {
      locationEnabled: this.data.locationEnabled,
      personalizedEnabled: this.data.personalizedEnabled
    });
  },
  onLocationChange: function(e) {
    this.setData({ locationEnabled: e.detail.value });
    this.saveSettings();
  },
  onPersonalizedChange: function(e) {
    this.setData({ personalizedEnabled: e.detail.value });
    this.saveSettings();
  },
  viewPrivacyPolicy: function() {
    wx.showModal({
      title: '隐私政策',
      content: '我们非常重视您的隐私保护，详细的隐私政策请查看官方网站。',
      showCancel: false
    });
  },
  viewUserAgreement: function() {
    wx.showModal({
      title: '用户协议',
      content: '感谢您使用我们的服务，详细的用户协议请查看官方网站。',
      showCancel: false
    });
  },
  requestDataExport: function() {
    wx.showModal({
      title: '数据导出',
      content: '您的数据导出请求已提交，我们将在3个工作日内通过邮件发送给您。',
      showCancel: false
    });
  },
  deleteAccount: function() {
    wx.showModal({
      title: '注销账号',
      content: '注销后，您的所有数据将被永久删除且无法恢复，确定要继续吗？',
      confirmText: '确定注销',
      confirmColor: '#ff4d4f',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({ title: '处理中...' });
          setTimeout(function() {
            wx.hideLoading();
            wx.removeStorageSync('userInfo');
            wx.removeStorageSync('token');
            wx.showToast({ title: '账号已注销', icon: 'success' });
            setTimeout(function() {
              wx.reLaunch({ url: '/pages/home/home' });
            }, 1500);
          }, 1500);
        }
      }
    });
  }
});
