const db = require('../config/database')
const { decodeUserInfo } = require('../utils/decode-user')

// 获取热门商品
exports.getHotProducts = async (req, res) => {
    try {
        const sql = `
      SELECT * FROM products 
      WHERE status = 1 
      ORDER BY sales DESC 
      LIMIT 8
    `
        const [products] = await db.query(sql)

        res.json({
            code: 200,
            data: products,
            message: '获取成功'
        })
    } catch (error) {
        console.error('获取热门商品失败:', error)
        res.status(500).json({
            code: 500,
            message: '服务器错误'
        })
    }
}

// 获取商品详情
exports.getProductDetail = async (req, res) => {
    try {
        const { id } = req.params
        const sql = `
      SELECT p.*, u.name as seller_name, c.name as category_name
      FROM products p
      LEFT JOIN users u ON p.seller_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ? AND p.status = 1
    `
        const [products] = await db.query(sql, [id])

        if (products.length === 0) {
            return res.json({
                code: 404,
                message: '商品不存在'
            })
        }

        res.json({
            code: 200,
            data: products[0],
            message: '获取成功'
        })
    } catch (error) {
        console.error('获取商品详情失败:', error)
        res.status(500).json({
            code: 500,
            message: '服务器错误'
        })
    }
}

// 加入购物车
exports.addToCart = async (req, res) => {
    try {
        const { user_id, product_id, quantity = 1 } = req.body

        // 检查商品是否存在且有库存
        const [products] = await db.query(
            'SELECT stock FROM products WHERE id = ? AND status = 1',
            [product_id]
        )

        if (products.length === 0) {
            return res.json({
                code: 400,
                message: '商品不存在或已下架'
            })
        }

        if (products[0].stock < quantity) {
            return res.json({
                code: 400,
                message: '商品库存不足'
            })
        }

        // 检查购物车是否已有该商品
        const [cartItems] = await db.query(
            'SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?',
            [user_id, product_id]
        )

        if (cartItems.length > 0) {
            // 更新数量
            await db.query(
                'UPDATE cart SET quantity = quantity + ? WHERE id = ?',
                [quantity, cartItems[0].id]
            )
        } else {
            // 新增购物车项
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
        console.error('加入购物车失败:', error)
        res.status(500).json({
            code: 500,
            message: '服务器错误'
        })
    }
}

// 搜索商品
exports.searchProducts = async (req, res) => {
  try {
    const { keyword } = req.query

    console.log('搜索商品请求:', keyword)
    if (!keyword) {
      return res.json({
        code: 200,
        data: [],
        message: '获取成功'
      })
    }

    const [products] = await db.query(
      `SELECT p.*, u.name as seller_name 
      FROM products p
      LEFT JOIN users u ON p.seller_id = u.id
      WHERE p.title LIKE ? AND p.status = 1
      LIMIT 10`,
      [`%${keyword}%`]
    )

    console.log('搜索商品结果:', {
      keyword,
      count: products.length,
      products
    })

    res.json({
      code: 200,
      data: products,
      message: '获取成功'
    })
  } catch (error) {
    console.error('搜索商品失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
}

// 搜索商家商品
exports.searchSellerProducts = async (req, res) => {
  try {
    const { keyword } = req.query
    
    const [products] = await db.query(
      `SELECT p.*, u.name as seller_name 
       FROM products p
       LEFT JOIN users u ON p.seller_id = u.id
       WHERE p.title LIKE ?
       ORDER BY p.created_at DESC`,
      [`%${keyword}%`]
    )

    res.json({
      code: 200,
      data: products,
      message: '获取成功'
    })
  } catch (error) {
    console.error('搜索商品失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
} 