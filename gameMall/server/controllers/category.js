const db = require('../config/database')

// 获取分类列表
exports.getCategories = async (req, res) => {
  try {
    const [categories] = await db.query(
      `SELECT * FROM categories ORDER BY sort ASC, id ASC`
    )
    
    res.json({
      code: 200,
      data: categories,
      message: '获取成功'
    })
  } catch (error) {
    console.error('获取分类列表失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
}

// 创建分类
exports.createCategory = async (req, res) => {
  try {
    const { name, icon, parent_id, level, sort } = req.body
    
    const [result] = await db.query(
      `INSERT INTO categories (name, icon, parent_id, level, sort) 
       VALUES (?, ?, ?, ?, ?)`,
      [name, icon, parent_id, level, sort]
    )

    res.json({
      code: 200,
      data: { id: result.insertId },
      message: '创建成功'
    })
  } catch (error) {
    console.error('创建分类失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
}

// 更新分类
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params
    const { name, icon, sort } = req.body

    await db.query(
      `UPDATE categories SET name = ?, icon = ?, sort = ? WHERE id = ?`,
      [name, icon, sort, id]
    )

    res.json({
      code: 200,
      message: '更新成功'
    })
  } catch (error) {
    console.error('更新分类失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
}

// 删除分类
exports.deleteCategory = async (req, res) => {
  const connection = await db.getConnection()
  
  try {
    await connection.beginTransaction()
    const { id } = req.params

    // 检查是否有子分类
    const [children] = await connection.query(
      'SELECT id FROM categories WHERE parent_id = ?',
      [id]
    )

    if (children.length > 0) {
      return res.json({
        code: 400,
        message: '请先删除子分类'
      })
    }

    // 检查是否有关联商品
    const [products] = await connection.query(
      'SELECT id FROM products WHERE category_id = ?',
      [id]
    )

    if (products.length > 0) {
      return res.json({
        code: 400,
        message: '该分类下有商品，无法删除'
      })
    }

    // 删除分类
    await connection.query('DELETE FROM categories WHERE id = ?', [id])

    await connection.commit()
    
    res.json({
      code: 200,
      message: '删除成功'
    })
  } catch (error) {
    await connection.rollback()
    console.error('删除分类失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  } finally {
    connection.release()
  }
}

// 获取分类下的商品
exports.getCategoryProducts = async (req, res) => {
  try {
    const { id } = req.params
    const { page = 1, pageSize = 20, sortBy = 'default' } = req.query

    // 构建排序条件
    let orderBy = 'created_at DESC'
    switch (sortBy) {
      case 'sales':
        orderBy = 'sales DESC'
        break
      case 'price':
        orderBy = 'price ASC'
        break
    }

    // 获取总数
    const [countResult] = await db.query(
      `SELECT COUNT(*) as total FROM products WHERE category_id = ? OR category_id IN (
        SELECT id FROM categories WHERE parent_id = ?
      )`,
      [id, id]
    )
    const total = countResult[0].total

    // 获取商品列表
    const offset = (parseInt(page) - 1) * parseInt(pageSize)
    const [products] = await db.query(
      `SELECT p.*, u.name as seller_name 
      FROM products p
      LEFT JOIN users u ON p.seller_id = u.id
      WHERE p.category_id = ? OR p.category_id IN (
        SELECT id FROM categories WHERE parent_id = ?
      )
      ORDER BY ${orderBy}
      LIMIT ?, ?`,
      [id, id, offset, parseInt(pageSize)]
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
    console.error('获取分类商品失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
} 