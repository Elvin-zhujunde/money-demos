# ************************************************************
# Sequel Ace SQL dump
# 版本号： 20077
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# 主机: 127.0.0.1 (MySQL 8.4.3)
# 数据库: netease_music
# 生成时间: 2024-12-06 02:55:36 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE='NO_AUTO_VALUE_ON_ZERO', SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# 转储表 categories
# ------------------------------------------------------------

DROP TABLE IF EXISTS `categories`;

CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;

INSERT INTO `categories` (`id`, `name`, `created_at`)
VALUES
	(1,'流行','2024-12-05 22:06:45'),
	(2,'摇滚','2024-12-05 22:06:45'),
	(3,'民谣','2024-12-05 22:06:45'),
	(4,'电子','2024-12-05 22:06:45'),
	(5,'说唱','2024-12-05 22:06:45'),
	(6,'爵士','2024-12-05 22:06:45'),
	(7,'古典','2024-12-05 22:06:45');

/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;


# 转储表 comment_likes
# ------------------------------------------------------------

DROP TABLE IF EXISTS `comment_likes`;

CREATE TABLE `comment_likes` (
  `user_id` int NOT NULL,
  `comment_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`comment_id`),
  KEY `comment_id` (`comment_id`),
  CONSTRAINT `comment_likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comment_likes_ibfk_2` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



# 转储表 comments
# ------------------------------------------------------------

DROP TABLE IF EXISTS `comments`;

CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `song_id` int NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_song_id` (`song_id`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`song_id`) REFERENCES `songs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;

INSERT INTO `comments` (`id`, `user_id`, `song_id`, `content`, `created_at`, `updated_at`)
VALUES
	(1,1,5,'哈喽啊','2024-12-05 22:29:27','2024-12-05 22:29:27');

/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;


# 转储表 play_history
# ------------------------------------------------------------

DROP TABLE IF EXISTS `play_history`;

CREATE TABLE `play_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `song_id` int DEFAULT NULL,
  `played_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `song_id` (`song_id`),
  CONSTRAINT `play_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `play_history_ibfk_2` FOREIGN KEY (`song_id`) REFERENCES `songs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



# 转储表 playlist_songs
# ------------------------------------------------------------

DROP TABLE IF EXISTS `playlist_songs`;

CREATE TABLE `playlist_songs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `playlist_id` int NOT NULL,
  `song_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `playlist_id` (`playlist_id`),
  KEY `song_id` (`song_id`),
  CONSTRAINT `playlist_songs_ibfk_1` FOREIGN KEY (`playlist_id`) REFERENCES `playlists` (`id`),
  CONSTRAINT `playlist_songs_ibfk_2` FOREIGN KEY (`song_id`) REFERENCES `songs` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `playlist_songs` WRITE;
/*!40000 ALTER TABLE `playlist_songs` DISABLE KEYS */;

INSERT INTO `playlist_songs` (`id`, `playlist_id`, `song_id`, `created_at`)
VALUES
	(1,1,1,'2024-12-05 22:06:45'),
	(2,1,2,'2024-12-05 22:06:45'),
	(5,3,1,'2024-12-05 22:06:45'),
	(6,3,3,'2024-12-05 22:06:45'),
	(9,5,1,'2024-12-06 10:44:30');

/*!40000 ALTER TABLE `playlist_songs` ENABLE KEYS */;
UNLOCK TABLES;


# 转储表 playlists
# ------------------------------------------------------------

DROP TABLE IF EXISTS `playlists`;

CREATE TABLE `playlists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT '歌单名称',
  `description` text COMMENT '歌单描述',
  `cover_image` varchar(255) DEFAULT NULL COMMENT '封面图片',
  `user_id` int NOT NULL COMMENT '创建者ID',
  `play_count` int DEFAULT '0' COMMENT '播放次数',
  `status` tinyint DEFAULT '1' COMMENT '状态：1-正常 0-删除',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `playlists_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `playlists` WRITE;
/*!40000 ALTER TABLE `playlists` DISABLE KEYS */;

INSERT INTO `playlists` (`id`, `name`, `description`, `cover_image`, `user_id`, `play_count`, `status`, `created_at`, `updated_at`)
VALUES
	(1,'我喜欢的音乐','我的私人收藏2','https://picsum.photos/200/200?random=1',1,1000,1,'2024-12-05 22:06:45','2024-12-05 23:04:38'),
	(3,'欧美流行','欧美流行音乐精选','https://picsum.photos/200/200?random=3',2,3000,1,'2024-12-05 22:06:45','2024-12-05 22:06:45'),
	(5,'阿亻','123',NULL,4,0,1,'2024-12-06 10:39:42','2024-12-06 10:39:42');

/*!40000 ALTER TABLE `playlists` ENABLE KEYS */;
UNLOCK TABLES;


# 转储表 song_categories
# ------------------------------------------------------------

DROP TABLE IF EXISTS `song_categories`;

CREATE TABLE `song_categories` (
  `song_id` int NOT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`song_id`,`category_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `song_categories_ibfk_1` FOREIGN KEY (`song_id`) REFERENCES `songs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `song_categories_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `song_categories` WRITE;
/*!40000 ALTER TABLE `song_categories` DISABLE KEYS */;

INSERT INTO `song_categories` (`song_id`, `category_id`)
VALUES
	(1,1),
	(2,1),
	(3,1),
	(4,1),
	(2,2),
	(1,3),
	(3,3),
	(4,3);

/*!40000 ALTER TABLE `song_categories` ENABLE KEYS */;
UNLOCK TABLES;


# 转储表 songs
# ------------------------------------------------------------

DROP TABLE IF EXISTS `songs`;

CREATE TABLE `songs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `singer_name` varchar(255) NOT NULL,
  `cover_image` varchar(255) DEFAULT NULL,
  `file_url` varchar(255) NOT NULL,
  `status` tinyint DEFAULT '1',
  `play_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `songs` WRITE;
/*!40000 ALTER TABLE `songs` DISABLE KEYS */;

INSERT INTO `songs` (`id`, `title`, `singer_name`, `cover_image`, `file_url`, `status`, `play_count`, `created_at`, `updated_at`)
VALUES
	(1,'稻香','周杰伦','https://picsum.photos/800/600?random=1','http://localhost:3000/uploads/audio/稻香.mp3',1,1024,'2024-12-05 22:06:45','2024-12-06 10:45:06'),
	(2,'晴天','周杰伦','https://picsum.photos/800/600?random=2','http://localhost:3000/uploads/audio/晴天.mp3',0,2001,'2024-12-05 22:06:45','2024-12-05 22:44:06'),
	(3,'一千年以后','JJ','http://localhost:3000/uploads/img/1733409685200.jpg','http://localhost:3000/uploads/audio/一千年以后.mp3',1,1508,'2024-12-05 22:06:45','2024-12-05 23:31:03'),
	(4,'青花瓷','周杰伦','https://picsum.photos/800/600?random=4','http://localhost:3000/uploads/audio/青花瓷.mp3',0,1802,'2024-12-05 22:06:45','2024-12-05 22:44:05'),
	(5,'LEFT','不知道','http://localhost:3000/uploads/img/1733408910152.jpg','http://localhost:3000/uploads/audio/LEFT.mp3',1,20,'2024-12-05 22:28:30','2024-12-06 10:40:25'),
	(6,'cw','cw','http://localhost:3000/uploads/img/1733409854857.jpg','http://localhost:3000/uploads/audio/cw.mp3',1,3,'2024-12-05 22:44:15','2024-12-05 23:30:11');

/*!40000 ALTER TABLE `songs` ENABLE KEYS */;
UNLOCK TABLES;


# 转储表 user_likes
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_likes`;

CREATE TABLE `user_likes` (
  `user_id` int NOT NULL,
  `song_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`song_id`),
  KEY `song_id` (`song_id`),
  CONSTRAINT `user_likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `user_likes_ibfk_2` FOREIGN KEY (`song_id`) REFERENCES `songs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `user_likes` WRITE;
/*!40000 ALTER TABLE `user_likes` DISABLE KEYS */;

INSERT INTO `user_likes` (`user_id`, `song_id`, `created_at`)
VALUES
	(1,1,'2024-12-05 23:06:17'),
	(1,3,'2024-12-05 23:06:20'),
	(1,4,'2024-12-05 22:40:46'),
	(1,5,'2024-12-05 23:23:55'),
	(4,1,'2024-12-06 10:39:18');

/*!40000 ALTER TABLE `user_likes` ENABLE KEYS */;
UNLOCK TABLES;


# 转储表 user_playlists
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_playlists`;

CREATE TABLE `user_playlists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `playlist_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `playlist_id` (`playlist_id`),
  CONSTRAINT `user_playlists_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `user_playlists_ibfk_2` FOREIGN KEY (`playlist_id`) REFERENCES `playlists` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `user_playlists` WRITE;
/*!40000 ALTER TABLE `user_playlists` DISABLE KEYS */;

INSERT INTO `user_playlists` (`id`, `user_id`, `playlist_id`, `created_at`)
VALUES
	(1,1,3,'2024-12-05 22:06:45'),
	(3,2,1,'2024-12-05 22:06:45'),
	(6,4,5,'2024-12-06 10:45:22');

/*!40000 ALTER TABLE `user_playlists` ENABLE KEYS */;
UNLOCK TABLES;


# 转储表 users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nickname` varchar(50) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `gender` tinyint DEFAULT '0' COMMENT '0:保密,1:男,2:女',
  `signature` text COMMENT '个性签名',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `username`, `password`, `nickname`, `avatar`, `role`, `gender`, `signature`, `created_at`, `updated_at`)
VALUES
	(1,'user1','user123','测试用1','http://localhost:3000/uploads/avatar/1733408592090.jpg','user',1,'这是我的个性签名','2024-12-05 22:06:45','2024-12-05 22:23:13'),
	(2,'user2','user123','测试用户2','http://localhost:3000/uploads/avatar/1733408611729.jpg','user',1,'音乐改变生活','2024-12-05 22:06:45','2024-12-05 22:23:34'),
	(4,'admin','admin123','管理员',NULL,'admin',1,'网站管理员','2024-12-05 22:06:45','2024-12-05 22:06:45');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
