const db = require('../config/database')
const { decodeUserInfo } = require('../utils/decode-user')

// 创建订单
exports.createOrder = async (req, res) => {
  try {
    const { address_id, items, payment_method, remark } = req.body
    const userInfo = decodeUserInfo(req)
    const user_id = userInfo.id

    if (!user_id) {
      return res.json({
        code: 401,
        message: '请先登录'
      })
    }

    // 获取地址信息
    const [addresses] = await db.query(
      'SELECT * FROM shipping_addresses WHERE id = ? AND user_id = ?',
      [address_id, user_id]
    )

    if (addresses.length === 0) {
      return res.json({
        code: 400,
        message: '收货地址不存在'
      })
    }

    const address = addresses[0]
    const order_no = `${Date.now()}${Math.floor(Math.random() * 1000)}`
    const total_amount = items.reduce((total, item) => total + item.price * item.quantity, 0)

    const connection = await db.getConnection()
    await connection.beginTransaction()

    try {
      // 创建订单，同时保存地址信息
      const [result] = await connection.query(
        `INSERT INTO orders (
          order_no, user_id, total_amount, status, 
          address_id, province, city, district, detail_address,
          receiver, receiver_phone, payment_method, remark
        ) VALUES (?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          order_no, user_id, total_amount,
          address_id, address.province, address.city, address.district, address.detail_address,
          address.receiver, address.phone, payment_method, remark
        ]
      )

      const order_id = result.insertId

      // 创建订单项
      for (const item of items) {
        await connection.query(
          `INSERT INTO order_items (
            order_id, product_id, product_title, 
            product_cover, product_price, quantity
          ) VALUES (?, ?, ?, ?, ?, ?)`,
          [order_id, item.id, item.title, item.cover, item.price, item.quantity]
        )

        // 更新商品库存和销量
        await connection.query(
          `UPDATE products 
          SET stock = stock - ?, sales = sales + ?
          WHERE id = ? AND stock >= ?`,
          [item.quantity, item.quantity, item.id, item.quantity]
        )
      }

      // 清空已结算的购物车商品
      const productIds = items.map(item => item.id)
      if (productIds.length > 0) {
        productIds.forEach(async (productId) => {
          await connection.query(
            'DELETE FROM cart WHERE product_id = ? AND user_id = ?',
            [productId, user_id]
          )
        })
      }

      await connection.commit()

      res.json({
        code: 200,
        data: { order_no },
        message: '创建成功'
      })
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('创建订单失败:', error)
    res.status(500).json({
      code: 500,
      message: error.code === 'ER_BAD_FIELD_ERROR' ? '数据库字段错误' : '服务器错误'
    })
  }
}

// 支付订单
exports.payOrder = async (req, res) => {
  try {
    const { order_no } = req.params

    await db.query(
      `UPDATE orders SET status = 1, paid_time = NOW() 
      WHERE order_no = ? AND status = 0`,
      [order_no]
    )

    res.json({
      code: 200,
      message: '支付成功'
    })
  } catch (error) {
    console.error('支付订单失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
}

// 获取订单详情
exports.getOrderDetail = async (req, res) => {
  try {
    const { orderNo } = req.params
    const userInfo = decodeUserInfo(req)
    console.log('获取订单详情 - 参数:', { orderNo, userInfo })

    // 获取订单基本信息
    const [orders] = await db.query(
      `SELECT * FROM orders WHERE order_no = ? AND user_id = ?`,
      [orderNo, userInfo.id]
    )
    console.log('查询结果:', orders)

    if (orders.length === 0) {
      return res.json({
        code: 404,
        message: '订单不存在'
      })
    }

    const order = orders[0]

    // 获取订单商品
    const [items] = await db.query(
      `SELECT * FROM order_items WHERE order_id = ?`,
      [order.id]
    )

    order.items = items

    res.json({
      code: 200,
      data: order,
      message: '获取成功'
    })
  } catch (error) {
    console.error('获取订单详情失败:', error)
    console.error('错误堆栈:', error.stack)
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
    const userInfo = decodeUserInfo(req)
    const user_id = userInfo.id

    await db.query(
      `UPDATE orders SET status = 4 
      WHERE order_no = ? AND user_id = ? AND status = 0`,
      [orderNo, user_id]
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

// 获取用户订单列表
exports.getMyOrders = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, status } = req.query
    const userInfo = decodeUserInfo(req)
    
    // 构建查询条件
    let whereClause = 'WHERE user_id = ?'
    const queryParams = [userInfo.id]
    
    // 如果传入了状态参数且不是 -1(全部),则添加状态筛选
    if (status !== undefined && status !== '-1') {
      whereClause += ' AND status = ?'
      queryParams.push(status)
    }

    // 获取总数
    const [countResult] = await db.query(
      `SELECT COUNT(*) as total FROM orders ${whereClause}`,
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
    console.error('错误详情:', error.stack)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
}

// 获取订单统计
exports.getOrderStats = async (req, res) => {
  try {
    const userInfo = decodeUserInfo(req)
    const user_id = userInfo.id

    const [result] = await db.query(
      `SELECT 
        SUM(status = 0) as unpaid,
        SUM(status = 1) as unshipped,
        SUM(status = 2) as shipped,
        SUM(status = 3) as completed
      FROM orders 
      WHERE user_id = ?`,
      [user_id]
    )

    res.json({
      code: 200,
      data: result[0],
      message: '获取成功'
    })
  } catch (error) {
    console.error('获取订单统计失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
}

// 搜索订单
exports.searchOrders = async (req, res) => {
  try {
    const { keyword } = req.query
    if (!keyword) {
      return res.json({
        code: 200,
        data: [],
        message: '获取成功'
      })
    }

    const userInfo = decodeUserInfo(req)
    const user_id = userInfo.id

    if (!user_id) {
      return res.json({
        code: 200,
        data: [],
        message: '获取成功'
      })
    }

    // 修改 SQL 查询，确保获取完整的订单信息
    const [orders] = await db.query(
      `SELECT DISTINCT 
        o.*,
        GROUP_CONCAT(
          JSON_OBJECT(
            'id', oi.id,
            'product_title', oi.product_title,
            'product_cover', oi.product_cover,
            'product_price', oi.product_price,
            'quantity', oi.quantity
          )
        ) as items_json
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ? AND (
        o.order_no LIKE ? OR
        oi.product_title LIKE ?
      )
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT 10`,
      [user_id, `%${keyword}%`, `%${keyword}%`]
    )

    // 处理订单项数据
    const processedOrders = orders.map(order => ({
      ...order,
      items: JSON.parse(`[${order.items_json}]`.replace(/\\/g, ''))
    }))

    console.log('搜索订单结果:', {
      keyword,
      userId: user_id,
      count: processedOrders.length,
      orders: processedOrders
    })

    res.json({
      code: 200,
      data: processedOrders,
      message: '获取成功'
    })
  } catch (error) {
    console.error('搜索订单失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
}

// 确认收货
exports.confirmReceive = async (req, res) => {
  try {
    const { orderNo } = req.params
    const userInfo = decodeUserInfo(req)

    // 只更新订单状态为已完成，不需要记录收货时间
    await db.query(
      `UPDATE orders SET status = 3 
       WHERE order_no = ? AND user_id = ? AND status = 2`,
      [orderNo, userInfo.id]
    )

    res.json({
      code: 200,
      message: '确认收货成功'
    })
  } catch (error) {
    console.error('确认收货失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
} 