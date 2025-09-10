const db = require('../config/db')

// 获取歌曲评论列表
exports.getSongComments = async (req, res) => {
  try {
    const { songId } = req.params
    const { page = 1, pageSize = 20 } = req.query
    const offset = (page - 1) * pageSize

    // 获取评论总数
    const [countResult] = await db.query(
      'SELECT COUNT(*) as total FROM comments WHERE song_id = ?',
      [songId]
    )
    const total = countResult[0].total

    // 获取评论列表
    const [comments] = await db.query(
      `SELECT 
        c.id, c.content, c.created_at, c.user_id,
        u.nickname as user_nickname, u.avatar as user_avatar
       FROM comments c
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.song_id = ?
       ORDER BY c.created_at DESC
       LIMIT ? OFFSET ?`,
      [songId, parseInt(pageSize), offset]
    )

    res.json({
      code: 200,
      data: {
        list: comments,
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      }
    })
  } catch (error) {
    console.error('获取评论列表失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取评论列表失败'
    })
  }
}

// 发表评论
exports.addComment = async (req, res) => {
  try {
    const { songId } = req.params
    const { content } = req.body
    const userId = req.user.id

    const [result] = await db.query(
      'INSERT INTO comments (user_id, song_id, content) VALUES (?, ?, ?)',
      [userId, songId, content]
    )

    // 返回新创建的评论信息
    const [newComment] = await db.query(
      `SELECT 
        c.id, c.content, c.created_at, c.user_id,
        u.nickname as user_nickname, u.avatar as user_avatar
       FROM comments c
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [result.insertId]
    )

    res.json({
      code: 200,
      message: '评论成功',
      data: newComment[0]
    })
  } catch (error) {
    console.error('发表评论失败:', error)
    res.status(500).json({
      code: 500,
      message: '发表评论失败'
    })
  }
}

// 删除评论
exports.deleteComment = async (req, res) => {
  try {
    const { songId, commentId } = req.params
    const userId = req.user.id

    // 检查是否是评论作者或管理员
    const [comments] = await db.query(
      'SELECT user_id FROM comments WHERE id = ? AND song_id = ?',
      [commentId, songId]
    )

    if (comments.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '评论不存在'
      })
    }

    const comment = comments[0]
    const isAdmin = req.user.role === 'admin'

    if (comment.user_id !== userId && !isAdmin) {
      return res.status(403).json({
        code: 403,
        message: '无权删除该评论'
      })
    }

    await db.query('DELETE FROM comments WHERE id = ?', [commentId])

    res.json({
      code: 200,
      message: '删除成功'
    })
  } catch (error) {
    console.error('删除评论失败:', error)
    res.status(500).json({
      code: 500,
      message: '删除评论失败'
    })
  }
}

// 点赞/取消点赞评论
exports.toggleCommentLike = async (req, res) => {
  try {
    const { id } = req.params
    const { type } = req.body
    const userId = req.user.id

    if (type === 'like') {
      await db.query(
        'INSERT IGNORE INTO comment_likes (user_id, comment_id) VALUES (?, ?)',
        [userId, id]
      )
    } else {
      await db.query(
        'DELETE FROM comment_likes WHERE user_id = ? AND comment_id = ?',
        [userId, id]
      )
    }

    res.json({
      code: 200,
      message: type === 'like' ? '点赞成功' : '取消点赞成功'
    })
  } catch (error) {
    console.error('操作失败:', error)
    res.status(500).json({
      code: 500,
      message: '操作失败'
    })
  }
}