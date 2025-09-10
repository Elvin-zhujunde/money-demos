const jwt = require('jsonwebtoken');

// JWT密钥
const SECRET_KEY = 'your-secret-key-123';

class Token {
  /**
   * 生成token
   * @param {Object} payload - 要加密的数据
   * @returns {string} token字符串
   */
  static generate(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });
  }

  /**
   * 验证token
   * @param {string} token - token字符串
   * @returns {Object|null} 解密后的数据或null
   */
  static verify(token) {
    try {
      return jwt.verify(token, SECRET_KEY);
    } catch (error) {
      return null;
    }
  }
}

module.exports = Token; 