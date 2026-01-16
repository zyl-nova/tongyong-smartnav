var constants = require("../../config/constants");
var cityInfo = require("../../utils/cityInfo");

var allCitysCache = [];

Component({
  properties: {
    key: String,
    referer: String,
    hotCitys: String,
    show: { type: Boolean, value: false }
  },
  data: {
    contentHidden: true,
    isLoading: false,
    isNoNetwork: false,
    selectedProvince: null,
    selectedCity: null,
    isProvinceMode: true,
    isCityMode: false,
    provinceList: [],
    currentCityList: [],
    topPosition: 0,
    hotCityList: []
  },
  observers: {
    show: function(val) {
      if (val) this._sendPv();
    },
    key: function(val) {
      this._init(val);
    },
    hotCitys: function(val) {
      if (!this._isNonEmptyString(val)) {
        console.warn("传入的hotCitys参数有误");
      }
      if (allCitysCache.length) {
        this._matchHotCitys();
      } else {
        this._getDistrictList();
      }
    },
    selectedProvince: function(val) {
      if (val) {
        this.setData({ currentCityList: val.citys, topPosition: 0 });
      }
    }
  },
  lifetimes: {
    attached: function() {},
    detached: function() {}
  },
  methods: {
    close: function() {
      this.setData({ show: false });
      this.triggerEvent("close");
    },
    emptyFunc: function() {},
    _init: function(key) {
      var that = this;
      if (!this._validateKeyAndReferer()) return;
      this.setData({ contentHidden: false, isLoading: true });
      this._getDistrictList().then(function() {
        that.setData({ isLoading: false });
      }).catch(function(err) {
        that._resetData();
        console.error(err);
        that.setData({ isLoading: false });
      });
    },
    _getDistrictList: function() {
      var that = this;
      return new Promise(function(resolve, reject) {
        var mockProvinces = [
          { id: "110000", name: "北京市", citys: [] },
          { id: "310000", name: "上海市", citys: [] },
          { id: "330000", name: "浙江省", citys: [
            { id: "330100", name: "杭州市" },
            { id: "330200", name: "宁波市" },
            { id: "330300", name: "温州市" }
          ]},
          { id: "320000", name: "江苏省", citys: [
            { id: "320100", name: "南京市" },
            { id: "320200", name: "无锡市" },
            { id: "320500", name: "苏州市" }
          ]},
          { id: "440000", name: "广东省", citys: [
            { id: "440100", name: "广州市" },
            { id: "440300", name: "深圳市" },
            { id: "440600", name: "佛山市" }
          ]}
        ];
        that.setData({ provinceList: mockProvinces });
        that._matchHotCitys();
        resolve();
      });
    },
    _getAllCitys: function(data) {
      var provinces = data[0] || [];
      var cities = data[1] || [];
      var specialIds = constants.SPECIAL_CITYS || [];
      var specialCities = provinces.filter(function(p) {
        return specialIds.indexOf(p.id) !== -1;
      });
      var specialPrefixes = specialIds.map(function(id) {
        return id.substring(0, 2);
      });
      var normalCities = cities.filter(function(c) {
        return specialPrefixes.indexOf(c.id.substring(0, 2)) === -1;
      });
      allCitysCache = specialCities.concat(normalCities);
    },
    _matchHotCitys: function(data) {
      var hotCitysStr = this.data.hotCitys;
      var hotCityNames = (hotCitysStr && typeof hotCitysStr === "string") 
        ? hotCitysStr.split(",").slice(0, constants.HOT_CITYS_LIMIT || 6) 
        : (constants.DEFAULT_HOT_CITYS || []);
      
      if (data && !allCitysCache.length) {
        this._getAllCitys(data);
      }
      
      var matched = [];
      hotCityNames.forEach(function(name) {
        for (var i = 0; i < allCitysCache.length; i++) {
          if (allCitysCache[i].name === name) {
            matched.push(allCitysCache[i]);
            break;
          }
        }
      });
      this.setData({ hotCityList: matched });
    },
    _resetData: function() {
      allCitysCache = [];
      this.setData({
        isLoading: false,
        selectedProvince: null,
        selectedCity: null,
        isProvinceMode: true,
        isCityMode: false,
        provinceList: [],
        currentCityList: [],
        hotCityList: []
      });
    },
    onSelect: function(e) {
      var isProvinceMode = this.data.isProvinceMode;
      var isCityMode = this.data.isCityMode;
      var specialCitys = constants.SPECIAL_CITYS || [];
      
      if (isProvinceMode && !isCityMode) {
        var province = e.detail;
        if (specialCitys.indexOf(province.id) !== -1) {
          this.setData({ selectedCity: province });
          this._handleSelectCity();
        } else {
          this.setData({
            isProvinceMode: false,
            isCityMode: true,
            selectedProvince: province
          });
        }
      }
      if (isCityMode) {
        this.setData({ selectedCity: e.detail });
        this._handleSelectCity();
      }
    },
    onBack: function() {
      this.setData({
        isCityMode: false,
        isProvinceMode: true,
        selectedCity: null,
        currentCityList: [],
        selectedProvince: null
      });
    },
    onSelectHotCity: function(e) {
      var city = e.detail;
      if (city) {
        this.setData({ selectedCity: city });
        this._handleSelectCity();
      }
    },
    _handleSelectCity: function() {
      var selectedProvince = this.data.selectedProvince;
      var selectedCity = this.data.selectedCity;
      var provinceList = this.data.provinceList;
      
      if (selectedCity) {
        var province = selectedProvince;
        if (!province) {
          var cityPrefix = selectedCity.id.substring(0, 2);
          for (var i = 0; i < provinceList.length; i++) {
            if (provinceList[i].id.substring(0, 2) === cityPrefix) {
              province = provinceList[i];
              break;
            }
          }
        }
        this.triggerEvent("select", {
          province: cityInfo.extractCityInfo ? cityInfo.extractCityInfo(province) : province,
          city: cityInfo.extractCityInfo ? cityInfo.extractCityInfo(selectedCity) : selectedCity
        });
      }
      this.close();
    },
    _sendPv: function() {
      if (this._validateKeyAndReferer()) {
        console.log("Send PV:", this.data.referer);
      }
    },
    _validateKeyAndReferer: function() {
      var key = this.data.key;
      var referer = this.data.referer;
      var validKey = this._isNonEmptyString(key);
      var validReferer = this._isNonEmptyString(referer);
      if (!validKey) console.error("请传入正确的key");
      if (!validReferer) console.error("请传入正确的referer");
      return validKey && validReferer;
    },
    _isNonEmptyString: function(str) {
      return str && typeof str === "string";
    }
  }
});
