// 创建一个工具函数来处理用户信息解码
exports.decodeUserInfo = (req) => {
  try {
    const userInfoEncoded = req.headers['user-info'] || ''
    return JSON.parse(decodeURIComponent(userInfoEncoded) || '{}')
  } catch (error) {
    console.error('解析用户信息失败:', error)
    return {}
  }
} 