Component({
  properties: {
    show: { type: Boolean, value: false },
    title: { type: String, value: "提示" },
    content: { type: String, value: "" },
    showCancel: { type: Boolean, value: true },
    cancelText: { type: String, value: "取消" },
    confirmText: { type: String, value: "确定" },
    showClose: { type: Boolean, value: true },
    type: { type: String, value: "default" },
    imageUrl: { type: String, value: "" }
  },
  methods: {
    preventTouchMove: function() {},
    onCancel: function() {
      this.triggerEvent("cancel");
      this.setData({ show: false });
    },
    onConfirm: function() {
      this.triggerEvent("confirm");
      this.setData({ show: false });
    },
    showDialog: function(options) {
      var data = { show: true };
      if (options) {
        for (var key in options) {
          data[key] = options[key];
        }
      }
      this.setData(data);
    },
    hideDialog: function() {
      this.setData({ show: false });
    }
  }
});
