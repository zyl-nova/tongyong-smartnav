Page({
  data: {
    historyList: [],
    isRefreshing: false,
    isLoadingMore: false,
    hasMoreData: true,
    showDeleteDialog: false,
    currentDeleteIndex: -1,
    scrollTop: 0
  },
  onLoad: function() {
    this.initData();
  },
  initData: function() {
    this.loadHistoryData();
  },
  loadHistoryData: function() {
    var that = this;
    if (this.data.isRefreshing || this.data.isLoadingMore) return;
    this.setData({ isRefreshing: true, isLoadingMore: false });
    setTimeout(function() {
      var data = that.getMockData();
      wx.setStorageSync("history_data", data);
      that.setData({
        historyList: data,
        isRefreshing: false,
        hasMoreData: data.length >= 4
      });
      wx.stopPullDownRefresh();
    }, 1200);
  },
  getMockData: function() {
    return [
      {
        id: 1001,
        startPoint: "宁波栎社国际机场货运站",
        endPoint: "宁波江北货运中心",
        date: "2024-05-20",
        time: "09:30-10:45",
        driverName: "张师傅",
        driverAvatar: "/images/hu/default-avatar.png",
        licensePlate: "浙B·12345",
        distance: "28km",
        duration: "1.25小时",
        cargoInfo: "电子产品",
        status: "completed",
        route: "机场路→环城北路",
        contact: "13800138001",
        vehicleType: "普通货车"
      },
      {
        id: 1002,
        startPoint: "宁波栎社国际机场货运站",
        endPoint: "宁波舟山港",
        date: "2024-05-18",
        time: "14:00-16:30",
        driverName: "张师傅",
        driverAvatar: "/images/hu/default-avatar.png",
        licensePlate: "浙B·12345",
        distance: "85km",
        duration: "2.5小时",
        cargoInfo: "进口海鲜",
        status: "completed",
        route: "甬舟高速→跨海大桥",
        contact: "13800138002",
        vehicleType: "冷藏车"
      },
      {
        id: 1003,
        startPoint: "宁波栎社国际机场货运站",
        endPoint: "宁波梅山保税区",
        date: "2024-05-15",
        time: "07:00-08:45",
        driverName: "张师傅",
        driverAvatar: "/images/hu/default-avatar.png",
        licensePlate: "浙B·12345",
        distance: "45km",
        duration: "1.75小时",
        cargoInfo: "保税商品",
        status: "completed",
        route: "机场路→甬台温高速",
        contact: "13800138003",
        vehicleType: "集装箱货车"
      },
      {
        id: 1004,
        startPoint: "宁波栎社国际机场货运站",
        endPoint: "宁波鄞州物流中心",
        date: "2024-05-12",
        time: "13:00-14:30",
        driverName: "张师傅",
        driverAvatar: "/images/hu/default-avatar.png",
        licensePlate: "浙B·12345",
        distance: "35km",
        duration: "1.5小时",
        cargoInfo: "日用百货",
        status: "cancelled",
        route: "机场路→鄞州大道",
        contact: "13800138004",
        vehicleType: "厢式货车"
      }
    ];
  },
  onPullDownRefresh: function() {
    this.setData({ scrollTop: 0 });
    this.loadHistoryData();
  },
  onReachBottom: function() {
    var that = this;
    if (!this.data.hasMoreData) return;
    this.setData({ isLoadingMore: true });
    setTimeout(function() {
      var list = that.data.historyList.slice();
      var moreData = that.getMoreData();
      moreData.forEach(function(item) {
        var exists = list.some(function(existing) {
          return existing.id === item.id;
        });
        if (!exists) {
          list.push(item);
        }
      });
      that.setData({
        historyList: list,
        isLoadingMore: false,
        hasMoreData: list.length < 6
      });
    }, 1500);
  },
  getMoreData: function() {
    return [
      {
        id: 1005,
        startPoint: "宁波栎社国际机场货运站",
        endPoint: "宁波余姚物流园",
        date: "2024-05-08",
        time: "10:30-12:15",
        driverName: "张师傅",
        driverAvatar: "/images/hu/default-avatar.png",
        licensePlate: "浙B·12345",
        distance: "65km",
        duration: "1.75小时",
        cargoInfo: "工业零件",
        status: "completed",
        route: "机场路→杭甬高速",
        contact: "13800138005",
        vehicleType: "平板货车"
      }
    ];
  },
  showDeleteDialog: function(e) {
    this.setData({
      showDeleteDialog: true,
      currentDeleteIndex: e.currentTarget.dataset.index
    });
  },
  hideDeleteDialog: function() {
    this.setData({ showDeleteDialog: false, currentDeleteIndex: -1 });
  },
  confirmDelete: function() {
    var index = this.data.currentDeleteIndex;
    if (index >= 0) {
      var list = this.data.historyList.slice();
      list.splice(index, 1);
      this.setData({
        historyList: list,
        showDeleteDialog: false,
        currentDeleteIndex: -1
      });
      wx.setStorageSync("history_data", list);
      wx.showToast({ title: "删除成功", icon: "success" });
    }
  }
});
