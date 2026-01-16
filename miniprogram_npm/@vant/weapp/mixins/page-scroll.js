Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.pageScrollMixin = void 0);
var e = require("../common/validator"),
  r = require("../common/utils");
function o(e) {
  var o = (0, r.getCurrentPage)().vanPageScroller;
  (void 0 === o ? [] : o).forEach(function (r) {
    "function" == typeof r && r(e);
  });
}
exports.pageScrollMixin = function (n) {
  return Behavior({
    attached: function () {
      var i = (0, r.getCurrentPage)();
      if ((0, r.isDef)(i)) {
        var a = n.bind(this),
          l = i.vanPageScroller,
          t = void 0 === l ? [] : l;
        (0, e.isFunction)(i.onPageScroll) &&
          i.onPageScroll !== o &&
          t.push(i.onPageScroll.bind(i)),
          t.push(a),
          (i.vanPageScroller = t),
          (i.onPageScroll = o),
          (this._scroller = a);
      }
    },
    detached: function () {
      var e = this,
        o = (0, r.getCurrentPage)();
      if ((0, r.isDef)(o) && (0, r.isDef)(o.vanPageScroller)) {
        var n = o.vanPageScroller.findIndex(function (r) {
          return r === e._scroller;
        });
        n > -1 && o.vanPageScroller.splice(n, 1), (this._scroller = void 0);
      }
    },
  });
};
