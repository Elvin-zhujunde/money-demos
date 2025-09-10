const express = require('express');
const router = express.Router();
const { pool } = require('../app');
const authMiddleware = require('../middleware/auth');

// 使用认证中间件
router.use(authMiddleware);

// 获取用户列表（根据当前用户角色过滤）
router.get('/', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const currentUserRole = req.user.role; // 假设通过中间件设置了req.user
    
    let query = 'SELECT id, name, age, id_card, phone, email, address, role FROM users';
    if (currentUserRole === 1) {
      // 管理员只能看到志愿者
      query += ' WHERE role = 0';
    } else if (currentUserRole === 2) {
      // 超级管理员可以看到管理员和志愿者
      query += ' WHERE role < 2';
    }
    
    const [users] = await connection.execute(query);
    connection.release();
    res.json(users);
  } catch (error) {
    console.error('获取用户列表错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取当前用户信息
router.get('/current', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [users] = await connection.execute(
      'SELECT id, name, age, id_card, phone, email, address, role FROM users WHERE id = ?',
      [req.user.id]
    );
    connection.release();
    
    if (users.length === 0) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    res.json(users[0]);
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 更新当前用户信息
router.put('/current', async (req, res) => {
  try {
    const { name, age, address } = req.body;
    const connection = await pool.getConnection();
    
    // 志愿者只能更新基本信息
    await connection.execute(
      'UPDATE users SET name = ?, age = ?, address = ? WHERE id = ?',
      [name, age, address, req.user.id]
    );
    
    connection.release();
    
    // 返回更新后的用户信息
    const [users] = await connection.execute(
      'SELECT id, name, age, id_card, phone, email, address, role FROM users WHERE id = ?',
      [req.user.id]
    );
    
    res.json({
      message: '更新成功',
      user: users[0]
    });
  } catch (error) {
    console.error('更新用户信息错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 更新用户信息 (管理员功能)
router.put('/:id', async (req, res) => {
  try {
    const { name, age, id_card, newPassword, address } = req.body;
    const userId = req.params.id;
    const connection = await pool.getConnection();
    
    // 检查被修改用户的信息
    const [targetUser] = await connection.execute(
      'SELECT role FROM users WHERE id = ?',
      [userId]
    );
    
    if (targetUser.length === 0) {
      connection.release();
      return res.status(404).json({ message: '用户不存在' });
    }
    
    // 管理员修改用户信息时也不能修改联系方式和邮箱
    let query = 'UPDATE users SET name = ?, age = ?, id_card = ?, address = ?';
    let params = [name, age, id_card, address];
    
    if (newPassword) {
      query += ', password = ?';
      params.push(newPassword);
    }
    
    query += ' WHERE id = ?';
    params.push(userId);
    
    await connection.execute(query, params);
    connection.release();
    res.json({ message: '更新成功' });
  } catch (error) {
    console.error('更新用户信息错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 删除用户 (管理员功能)
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const connection = await pool.getConnection();
    
    // 检查当前用户权限和目标用户角色
    const [targetUser] = await connection.execute(
      'SELECT role FROM users WHERE id = ?',
      [userId]
    );
    
    if (targetUser.length === 0) {
      connection.release();
      return res.status(404).json({ message: '用户不存在' });
    }
    
    // 只允许删除志愿者
    if (targetUser[0].role !== 0) {
      connection.release();
      return res.status(403).json({ message: '无权删除非志愿者用户' });
    }
    
    // 先删除用户的活动报名记录
    await connection.execute(
      'DELETE FROM activity_registrations WHERE user_id = ?',
      [userId]
    );
    
    // 删除用户
    await connection.execute(
      'DELETE FROM users WHERE id = ?',
      [userId]
    );
    
    connection.release();
    res.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除用户错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router; 