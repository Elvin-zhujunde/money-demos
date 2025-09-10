<template>
  <div class="my-music">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-content">
        <h1>我的音乐</h1>
        <p class="subtitle">在这里管理你的私人音乐收藏</p>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-wrapper">
      <a-tabs v-model="activeTab" class="custom-tabs">
        <!-- 我喜欢的音乐 -->
        <a-tab-pane key="liked" tab="我喜欢的音乐">
          <div class="section liked-section">
            <div class="section-header">
              <div class="left">
                <div class="icon-wrapper">
                  <a-icon type="heart" theme="filled" />
                </div>
                <div class="info">
                  <h2>我喜欢的音乐</h2>
                  <p>{{ likedSongsTotal }}首歌</p>
                </div>
              </div>
              <div class="actions">
                <a-button type="primary" @click="playAll(likedSongs)">
                  <a-icon type="play-circle" />播放全部
                </a-button>
              </div>
            </div>
            
            <song-list
              :songs="likedSongs"
              :empty-text="'还没有收藏任何歌曲'"
              @like-changed="onLikeChanged"
            />
          </div>
        </a-tab-pane>

        <!-- 创建的歌单 -->
        <a-tab-pane key="created" tab="创建的歌单">
          <div class="section playlist-section">
            <div class="section-header">
              <div class="left">
                <div class="icon-wrapper">
                  <a-icon type="folder" theme="filled" />
                </div>
                <div class="info">
                  <h2>创建的歌单</h2>
                  <p>{{ createdPlaylistsTotal }}个歌单</p>
                </div>
              </div>
              <div class="actions">
                <a-button type="primary" @click="showCreateForm = true">
                  <a-icon type="plus" />创建歌单
                </a-button>
              </div>
            </div>

            <div class="playlist-grid">
              <div
                v-for="playlist in createdPlaylists"
                :key="playlist.id"
                class="playlist-card"
                @click="goToPlaylist(playlist.id)"
              >
                <div class="cover-wrapper">
                  <img :src="playlist.cover_image || 'https://picsum.photos/200/200'" :alt="playlist.name" />
                  <div class="hover-mask">
                    <div class="play-btn" @click.stop="playPlaylist(playlist)">
                      <a-icon type="play-circle" />
                      播放全部
                    </div>
                    <div class="actions">
                      <a-button type="link" @click.stop="editPlaylist(playlist)">
                        <a-icon type="edit" />
                      </a-button>
                      <a-button type="link" @click.stop="handleDeletePlaylist(playlist.id)">
                        <a-icon type="delete" />
                      </a-button>
                    </div>
                  </div>
                </div>
                <div class="info">
                  <div class="name">{{ playlist.name }}</div>
                  <div class="desc">{{ playlist.song_count }}首歌</div>
                </div>
              </div>

              <div v-if="!createdPlaylists.length" class="empty-state">
                <a-empty description="还没有创建歌单">
                  <a-button type="primary" @click="showCreateForm = true">
                    立即创建
                  </a-button>
                </a-empty>
              </div>
            </div>
          </div>
        </a-tab-pane>

        <!-- 收藏的歌单 -->
        <a-tab-pane key="collected" tab="收藏的歌单">
          <div class="section playlist-section">
            <div class="section-header">
              <div class="left">
                <div class="icon-wrapper">
                  <a-icon type="star" theme="filled" />
                </div>
                <div class="info">
                  <h2>收藏的歌单</h2>
                  <p>{{ collectedPlaylistsTotal }}个歌单</p>
                </div>
              </div>
            </div>

            <div class="playlist-grid">
              <div
                v-for="playlist in collectedPlaylists"
                :key="playlist.id"
                class="playlist-card"
                @click="goToPlaylist(playlist.id)"
              >
                <div class="cover-wrapper">
                  <img :src="playlist.cover_image || 'https://picsum.photos/200/200'" :alt="playlist.name" />
                  <div class="hover-mask">
                    <div class="play-btn" @click.stop="playPlaylist(playlist)">
                      <a-icon type="play-circle" />
                      播放全部
                    </div>
                    <div class="actions">
                      <a-button type="link" @click.stop="unsubscribePlaylist(playlist)">
                        <a-icon type="delete" />
                      </a-button>
                    </div>
                  </div>
                </div>
                <div class="info">
                  <div class="name">{{ playlist.name }}</div>
                  <div class="desc">
                    <span>by {{ playlist.creator_name }}</span>
                    <span class="dot">·</span>
                    <span>{{ playlist.song_count }}首歌</span>
                  </div>
                </div>
              </div>

              <div v-if="!collectedPlaylists.length" class="empty-state">
                <a-empty description="还没有收藏歌单">
                  <a-button type="primary" @click="$router.push('/playlist')">
                    去发现歌单
                  </a-button>
                </a-empty>
              </div>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>

    <!-- 添加歌单表单 -->
    <playlist-form
      :visible="showCreateForm"
      :playlist="editingPlaylist"
      @cancel="closeForm"
      @success="onFormSuccess"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import SongList from '@/components/SongList.vue'
import PlaylistCard from '@/components/PlaylistCard.vue'
import PlaylistForm from '@/components/PlaylistForm.vue'

export default {
  name: 'MyMusic',
  components: {
    SongList,
    PlaylistCard,
    PlaylistForm
  },
  data() {
    return {
      activeTab: 'liked',
      likedSongs: [],
      likedSongsTotal: 0,
      playHistory: [],
      playHistoryTotal: 0,
      loading: false,
      showCreateForm: false,
      editingPlaylist: null,
      createdPlaylists: [],
      createdPlaylistsTotal: 0,
      collectedPlaylists: [],
      collectedPlaylistsTotal: 0
    }
  },
  created() {
    this.fetchLikedSongs()
    this.fetchPlayHistory()
    this.fetchCreatedPlaylists()
    this.fetchCollectedPlaylists()
  },
  methods: {
    ...mapActions('player', ['playAll']),
    
    async fetchLikedSongs() {
      try {
        const res = await this.$http.get('/api/user/likes/songs')
        if (res.code === 200) {
          this.likedSongs = res.data.list
          this.likedSongsTotal = res.data.total
        }
      } catch (error) {
        console.error('获取喜欢的音乐失败:', error)
        this.$message.error('获取喜欢的音乐失败')
      }
    },
    
    async fetchPlayHistory() {
      try {
        const res = await this.$http.get('/api/user/play-history')
        if (res.code === 200) {
          this.playHistory = res.data.list
          this.playHistoryTotal = res.data.total
        }
      } catch (error) {
        console.error('获取播放历史失败:', error)
        this.$message.error('获取播放历史失败')
      }
    },
    
    async fetchCreatedPlaylists() {
      try {
        const res = await this.$http.get('/api/user/playlists/created')
        if (res.code === 200) {
          this.createdPlaylists = res.data.list
          this.createdPlaylistsTotal = res.data.total
        }
      } catch (error) {
        console.error('获取创建的歌单失败:', error)
        this.$message.error('获取创建的歌单失败')
      }
    },
    
    async fetchCollectedPlaylists() {
      try {
        const res = await this.$http.get('/api/user/playlists/collected')
        if (res.code === 200) {
          this.collectedPlaylists = res.data.list
          this.collectedPlaylistsTotal = res.data.total
        }
      } catch (error) {
        console.error('获取收藏的歌单失败:', error)
        this.$message.error('获取收藏的歌单失败')
      }
    },
    
    async clearHistory() {
      try {
        await this.$confirm({
          title: '确认清空',
          content: '确定要清空播放历史吗？',
          okText: '确定',
          cancelText: '取消'
        })
        
        const res = await this.$http.delete('/api/user/play-history')
        if (res.code === 200) {
          this.playHistory = []
          this.playHistoryTotal = 0
          this.$message.success('清空成功')
        }
      } catch (error) {
        if (error) {
          console.error('清空播放历史失败:', error)
          this.$message.error('清空播放历史失败')
        }
      }
    },
    
    onLikeChanged(song) {
      // 如果在"我喜欢"标签页取消喜欢，需要从列表中移除
      if (this.activeTab === 'liked' && !song.is_liked) {
        this.likedSongs = this.likedSongs.filter(s => s.id !== song.id)
        this.likedSongsTotal--
      }
    },
    
    goToPlaylist(id) {
      this.$router.push(`/playlist/${id}`)
    },
    
    editPlaylist(playlist) {
      this.editingPlaylist = playlist
      this.showCreateForm = true
    },
    
    deletePlaylist(playlist) {
      this.$confirm({
        title: '确认删除',
        content: `确定要删除歌单 "${playlist.name}" 吗？`,
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          try {
            const res = await this.$http.delete(`/api/playlists/${playlist.id}`)
            if (res.code === 200) {
              this.fetchCreatedPlaylists()
              this.$message.success('删除成功')
            }
          } catch (error) {
            console.error('删除歌单失败:', error)
            this.$message.error('删除歌单失败')
          }
        }
      })
    },
    
    closeForm() {
      this.editingPlaylist = null
      this.showCreateForm = false
    },
    
    onFormSuccess() {
      this.fetchCreatedPlaylists()
      this.showCreateForm = false
      this.$message.success('操作成功')
    },
    
    async unsubscribePlaylist(playlist) {
      try {
        const res = await this.$http.post(`/api/playlists/${playlist.id}/subscribe`, {
          type: 'unsubscribe'
        })
        if (res.code === 200) {
          this.fetchCollectedPlaylists()
          this.$message.success('取消收藏成功')
        }
      } catch (error) {
        console.error('取消收藏失败:', error)
        this.$message.error('取消收藏失败')
      }
    },
    
    async handleDeletePlaylist(id) {
      try {
        const res = await this.$http.delete(`/api/playlists/${id}`)
        if (res.code === 200) {
          this.$message.success('删除成功')
          // 重新获取歌单列表
          this.fetchCreatedPlaylists()
        }
      } catch (error) {
        console.error('删除歌单失败:', error)
        this.$message.error('删除失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.my-music {
  min-height: 100vh;
  background: #f5f5f5;

  .page-header {
    background: #000;
    padding: 40px 0;
    margin-bottom: 24px;

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      color: #fff;

      h1 {
        font-size: 32px;
        font-weight: 600;
        margin: 0;
        margin-bottom: 8px;
      }

      .subtitle {
        font-size: 16px;
        color: rgba(255, 255, 255, 0.8);
        margin: 0;
      }
    }
  }

  .content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;

    .custom-tabs {
      :deep(.ant-tabs-nav) {
        margin-bottom: 24px;

        .ant-tabs-tab {
          font-size: 16px;
          padding: 12px 24px;
        }
      }
    }

    .section {
      background: #fff;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;

        .left {
          display: flex;
          align-items: center;
          gap: 16px;

          .icon-wrapper {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: #f5f5f5;
            display: flex;
            align-items: center;
            justify-content: center;

            .anticon {
              font-size: 24px;
              color: #1890ff;
            }
          }

          .info {
            h2 {
              font-size: 20px;
              margin: 0;
              margin-bottom: 4px;
            }

            p {
              color: #999;
              margin: 0;
            }
          }
        }

        .actions {
          .ant-btn {
            height: 40px;
            padding: 0 24px;
            border-radius: 20px;

            .anticon {
              margin-right: 8px;
            }
          }
        }
      }
    }

    .playlist-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 24px;

      .playlist-card {
        background: #fff;
        border-radius: 12px;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);

          .hover-mask {
            opacity: 1;
          }
        }

        .cover-wrapper {
          position: relative;
          padding-top: 100%;
          background: #f5f5f5;

          img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .hover-mask {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: all 0.3s;

            .play-btn {
              width: 140px;
              height: 40px;
              background: #1890ff;
              color: #fff;
              border-radius: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 16px;
              transition: all 0.3s;

              .anticon {
                font-size: 18px;
                margin-right: 8px;
              }

              &:hover {
                background: darken(#1890ff, 10%);
                transform: scale(1.05);
              }
            }

            .actions {
              display: flex;
              gap: 8px;

              .ant-btn {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.2);
                border: none;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;

                .anticon {
                  font-size: 16px;
                  color: #fff;
                }

                &:hover {
                  background: rgba(255, 255, 255, 0.3);
                  transform: scale(1.1);
                }
              }
            }
          }
        }

        .info {
          padding: 12px;

          .name {
            font-size: 14px;
            font-weight: 500;
            color: #333;
            margin-bottom: 4px;
            @include text-overflow;
          }

          .desc {
            font-size: 12px;
            color: #999;
            @include text-overflow;

            .dot {
              margin: 0 4px;
            }
          }
        }
      }

      .empty-state {
        grid-column: 1 / -1;
        padding: 48px 0;
        text-align: center;

        .ant-btn {
          margin-top: 16px;
        }
      }
    }
  }

  // 自定义歌单卡片样式
  :deep(.playlist-card) {
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.3s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    }
  }

  // 自定义歌曲列表样式
  :deep(.song-list) {
    .song-item {
      border-radius: 8px;
      margin-bottom: 8px;

      &:hover {
        background: #f5f5f5;
      }

      &.active {
        background: #e6f7ff;
      }
    }
  }
}
</style> 