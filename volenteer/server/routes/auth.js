const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { pool } = require('../app');

// 注册接口
router.post('/register', async (req, res) => {
  try {
    const { name, age, idCard, password, phone, email, address, role } = req.body;
    
    const connection = await pool.getConnection();
    
    // 检查手机号和邮箱是否已存在
    const [existingUsers] = await connection.execute(
      'SELECT * FROM users WHERE phone = ? OR email = ? OR id_card = ?',
      [phone, email, idCard]
    );
    
    if (existingUsers.length > 0) {
      connection.release();
      return res.status(400).json({ message: '手机号、邮箱或身份证号已被注册' });
    }
    
    // 插入新用户
    const [result] = await connection.execute(
      'INSERT INTO users (name, age, id_card, password, phone, email, address, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, age, idCard, password, phone, email, address, role]
    );
    
    connection.release();
    res.status(201).json({ message: '注册成功' });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 登录接口
router.post('/login', async (req, res) => {
  try {
    const { account, password } = req.body;
    
    const connection = await pool.getConnection();
    
    // 通过手机号或邮箱查询用户
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE (phone = ? OR email = ?) AND password = ?',
      [account, account, password]
    );
    
    connection.release();
    
    if (users.length === 0) {
      return res.status(401).json({ message: '账号或密码错误' });
    }
    
    const user = users[0];
    
    // 生成 JWT token
    const token = jwt.sign(
      { 
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
        phone: user.phone
      },
      'your-secret-key',
      { expiresIn: '24h' }
    );
    
    // 返回用户信息（不包含密码）和token
    const { password: _, ...userInfo } = user;
    res.json({
      message: '登录成功',
      token,
      user: userInfo
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router; 