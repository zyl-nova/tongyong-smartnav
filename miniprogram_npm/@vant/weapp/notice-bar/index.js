Object.defineProperty(exports, "__esModule", { value: !0 });
var t = require("../common/component"),
  i = require("../common/utils");
(0, t.VantComponent)({
  props: {
    text: { type: String, value: "", observer: "init" },
    mode: { type: String, value: "" },
    url: { type: String, value: "" },
    openType: { type: String, value: "navigate" },
    delay: { type: Number, value: 1 },
    speed: { type: Number, value: 60, observer: "init" },
    scrollable: null,
    leftIcon: { type: String, value: "" },
    color: String,
    backgroundColor: String,
    background: String,
    wrapable: Boolean,
  },
  data: { show: !0 },
  created: function () {
    this.resetAnimation = wx.createAnimation({
      duration: 0,
      timingFunction: "linear",
    });
  },
  destroyed: function () {
    this.timer && clearTimeout(this.timer);
  },
  mounted: function () {
    this.init();
  },
  methods: {
    init: function () {
      var t = this;
      (0, i.requestAnimationFrame)(function () {
        Promise.all([
          (0, i.getRect)(t, ".van-notice-bar__content"),
          (0, i.getRect)(t, ".van-notice-bar__wrap"),
        ]).then(function (i) {
          var e = i[0],
            n = i[1],
            a = t.data.scrollable;
          null != e &&
            null != n &&
            e.width &&
            n.width &&
            !1 !== a &&
            (a || n.width < e.width) &&
            (t.initAnimation(n.width, e.width), t.scroll(!0));
        });
      });
    },
    initAnimation: function (t, i) {
      var e = this.data,
        n = e.speed,
        a = e.delay;
      (this.wrapWidth = t),
        (this.contentWidth = i),
        (this.contentDuration = (i / n) * 1e3),
        (this.duration = ((t + i) / n) * 1e3),
        (this.animation = wx.createAnimation({
          duration: this.contentDuration,
          timingFunction: "linear",
          delay: a,
        }));
    },
    scroll: function (t) {
      var e = this;
      void 0 === t && (t = !1),
        this.timer && clearTimeout(this.timer),
        (this.timer = null),
        this.setData({
          animationData: this.resetAnimation
            .translateX(t ? 0 : this.wrapWidth)
            .step()
            .export(),
        });
      var n = t ? this.contentDuration : this.duration;
      (0, i.requestAnimationFrame)(function () {
        e.setData({
          animationData: e.animation
            .translateX(-e.contentWidth)
            .step({ duration: n })
            .export(),
        });
      }),
        (this.timer = setTimeout(function () {
          e.scroll();
        }, n + this.data.delay));
    },
    onClickIcon: function (t) {
      "closeable" === this.data.mode &&
        (this.timer && clearTimeout(this.timer),
        (this.timer = null),
        this.setData({ show: !1 }),
        this.$emit("close", t.detail));
    },
    onClick: function (t) {
      this.$emit("click", t);
    },
  },
});
