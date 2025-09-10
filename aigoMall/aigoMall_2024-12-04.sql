# ************************************************************
# Sequel Ace SQL dump
# 版本号： 20077
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# 主机: 127.0.0.1 (MySQL 8.4.3)
# 数据库: aigoMall
# 生成时间: 2024-12-04 12:56:32 +0000
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
	(1,'新品上市','http://localhost:9090/uploads/1733314643061-558528422.png','/products/1',1,1,'2024-12-01 23:31:26','2024-12-04 20:17:23'),
	(4,'123','http://localhost:9090/uploads/1733314635478-575078083.png','hello',0,1,'2024-12-04 20:14:26','2024-12-04 20:17:18'),
	(5,'123','http://localhost:9090/uploads/1733315521439-257006151.png','123',1,1,'2024-12-04 20:32:04','2024-12-04 20:32:04');

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

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;

INSERT INTO `cart` (`id`, `user_id`, `product_id`, `quantity`, `created_at`, `updated_at`)
VALUES
	(10,5,6,3,'2024-12-02 00:27:27','2024-12-02 00:27:28'),
	(11,2,3,1,'2024-12-02 10:11:26','2024-12-02 10:11:26');

/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;


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
	(1,'家用电器',0,1,1,'https://img01.yzcdn.cn/vant/apple-1.jpg','2024-12-01 23:31:26','2024-12-01 23:31:26'),
	(2,'电视',1,2,1,'https://img01.yzcdn.cn/vant/apple-2.jpg','2024-12-01 23:31:26','2024-12-01 23:31:26'),
	(3,'空调',1,2,2,'https://img01.yzcdn.cn/vant/apple-3.jpg','2024-12-01 23:31:26','2024-12-01 23:31:26'),
	(4,'洗衣机',1,2,3,'https://img01.yzcdn.cn/vant/apple-4.jpg','2024-12-01 23:31:26','2024-12-01 23:31:26'),
	(5,'冰箱',1,2,4,'https://img01.yzcdn.cn/vant/apple-5.jpg','2024-12-01 23:31:26','2024-12-01 23:31:26'),
	(6,'手机数码',0,1,2,'https://img01.yzcdn.cn/vant/cat.jpeg','2024-12-01 23:31:26','2024-12-01 23:31:26'),
	(7,'手机',6,2,1,'https://img01.yzcdn.cn/vant/ipad.jpeg','2024-12-01 23:31:26','2024-12-01 23:31:26'),
	(8,'平板',6,2,2,'https://img01.yzcdn.cn/vant/cat.jpeg','2024-12-01 23:31:26','2024-12-01 23:31:26'),
	(9,'笔记本',6,2,3,'https://img01.yzcdn.cn/vant/cat.jpeg','2024-12-01 23:31:26','2024-12-01 23:31:26'),
	(10,'智能手表',6,2,4,'https://img01.yzcdn.cn/vant/cat.jpeg','2024-12-01 23:31:26','2024-12-01 23:31:26'),
	(11,'电脑办公',0,1,3,'https://img01.yzcdn.cn/vant/cat.jpeg','2024-12-01 23:31:26','2024-12-01 23:31:26'),
	(12,'台式机',11,2,1,'https://img01.yzcdn.cn/vant/cat.jpeg','2024-12-01 23:31:26','2024-12-01 23:31:26'),
	(13,'显示器',11,2,2,'https://img01.yzcdn.cn/vant/cat.jpeg','2024-12-01 23:31:26','2024-12-01 23:31:26'),
	(14,'打印机',11,2,3,'https://img01.yzcdn.cn/vant/cat.jpeg','2024-12-01 23:31:26','2024-12-01 23:31:26'),
	(15,'路由器',11,2,4,'https://img01.yzcdn.cn/vant/cat.jpeg','2024-12-01 23:31:26','2024-12-01 23:31:26'),
	(16,'1',1,2,1,'http://localhost:9090/uploads/1733315094067-417761739.png','2024-12-04 20:24:56','2024-12-04 20:24:56'),
	(17,'123123',11,2,2,'http://localhost:9090/uploads/1733315537774-846992979.png','2024-12-04 20:32:20','2024-12-04 20:32:20');

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
	(1,1,1,'小米全面屏电视Pro','https://img.alicdn.com/imgextra/i4/O1CN01Tp04IC1mEUQvwJgAk_!!6000000004927-0-tps-2880-1070.jpg',3999.00,NULL,1,'2024-12-01 23:31:26'),
	(13,8,1,'小米全面屏电视Pro','https://img.alicdn.com/imgextra/i4/O1CN01Tp04IC1mEUQvwJgAk_!!6000000004927-0-tps-2880-1070.jpg',3999.00,NULL,1,'2024-12-02 00:04:51'),
	(14,8,3,'小米平板5 Pro','https://example.com/pad5.jpg',2399.00,NULL,1,'2024-12-02 00:04:51'),
	(15,8,4,'华为智慧屏V系列','https://img.alicdn.com/imgextra/i2/O1CN01FF1c3q1pZ2K3DFkqZ_!!6000000005374-0-tps-2880-1070.jpg',5999.00,NULL,1,'2024-12-02 00:04:51'),
	(16,9,1,'小米全面屏电视Pro','https://img.alicdn.com/imgextra/i4/O1CN01Tp04IC1mEUQvwJgAk_!!6000000004927-0-tps-2880-1070.jpg',3999.00,NULL,1,'2024-12-02 00:20:15'),
	(17,10,1,'小米全面屏电视Pro','https://img.alicdn.com/imgextra/i4/O1CN01Tp04IC1mEUQvwJgAk_!!6000000004927-0-tps-2880-1070.jpg',3999.00,NULL,1,'2024-12-02 00:20:20'),
	(18,11,1,'小米全面屏电视Pro','https://img.alicdn.com/imgextra/i4/O1CN01Tp04IC1mEUQvwJgAk_!!6000000004927-0-tps-2880-1070.jpg',3999.00,NULL,1,'2024-12-02 00:22:34'),
	(19,12,1,'小米全面屏电视Pro','https://img.alicdn.com/imgextra/i4/O1CN01Tp04IC1mEUQvwJgAk_!!6000000004927-0-tps-2880-1070.jpg',3999.00,NULL,1,'2024-12-02 00:29:26'),
	(20,12,3,'小米平板5 Pro','https://example.com/pad5.jpg',2399.00,NULL,1,'2024-12-02 00:29:26'),
	(21,13,6,'HUAWEI MatePad Pro','https://example.com/matepad.jpg',3799.00,NULL,3,'2024-12-02 00:33:00'),
	(22,14,3,'小米平板5 Pro','https://example.com/pad5.jpg',2399.00,NULL,1,'2024-12-02 00:36:27'),
	(23,15,3,'小米平板5 Pro','https://tse1-mm.cn.bing.net/th/id/OIP-C.-vUU_h21O8DZiyAhjywGcgHaHa?w=182&h=182&c=7&r=0&o=5&dpr=2&pid=1.7',2399.00,NULL,1,'2024-12-02 00:41:23'),
	(25,17,3,'小米平板5 Pro','https://tse1-mm.cn.bing.net/th/id/OIP-C.-vUU_h21O8DZiyAhjywGcgHaHa?w=182&h=182&c=7&r=0&o=5&dpr=2&pid=1.7',2399.00,NULL,1,'2024-12-04 19:13:31'),
	(26,17,5,'HUAWEI P50 Pro','https://example.com/p50.jpg',6488.00,NULL,3,'2024-12-04 19:13:31'),
	(27,18,3,'小米平板5 Pro','https://tse1-mm.cn.bing.net/th/id/OIP-C.-vUU_h21O8DZiyAhjywGcgHaHa?w=182&h=182&c=7&r=0&o=5&dpr=2&pid=1.7',2399.00,NULL,1,'2024-12-04 19:13:32'),
	(28,18,5,'HUAWEI P50 Pro','https://example.com/p50.jpg',6488.00,NULL,3,'2024-12-04 19:13:32'),
	(29,19,3,'小米平板5 Pro','https://tse1-mm.cn.bing.net/th/id/OIP-C.-vUU_h21O8DZiyAhjywGcgHaHa?w=182&h=182&c=7&r=0&o=5&dpr=2&pid=1.7',2399.00,NULL,1,'2024-12-04 19:13:46'),
	(30,19,5,'HUAWEI P50 Pro','https://example.com/p50.jpg',6488.00,NULL,3,'2024-12-04 19:13:46'),
	(31,20,3,'小米平板5 Pro','https://tse1-mm.cn.bing.net/th/id/OIP-C.-vUU_h21O8DZiyAhjywGcgHaHa?w=182&h=182&c=7&r=0&o=5&dpr=2&pid=1.7',2399.00,NULL,1,'2024-12-04 19:14:15'),
	(32,20,5,'HUAWEI P50 Pro','https://example.com/p50.jpg',6488.00,NULL,3,'2024-12-04 19:14:15'),
	(33,21,3,'小米平板5 Pro','https://tse1-mm.cn.bing.net/th/id/OIP-C.-vUU_h21O8DZiyAhjywGcgHaHa?w=182&h=182&c=7&r=0&o=5&dpr=2&pid=1.7',2399.00,NULL,4,'2024-12-04 19:21:57'),
	(34,21,4,'华为智慧屏V系列','https://img.alicdn.com/imgextra/i2/O1CN01FF1c3q1pZ2K3DFkqZ_!!6000000005374-0-tps-2880-1070.jpg',5999.00,NULL,1,'2024-12-04 19:21:57'),
	(35,22,3,'小米平板5 Pro','https://tse1-mm.cn.bing.net/th/id/OIP-C.-vUU_h21O8DZiyAhjywGcgHaHa?w=182&h=182&c=7&r=0&o=5&dpr=2&pid=1.7',2399.00,NULL,1,'2024-12-04 19:59:52'),
	(36,23,3,'小米平板5 Pro','https://tse1-mm.cn.bing.net/th/id/OIP-C.-vUU_h21O8DZiyAhjywGcgHaHa?w=182&h=182&c=7&r=0&o=5&dpr=2&pid=1.7',2399.00,NULL,1,'2024-12-04 19:59:52'),
	(37,24,3,'小米平板5 Pro','https://tse1-mm.cn.bing.net/th/id/OIP-C.-vUU_h21O8DZiyAhjywGcgHaHa?w=182&h=182&c=7&r=0&o=5&dpr=2&pid=1.7',2399.00,NULL,1,'2024-12-04 20:02:04'),
	(38,25,4,'华为智慧屏V系列','http://localhost:9090/uploads/1733314736583-755730519.jpeg',5999.00,NULL,1,'2024-12-04 20:29:40'),
	(39,25,5,'HUAWEI P50 Pro','http://localhost:9090/uploads/1733314770594-353680803.jpg',6488.00,NULL,2,'2024-12-04 20:29:40'),
	(40,26,3,'小米平板5 Pro','https://tse1-mm.cn.bing.net/th/id/OIP-C.-vUU_h21O8DZiyAhjywGcgHaHa?w=182&h=182&c=7&r=0&o=5&dpr=2&pid=1.7',2399.00,NULL,4,'2024-12-04 20:38:15'),
	(41,26,4,'华为智慧屏V系列','http://localhost:9090/uploads/1733314736583-755730519.jpeg',5999.00,NULL,1,'2024-12-04 20:38:15'),
	(42,27,3,'小米平板5 Pro','https://tse1-mm.cn.bing.net/th/id/OIP-C.-vUU_h21O8DZiyAhjywGcgHaHa?w=182&h=182&c=7&r=0&o=5&dpr=2&pid=1.7',2399.00,NULL,4,'2024-12-04 20:39:30'),
	(43,27,4,'华为智慧屏V系列','http://localhost:9090/uploads/1733314736583-755730519.jpeg',5999.00,NULL,1,'2024-12-04 20:39:30'),
	(44,28,3,'小米平板5 Pro','https://tse1-mm.cn.bing.net/th/id/OIP-C.-vUU_h21O8DZiyAhjywGcgHaHa?w=182&h=182&c=7&r=0&o=5&dpr=2&pid=1.7',2399.00,NULL,4,'2024-12-04 20:47:13'),
	(45,28,4,'华为智慧屏V系列','http://localhost:9090/uploads/1733314736583-755730519.jpeg',5999.00,NULL,1,'2024-12-04 20:47:13'),
	(46,29,2,'小米12 Pro','http://localhost:9090/uploads/1733314708710-28482361.jpeg',4699.00,NULL,1,'2024-12-04 20:53:17'),
	(47,29,5,'HUAWEI P50 Pro','http://localhost:9090/uploads/1733314770594-353680803.jpg',6488.00,NULL,1,'2024-12-04 20:53:17');

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
	(1,'202401010001',5,3999.00,2,1,'广东省','深圳市','南山区','科技园南路123号','张三','13800138001',1,NULL,NULL,1,NULL,'2024-12-01 23:31:26','2024-12-01 23:31:26'),
	(8,'1733069091393497',5,12397.00,1,1,'广东省','深圳市','南山区','科技园南路123号','张三','13800138001',1,NULL,'2024-12-02 00:04:54',1,'','2024-12-02 00:04:51','2024-12-02 00:04:54'),
	(9,'1733070015488650',5,3999.00,0,1,'广东省','深圳市','南山区','科技园南路123号','张三','13800138001',1,NULL,NULL,1,'','2024-12-02 00:20:15','2024-12-02 00:20:15'),
	(10,'1733070020133643',5,3999.00,4,1,'广东省','深圳市','南山区','科技园南路123号','张三','13800138001',1,NULL,NULL,1,'','2024-12-02 00:20:20','2024-12-02 00:24:34'),
	(11,'1733070154784110',5,3999.00,2,1,'广东省','深圳市','南山区','科技园南路123号','张三','13800138001',1,NULL,'2024-12-02 00:24:08',1,'','2024-12-02 00:22:34','2024-12-02 10:26:07'),
	(12,'1733070566920198',5,6398.00,1,1,'广东省','深圳市','南山区','科技园南路123号','张三','13800138001',1,NULL,'2024-12-02 00:29:29',1,'','2024-12-02 00:29:26','2024-12-02 00:29:29'),
	(13,'1733070780470382',5,11397.00,0,1,'广东省','深圳市','南山区','科技园南路123号','张三','13800138001',1,NULL,NULL,1,'','2024-12-02 00:33:00','2024-12-02 00:33:00'),
	(14,'1733070987800604',5,2399.00,1,2,'北京市','北京市','朝阳区','三里屯SOHO','张三','13800138001',1,NULL,'2024-12-02 00:36:30',1,'','2024-12-02 00:36:27','2024-12-02 00:36:30'),
	(15,'1733071283118677',5,2399.00,2,1,'广东省','深圳市','南山区','科技园南路123号','张三','13800138001',1,NULL,'2024-12-02 00:41:25',1,'','2024-12-02 00:41:23','2024-12-02 12:17:34'),
	(17,'1733310811434223',5,21863.00,0,5,'广东省','广州市','越秀区','1','阿亻2','13122223332',1,NULL,NULL,1,'','2024-12-04 19:13:31','2024-12-04 19:13:31'),
	(18,'173331081293281',5,21863.00,0,5,'广东省','广州市','越秀区','1','阿亻2','13122223332',1,NULL,NULL,1,'','2024-12-04 19:13:32','2024-12-04 19:13:32'),
	(19,'1733310826915542',5,21863.00,0,5,'广东省','广州市','越秀区','1','阿亻2','13122223332',1,NULL,NULL,1,'','2024-12-04 19:13:46','2024-12-04 19:13:46'),
	(20,'1733310855461412',5,21863.00,0,5,'广东省','广州市','越秀区','1','阿亻2','13122223332',1,NULL,NULL,1,'','2024-12-04 19:14:15','2024-12-04 19:14:15'),
	(21,'1733311317370101',5,15595.00,0,5,'广东省','广州市','越秀区','1','阿亻2','13122223332',1,NULL,NULL,1,'','2024-12-04 19:21:57','2024-12-04 19:21:57'),
	(22,'1733313592302102',5,2399.00,1,1,'广东省','深圳市','南山区','科技园南路123号','张三2','13800138001',1,NULL,'2024-12-04 20:31:05',1,'','2024-12-04 19:59:52','2024-12-04 20:31:05'),
	(23,'1733313592955988',5,2399.00,0,1,'广东省','深圳市','南山区','科技园南路123号','张三2','13800138001',1,NULL,NULL,1,'','2024-12-04 19:59:52','2024-12-04 19:59:52'),
	(24,'1733313724347566',5,2399.00,3,1,'广东省','深圳市','南山区','科技园南路123号','张三2','13800138001',1,NULL,'2024-12-04 20:02:06',1,'','2024-12-04 20:02:04','2024-12-04 20:05:20'),
	(25,'173331538043491',5,18975.00,3,5,'广东省','广州市','越秀区','1','阿亻2','13122223332',1,NULL,'2024-12-04 20:29:49',1,'','2024-12-04 20:29:40','2024-12-04 20:30:28'),
	(26,'1733315895024974',5,15595.00,1,6,'广东省','广州市','天河区','123','aren','13133334444',1,NULL,'2024-12-04 20:38:17',1,'','2024-12-04 20:38:15','2024-12-04 20:38:17'),
	(27,'1733315970473750',5,15595.00,0,6,'广东省','广州市','天河区','123','aren','13133334444',1,NULL,NULL,1,'','2024-12-04 20:39:30','2024-12-04 20:39:30'),
	(28,'1733316433895488',5,15595.00,1,6,'广东省','广州市','天河区','123','aren','13133334444',1,NULL,'2024-12-04 20:47:16',1,'','2024-12-04 20:47:13','2024-12-04 20:47:16'),
	(29,'1733316797286504',5,11187.00,1,5,'广东省','广州市','越秀区','1','阿亻2','13122223332',1,NULL,'2024-12-04 20:53:19',1,'','2024-12-04 20:53:17','2024-12-04 20:53:19');

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
	(1,2,2,'小米全面屏电视Pro','全面屏设计，4K HDR，内置小爱同学',3999.00,0.00,95,55,'http://localhost:9090/uploads/1733314680734-835256550.jpeg','北京市朝阳区',1,'2024-12-01 23:31:26','2024-12-04 20:35:54'),
	(2,7,2,'小米12 Pro','骁龙8 Gen1，2K AMOLED屏幕',4699.00,4999.00,999,501,'http://localhost:9090/uploads/1733314708710-28482361.jpeg','北京市朝阳区',1,'2024-12-01 23:31:26','2024-12-04 20:53:17'),
	(3,8,2,'小米平板5 Pro','骁龙870，2.5K LCD屏幕',2399.00,2599.00,467,233,'https://tse1-mm.cn.bing.net/th/id/OIP-C.-vUU_h21O8DZiyAhjywGcgHaHa?w=182&h=182&c=7&r=0&o=5&dpr=2&pid=1.7','北京市朝阳区',1,'2024-12-01 23:31:26','2024-12-04 20:47:13'),
	(4,2,3,'华为智慧屏V系列','鸿蒙系统，4K超清，AI音画质引擎',5999.00,6999.00,70,40,'http://localhost:9090/uploads/1733314736583-755730519.jpeg','深圳市龙岗区',1,'2024-12-01 23:31:26','2024-12-04 20:47:13'),
	(5,7,3,'HUAWEI P50 Pro','骁龙888，超感知徕卡影像',6488.00,6988.00,785,315,'http://localhost:9090/uploads/1733314770594-353680803.jpg','深圳市龙岗区',1,'2024-12-01 23:31:26','2024-12-04 20:53:17'),
	(6,9,3,'HUAWEI MatePad Pro','麒麟9000，2.5K OLED屏幕',3799.00,4099.00,397,153,'http://localhost:9090/uploads/1733314799316-395648121.jpeg','深圳市龙岗区',1,'2024-12-01 23:31:26','2024-12-04 20:20:05');

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
	(1,5,'张三2','13800138001','广东省','深圳市','南山区','科技园南路123号',0,'2024-12-01 23:31:26','2024-12-04 20:38:09'),
	(2,5,'张三','13800138001','北京市','北京市','朝阳区','三里屯SOHO',0,'2024-12-01 23:31:26','2024-12-01 23:31:26'),
	(5,5,'阿亻2','13122223332','广东省','广州市','越秀区','1',0,'2024-12-02 00:32:47','2024-12-04 16:11:13'),
	(6,5,'aren','13133334444','广东省','广州市','天河区','123',1,'2024-12-04 20:38:09','2024-12-04 20:38:09');

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
	(1,'admin','admin123','超级管理','13900000000','admin@example.com','https://img01.yzcdn.cn/vant/cat.jpeg',0,'2024-12-01 23:31:26','2024-12-04 20:31:42'),
	(2,'xiaomi','123456','管理员','13911111111','seller1@example.com','https://img01.yzcdn.cn/vant/cat.jpeg',1,'2024-12-01 23:31:26','2024-12-04 19:48:39'),
	(3,'huawei','123456','华为官方旗舰','13922222222','seller2@example.com','https://img01.yzcdn.cn/vant/cat.jpeg',1,'2024-12-01 23:31:26','2024-12-04 20:50:50'),
	(5,'test1','123456','张三1','13800138002','zhangsan@2e.com','http://localhost:9090/uploads/1733315448774-554512136.png',0,'2024-12-01 23:31:26','2024-12-04 20:30:49');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
