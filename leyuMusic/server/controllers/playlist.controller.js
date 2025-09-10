const db = require('../config/db')

// 获取歌单列表（支持搜索和分页）
exports.getPlaylists = async (req, res) => {
  try {
    const { keyword = '', page = 1, pageSize = 12 } = req.query
    const offset = (page - 1) * pageSize
    
    // 构建查询条件
    let whereClause = 'WHERE 1=1'
    const params = []
    
    if (keyword) {
      whereClause += ' AND p.name LIKE ?'
      params.push(`%${keyword}%`)
    }
    
    // 获取总数
    const [countResult] = await db.query(
      `SELECT COUNT(*) as total 
       FROM playlists p 
       ${whereClause}`,
      params
    )
    const total = countResult[0].total
    
    // 获取歌单列表
    const [playlists] = await db.query(
      `SELECT 
        p.*,
        u.nickname as creator_name,
        u.avatar as creator_avatar,
        (SELECT COUNT(*) FROM playlist_songs WHERE playlist_id = p.id) as song_count,
        (SELECT COUNT(*) FROM user_playlists WHERE playlist_id = p.id) as collect_count,
        EXISTS(SELECT 1 FROM user_playlists WHERE user_id = ? AND playlist_id = p.id) as is_subscribed
       FROM playlists p
       LEFT JOIN users u ON p.user_id = u.id
       ${whereClause}
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [req.user?.id || 0, ...params, Number(pageSize), offset]
    )

    res.json({
      code: 200,
      data: {
        list: playlists,
        total,
        page: Number(page),
        pageSize: Number(pageSize)
      }
    })
  } catch (error) {
    console.error('获取歌单列表失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取歌单列表失败'
    })
  }
}

// 获取歌单详情
exports.getPlaylistDetail = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user?.id || 0

    // 获取歌单基本信息
    const [playlists] = await db.query(
      `SELECT p.*, u.nickname as creator_name, u.avatar as creator_avatar,
       EXISTS(SELECT 1 FROM user_playlists WHERE user_id = ? AND playlist_id = p.id) as is_subscribed
       FROM playlists p
       LEFT JOIN users u ON p.user_id = u.id
       WHERE p.id = ?`,
      [userId, id]
    )

    if (playlists.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '歌单不存在'
      })
    }

    const playlist = playlists[0]

    // 获取歌单中的歌曲（只获取状态为1的歌曲）
    const [songs] = await db.query(
      `SELECT s.*,
       EXISTS(SELECT 1 FROM user_likes WHERE user_id = ? AND song_id = s.id) as is_liked
       FROM songs s
       INNER JOIN playlist_songs ps ON s.id = ps.song_id
       WHERE ps.playlist_id = ? AND s.status = 1
       ORDER BY ps.created_at DESC`,
      [userId, id]
    )

    playlist.songs = songs

    res.json({
      code: 200,
      data: playlist
    })
  } catch (error) {
    console.error('获取歌单详情失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取歌单详情失败'
    })
  }
}

// 创建歌单
exports.createPlaylist = async (req, res) => {
  try {
    const { name, description = '' } = req.body
    const userId = req.user.id

    const [result] = await db.query(
      'INSERT INTO playlists (name, description, user_id) VALUES (?, ?, ?)',
      [name, description, userId]
    )

    res.json({
      code: 200,
      message: '创建功',
      data: {
        id: result.insertId
      }
    })
  } catch (error) {
    console.error('创建歌单失败:', error)
    res.status(500).json({
      code: 500,
      message: '创建歌单失败'
    })
  }
}

// 收藏/取消收藏歌单
exports.toggleCollectPlaylist = async (req, res) => {
  try {
    const { id } = req.params
    const { type } = req.body // type: 'subscribe' | 'unsubscribe'
    const userId = req.user.id

    // 先检查歌单是否存在
    const [playlists] = await db.query(
      'SELECT id FROM playlists WHERE id = ?',
      [id]
    )

    if (playlists.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '歌单不存在'
      })
    }

    if (type === 'subscribe') {
      await db.query(
        'INSERT IGNORE INTO user_playlists (user_id, playlist_id) VALUES (?, ?)',
        [userId, id]
      )
      res.json({
        code: 200,
        message: '收藏成功'
      })
    } else if (type === 'unsubscribe') {
      await db.query(
        'DELETE FROM user_playlists WHERE user_id = ? AND playlist_id = ?',
        [userId, id]
      )
      res.json({
        code: 200,
        message: '取消收藏成功'
      })
    } else {
      res.status(400).json({
        code: 400,
        message: '无效的操作类型'
      })
    }
  } catch (error) {
    console.error('收藏歌单操作失败:', error)
    res.status(500).json({
      code: 500,
      message: '操作失败'
    })
  }
}

// 向歌单添加/删除歌曲
exports.addOrRemoveSong = async (req, res) => {
  try {
    const { id } = req.params
    const { songId, type } = req.body
    const userId = req.user.id

    if (type === 'add') {
      await db.query(
        'INSERT INTO playlist_songs (playlist_id, song_id) VALUES (?, ?)',
        [id, songId]
      )
    } else {
      await db.query(
        'DELETE FROM playlist_songs WHERE playlist_id = ? AND song_id = ?',
        [id, songId]
      )
    }

    res.json({
      code: 200,
      message: type === 'add' ? '歌曲添加成功' : '歌曲删除成功'
    })
  } catch (error) {
    console.error('操作失败:', error)
    res.status(500).json({
      code: 500,
      message: '操作失败'
    })
  }
}

// 更新歌单
exports.updatePlaylist = async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, cover_image } = req.body
    const userId = req.user.id

    // 检查是否是歌单创建者
    const [playlists] = await db.query(
      'SELECT user_id FROM playlists WHERE id = ?',
      [id]
    )

    if (playlists.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '歌单不存在'
      })
    }

    if (playlists[0].user_id !== userId) {
      return res.status(403).json({
        code: 403,
        message: '无权修改该歌单'
      })
    }
    console.log(cover_image);
    
    await db.query(
      'UPDATE playlists SET name = ?, description = ?, cover_image = ? WHERE id = ?',
      [name, description, cover_image, id]
    )

    res.json({
      code: 200,
      message: '更新成功'
    })
  } catch (error) {
    console.error('更新歌单失败:', error)
    res.status(500).json({
      code: 500,
      message: '更新歌单失败'
    })
  }
}

// 删除歌单
exports.deletePlaylist = async (req, res) => {
  // 获取数据库连接
  const connection = await db.getConnection();
  
  try {
    const { id } = req.params
    const userId = req.user.id

    // 开启事务
    await connection.beginTransaction();

    // 检查是否是歌单创建者
    const [playlists] = await connection.query(
      'SELECT user_id FROM playlists WHERE id = ?',
      [id]
    )

    if (playlists.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '歌单不存在'
      })
    }

    if (playlists[0].user_id !== userId) {
      return res.status(403).json({
        code: 403,
        message: '无权删除该歌单'
      })
    }

    // 1. 先删除歌单中的歌曲关联
    await connection.query(
      'DELETE FROM playlist_songs WHERE playlist_id = ?',
      [id]
    )

    // 2. 删除其他用户对这个歌单的收藏
    await connection.query(
      'DELETE FROM user_playlists WHERE playlist_id = ?',
      [id]
    )

    // 3. 最后删除歌单本身
    await connection.query(
      'DELETE FROM playlists WHERE id = ?',
      [id]
    )

    // 提交事务
    await connection.commit();

    res.json({
      code: 200,
      message: '删除成功'
    })
  } catch (error) {
    // 如果出错，回滚事务
    await connection.rollback();
    
    console.error('删除歌单失败:', error)
    res.status(500).json({
      code: 500,
      message: '删除失败'
    })
  } finally {
    // 释放连接
    connection.release();
  }
}

// 检查是否收藏歌单
exports.checkSubscribeStatus = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const [subscribed] = await db.query(
      'SELECT 1 FROM user_playlists WHERE user_id = ? AND playlist_id = ?',
      [userId, id]
    )

    res.json({
      code: 200,
      data: {
        is_subscribed: subscribed.length > 0
      }
    })
  } catch (error) {
    console.error('检查收藏状态失败:', error)
    res.status(500).json({
      code: 500,
      message: '操作失败'
    })
  }
}

// 向歌单添加歌曲
exports.addSongToPlaylist = async (req, res) => {
  try {
    const { id: playlistId } = req.params
    const { songId } = req.body
    const userId = req.user.id

    // 1. 检查歌单是否存在且属于当前用户
    const [playlists] = await db.query(
      'SELECT id FROM playlists WHERE id = ? AND user_id = ?',
      [playlistId, userId]
    )

    if (playlists.length === 0) {
      return res.status(403).json({
        code: 403,
        message: '无权操作此歌单'
      })
    }

    // 2. 检查歌曲是否已在歌单中
    const [exists] = await db.query(
      'SELECT 1 FROM playlist_songs WHERE playlist_id = ? AND song_id = ?',
      [playlistId, songId]
    )

    if (exists.length > 0) {
      return res.status(400).json({
        code: 400,
        message: '歌曲已在歌单中'
      })
    }

    // 3. 添加歌曲到歌单
    await db.query(
      'INSERT INTO playlist_songs (playlist_id, song_id) VALUES (?, ?)',
      [playlistId, songId]
    )

    res.json({
      code: 200,
      message: '添加成功'
    })
  } catch (error) {
    console.error('添加歌曲到歌单失败:', error)
    res.status(500).json({
      code: 500,
      message: '添加失败'
    })
  }
}

// 获取用户创建的歌单列表(简化版,用于选择)
exports.getUserPlaylists = async (req, res) => {
  try {
    const userId = req.user.id

    const [playlists] = await db.query(
      `SELECT id, name, cover_image 
       FROM playlists 
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    )

    res.json({
      code: 200,
      data: playlists
    })
  } catch (error) {
    console.error('获取歌单列表失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取歌单列表失败'
    })
  }
} 