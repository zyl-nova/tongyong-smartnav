var regeneratorRuntime = (function () {
  var r, e = Object.prototype, t = e.hasOwnProperty, n = Object.defineProperty || function (r, e, t) { r[e] = t.value; }, o = "function" == typeof Symbol ? Symbol : {}, i = o.iterator || "@@iterator", a = o.asyncIterator || "@@asyncIterator", c = o.toStringTag || "@@toStringTag";
  function u(r, e, t) { return Object.defineProperty(r, e, { value: t, enumerable: !0, configurable: !0, writable: !0 }), r[e]; }
  try { u({}, ""); } catch (r) { u = function (r, e, t) { return r[e] = t; }; }
  function h(r, e, t, o) {
    var i = e && e.prototype instanceof v ? e : v, a = Object.create(i.prototype), c = new O(o || []);
    return n(a, "_invoke", { value: k(r, t, c) }), a;
  }
  function f(r, e, t) {
    try { return { type: "normal", arg: r.call(e, t) }; } catch (r) { return { type: "throw", arg: r }; }
  }
  r.wrap = h;
  var s = {};
  function v() {}
  function p() {}
  function d() {}
  var l = {};
  u(l, i, function () { return this; });
  var m = Object.getPrototypeOf, y = m && m(m(N([])));
  y && y !== e && t.call(y, i) && (l = y);
  var g = d.prototype = v.prototype = Object.create(l);
  function w(r) { ["next", "throw", "return"].forEach(function (e) { u(r, e, function (r) { return this._invoke(e, r); }); }); }
  function x(r, e) {
    function o(n, i, a, c) {
      var u = f(r[n], r, i);
      if ("throw" !== u.type) {
        var h = u.arg, s = h.value;
        return s && "object" == typeof s && t.call(s, "__await") ? e.resolve(s.__await).then(function (r) { o("next", r, a, c); }, function (r) { o("throw", r, a, c); }) : e.resolve(s).then(function (r) { h.value = r, a(h); }, function (r) { return o("throw", r, a, c); });
      }
      c(u.arg);
    }
    var i;
    n(this, "_invoke", { value: function (r, t) {
      function n() { return new e(function (e, n) { o(r, t, e, n); }); }
      return i = i ? i.then(n, n) : n();
    } });
  }
  function k(r, e, t) {
    var n = "suspendedStart";
    return function (o, i) {
      if ("executing" === n) throw Error("Generator is already running");
      if ("completed" === n) {
        if ("throw" === o) throw i;
        return { value: void 0, done: !0 };
      }
      for (t.method = o, t.arg = i; ;) {
        var a = t.delegate;
        if (a) {
          var c = b(a, t);
          if (c) {
            if (c === s) continue;
            return c;
          }
        }
        if ("next" === t.method) t.sent = t._sent = t.arg;
        else if ("throw" === t.method) {
          if ("suspendedStart" === n) throw n = "completed", t.arg;
          t.dispatchException(t.arg);
        } else "return" === t.method && t.abrupt("return", t.arg);
        n = "executing";
        var u = f(r, e, t);
        if ("normal" === u.type) {
          if (n = t.done ? "completed" : "suspendedYield", u.arg === s) continue;
          return { value: u.arg, done: t.done };
        }
        "throw" === u.type && (n = "completed", t.method = "throw", t.arg = u.arg);
      }
    };
  }
  function b(r, e) {
    var t = e.method, n = r.iterator[t];
    if (void 0 === n) return e.delegate = null, "throw" === t && r.iterator.return && (e.method = "return", e.arg = void 0, b(r, e), "throw" === e.method) || "return" !== t && (e.method = "throw", e.arg = new TypeError("The iterator does not provide a '" + t + "' method")), s;
    var o = f(n, r.iterator, e.arg);
    if ("throw" === o.type) return e.method = "throw", e.arg = o.arg, e.delegate = null, s;
    var i = o.arg;
    return i ? i.done ? (e[r.resultName] = i.value, e.next = r.nextLoc, "return" !== e.method && (e.method = "next", e.arg = void 0), e.delegate = null, s) : i : (e.method = "throw", e.arg = new TypeError("iterator result is not an object"), e.delegate = null, s);
  }
  function L(r) {
    var e = { tryLoc: r[0] };
    1 in r && (e.catchLoc = r[1]), 2 in r && (e.finallyLoc = r[2], e.afterLoc = r[3]), this.tryEntries.push(e);
  }
  function E(r) {
    var e = r.completion || {};
    e.type = "normal", delete e.arg, r.completion = e;
  }
  function O(r) {
    this.tryEntries = [{ tryLoc: "root" }], r.forEach(L, this), this.reset(!0);
  }
  function N(r) {
    if (r || "" === r) {
      var e = r[i];
      if (e) return e.call(r);
      if ("function" == typeof r.next) return r;
      if (!isNaN(r.length)) {
        var n = -1, o = function e() {
          for (; ++n < r.length;) if (t.call(r, n)) return e.value = r[n], e.done = !1, e;
          return e.value = void 0, e.done = !0, e;
        };
        return o.next = o;
      }
    }
    return { next: j };
  }
  function j() { return { value: void 0, done: !0 }; }
  return p.prototype = d, n(g, "constructor", { value: d, configurable: !0 }), n(d, "constructor", { value: p, configurable: !0 }), p.displayName = u(d, c, "GeneratorFunction"),
  r.isGeneratorFunction = function (r) { var e = "function" == typeof r && r.constructor; return !!e && (e === p || "GeneratorFunction" === (e.displayName || e.name)); },
  r.mark = function (r) { return Object.setPrototypeOf ? Object.setPrototypeOf(r, d) : (r.__proto__ = d, u(r, c, "GeneratorFunction")), r.prototype = Object.create(g), r; },
  r.awrap = function (r) { return { __await: r }; },
  w(x.prototype), u(x.prototype, a, function () { return this; }),
  r.AsyncIterator = x,
  r.async = function (e, t, n, o, i) { void 0 === i && (i = Promise); var a = new x(h(e, t, n, o), i); return r.isGeneratorFunction(t) ? a : a.next().then(function (r) { return r.done ? r.value : a.next(); }); },
  w(g), u(g, c, "Generator"), u(g, i, function () { return this; }), u(g, "toString", function () { return "[object Generator]"; }),
  r.keys = function (r) { var e = Object(r), t = []; for (var n in e) t.push(n); return t.reverse(), function r() { for (; t.length;) { var n = t.pop(); if (n in e) return r.value = n, r.done = !1, r; } return r.done = !0, r; }; },
  r.values = N,
  O.prototype = { constructor: O, reset: function (r) { if (this.prev = 0, this.next = 0, this.sent = this._sent = void 0, this.done = !1, this.delegate = null, this.method = "next", this.arg = void 0, this.tryEntries.forEach(E), !r) for (var e in this) "t" === e.charAt(0) && t.call(this, e) && !isNaN(+e.slice(1)) && (this[e] = void 0); },
    stop: function () { this.done = !0; var r = this.tryEntries[0].completion; if ("throw" === r.type) throw r.arg; return this.rval; },
    dispatchException: function (r) { if (this.done) throw r; var e = this; function n(t, n) { return a.type = "throw", a.arg = r, e.next = t, n && (e.method = "next", e.arg = void 0), !!n; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return n("end"); if (i.tryLoc <= this.prev) { var c = t.call(i, "catchLoc"), u = t.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return n(i.catchLoc, !0); if (this.prev < i.finallyLoc) return n(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return n(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return n(i.finallyLoc); } } } },
    abrupt: function (r, e) { for (var n = this.tryEntries.length - 1; n >= 0; --n) { var o = this.tryEntries[n]; if (o.tryLoc <= this.prev && t.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === r || "continue" === r) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = r, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, s) : this.complete(a); },
    complete: function (r, e) { if ("throw" === r.type) throw r.arg; return "break" === r.type || "continue" === r.type ? this.next = r.arg : "return" === r.type ? (this.rval = this.arg = r.arg, this.method = "return", this.next = "end") : "normal" === r.type && e && (this.next = e), s; },
    finish: function (r) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var t = this.tryEntries[e]; if (t.finallyLoc === r) return this.complete(t.completion, t.afterLoc), E(t), s; } },
    catch: function (r) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var t = this.tryEntries[e]; if (t.tryLoc === r) { var n = t.completion; if ("throw" === n.type) { var o = n.arg; E(t); } return o; } } throw Error("illegal catch attempt"); },
    delegateYield: function (r, e, t) { return this.delegate = { iterator: N(r), resultName: e, nextLoc: t }, "next" === this.method && (this.arg = void 0), s; } },
  r;
})({});
module.exports = regeneratorRuntime;
