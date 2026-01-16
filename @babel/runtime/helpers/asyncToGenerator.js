function asyncGeneratorStep(n, t, e, r, o, a, c) {
  try {
    var i = n[a](c),
      u = i.value;
  } catch (n) {
    return void e(n);
  }
  i.done ? t(u) : Promise.resolve(u).then(r, o);
}
function _asyncToGenerator(n) {
  return function () {
    var t = this,
      e = arguments;
    return new Promise(function (r, o) {
      var a = n.apply(t, e);
      function c(n) {
        asyncGeneratorStep(a, r, o, c, i, "next", n);
      }
      function i(n) {
        asyncGeneratorStep(a, r, o, c, i, "throw", n);
      }
      c(void 0);
    });
  };
}
module.exports = _asyncToGenerator;
