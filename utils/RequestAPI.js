var request = require("./request");
var RequestError = require("./RequestError");

var BASE_URL = "https://apis.map.qq.com/ws";
var GEOCODER_URL = BASE_URL + "/geocoder/v1";
var DISTRICT_URL = BASE_URL + "/district/v1/list";
var IP_URL = BASE_URL + "/location/v1/ip";

function RequestAPI(options) {
  options = options || {};
  this.key = options.key || "";
}

RequestAPI.prototype.setKey = function(key) {
  this.key = key || "";
};

RequestAPI.prototype.getKey = function() {
  return this.key;
};

RequestAPI.prototype.wxPromise = function(method, options) {
  options = options || {};
  return new Promise(function(resolve, reject) {
    options.success = function(res) { resolve(res); };
    options.fail = function(err) { reject(err); };
    wx[method](options);
  });
};

RequestAPI.prototype.getLocation = function() {
  var that = this;
  return new Promise(function(resolve, reject) {
    if (wx.getFuzzyLocation) {
      wx.getFuzzyLocation({
        type: "gcj02",
        success: function(res) { resolve(res); },
        fail: function(err) {
          if (err.errMsg === "getFuzzyLocation:fail auth deny" ||
              err.errMsg === "getFuzzyLocation:fail authorize no response") {
            reject(new RequestError("无法定位，请授权位置服务", -1002));
          } else {
            reject(new RequestError("GPS信号弱，请稍后再试", -1001));
          }
        }
      });
    } else {
      request.get(IP_URL, { key: that.key }).then(function(res) {
        resolve({
          latitude: res.result.location.lat,
          longitude: res.result.location.lng
        });
      }).catch(function(err) {
        reject(err);
      });
    }
  });
};

RequestAPI.prototype.geocoder = function(params) {
  var that = this;
  params = params || {};
  params.key = this.key;
  return request.get(GEOCODER_URL, params);
};

RequestAPI.prototype.getAllDistrict = function() {
  return request.get(DISTRICT_URL, { key: this.key });
};

RequestAPI.prototype.sendPv = function(params) {
  var appId = "";
  try {
    appId = wx.getAccountInfoSync().miniProgram.appId;
  } catch (e) {}
  
  var data = {
    key: this.key,
    appid: "miniprogram_plugin",
    logid: "city_selector",
    miniappid: appId,
    userid: this._getUserId()
  };
  
  for (var key in params) {
    data[key] = params[key];
  }
  
  return request.get("https://pr.map.qq.com/pingd", data);
};

RequestAPI.prototype.checkAuth = function(params) {
  var that = this;
  params = params || {};
  
  var appId = "";
  try {
    appId = wx.getAccountInfoSync().miniProgram.appId;
  } catch (e) {}
  
  var data = {
    key: "LMQBZ-NZX33-XDQ36-YDW6A-QUNVT-Q5FFU",
    pid2: appId,
    key2: this.key,
    output: "json"
  };
  
  for (var key in params) {
    data[key] = params[key];
  }
  
  return request.get("https://apikey.map.qq.com/mkey/index.php/mkey/check", data).then(function(res) {
    if (res.info.error === 0) {
      return true;
    } else {
      console.error(getErrorMessage(res.info.error));
      return false;
    }
  });
};

RequestAPI.prototype._getUserId = function() {
  var userId = wx.getStorageSync("userid");
  if (!userId) {
    var newId = this._getRandom();
    wx.setStorageSync("userid", newId);
    return newId;
  }
  if (userId.split("_")[0] === this._getFullDate()) {
    return userId;
  }
  var newId = this._getRandom();
  wx.setStorageSync("userid", newId);
  return newId;
};

RequestAPI.prototype._getRandom = function() {
  var timestamp = +new Date();
  return this._getFullDate(timestamp) + "_" + timestamp.toString(36) + "_" + Math.floor(Math.random() * 10000);
};

RequestAPI.prototype._getFullDate = function(timestamp) {
  timestamp = timestamp || +new Date();
  var date = new Date(timestamp);
  return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
};

function getErrorMessage(errorCode) {
  var messages = {
    "-101": "IP 被封禁",
    "-102": "HTTP 请求路径错误",
    "-201": "key 参数未传递",
    "-202": "key 格式有误",
    "-203": "cb 格式有误",
    "-204": "channel 取值有误",
    "-301": "无效的 key"
  };
  return messages[errorCode] || "请设置key授权本小程序appId，设置请点击https://lbs.qq.com/console/mykey.html";
}

var requestAPI = new RequestAPI();

module.exports = {
  default: RequestAPI,
  requestAPI: requestAPI
};
