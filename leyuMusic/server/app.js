const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const app = express()

// 中间件配置
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// 创建上传目录
const uploadDirs = ['audio', 'img', 'avatar']
uploadDirs.forEach(dir => {
  const uploadPath = path.join(__dirname, 'uploads', dir)
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true })
  }
})

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// 文件上传配置
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const type = file.mimetype.startsWith('image/') ? 'images' : 'audio'
        cb(null, `uploads/${type}`)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })

// 引入统一路由
const routes = require('./route')

// 注册路由
app.use('/api', routes)

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send({
        code: 500,
        message: '服务器错误'
    })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

module.exports = app
