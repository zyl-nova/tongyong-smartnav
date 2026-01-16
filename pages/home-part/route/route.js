Page({
  data: {
    searchValue: "",
    activeTab: 0,
    currentRouteId: "",
    frequentRoutes: [
      { name: "东门→3号仓", desc: "化学品专用路线", id: "001", type: "chemical" },
      { name: "北门→5号仓", desc: "燃气专用路线", id: "002", type: "gas" },
      { name: "东门→7号仓", desc: "常规危险品", id: "003", type: "chemical" },
      { name: "西门→9号仓", desc: "特殊危险品", id: "004", type: "special" }
    ],
    filteredRoutes: [],
    fromReservation: false,
    reservationRoute: null
  },
  onLoad: function(options) {
    if (options.start && options.end) {
      var reservationRoute = {
        startPoint: decodeURIComponent(options.start),
        endPoint: decodeURIComponent(options.end),
        plannedRoute: decodeURIComponent(options.route || ''),
        licensePlate: decodeURIComponent(options.plate || '')
      };
      this.setData({ 
        fromReservation: true,
        reservationRoute: reservationRoute
      });
      wx.setNavigationBarTitle({ title: '路线详情' });
    } else {
      this.setData({ filteredRoutes: this.data.frequentRoutes });
    }
  },
  onSearch: function(e) {
    var value = e.detail.trim();
    this.setData({ searchValue: value });
    this.filterRoutes();
  },
  onClearSearch: function() {
    this.setData({ searchValue: "" });
    this.filterRoutes();
  },
  onTabChange: function(e) {
    var index = parseInt(e.currentTarget.dataset.index);
    this.setData({ activeTab: index });
    this.filterRoutes();
  },
  filterRoutes: function() {
    var searchValue = this.data.searchValue;
    var activeTab = this.data.activeTab;
    var routes = this.data.frequentRoutes.slice();
    if (searchValue) {
      routes = routes.filter(function(item) {
        return item.name.indexOf(searchValue) !== -1 || item.desc.indexOf(searchValue) !== -1;
      });
    }
    if (activeTab === 1) {
      routes = routes.filter(function(item) { return item.type === "chemical"; });
    } else if (activeTab === 2) {
      routes = routes.filter(function(item) { return item.type === "gas"; });
    } else if (activeTab === 3) {
      routes = routes.filter(function(item) { return item.type === "special"; });
    }
    this.setData({ filteredRoutes: routes });
  },
  onRouteSelect: function(e) {
    var id = e.currentTarget.dataset.id;
    this.setData({ currentRouteId: id });
  },
  onNavigate: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.showToast({ title: "开始导航 " + id + " 路线", icon: "none" });
  },
  onConfirmRoute: function() {
    var that = this;
    if (!this.data.currentRouteId) return;
    var route = null;
    for (var i = 0; i < this.data.frequentRoutes.length; i++) {
      if (this.data.frequentRoutes[i].id === this.data.currentRouteId) {
        route = this.data.frequentRoutes[i];
        break;
      }
    }
    if (route) {
      wx.showModal({
        title: "确认选择路线",
        content: "您确定选择 " + route.name + " 吗？",
        success: function(res) {
          if (res.confirm) {
            var pages = getCurrentPages();
            pages[pages.length - 2].setData({ selectedRoute: route });
            wx.navigateBack();
          }
        }
      });
    }
  },
  onResetFilter: function() {
    this.setData({
      searchValue: "",
      activeTab: 0,
      filteredRoutes: this.data.frequentRoutes
    });
  },
  startNavigation: function() {
    var route = this.data.reservationRoute;
    if (route) {
      wx.navigateTo({
        url: '/pages/home-part/navigation/navigation?start=' + encodeURIComponent(route.startPoint) + '&end=' + encodeURIComponent(route.endPoint)
      });
    }
  },
  viewOnMap: function() {
    var route = this.data.reservationRoute;
    if (route) {
      wx.navigateTo({
        url: '/pages/home-part/map/map?start=' + encodeURIComponent(route.startPoint) + '&end=' + encodeURIComponent(route.endPoint)
      });
    }
  }
});
