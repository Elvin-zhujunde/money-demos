# ************************************************************
# Sequel Ace SQL dump
# 版本号： 20077
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# 主机: 127.0.0.1 (MySQL 8.4.3)
# 数据库: arenMall
# 生成时间: 2025-04-23 14:52:17 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE='NO_AUTO_VALUE_ON_ZERO', SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# 转储表 banners
# ------------------------------------------------------------

DROP TABLE IF EXISTS `banners`;

CREATE TABLE `banners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) DEFAULT NULL COMMENT '轮播图标题',
  `image_url` varchar(255) DEFAULT NULL COMMENT '图片URL',
  `link_url` varchar(255) DEFAULT NULL COMMENT '跳转链接',
  `sort_order` int DEFAULT NULL COMMENT '排序号',
  `status` tinyint DEFAULT '1' COMMENT '状态：0-禁用 1-启用',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='轮播图表';

LOCK TABLES `banners` WRITE;
/*!40000 ALTER TABLE `banners` DISABLE KEYS */;

INSERT INTO `banners` (`id`, `title`, `image_url`, `link_url`, `sort_order`, `status`, `created_at`, `updated_at`)
VALUES
	(2,'限时特惠','http://localhost:9090/uploads/1745328835541-999325416.png','/1',1,1,'2024-12-28 22:57:36','2025-04-22 21:34:01'),
	(4,'test','http://localhost:9090/uploads/1745328852088-354183406.png','/2',0,1,'2025-04-22 21:34:13','2025-04-22 21:34:13'),
	(5,'test1','http://localhost:9090/uploads/1745328859489-426692698.png','/1',2,1,'2025-04-22 21:34:25','2025-04-22 21:34:25');

/*!40000 ALTER TABLE `banners` ENABLE KEYS */;
UNLOCK TABLES;


# 转储表 cart
# ------------------------------------------------------------

DROP TABLE IF EXISTS `cart`;

CREATE TABLE `cart` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '购物车ID',
  `user_id` int NOT NULL COMMENT '用户ID',
  `product_id` int NOT NULL COMMENT '商品ID',
  `quantity` int NOT NULL DEFAULT '1' COMMENT '商品数量',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_product` (`user_id`,`product_id`) COMMENT '同一用户同一商品只能有一条记录',
  KEY `product_id` (`product_id`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='购物车表';



# 转储表 categories
# ------------------------------------------------------------

DROP TABLE IF EXISTS `categories`;

CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `name` varchar(50) NOT NULL COMMENT '分类名称',
  `parent_id` int DEFAULT '0' COMMENT '父分类ID',
  `level` int DEFAULT '1' COMMENT '分类层级',
  `sort` int DEFAULT '0' COMMENT '排序',
  `icon` varchar(200) DEFAULT NULL COMMENT '分类图标',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='商品分类表';

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;

INSERT INTO `categories` (`id`, `name`, `parent_id`, `level`, `sort`, `icon`, `created_at`, `updated_at`)
VALUES
	(1,'游戏类',0,1,1,'http://localhost:9090/uploads/1745336407219-780250184.png','2024-12-28 22:57:36','2025-04-22 23:40:08'),
	(2,'PC 游戏',1,2,1,'http://localhost:9090/uploads/1743693214294-563861712.jpg','2024-12-28 22:57:36','2025-04-22 23:37:10'),
	(3,'主机游戏',1,2,2,'http://localhost:9090/uploads/1743693276582-679147695.jpeg','2024-12-28 22:57:36','2025-04-22 23:37:21'),
	(4,'手机游戏',1,2,3,'http://localhost:9090/uploads/1743693314935-250727712.jpeg','2024-12-28 22:57:36','2025-04-22 23:37:30'),
	(5,'游戏点卡 / 时长卡',1,2,4,'http://localhost:9090/uploads/1743693373162-147966120.jpeg','2024-12-28 22:57:36','2025-04-22 23:37:40'),
	(6,'游戏周边类',0,1,2,'http://localhost:9090/uploads/1745412661192-424574733.jpg','2024-12-28 22:57:36','2025-04-23 20:51:02'),
	(7,'收藏手办 / 模型',6,2,1,'http://localhost:9090/uploads/1743827342133-128982778.jpeg','2024-12-28 22:57:36','2025-04-22 23:38:04'),
	(9,'徽章 / 徽章套装',6,2,3,'http://localhost:9090/uploads/1743827306361-575035509.jpeg','2024-12-28 22:57:36','2025-04-22 23:38:16'),
	(11,'游戏器具',0,1,3,'http://localhost:9090/uploads/1745336414281-671548963.png','2024-12-28 22:57:36','2025-04-22 23:40:15'),
	(17,'游戏手柄 / 摇杆',11,2,0,'','2025-04-22 23:38:37','2025-04-22 23:38:37'),
	(18,'键盘 / 鼠标',11,2,0,'','2025-04-22 23:38:43','2025-04-22 23:38:43'),
	(19,'游戏耳机 / 音箱\"',11,2,0,'','2025-04-22 23:38:52','2025-04-22 23:38:52'),
	(20,'游戏显示器 / 投影仪',11,2,0,'','2025-04-22 23:39:01','2025-04-22 23:39:01');

/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;


# 转储表 order_items
# ------------------------------------------------------------

DROP TABLE IF EXISTS `order_items`;

CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '订单项ID',
  `order_id` int NOT NULL COMMENT '订单ID',
  `product_id` int NOT NULL COMMENT '商品ID',
  `product_title` varchar(200) NOT NULL COMMENT '商品标题',
  `product_cover` varchar(200) DEFAULT NULL COMMENT '商品图片',
  `product_price` decimal(10,2) NOT NULL COMMENT '商品价格',
  `original_price` decimal(10,2) DEFAULT NULL COMMENT '商品原价',
  `quantity` int NOT NULL COMMENT '购买数量',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='订单详情表';

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_title`, `product_cover`, `product_price`, `original_price`, `quantity`, `created_at`)
VALUES
	(5,5,11,'【永劫无间】2红号','http://localhost:9090/uploads/1745413012201-160433403.jpg',300.00,NULL,1,'2025-04-23 21:43:03');

/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;


# 转储表 orders
# ------------------------------------------------------------

DROP TABLE IF EXISTS `orders`;

CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  `order_no` varchar(50) NOT NULL COMMENT '订单编号',
  `user_id` int NOT NULL COMMENT '用户ID',
  `total_amount` decimal(10,2) NOT NULL COMMENT '订单总金额',
  `status` tinyint DEFAULT '0' COMMENT '订单状态：0-待付款，1-待发货，2-待收货，3-已完成，4-已取消',
  `address_id` int NOT NULL COMMENT '收货地址ID',
  `province` varchar(50) DEFAULT NULL COMMENT '省份',
  `city` varchar(50) DEFAULT NULL COMMENT '城市',
  `district` varchar(50) DEFAULT NULL COMMENT '区县',
  `detail_address` text COMMENT '详细地址',
  `receiver` varchar(50) NOT NULL COMMENT '收货人',
  `receiver_phone` varchar(20) NOT NULL COMMENT '收货人电话',
  `payment_method` tinyint DEFAULT NULL COMMENT '支付方式：1-微信，2-支付宝',
  `payment_no` varchar(100) DEFAULT NULL COMMENT '支付单号',
  `paid_time` datetime DEFAULT NULL COMMENT '支付时间',
  `source` tinyint DEFAULT '1' COMMENT '订单来源：1-购物车，2-直接购买',
  `remark` varchar(200) DEFAULT NULL COMMENT '订单备注',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_no` (`order_no`),
  KEY `user_id` (`user_id`),
  KEY `address_id` (`address_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`address_id`) REFERENCES `shipping_addresses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='订单表';

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;

INSERT INTO `orders` (`id`, `order_no`, `user_id`, `total_amount`, `status`, `address_id`, `province`, `city`, `district`, `detail_address`, `receiver`, `receiver_phone`, `payment_method`, `payment_no`, `paid_time`, `source`, `remark`, `created_at`, `updated_at`)
VALUES
	(5,'1745415783475387',5,300.00,0,5,'广东省','深圳市','福田区','131222233','1','13122223333',1,NULL,NULL,1,'','2025-04-23 21:43:03','2025-04-23 21:43:03');

/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;


# 转储表 products
# ------------------------------------------------------------

DROP TABLE IF EXISTS `products`;

CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '商品ID',
  `category_id` int NOT NULL COMMENT '分类ID',
  `seller_id` int NOT NULL COMMENT '商家ID',
  `title` varchar(200) NOT NULL COMMENT '商品标题',
  `description` text COMMENT '商品描述',
  `price` decimal(10,2) NOT NULL COMMENT '商品价格',
  `original_price` decimal(10,2) DEFAULT NULL COMMENT '原价',
  `stock` int NOT NULL DEFAULT '0' COMMENT '库存数量',
  `sales` int DEFAULT '0' COMMENT '销量',
  `cover` varchar(200) DEFAULT NULL COMMENT '商品封面图',
  `shipping_from` varchar(100) NOT NULL COMMENT '发货地',
  `status` tinyint DEFAULT '1' COMMENT '商品状态：0-下架，1-上架',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  KEY `seller_id` (`seller_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='商品表';

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;

INSERT INTO `products` (`id`, `category_id`, `seller_id`, `title`, `description`, `price`, `original_price`, `stock`, `sales`, `cover`, `shipping_from`, `status`, `created_at`, `updated_at`)
VALUES
	(10,3,5,'双人成行','123',99.99,159.00,97,2,'http://localhost:9090/uploads/1745413199419-326681386.png','江西',1,'2025-04-05 12:57:08','2025-04-23 21:00:02'),
	(11,2,2,'【永劫无间】2红号','shangpingmiaoshu',300.00,888.00,0,1,'http://localhost:9090/uploads/1745413012201-160433403.jpg','123',1,'2025-04-06 12:17:47','2025-04-23 21:43:03'),
	(12,4,2,'王者荣耀-全英雄全皮肤','全英雄全皮肤',1999.00,3999.00,7,0,'http://localhost:9090/uploads/1745413231727-498473408.png','1',1,'2025-04-23 21:01:00','2025-04-23 21:01:00');

/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;


# 转储表 shipping_addresses
# ------------------------------------------------------------

DROP TABLE IF EXISTS `shipping_addresses`;

CREATE TABLE `shipping_addresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL COMMENT '用户ID',
  `receiver` varchar(50) NOT NULL COMMENT '收货人',
  `phone` varchar(20) NOT NULL COMMENT '联系电话',
  `province` varchar(50) NOT NULL COMMENT '省份',
  `city` varchar(50) NOT NULL COMMENT '城市',
  `district` varchar(50) NOT NULL COMMENT '区县',
  `detail_address` text NOT NULL COMMENT '详细地址',
  `is_default` tinyint DEFAULT '0' COMMENT '是否默认地址：0-否，1-是',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `shipping_addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='收货地址表';

LOCK TABLES `shipping_addresses` WRITE;
/*!40000 ALTER TABLE `shipping_addresses` DISABLE KEYS */;

INSERT INTO `shipping_addresses` (`id`, `user_id`, `receiver`, `phone`, `province`, `city`, `district`, `detail_address`, `is_default`, `created_at`, `updated_at`)
VALUES
	(1,5,'张三1','13800138001','广东省','深圳市','南山区','科技园南路123号',0,'2024-12-28 22:57:36','2025-03-08 11:50:48'),
	(2,5,'张三','13800138001','北京市','北京市','朝阳区','三里屯SOHO',0,'2024-12-28 22:57:36','2024-12-28 22:57:36'),
	(4,2,'阿哈？','13122223333','北京市','北京市','市辖区','搞什么',0,'2025-01-06 11:06:26','2025-04-06 12:15:02'),
	(5,5,'1','13122223333','广东省','深圳市','福田区','131222233',1,'2025-03-08 11:50:48','2025-03-08 11:50:48'),
	(6,2,'asan','13122223333','广东省','广州市','海珠区','asdl',1,'2025-04-06 12:15:02','2025-04-06 12:15:02');

/*!40000 ALTER TABLE `shipping_addresses` ENABLE KEYS */;
UNLOCK TABLES;


# 转储表 users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `password` varchar(100) NOT NULL COMMENT '密码',
  `name` varchar(50) DEFAULT NULL COMMENT '昵称',
  `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
  `email` varchar(100) DEFAULT NULL COMMENT '邮箱',
  `avatar` varchar(200) DEFAULT 'https://img01.yzcdn.cn/vant/cat.jpeg' COMMENT '头像URL',
  `role` tinyint DEFAULT '0' COMMENT '用户角色：0-普通用户，1-商家，2-超级管理员',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户表';

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `username`, `password`, `name`, `phone`, `email`, `avatar`, `role`, `created_at`, `updated_at`)
VALUES
	(2,'seller1','123456','商家1','13911111111','seller@example.com','https://img01.yzcdn.cn/vant/cat.jpeg',1,'2024-12-28 22:57:36','2025-03-08 13:03:05'),
	(5,'test1','123456','测试用户','13122223333','2@q.com','http://localhost:9090/uploads/1745413654727-181235553.png',0,'2024-12-28 22:57:36','2025-04-23 21:42:51');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
