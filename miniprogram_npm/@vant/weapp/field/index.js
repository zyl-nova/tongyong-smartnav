var e = function () {
  return (e =
    Object.assign ||
    function (e) {
      for (var t, i = 1, a = arguments.length; i < a; i++)
        for (var n in (t = arguments[i]))
          Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
      return e;
    }).apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: !0 });
var t = require("../common/utils"),
  i = require("../common/component"),
  a = require("./props");
(0, i.VantComponent)({
  field: !0,
  classes: ["input-class", "right-icon-class", "label-class"],
  props: e(e(e(e({}, a.commonProps), a.inputProps), a.textareaProps), {
    size: String,
    icon: String,
    label: String,
    error: Boolean,
    center: Boolean,
    isLink: Boolean,
    leftIcon: String,
    rightIcon: String,
    autosize: null,
    required: Boolean,
    iconClass: String,
    clickable: Boolean,
    inputAlign: String,
    customStyle: String,
    errorMessage: String,
    arrowDirection: String,
    showWordLimit: Boolean,
    errorMessageAlign: String,
    readonly: { type: Boolean, observer: "setShowClear" },
    clearable: { type: Boolean, observer: "setShowClear" },
    clearTrigger: { type: String, value: "focus" },
    border: { type: Boolean, value: !0 },
    titleWidth: { type: String, value: "6.2em" },
    clearIcon: { type: String, value: "clear" },
    extraEventParams: { type: Boolean, value: !1 },
  }),
  data: { focused: !1, innerValue: "", showClear: !1 },
  watch: {
    value: function (e) {
      e !== this.value &&
        (this.setData({ innerValue: e }),
        (this.value = e),
        this.setShowClear());
    },
    clearTrigger: function () {
      this.setShowClear();
    },
  },
  created: function () {
    (this.value = this.data.value), this.setData({ innerValue: this.value });
  },
  methods: {
    formatValue: function (e) {
      var t = this.data.maxlength;
      return -1 !== t && e.length > t ? e.slice(0, t) : e;
    },
    onInput: function (t) {
      var i = (t.detail || {}).value,
        a = void 0 === i ? "" : i,
        n = this.formatValue(a);
      return (
        (this.value = n),
        this.setShowClear(),
        this.emitChange(e(e({}, t.detail), { value: n }))
      );
    },
    onFocus: function (e) {
      (this.focused = !0), this.setShowClear(), this.$emit("focus", e.detail);
    },
    onBlur: function (e) {
      (this.focused = !1), this.setShowClear(), this.$emit("blur", e.detail);
    },
    onClickIcon: function () {
      this.$emit("click-icon");
    },
    onClickInput: function (e) {
      this.$emit("click-input", e.detail);
    },
    onClear: function () {
      var e = this;
      this.setData({ innerValue: "" }),
        (this.value = ""),
        this.setShowClear(),
        (0, t.nextTick)(function () {
          e.emitChange({ value: "" }), e.$emit("clear", "");
        });
    },
    onConfirm: function (e) {
      var t = (e.detail || {}).value,
        i = void 0 === t ? "" : t;
      (this.value = i), this.setShowClear(), this.$emit("confirm", i);
    },
    setValue: function (e) {
      (this.value = e),
        this.setShowClear(),
        "" === e && this.setData({ innerValue: "" }),
        this.emitChange({ value: e });
    },
    onLineChange: function (e) {
      this.$emit("linechange", e.detail);
    },
    onKeyboardHeightChange: function (e) {
      this.$emit("keyboardheightchange", e.detail);
    },
    onBindNicknameReview: function (e) {
      this.$emit("nicknamereview", e.detail);
    },
    emitChange: function (t) {
      var i,
        a = this.data.extraEventParams;
      this.setData({ value: t.value });
      var n = a
        ? e(e({}, t), {
            callback: function (e) {
              i = e;
            },
          })
        : t.value;
      return this.$emit("input", n), this.$emit("change", n), i;
    },
    setShowClear: function () {
      var e = this.data,
        t = e.clearable,
        i = e.readonly,
        a = e.clearTrigger,
        n = this.focused,
        o = this.value,
        r = !1;
      t && !i && (r = !!o && ("always" === a || ("focus" === a && n)));
      this.setView({ showClear: r });
    },
    noop: function () {},
  },
});
