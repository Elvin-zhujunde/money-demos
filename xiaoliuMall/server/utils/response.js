class Response {
  static success(data = null, message = 'success') {
    return {
      code: 0,
      data,
      message
    };
  }

  static error(message = 'error', code = 500) {
    return {
      code,
      message
    };
  }
}

module.exports = Response; 