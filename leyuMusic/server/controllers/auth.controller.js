const jwt = require('jsonwebtoken')
const db = require('../config/db')

const JWT_SECRET = 'your-jwt-secret-key'

exports.register = async (req, res) => {
  try {
    const { username, password, nickname } = req.body

    // 检查用户名是否已存在
    const [users] = await db.query('SELECT id FROM users WHERE username = ?', [username])
    if (users.length > 0) {
      return res.status(400).json({
        code: 400,
        message: '用户名已存在'
      })
    }

    // 创建用户(使用明文密码)
    const [result] = await db.query(
      'INSERT INTO users (username, password, nickname) VALUES (?, ?, ?)',
      [username, password, nickname || username]
    )

    res.json({
      code: 200,
      message: '注册成功',
      data: {
        id: result.insertId,
        username,
        nickname: nickname || username
      }
    })
  } catch (error) {
    console.error('注册失败:', error)
    res.status(500).json({
      code: 500,
      message: '注册失败'
    })
  }
}

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body

    const [users] = await db.query(
      'SELECT id, username, nickname, avatar, role FROM users WHERE username = ? AND password = ?',
      [username, password]
    )

    if (users.length === 0) {
      return res.status(401).json({
        code: 401,
        message: '用户名或密码错误'
      })
    }

    const user = users[0]
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      code: 200,
      message: '登录成功',
      data: {
        token,
        userInfo: {
          id: user.id,
          username: user.username,
          nickname: user.nickname,
          avatar: user.avatar,
          role: user.role
        }
      }
    })
  } catch (error) {
    console.error('登录失败:', error)
    res.status(500).json({
      code: 500,
      message: '登录失败'
    })
  }
} 