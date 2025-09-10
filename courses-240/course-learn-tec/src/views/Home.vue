<template>
  <div class="home">
    <!-- 分类和轮播图区域 -->
    <div class="hero-section">
      <!-- 左侧分类 -->
      <div class="category-list">
        <a-menu
          v-model:selectedKeys="selectedKeys"
          mode="vertical"
          class="category-menu"
        >
          <a-menu-item 
            v-for="item in categories" 
            :key="item.id"
            @click="handleCategoryClick(item.id)"
          >
            {{ item.name }}
          </a-menu-item>
        </a-menu>
      </div>

      <!-- 右侧轮播图 -->
      <div class="banner-container">
        <a-carousel autoplay class="banner">
          <div
            class="banner-item"
            v-for="banner in currentBanners"
            :key="banner.id"
          >
            <div 
              class="banner-content"
              :style="{ background: banner.image }"
            >
              <h3>{{ banner.title }}</h3>
            </div>
          </div>
        </a-carousel>
      </div>
    </div>

    <!-- 热门课程 -->
    <div class="course-section">
      <div class="section-header">
        <h2>热门课程</h2>
        <a-button type="link">查看更多</a-button>
      </div>
      
      <div class="course-list">
        <CourseCard
          v-for="course in hotCourses"
          :key="course.id"
          :course="course"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { mockData } from '@/data'
import CourseCard from '@/components/CourseCard.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 分类相关
const categories = ref(mockData.categories)
const selectedCategory = ref(1)
const selectedKeys = ref([selectedCategory.value.toString()])

const currentBanners = computed(() => 
  mockData.banners[selectedCategory.value] || []
)

const handleCategoryChange = (categoryId) => {
  selectedCategory.value = categoryId
  selectedKeys.value = [categoryId.toString()]
}

const handleCategoryClick = (categoryId) => {
  router.push(`/category/${categoryId}`)
}

// 热门课程
const hotCourses = ref(mockData.hotCourses)
</script>

<style lang="less" scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;

  .hero-section {
    display: flex;
    gap: 24px;
    margin-bottom: 48px;

    // 左侧分类列表
    .category-list {
      width: 200px;
      flex-shrink: 0;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

      .category-menu {
        border-right: none;
      }
    }

    // 右侧轮播图
    .banner-container {
      flex: 1;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

      .banner {
        .banner-item {
          height: 360px;

          .banner-content {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 24px;
          }
        }
      }
    }
  }

  .course-section {
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      h2 {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
      }
    }

    .course-list {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }
  }
}

// 响应式设计
@media screen and (max-width: 1200px) {
  .home {
    padding: 16px;
    
    .course-section .course-list {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

@media screen and (max-width: 768px) {
  .home {
    .hero-section {
      flex-direction: column;

      .category-list {
        width: 100%;
        
        .category-menu {
          display: flex;
          overflow-x: auto;
        }
      }

      .banner-container .banner .banner-item {
        height: 200px;
      }
    }

    .course-section .course-list {
      grid-template-columns: repeat(1, 1fr);
      gap: 16px;
    }
  }
}

@media screen and (max-width: 480px) {
  .home {
    .course-section .course-list {
      grid-template-columns: 1fr;
    }
  }
}
</style> 