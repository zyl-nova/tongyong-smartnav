Page({
  data: {
    dangerVehicleCount: 12,
    warningCount: 5,
    accidentCount: 2,
    activeTab: "compare",
    center: { longitude: 116.404, latitude: 39.915 },
    markers: [
      { id: 1, longitude: 116.404, latitude: 39.915, iconPath: "/images/danger-marker.png", width: 30, height: 30 },
      { id: 2, longitude: 116.414, latitude: 39.925, iconPath: "/images/danger-marker.png", width: 30, height: 30 }
    ],
    polyline: [
      { points: [{ longitude: 116.404, latitude: 39.915 }, { longitude: 116.414, latitude: 39.925 }], color: "#FF0000", width: 4, dottedLine: false },
      { points: [{ longitude: 116.404, latitude: 39.915 }, { longitude: 116.424, latitude: 39.935 }], color: "#1a73e8", width: 4, dottedLine: true }
    ],
    selectedVehicle: {
      plateNumber: "浙B12345",
      driver: "张师傅",
      phone: "13800138000",
      cargo: "易燃液体",
      deviationAnalysis: "AI分析: 车辆偏离预定路线500米，可能为规避拥堵，风险等级: 中"
    },
    cameras: [
      { id: 1, name: "北门入口", videoUrl: "/assets/videos/gate1.mp4", active: true, statusColor: "#52c41a" },
      { id: 2, name: "南门出口", videoUrl: "/assets/videos/gate2.mp4", active: true, statusColor: "#52c41a" },
      { id: 3, name: "东区路口", videoUrl: "/assets/videos/gate3.mp4", active: false, statusColor: "#f5222d" },
      { id: 4, name: "西区仓库", videoUrl: "/assets/videos/gate4.mp4", active: true, statusColor: "#52c41a" }
    ],
    recommendations: [
      { id: 1, title: "路线优化建议", time: "10:25", content: "AI检测到3辆危险品车辆将在15分钟后同时通过B区路口，建议调度员引导其中一辆绕行C区路线", priority: "high" },
      { id: 2, title: "设备检查提醒", time: "09:40", content: "东区路口摄像头已离线超过2小时，建议立即检修", priority: "medium" },
      { id: 3, title: "例行检查建议", time: "08:15", content: "根据历史数据分析，上午10点是事故高发时段，建议增加巡逻频次", priority: "medium" }
    ],
    alerts: [
      { id: 1, title: "紧急事故", time: "11:30", content: "AI检测到京B54321危险品车辆在D区路口发生异常停车，温度传感器显示异常升高", location: "D区路口(摄像头#12)", vehicle: "京B54321(易燃气体)", level: "high" },
      { id: 2, title: "路线偏离", time: "10:45", content: "危险品车辆沪A98765偏离预定路线超过1公里，AI评估风险等级: 中", location: "F区辅路(摄像头#8)", vehicle: "沪A98765(腐蚀性物质)", level: "warning" },
      { id: 3, title: "超速预警", time: "09:20", content: "危险品车辆粤C12345在园区内超速行驶(45km/h)，已持续30秒", location: "A区主干道(摄像头#3)", vehicle: "粤C12345(爆炸品)", level: "warning" }
    ]
  },
  onLoad: function() {
    this.initAIData();
    this.initVideoContexts();
  },
  initVideoContexts: function() {
    var that = this;
    this.videoContexts = this.data.cameras.map(function(camera) {
      return wx.createVideoContext("video" + camera.id, that);
    });
  },
  handleVideoError: function(e) {
    console.error("视频加载失败:", e.detail.errMsg);
    var id = e.currentTarget.dataset.id;
    var key = "cameras[" + (id - 1) + "].active";
    var obj = {};
    obj[key] = false;
    this.setData(obj);
  },
  initAIData: function() {
    var that = this;
    console.log("AI数据初始化");
    setTimeout(function() {
      that.setData({ dangerVehicleCount: 15, warningCount: 7 });
    }, 2000);
  },
  switchTab: function(e) {
    var tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
    this.updateMapDisplay(tab);
  },
  updateMapDisplay: function(tab) {
    var polyline = [];
    if (tab === "planned") {
      polyline = [{ points: [{ longitude: 116.404, latitude: 39.915 }, { longitude: 116.424, latitude: 39.935 }], color: "#1a73e8", width: 4, dottedLine: false }];
    } else if (tab === "actual") {
      polyline = [{ points: [{ longitude: 116.404, latitude: 39.915 }, { longitude: 116.414, latitude: 39.925 }], color: "#FF0000", width: 4, dottedLine: false }];
    } else {
      polyline = [
        { points: [{ longitude: 116.404, latitude: 39.915 }, { longitude: 116.414, latitude: 39.925 }], color: "#FF0000", width: 4, dottedLine: false },
        { points: [{ longitude: 116.404, latitude: 39.915 }, { longitude: 116.424, latitude: 39.935 }], color: "#1a73e8", width: 4, dottedLine: true }
      ];
    }
    this.setData({ polyline: polyline });
  },
  switchCamera: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var cameras = this.data.cameras.map(function(camera) {
      if (camera.id === id) {
        return { id: camera.id, name: camera.name, videoUrl: camera.videoUrl, active: !camera.active, statusColor: camera.statusColor };
      }
      return camera;
    });
    this.setData({ cameras: cameras }, function() {
      that.initVideoContexts();
    });
  },
  handleRecommendation: function(e) {
    var id = e.currentTarget.dataset.id;
    var action = e.currentTarget.dataset.action;
    var recommendations = this.data.recommendations.filter(function(item) { return item.id !== id; });
    this.setData({ recommendations: recommendations });
    if (action === "accept") {
      wx.showToast({ title: "建议已采纳", icon: "success" });
    }
  },
  handleAlert: function(e) {
    var id = e.currentTarget.dataset.id;
    var action = e.currentTarget.dataset.action;
    var alerts = this.data.alerts.filter(function(item) { return item.id !== id; });
    this.setData({ alerts: alerts });
    if (action === "confirm") {
      wx.showToast({ title: "已确认事故", icon: "success" });
    } else if (action === "false") {
      wx.showToast({ title: "已标记为误报", icon: "none" });
    }
  },
  onHide: function() {
    this.videoContexts.forEach(function(ctx) { ctx.pause(); });
  },
  onShow: function() {
    var that = this;
    this.data.cameras.forEach(function(camera, index) {
      if (camera.active && that.videoContexts && that.videoContexts[index]) {
        that.videoContexts[index].play();
      }
    });
  }
});
