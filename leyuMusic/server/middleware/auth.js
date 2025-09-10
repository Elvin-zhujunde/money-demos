const jwt = require('jsonwebtoken')

const JWT_SECRET = 'your-jwt-secret-key'  // 使用相同的密钥

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({
        code: 401,
        message: '未登录'
      })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({
      code: 401,
      message: '登录已过期'
    })
  }
} 