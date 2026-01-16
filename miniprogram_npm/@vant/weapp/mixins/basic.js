Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.basic = void 0),
  (exports.basic = Behavior({
    methods: {
      $emit: function (t, e, i) {
        this.triggerEvent(t, e, i);
      },
      set: function (t) {
        return (
          this.setData(t),
          new Promise(function (t) {
            return wx.nextTick(t);
          })
        );
      },
      setView: function (t, e) {
        var i = this,
          s = {},
          r = !1;
        return (
          Object.keys(t).forEach(function (e) {
            t[e] !== i.data[e] && ((s[e] = t[e]), (r = !0));
          }),
          r ? this.setData(s, e) : e && e()
        );
      },
    },
  }));
