Component({
  properties: {
    list: { type: Array, value: [] },
    activeId: { type: String, value: "" },
    mode: { type: String, value: "page" },
  },
  externalClasses: ["custom-class"],
  data: {},
  methods: {
    onTapHotCity: function (t) {
      var e = t.target.dataset.cityInfo;
      e && this.triggerEvent("select", e);
    },
  },
});
