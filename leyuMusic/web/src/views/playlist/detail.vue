<template>
  <div class="playlist-detail">
    <!-- 返回按钮 -->
    <div class="back-btn">
      <a-button @click="$router.back()">
        <a-icon type="arrow-left" />返回
      </a-button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-wrapper">
      <a-spin size="large" />
    </div>

    <!-- 歌单内容 -->
    <template v-else-if="playlistInfo">
      <!-- 歌单信息 -->
      <div class="playlist-info">
        <div class="cover">
          <img :src="playlistInfo.cover_image || 'https://picsum.photos/300/300'" :alt="playlistInfo.name" />
        </div>
        <div class="info">
          <h1 class="name">{{ playlistInfo.name }}</h1>
          <div class="creator">
            <a-avatar :src="playlistInfo.creator_avatar" />
            <span class="nickname">{{ playlistInfo.creator_name }}</span>
            <span class="create-time">{{ formatTime(playlistInfo.created_at) }}</span>
          </div>
          <div class="actions">
            <a-button 
              type="primary" 
              @click="playAll"
              :disabled="!playlistInfo.songs?.length"
            >
              <a-icon type="play-circle" />播放全部
            </a-button>
            <a-button @click="toggleCollect">
              <a-icon :type="playlistInfo.is_subscribed ? 'heart' : 'heart-o'" />
              {{ playlistInfo.is_subscribed ? '已收藏' : '收藏' }}
            </a-button>
            <a-button 
              v-if="isCreator"
              @click="showEditModal"
              style="margin-left: 12px"
            >
              <a-icon type="edit" />编辑
            </a-button>
          </div>
          <div class="description" v-if="playlistInfo.description">
            <p>简介：{{ playlistInfo.description }}</p>
          </div>
          <div class="counts">
            <span>{{ playlistInfo.songs?.length || 0 }}首歌</span>
            <span>播放{{ formatCount(playlistInfo.play_count || 0) }}次</span>
          </div>
        </div>
      </div>

      <!-- 使用改进后的 SongList 组件 -->
      <div class="songs-wrapper">
        <SongList :songs="playlistInfo.songs" />
      </div>
    </template>

    <!-- 错误状态 -->
    <div v-else class="error-state">
      <a-empty description="歌单不存在" />
    </div>

    <!-- 编辑歌单弹窗 -->
    <a-modal
      title="编辑歌单"
      cancelText="取消"
      :visible="editModalVisible"
      @ok="handleEditSubmit"
      @cancel="editModalVisible = false"
      :confirmLoading="submitting"
    >
      <a-form-model :model="editForm" :rules="rules" ref="editForm">
        <a-form-model-item label="歌单封面">
          <div class="cover-uploader">
            <a-upload
              name="file"
              :show-upload-list="false"
              :before-upload="beforeCoverUpload"
              @change="handleCoverChange"
              accept="image/*"
            >
              <img v-if="editForm.cover_image" :src="editForm.cover_image" class="cover-preview" />
              <div v-else class="upload-placeholder">
                <a-icon type="plus" />
                <div>上传封面</div>
              </div>
            </a-upload>
          </div>
        </a-form-model-item>

        <a-form-model-item label="歌单名称" prop="name">
          <a-input v-model="editForm.name" placeholder="请输入歌单名称" />
        </a-form-model-item>

        <a-form-model-item label="歌单简介" prop="description">
          <a-textarea 
            v-model="editForm.description" 
            placeholder="请输入歌单简介"
            :rows="4"
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'
import SongList from '@/components/SongList.vue'

export default {
  name: 'PlaylistDetail',
  components: {
    SongList
  },
  data() {
    return {
      loading: true,
      playlistInfo: null,
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          width: 60,
          scopedSlots: { customRender: 'index' }
        },
        {
          title: '歌曲',
          dataIndex: 'title',
          scopedSlots: { customRender: 'title' }
        },
        {
          title: '操作',
          width: 100,
          scopedSlots: { customRender: 'action' }
        }
      ],
      editModalVisible: false,
      submitting: false,
      editForm: {
        name: '',
        description: '',
        cover_image: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入歌单名称', trigger: 'blur' },
          { max: 50, message: '名称不能超过50个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters('user', ['isLogin']),
    ...mapGetters('player', ['currentSong', 'playing']),
    isCreator() {
      return this.playlistInfo?.user_id === this.$store.state.user.userInfo?.id
    }
  },
  methods: {
    async fetchPlaylistDetail() {
      console.log(this.$store.state.user.userInfo?.id);
      
      this.loading = true
      try {
        const res = await this.$http.get(`/api/playlists/${this.$route.params.id}`)
        if (res.code === 200) {
          this.playlistInfo = res.data
          
          // 如果用户已登录,获取收藏状态
          if (this.isLogin) {
            const subscribeRes = await this.$http.post(`/api/playlists/${this.$route.params.id}/check-subscribe`)
            if (subscribeRes.code === 200) {
              this.playlistInfo.is_subscribed = subscribeRes.data.is_subscribed
            }
          }
        }
      } catch (error) {
        console.error(error)
        this.$message.error('获取歌单详情失败')
      } finally {
        this.loading = false
      }
    },
    formatTime(time) {
      return dayjs(time).format('YYYY-MM-DD')
    },
    isPlaying(song) {
      return this.currentSong?.id === song.id && this.playing
    },
    playAll() {
      if (!this.playlistInfo.songs?.length) {
        return this.$message.warning('暂无可播放的歌曲')
      }
      this.$store.dispatch('player/playAll', this.playlistInfo.songs)
    },
    playSong(song) {
      this.$store.dispatch('player/play', song)
    },
    async toggleCollect() {
      if (!this.isLogin) {
        return this.$message.warning('请先登录')
      }
      
      try {
        const type = this.playlistInfo.is_subscribed ? 'unsubscribe' : 'subscribe'
        const res = await this.$http.post(`/api/playlists/${this.playlistInfo.id}/subscribe`, {
          type
        })
        
        if (res.code === 200) {
          this.playlistInfo.is_subscribed = !this.playlistInfo.is_subscribed
          this.$message.success(res.message)
        }
      } catch (error) {
        console.error('收藏操作失败:', error)
        this.$message.error(error.message)
      }
    },
    async toggleLike(song) {
      if (!this.isLogin) {
        return this.$message.warning('请先登录')
      }
      try {
        const res = await this.$http.post(`/api/songs/${song.id}/like`, {
          type: song.is_liked ? 'unlike' : 'like'
        })
        if (res.code === 200) {
          song.is_liked = !song.is_liked
          this.$message.success(res.message)
        }
      } catch (error) {
        console.error(error)
        this.$message.error('操作失败')
      }
    },
    formatCount(count) {
      if (!count) return '0'
      return count < 10000 ? count : Math.floor(count / 10000) + '万'
    },
    showEditModal() {
      this.editForm = {
        name: this.playlistInfo.name,
        description: this.playlistInfo.description,
        cover_image: this.playlistInfo.cover_image
      }
      this.editModalVisible = true
    },
    beforeCoverUpload(file) {
      const isImage = file.type.startsWith('image/')
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isImage) {
        this.$message.error('只能上传图片文件!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 2MB!')
        return false
      }

      return false
    },
    async handleCoverChange({ file }) {
      if (file.status !== 'uploading') {
        try {
          const formData = new FormData()
          formData.append('file', file)

          const res = await this.$http.post('/api/admin/songs/upload/cover', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })

          if (res.code === 200) {
            this.editForm.cover_image = res.data.url
            this.$message.success('封面上传成功')
          }
        } catch (error) {
          console.error('上传封面失败:', error)
          this.$message.error('上传封面失败')
        }
      }
    },
    async handleEditSubmit() {
      try {
        await this.$refs.editForm.validate()
        this.submitting = true
        
        const res = await this.$http.put(`/api/playlists/${this.playlistInfo.id}`, {
          name: this.editForm.name,
          description: this.editForm.description,
          cover_image: this.editForm.cover_image
        })

        if (res.code === 200) {
          this.$message.success('更新成功')
          this.editModalVisible = false
          // 重新获取歌单信息
          this.fetchPlaylistDetail()
        }
      } catch (error) {
        console.error('更新歌单失败:', error)
        this.$message.error('更新失败')
      } finally {
        this.submitting = false
      }
    }
  },
  created() {
    this.fetchPlaylistDetail()
  }
}
</script>

<style lang="less" scoped>
.playlist-detail {
  padding: 20px;
  min-height: 400px;

  .back-btn {
    margin-bottom: 20px;
  }

  .playlist-info {
    display: flex;
    margin-bottom: 40px;

    .cover {
      width: 200px;
      height: 200px;
      margin-right: 40px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 8px;
      }
    }

    .info {
      flex: 1;

      .name {
        font-size: 24px;
        font-weight: 500;
        margin-bottom: 16px;
      }

      .creator {
        display: flex;
        align-items: center;
        margin-bottom: 24px;

        .nickname {
          margin: 0 12px;
          color: #666;
        }

        .create-time {
          color: #999;
        }
      }

      .actions {
        margin-bottom: 24px;

        .ant-btn {
          margin-right: 12px;

          &[disabled] {
            cursor: not-allowed;
            opacity: 0.5;
          }
        }
      }

      .description {
        color: #666;
        margin-bottom: 16px;
      }

      .counts {
        color: #999;
        font-size: 14px;

        span {
          margin-right: 16px;
        }
      }
    }
  }

  .songs-wrapper {
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      margin-bottom: 20px;

      .title {
        font-size: 20px;
        font-weight: 500;
      }

      .count {
        color: #999;
      }
    }

    .list {
      .song-item {
        display: flex;
        align-items: center;
        padding: 12px 20px;
        border-radius: 8px;
        transition: all 0.3s;

        &:hover {
          background: #f5f5f5;

          .index {
            .playing-icon {
              display: block;
            }
            span {
              display: none;
            }
          }
        }

        &.active {
          background: #f5f5f5;

          .name {
            color: #000;
            font-weight: 500;
          }

          .index {
            color: #000;
          }
        }

        .index {
          width: 40px;
          text-align: center;
          color: #999;
          font-size: 14px;
          cursor: pointer;

          span.top-3 {
            color: #000;
            font-weight: 500;
          }

          .playing-icon {
            display: none;
            color: #000;
            font-size: 16px;
          }
        }

        .info {
          flex: 1;
          display: flex;
          align-items: center;
          cursor: pointer;
          padding-right: 20px;

          .cover {
            width: 50px;
            height: 50px;
            border-radius: 4px;
            margin-right: 16px;
          }

          .text {
            flex: 1;
            min-width: 0; // 解决文字溢出问题

            .name {
              font-size: 14px;
              margin-bottom: 4px;
              @include text-overflow;
            }

            .singer {
              font-size: 12px;
              color: #999;
              @include text-overflow;
            }
          }
        }

        .actions {
          display: flex;
          align-items: center;
          gap: 16px;

          .anticon {
            font-size: 16px;
            cursor: pointer;
            color: #999;
            transition: all 0.3s;

            &:hover {
              color: #000;
            }

            &.active {
              color: #ff4d4f;
            }
          }
        }
      }
    }

    .empty-state {
      padding: 40px 0;
      text-align: center;
    }
  }

  .loading-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
  }

  .error-state {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
  }
}

.cover-uploader {
  text-align: center;
  
  .cover-preview {
    width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    cursor: pointer;
  }

  .upload-placeholder {
    width: 200px;
    height: 200px;
    background: #fafafa;
    border: 1px dashed #d9d9d9;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #999;

    &:hover {
      border-color: #000;
      color: #000;
    }

    .anticon {
      font-size: 24px;
      margin-bottom: 8px;
    }
  }
}
</style> 