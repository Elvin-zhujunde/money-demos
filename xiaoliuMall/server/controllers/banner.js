const db = require('../config/database')

// 获取轮播图列表
exports.getBanners = async (req, res) => {
  try {
    const sql = `
      SELECT * FROM banners 
      WHERE status = 1 
      ORDER BY sort_order ASC
    `
    const [banners] = await db.query(sql)
    
    res.json({
      code: 200,
      data: banners,
      message: '获取成功'
    })
  } catch (error) {
    console.error('获取轮播图失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
}

// 创建轮播图
exports.createBanner = async (req, res) => {
  try {
    const { title, image_url, link_url, sort_order } = req.body
    
    const sql = `
      INSERT INTO banners (title, image_url, link_url, sort_order)
      VALUES (?, ?, ?, ?)
    `
    await db.query(sql, [title, image_url, link_url, sort_order])
    
    res.json({
      code: 200,
      message: '创建成功'
    })
  } catch (error) {
    console.error('创建轮播图失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
}

// 更新轮播图
exports.updateBanner = async (req, res) => {
  try {
    const { id } = req.params
    const { title, image_url, link_url, sort_order, status } = req.body
    
    const sql = `
      UPDATE banners 
      SET title = ?, image_url = ?, link_url = ?, sort_order = ?, status = ?
      WHERE id = ?
    `
    await db.query(sql, [title, image_url, link_url, sort_order, status, id])
    
    res.json({
      code: 200,
      message: '更新成功'
    })
  } catch (error) {
    console.error('更新轮播图失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
}

// 删除轮播图
exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params
    
    const sql = `DELETE FROM banners WHERE id = ?`
    await db.query(sql, [id])
    
    res.json({
      code: 200,
      message: '删除成功'
    })
  } catch (error) {
    console.error('删除轮播图失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
} 