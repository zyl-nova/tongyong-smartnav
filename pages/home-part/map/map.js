Page({
  data: {
    longitude: 121.4614,
    latitude: 29.8267,
    scale: 16,
    updateTime: "",
    markers: [],
    polygons: [],
    showZones: true,
    activeZone: "all",
    filteredVehicleCount: 0,
    zones: [
      {
        id: 1,
        name: "危险品仓储区",
        points: [
          { longitude: 121.457, latitude: 29.829 },
          { longitude: 121.4605, latitude: 29.829 },
          { longitude: 121.4605, latitude: 29.826 },
          { longitude: 121.457, latitude: 29.826 }
        ],
        color: "rgba(255, 77, 79, 0.2)",
        borderColor: "#ff4d4f"
      },
      {
        id: 2,
        name: "普通仓储区",
        points: [
          { longitude: 121.461, latitude: 29.829 },
          { longitude: 121.464, latitude: 29.829 },
          { longitude: 121.464, latitude: 29.826 },
          { longitude: 121.461, latitude: 29.826 }
        ],
        color: "rgba(24, 144, 255, 0.2)",
        borderColor: "#1890ff"
      },
      {
        id: 3,
        name: "装卸作业区",
        points: [
          { longitude: 121.458, latitude: 29.825 },
          { longitude: 121.463, latitude: 29.825 },
          { longitude: 121.463, latitude: 29.822 },
          { longitude: 121.458, latitude: 29.822 }
        ],
        color: "rgba(82, 196, 26, 0.2)",
        borderColor: "#52c41a"
      }
    ],
    zoneTypes: [
      { name: "全部区域", value: "all" },
      { name: "危险品区", value: "hazard" },
      { name: "普通仓储", value: "normal" },
      { name: "装卸区", value: "loading" }
    ],
    vehicles: [
      { id: 1, plateNumber: "浙B·HZ002", type: "hazard", longitude: 121.459, latitude: 29.8275, zone: "hazard", status: "正常" },
      { id: 2, plateNumber: "浙B·NC002", type: "normal", longitude: 121.4625, latitude: 29.8275, zone: "normal", status: "正常" },
      { id: 3, plateNumber: "浙B·LD001", type: "loading", longitude: 121.4608, latitude: 29.8235, zone: "loading", status: "作业中" }
    ],
    facilities: [
      { id: 1, name: "监控中心", type: "facility", longitude: 121.4605, latitude: 29.8275, icon: "monitor" }
    ]
  },
  onLoad: function() {
    this.initMap();
    this.setData({ updateTime: this.getCurrentTime() });
  },
  initMap: function() {
    this.mapCtx = wx.createMapContext("map", this);
    this.renderMapElements();
    var allPoints = [];
    for (var i = 0; i < this.data.zones.length; i++) {
      allPoints = allPoints.concat(this.data.zones[i].points);
    }
    this.mapCtx.includePoints({
      points: allPoints,
      padding: [50, 50, 50, 50]
    });
  },
  renderMapElements: function() {
    this.renderZones();
    this.updateVehicleMarkers();
    this.addFacilityMarkers();
  },
  renderZones: function() {
    var that = this;
    var polygons = this.data.zones.map(function(zone) {
      return {
        points: zone.points,
        strokeWidth: 2,
        strokeColor: zone.borderColor,
        fillColor: zone.color,
        zIndex: 1
      };
    });
    var zoneMarkers = this.data.zones.map(function(zone) {
      var lngs = zone.points.map(function(p) { return p.longitude; });
      var lats = zone.points.map(function(p) { return p.latitude; });
      var minLng = Math.min.apply(null, lngs);
      var maxLat = Math.max.apply(null, lats);
      return {
        id: zone.id + 1000,
        longitude: minLng + 0.00009,
        latitude: maxLat - 0.00009,
        iconPath: "/images/transparent.png",
        width: 1,
        height: 1,
        zIndex: 200,
        callout: {
          content: zone.name,
          color: zone.borderColor,
          fontSize: 8,
          borderRadius: 8,
          padding: 8,
          display: "ALWAYS",
          bgColor: "#ffffff",
          borderColor: zone.borderColor,
          borderWidth: 1,
          anchorY: -20
        }
      };
    });
    this.setData({ polygons: polygons, markers: zoneMarkers });
  },
  updateVehicleMarkers: function() {
    var that = this;
    var vehicles = this.data.vehicles;
    var activeZone = this.data.activeZone;
    var filtered = activeZone === "all" ? vehicles : vehicles.filter(function(v) { return v.zone === activeZone; });
    var zoneMarkers = this.data.markers.filter(function(m) { return m.id >= 1000; });
    var vehicleMarkers = filtered.map(function(v) {
      return {
        id: v.id,
        longitude: v.longitude,
        latitude: v.latitude,
        iconPath: that.getVehicleIcon(v),
        width: 20,
        height: 25,
        zIndex: 100,
        callout: {
          content: v.plateNumber + "\n状态: " + v.status,
          color: that.getZoneColor(v.zone),
          fontSize: 12,
          borderRadius: 4,
          padding: 4,
          display: "ALWAYS"
        }
      };
    });
    this.setData({
      markers: zoneMarkers.concat(vehicleMarkers),
      filteredVehicleCount: filtered.length
    });
  },
  addFacilityMarkers: function() {
    var facilityMarkers = this.data.facilities.map(function(f) {
      return {
        id: f.id + 100,
        longitude: f.longitude,
        latitude: f.latitude,
        iconPath: "/images/home/map/" + f.icon + ".png",
        width: 28,
        height: 28,
        zIndex: 50,
        callout: { content: f.name, color: "#666", fontSize: 12, display: "ALWAYS" }
      };
    });
    this.setData({ markers: this.data.markers.concat(facilityMarkers) });
  },
  getVehicleIcon: function(v) {
    var base = "/images/home/map/";
    if (v.type === "hazard") {
      return v.status === "异常" ? base + "hazard-warning.png" : base + "hazard-normal.png";
    }
    return base + "normal-car.png";
  },
  getZoneColor: function(zone) {
    for (var i = 0; i < this.data.zones.length; i++) {
      var z = this.data.zones[i];
      if (z.id === zone || z.name.indexOf(zone) !== -1) {
        return z.borderColor;
      }
    }
    return "#1890ff";
  },
  filterByZone: function(e) {
    var zone = e.currentTarget.dataset.zone;
    var that = this;
    this.setData({ activeZone: zone }, function() {
      that.updateVehicleMarkers();
    });
  },
  toggleZoneDisplay: function() {
    var that = this;
    var show = !this.data.showZones;
    var polygons = show ? this.data.zones.map(function(zone) {
      return {
        points: zone.points,
        strokeWidth: 2,
        strokeColor: zone.borderColor,
        fillColor: zone.color,
        zIndex: 1
      };
    }) : [];
    this.setData({ showZones: show, polygons: polygons });
  },
  centerLocation: function() {
    var that = this;
    wx.getLocation({
      type: "gcj02",
      success: function(res) {
        that.mapCtx.moveToLocation({ longitude: res.longitude, latitude: res.latitude });
      },
      fail: function() {
        that.mapCtx.moveToLocation();
      }
    });
  },
  onMarkerTap: function(e) {
    var id = e.markerId;
    if (id < 100) {
      var vehicle = null;
      for (var i = 0; i < this.data.vehicles.length; i++) {
        if (this.data.vehicles[i].id === id) {
          vehicle = this.data.vehicles[i];
          break;
        }
      }
      if (vehicle) {
        wx.showModal({
          title: "车辆信息",
          content: "车牌: " + vehicle.plateNumber + "\n类型: " + this.getZoneName(vehicle.zone) + "\n状态: " + vehicle.status,
          showCancel: false
        });
      }
    } else if (id < 1000) {
      var facility = null;
      for (var j = 0; j < this.data.facilities.length; j++) {
        if (this.data.facilities[j].id === id - 100) {
          facility = this.data.facilities[j];
          break;
        }
      }
      if (facility) {
        wx.showModal({ title: facility.name, content: "类型: " + facility.type, showCancel: false });
      }
    }
  },
  getCurrentTime: function() {
    var now = new Date();
    var h = now.getHours().toString();
    var m = now.getMinutes().toString();
    if (h.length < 2) h = "0" + h;
    if (m.length < 2) m = "0" + m;
    return h + ":" + m;
  },
  getZoneName: function(zone) {
    for (var i = 0; i < this.data.zoneTypes.length; i++) {
      if (this.data.zoneTypes[i].value === zone) {
        return this.data.zoneTypes[i].name;
      }
    }
    return "未知区域";
  }
});
