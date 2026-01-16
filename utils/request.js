var RequestError = require("./RequestError");

var request = {
  get: function(url, data, headers) {
    headers = headers || {};
    return new Promise(function(resolve, reject) {
      wx.getNetworkType({
        success: function(res) {
          if (res.networkType !== "none") {
            wx.request({
              url: url,
              data: data,
              method: "GET",
              header: headers,
              success: function(response) {
                resolve(response.data);
              },
              fail: function(error) {
                reject(error);
              }
            });
          } else {
            reject(new RequestError("网络异常，请稍后重试", -1000));
          }
        }
      });
    });
  }
};

module.exports = request;
module.exports.default = request;
