<template>
  <div class="song-detail">
    <!-- 歌曲信息卡片 -->
    <div class="song-card">
      <div class="cover-wrapper">
        <img :src="songInfo.cover_image || 'https://picsum.photos/300/300'" />
        <div class="hover-mask">
          <div class="play-btn" @click="playSong">
            <a-icon :type="isPlaying ? 'pause-circle' : 'play-circle'" />
          </div>
        </div>
      </div>

      <div class="info">
        <h1 class="title">{{ songInfo.title }}</h1>
        <div class="meta">
          <div class="artist">
            <a-icon type="user" />
            <span>{{ songInfo.singer_name }}</span>
          </div>
          <div class="stats">
            <div class="stat-item">
              <a-icon type="customer-service" />
              <span>{{ formatCount(songInfo.play_count) }}次播放</span>
            </div>
            <div class="stat-item">
              <a-icon type="heart" />
              <span>{{ formatCount(songInfo.like_count) }}人喜欢</span>
            </div>
          </div>
        </div>
        <div class="actions">
          <a-button type="primary" size="large" @click="playSong">
            <a-icon :type="isPlaying ? 'pause-circle' : 'play-circle'" />
            {{ isPlaying ? "暂停" : "播放" }}
          </a-button>
          <a-button size="large" @click="toggleLike">
            <a-icon :type="songInfo.is_liked ? 'heart' : 'heart-o'" />
            {{ songInfo.is_liked ? "已喜欢" : "喜欢" }}
          </a-button>
          <a-button size="large" @click="showAddToPlaylistModal">
            <a-icon type="plus" />添加到歌单
          </a-button>
        </div>
      </div>
    </div>

    <!-- 评论区卡片 -->
    <div class="comments-card">

      <CommentList
        :songId="songId"
        @login="showLoginModal = true"
        @comment-count-change="updateCommentCount"
      />
    </div>

    <!-- 登录弹窗 -->
    <LoginModal v-model:visible="showLoginModal" />

    <!-- 添加到歌单弹窗 -->
    <a-modal
      title="添加到歌单"
      :visible="addToPlaylistVisible"
      :footer="null"
      @cancel="addToPlaylistVisible = false"
    >
      <div class="playlist-list">
        <div
          v-for="playlist in userPlaylists"
          :key="playlist.id"
          class="playlist-item"
          style="display: flex; align-items: center; padding: 12px; cursor: pointer; border-radius: 4px; transition: all 0.3s; box-shadow: 0 8px 12px #ebedf0"
          @click="addToPlaylist(playlist.id)"
        >
          <img width="50" height="50" :src="playlist.cover_image" :alt="playlist.name" />
          <div class="name" style="margin-left: 20px;">{{ playlist.name }}</div>
        </div>
        <div v-if="!userPlaylists.length" class="empty-tip">
          暂无歌单，请先创建歌单
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { mapState } from "vuex";
import CommentList from "./components/CommentList.vue";
import LoginModal from "@/components/LoginModal.vue";

export default {
  name: "SongDetail",
  components: {
    CommentList,
    LoginModal,
  },
  data() {
    return {
      songId: this.$route.params.id,
      songInfo: {},
      showLoginModal: false,
      commentCount: 0,
      addToPlaylistVisible: false,
      userPlaylists: [],
    };
  },
  computed: {
    ...mapState("player", ["currentSong", "playing"]),
    isPlaying() {
      return this.currentSong?.id === this.songInfo.id && this.playing;
    },
    isLogin() {
      return !!localStorage.getItem("userInfo");
    },
  },
  methods: {
    async fetchSongInfo() {
      try {
        const res = await this.$http.get(`/api/songs/${this.songId}`);
        if (res.code === 200) {
          this.songInfo = res.data;

          // 如果用户已登录,获取喜欢状态
          if (this.isLogin) {
            const likeRes = await this.$http.post(
              `/api/songs/${this.songId}/check-like`
            );
            if (likeRes.code === 200) {
              this.songInfo.is_liked = likeRes.data.is_liked;
            }
          }
        }
      } catch (error) {
        console.error("获取歌曲信息失败:", error);
        this.$message.error("获取歌曲信息失败");
      }
    },
    playSong() {
      this.isPlaying
        ? this.$store.dispatch("player/pauseSong")
        : this.$store.dispatch("player/play", this.songInfo);
    },
    async toggleLike() {
      if (!this.isLogin) {
        return this.$message.warning("请先登录");
      }

      try {
        const type = this.songInfo.is_liked ? "unlike" : "like";
        const res = await this.$http.post(`/api/songs/${this.songId}/like`, {
          type,
        });
        if (res.code === 200) {
          this.songInfo.is_liked = !this.songInfo.is_liked;
          this.$message.success(res.message);
        }
      } catch (error) {
        console.error("喜欢操作失败:", error);
        this.$message.error(error.message);
      }
    },
    formatCount(count) {
      if (!count) return "0";
      return count < 10000 ? count : Math.floor(count / 10000) + "万";
    },
    updateCommentCount(count) {
      this.commentCount = count;
    },
    async showAddToPlaylistModal() {
      if (!this.isLogin) {
        return this.$message.warning("请先登录");
      }

      try {
        const res = await this.$http.get("/api/playlists/user");
        if (res.code === 200) {
          this.userPlaylists = res.data;
          this.addToPlaylistVisible = true;
        }
      } catch (error) {
        console.error("获取歌单列表失败:", error);
        this.$message.error("获取歌单列表失败");
      }
    },
    async addToPlaylist(playlistId) {
      try {
        const res = await this.$http.post(
          `/api/playlists/${playlistId}/songs`,
          {
            songId: this.songId,
          }
        );
        if (res.code === 200) {
          this.$message.success("添加成功");
          this.addToPlaylistVisible = false;
        }
      } catch (error) {
        console.error("添加到歌单失败:", error);
        this.$message.error(error.response?.data?.message || "添加失败");
      }
    },
  },
  created() {
    this.fetchSongInfo();
  },
};
</script>

<style lang="less" scoped>
.song-detail {
  padding: 24px;
  max-width: 1000px;
  margin: 0 auto;

  .song-card {
    background: #fff;
    border-radius: 12px;
    padding: 24px;
    display: flex;
    gap: 40px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    margin-bottom: 24px;

    .cover-wrapper {
      width: 300px;
      height: 300px;
      position: relative;
      flex-shrink: 0;
      border-radius: 8px;
      overflow: hidden;

      img {
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
        background: rgba(0, 0, 0, 0.5);
        opacity: 0;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        &:hover {
          opacity: 1;
        }

        .play-btn {
          .anticon {
            font-size: 64px;
            color: #fff;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
            transition: all 0.3s;

            &:hover {
              transform: scale(1.1);
            }
          }
        }
      }
    }

    .info {
      flex: 1;
      display: flex;
      flex-direction: column;

      .title {
        font-size: 32px;
        font-weight: 600;
        margin-bottom: 24px;
        color: #000;
      }

      .meta {
        margin-bottom: 32px;

        .artist {
          display: flex;
          align-items: center;
          font-size: 16px;
          margin-bottom: 16px;

          .anticon {
            margin-right: 8px;
            color: #666;
          }
        }

        .stats {
          display: flex;
          gap: 24px;

          .stat-item {
            display: flex;
            align-items: center;
            color: #666;

            .anticon {
              margin-right: 8px;
              font-size: 16px;
            }
          }
        }
      }

      .actions {
        display: flex;
        gap: 16px;

        .ant-btn {
          height: 40px;
          padding: 0 24px;

          .anticon {
            font-size: 16px;
            margin-right: 8px;
          }
        }
      }
    }
  }

  .comments-card {
    background: #fff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    .card-header {
      display: flex;
      align-items: center;
      margin-bottom: 24px;

      h2 {
        font-size: 20px;
        margin: 0;
        margin-right: 12px;
      }

      .comment-count {
        color: #999;
      }
    }
  }

  .playlist-list {
    max-height: 400px;
    overflow-y: auto;

    .playlist-item {
      display: flex;
      align-items: center;
      padding: 12px;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.3s;

      &:hover {
        background: #f5f5f5;
      }

      img {
        width: 50px;
        height: 50px;
        border-radius: 4px;
        margin-right: 12px;
        object-fit: cover;
      }

      .name {
        font-size: 14px;
      }
    }

    .empty-tip {
      text-align: center;
      color: #999;
      padding: 24px 0;
    }
  }
}
</style>

