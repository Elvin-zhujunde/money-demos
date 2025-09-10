const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { decodeUserInfo } = require('../utils/decode-user')

// 配置文件存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 确保上传目录存在
    const uploadDir = path.join(__dirname, '../public/uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    // 生成文件名: 时间戳 + 随机数 + 原始扩展名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

// 文件过滤器
const fileFilter = (req, file, cb) => {
  // 只允许上传图片
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('只允许上传 JPG/PNG/GIF 格式的图片!'), false)
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 限制文件大小为 5MB
  }
}).single('file') // 'file' 是上传字段的名称

// 文件上传处理
exports.uploadFile = (req, res) => {
  try {
    // 验证用户身份
    const userInfo = decodeUserInfo(req)
    console.log('------', userInfo);

    if (!userInfo || !userInfo.id) {
      return res.status(401).json({
        code: 401,
        message: '请先登录'
      })
    }

    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        console.error('Multer error:', err);
        return res.status(400).json({
          code: 400,
          message: '文件上传失败: ' + err.message
        })
      } else if (err) {
        console.error('Upload error:', err);
        return res.status(400).json({
          code: 400,
          message: err.message
        })
      }

      if (!req.file) {
        console.error('No file uploaded');
        return res.status(400).json({
          code: 400,
          message: '请选择要上传的文件'
        })
      }

      const fileUrl = `/uploads/${req.file.filename}`
      console.log('File uploaded successfully:', fileUrl);
      res.json({
        code: 200,
        data: {
          url: fileUrl,
          filename: req.file.filename
        },
        message: '上传成功'
      })
    })
  } catch (error) {
    console.error('文件上传失败:', error)
    res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
} 