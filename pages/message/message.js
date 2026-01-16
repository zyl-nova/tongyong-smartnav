Page({
  data: {
    currentTab: 0,
    unreadCount: 0,
    allMessages: [
      {
        id: 1,
        type: "reservation",
        iconType: "success",
        icon: "/images/hu/success.png",
        title: "预约成功",
        content: "您已成功预约路线，请按时行驶",
        time: "10:30",
        read: false,
        detail: {
          type: "预约成功",
          title: "路线预约成功通知",
          content: "您已成功预约XXX路线，预约时间为2023-11-15 14:00-16:00，请按时行驶。如需取消预约，请提前2小时操作。",
          time: "2023-11-14 10:30"
        }
      },
      {
        id: 2,
        type: "system",
        iconType: "warning",
        icon: "/images/hu/warning.png",
        title: "违规警告",
        content: "检测到您有违规停车行为，请及时处理",
        time: "昨天",
        read: false,
        detail: {
          type: "违规警告",
          title: "违规停车警告通知",
          content: "系统检测到您的车辆(京A12345)于2023-11-13 08:15在B区非停车区域停放，已违反园区停车管理规定。请立即移车并注意规范停车，避免再次违规。",
          time: "2023-11-13 09:45"
        }
      },
      {
        id: 3,
        type: "system",
        iconType: "system",
        icon: "/images/hu/notice.png",
        title: "系统通知",
        content: "园区将于本周六进行电力检修，请知悉",
        time: "昨天",
        read: true,
        detail: {
          type: "系统通知",
          title: "园区电力检修通知",
          content: "为保障园区电力设施安全运行，定于2023-11-18(周六)8:00-18:00进行年度电力检修。检修期间园区将暂停供电，请各部门提前做好工作安排。",
          time: "2023-11-13 15:20"
        }
      },
      {
        id: 4,
        type: "reservation",
        iconType: "remind",
        icon: "/images/hu/remind.png",
        title: "预约提醒",
        content: "您有一条预约即将到期，请及时处理",
        time: "11-12",
        read: false,
        detail: {
          type: "预约提醒",
          title: "预约到期提醒",
          content: "您的路线预约将于2023-11-20到期，请及时完成行程或续约。",
          time: "2023-11-12 09:15"
        }
      },
      {
        id: 5,
        type: "system",
        iconType: "activity",
        icon: "/images/hu/activity.png",
        title: "活动通知",
        content: "园区将举办健康讲座，欢迎报名参加",
        time: "11-10",
        read: true,
        detail: {
          type: "活动通知",
          title: "健康讲座活动通知",
          content: "园区将于2023-11-25 14:00在多功能厅举办\"冬季健康养生\"主题讲座，特邀三甲医院专家主讲。活动免费参加，名额有限，请通过园区APP提前报名。",
          time: "2023-11-10 16:30"
        }
      }
    ],
    messageList: []
  },
  onLoad: function() {
    this.setData({
      allMessages: this.data.allMessages,
      messageList: this.data.allMessages
    });
    this.updateUnreadCount();
  },
  onShow: function() {
    var app = getApp();
    var readMessages = app.globalData.readMessages || [];
    var that = this;
    var newList = this.data.allMessages.map(function(item) {
      var isRead = readMessages.indexOf(item.id) !== -1;
      return Object.assign({}, item, { read: isRead || item.read });
    });
    this.setData({ allMessages: newList });
    this.filterMessages();
    this.updateUnreadCount();
  },
  switchTab: function(e) {
    var tab = parseInt(e.currentTarget.dataset.tab);
    this.setData({ currentTab: tab });
    this.filterMessages();
  },
  filterMessages: function() {
    var tab = this.data.currentTab;
    var all = this.data.allMessages;
    var filtered = [];
    if (tab === 0) {
      filtered = all;
    } else if (tab === 1) {
      filtered = all.filter(function(item) {
        return item.type === "system";
      });
    } else if (tab === 2) {
      filtered = all.filter(function(item) {
        return item.type === "reservation";
      });
    }
    this.setData({ messageList: filtered });
  },
  updateUnreadCount: function() {
    var count = 0;
    this.data.allMessages.forEach(function(item) {
      if (!item.read) count++;
    });
    this.setData({ unreadCount: count });
  },
  navigateToDetail: function(e) {
    var id = e.currentTarget.dataset.id;
    var item = null;
    var index = -1;
    for (var i = 0; i < this.data.allMessages.length; i++) {
      if (this.data.allMessages[i].id === id) {
        item = this.data.allMessages[i];
        index = i;
        break;
      }
    }
    if (item && !item.read) {
      var app = getApp();
      app.globalData.readMessages = app.globalData.readMessages || [];
      if (app.globalData.readMessages.indexOf(id) === -1) {
        app.globalData.readMessages.push(id);
      }
      var key = "allMessages[" + index + "].read";
      var obj = {};
      obj[key] = true;
      this.setData(obj);
      this.filterMessages();
      this.updateUnreadCount();
    }
    if (item) {
      wx.navigateTo({
        url: "/pages/message/detail/detail?data=" + encodeURIComponent(JSON.stringify(item.detail))
      });
    }
  }
});
