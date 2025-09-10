const db = require('../config/database')
const { decodeUserInfo } = require('../utils/decode-user')
const Token = require('../utils/token')

// 用户注册
exports.register = async (req, res) => {
  try {
    const { username, password, confirmPassword, name, phone, email } = req.body

    // 验证密码一致性
    if (password !== confirmPassword) {
      return res.json({
        code: 400,
        message: '两次输入的密码不一致'
      })
    }

    // 检查用户名是否已存在
    const [users] = await db.query('SELECT id FROM users WHERE username = ?', [username])
    if (users.length > 0) {
      return res.json({
        code: 400,
        message: '用户名已存在'
      })
    }

    // 插入新用户
    const sql = `
      INSERT INTO users (username, password, name, phone, email, role)
      VALUES (?, ?, ?, ?, ?, 2)
    `
    await db.query(sql, [username, password, name, phone, email])

    res.json({
      code: 200,
      message: '注册成功'
    })
  } catch (error) {
    console.error('注册失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
}

// 用户登录
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body

    const sql = `
      SELECT id, username, name, phone, email, avatar, role 
      FROM users 
      WHERE username = ? AND password = ?
    `
    const [users] = await db.query(sql, [username, password])

    if (users.length === 0) {
      return res.json({
        code: 400,
        message: '用户名或密码错误'
      })
    }

    const user = users[0]
    // 生成 token
    const token = Token.generate({
      id: user.id,
      username: user.username,
      role: user.role
    })

    res.json({
      code: 200,
      data: {
        ...user,
        token
      },
      message: '登录成功'
    })
  } catch (error) {
    console.error('登录失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
}

// 成为商家
exports.becomeSeller = async (req, res) => {
  try {
    const userInfo = decodeUserInfo(req)
    const user_id = userInfo.id

    // 更新用户角色为商家
    await db.query(
      'UPDATE users SET role = 1 WHERE id = ?',
      [user_id]
    )

    // 获取更新后的用户信息
    const [users] = await db.query(
      'SELECT id, username, name, phone, email, avatar, role FROM users WHERE id = ?',
      [user_id]
    )

    res.json({
      code: 200,
      data: users[0],
      message: '注册成功'
    })
  } catch (error) {
    console.error('注册商家失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
}

// 更新个人信息
exports.updateProfile = async (req, res) => {
  try {
    const userInfo = decodeUserInfo(req)
    const { name, phone, email, avatar } = req.body

    await db.query(
      `UPDATE users SET 
        name = ?,
        phone = ?,
        email = ?,
        avatar = ?
      WHERE id = ?`,
      [name, phone, email, avatar, userInfo.id]
    )

    // 获取更新后的用户信息
    const [users] = await db.query(
      'SELECT id, username, name, phone, email, avatar, role FROM users WHERE id = ?',
      [userInfo.id]
    )

    res.json({
      code: 200,
      data: users[0],
      message: '更新成功'
    })
  } catch (error) {
    console.error('更新个人信息失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
} 