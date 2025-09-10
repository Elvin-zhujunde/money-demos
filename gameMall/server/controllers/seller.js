const db = require('../config/database')
const { decodeUserInfo } = require('../utils/decode-user')

// 获取商家商品列表
exports.getProducts = async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query
    
    // 获取总数
    const [countResult] = await db.query('SELECT COUNT(*) as total FROM products')
    const total = countResult[0].total

    // 获取商品列表 - 移除seller_id过滤
    const offset = (parseInt(page) - 1) * parseInt(pageSize)
    const [products] = await db.query(
      `SELECT p.*, u.name as seller_name 
      FROM products p
      LEFT JOIN users u ON p.seller_id = u.id
      ORDER BY p.created_at DESC
      LIMIT ?, ?`,
      [offset, parseInt(pageSize)]
    )

    res.json({
      code: 200,
      data: {
        list: products,
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      },
      message: '获取成功'
    })
  } catch (error) {
    console.error('获取商品列表失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
}

// 创建商品
exports.createProduct = async (req, res) => {
  try {
    const userInfo = decodeUserInfo(req)
    const seller_id = userInfo.id
    
    // 从请求体中解构需要的字段
    const { 
      title, 
      category_id, 
      cover, 
      price, 
      original_price, 
      stock, 
      description,
      shipping_from
    } = req.body

    // 构造商品数据，只包含需要的字段
    const product = {
      title,
      category_id,
      cover,
      price,
      original_price,
      stock,
      description,
      shipping_from,
      seller_id,
      status: 1 // 默认上架
    }

    const [result] = await db.query(
      `INSERT INTO products SET ?`,
      [product]
    )

    res.json({
      code: 200,
      data: { id: result.insertId },
      message: '创建成功'
    })
  } catch (error) {
    console.error('创建商品失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
}

// 更新商品
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params
    // 移除seller_id验证
    await db.query(
      `UPDATE products SET ? WHERE id = ?`,
      [req.body, id]
    )

    res.json({
      code: 200,
      message: '更新成功'
    })
  } catch (error) {
    console.error('更新商品失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
}

// 删除商品
exports.deleteProduct = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    const { id } = req.params;

    // 1. 删除购物车中的相关记录
    await connection.query(
      'DELETE FROM cart WHERE product_id = ?',
      [id]
    );

    // 2. 删除订单项中的记录 (不删除订单本身)
    await connection.query(
      'DELETE FROM order_items WHERE product_id = ?',
      [id]
    );

    // 3. 删除商品
    await connection.query(
      'DELETE FROM products WHERE id = ?',
      [id]
    );

    await connection.commit();
    
    res.json({
      code: 200,
      message: '删除成功'
    });

  } catch (error) {
    await connection.rollback();
    console.error('删除商品失败:', error);
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    });
  } finally {
    connection.release();
  }
};

// 更新商品状态
exports.updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const userInfo = decodeUserInfo(req)
    const seller_id = userInfo.id

    await db.query(
      'UPDATE products SET status = ? WHERE id = ? AND seller_id = ?',
      [status, id, seller_id]
    )

    res.json({
      code: 200,
      message: '更新成功'
    })
  } catch (error) {
    console.error('更新商品状态失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
}

// 获取商家订单列表
exports.getOrders = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, status, keyword } = req.query
    const userInfo = decodeUserInfo(req)

    // 构建查询条件
    let whereClause = 'WHERE 1=1'
    const queryParams = []

    // 添加状态筛选
    if (status !== undefined && status !== '') {
      whereClause += ' AND status = ?'
      queryParams.push(status)
    }

    // 添加关键词搜索
    if (keyword) {
      whereClause += ` AND (
        o.order_no LIKE ? OR 
        oi.product_title LIKE ?
      )`
      queryParams.push(`%${keyword}%`, `%${keyword}%`)
    }

    // 获取总数
    const [countResult] = await db.query(
      `SELECT COUNT(DISTINCT o.id) as total 
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      ${whereClause}`,
      queryParams
    )

    const total = countResult[0].total
    const offset = (parseInt(page) - 1) * parseInt(pageSize)
    const limit = parseInt(pageSize)

    // 获取订单列表
    const [orders] = await db.query(
      `SELECT o.*, 
        GROUP_CONCAT(JSON_OBJECT(
          'id', oi.id,
          'product_title', oi.product_title,
          'product_cover', oi.product_cover,
          'quantity', oi.quantity
        )) as items_json
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       ${whereClause}
       GROUP BY o.id
       ORDER BY o.created_at DESC
       LIMIT ?, ?`,
      [...queryParams, offset, limit]
    )

    // 处理订单项数据
    const processedOrders = orders.map(order => ({
      ...order,
      items: order.items_json ? JSON.parse(`[${order.items_json}]`) : []
    }))

    res.json({
      code: 200,
      data: {
        list: processedOrders,
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      },
      message: '获取成功'
    })
  } catch (error) {
    console.error('获取订单列表失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
}

// 发货
exports.shipOrder = async (req, res) => {
  try {
    const { orderNo } = req.params

    // 验证订单状态 - 移除商家验证
    const [orders] = await db.query(
      `SELECT * FROM orders WHERE order_no = ? AND status = 1`,
      [orderNo]
    )

    if (orders.length === 0) {
      return res.json({
        code: 400,
        message: '订单不存在或状态不正确'
      })
    }

    await db.query(
      'UPDATE orders SET status = 2 WHERE order_no = ?',
      [orderNo]
    )

    res.json({
      code: 200,
      message: '发货成功'
    })
  } catch (error) {
    console.error('发货失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
}

// 取消订单
exports.cancelOrder = async (req, res) => {
  try {
    const { orderNo } = req.params

    // 验证订单状态 - 移除商家验证
    const [orders] = await db.query(
      `SELECT * FROM orders WHERE order_no = ? AND status = 0`,
      [orderNo]
    )

    if (orders.length === 0) {
      return res.json({
        code: 400,
        message: '订单不存在或状态���正确'
      })
    }

    await db.query(
      'UPDATE orders SET status = 4 WHERE order_no = ?',
      [orderNo]
    )

    res.json({
      code: 200,
      message: '取消成功'
    })
  } catch (error) {
    console.error('取消订单失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
} 