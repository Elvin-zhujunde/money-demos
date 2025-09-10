const Token = require('../utils/token');
const Response = require('../utils/response');

/**
 * 验证用户是否登录
 */
const checkLogin = (req, res, next) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json(Response.error('请先登录'));
  }

  const userData = Token.verify(token.replace('Bearer ', ''));
  if (!userData) {
    return res.status(401).json(Response.error('登录已过期，请重新登录'));
  }

  // 将用户信息添加到请求对象
  req.user = userData;
  next();
};

/**
 * 验证是否是管理员
 */
const checkAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json(Response.error('请先登录'));
  }
  if (req.user.role !== 1) {
    return res.status(403).json(Response.error('无权限访问'));
  }
  next();
};

module.exports = {
  checkLogin,
  checkAdmin
}; 