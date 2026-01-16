Component({
  properties: { list: { type: Array, value: [] }, selectedId: String },
  data: {},
  methods: {
    onTapCity: function (t) {
      this.triggerEvent("select", t.target.dataset.cityInfo);
    },
  },
});
