<template>
  <div class="playlist-card" @click="$emit('click')">
    <div class="cover">
      <img :src="playlist.cover_image || 'https://picsum.photos/200/200'" :alt="playlist.name" />
      <div class="play-count" v-if="playlist.play_count">
        <a-icon type="customer-service" />
        {{ formatCount(playlist.play_count) }}
      </div>
      <div class="actions" v-if="$slots.actions" @click.stop>
        <slot name="actions"></slot>
      </div>
    </div>
    <div class="info">
      <div class="name">{{ playlist.name }}</div>
      <div class="creator" v-if="showCreator">
        by {{ playlist.creator_name }}
      </div>
      <div class="counts">
        <span>{{ playlist.song_count || 0 }}首</span>
        <span v-if="playlist.collect_count">{{ formatCount(playlist.collect_count) }}收藏</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlaylistCard',
  props: {
    playlist: {
      type: Object,
      required: true
    },
    showCreator: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    formatCount(count) {
      if (!count) return '0'
      return count < 10000 ? count : Math.floor(count / 10000) + '万'
    }
  }
}
</script>

<style lang="less" scoped>
.playlist-card {
  width: calc((100% - 96px) / 5); // 5列布局，间隔24px
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-5px);

    .actions {
      opacity: 1;
    }
  }

  .cover {
    position: relative;
    padding-top: 100%;
    margin-bottom: 12px;
    border-radius: 8px;
    overflow: hidden;

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
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

    .actions {
      position: absolute;
      top: 8px;
      right: 8px;
      opacity: 0;
      transition: opacity 0.3s;
    }
  }

  .info {
    .name {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 8px;
      @include text-overflow;
    }

    .creator {
      font-size: 12px;
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
</style> 