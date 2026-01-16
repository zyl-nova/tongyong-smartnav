var e;
function t() {
  return null == e && (e = wx.getSystemInfoSync()), e;
}
function n(e) {
  return (
    (function (e, t) {
      (e = e.split(".")), (t = t.split("."));
      for (var n = Math.max(e.length, t.length); e.length < n; ) e.push("0");
      for (; t.length < n; ) t.push("0");
      for (var r = 0; r < n; r++) {
        var s = parseInt(e[r], 10),
          o = parseInt(t[r], 10);
        if (s > o) return 1;
        if (s < o) return -1;
      }
      return 0;
    })(t().SDKVersion, e) >= 0
  );
}
Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.canIUseGetUserProfile =
    exports.canIUseCanvas2d =
    exports.canIUseNextTick =
    exports.canIUseGroupSetData =
    exports.canIUseAnimate =
    exports.canIUseFormFieldButton =
    exports.canIUseModel =
    exports.getSystemInfoSync =
      void 0),
  (exports.getSystemInfoSync = t),
  (exports.canIUseModel = function () {
    return n("2.9.3");
  }),
  (exports.canIUseFormFieldButton = function () {
    return n("2.10.3");
  }),
  (exports.canIUseAnimate = function () {
    return n("2.9.0");
  }),
  (exports.canIUseGroupSetData = function () {
    return n("2.4.0");
  }),
  (exports.canIUseNextTick = function () {
    try {
      return wx.canIUse("nextTick");
    } catch (e) {
      return n("2.7.1");
    }
  }),
  (exports.canIUseCanvas2d = function () {
    return n("2.9.0");
  }),
  (exports.canIUseGetUserProfile = function () {
    return !!wx.getUserProfile;
  });
