Page({
  data: { detail: {} },
  onLoad: function (t) {
    var a = JSON.parse(decodeURIComponent(t.data));
    this.setData({ detail: a }), wx.setNavigationBarTitle({ title: a.title });
  },
});
