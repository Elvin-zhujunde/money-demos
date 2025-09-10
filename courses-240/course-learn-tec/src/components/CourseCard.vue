<template>
  <a-card :bordered="false" hoverable class="course-card" @click="goToCourseDetail">
    <div class="course-image" :style="{ background: course.image }">
      <div class="course-image-overlay">
        <div class="course-level">{{ course.level }}</div>
        <div 
          class="collect-btn"
          :class="{ 
            'is-collected': isCollected,
            'in-collection-page': inCollectionPage 
          }"
          @click.stop="toggleCollect"
        >
          <template v-if="inCollectionPage">
            <delete-outlined />
            <span class="collect-text">取消收藏</span>
          </template>
          <template v-else>
            <heart-outlined v-if="!isCollected" />
            <heart-filled v-else />
            <span class="collect-text">{{ isCollected ? '已收藏' : '收藏' }}</span>
          </template>
        </div>
      </div>
    </div>
    <div class="course-info">
      <h3 class="course-title" :title="course.title">{{ course.title }}</h3>
      <div class="course-desc" :title="course.description">{{ course.description }}</div>
      <div class="course-meta">
        <div class="teacher-info">
          <user-outlined /> {{ course.teacher }}
          <span class="separator">|</span>
          <clock-circle-outlined /> {{ course.duration }}
        </div>
        <div class="course-stats">
          <team-outlined />
          <span class="students">{{ formatNumber(course.students) }}人在学</span>
        </div>
      </div>
      <div class="price-tags">
        <div class="price-info">
          <span class="price">{{ course.price }}</span>
          <span class="original-price">{{ course.originalPrice }}</span>
        </div>
        <div class="tags">
          <a-tag 
            v-for="tag in course.tags" 
            :key="tag"
            :color="getTagColor(tag)"
          >
            {{ tag }}
          </a-tag>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  HeartOutlined, 
  HeartFilled, 
  UserOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue'
import { useCourseStore } from '@/stores/course'

const props = defineProps({
  course: {
    type: Object,
    required: true
  },
  inCollectionPage: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()
const router = useRouter()
const courseStore = useCourseStore()
const isCollected = computed(() => courseStore.isCollected(props.course.id))

const toggleCollect = (e) => {
  e.preventDefault()
  e.stopPropagation()
  courseStore.toggleCollect(props.course)
  
  // 如果在收藏页面取消收藏，可以添加提示
  if (props.inCollectionPage) {
    // 可以添加消息提示
  }
}

const formatNumber = (num) => {
  return num > 9999 ? (num/10000).toFixed(1) + '万' : num
}

const getTagColor = (tag) => {
  const colors = {
    '热门': '#ff4d4f',
    '实战': '#52c41a',
    '进阶': '#1890ff',
    '入门': '#722ed1',
    '高级': '#fa8c16'
  }
  return colors[tag] || '#2db7f5'
}

const goToCourseDetail = () => {
  router.push(`/course/${props.course.id}`)
}
</script>

<style lang="less" scoped>
.course-card {
  transition: all 0.3s;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);

    .course-image .course-image-overlay {
      opacity: 1;
    }
  }

  .course-image {
    height: 180px;
    position: relative;
    background-size: cover !important;
    background-position: center !important;
    border-radius: 8px 8px 0 0;
    overflow: hidden;

    .course-image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.1));
      opacity: 0;
      transition: all 0.3s;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 12px;

      .course-level {
        align-self: flex-start;
        background: rgba(0, 0, 0, 0.6);
        color: #fff;
        padding: 4px 12px;
        border-radius: 4px;
        font-size: 12px;
      }

      .collect-btn {
        align-self: flex-end;
        display: flex;
        align-items: center;
        gap: 4px;
        background: rgba(255, 255, 255, 0.9);
        padding: 6px 12px;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s;
        color: #666;

        &:hover {
          transform: scale(1.05);
        }

        &.is-collected {
          background: #ff4d4f;
          color: #fff;
        }

        .collect-text {
          font-size: 12px;
        }

        &.in-collection-page {
          background: rgba(255, 77, 79, 0.9);
          color: #fff;

          &:hover {
            background: #ff4d4f;
          }
        }
      }
    }
  }

  .course-info {
    padding: 16px;

    .course-title {
      margin: 0 0 8px;
      font-size: 16px;
      font-weight: 600;
      line-height: 1.4;
      color: #333;
    }

    .course-desc {
      color: #666;
      font-size: 14px;
      margin-bottom: 16px;
      height: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .course-meta {
      margin-bottom: 16px;
      
      .teacher-info {
        color: #666;
        font-size: 13px;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 8px;

        .separator {
          color: #e8e8e8;
        }
      }

      .course-stats {
        color: #999;
        font-size: 13px;
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }

    .price-tags {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .price-info {
        .price {
          color: #ff4d4f;
          font-size: 20px;
          font-weight: 600;
          margin-right: 8px;
        }

        .original-price {
          color: #999;
          text-decoration: line-through;
          font-size: 14px;
        }
      }

      .tags {
        display: flex;
        gap: 4px;
        flex-wrap: wrap;
      }
    }
  }
}
</style>