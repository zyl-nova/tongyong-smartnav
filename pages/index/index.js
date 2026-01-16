var constants = require("../../config/constants");

Page({
  data: {
    pageHidden: true,
    title: "选择城市",
    hotCitys: [],
    hotCityList: [],
    locationCity: null,
    positionIcon: constants.COS_HOST + "/icon_location.png",
    noResultIcon: constants.COS_HOST + "/no_results.png",
    isNoNetwork: false,
    currentIndex: "A",
    currentActiveLetter: "A",
    allCityList: [],
    cityDataSet: {},
    firstLetterList: [],
    searchKeywords: "",
    searchResultList: [],
    showFirstLetterList: true
  },
  onLoad: function(options) {
    var that = this;
    var key = options.key;
    var referer = options.referer;
    var hotCitys = options.hotCitys;
    
    if (!key || !referer) {
      console.error("请传入key和referer");
      return;
    }
    
    var hotCityArr = hotCitys ? hotCitys.split(",").slice(0, constants.HOT_CITYS_LIMIT) : constants.DEFAULT_HOT_CITYS;
    var sysInfo = wx.getSystemInfoSync();
    
    this.setData({
      pageHidden: false,
      showFirstLetterList: sysInfo.windowHeight > 600,
      hotCitys: hotCityArr
    });
    
    wx.showLoading({ title: "加载中", mask: true });
    
    Promise.all([this._getUserCity(), this._getCityList()]).then(function(results) {
      var cityCode = results[0];
      that._getLocationCity(cityCode);
      that._getFirstLetterPosition();
      wx.hideLoading();
    }).catch(function(err) {
      console.error(err);
      wx.hideLoading();
    });
  },
  onGetTotalBarHeight: function(e) {
    this.setData({ totalBarHeight: e.detail });
  },
  _getUserCity: function() {
    var that = this;
    return new Promise(function(resolve, reject) {
      wx.getLocation({
        type: "gcj02",
        success: function(res) {
          resolve(null);
        },
        fail: function(err) {
          resolve(null);
        }
      });
    });
  },
  _getLocationCity: function(cityCode) {
    if (!cityCode) return;
    var city = null;
    for (var i = 0; i < this.data.allCityList.length; i++) {
      if (this.data.allCityList[i].id === cityCode) {
        city = this.data.allCityList[i];
        break;
      }
    }
    if (city) {
      this.setData({ locationCity: city });
    }
  },
  _getCityList: function() {
    var that = this;
    return new Promise(function(resolve, reject) {
      var mockCities = [
        { id: "110000", name: "北京", pinyin: ["bei", "jing"] },
        { id: "310000", name: "上海", pinyin: ["shang", "hai"] },
        { id: "440100", name: "广州", pinyin: ["guang", "zhou"] },
        { id: "440300", name: "深圳", pinyin: ["shen", "zhen"] },
        { id: "330100", name: "杭州", pinyin: ["hang", "zhou"] },
        { id: "320100", name: "南京", pinyin: ["nan", "jing"] },
        { id: "420100", name: "武汉", pinyin: ["wu", "han"] },
        { id: "510100", name: "成都", pinyin: ["cheng", "du"] },
        { id: "500000", name: "重庆", pinyin: ["chong", "qing"] },
        { id: "610100", name: "西安", pinyin: ["xi", "an"] }
      ];
      that._handleDistrictData([[], mockCities]);
      resolve();
    });
  },
  _handleDistrictData: function(data) {
    var cities = data[1] || [];
    var processed = cities.map(function(city) {
      return {
        id: city.id,
        name: city.name,
        pinyin: city.pinyin,
        fullPinyin: city.pinyin.join("")
      };
    }).sort(function(a, b) {
      if (a.fullPinyin < b.fullPinyin) return -1;
      if (a.fullPinyin > b.fullPinyin) return 1;
      return 0;
    });
    this.setData({ allCityList: processed });
    this._matchHotCity(processed);
    this._getCityDataSet(processed);
  },
  _matchHotCity: function(cities) {
    var hotCityNames = this.data.hotCitys;
    var matched = [];
    hotCityNames.forEach(function(name) {
      for (var i = 0; i < cities.length; i++) {
        if (cities[i].name === name) {
          matched.push(cities[i]);
          break;
        }
      }
    });
    this.setData({ hotCityList: matched });
  },
  _getCityDataSet: function(cities) {
    var dataSet = {};
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (var i = 0; i < alphabet.length; i++) {
      dataSet[alphabet[i]] = [];
    }
    cities.forEach(function(city) {
      var firstLetter = city.pinyin[0].substring(0, 1).toUpperCase();
      if (dataSet[firstLetter]) {
        dataSet[firstLetter].push(city);
      }
    });
    var letterList = [];
    for (var letter in dataSet) {
      if (dataSet[letter].length > 0) {
        letterList.push(letter);
      }
    }
    letterList.sort();
    this.setData({ cityDataSet: dataSet, firstLetterList: letterList });
  },
  onInputChange: function(e) {
    var value = e.detail.value;
    this.setData({ searchKeywords: value });
    this._queryCity(value);
  },
  _queryCity: function(keyword) {
    if (!keyword) {
      this.setData({ searchResultList: [] });
      return;
    }
    var results = this.data.allCityList.filter(function(city) {
      return city.name.indexOf(keyword) === 0 || city.fullPinyin.indexOf(keyword) === 0;
    });
    this.setData({ searchResultList: results });
  },
  onTapIndex: function(e) {
    this.setData({ currentIndex: e.target.dataset.id });
    wx.vibrateShort({ type: "medium" });
  },
  handleMoveOnIndex: function(e) {
    var offsetTop = e.currentTarget.offsetTop;
    var clientY = e.touches[0].clientY;
    var letterList = this.data.firstLetterList;
    var currentIndex = this.data.currentIndex;
    if (clientY > offsetTop) {
      var index = parseInt((clientY - offsetTop) / 22, 10);
      index = Math.min(index, letterList.length - 1);
      var letter = letterList[index];
      if (letter !== currentIndex) {
        this.setData({ currentIndex: letter });
        wx.vibrateShort({ type: "medium" });
      }
    }
  },
  _selectCity: function(city) {
    wx.setStorageSync("selectedCity", city);
    wx.navigateBack({ delta: 1 });
  },
  onTapLocationCity: function() {
    this._selectCity(this.data.locationCity);
  },
  onTapHotCity: function(e) {
    this._selectCity(e.detail);
  },
  onSelectCity: function(e) {
    this._selectCity(e.detail);
  },
  _getFirstLetterPosition: function() {
    var that = this;
    this.firstLetterPosition = {};
    var query = this.createSelectorQuery();
    query.selectAll(".cs-letter-text").boundingClientRect();
    query.exec(function(res) {
      if (res[0]) {
        res[0].forEach(function(item) {
          that.firstLetterPosition[item.id] = item.top;
        });
      }
    });
  },
  handleListScroll: function(e) {
    var offsetTop = e.currentTarget.offsetTop;
    var scrollTop = e.detail.scrollTop;
    var scrollHeight = e.detail.scrollHeight;
    var currentTop = offsetTop + scrollTop + 1;
    var positions = [];
    for (var letter in this.firstLetterPosition) {
      positions.push([letter, this.firstLetterPosition[letter]]);
    }
    positions.push(["", scrollHeight + offsetTop]);
    for (var i = 0; i < positions.length - 1; i++) {
      var current = positions[i];
      var next = positions[i + 1];
      if (currentTop >= current[1] && currentTop < next[1]) {
        if (current[0] !== this.data.currentActiveLetter) {
          this.setData({ currentActiveLetter: current[0] });
        }
        break;
      }
    }
  }
});
