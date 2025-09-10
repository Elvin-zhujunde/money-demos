const express = require('express')
const router = express.Router()
const songController = require('./controllers/song.controller')
const playlistController = require('./controllers/playlist.controller')
const userController = require('./controllers/user.controller')
const auth = require('./middleware/auth')
const authController = require('./controllers/auth.controller')
const commentController = require('./controllers/comment.controller')
const adminController = require('./controllers/admin.controller')
const multer = require('multer')
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 限制 10MB
  }
})

// 歌曲相关接口
router.get('/songs/random', songController.getRandomSong) // 获取随机歌曲

router.get('/songs/search', songController.searchSongs) // 搜索歌曲
router.get('/songs/hot', auth, songController.getHotSongs) // 获取热门歌曲
router.get('/songs/new', auth, songController.getNewSongs) // 获取新歌
router.get('/songs/personal', auth, songController.getPersonalRecommends) // 获取个性化推荐(需要登录)
router.get('/songs/:id', songController.getSongDetail) // 获取歌曲详情
router.post('/songs/:id/like', auth, songController.toggleLikeSong) // 收藏/取消收藏歌曲(需要登录)
router.post('/songs/:id/check-like', auth, songController.checkLikeStatus) // 检查是否喜欢歌曲
router.post('/songs/:id/play', songController.updatePlayCount) // 更新播放次数

// 歌单相关接口
router.get('/playlists', playlistController.getPlaylists) // 获取歌单列表
router.get('/playlists/user', auth, playlistController.getUserPlaylists) // 获取用户创建的歌单列表

router.get('/playlists/:id', playlistController.getPlaylistDetail) // 获取歌单详情
router.post('/playlists', auth, playlistController.createPlaylist) // 创建歌单
router.put('/playlists/:id', auth, playlistController.updatePlaylist) // 更新歌单
router.delete('/playlists/:id', auth, playlistController.deletePlaylist) // 删除歌单
router.post('/playlists/:id/subscribe', auth, playlistController.toggleCollectPlaylist) // 收藏/取消收藏歌单
router.post('/playlists/:id/check-subscribe', auth, playlistController.checkSubscribeStatus) // 检查是否收藏歌单
router.post('/playlists/:id/songs', auth, playlistController.addSongToPlaylist) // 向歌单添加歌曲

// 用户相关接口
router.get('/user/info/:id?', userController.getUserInfo) // 获取用户信息
router.put('/user/info', auth, userController.updateUserInfo) // 更新用户信息
router.get('/user/likes/songs', auth, userController.getLikedSongs) // 获取喜欢的歌曲
router.post('/user/likes/songs/batch', auth, userController.batchLikeSongs) // 批量操作喜欢的歌曲
router.get('/user/playlists/created', auth, userController.getCreatedPlaylists) // 获取创建的歌单
router.get('/user/playlists/collected', auth, userController.getCollectedPlaylists) // 获取收藏的歌单
router.get('/user/play-history', auth, userController.getPlayHistory) // 获取播放历史
router.delete('/user/play-history', auth, userController.clearPlayHistory) // 清空播放历史

// 认证相关接口
router.post('/auth/register', authController.register) // 用户注册
router.post('/auth/login', authController.login) // 用户登录

// 评论相关接口
router.get('/songs/:songId/comments', commentController.getSongComments) // 获取评论列表
router.post('/songs/:songId/comments', auth, commentController.addComment) // 发表评论
router.delete('/songs/:songId/comments/:commentId', auth, commentController.deleteComment) // 删除评论

// 管理后台接口
router.get('/admin/songs', auth, adminController.getSongList) // 获取歌曲列表
router.post('/admin/songs/upload/file', auth, upload.single('file'), adminController.uploadSongFile) // 上传歌曲文件
router.post('/admin/songs/upload/cover', auth, upload.single('file'), adminController.uploadSongCover) // 上传歌曲封面
router.post('/admin/songs', auth, adminController.createSong) // 创建歌曲
router.put('/admin/songs/:id', auth, adminController.updateSong) // 更新歌曲
router.delete('/admin/songs/:id', auth, adminController.deleteSong) // 删除歌曲
router.get('/admin/audio-files', auth, adminController.getAudioFiles) // 获取音频文件列表
router.put('/admin/songs/:id/status', auth, adminController.updateSongStatus) // 更新歌曲状态

// 用户管理接口
router.get('/admin/users', auth, adminController.getUserList)
router.post('/admin/users', auth, adminController.createUser)
router.put('/admin/users/:id', auth, adminController.updateUser)
router.delete('/admin/users/:id', auth, adminController.deleteUser)
router.post('/admin/users/upload/avatar', auth, upload.single('file'), adminController.uploadAvatar)

// 排行榜接口
router.get('/songs/rank/new', auth, songController.getNewSongRank) // 新歌排行榜
router.get('/songs/rank/hot', auth, songController.getHotSongRank) // 热门排行榜

// 仪表盘接口
router.get('/admin/dashboard/stats', auth, adminController.getDashboardStats)

// 歌单管理接口
router.get('/admin/playlists', auth, adminController.getPlaylistList)
router.put('/admin/playlists/:id', auth, adminController.updatePlaylist)
router.delete('/admin/playlists/:id', auth, adminController.deletePlaylist)

// ... 其他路由

module.exports = router
