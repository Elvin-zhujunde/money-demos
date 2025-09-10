<template>
  <div class="player" v-if="currentSong" ref="player">
    <div class="left">
      <img
        :src="
          currentSong?.cover_image || 'https://picsum.photos/200/200?random=1'
        "
        :alt="currentSong?.title"
        class="cover"
        @click="goToDetail"
      />
      <div class="info">
        <div class="title" @click="goToDetail">
          {{ currentSong?.title || "暂无播放" }}
        </div>
        <div class="singer">{{ currentSong?.singer_name || "-" }}</div>
      </div>
    </div>

    <div class="center">
      <div class="controls">
        <a-icon type="step-backward" class="prev" @click="playPrev" />
        <a-icon
          :type="playing ? 'pause-circle' : 'play-circle'"
          class="play"
          @click="togglePlay"
        />
        <a-icon type="step-forward" class="next" @click="playNext" />
      </div>
      <div class="progress">
        <span class="time">{{ formatTime(currentTime) }}</span>
        <a-slider
          :value="progress"
          @change="onProgressChange"
          :tipFormatter="null"
        />
        <span class="time">{{ formatTime(duration) }}</span>
      </div>
    </div>

    <div class="right">
      <div class="volume">
        <a-icon
          :type="volume === 0 ? 'sound' : 'sound'"
          class="icon"
          @click="toggleMute"
        />
        <a-slider
          class="slider"
          :value="volume"
          :tipFormatter="null"
          @change="onVolumeChange"
        />
      </div>
      <a-icon
        :type="playMode === 'random' ? 'swap' : 'retweet'"
        class="mode-btn"
        :title="playMode === 'random' ? '随机播放' : '顺序播放'"
        @click="togglePlayMode"
      />
      <a-icon type="bars" class="playlist-btn" @click="drawerVisible = true" />
    </div>

    <a-drawer
      title="播放列表"
      placement="right"
      :visible="drawerVisible"
      @close="drawerVisible = false"
      :width="400"
      class="playlist-drawer"
    >
      <template slot="title">
        <div class="drawer-header">
          <div class="left">
            <span class="title">播放列表</span>
            <span class="count">({{ playlist.length }})</span>
          </div>
          <div class="right">
            <a-icon type="delete" @click="clearPlaylist" title="清空" />
          </div>
        </div>
      </template>

      <div class="playlist-content">
        <div
          v-for="(song, index) in playlist"
          :key="song.id"
          class="song-item"
          :class="{ active: currentSong?.id === song.id }"
          @click="playSong(song)"
        >
          <div class="info">
            <span class="name">{{ song.title }}</span>
            <span class="singer">- {{ song.singer_name }}</span>
          </div>
          <a-icon
            type="close"
            class="remove"
            @click.stop="removeSong(index)"
            title="移除"
          />
        </div>
      </div>
    </a-drawer>

    <audio
      ref="audio"
      :src="currentSong?.file_url"
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
      @canplay="onCanPlay"
      preload="auto"
    ></audio>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

const debounce = (fn, delay) => {
  let timer = null;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
};

export default {
  name: "Player",
  data() {
    return {
      currentTime: 0,
      duration: 0,
      volume: 100,
      lastVolume: 100,
      drawerVisible: false,
    };
  },
  computed: {
    ...mapState("player", ["currentSong", "playlist", "playMode", "playing"]),
    progress() {
      return this.duration ? (this.currentTime / this.duration) * 100 : 0;
    },
  },
  watch: {
    playing(newVal) {
      if (this.$refs.audio) {
        if (newVal) {
          this.$refs.audio.play();
        } else {
          this.$refs.audio.pause();
        }
      }
    },
    currentSong(newSong) {
      if (newSong) {
        this.$nextTick(() => {
          this.$refs.audio.play();
          this.$store.commit('player/SET_PLAYING', true);
        });
      } else {
        this.$store.commit('player/SET_PLAYING', false);
      }
    }
  },
  methods: {
    ...mapMutations({
      setCurrentSong: "player/SET_CURRENT_SONG",
      setPlaylist: "player/SET_PLAYLIST",
      setPlayMode: "player/SET_PLAY_MODE",
      setPlaying: "player/SET_PLAYING"
    }),
    formatTime(time) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    },
    togglePlay() {
      if (!this.currentSong) return;
      
      if (this.playing) {
        this.$refs.audio.pause();
        this.setPlaying(false);
      } else {
        // 使用 Promise 处理播放
        this.$refs.audio.play().catch(error => {
          console.error("播放失败:", error);
          this.setPlaying(false);
        });
        this.setPlaying(true);
      }
    },
    onTimeUpdate(e) {
      this.currentTime = e.target.currentTime;
    },
    onProgressChange(value) {
      const time = (value / 100) * this.duration;
      this.$refs.audio.currentTime = time;
      this.currentTime = time;
    },
    onVolumeChange(value) {
      this.volume = value;
      this.$refs.audio.volume = value / 100;
      if (value > 0) this.lastVolume = value;
    },
    toggleMute() {
      if (this.volume > 0) {
        this.onVolumeChange(0);
      } else {
        this.onVolumeChange(this.lastVolume);
      }
    },
    onCanPlay() {
      this.duration = this.$refs.audio.duration;
      if (this.playing) {
        this.$refs.audio.play().catch(error => {
          console.error("播放失败:", error);
          this.setPlaying(false);
        });
      }
    },
    onEnded() {
      this.playNext();
    },
    playNext() {
      if (!this.playlist.length) return;

      let nextIndex;
      
      if (this.playMode === "random") {
        // 随机播放
        nextIndex = Math.floor(Math.random() * this.playlist.length);
      } else {
        // 顺序播放
        const currentIndex = this.playlist.findIndex(
          (song) => song.id === this.currentSong?.id
        );
        nextIndex =
          currentIndex < this.playlist.length - 1 ? currentIndex + 1 : 0;
      }
      console.log(this.playlist[nextIndex]);

      this.playSong(this.playlist[nextIndex]);
    },
    playPrev() {
      if (!this.playlist.length) return;

      const currentIndex = this.playlist.findIndex(
        (song) => song.id === this.currentSong?.id
      );
      if (currentIndex > 0) {
        this.playSong(this.playlist[currentIndex - 1]);
      }
    },
    async playSong(song) {
      try {
        // 如果当前正在播放，先暂停
        if (this.playing) {
          await this.$refs.audio.pause();
        }
        
        this.setCurrentSong(song);
        this.setPlaying(true);
        
        // 等待音频加载完成后再播放
        this.$refs.audio.addEventListener('canplaythrough', async () => {
          try {
            await this.$refs.audio.play();
            // 更新播放次数
            await this.$http.post(`/api/songs/${song.id}/play`);
          } catch (error) {
            console.error("播放失败:", error);
            this.$message.error("播放失败");
          }
        }, { once: true }); // 只监听一次
        
      } catch (error) {
        console.error("播放失败:", error);
        this.$message.error("播放失败");
      }
    },
    removeSong(index) {
      const newPlaylist = [...this.playlist];
      newPlaylist.splice(index, 1);
      this.setPlaylist(newPlaylist);

      if (this.playlist[index]?.id === this.currentSong?.id) {
        if (newPlaylist.length > 0) {
          this.playNext();
        } else {
          this.setCurrentSong(null);
          this.playing = false;
        }
      }
    },
    clearPlaylist() {
      this.setPlaylist([]);
      this.setCurrentSong(null);
      this.playing = false;
      this.drawerVisible = false;
    },
    goToDetail() {
      if (this.currentSong) {
        this.$router.push(`/song/${this.currentSong.id}`);
      }
    },
    togglePlayMode() {
      const newMode = this.playMode === "sequence" ? "random" : "sequence";
      this.setPlayMode(newMode);
      this.$message.success(
        newMode === "random" ? "已切换为随机播放" : "已切换为顺序播放"
      );
    },
  },
};
</script>

<style lang="less" scoped>
.player {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 72px;
  background: #fff;
  border-top: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  padding: 0 20px;
  z-index: 999;

  .left {
    display: flex;
    align-items: center;
    width: 280px;

    .cover {
      width: 48px;
      height: 48px;
      border-radius: 4px;
      margin-right: 12px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        transform: scale(1.05);
      }
    }

    .info {
      .title {
        font-size: 14px;
        color: #000;
        margin-bottom: 4px;
        cursor: pointer;

        &:hover {
          color: #666;
        }
      }

      .singer {
        font-size: 12px;
        color: #999;
      }
    }
  }

  .center {
    flex: 1;
    padding: 0 24px;

    .controls {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 8px;

      .anticon {
        font-size: 24px;
        color: #000;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          color: #666;
        }

        &.play {
          font-size: 32px;
          margin: 0 24px;
        }
      }
    }

    .progress {
      display: flex;
      align-items: center;

      .time {
        font-size: 12px;
        color: #999;
        width: 40px;
        text-align: center;
      }

      :deep(.ant-slider) {
        flex: 1;
        margin: 0 12px;

        .ant-slider-rail {
          background-color: #e8e8e8;
        }

        .ant-slider-track {
          background-color: #000;
        }

        .ant-slider-handle {
          border-color: #000;
        }
      }
    }
  }

  .right {
    width: 280px;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .volume {
      display: flex;
      align-items: center;
      width: 150px;
      margin-right: 24px;

      .icon {
        font-size: 20px;
        color: #000;
        margin-right: 8px;
        cursor: pointer;

        &:hover {
          color: #666;
        }
      }

      .slider {
        width: 100px;
      }
    }

    .mode-btn {
      font-size: 20px;
      color: #000;
      margin-right: 24px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        color: #666;
      }
    }

    .playlist-btn {
      font-size: 20px;
      color: #000;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        color: #666;
      }
    }
  }
}

.playlist-drawer {
  :deep(.ant-drawer-header) {
    padding: 16px;

    .drawer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        .title {
          font-size: 16px;
          font-weight: 500;
        }

        .count {
          color: #999;
          margin-left: 8px;
        }
      }

      .right {
        .anticon {
          font-size: 16px;
          color: #999;
          cursor: pointer;

          &:hover {
            color: #000;
          }
        }
      }
    }
  }

  .playlist-content {
    .song-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      cursor: pointer;
      border-radius: 4px;
      margin: 4px 0;

      &:hover {
        background: #f5f5f5;

        .remove {
          opacity: 1;
        }
      }

      &.active {
        color: #1890ff;
        background: #e6f7ff;
      }

      .info {
        flex: 1;
        overflow: hidden;
        margin-right: 16px;

        .name {
          font-size: 14px;
          display: block;
          margin-bottom: 4px;
        }

        .singer {
          font-size: 12px;
          color: #999;
        }
      }

      .remove {
        opacity: 0;
        font-size: 16px;
        color: #999;
        transition: all 0.3s;

        &:hover {
          color: #ff4d4f;
        }
      }
    }
  }
}

.right {
  .playlist-btn {
    font-size: 20px;
    color: #000;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      color: #666;
    }
  }
}
</style>
