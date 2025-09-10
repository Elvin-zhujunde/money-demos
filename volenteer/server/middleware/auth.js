const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: '未登录' });
  }

  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    req.user = decoded; // 将解码后的用户信息添加到请求对象中
    next();
  } catch (error) {
    return res.status(401).json({ message: '登录已过期' });
  }
};

module.exports = authMiddleware; 