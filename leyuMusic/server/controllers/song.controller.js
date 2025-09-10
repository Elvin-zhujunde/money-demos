const db = require('../config/db')

// 搜索歌曲
exports.searchSongs = async (req, res) => {
  try {
    const { keyword } = req.query
    
    if (!keyword) {
      return res.json({
        code: 200,
        data: []
      })
    }

    const [songs] = await db.query(
      `SELECT s.id, s.title, s.cover_image, s.file_url, s.singer_name
       FROM songs s
       WHERE s.title LIKE ? AND s.status = 1
       LIMIT 10`,
      [`%${keyword}%`]
    )

    res.json({
      code: 200,
      data: songs
    })
  } catch (error) {
    console.error('搜索歌曲失败:', error)
    res.status(500).json({
      code: 500,
      message: '搜索失败'
    })
  }
}

// 获取歌曲详情
exports.getSongDetail = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user?.id

    // 1. 先检查歌曲是否存在，同时获取喜欢数量
    const [songs] = await db.query(
      `SELECT s.*,
       (SELECT COUNT(*) FROM user_likes WHERE song_id = s.id) as like_count,
       EXISTS(SELECT 1 FROM user_likes WHERE user_id = ? AND song_id = s.id) as is_liked
       FROM songs s
       WHERE s.id = ?`,
      [userId || 0, id]
    )

    if (songs.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '歌曲不存在'
      })
    }

    const song = songs[0]

    // 4. 更新播放次数
    await db.query(
      'UPDATE songs SET play_count = play_count + 1 WHERE id = ?',
      [id]
    )

    res.json({
      code: 200,
      data: song
    })
  } catch (error) {
    console.error('获取歌曲详情失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取歌曲详情失败'
    })
  }
}

// 收藏/取消收藏歌曲
exports.toggleLikeSong = async (req, res) => {
  try {
    const { id } = req.params
    const { type } = req.body // type: 'like' | 'unlike'
    const userId = req.user.id

    // 先检查歌曲是否存在
    const [songs] = await db.query(
      'SELECT id FROM songs WHERE id = ?',
      [id]
    )

    if (songs.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '歌曲不存在'
      })
    }

    if (type === 'like') {
      await db.query(
        'INSERT IGNORE INTO user_likes (user_id, song_id) VALUES (?, ?)',
        [userId, id]
      )
      res.json({
        code: 200,
        message: '已添加到我喜欢的音乐'
      })
    } else if (type === 'unlike') {
      await db.query(
        'DELETE FROM user_likes WHERE user_id = ? AND song_id = ?',
        [userId, id]
      )
      res.json({
        code: 200,
        message: '已取消喜欢'
      })
    } else {
      res.status(400).json({
        code: 400,
        message: '无效的操作类型'
      })
    }
  } catch (error) {
    console.error('歌曲喜欢操作失败:', error)
    res.status(500).json({
      code: 500,
      message: '操作失败'
    })
  }
}

// 获取个性化推荐
exports.getPersonalRecommends = async (req, res) => {
  try {
    // 随机获取5个歌单
    const [playlists] = await db.query(
      `SELECT 
        p.*,
        u.nickname as creator_name,
        u.avatar as creator_avatar,
        (SELECT COUNT(*) FROM playlist_songs WHERE playlist_id = p.id) as song_count,
        (SELECT COUNT(*) FROM user_playlists WHERE playlist_id = p.id) as collect_count
       FROM playlists p
       LEFT JOIN users u ON p.user_id = u.id
       WHERE p.status = 1
       ORDER BY RAND()
       LIMIT 5`
    )
    
    res.json({
      code: 200,
      data: playlists
    })
  } catch (error) {
    console.error('获取推荐失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取推荐失败'
    })
  }
}

// 获取热门歌曲
exports.getHotSongs = async (req, res) => {
  try {
    
    const userId = req.user?.id || 0;

    const [songs] = await db.query(
      `SELECT s.*,
       s.play_count,
       (SELECT COUNT(*) FROM user_likes WHERE song_id = s.id) as like_count,
       EXISTS(SELECT 1 FROM user_likes WHERE user_id = ? AND song_id = s.id) as is_liked
       FROM songs s
       LEFT JOIN user_likes ul ON s.id = ul.song_id AND ul.user_id = ?
       WHERE s.status = 1
       GROUP BY s.id
       ORDER BY s.play_count DESC, like_count DESC
       LIMIT 30`,
      [userId, userId]
    );
    
    res.json({
      code: 200,
      data: songs
    });
  } catch (error) {
    console.error('获取热门歌曲失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取热门歌曲失败'
    });
  }
};

// 获取新歌
exports.getNewSongs = async (req, res) => {
  try {
    const userId = req.user?.id || 0;

    const [songs] = await db.query(
      `SELECT s.*,
       (SELECT COUNT(*) FROM user_likes WHERE song_id = s.id) as like_count,
       EXISTS(SELECT 1 FROM user_likes WHERE user_id = ? AND song_id = s.id) as is_liked
       FROM songs s
       LEFT JOIN user_likes ul ON s.id = ul.song_id AND ul.user_id = ?
       WHERE s.status = 1
       GROUP BY s.id
       ORDER BY s.created_at DESC 
       LIMIT 50`,
      [userId, userId]
    );

    res.json({
      code: 200,
      data: songs
    });
  } catch (error) {
    console.error('获取新歌失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取新歌失败'
    });
  }
};

// 检查是否喜欢歌曲
exports.checkLikeStatus = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const [likes] = await db.query(
      'SELECT 1 FROM user_likes WHERE user_id = ? AND song_id = ?',
      [userId, id]
    )

    res.json({
      code: 200,
      data: {
        is_liked: likes.length > 0
      }
    })
  } catch (error) {
    console.error('检查喜欢状态失败:', error)
    res.status(500).json({
      code: 500,
      message: '操作失败'
    })
  }
}

// 获取随机歌曲
exports.getRandomSong = async (req, res) => {
  try {
    const [songs] = await db.query(
      `SELECT * FROM songs 
       WHERE status = 1 
       ORDER BY RAND() 
       LIMIT 1`
    )

    if (songs.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '没有找到歌曲'
      })
    }

    res.json({
      code: 200,
      data: songs[0]
    })
  } catch (error) {
    console.error('获取随机歌曲失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取随机歌曲失败'
    })
  }
}

// 更新播放次数
exports.updatePlayCount = async (req, res) => {
  try {
    const { id } = req.params

    await db.query(
      'UPDATE songs SET play_count = play_count + 1 WHERE id = ?',
      [id]
    )

    res.json({
      code: 200,
      message: '更新成功'
    })
  } catch (error) {
    console.error('更新播放次数失败:', error)
    res.status(500).json({
      code: 500,
      message: '更新失败'
    })
  }
}

// 获取新歌排行榜
exports.getNewSongRank = async (req, res) => {
  try {
    const [songs] = await db.query(
      `SELECT s.*, 
       (SELECT COUNT(*) FROM user_likes WHERE song_id = s.id) as like_count
       FROM songs s 
       WHERE s.status = 1
       ORDER BY s.created_at DESC 
       LIMIT 10`
    );

    res.json({
      code: 200,
      data: songs
    });
  } catch (error) {
    console.error('获取新歌排行榜失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取新歌排行榜失败'
    });
  }
};

// 获取热门排行榜
exports.getHotSongRank = async (req, res) => {
  try {
    const [songs] = await db.query(
      `SELECT s.*, 
       (SELECT COUNT(*) FROM user_likes WHERE song_id = s.id) as like_count,
       (SELECT COUNT(*) FROM comments WHERE song_id = s.id) as comment_count,
       ((SELECT COUNT(*) FROM user_likes WHERE song_id = s.id) + 
        (SELECT COUNT(*) FROM comments WHERE song_id = s.id)) as hot_score
       FROM songs s 
       WHERE s.status = 1
       ORDER BY hot_score DESC
       LIMIT 10`
    );

    res.json({
      code: 200,
      data: songs
    });
  } catch (error) {
    console.error('获取热门排行榜失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取热门排行榜失败'
    });
  }
}; 