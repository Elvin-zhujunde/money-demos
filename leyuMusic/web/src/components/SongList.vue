<template>
  <div class="song-list">
    <div class="list">
      <div 
        v-for="(song, index) in songs" 
        :key="song.id"
        class="song-item"
        :class="{ active: isPlaying(song) }"
      >
        <!-- 序号/播放按钮 -->
        <div class="index">
          <span v-if="!isPlaying(song)" :class="{ 'top-3': index < 3 }">{{ index + 1 }}</span>
          <a-icon v-else type="sound" class="playing-icon" />
        </div>

        <!-- 播放/暂停按钮 -->
        <div class="play-btn" @click.stop="togglePlay(song)">
          <a-icon :type="isPlaying(song) ? 'pause' : 'caret-right'" />
        </div>

        <!-- 歌曲信息 - 点击跳转到详情页 -->
        <div class="info" @click="goToDetail(song.id)">
          <img 
            :src="song.cover_image || 'https://picsum.photos/200/200?random=1'" 
            class="cover"
            :alt="song.title"
          />
          <div class="text">
            <div class="name">{{ song.title }}</div>
            <div class="singer">{{ song.singer_name || '-' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'SongList',
  props: {
    songs: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapState('player', ['currentSong', 'playing'])
  },
  methods: {
    togglePlay(song) {
      if (this.isPlaying(song)) {
        // 如果当前歌曲正在播放,则暂停
        this.$store.commit('player/SET_PLAYING', false)
      } else {
        // 否则播放该歌曲
        this.$store.dispatch('player/play', song)
      }
    },
    isPlaying(song) {
      return this.currentSong?.id === song.id && this.playing
    },
    goToDetail(id) {
      this.$router.push(`/song/${id}`)
    }
  }
}
</script>

<style lang="less" scoped>
.song-list {
  .song-item {
    display: flex;
    align-items: center;
    padding: 12px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background: #f5f5f5;
      
      .play-btn {
        opacity: 1;
      }
    }

    &.active {
      background: #f0f0f0;
    }

    .index {
      width: 40px;
      text-align: center;
      color: #999;

      .top-3 {
        color: #ff4d4f;
        font-weight: bold;
      }

      .playing-icon {
        color: #1890ff;
      }
    }

    .play-btn {
      width: 40px;
      text-align: center;
      opacity: 0;
      transition: all 0.3s;

      .anticon {
        font-size: 16px;
        color: #666;
        
        &:hover {
          color: #000;
        }
      }
    }

    .info {
      display: flex;
      align-items: center;
      flex: 1;
      margin-left: 12px;

      .cover {
        width: 40px;
        height: 40px;
        border-radius: 4px;
        margin-right: 12px;
      }

      .text {
        .name {
          font-size: 14px;
          color: #333;
          margin-bottom: 4px;
        }

        .singer {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
}
</style> 