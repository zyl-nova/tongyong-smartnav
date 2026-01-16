Page({
  data: {
    systemNotify: true,
    orderNotify: true,
    activityNotify: false,
    soundEnabled: true,
    vibrationEnabled: true
  },
  onLoad: function() {
    this.loadSettings();
  },
  loadSettings: function() {
    var settings = wx.getStorageSync('notificationSettings') || {};
    this.setData({
      systemNotify: settings.systemNotify !== false,
      orderNotify: settings.orderNotify !== false,
      activityNotify: settings.activityNotify === true,
      soundEnabled: settings.soundEnabled !== false,
      vibrationEnabled: settings.vibrationEnabled !== false
    });
  },
  saveSettings: function() {
    wx.setStorageSync('notificationSettings', {
      systemNotify: this.data.systemNotify,
      orderNotify: this.data.orderNotify,
      activityNotify: this.data.activityNotify,
      soundEnabled: this.data.soundEnabled,
      vibrationEnabled: this.data.vibrationEnabled
    });
  },
  onSystemNotifyChange: function(e) {
    this.setData({ systemNotify: e.detail.value });
    this.saveSettings();
  },
  onOrderNotifyChange: function(e) {
    this.setData({ orderNotify: e.detail.value });
    this.saveSettings();
  },
  onActivityNotifyChange: function(e) {
    this.setData({ activityNotify: e.detail.value });
    this.saveSettings();
  },
  onSoundChange: function(e) {
    this.setData({ soundEnabled: e.detail.value });
    this.saveSettings();
  },
  onVibrationChange: function(e) {
    this.setData({ vibrationEnabled: e.detail.value });
    this.saveSettings();
  }
});
