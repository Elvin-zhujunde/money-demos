<template>
  <div class="category-courses">
    <div class="category-header">
      <div class="header-content">
        <h2>{{ currentCategory?.name || '课程分类' }}</h2>
        <div class="category-tabs">
          <a-tabs
            v-model:activeKey="selectedCategory"
            @change="handleCategoryChange"
            :animated="{ inkBar: true, tabPane: false }"
          >
            <a-tab-pane
              v-for="category in categories"
              :key="category.id"
              :tab="category.name"
            />
          </a-tabs>
        </div>
      </div>
    </div>

    <div class="courses-container">
      <a-affix :offset-top="88">
        <div class="filter-section">
          <div class="filter-item">
            <span class="label">难度：</span>
            <a-radio-group v-model:value="filterLevel" button-style="solid">
              <a-radio-button value="">全部</a-radio-button>
              <a-radio-button value="初级">初级</a-radio-button>
              <a-radio-button value="中级">中级</a-radio-button>
              <a-radio-button value="高级">高级</a-radio-button>
            </a-radio-group>
          </div>
          <div class="filter-item">
            <span class="label">排序：</span>
            <a-radio-group v-model:value="sortBy" button-style="solid">
              <a-radio-button value="popular">最热门</a-radio-button>
              <a-radio-button value="newest">最新</a-radio-button>
              <a-radio-button value="price">价格</a-radio-button>
            </a-radio-group>
          </div>
        </div>
      </a-affix>

      <a-spin :spinning="loading">
        <div class="course-grid" v-if="filteredCourses.length">
          <CourseCard
            v-for="course in filteredCourses"
            :key="course.id"
            :course="course"
          />
        </div>
        <div v-else class="empty-state">
          <a-empty description="暂无相关课程" />
        </div>
      </a-spin>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CourseCard from '@/components/CourseCard.vue'
import { mockData } from '@/data'

const route = useRoute()
const router = useRouter()
const loading = ref(false)

const categories = ref(mockData.categories)
const selectedCategory = ref(route.params.id || '1')
const filterLevel = ref('')
const sortBy = ref('popular')

// 获取当前分类信息
const currentCategory = computed(() => 
  categories.value.find(c => c.id === Number(selectedCategory.value))
)

// 获取分类课程并处理
const filteredCourses = computed(() => {
  let courses = mockData.categoryCourses[selectedCategory.value] || []
  
  if (filterLevel.value) {
    courses = courses.filter(course => course.level === filterLevel.value)
  }

  return [...courses].sort((a, b) => {
    switch (sortBy.value) {
      case 'popular':
        return b.students - a.students
      case 'price':
        return Number(b.price.replace('¥', '')) - Number(a.price.replace('¥', ''))
      case 'newest':
        return b.id - a.id
      default:
        return 0
    }
  })
})

// 切换分类
const handleCategoryChange = (value) => {
  loading.value = true
  router.push(`/category/${value}`)
  // 模拟加载延迟
  setTimeout(() => {
    loading.value = false
  }, 300)
}

// 监听筛选条件变化
watch([filterLevel, sortBy], () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 200)
})

// 初始化
onMounted(() => {
  // 如果没有分类ID或分类ID不存在，重定向到第一个分类
  if (!selectedCategory.value || !mockData.categoryCourses[selectedCategory.value]) {
    const firstCategory = categories.value[0]
    if (firstCategory) {
      router.replace(`/category/${firstCategory.id}`)
      selectedCategory.value = firstCategory.id.toString()
    }
  }
})

// 添加路由参数监听
watch(
  () => route.params.id,
  (newId) => {
    if (newId && mockData.categoryCourses[newId]) {
      selectedCategory.value = newId
    }
  }
)
</script>

<style lang="less" scoped>
.category-courses {
  .category-header {
    background: #fff;
    border-bottom: 1px solid #f0f0f0;
    padding: 24px 0;
    margin-bottom: 24px;

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;

      h2 {
        margin: 0 0 16px;
        font-size: 24px;
        font-weight: 600;
      }

      .category-tabs {
        .ant-radio-group {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
      }
    }
  }

  .courses-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;

    .filter-section {
      margin-bottom: 24px;
      padding: 16px 24px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

      .filter-item {
        display: flex;
        align-items: center;
        margin-bottom: 16px;

        &:last-child {
          margin-bottom: 0;
        }

        .label {
          width: 60px;
          color: #666;
        }

        .ant-radio-group {
          flex: 1;
        }
      }
    }

    .course-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }

    .empty-state {
      padding: 48px 0;
      text-align: center;
    }
  }
}

@media screen and (max-width: 1200px) {
  .category-courses {
    .courses-container .course-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

@media screen and (max-width: 768px) {
  .category-courses {
    .category-header {
      padding: 16px 0;
      
      .header-content {
        padding: 0 16px;
      }
    }

    .courses-container {
      padding: 0 16px;

      .filter-section {
        padding: 12px 16px;
        
        .filter-item {
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;

          .label {
            width: auto;
          }

          .ant-radio-group {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }
        }
      }

      .course-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }
    }
  }
}

.category-tabs {
  :deep(.ant-tabs-nav) {
    margin-bottom: 0;
  }

  :deep(.ant-tabs-tab) {
    padding: 8px 20px;
    transition: all 0.3s;

    &:hover {
      color: #1890ff;
    }
  }
}

.filter-section {
  background: #fff;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.empty-state {
  background: #fff;
  padding: 48px;
  border-radius: 8px;
  text-align: center;
}
</style> 