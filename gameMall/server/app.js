const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();

// 允许跨域
app.use(cors());

// 解析 JSON 请求体
app.use(express.json());

// 确保上传目录存在
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// API 路由
app.use('/api', require('./routes/api'));

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    code: 500,
    message: '服务器错误'
  });
});

const PORT = process.env.PORT || 9090;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});