Object.defineProperty(exports, "__esModule", { value: !0 });
var e = require("../common/component"),
  t = require("../common/relation"),
  i = require("../mixins/link");
(0, e.VantComponent)({
  relation: (0, t.useParent)("grid"),
  classes: ["content-class", "icon-class", "text-class"],
  mixins: [i.link],
  props: {
    icon: String,
    iconColor: String,
    iconPrefix: { type: String, value: "van-icon" },
    dot: Boolean,
    info: null,
    badge: null,
    text: String,
    useSlot: Boolean,
  },
  data: { viewStyle: "" },
  mounted: function () {
    this.updateStyle();
  },
  methods: {
    updateStyle: function () {
      if (this.parent) {
        var e = this.parent,
          t = e.data,
          i = e.children,
          n = t.columnNum,
          o = t.border,
          r = t.square,
          c = t.gutter,
          l = t.clickable,
          s = t.center,
          a = t.direction,
          u = t.reverse,
          d = t.iconSize;
        this.setData({
          center: s,
          border: o,
          square: r,
          gutter: c,
          clickable: l,
          direction: a,
          reverse: u,
          iconSize: d,
          index: i.indexOf(this),
          columnNum: n,
        });
      }
    },
    onClick: function () {
      this.$emit("click"), this.jumpLink();
    },
  },
});
