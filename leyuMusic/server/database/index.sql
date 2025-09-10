-- 删除数据库如果存在
DROP DATABASE IF EXISTS netease_music;

-- 创建数据库
CREATE DATABASE netease_music;

-- 使用数据库
USE netease_music;

-- 用户表 (第一个创建，因为很多表都依赖它)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    avatar VARCHAR(255),
    role ENUM('user', 'admin') DEFAULT 'user',
    gender TINYINT DEFAULT 0 COMMENT '0:保密,1:男,2:女',
    signature TEXT COMMENT '个性签名',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 歌单表 (第二个创建，因为它依赖用户表，且被其他表依赖)
CREATE TABLE IF NOT EXISTS playlists (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL COMMENT '歌单名称',
    description TEXT COMMENT '歌单描述',
    cover_image VARCHAR(255) COMMENT '封面图片',
    user_id INT NOT NULL COMMENT '创建者ID',
    play_count INT DEFAULT 0 COMMENT '播放次数',
    status TINYINT DEFAULT 1 COMMENT '状态：1-正常 0-删除',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 歌曲表
CREATE TABLE IF NOT EXISTS songs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    singer_name VARCHAR(255) NOT NULL,
    cover_image VARCHAR(255),
    file_url VARCHAR(255) NOT NULL,
    status TINYINT DEFAULT 1,
    play_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 收藏歌单表
CREATE TABLE IF NOT EXISTS user_playlists (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    playlist_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (playlist_id) REFERENCES playlists(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 歌单歌曲关联表
CREATE TABLE IF NOT EXISTS playlist_songs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    playlist_id INT NOT NULL,
    song_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (playlist_id) REFERENCES playlists(id),
    FOREIGN KEY (song_id) REFERENCES songs(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 评论表
CREATE TABLE IF NOT EXISTS comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    song_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
);

-- 添加索引
CREATE INDEX idx_song_id ON comments(song_id);
CREATE INDEX idx_user_id ON comments(user_id);

-- 用户喜欢的歌曲关联表
CREATE TABLE user_likes (
    user_id INT,
    song_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, song_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
);

-- 播放历史表
CREATE TABLE play_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    song_id INT,
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
);

-- 歌曲分类表
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 歌曲分类关联表
CREATE TABLE song_categories (
    song_id INT,
    category_id INT,
    PRIMARY KEY (song_id, category_id),
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- 插入基础分类数据
INSERT INTO categories (name) VALUES 
('流行'), ('摇滚'), ('民谣'), ('电子'), ('说唱'), ('爵士'), ('古典');

-- 创建测试用户数据
INSERT INTO users (username, password, nickname, gender, signature, role) VALUES
('user1', 'user123', '测试用1', 1, '这是我的个性签名', 'user'),
('user2', 'user123', '测试用户2', 2, '音乐改变生活', 'user'),
('user3', 'user123', '测试用户3', 0, '让音乐响起来', 'user'),
('admin', 'admin123', '管理员', 1, '网站管理员', 'admin');

-- 创建测试歌单
INSERT INTO playlists (name, user_id, cover_image, description, play_count) VALUES
('我喜欢的音乐', 1, 'https://picsum.photos/200/200?random=1', '我的私人收藏', 1000),
('华语经典', 1, 'https://picsum.photos/200/200?random=2', '经典华语歌曲合集', 2000),
('欧美流行', 2, 'https://picsum.photos/200/200?random=3', '欧美流行音乐精选', 3000),
('轻音乐', 3, 'https://picsum.photos/200/200?random=4', '学习工作的最佳伴奏', 4000);

-- 修改歌曲测试数据
INSERT INTO songs (title, singer_name, cover_image, file_url, play_count, status) VALUES
('稻香', '周杰伦', 'https://picsum.photos/800/600?random=1', 'http://localhost:3000/uploads/audio/稻香.mp3', 1000, 1),
('晴天', '周杰伦', 'https://picsum.photos/800/600?random=2', 'http://localhost:3000/uploads/audio/晴天.mp3', 2000, 1),
('七里香', '周杰伦', 'https://picsum.photos/800/600?random=3', 'http://localhost:3000/uploads/audio/七里香.mp3', 1500, 1),
('青花瓷', '周杰伦', 'https://picsum.photos/800/600?random=4', 'http://localhost:3000/uploads/audio/青花瓷.mp3', 1800, 1);

-- 添加歌曲分类关联
INSERT INTO song_categories (song_id, category_id) VALUES
(1, 1), -- 稻香: 流行
(1, 3), -- 稻香: 民谣
(2, 1), -- 晴天: 流行
(2, 2), -- 晴天: 摇滚
(3, 1), -- 七里香: 流行
(3, 3), -- 七里香: 民谣
(4, 1), -- 青花瓷: 流行
(4, 3); -- 青花瓷: 民谣

-- 添加收藏歌单数据
INSERT INTO user_playlists (user_id, playlist_id) VALUES
(1, 3), -- user1 收藏了 欧美流行
(1, 4), -- user1 收藏了 轻音乐
(2, 1), -- user2 收藏了 我喜欢的音乐
(2, 2), -- user2 收藏了 华语经典
(3, 2); -- user3 收藏了 华语经典

-- 添加歌单歌曲
INSERT INTO playlist_songs (playlist_id, song_id) VALUES
(1, 1), -- 我喜欢的音乐: 稻香
(1, 2), -- 我喜欢的音乐: 晴天
(2, 3), -- 华语经典: 七里香
(2, 4), -- 华语经典: 青花瓷
(3, 1), -- 欧美流行: 稻香
(3, 3), -- 欧美流行: 七里香
(4, 2), -- 轻音乐: 晴天
(4, 4); -- 轻音乐: 青花瓷

-- 评论点赞表
CREATE TABLE comment_likes (
    user_id INT,
    comment_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, comment_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE
);
