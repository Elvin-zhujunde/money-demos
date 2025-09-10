const db = require('../config/db')
const path = require('path')
const fs = require('fs')

// 上传文件处理
const handleFileUpload = (file, folder) => {
  const extname = path.extname(file.originalname)
  const filename = Date.now() + extname
  const uploadPath = path.join(__dirname, `../uploads/${folder}`, filename)
  
  return new Promise((resolve, reject) => {
    fs.writeFile(uploadPath, file.buffer, (err) => {
      if (err) reject(err)
      resolve(`http://localhost:3000/uploads/${folder}/${filename}`)
    })
  })
}

// 歌曲管理接口
exports.getSongList = async (req, res) => {
  try {
    const { keyword = '', page = 1, pageSize = 10 } = req.query
    const offset = (page - 1) * pageSize

    // 构建查询条件
    let whereClause = 'WHERE 1=1'
    const params = []
    
    if (keyword) {
      whereClause += ' AND s.title LIKE ?'
      params.push(`%${keyword}%`)
    }

    // 获取总数
    const [countResult] = await db.query(
      `SELECT COUNT(*) as total 
       FROM songs s 
       ${whereClause}`,
      params
    )
    const total = countResult[0].total

    // 获取歌曲列表 - 确保返回所有需要的字段
    const [songs] = await db.query(
      `SELECT 
        s.id,
        s.title,
        s.singer_name,
        s.cover_image,
        s.file_url,
        s.status,
        s.play_count,
        s.created_at,
        s.updated_at
       FROM songs s
       ${whereClause}
       ORDER BY s.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(pageSize), offset]
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
    console.error('获取歌曲列表失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取歌曲列表失败'
    })
  }
}

// 上传歌曲文件
exports.uploadSongFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        code: 400,
        message: '请选择文件'
      })
    }

    const fileUrl = await handleFileUpload(req.file, 'audio')
    res.json({
      code: 200,
      data: {
        url: fileUrl
      }
    })
  } catch (error) {
    console.error('上传歌曲文件失败:', error)
    res.status(500).json({
      code: 500,
      message: '上传失败'
    })
  }
}

// 上传歌曲封面
exports.uploadSongCover = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        code: 400,
        message: '请选择文件'
      })
    }

    const fileUrl = await handleFileUpload(req.file, 'img')
    res.json({
      code: 200,
      data: {
        url: fileUrl
      }
    })
  } catch (error) {
    console.error('上传封面失败:', error)
    res.status(500).json({
      code: 500,
      message: '上传失败'
    })
  }
}

// 创建歌曲
exports.createSong = async (req, res) => {
  try {
    const { title, singer_name, cover_image, file_url } = req.body

    const [result] = await db.query(
      'INSERT INTO songs (title, singer_name, cover_image, file_url, status) VALUES (?, ?, ?, ?, 1)',
      [title, singer_name, cover_image, file_url]
    )

    res.json({
      code: 200,
      message: '创建成功',
      data: {
        id: result.insertId
      }
    })
  } catch (error) {
    console.error('创建歌曲失败:', error)
    res.status(500).json({
      code: 500,
      message: '创建失败'
    })
  }
}

// 更新歌曲
exports.updateSong = async (req, res) => {
  try {
    const { id } = req.params
    const { title, singer_name, cover_image, file_url } = req.body

    await db.query(
      'UPDATE songs SET title = ?, singer_name = ?, cover_image = ?, file_url = ? WHERE id = ?',
      [title, singer_name, cover_image, file_url, id]
    )

    res.json({
      code: 200,
      message: '更新成功'
    })
  } catch (error) {
    console.error('更新歌曲失败:', error)
    res.status(500).json({
      code: 500,
      message: '更新失败'
    })
  }
}

// 删除歌曲(软删除)
exports.deleteSong = async (req, res) => {
  try {
    const { id } = req.params

    await db.query(
      'UPDATE songs SET status = 0 WHERE id = ?',
      [id]
    )

    res.json({
      code: 200,
      message: '删除成功'
    })
  } catch (error) {
    console.error('删除歌曲失败:', error)
    res.status(500).json({
      code: 500,
      message: '删除失败'
    })
  }
}

// 获取音频文件列表
exports.getAudioFiles = async (req, res) => {
  try {
    const audioDir = path.join(__dirname, '../uploads/audio')
    const files = fs.readdirSync(audioDir)
    
    const audioFiles = files
      .filter(file => file.endsWith('.mp3')) // 只返回mp3文件
      .map(file => ({
        name: file,
        url: `http://localhost:3000/uploads/audio/${file}`
      }))

    res.json({
      code: 200,
      data: audioFiles
    })
  } catch (error) {
    console.error('获取音频文件列表失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取音频文件列表失败'
    })
  }
}

// 获取用户列表
exports.getUserList = async (req, res) => {
  try {
    const { keyword = '', page = 1, pageSize = 10 } = req.query
    const offset = (page - 1) * pageSize

    // 构建查询条件
    let whereClause = 'WHERE 1=1'
    const params = []
    
    if (keyword) {
      whereClause += ' AND (username LIKE ? OR nickname LIKE ?)'
      params.push(`%${keyword}%`, `%${keyword}%`)
    }

    // 获取总数
    const [countResult] = await db.query(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      params
    )
    const total = countResult[0].total

    // 获取用户列表
    const [users] = await db.query(
      `SELECT 
        id, username, nickname, avatar, gender, role, signature, created_at, updated_at
       FROM users
       ${whereClause}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(pageSize), offset]
    )

    res.json({
      code: 200,
      data: {
        list: users,
        total,
        page: Number(page),
        pageSize: Number(pageSize)
      }
    })
  } catch (error) {
    console.error('获取用户列表失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取用户列表失败'
    })
  }
}

// 创建用户
exports.createUser = async (req, res) => {
  try {
    const { username, password, nickname, gender, role, avatar, signature } = req.body

    // 检查用户名是否已存在
    const [existUser] = await db.query(
      'SELECT id FROM users WHERE username = ?',
      [username]
    )
    if (existUser.length > 0) {
      return res.status(400).json({
        code: 400,
        message: '用户名已存在'
      })
    }

    // 创建用户
    const [result] = await db.query(
      `INSERT INTO users 
       (username, password, nickname, gender, role, avatar, signature) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [username, password, nickname, gender, role, avatar, signature]
    )

    res.json({
      code: 200,
      message: '创建成功',
      data: {
        id: result.insertId
      }
    })
  } catch (error) {
    console.error('创建用户失败:', error)
    res.status(500).json({
      code: 500,
      message: '创建失败'
    })
  }
}

// 更新用户
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { nickname, gender, role, avatar, signature } = req.body

    await db.query(
      `UPDATE users 
       SET nickname = ?, gender = ?, role = ?, avatar = ?, signature = ?
       WHERE id = ?`,
      [nickname, gender, role, avatar, signature, id]
    )

    res.json({
      code: 200,
      message: '更新成功'
    })
  } catch (error) {
    console.error('更新用户失败:', error)
    res.status(500).json({
      code: 500,
      message: '更新失败'
    })
  }
}

// 删除用户
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params

    // 开启事务
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // 1. 删除用户的收藏记录
      await connection.query('DELETE FROM user_likes WHERE user_id = ?', [id]);
      
      // 2. 删除用户的播放历史
      await connection.query('DELETE FROM play_history WHERE user_id = ?', [id]);
      
      // 3. 获取用户创建的歌单ID
      const [playlists] = await connection.query(
        'SELECT id FROM playlists WHERE user_id = ?',
        [id]
      );
      
      if (playlists.length > 0) {
        const playlistIds = playlists.map(p => p.id);
        
        // 4. 删除其他用户对这些歌单的收藏
        await connection.query(
          'DELETE FROM user_playlists WHERE playlist_id IN (?)',
          [playlistIds]
        );
        
        // 5. 删除这些歌单中的歌曲
        await connection.query(
          'DELETE FROM playlist_songs WHERE playlist_id IN (?)',
          [playlistIds]
        );
      }
      
      // 6. 删除用户创建的歌单
      await connection.query('DELETE FROM playlists WHERE user_id = ?', [id]);
      
      // 7. 删除用户收藏的其他歌单记录
      await connection.query('DELETE FROM user_playlists WHERE user_id = ?', [id]);
      
      // 8. 删除用户的评论
      await connection.query('DELETE FROM comments WHERE user_id = ?', [id]);
      
      // 9. 最后删除用户
      await connection.query('DELETE FROM users WHERE id = ?', [id]);

      // 提交事务
      await connection.commit();

      res.json({
        code: 200,
        message: '删除成功'
      });
    } catch (err) {
      // 如果出错，回滚事务
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('删除用户失败:', error);
    res.status(500).json({
      code: 500,
      message: '删除失败'
    });
  }
};

// 上传用户头像
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        code: 400,
        message: '请选择文件'
      })
    }

    const fileUrl = await handleFileUpload(req.file, 'avatar')
    res.json({
      code: 200,
      data: {
        url: fileUrl
      }
    })
  } catch (error) {
    console.error('上传头像失败:', error)
    res.status(500).json({
      code: 500,
      message: '上传失败'
    })
  }
}

// 更新歌曲状态
exports.updateSongStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    await db.query(
      'UPDATE songs SET status = ? WHERE id = ?',
      [status, id]
    )

    res.json({
      code: 200,
      message: status === 1 ? '上架成功' : '下架成功'
    })
  } catch (error) {
    console.error('更新歌曲状态失败:', error)
    res.status(500).json({
      code: 500,
      message: '操作失败'
    })
  }
}

// 获取仪表盘数据
exports.getDashboardStats = async (req, res) => {
  try {
    // 获取总用户数
    const [userStats] = await db.query(
      'SELECT COUNT(*) as total FROM users'
    );

    // 获取歌曲相关统计
    const [songStats] = await db.query(
      `SELECT 
        COUNT(*) as total,
        SUM(play_count) as total_plays,
        SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) as active_count
       FROM songs`
    );

    // 获取歌单统计
    const [playlistStats] = await db.query(
      'SELECT COUNT(*) as total FROM playlists'
    );

    // 获取收藏统计
    const [likeStats] = await db.query(
      'SELECT COUNT(*) as total FROM user_likes'
    );

    // 获取评论统计
    const [commentStats] = await db.query(
      'SELECT COUNT(*) as total FROM comments'
    );

    // 获取最近7天每天的新增用户数
    const [dailyNewUsers] = await db.query(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
       FROM users
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
       GROUP BY DATE(created_at)
       ORDER BY date`
    );

    // 获取播放量最高的10首歌曲
    const [topSongs] = await db.query(
      `SELECT id, title, singer_name, play_count
       FROM songs
       ORDER BY play_count DESC
       LIMIT 10`
    );

    res.json({
      code: 200,
      data: {
        users: {
          total: userStats[0].total
        },
        songs: {
          total: songStats[0].total,
          active: songStats[0].active_count,
          totalPlays: songStats[0].total_plays
        },
        playlists: {
          total: playlistStats[0].total
        },
        likes: {
          total: likeStats[0].total
        },
        comments: {
          total: commentStats[0].total
        },
        dailyNewUsers,
        topSongs
      }
    });
  } catch (error) {
    console.error('获取仪表盘数据失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取数据失败'
    });
  }
};

// 获取歌单列表
exports.getPlaylistList = async (req, res) => {
  try {
    const { keyword = '', page = 1, pageSize = 10 } = req.query;
    const offset = (page - 1) * pageSize;

    // 构建查询条件
    let whereClause = 'WHERE 1=1';
    const params = [];
    
    if (keyword) {
      whereClause += ' AND (p.name LIKE ? OR u.nickname LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    // 获取总数
    const [countResult] = await db.query(
      `SELECT COUNT(*) as total 
       FROM playlists p
       LEFT JOIN users u ON p.user_id = u.id
       ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // 获取歌单列表
    const [playlists] = await db.query(
      `SELECT 
        p.*,
        u.nickname as creator_name,
        (SELECT COUNT(*) FROM playlist_songs WHERE playlist_id = p.id) as song_count,
        (SELECT COUNT(*) FROM user_playlists WHERE playlist_id = p.id) as collect_count
       FROM playlists p
       LEFT JOIN users u ON p.user_id = u.id
       ${whereClause}
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(pageSize), offset]
    );

    res.json({
      code: 200,
      data: {
        list: playlists,
        total,
        page: Number(page),
        pageSize: Number(pageSize)
      }
    });
  } catch (error) {
    console.error('获取歌单列表失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取歌单列表失败'
    });
  }
};

// 删除歌单
exports.deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;

    // 检查歌单是否被收藏
    const [collectResult] = await db.query(
      'SELECT COUNT(*) as count FROM user_playlists WHERE playlist_id = ?',
      [id]
    );

    if (collectResult[0].count > 0) {
      return res.status(400).json({
        code: 400,
        message: '该歌单已被收藏,无法删除'
      });
    }

    // 开启事务
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // 1. 删除歌单中的歌曲
      await connection.query(
        'DELETE FROM playlist_songs WHERE playlist_id = ?',
        [id]
      );

      // 2. 删除歌单
      await connection.query(
        'DELETE FROM playlists WHERE id = ?',
        [id]
      );

      await connection.commit();

      res.json({
        code: 200,
        message: '删除成功'
      });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('删除歌单失败:', error);
    res.status(500).json({
      code: 500,
      message: '删除失败'
    });
  }
};

// 更新歌单
exports.updatePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, cover_image } = req.body;

    await db.query(
      `UPDATE playlists 
       SET name = ?, description = ?, cover_image = ?
       WHERE id = ?`,
      [name, description, cover_image, id]
    );

    res.json({
      code: 200,
      message: '更新成功'
    });
  } catch (error) {
    console.error('更新歌单失败:', error);
    res.status(500).json({
      code: 500,
      message: '更新失败'
    });
  }
};