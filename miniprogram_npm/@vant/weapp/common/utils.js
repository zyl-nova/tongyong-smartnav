require("../../../../@babel/runtime/helpers/Arrayincludes"),
  Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.isWxWork =
    exports.isPC =
    exports.getCurrentPage =
    exports.clamp =
    exports.addNumber =
    exports.toPromise =
    exports.groupSetData =
    exports.getAllRect =
    exports.getRect =
    exports.pickExclude =
    exports.requestAnimationFrame =
    exports.addUnit =
    exports.nextTick =
    exports.range =
    exports.getSystemInfoSync =
    exports.isDef =
      void 0);
var e = require("./validator"),
  t = require("./version"),
  r = require("./validator");
Object.defineProperty(exports, "isDef", {
  enumerable: !0,
  get: function () {
    return r.isDef;
  },
});
var n = require("./version");
Object.defineProperty(exports, "getSystemInfoSync", {
  enumerable: !0,
  get: function () {
    return n.getSystemInfoSync;
  },
}),
  (exports.range = function (e, t, r) {
    return Math.min(Math.max(e, t), r);
  }),
  (exports.nextTick = function (e) {
    (0, t.canIUseNextTick)()
      ? wx.nextTick(e)
      : setTimeout(function () {
          e();
        }, 1e3 / 30);
  }),
  (exports.addUnit = function (t) {
    if ((0, e.isDef)(t))
      return (t = String(t)), (0, e.isNumber)(t) ? "".concat(t, "px") : t;
  }),
  (exports.requestAnimationFrame = function (e) {
    return setTimeout(function () {
      e();
    }, 1e3 / 30);
  }),
  (exports.pickExclude = function (t, r) {
    return (0, e.isPlainObject)(t)
      ? Object.keys(t).reduce(function (e, n) {
          return r.includes(n) || (e[n] = t[n]), e;
        }, {})
      : {};
  }),
  (exports.getRect = function (e, t) {
    return new Promise(function (r) {
      wx.createSelectorQuery()
        .in(e)
        .select(t)
        .boundingClientRect()
        .exec(function (e) {
          return void 0 === e && (e = []), r(e[0]);
        });
    });
  }),
  (exports.getAllRect = function (e, t) {
    return new Promise(function (r) {
      wx.createSelectorQuery()
        .in(e)
        .selectAll(t)
        .boundingClientRect()
        .exec(function (e) {
          return void 0 === e && (e = []), r(e[0]);
        });
    });
  }),
  (exports.groupSetData = function (e, r) {
    (0, t.canIUseGroupSetData)() ? e.groupSetData(r) : r();
  }),
  (exports.toPromise = function (t) {
    return (0, e.isPromise)(t) ? t : Promise.resolve(t);
  }),
  (exports.addNumber = function (e, t) {
    var r = Math.pow(10, 10);
    return Math.round((e + t) * r) / r;
  });
(exports.clamp = function (e, t, r) {
  return Math.min(Math.max(e, t), r);
}),
  (exports.getCurrentPage = function () {
    var e = getCurrentPages();
    return e[e.length - 1];
  }),
  (exports.isPC = ["mac", "windows"].includes(
    (0, t.getSystemInfoSync)().platform
  )),
  (exports.isWxWork = "wxwork" === (0, t.getSystemInfoSync)().environment);
