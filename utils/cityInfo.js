Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.extractCityInfo = function (e) {
    if (e && "[object Object]" === Object.prototype.toString(e)) {
      var n = {};
      t.forEach(function (t) {
        n[t] = e[t];
      });
      var o = e.location,
        r = o.lat,
        i = o.lng;
      return (n.location = { latitude: r, longitude: i }), n;
    }
    return null;
  });
var t = ["id", "name", "fullname", "pinyin"];
