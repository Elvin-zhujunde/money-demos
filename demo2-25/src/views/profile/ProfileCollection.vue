<template>
  <div>
    <div class="collection-header">
      <div class="header-left">
        <span class="course-count" v-if="collectedCourses.length">
          共 {{ collectedCourses.length }} 门课程
        </span>
      </div>
      <div class="course-stats" v-if="collectedCourses.length">
        <clock-circle-outlined />
        <span>总时长: {{ totalDuration }}</span>
      </div>
    </div>
    
    <div class="collected-courses" v-if="collectedCourses.length">
      <div class="course-grid">
        <CourseCard
          v-for="course in collectedCourses"
          :key="course.id"
          :course="course"
          :inCollectionPage="true"
        />
      </div>
    </div>
    
    <a-empty
      v-else
      class="empty-state"
      description="暂无收藏的课程"
    >
      <template #extra>
        <a-button type="primary" size="large" @click="$router.push('/home')">
          去发现课程
        </a-button>
      </template>
    </a-empty>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCourseStore } from '@/stores/course'
import { ClockCircleOutlined } from '@ant-design/icons-vue'
import CourseCard from '@/components/CourseCard.vue'

const router = useRouter()
const courseStore = useCourseStore()
const { collectedCourses } = courseStore

// 计算总时长
const totalDuration = computed(() => {
  const totalHours = collectedCourses.reduce((total, course) => {
    const hours = parseInt(course.duration) || 0
    return total + hours
  }, 0)
  return `${totalHours}学时`
})
</script>

<style lang="less" scoped>
.collection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;

  .header-left {
    .course-count {
      font-size: 14px;
      color: #666;
    }
  }

  .course-stats {
    color: #666;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.collected-courses {
  .course-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
}

.empty-state {
  margin-top: 80px;
  padding: 48px;
  background: #fff;
  border-radius: 8px;
  
  :deep(.ant-empty-description) {
    font-size: 16px;
    color: #666;
  }

  .ant-btn {
    margin-top: 24px;
  }
}

@media screen and (max-width: 1200px) {
  .collected-courses .course-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media screen and (max-width: 768px) {
  .collection-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .collected-courses .course-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style> 