<template>
  <div class="discover">
    <!-- 轮播图优化 -->
    <div class="banner-section">
      <a-carousel autoplay effect="fade" class="banner">
        <div v-for="banner in banners" :key="banner.id" class="banner-item">
          <div class="banner-content">
            <div class="banner-bg"></div>
            <div class="banner-main">
              <div class="banner-info">
                <h3>{{ banner.title }}</h3>
                <p>{{ banner.description }}</p>
                <a-button
                  type="primary"
                  size="large"
                  @click="handleBannerClick(banner)"
                >
                  <a-icon :type="banner.icon || 'arrow-right'" />
                  {{ banner.button_text }}
                </a-button>
              </div>
              <div class="banner-image">
                <img
                  :src="
                    banner.image || 'https://picsum.photos/600/600?grayscale'
                  "
                  :alt="banner.title"
                />
              </div>
            </div>
          </div>
        </div>
      </a-carousel>
    </div>

    <!-- 分类导航 -->
    <div class="category-nav">
      <div
        class="nav-item"
        v-for="category in categories"
        :key="category.id"
        @click="handleCategoryClick(category)"
        :class="{ disabled: category.disabled }"
      >
        <div class="icon-wrapper">
          <a-icon :type="category.icon" />
        </div>
        <span>{{ category.name }}</span>
      </div>
    </div>

    <!-- 个性化推荐 -->
    <div class="section recommend-section">
      <div class="section-header">
        <div class="left">
          <h2>推荐歌单</h2>
          <div class="subtitle">根据你的音乐口味精选</div>
        </div>
        <a-button type="link" @click="refreshRecommends" :loading="refreshing">
          <a-icon type="reload" />换一批
        </a-button>
      </div>
      <div class="playlist-grid">
        <div
          v-for="playlist in personalRecommends"
          :key="playlist.id"
          class="playlist-card"
          @click="goToPlaylist(playlist.id)"
        >
          <div class="cover-wrapper">
            <img
              :src="playlist.cover_image || 'https://picsum.photos/200/200'"
              :alt="playlist.name"
            />
            <div class="hover-mask">
              <div class="play-count">
                <a-icon type="customer-service" />
                {{ formatCount(playlist.play_count) }}
              </div>
              <div class="play-btn" @click.stop="playPlaylist(playlist)">
                <a-icon type="play-circle" />
                播放全部
              </div>
            </div>
          </div>
          <div class="info">
            <div class="name">{{ playlist.name }}</div>
            <div class="creator">
              <a-avatar :src="playlist.creator_avatar" size="small" />
              <span>{{ playlist.creator_name }}</span>
            </div>
            <div class="tags" v-if="playlist.tags">
              <a-tag v-for="tag in playlist.tags.split(',')" :key="tag">{{
                tag
              }}</a-tag>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 热门推荐 -->
    <div class="section hot-section">
      <div class="section-header">
        <div class="left">
          <h2>热门推荐</h2>
          <div class="subtitle">最近热度飙升的音乐</div>
        </div>
      </div>
      <div class="song-list">
        <div
          v-for="(song, index) in hotSongs"
          :key="song.id"
          class="song-item"
          :class="{ active: isPlaying(song) }"
          @click.stop="togglePlay(song)"
        >
          <div class="rank">{{ index + 1 }}</div>
          <div class="cover">
            <img :src="song.cover_image" :alt="song.title" />
            <div class="play-btn" >
              <a-icon :type="isPlaying(song) ? 'pause' : 'caret-right'" />
            </div>
          </div>
          <div class="info">
            <div class="main-info">
              <div class="title">{{ song.title }}</div>
              <div class="artist">{{ song.singer_name }}</div>
            </div>
            <div class="sub-info">
              <span class="play-count">
                <a-icon type="customer-service" />
                {{ formatCount(song.play_count) }}次播放
              </span>
              <span class="like-count">
                <a-icon type="heart" />
                {{ formatCount(song.like_count) }}
              </span>
              <span class="time">
                <a-icon type="clock-circle" />
                {{ formatTime(song.created_at) }}
              </span>
            </div>
          </div>
          <div class="actions">
            <a-icon
              :type="song.is_liked ? 'close' : 'heart'"
              class="like-btn"
              @click.stop="toggleLike(song)"
            />
            <a-icon type="more" @click="goToDetail(song.id)" />
          </div>
        </div>
      </div>
    </div>

    <!-- 新歌首发 -->
    <div class="section rank-section" ref="rankSection">
      <div class="section-header">
        <div class="left">
          <h2>排行榜</h2>
          <div class="subtitle">音乐排行实时更新</div>
        </div>
      </div>

      <div class="rank-content">
        <!-- 左侧：新歌排行榜 -->
        <div class="rank-list new-rank">
          <div class="rank-header">
            <h3>新歌排行</h3>
            <span class="update-time">每日更新</span>
          </div>
          <div class="song-list">
            <div
              v-for="(song, index) in newSongRank"
              :key="song.id"
              class="song-item"
              :class="{ active: isPlaying(song) }"
              @click.stop="togglePlay(song)"
            >
              <div class="rank" :class="{ 'top-3': index < 3 }">
                {{ index + 1 }}
              </div>
              <div class="cover">
                <img :src="song.cover_image" :alt="song.title" />
                <div class="play-btn">
                  <a-icon :type="isPlaying(song) ? 'pause' : 'caret-right'" />
                </div>
              </div>
              <div class="info">
                <div class="title">{{ song.title }}</div>
                <div class="artist">{{ song.singer_name }}</div>
                <div class="date">{{ formatTime(song.created_at) }}</div>
              </div>
              <div class="actions">
                <a-icon
                  :type="song.is_liked ? 'close' : 'heart'"
                  class="like-btn"
                  @click.stop="toggleLike(song)"
                />
                <a-icon type="more" @click="goToDetail(song.id)" />
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：热门排行榜 -->
        <div class="rank-list hot-rank">
          <div class="rank-header">
            <h3>热门排行</h3>
            <span class="update-time">实时更新</span>
          </div>
          <div class="song-list">
            <div
              v-for="(song, index) in hotSongRank"
              :key="song.id"
              class="song-item"
              :class="{ active: isPlaying(song) }"
              @click.stop="togglePlay(song)"
            >
              <div class="rank" :class="{ 'top-3': index < 3 }">
                {{ index + 1 }}
              </div>
              <div class="cover">
                <img :src="song.cover_image" :alt="song.title" />
                <div class="play-btn">
                  <a-icon :type="isPlaying(song) ? 'pause' : 'caret-right'" />
                </div>
              </div>
              <div class="info">
                <div class="title">{{ song.title }}</div>
                <div class="artist">{{ song.singer_name }}</div>
                <div class="stats">
                  <span class="hot-score">
                    <a-icon type="fire" />{{ song.hot_score }}
                  </span>
                  <span class="divider">·</span>
                  <span class="like-count">
                    <a-icon type="heart" />{{ formatCount(song.like_count) }}
                  </span>
                  <span class="divider">·</span>
                  <span class="comment-count">
                    <a-icon type="message" />{{
                      formatCount(song.comment_count)
                    }}
                  </span>
                </div>
              </div>
              <div class="actions">
                <a-icon
                  :type="song.is_liked ? 'close' : 'heart'"
                  class="like-btn"
                  @click.stop="toggleLike(song)"
                />
                <a-icon type="more" @click="goToDetail(song.id)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import dayjs from "dayjs";
export default {
  name: "Discover",
  data() {
    return {
      banners: [
        {
          id: 1,
          title: "发现新音乐",
          description: "聆听每一个动人旋律",
          button_text: "随机播放",
          icon: "play-circle",
          type: "random",
          image: "https://picsum.photos/600/600?grayscale&random=1",
        },
        {
          id: 2,
          title: "精选歌单",
          description: "探索音乐的无限可能",
          button_text: "去看看",
          icon: "profile",
          link: "/playlist",
          image: "https://picsum.photos/600/600?grayscale&random=2",
        },
        {
          id: 3,
          title: "音乐排行榜",
          description: "最热门的音乐都在这里",
          button_text: "查看榜单",
          icon: "bar-chart",
          link: "/rank",
          image: "https://picsum.photos/600/600?grayscale&random=3",
        },
      ],
      refreshing: false,
      hotSongs: [],
      newSongs: [],
      personalRecommends: [],
      categories: [
        { id: 1, name: "每日一首", icon: "calendar" },
        { id: 3, name: "歌单", icon: "profile" },
        { id: 4, name: "排行榜", icon: "bar-chart" },
        { id: 2, name: "私人FM", icon: "customer-service", disabled: true },
        { id: 5, name: "直播", icon: "video-camera", disabled: true },
      ],
      hotType: "week",
      newSongType: "all",
      newSongRank: [],
      hotSongRank: [],
    };
  },
  computed: {
    ...mapGetters("user", ["isLogin"]),
    ...mapGetters("player", ["currentSong", "playing"]),
  },
  created() {
    this.fetchHotSongs();
    this.fetchNewSongs();
    if (this.isLogin) {
      this.fetchPersonalRecommends();
    }
    this.fetchRankLists();
  },
  methods: {
    ...mapActions("player", ["play", "pause"]),
    async handleBannerClick(banner) {
      if (banner.type === "random") {
        try {
          // 获取随机歌曲
          const res = await this.$http.get("/api/songs/random");
          if (res.code === 200 && res.data) {
            // 将歌曲添加到播放列表并播放
            this.play(res.data);
          }
        } catch (error) {
          console.error("获取随机歌曲失败:", error);
          this.$message.error("获取歌曲失败");
        }
      } else if (banner.link) {
        this.$router.push(banner.link);
      }
    },
    async refreshRecommends() {
      if (this.refreshing) return;
      this.refreshing = true;
      try {
        await this.fetchPersonalRecommends();
      } finally {
        this.refreshing = false;
      }
    },
    formatCount(count) {
      if (count < 10000) return count;
      return Math.floor(count / 10000) + "万";
    },
    async toggleLike(song) {
      if (!this.isLogin) {
        return this.$message.warning("请先登录");
      }

      try {
        const res = await this.$http.post(`/api/songs/${song.id}/like`, {
          type: song.is_liked ? "unlike" : "like",
        });

        if (res.code === 200) {
          // 更新歌曲的喜欢状态
          song.is_liked = !song.is_liked;
          // 更新喜欢数量
          song.like_count = song.is_liked
            ? (song.like_count || 0) + 1
            : Math.max((song.like_count || 0) - 1, 0);

          this.$message.success(res.message);

          // 如果是在热门排行榜中,需要重新计算热度分数
          if (song.hot_score !== undefined) {
            song.hot_score = song.is_liked
              ? song.hot_score + 1
              : Math.max(song.hot_score - 1, 0);
          }
          this.fetchRankLists();
        }
      } catch (error) {
        console.error("操作失败:", error);
        this.$message.error(error.response?.data?.message || "操作失败");
      }
    },
    async fetchHotSongs() {
      try {
        const res = await this.$http.get("/api/songs/hot");
        if (res.code === 200) {
          this.hotSongs = res.data;
        }
      } catch (error) {
        console.error("获取热门歌曲失败:", error);
        this.$message.error("获取热门歌曲失败");
      }
    },
    async fetchNewSongs() {
      try {
        const res = await this.$http.get("/api/songs/new");
        if (res.code === 200) {
          this.newSongs = res.data;
        }
      } catch (error) {
        console.error("获取新歌失败:", error);
        this.$message.error("获取新歌失败");
      }
    },
    isPlaying(song) {
      return (
        this.currentSong && this.currentSong.id === song.id && this.playing
      );
    },
    async fetchPersonalRecommends() {
      if (!this.isLogin) return;
      try {
        const res = await this.$http.get("/api/songs/personal");
        if (res.code === 200) {
          this.personalRecommends = res.data;
        }
      } catch (error) {
        console.error("获取个性化推荐失败:", error);
        this.$message.error("获取个性化推荐失败");
      }
    },
    playSong(song) {
      this.play(song);
    },
    goToDetail(id) {
      this.$router.push(`/song/${id}`);
    },
    goToPlaylist(id) {
      this.$router.push(`/playlist/${id}`);
    },
    handleCategoryClick(category) {
      if (category.disabled) {
        this.$message({
          message: "暂未开发，敬请期待",
          type: "warning",
        });
        return;
      }

      switch (category.name) {
        case "每日一首":
          this.handleBannerClick({ type: "random" });
          break;
        case "歌单":
          this.$router.push("/playlist");
          break;
        case "排行榜":
          this.$refs.rankSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          break;
      }
    },
    togglePlay(song) {

      this.play(song);
    },
    handleHotTypeChange(e) {
      this.fetchHotSongs(e.target.value);
    },
    handleNewSongTypeChange(value) {
      this.fetchNewSongs(value);
    },
    playPlaylist(playlist) {
      // 播放整个歌单
    },
    formatTime(time) {
      return dayjs(time).format("YYYY-MM-DD");
    },
    async fetchRankLists() {
      try {
        const headers = {};
        const token = localStorage.getItem("token");
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const [newRes, hotRes] = await Promise.all([
          this.$http.get("/api/songs/rank/new", { headers }),
          this.$http.get("/api/songs/rank/hot", { headers }),
        ]);

        if (newRes.code === 200) {
          this.newSongRank = newRes.data;
        }
        if (hotRes.code === 200) {
          this.hotSongRank = hotRes.data;
        }
      } catch (error) {
        console.error("获取排行榜失败:", error);
        this.$message.error("获取排行榜失败");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.discover {
  padding: 0;
  background: #f5f5f5;

  .banner-section {
    margin-bottom: 40px;

    .banner {
      height: 400px;
      background: #000;

      .banner-item {
        .banner-content {
          height: 400px;
          position: relative;
          overflow: hidden;

          .banner-bg {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: #000;
            opacity: 0.9;
          }

          .banner-main {
            position: relative;
            height: 100%;
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 60px;

            .banner-info {
              flex: 1;
              color: #fff;
              padding-right: 60px;

              h3 {
                font-size: 48px;
                font-weight: 600;
                margin-bottom: 20px;
                background: linear-gradient(to right, #fff, #999);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
              }

              p {
                font-size: 20px;
                margin-bottom: 40px;
                color: rgba(255, 255, 255, 0.8);
                line-height: 1.5;
              }

              .ant-btn {
                height: 48px;
                padding: 0 40px;
                font-size: 16px;
                border-radius: 24px;
                background: transparent;
                border: 2px solid #fff;
                color: #fff;
                transition: all 0.3s;

                .anticon {
                  margin-right: 8px;
                  font-size: 18px;
                }

                &:hover {
                  background: #fff;
                  color: #000;
                }
              }
            }

            .banner-image {
              width: 300px;
              height: 300px;
              border-radius: 50%;
              overflow: hidden;
              box-shadow: 0 0 40px rgba(255, 255, 255, 0.2);
              transition: all 0.3s;

              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                filter: grayscale(100%);
                transition: all 0.3s;
              }

              &:hover {
                transform: scale(1.05);
                box-shadow: 0 0 60px rgba(255, 255, 255, 0.3);

                img {
                  filter: grayscale(0%);
                }
              }
            }
          }
        }
      }

      :deep(.slick-dots) {
        bottom: 20px;

        li {
          button {
            background: rgba(255, 255, 255, 0.3);
            height: 4px;
            border-radius: 2px;
            transition: all 0.3s;
          }

          &.slick-active button {
            background: #fff;
            width: 24px;
          }
        }
      }
    }
  }

  .category-nav {
    display: flex;
    justify-content: space-around;
    padding: 20px;
    margin: 0 20px 40px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .nav-item {
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-2px);

        .icon-wrapper {
          background: #000;
          color: #fff;
        }
      }

      .icon-wrapper {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 8px;
        transition: all 0.3s;

        .anticon {
          font-size: 24px;
        }
      }

      span {
        font-size: 14px;
      }

      &.disabled {
        opacity: 0.5;
        cursor: not-allowed;

        &:hover {
          transform: none;

          .icon-wrapper {
            background: #f5f5f5;
            color: inherit;
          }
        }
      }
    }
  }

  .section {
    margin: 0 20px 40px;
    padding: 24px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      .left {
        h2 {
          font-size: 24px;
          margin: 0;
          margin-bottom: 4px;
        }

        .subtitle {
          color: #999;
          font-size: 14px;
        }
      }
    }
  }

  .playlist-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 24px;

    .playlist-card {
      background: #fff;
      border-radius: 8px;
      overflow: hidden;
      transition: all 0.3s;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      cursor: pointer;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);

        .hover-mask {
          opacity: 1;
        }
      }

      .cover-wrapper {
        position: relative;
        padding-top: 100%;

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
          background: rgba(0, 0, 0, 0.5);
          opacity: 0;
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 12px;

          .play-count {
            color: #fff;
            font-size: 12px;

            .anticon {
              margin-right: 4px;
            }
          }

          .play-btn {
            width: 120px;
            height: 36px;
            background: #1890ff;
            color: #fff;
            border-radius: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;

            .anticon {
              margin-right: 4px;
              font-size: 16px;
            }
          }
        }
      }

      .info {
        padding: 12px;

        .name {
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 8px;
          @include text-overflow;
        }

        .creator {
          display: flex;
          align-items: center;
          margin-bottom: 8px;

          .ant-avatar {
            margin-right: 8px;
          }

          span {
            color: #666;
            font-size: 12px;
          }
        }

        .stats {
          font-size: 12px;
          color: #999;

          span {
            margin-right: 12px;
          }
        }
      }
    }
  }

  .song-list {
    .song-item {
      display: flex;
      align-items: center;
      padding: 16px;
      border-radius: 8px;
      transition: all 0.3s;
      cursor: pointer;

      &:hover {
        background: #f5f5f5;

        .play-btn {
          opacity: 1;
        }
      }

      &.active {
        background: #f0f0f0;

        .title {
          color: #1890ff;
        }
      }

      .rank {
        width: 40px;
        font-size: 20px;
        font-weight: bold;
        color: #999;
        text-align: center;

        &.top-3 {
          color: #ff4d4f;
        }
      }

      .cover {
        position: relative;
        width: 80px;
        height: 80px;
        margin-right: 20px;
        border-radius: 4px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .play-btn {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: all 0.3s;
          z-index: 1;

          .anticon {
            font-size: 32px;
            color: #fff;
          }
        }
      }

      .info {
        flex: 1;
        min-width: 0;
        margin-right: 20px;

        .main-info {
          margin-bottom: 8px;

          .title {
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 4px;
            @include text-overflow;
          }

          .artist {
            font-size: 14px;
            color: #666;
            @include text-overflow;
          }
        }

        .sub-info {
          display: flex;
          align-items: center;
          gap: 24px;
          color: #999;
          font-size: 12px;

          span {
            display: flex;
            align-items: center;

            .anticon {
              margin-right: 4px;
            }
          }
        }
      }

      .actions {
        display: flex;
        align-items: center;
        gap: 16px;

        .anticon {
          font-size: 18px;
          color: #999;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            color: #1890ff;
          }

          &.like-btn {
            &:hover {
              color: #ff4d4f;
            }

            &[type="heart"] {
              color: #ff4d4f;
            }
          }
        }
      }
    }
  }

  .new-section {
    .song-list {
      .song-item {
        display: flex;
        align-items: center;
        padding: 12px;
        border-radius: 8px;
        transition: all 0.3s;
        cursor: pointer;

        &:hover {
          background: #f5f5f5;

          .play-btn {
            opacity: 1;
          }
        }

        &.active {
          background: #f0f0f0;

          .title {
            color: #1890ff;
          }
        }

        .rank {
          width: 40px;
          font-size: 16px;
          font-weight: bold;
          color: #999;
          text-align: center;
        }

        .cover {
          position: relative;
          width: 60px;
          height: 60px;
          margin-right: 16px;
          border-radius: 4px;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .play-btn {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: all 0.3s;

            .anticon {
              font-size: 24px;
              color: #fff;
            }
          }
        }

        .info {
          flex: 1;
          min-width: 0;
          margin-right: 16px;

          .title {
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 4px;
            @include text-overflow;
          }

          .artist {
            font-size: 12px;
            color: #999;
            @include text-overflow;
          }
        }

        .actions {
          display: flex;
          align-items: center;
          gap: 16px;

          .anticon {
            font-size: 16px;
            color: #999;
            cursor: pointer;
            transition: all 0.3s;

            &:hover {
              color: #1890ff;
            }

            &.like-btn {
              &:hover {
                color: #ff4d4f;
              }

              &[type="heart"] {
                color: #ff4d4f;
              }
            }
          }
        }
      }
    }

    .ant-tabs {
      .ant-tabs-nav {
        margin-bottom: 0;
      }

      .ant-tabs-tab {
        padding: 8px 16px;
      }
    }
  }
}

// 添加文本溢出的 mixin
@mixin text-overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rank-section {
  .rank-content {
    display: flex;
    gap: 24px;

    .rank-list {
      flex: 1;
      background: #fff;
      border-radius: 12px;
      padding: 20px;

      .rank-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 16px;
        border-bottom: 1px solid #f0f0f0;

        h3 {
          font-size: 20px;
          margin: 0;
        }

        .update-time {
          color: #999;
          font-size: 12px;
        }
      }

      .song-list {
        .song-item {
          // 使用之前的 song-item 样式，适当调整
          .rank {
            &.top-3 {
              color: #ff4d4f;
              font-size: 24px;
            }
          }

          .stats {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #999;
            font-size: 12px;

            .divider {
              color: #e8e8e8;
            }

            .hot-score {
              color: #ff4d4f;

              .anticon {
                margin-right: 4px;
              }
            }
          }
        }
      }
    }
  }
}

.rank-section {
  scroll-margin-top: 20px; // 设置滚动目标的上边距，避免顶到浏览器顶部
}
</style>
