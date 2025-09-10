const db = require('../config/database')
const { decodeUserInfo } = require('../utils/decode-user')

// 获取购物车列表
exports.getCartItems = async (req, res) => {
  try {
    const { userId } = req.params
    const userInfo = decodeUserInfo(req)
    const sql = `
      SELECT c.id, c.quantity, p.*, u.name as seller_name
      FROM cart c
      LEFT JOIN products p ON c.product_id = p.id
      LEFT JOIN users u ON p.seller_id = u.id
      WHERE c.user_id = ?
    `
    const [items] = await db.query(sql, [userId])
    
    res.json({
      code: 200,
      data: items,
      message: '获取成功'
    })
  } catch (error) {
    console.error('获取购物车失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
}

// 更新购物车商品数量
exports.updateQuantity = async (req, res) => {
  try {
    const { id, quantity } = req.body
    await db.query(
      'UPDATE cart SET quantity = ? WHERE id = ?',
      [quantity, id]
    )
    
    res.json({
      code: 200,
      message: '更新成功'
    })
  } catch (error) {
    console.error('更新购物车失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
}

// 删除购物车商品
exports.removeItem = async (req, res) => {
  try {
    const { id } = req.params
    await db.query('DELETE FROM cart WHERE id = ?', [id])
    
    res.json({
      code: 200,
      message: '删除成功'
    })
  } catch (error) {
    console.error('删除购物车商品失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
}

// 添加批量删除方法
exports.batchRemove = async (req, res) => {
  try {
    const { ids } = req.body
    if (!ids || !ids.length) {
      return res.json({
        code: 400,
        message: '请选择要删除的商品'
      })
    }

    const sql = 'DELETE FROM cart WHERE id IN (?)'
    await db.query(sql, [ids])
    
    res.json({
      code: 200,
      message: '删除成功'
    })
  } catch (error) {
    console.error('批量删除购物车商品失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
}

// 添加到购物车
exports.addToCart = async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body
    
    // 检查商品是否存在
    const [products] = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [product_id]
    )

    if (products.length === 0) {
      return res.json({
        code: 400,
        message: '商品不存在'
      })
    }

    // 检查是否已在购物车中
    const [existItems] = await db.query(
      'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
      [user_id, product_id]
    )

    if (existItems.length > 0) {
      // 已存在则更新数量
      await db.query(
        'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
        [quantity, user_id, product_id]
      )
    } else {
      // 不存在则新增
      await db.query(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [user_id, product_id, quantity]
      )
    }

    res.json({
      code: 200,
      message: '添加成功'
    })
  } catch (error) {
    console.error('添加到购物车失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
} 