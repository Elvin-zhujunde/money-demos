const db = require('../config/database')

// 获取用户列表
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query
    
    // 获取总数
    const [countResult] = await db.query('SELECT COUNT(*) as total FROM users')
    const total = countResult[0].total

    // 获取用户列表
    const offset = (parseInt(page) - 1) * parseInt(pageSize)
    const [users] = await db.query(
      `SELECT id, username, name, phone, email, avatar, role, created_at 
       FROM users 
       ORDER BY created_at DESC
       LIMIT ?, ?`,
      [offset, parseInt(pageSize)]
    )

    res.json({
      code: 200,
      data: {
        list: users,
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      },
      message: '获取成功'
    })
  } catch (error) {
    console.error('获取用户列表失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
}

// 更新用户信息
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { name, phone, email, role } = req.body

    await db.query(
      `UPDATE users SET 
        name = ?,
        phone = ?,
        email = ?,
        role = ?
       WHERE id = ?`,
      [name, phone, email, role, id]
    )

    res.json({
      code: 200,
      message: '更新成功'
    })
  } catch (error) {
    console.error('更新用户失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
}

// 删除用户
// 删除用户
exports.deleteUser = async (req, res) => {
    const connection = await db.getConnection()
    
    try {
      await connection.beginTransaction()
      const { id } = req.params
  
      // 1. 删除用户的购物车记录
      await connection.query('DELETE FROM cart WHERE user_id = ?', [id])
  
      // 2. 删除订单项
      await connection.query(
        `DELETE oi FROM order_items oi 
         INNER JOIN orders o ON oi.order_id = o.id 
         WHERE o.user_id = ?`,
        [id]
      )
  
      // 3. 删除订单
      await connection.query('DELETE FROM orders WHERE user_id = ?', [id])
  
      // 4. 删除用户的地址记录
      await connection.query('DELETE FROM shipping_addresses WHERE user_id = ?', [id])
  
      // 5. 删除用户
      await connection.query('DELETE FROM users WHERE id = ?', [id])
  
      await connection.commit()
      
      res.json({
        code: 200,
        message: '删除成功'
      })
    } catch (error) {
      await connection.rollback()
      console.error('删除用户失败:', error)
      res.status(500).json({
        code: 500,
        message: '服务器错误'
      })
    } finally {
      connection.release()
    }
  }