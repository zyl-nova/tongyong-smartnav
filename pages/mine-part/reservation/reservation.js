Page({
  data: {
    isAddFormVisible: false,
    statusIndex: 0,
    statusOptions: [
      { name: "全部状态", value: "all" },
      { name: "待确认", value: "pending" },
      { name: "已确认", value: "confirmed" },
      { name: "已完成", value: "completed" },
      { name: "已取消", value: "cancelled" }
    ],
    currentDate: "",
    dateSelected: false,
    reservations: [],
    filteredReservations: [],
    newReservation: { reservationNumber: "", startPoint: "", endPoint: "", date: "", time: "", vehicleType: "", licensePlate: "", status: "待确认" }
  },
  onLoad: function() {
    var now = new Date();
    var year = now.getFullYear();
    var month = (now.getMonth() + 1).toString().padStart(2, "0");
    var currentDate = year + "-" + month;
    
    var mockData = [
      { id: 1, reservationNumber: "RES" + year + month + "15001", startPoint: "宁波栎社国际机场", endPoint: "快件中心国际货站", date: year + "-" + month + "-15", time: "14:00-16:00", vehicleType: "危险品运输车", licensePlate: "浙B12345", status: "已确认", plannedRoute: "机场路高架→环城南路", contact: "张经理 13800138000" },
      { id: 2, reservationNumber: "RES" + year + month + "16002", startPoint: "宁波港北仑港区", endPoint: "镇海化工区", date: year + "-" + month + "-16", time: "09:00-11:00", vehicleType: "集装箱货车", licensePlate: "浙B67890", status: "待确认", plannedRoute: "甬台温高速→宁波绕城高速", contact: "李主管 13900139000" },
      { id: 3, reservationNumber: "RES" + year + month + "10003", startPoint: "余姚物流园", endPoint: "慈溪保税区", date: year + "-" + month + "-10", time: "13:00-15:00", vehicleType: "普通货车", licensePlate: "浙B34567", status: "已完成", plannedRoute: "杭甬高速→沈海高速", contact: "王调度 13700137000" },
      { id: 4, reservationNumber: "RES" + year + month + "05004", startPoint: "宁波火车东站", endPoint: "梅山保税港区", date: year + "-" + month + "-05", time: "10:00-12:00", vehicleType: "冷藏车", licensePlate: "浙B89012", status: "已取消", plannedRoute: "甬台温高速→穿山疏港高速", contact: "赵经理 13600136000" }
    ];
    
    var stored = wx.getStorageSync("reservations") || [];
    var existingIds = [1, 2, 3, 4];
    var newItems = stored.filter(function(item) {
      if (existingIds.indexOf(item.id) !== -1) return false;
      if (!item.date || !item.licensePlate || item.status === 'pending') return false;
      return true;
    });
    wx.setStorageSync("reservations", newItems);
    var all = mockData.concat(newItems);
    var that = this;
    this.setData({ currentDate: currentDate, reservations: all }, function() { that.filterReservations(); });
  },
  filterReservations: function() {
    var that = this;
    var statusIndex = this.data.statusIndex;
    var statusValue = this.data.statusOptions[statusIndex].value;
    var filtered = this.data.reservations.filter(function(item) {
      var statusMatch = statusValue === "all" || item.status === that.getStatusText(statusValue);
      if (!that.data.dateSelected) {
        return statusMatch;
      }
      var currentDate = that.data.currentDate;
      var dateParts = currentDate.split("-");
      var year = dateParts[0];
      var month = dateParts[1];
      var itemDateParts = item.date.split("-");
      var dateMatch = itemDateParts[0] === year && itemDateParts[1] === month;
      return statusMatch && dateMatch;
    });
    this.setData({ filteredReservations: filtered });
  },
  getStatusText: function(value) {
    var map = { pending: "待确认", confirmed: "已确认", completed: "已完成", cancelled: "已取消" };
    return map[value] || "";
  },
  statusFilterChange: function(e) {
    var that = this;
    this.setData({ statusIndex: e.detail.value }, function() { that.filterReservations(); });
  },
  dateFilterChange: function(e) {
    var that = this;
    this.setData({ currentDate: e.detail.value, dateSelected: true }, function() { that.filterReservations(); });
  },
  showAddReservationForm: function() {
    var now = new Date();
    var y = now.getFullYear();
    var m = (now.getMonth() + 1).toString().padStart(2, "0");
    var d = now.getDate().toString().padStart(2, "0");
    var h = now.getHours().toString().padStart(2, "0");
    var min = now.getMinutes().toString().padStart(2, "0");
    var rand = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    this.setData({
      isAddFormVisible: true,
      newReservation: {
        reservationNumber: "RES" + y + m + d + rand,
        startPoint: "",
        endPoint: "",
        date: y + "-" + m + "-" + d,
        time: h + ":" + min,
        vehicleType: "",
        licensePlate: "",
        status: "待确认"
      }
    });
  },
  hideAddReservationForm: function() {
    this.setData({ isAddFormVisible: false });
  },
  setReservationNumber: function(e) { this.setData({ "newReservation.reservationNumber": e.detail.value }); },
  setStartPoint: function(e) { this.setData({ "newReservation.startPoint": e.detail.value }); },
  setEndPoint: function(e) { this.setData({ "newReservation.endPoint": e.detail.value }); },
  setDate: function(e) { this.setData({ "newReservation.date": e.detail.value }); },
  setTime: function(e) { this.setData({ "newReservation.time": e.detail.value }); },
  setVehicleType: function(e) { this.setData({ "newReservation.vehicleType": e.detail.value }); },
  setLicensePlate: function(e) { this.setData({ "newReservation.licensePlate": e.detail.value }); },
  submitAddReservation: function() {
    var that = this;
    var newRes = this.data.newReservation;
    if (!newRes.reservationNumber || !newRes.startPoint || !newRes.endPoint || !newRes.date || !newRes.time || !newRes.vehicleType || !newRes.licensePlate) {
      wx.showToast({ title: "请填写完整信息", icon: "none" });
      return;
    }
    var maxId = 0;
    this.data.reservations.forEach(function(item) { if (item.id > maxId) maxId = item.id; });
    var newItem = {
      id: maxId + 1,
      reservationNumber: newRes.reservationNumber,
      startPoint: newRes.startPoint,
      endPoint: newRes.endPoint,
      date: newRes.date,
      time: newRes.time,
      vehicleType: newRes.vehicleType,
      licensePlate: newRes.licensePlate,
      status: "待确认",
      plannedRoute: "路线待规划",
      contact: "请联系客服"
    };
    var all = [newItem].concat(this.data.reservations);
    wx.setStorageSync("reservations", all);
    this.setData({ reservations: all, statusIndex: 0, isAddFormVisible: false }, function() {
      that.filterReservations();
      wx.showToast({ title: "添加成功", icon: "success" });
    });
  },
  cancelReservation: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: "确认取消",
      content: "确定要取消此预约吗？",
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({ title: "处理中..." });
          setTimeout(function() {
            var updated = that.data.reservations.map(function(item) {
              if (item.id === id) {
                return { id: item.id, reservationNumber: item.reservationNumber, startPoint: item.startPoint, endPoint: item.endPoint, date: item.date, time: item.time, vehicleType: item.vehicleType, licensePlate: item.licensePlate, status: "已取消", plannedRoute: item.plannedRoute, contact: item.contact };
              }
              return item;
            });
            wx.setStorageSync("reservations", updated);
            that.setData({ reservations: updated }, function() {
              that.filterReservations();
              wx.hideLoading();
              wx.showToast({ title: "已取消预约", icon: "success" });
            });
          }, 800);
        }
      }
    });
  },
  viewRoute: function(e) {
    var id = e.currentTarget.dataset.id;
    var item = null;
    for (var i = 0; i < this.data.reservations.length; i++) {
      if (this.data.reservations[i].id === id) {
        item = this.data.reservations[i];
        break;
      }
    }
    if (item) {
      wx.navigateTo({
        url: "/pages/home-part/route/route?start=" + encodeURIComponent(item.startPoint) + "&end=" + encodeURIComponent(item.endPoint) + "&route=" + encodeURIComponent(item.plannedRoute) + "&plate=" + encodeURIComponent(item.licensePlate),
        fail: function(err) {
          console.error("跳转失败:", err);
          wx.showToast({ title: "路线页面加载失败", icon: "none" });
        }
      });
    }
  },
  viewDetails: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: "/pages/reservation/detail?id=" + id });
  }
});
