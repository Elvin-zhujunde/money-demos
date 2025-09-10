-- 删除数据库如果存在
DROP DATABASE IF EXISTS aigoMall;

-- 创建数据库
CREATE DATABASE aigoMall DEFAULT CHARACTER SET utf8mb4;

-- 使用数据库
USE aigoMall;

-- 用户表
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(100) NOT NULL COMMENT '密码',
    name VARCHAR(50) COMMENT '昵称',
    phone VARCHAR(20) COMMENT '手机号',
    email VARCHAR(100) COMMENT '邮箱',
    avatar VARCHAR(200) DEFAULT 'https://img01.yzcdn.cn/vant/cat.jpeg' COMMENT '头像URL',
    role TINYINT DEFAULT 0 COMMENT '用户角色：0-普通用户，1-商家，2-超级管理员',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 商品分类表
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '分类ID',
    name VARCHAR(50) NOT NULL COMMENT '分类名称',
    parent_id INT DEFAULT 0 COMMENT '父分类ID',
    level INT DEFAULT 1 COMMENT '分类层级',
    sort INT DEFAULT 0 COMMENT '排序',
    icon VARCHAR(200) COMMENT '分类图标',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品分类表';

-- 收货地址表
CREATE TABLE shipping_addresses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL COMMENT '用户ID',
    receiver VARCHAR(50) NOT NULL COMMENT '收货人',
    phone VARCHAR(20) NOT NULL COMMENT '联系电话',
    province VARCHAR(50) NOT NULL COMMENT '省份',
    city VARCHAR(50) NOT NULL COMMENT '城市',
    district VARCHAR(50) NOT NULL COMMENT '区县',
    detail_address TEXT NOT NULL COMMENT '详细地址',
    is_default TINYINT DEFAULT 0 COMMENT '是否默认地址：0-否，1-是',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收货地址表';


-- 商品表
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '商品ID',
    category_id INT NOT NULL COMMENT '分类ID',
    seller_id INT NOT NULL COMMENT '商家ID',
    title VARCHAR(200) NOT NULL COMMENT '商品标题',
    description TEXT COMMENT '商品描述',
    price DECIMAL(10,2) NOT NULL COMMENT '商品价格',
    original_price DECIMAL(10,2) COMMENT '原价',
    stock INT NOT NULL DEFAULT 0 COMMENT '库存数量',
    sales INT DEFAULT 0 COMMENT '销量',
    cover VARCHAR(200) COMMENT '商品封面图',
    shipping_from VARCHAR(100) NOT NULL COMMENT '发货地',
    status TINYINT DEFAULT 1 COMMENT '商品状态：0-下架，1-上架',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (seller_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品表';

-- 订单表
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '订单ID',
    order_no VARCHAR(50) NOT NULL UNIQUE COMMENT '订单编号',
    user_id INT NOT NULL COMMENT '用户ID',
    total_amount DECIMAL(10,2) NOT NULL COMMENT '订单总金额',
    status TINYINT DEFAULT 0 COMMENT '订单状态：0-待付款，1-待发货，2-待收货，3-已完成，4-已取消',
    address_id INT NOT NULL COMMENT '收货地址ID',
    province VARCHAR(50) COMMENT '省份',
    city VARCHAR(50) COMMENT '城市',
    district VARCHAR(50) COMMENT '区县',
    detail_address TEXT COMMENT '详细地址',
    receiver VARCHAR(50) NOT NULL COMMENT '收货人',
    receiver_phone VARCHAR(20) NOT NULL COMMENT '收货人电话',
    payment_method TINYINT COMMENT '支付方式：1-微信，2-支付宝',
    payment_no VARCHAR(100) COMMENT '支付单号',
    paid_time DATETIME COMMENT '支付时间',
    source TINYINT DEFAULT 1 COMMENT '订单来源：1-购物车，2-直接购买',
    remark VARCHAR(200) COMMENT '订单备注',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (address_id) REFERENCES shipping_addresses(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';

-- 订单详情表
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '订单项ID',
    order_id INT NOT NULL COMMENT '订单ID',
    product_id INT NOT NULL COMMENT '商品ID',
    product_title VARCHAR(200) NOT NULL COMMENT '商品标题',
    product_cover VARCHAR(200) COMMENT '商品图片',
    product_price DECIMAL(10,2) NOT NULL COMMENT '商品价格',
    original_price DECIMAL(10,2) COMMENT '商品原价',
    quantity INT NOT NULL COMMENT '购买数量',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单详情表';

-- 购物车表
CREATE TABLE cart (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '购物车ID',
    user_id INT NOT NULL COMMENT '用户ID',
    product_id INT NOT NULL COMMENT '商品ID',
    quantity INT NOT NULL DEFAULT 1 COMMENT '商品数量',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    UNIQUE KEY user_product (user_id, product_id) COMMENT '同一用户同一商品只能有一条记录'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='购物车表';


-- 轮播图表
CREATE TABLE banners (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) COMMENT '轮播图标题',
    image_url VARCHAR(255) COMMENT '图片URL',
    link_url VARCHAR(255) COMMENT '跳转链接',
    sort_order INT COMMENT '排序号',
    status TINYINT DEFAULT 1 COMMENT '状态：0-禁用 1-启用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='轮播图表';

-- 插入用户数据
INSERT INTO users (username, password, name, role, phone, email) VALUES
-- 超级管理员
('admin', 'admin123', '超级管理员', 2, '13900000000', 'admin@example.com'),
-- 商家账号
('seller1', 'seller123', '小米官方旗舰店', 1, '13911111111', 'seller1@example.com'),
('seller2', 'seller123', '华为官方旗舰店', 1, '13922222222', 'seller2@example.com'),
('seller3', 'seller123', '海尔官方旗舰店', 1, '13933333333', 'seller3@example.com'),
-- 普通用户
('test1', '123456', '张三', 0, '13800138001', 'zhangsan@example.com'),
('test2', '123456', '李四', 0, '13800138002', 'lisi@example.com');

-- 插入商品分类
INSERT INTO categories (name, parent_id, level, sort, icon) VALUES
-- 家用电器
('家用电器', 0, 1, 1, 'https://img01.yzcdn.cn/vant/apple-1.jpg'),
('电视', 1, 2, 1, 'https://img01.yzcdn.cn/vant/apple-2.jpg'),
('空调', 1, 2, 2, 'https://img01.yzcdn.cn/vant/apple-3.jpg'),
('洗衣机', 1, 2, 3, 'https://img01.yzcdn.cn/vant/apple-4.jpg'),
('冰箱', 1, 2, 4, 'https://img01.yzcdn.cn/vant/apple-5.jpg'),

-- 手机数码
('手机数码', 0, 1, 2, 'https://img01.yzcdn.cn/vant/cat.jpeg'),
('手机', 6, 2, 1, 'https://img01.yzcdn.cn/vant/ipad.jpeg'),
('平板', 6, 2, 2, 'https://img01.yzcdn.cn/vant/cat.jpeg'),
('��记本', 6, 2, 3, 'https://img01.yzcdn.cn/vant/cat.jpeg'),
('智能手表', 6, 2, 4, 'https://img01.yzcdn.cn/vant/cat.jpeg'),

-- 电脑办公
('电脑办公', 0, 1, 3, 'https://img01.yzcdn.cn/vant/cat.jpeg'),
('台式机', 11, 2, 1, 'https://img01.yzcdn.cn/vant/cat.jpeg'),
('显示器', 11, 2, 2, 'https://img01.yzcdn.cn/vant/cat.jpeg'),
('打印机', 11, 2, 3, 'https://img01.yzcdn.cn/vant/cat.jpeg'),
('路由器', 11, 2, 4, 'https://img01.yzcdn.cn/vant/cat.jpeg');

-- 插入商品数据
INSERT INTO products 
(category_id, seller_id, title, description, price, original_price, stock, sales, cover, shipping_from, status) 
VALUES
-- 小米商品
(2, 2, '小米全面屏电视Pro', '全面屏设计，4K HDR，内置小爱同学', 3999.00, 4799.00, 100, 50, 'https://img.alicdn.com/imgextra/i4/O1CN01Tp04IC1mEUQvwJgAk_!!6000000004927-0-tps-2880-1070.jpg', '北京市朝阳区', 1),
(7, 2, '小米12 Pro', '骁龙8 Gen1，2K AMOLED屏幕', 4699.00, 4999.00, 1000, 500, 'https://example.com/mi12.jpg', '北京市朝阳区', 1),
(8, 2, '小米平板5 Pro', '骁龙870，2.5K LCD屏幕', 2399.00, 2599.00, 500, 200, 'https://example.com/pad5.jpg', '北京市朝阳区', 1),

-- 华为商品
(2, 3, '华为智慧屏V系列', '鸿蒙系统，4K超清，AI音画质引擎', 5999.00, 6999.00, 80, 30, 'https://img.alicdn.com/imgextra/i2/O1CN01FF1c3q1pZ2K3DFkqZ_!!6000000005374-0-tps-2880-1070.jpg', '深圳市龙岗区', 1),
(7, 3, 'HUAWEI P50 Pro', '骁龙888，超感知徕卡影像', 6488.00, 6988.00, 800, 300, 'https://example.com/p50.jpg', '深圳市龙岗区', 1),
(8, 3, 'HUAWEI MatePad Pro', '麒麟9000，2.5K OLED屏幕', 3799.00, 4099.00, 400, 150, 'https://example.com/matepad.jpg', '深圳市龙岗区', 1),

-- 海尔商品
(4, 4, '海尔洗烘一体机', '洗烘一体，智能烘干，除菌除螨', 4999.00, 5599.00, 80, 30, 'https://img.alicdn.com/imgextra/i3/O1CN01HwpETO1VnqoYMKhqz_!!6000000002699-0-tps-1200-1200.jpg', '青岛市崂山区', 1),
(5, 4, '海尔多门冰箱', '风冷无霜，变频节能，智能控温', 5999.00, 6599.00, 60, 25, 'https://img.alicdn.com/imgextra/i2/O1CN01FF1c3q1pZ2K3DFkqZ_!!6000000005374-0-tps-2880-1070.jpg', '青岛市崂山区', 1);

-- 插入轮播图数据
INSERT INTO banners (title, image_url, link_url, sort_order) VALUES
('新品上市', 'https://img.alicdn.com/imgextra/i4/O1CN01Tp04IC1mEUQvwJgAk_!!6000000004927-0-tps-2880-1070.jpg', '/products/1', 1),
('限时特惠', 'https://img.alicdn.com/imgextra/i2/O1CN01F1qr4H1yCGwVQ07Yg_!!6000000006546-2-tps-200-200.png', '/products/2', 2),
('品牌活动', 'https://img.alicdn.com/imgextra/i3/O1CN01Sbi5d11qnWR4g89Jk_!!6000000005544-0-tps-1200-1200.jpg', '/products/3', 3);

-- 插入收货地址测试数据
INSERT INTO shipping_addresses 
(user_id, receiver, phone, province, city, district, detail_address, is_default) 
VALUES
(5, '张三', '13800138001', '广东省', '深圳市', '南山区', '科技园南路123号', 1),
(5, '张三', '13800138001', '北京市', '北京市', '朝阳区', '三里屯SOHO', 0),
(6, '李四', '13800138002', '浙江省', '杭州市', '西湖区', '文三路478号', 1);

-- 插入购物车测试数据
INSERT INTO cart (user_id, product_id, quantity) VALUES
(5, 1, 1),
(5, 4, 1),
(6, 2, 2),
(6, 7, 2);

-- 基于已有商品和用户生成订单数据
INSERT INTO orders 
(order_no, user_id, total_amount, status, address_id, province, city, district, 
detail_address, receiver, receiver_phone, payment_method, source) 
VALUES
('202401010001', 5, 3999.00, 2, 1, '广东省', '深圳市', '南山区', 
'科技园南路123号', '张三', '13800138001', 1, 1),
('202401010002', 6, 8598.00, 1, 3, '浙江省', '杭州市', '西湖区', 
'文三路478号', '李四', '13800138002', 2, 1);

-- 插入订单详情数据（关联已有商品）
INSERT INTO order_items 
(order_id, product_id, product_title, product_cover, product_price, quantity) 
VALUES
(1, 1, '小米全面屏电视Pro', 'https://img.alicdn.com/imgextra/i4/O1CN01Tp04IC1mEUQvwJgAk_!!6000000004927-0-tps-2880-1070.jpg', 3999.00, 1),
(2, 4, '格力变频空调', 'https://img.alicdn.com/imgextra/i2/O1CN01F1qr4H1yCGwVQ07Yg_!!6000000006546-2-tps-200-200.png', 3699.00, 1),
(2, 7, '小天鹅滚筒洗衣机', 'https://img.alicdn.com/imgextra/i2/O1CN01S6Fh2t1yCGwVQ07Yg_!!6000000006546-0-tps-1200-1200.jpg', 4899.00, 1);
