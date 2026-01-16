var t = function () {
  return (t =
    Object.assign ||
    function (t) {
      for (var e, i = 1, n = arguments.length; i < n; i++)
        for (var r in (e = arguments[i]))
          Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
      return t;
    }).apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: !0 });
var e = require("../common/component"),
  i = require("../mixins/touch"),
  n = require("../common/utils"),
  r = require("../common/validator"),
  a = require("../common/relation");
(0, e.VantComponent)({
  mixins: [i.touch],
  classes: [
    "nav-class",
    "tab-class",
    "tab-active-class",
    "line-class",
    "wrap-class",
  ],
  relation: (0, a.useChildren)("tab", function () {
    this.updateTabs();
  }),
  props: {
    sticky: Boolean,
    border: Boolean,
    swipeable: Boolean,
    titleActiveColor: String,
    titleInactiveColor: String,
    color: String,
    animated: {
      type: Boolean,
      observer: function () {
        var t = this;
        this.children.forEach(function (e, i) {
          return e.updateRender(i === t.data.currentIndex, t);
        });
      },
    },
    lineWidth: { type: null, value: 40, observer: "resize" },
    lineHeight: { type: null, value: -1 },
    active: {
      type: null,
      value: 0,
      observer: function (t) {
        t !== this.getCurrentName() && this.setCurrentIndexByName(t);
      },
    },
    type: { type: String, value: "line" },
    ellipsis: { type: Boolean, value: !0 },
    duration: { type: Number, value: 0.3 },
    zIndex: { type: Number, value: 1 },
    swipeThreshold: {
      type: Number,
      value: 5,
      observer: function (t) {
        this.setData({
          scrollable: this.children.length > t || !this.data.ellipsis,
        });
      },
    },
    offsetTop: { type: Number, value: 0 },
    lazyRender: { type: Boolean, value: !0 },
    useBeforeChange: { type: Boolean, value: !1 },
  },
  data: {
    tabs: [],
    scrollLeft: 0,
    scrollable: !1,
    currentIndex: 0,
    container: null,
    skipTransition: !0,
    scrollWithAnimation: !1,
    lineOffsetLeft: 0,
    inited: !1,
  },
  mounted: function () {
    var t = this;
    (0, n.requestAnimationFrame)(function () {
      (t.swiping = !0),
        t.setData({
          container: function () {
            return t.createSelectorQuery().select(".van-tabs");
          },
        }),
        t.resize(),
        t.scrollIntoView();
    });
  },
  methods: {
    updateTabs: function () {
      var t = this.children,
        e = void 0 === t ? [] : t,
        i = this.data;
      this.setData({
        tabs: e.map(function (t) {
          return t.data;
        }),
        scrollable: this.children.length > i.swipeThreshold || !i.ellipsis,
      }),
        this.setCurrentIndexByName(i.active || this.getCurrentName());
    },
    trigger: function (t, e) {
      var i = this.data.currentIndex,
        n = this.getChildData(i, e);
      (0, r.isDef)(n) && this.$emit(t, n);
    },
    onTap: function (t) {
      var e = this,
        i = t.currentTarget.dataset.index,
        r = this.children[i];
      r.data.disabled
        ? this.trigger("disabled", r)
        : this.onBeforeChange(i).then(function () {
            e.setCurrentIndex(i),
              (0, n.nextTick)(function () {
                e.trigger("click");
              });
          });
    },
    setCurrentIndexByName: function (t) {
      var e = this.children,
        i = (void 0 === e ? [] : e).filter(function (e) {
          return e.getComputedName() === t;
        });
      i.length && this.setCurrentIndex(i[0].index);
    },
    setCurrentIndex: function (t) {
      var e = this,
        i = this.data,
        a = this.children,
        s = void 0 === a ? [] : a;
      if (!(!(0, r.isDef)(t) || t >= s.length || t < 0))
        if (
          ((0, n.groupSetData)(this, function () {
            s.forEach(function (i, n) {
              var r = n === t;
              (r === i.data.active && i.inited) || i.updateRender(r, e);
            });
          }),
          t !== i.currentIndex)
        ) {
          var o = null !== i.currentIndex;
          this.setData({ currentIndex: t }),
            (0, n.requestAnimationFrame)(function () {
              e.resize(), e.scrollIntoView();
            }),
            (0, n.nextTick)(function () {
              e.trigger("input"), o && e.trigger("change");
            });
        } else i.inited || this.resize();
    },
    getCurrentName: function () {
      var t = this.children[this.data.currentIndex];
      if (t) return t.getComputedName();
    },
    resize: function () {
      var t = this;
      if ("line" === this.data.type) {
        var e = this.data,
          i = e.currentIndex,
          r = e.ellipsis,
          a = e.skipTransition;
        Promise.all([
          (0, n.getAllRect)(this, ".van-tab"),
          (0, n.getRect)(this, ".van-tabs__line"),
        ]).then(function (e) {
          var n = e[0],
            s = void 0 === n ? [] : n,
            o = e[1],
            l = s[i];
          if (null != l) {
            var u = s.slice(0, i).reduce(function (t, e) {
              return t + e.width;
            }, 0);
            (u += (l.width - o.width) / 2 + (r ? 0 : 8)),
              t.setData({ lineOffsetLeft: u, inited: !0 }),
              (t.swiping = !0),
              a &&
                setTimeout(function () {
                  t.setData({ skipTransition: !1 });
                }, t.data.duration);
          }
        });
      }
    },
    scrollIntoView: function () {
      var t = this,
        e = this.data,
        i = e.currentIndex,
        r = e.scrollable,
        a = e.scrollWithAnimation;
      r &&
        Promise.all([
          (0, n.getAllRect)(this, ".van-tab"),
          (0, n.getRect)(this, ".van-tabs__nav"),
        ]).then(function (e) {
          var r = e[0],
            s = e[1],
            o = r[i],
            l = r.slice(0, i).reduce(function (t, e) {
              return t + e.width;
            }, 0);
          t.setData({ scrollLeft: l - (s.width - o.width) / 2 }),
            a ||
              (0, n.nextTick)(function () {
                t.setData({ scrollWithAnimation: !0 });
              });
        });
    },
    onTouchScroll: function (t) {
      this.$emit("scroll", t.detail);
    },
    onTouchStart: function (t) {
      this.data.swipeable && ((this.swiping = !0), this.touchStart(t));
    },
    onTouchMove: function (t) {
      this.data.swipeable && this.swiping && this.touchMove(t);
    },
    onTouchEnd: function () {
      var t = this;
      if (this.data.swipeable && this.swiping) {
        var e = this.direction,
          i = this.deltaX,
          n = this.offsetX;
        if ("horizontal" === e && n >= 50) {
          var r = this.getAvaiableTab(i);
          -1 !== r &&
            this.onBeforeChange(r).then(function () {
              return t.setCurrentIndex(r);
            });
        }
        this.swiping = !1;
      }
    },
    getAvaiableTab: function (t) {
      for (
        var e = this.data,
          i = e.tabs,
          n = e.currentIndex,
          r = t > 0 ? -1 : 1,
          a = r;
        n + a < i.length && n + a >= 0;
        a += r
      ) {
        var s = n + a;
        if (s >= 0 && s < i.length && i[s] && !i[s].disabled) return s;
      }
      return -1;
    },
    onBeforeChange: function (e) {
      var i = this;
      return this.data.useBeforeChange
        ? new Promise(function (n, r) {
            i.$emit(
              "before-change",
              t(t({}, i.getChildData(e)), {
                callback: function (t) {
                  return t ? n() : r();
                },
              })
            );
          })
        : Promise.resolve();
    },
    getChildData: function (t, e) {
      var i = e || this.children[t];
      if ((0, r.isDef)(i))
        return {
          index: i.index,
          name: i.getComputedName(),
          title: i.data.title,
        };
    },
  },
});
