CREATE DATABASE IF NOT EXISTS volunteer_system;
USE volunteer_system;

-- 用户表
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    age INT NOT NULL,
    id_card VARCHAR(18) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    phone VARCHAR(11) NOT NULL,
    email VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    role TINYINT DEFAULT 0 COMMENT '0:志愿者,1:管理员,2:超级管理员',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_phone` (`phone`),
    UNIQUE KEY `uk_email` (`email`)
);

-- 活动表
CREATE TABLE activities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    creator_id INT NOT NULL,
    status TINYINT DEFAULT 0 COMMENT '0:未开始,1:进行中,2:已结束',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES users(id)
);

-- 活动报名表
CREATE TABLE activity_registrations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    activity_id INT NOT NULL,
    user_id INT NOT NULL,
    sign_status TINYINT DEFAULT 0 COMMENT '0:未签到,1:已签到',
    register_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sign_time DATETIME,
    FOREIGN KEY (activity_id) REFERENCES activities(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY `uk_activity_user` (`activity_id`, `user_id`)
);

-- 插入测试用户数据
INSERT INTO users (name, age, id_card, password, phone, email, address, role) VALUES
('管理员1', 30, '110101199001011234', 'admin123', '13800138001', 'admin1@example.com', '北京市朝阳区', 1),
('管理员2', 35, '110101199001011235', 'admin123', '13800138002', 'admin2@example.com', '北京市海淀区', 1),
('志愿者1', 20, '110101200001011236', 'vol123', '13800138003', 'vol1@example.com', '北京市西城区', 0),
('志愿者2', 22, '110101200001011237', 'vol123', '13800138004', 'vol2@example.com', '北京市东城区', 0),
('志愿者3', 25, '110101199801011238', 'vol123', '13800138005', 'vol3@example.com', '北京市丰台区', 0),
('志愿者4', 28, '110101199501011239', 'vol123', '13800138006', 'vol4@example.com', '北京市石景山区', 0),
('志愿者5', 21, '110101200101011240', 'vol123', '13800138007', 'vol5@example.com', '北京市通州区', 0);

-- 插入测试活动数据
INSERT INTO activities (name, description, start_time, end_time, location, creator_id, status) VALUES
('社区清洁日', '组织社区清洁活动，美化居住环境', '2024-03-20 09:00:00', '2024-03-20 17:00:00', '北京市朝阳区某社区', 1, 0),
('爱心助老行动', '探访社区老年人，提供生活帮助', '2024-03-25 14:00:00', '2024-03-25 17:00:00', '北京市海淀区养老院', 1, 0),
('植树节活动', '参与植树造林，保护生态环境', '2024-03-12 08:30:00', '2024-03-12 16:30:00', '北京市郊区植树基地', 2, 1),
('图书馆志愿服务', '协助图书馆整理图书、接待读者', '2024-03-15 09:00:00', '2024-03-15 16:00:00', '北京市图书馆', 2, 1),
('疫情防控宣传', '社区疫情防控知识宣传', '2024-02-28 09:00:00', '2024-02-28 17:00:00', '北京市各社区', 1, 2);

-- 插入测试活动报名数据
INSERT INTO activity_registrations (activity_id, user_id, sign_status, sign_time) VALUES
(1, 3, 0, NULL),
(1, 4, 0, NULL),
(2, 3, 0, NULL),
(2, 5, 0, NULL),
(3, 4, 1, '2024-03-12 08:45:00'),
(3, 6, 1, '2024-03-12 08:50:00'),
(4, 5, 1, '2024-03-15 09:10:00'),
(4, 7, 0, NULL),
(5, 3, 1, '2024-02-28 09:05:00'),
(5, 4, 1, '2024-02-28 09:15:00'),
(5, 5, 1, '2024-02-28 09:00:00');

-- 添加一个超级管理员账号
INSERT INTO users (name, age, id_card, password, phone, email, address, role) VALUES
('超级管理员', 40, '110101198001011236', 'admin123', '13800138000', 'super@example.com', '北京市', 2);
  