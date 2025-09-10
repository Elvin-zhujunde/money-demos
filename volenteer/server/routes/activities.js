const express = require('express');
const router = express.Router();
const { pool } = require('../app');
const authMiddleware = require('../middleware/auth');

// 获取活动列表
router.get('/', async (req, res) => {
  try {
    const { name, startTime, endTime } = req.query;
    const connection = await pool.getConnection();
    
    let query = 'SELECT * FROM activities WHERE 1=1';
    const params = [];
    
    // 活动名称模糊查询
    if (name) {
      query += ' AND name LIKE ?';
      params.push(`%${name}%`);
    }
    
    // 时间区间查询 (有交集)
    if (startTime && endTime) {
      query += ' AND NOT (end_time < ? OR start_time > ?)';
      params.push(startTime, endTime);
    }
    
    const [activities] = await connection.execute(query, params);
    connection.release();
    res.json(activities);
  } catch (error) {
    console.error('获取活动列表错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取活动详情
router.get('/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [activities] = await connection.execute(
      'SELECT * FROM activities WHERE id = ?',
      [req.params.id]
    );
    connection.release();
    
    if (activities.length === 0) {
      return res.status(404).json({ message: '活动不存在' });
    }
    
    res.json(activities[0]);
  } catch (error) {
    console.error('获取活动详情错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 以下路由需要认证
router.use(authMiddleware);

// 获取活动报名人员
router.get('/:id/registrations', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [registrations] = await connection.execute(
      `SELECT r.*, u.name, u.phone 
       FROM activity_registrations r
       JOIN users u ON r.user_id = u.id
       WHERE r.activity_id = ?`,
      [req.params.id]
    );
    connection.release();
    res.json(registrations);
  } catch (error) {
    console.error('获取报名人员错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 开始活动（需要管理员权限）
router.put('/:id/start', async (req, res) => {
  if (req.user.role < 1) {
    return res.status(403).json({ message: '无权限执行此操作' });
  }
  try {
    const connection = await pool.getConnection();
    await connection.execute(
      'UPDATE activities SET status = 1 WHERE id = ?',
      [req.params.id]
    );
    connection.release();
    res.json({ message: '活动已开始' });
  } catch (error) {
    console.error('开始活动错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 结束活动（需要管理员权限）
router.put('/:id/end', async (req, res) => {
  if (req.user.role < 1) {
    return res.status(403).json({ message: '无权限执行此操作' });
  }
  try {
    const connection = await pool.getConnection();
    await connection.execute(
      'UPDATE activities SET status = 2 WHERE id = ?',
      [req.params.id]
    );
    connection.release();
    res.json({ message: '活动已结束' });
  } catch (error) {
    console.error('结束活动错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 管理员帮助签到（需要管理员权限）
router.put('/:id/sign/:userId', async (req, res) => {
  if (req.user.role < 1) {
    return res.status(403).json({ message: '无权限执行此操作' });
  }
  try {
    const connection = await pool.getConnection();
    await connection.execute(
      'UPDATE activity_registrations SET sign_status = 1, sign_time = NOW() WHERE activity_id = ? AND user_id = ?',
      [req.params.id, req.params.userId]
    );
    connection.release();
    res.json({ message: '签到成功' });
  } catch (error) {
    console.error('签到错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取活动的志愿者列表
router.get('/:id/volunteers', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [volunteers] = await connection.execute(
      `SELECT u.id, u.name, u.phone, r.sign_status, r.sign_time 
       FROM activity_registrations r
       JOIN users u ON r.user_id = u.id
       WHERE r.activity_id = ?`,
      [req.params.id]
    );
    connection.release();
    res.json(volunteers);
  } catch (error) {
    console.error('获取志愿者列表错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 检查用户是否已报名
router.get('/:id/check-registration', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [registrations] = await connection.execute(
      'SELECT * FROM activity_registrations WHERE activity_id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    connection.release();
    res.json({ registered: registrations.length > 0 });
  } catch (error) {
    console.error('检查报名状态错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 报名活动
router.post('/:id/register', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.execute(
      'INSERT INTO activity_registrations (activity_id, user_id) VALUES (?, ?)',
      [req.params.id, req.user.id]
    );
    connection.release();
    res.json({ message: '报名成功' });
  } catch (error) {
    console.error('报名错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 志愿者签到
router.post('/:id/sign-in', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.execute(
      'UPDATE activity_registrations SET sign_status = 1, sign_time = NOW() WHERE activity_id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    connection.release();
    res.json({ message: '签到成功' });
  } catch (error) {
    console.error('签到错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 删除活动（需要管理员权限）
router.delete('/:id', async (req, res) => {
  if (req.user.role < 1) {
    return res.status(403).json({ message: '无权限执行此操作' });
  }
  try {
    const connection = await pool.getConnection();
    // 先删除活动相关的报名记录
    await connection.execute(
      'DELETE FROM activity_registrations WHERE activity_id = ?',
      [req.params.id]
    );
    // 再删除活动
    await connection.execute(
      'DELETE FROM activities WHERE id = ?',
      [req.params.id]
    );
    connection.release();
    res.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除活动错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 创建活动（需要管理员权限）
router.post('/', async (req, res) => {
  if (req.user.role < 1) {
    return res.status(403).json({ message: '无权限执行此操作' });
  }
  try {
    const { name, description, start_time, end_time, location, creator_id } = req.body;
    const connection = await pool.getConnection();
    
    await connection.execute(
      'INSERT INTO activities (name, description, start_time, end_time, location, creator_id) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, start_time, end_time, location, creator_id]
    );
    
    connection.release();
    res.status(201).json({ message: '创建成功' });
  } catch (error) {
    console.error('创建活动错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 更新活动信息（需要管理员权限）
router.put('/:id', async (req, res) => {
  if (req.user.role < 1) {
    return res.status(403).json({ message: '无权限执行此操作' });
  }
  
  try {
    const { name, description, start_time, end_time, location } = req.body;
    const connection = await pool.getConnection();
    
    // 格式化日期时间字符串
    const formatDateTime = (dateStr) => {
      const date = new Date(dateStr);
      return date.toISOString().slice(0, 19).replace('T', ' ');
    };
    
    await connection.execute(
      'UPDATE activities SET name = ?, description = ?, start_time = ?, end_time = ?, location = ? WHERE id = ?',
      [
        name, 
        description, 
        formatDateTime(start_time), 
        formatDateTime(end_time), 
        location, 
        req.params.id
      ]
    );
    
    connection.release();
    res.json({ message: '更新成功' });
  } catch (error) {
    console.error('更新活动错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router; 