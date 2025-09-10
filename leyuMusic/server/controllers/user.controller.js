const db = require('../config/db')

// 获取用户基本信息
exports.getUserInfo = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id
    
    // 获取用户基础信息
    const [users] = await db.query(
      `SELECT id, username, nickname, avatar, role, gender, signature 
       FROM users WHERE id = ?`,
      [userId]
    )

    if (users.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在'
      })
    }

    // 获取用户创建的歌单
    const [createdPlaylists] = await db.query(
      `SELECT id, name, cover_image, description, 
       (SELECT COUNT(*) FROM playlist_songs WHERE playlist_id = p.id) as songCount
       FROM playlists p 
       WHERE user_id = ?`,
      [userId]
    )

    // 获取用户收藏的歌单
    const [collectedPlaylists] = await db.query(
      `SELECT p.id, p.name, p.cover_image, p.description,
       (SELECT COUNT(*) FROM playlist_songs WHERE playlist_id = p.id) as songCount
       FROM playlists p
       INNER JOIN user_playlists up ON p.id = up.playlist_id
       WHERE up.user_id = ?`,
      [userId]
    )

    // 获取用户收藏的音乐数量
    const [likedSongs] = await db.query(
      `SELECT COUNT(*) as count FROM user_likes WHERE user_id = ?`,
      [userId]
    )

    res.json({
      code: 200,
      data: {
        ...users[0],
        createdPlaylists,
        collectedPlaylists,
        likedSongsCount: likedSongs[0].count
      }
    })
  } catch (error) {
    console.error('获取用户信息失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取用户信息失败'
    })
  }
}

// 更新用户信息
exports.updateUserInfo = async (req, res) => {
  try {
    const { nickname, gender, signature, avatar } = req.body
    const userId = req.user.id

    // 更新用户信息,包含头像
    await db.query(
      `UPDATE users 
       SET nickname = ?, 
           gender = ?, 
           signature = ?,
           avatar = ?
       WHERE id = ?`,
      [nickname, gender, signature, avatar, userId]
    )

    // 获取更新后的用户信息
    const [users] = await db.query(
      `SELECT id, username, nickname, avatar, role, gender, signature 
       FROM users WHERE id = ?`,
      [userId]
    )

    // 获取用户创建的歌单
    const [createdPlaylists] = await db.query(
      `SELECT id, name, cover_image, description, 
       (SELECT COUNT(*) FROM playlist_songs WHERE playlist_id = p.id) as songCount
       FROM playlists p 
       WHERE user_id = ?`,
      [userId]
    )

    // 获取用户收藏的歌单
    const [collectedPlaylists] = await db.query(
      `SELECT p.id, p.name, p.cover_image, p.description,
       (SELECT COUNT(*) FROM playlist_songs WHERE playlist_id = p.id) as songCount
       FROM playlists p
       INNER JOIN user_playlists up ON p.id = up.playlist_id
       WHERE up.user_id = ?`,
      [userId]
    )

    // 获取用户收藏的音乐数量
    const [likedSongs] = await db.query(
      `SELECT COUNT(*) as count FROM user_likes WHERE user_id = ?`,
      [userId]
    )

    res.json({
      code: 200,
      message: '更新成功',
      data: {
        ...users[0],
        createdPlaylists,
        collectedPlaylists,
        likedSongsCount: likedSongs[0].count
      }
    })
  } catch (error) {
    console.error('更新用户信息失败:', error)
    res.status(500).json({
      code: 500,
      message: '更新用户信息失败'
    })
  }
}

// 收藏/取消收藏歌单
exports.toggleCollectPlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params
    const userId = req.user.id
    const { type } = req.body // collect: 收藏, uncollect: 取消收藏

    if (type === 'collect') {
      await db.query(
        'INSERT INTO user_playlists (user_id, playlist_id) VALUES (?, ?)',
        [userId, playlistId]
      )
    } else {
      await db.query(
        'DELETE FROM user_playlists WHERE user_id = ? AND playlist_id = ?',
        [userId, playlistId]
      )
    }

    res.json({
      code: 200,
      message: type === 'collect' ? '收藏成功' : '取消收藏成功'
    })
  } catch (error) {
    console.error('操作失败:', error)
    res.status(500).json({
      code: 500,
      message: '操作失败'
    })
  }
}

// 获取用户喜欢的歌曲
exports.getLikedSongs = async (req, res) => {
  try {
    const { page = 1, pageSize = 20 } = req.query
    const offset = (page - 1) * pageSize
    const userId = req.user.id

    // 获取总数
    const [countResult] = await db.query(
      'SELECT COUNT(*) as total FROM user_likes WHERE user_id = ?',
      [userId]
    )
    const total = countResult[0].total

    // 获取歌曲列表
    const [songs] = await db.query(
      `SELECT s.*,
       (SELECT COUNT(*) FROM user_likes WHERE song_id = s.id) as like_count,
       TRUE as is_liked
       FROM songs s
       INNER JOIN user_likes ul ON s.id = ul.song_id
       WHERE ul.user_id = ?
       ORDER BY ul.created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, Number(pageSize), offset]
    )

    res.json({
      code: 200,
      data: {
        list: songs,
        total,
        page: Number(page),
        pageSize: Number(pageSize)
      }
    })
  } catch (error) {
    console.error('获取喜欢的歌曲失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取喜欢的歌曲失败'
    })
  }
}

// 批量操作喜欢的歌曲
exports.batchLikeSongs = async (req, res) => {
  try {
    const { songIds, type } = req.body
    const userId = req.user.id

    if (type === 'like') {
      await db.query(
        'INSERT IGNORE INTO user_likes (user_id, song_id) VALUES ?',
        [songIds.map(songId => [userId, songId])]
      )
    } else {
      await db.query(
        'DELETE FROM user_likes WHERE user_id = ? AND song_id IN (?)',
        [userId, songIds]
      )
    }

    res.json({
      code: 200,
      message: type === 'like' ? '添加成功' : '移除成功'
    })
  } catch (error) {
    console.error('操作失败:', error)
    res.status(500).json({
      code: 500,
      message: '操作失败'
    })
  }
}

// 获取用户创建的歌单
exports.getCreatedPlaylists = async (req, res) => {
  try {
    const { page = 1, pageSize = 20 } = req.query
    const offset = (page - 1) * pageSize
    const userId = req.user.id

    // 获取总数
    const [countResult] = await db.query(
      'SELECT COUNT(*) as total FROM playlists WHERE user_id = ?',
      [userId]
    )
    const total = countResult[0].total

    // 获取歌单列表
    const [playlists] = await db.query(
      `SELECT p.*,
       (SELECT COUNT(*) FROM playlist_songs WHERE playlist_id = p.id) as song_count,
       (SELECT COUNT(*) FROM user_playlists WHERE playlist_id = p.id) as collect_count
       FROM playlists p
       WHERE p.user_id = ?
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, Number(pageSize), offset]
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
    console.error('获取创建的歌单失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取创建的歌单失败'
    })
  }
}

// 获取用户收藏的歌单
exports.getCollectedPlaylists = async (req, res) => {
  try {
    const { page = 1, pageSize = 20 } = req.query
    const offset = (page - 1) * pageSize
    const userId = req.user.id

    // 获取总数
    const [countResult] = await db.query(
      'SELECT COUNT(*) as total FROM user_playlists WHERE user_id = ?',
      [userId]
    )
    const total = countResult[0].total

    // 获取歌单列表
    const [playlists] = await db.query(
      `SELECT p.*, u.nickname as creator_name,
       (SELECT COUNT(*) FROM playlist_songs WHERE playlist_id = p.id) as song_count,
       (SELECT COUNT(*) FROM user_playlists WHERE playlist_id = p.id) as collect_count,
       TRUE as is_subscribed
       FROM playlists p
       LEFT JOIN users u ON p.user_id = u.id
       INNER JOIN user_playlists up ON p.id = up.playlist_id
       WHERE up.user_id = ?
       ORDER BY up.created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, Number(pageSize), offset]
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
    console.error('获取收藏的歌单失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取收藏的歌单失败'
    })
  }
}

// 获取播放历史
exports.getPlayHistory = async (req, res) => {
  try {
    const { page = 1, pageSize = 20 } = req.query
    const offset = (page - 1) * pageSize
    const userId = req.user.id

    // 获取总数
    const [countResult] = await db.query(
      'SELECT COUNT(*) as total FROM play_history WHERE user_id = ?',
      [userId]
    )
    const total = countResult[0].total

    // 获取播放历史
    const [history] = await db.query(
      `SELECT s.*,
       ph.played_at,
       EXISTS(SELECT 1 FROM user_likes WHERE user_id = ? AND song_id = s.id) as is_liked
       FROM play_history ph
       INNER JOIN songs s ON ph.song_id = s.id
       WHERE ph.user_id = ?
       ORDER BY ph.played_at DESC
       LIMIT ? OFFSET ?`,
      [userId, userId, Number(pageSize), offset]
    )

    res.json({
      code: 200,
      data: {
        list: history,
        total,
        page: Number(page),
        pageSize: Number(pageSize)
      }
    })
  } catch (error) {
    console.error('获取播放历史失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取播放历史失败'
    })
  }
}

// 清空播放历史
exports.clearPlayHistory = async (req, res) => {
  try {
    const userId = req.user.id

    await db.query(
      'DELETE FROM play_history WHERE user_id = ?',
      [userId]
    )

    res.json({
      code: 200,
      message: '清空成功'
    })
  } catch (error) {
    console.error('清空播放历史失败:', error)
    res.status(500).json({
      code: 500,
      message: '清空播放历史失败'
    })
  }
} 