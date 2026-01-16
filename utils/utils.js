Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.compareVersion = function (e, r) {
    (e = e.split(".")), (r = r.split("."));
    var t = Math.max(e.length, r.length);
    for (; e.length < t; ) e.push("0");
    for (; r.length < t; ) r.push("0");
    for (var n = 0; n < t; n++) {
      var s = parseInt(e[n]),
        o = parseInt(r[n]);
      if (s > o) return 1;
      if (s < o) return -1;
    }
    return 0;
  });
