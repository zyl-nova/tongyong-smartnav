var utils = require("../../utils/utils");

Component({
  properties: {
    title: {
      type: String,
      value: "",
      observer: function(val) {
        this.setData({ title: val });
      }
    },
    titleStyle: {
      type: Object,
      observer: function(val) {
        this.setTitleStyle(val);
      }
    },
    backCount: {
      type: Number,
      observer: function(val) {
        this.backCount = val;
      }
    },
    bgc: {
      type: Object,
      observer: function(val) {
        this.setBgc(val);
      }
    },
    pageState: {
      type: String,
      observer: function(val) {
        this.setData({ pageState: val });
      }
    }
  },
  data: {
    statusBarHeight: 60,
    fontsize: 16,
    backgroundColor: "#fff",
    title: "",
    totalTopHeight: 80,
    isIOS: false
  },
  lifetimes: {
    attached: function() {
      var sysInfo = wx.getSystemInfoSync();
      this.setData({ isIOS: sysInfo.platform === "ios" });
      this.calcHeader();
    }
  },
  methods: {
    calcHeader: function() {
      var sysInfo = wx.getSystemInfoSync();
      var statusBarHeight = sysInfo.statusBarHeight || 20;
      var titleBarHeight = 44;
      var totalTopHeight = statusBarHeight + titleBarHeight;
      
      if (utils.compareVersion(sysInfo.SDKVersion, "2.15.0") >= 0) {
        var menuButton = wx.getMenuButtonBoundingClientRect();
        if (menuButton) {
          titleBarHeight = menuButton.height + 8;
          totalTopHeight = menuButton.bottom + 8;
        }
      }
      
      this.triggerEvent("totalBarHeight", totalTopHeight);
      this.setData({
        statusBarHeight: statusBarHeight,
        titleBarHeight: titleBarHeight,
        totalTopHeight: totalTopHeight
      });
      this.setTitleStyle();
      this.setBgc();
    },
    setTitleStyle: function(style) {
      var options = { frontColor: "#000000", backgroundColor: "#ffffff" };
      if (style) {
        for (var key in style) {
          options[key] = style[key];
        }
      }
      wx.setNavigationBarColor(options);
    },
    setBgc: function(bgc) {
      var options = { backgroundColorTop: "#ffffff", backgroundColorBottom: "#ffffff" };
      if (bgc) {
        for (var key in bgc) {
          options[key] = bgc[key];
        }
      }
      wx.setBackgroundColor(options);
    },
    navigatorBack: function() {
      wx.navigateBack({ delta: this.backCount || 1 });
    }
  }
});
