<template>
  <div class="playlist-page">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <a-input-search
        v-model="keyword"
        placeholder="搜索歌单"
        @search="onSearch"
        :loading="loading"
        allowClear
      />
    </div>

    <!-- 歌单列表 -->
    <div class="playlist-grid">
      <div
        v-for="playlist in playlists"
        :key="playlist.id"
        class="playlist-card"
        @click="goToDetail(playlist.id)"
      >
        <div class="cover">
          <img :src="playlist.cover_image || 'https://picsum.photos/200/200'" :alt="playlist.name" />
          <div class="play-count">
            <a-icon type="customer-service" />
            {{ formatCount(playlist.play_count) }}
          </div>
        </div>
        <div class="info">
          <div class="name">{{ playlist.name }}</div>
          <div class="creator">
            by {{ playlist.creator_name }}
          </div>
          <div class="counts">
            <span>{{ playlist.song_count }}首</span>
            <span>{{ formatCount(playlist.collect_count) }}收藏</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <a-pagination
        v-model="page"
        :total="total"
        :pageSize="pageSize"
        @change="onPageChange"
        show-quick-jumper
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlaylistPage',
  data() {
    return {
      keyword: '',
      playlists: [],
      loading: false,
      page: 1,
      pageSize: 12,
      total: 0
    }
  },
  created() {
    this.fetchPlaylists()
  },
  methods: {
    formatCount(count) {
      if (!count) return '0'
      return count < 10000 ? count : Math.floor(count / 10000) + '万'
    },
    async fetchPlaylists() {
      this.loading = true
      try {
        const res = await this.$http.get('/api/playlists', {
          params: {
            keyword: this.keyword,
            page: this.page,
            pageSize: this.pageSize
          }
        })
        if (res.code === 200) {
          this.playlists = res.data.list
          this.total = res.data.total
        }
      } catch (error) {
        console.error('获取歌单列表失败:', error)
        this.$message.error('获取歌单列表失败')
      } finally {
        this.loading = false
      }
    },
    onSearch() {
      this.page = 1
      this.fetchPlaylists()
    },
    onPageChange(page) {
      this.page = page
      this.fetchPlaylists()
    },
    goToDetail(id) {
      this.$router.push(`/playlist/${id}`)
    }
  }
}
</script>

<style lang="less" scoped>
.playlist-page {
  padding: 20px;
  background: #fff;

  .search-bar {
    margin-bottom: 24px;
    max-width: 500px;
  }

  .playlist-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    margin-bottom: 24px;

    .playlist-card {
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-5px);
      }

      .cover {
        position: relative;
        padding-top: 100%;
        margin-bottom: 12px;

        img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 8px;
        }

        .play-count {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(0, 0, 0, 0.5);
          color: #fff;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
        }
      }

      .info {
        .name {
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 8px;
          @include text-overflow;
        }

        .creator {
          font-size: 14px;
          color: #666;
          margin-bottom: 4px;
          @include text-overflow;
        }

        .counts {
          font-size: 12px;
          color: #999;

          span {
            margin-right: 12px;
          }
        }
      }
    }
  }

  .pagination {
    text-align: center;
  }
}
</style> 