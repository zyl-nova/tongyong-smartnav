function RequestError(message, status) {
  this.message = message;
  this.status = status;
  this.name = "RequestError";
}

RequestError.prototype = Object.create(Error.prototype);
RequestError.prototype.constructor = RequestError;

module.exports = RequestError;
module.exports.default = RequestError;
