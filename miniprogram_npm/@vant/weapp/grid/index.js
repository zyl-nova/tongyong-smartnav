Object.defineProperty(exports, "__esModule", { value: !0 });
var e = require("../common/component"),
  r = require("../common/relation");
(0, e.VantComponent)({
  relation: (0, r.useChildren)("grid-item"),
  props: {
    square: { type: Boolean, observer: "updateChildren" },
    gutter: { type: null, value: 0, observer: "updateChildren" },
    clickable: { type: Boolean, observer: "updateChildren" },
    columnNum: { type: Number, value: 4, observer: "updateChildren" },
    center: { type: Boolean, value: !0, observer: "updateChildren" },
    border: { type: Boolean, value: !0, observer: "updateChildren" },
    direction: { type: String, observer: "updateChildren" },
    iconSize: { type: String, observer: "updateChildren" },
    reverse: { type: Boolean, value: !1, observer: "updateChildren" },
  },
  methods: {
    updateChildren: function () {
      this.children.forEach(function (e) {
        e.updateStyle();
      });
    },
  },
});
