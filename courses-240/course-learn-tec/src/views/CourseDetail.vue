<template>
  <div class="course-detail" v-if="course">
    <div class="course-header">
      <div class="course-info">
        <div class="course-title">
          <h1>{{ course.title }}</h1>
          <a-button
            type="primary"
            @click="toggleCollect"
            :class="{ 'is-collected': isCollected }"
          >
            {{ isCollected ? "已收藏" : "收藏课程" }}
          </a-button>
        </div>
        <div class="course-meta">
          <span class="teacher">
            <user-outlined /> 讲师：{{ course.teacher }}
          </span>
          <span class="level">
            <trophy-outlined /> 难度：{{ course.level }}
          </span>
          <span class="duration">
            <clock-circle-outlined /> 时长：{{ course.duration }}
          </span>
          <span class="students">
            <team-outlined /> {{ formatNumber(course.students) }}人在学
          </span>
        </div>
        <div class="price-info">
          <span class="price">{{ course.price }}</span>
          <span class="original-price">{{ course.originalPrice }}</span>
        </div>
      </div>
      <div class="course-image" :style="{ background: course.image }"></div>
    </div>

    <a-divider />

    <div class="course-content">
      <a-tabs>
        <a-tab-pane key="1" tab="课程介绍">
          <div class="course-description">
            <h3>课程简介</h3>
            <p>{{ course.description }}</p>

            <h3>课程亮点</h3>
            <ul class="highlights">
              <li>深入浅出的讲解方式，适合各个层次的学习者</li>
              <li>理论与实践相结合，每个知识点都有配套练习</li>
              <li>项目驱动学习，掌握实际开发技能</li>
              <li>定期更新课程内容，保持技术的先进性</li>
            </ul>

            <h3>适合人群</h3>
            <ul class="target-users">
              <li>想要提升开发技能的前端工程师</li>
              <li>希望转行到前端开发的其他领域从业者</li>
              <li>对前端开发感兴趣的在校学生</li>
            </ul>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="课程目录">
          <a-collapse v-model:activeKey="activeKeys">
            <a-collapse-panel key="1" header="第一章：基础入门">
              <ul class="chapter-list">
                <li>
                  <play-circle-outlined />
                  <span class="title">1-1 课程介绍</span>
                  <span class="duration">15分钟</span>
                </li>
                <li>
                  <play-circle-outlined />
                  <span class="title">1-2 开发环境搭建</span>
                  <span class="duration">20分钟</span>
                </li>
              </ul>
            </a-collapse-panel>
            <a-collapse-panel key="2" header="第二章：核心概念">
              <ul class="chapter-list">
                <li>
                  <play-circle-outlined />
                  <span class="title">2-1 基础语法</span>
                  <span class="duration">30分钟</span>
                </li>
                <li>
                  <play-circle-outlined />
                  <span class="title">2-2 高级特性</span>
                  <span class="duration">45分钟</span>
                </li>
              </ul>
            </a-collapse-panel>
          </a-collapse>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
  <div v-else class="loading">
    <a-spin size="large" />
  </div>
</template>

<script setup>
import { ref, computed, h } from "vue";
import { useRoute } from "vue-router";
import { useCourseStore } from "@/stores/course";
import { mockData } from "@/data";
import {
  HeartOutlined,
  HeartFilled,
  UserOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  TrophyOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons-vue";

const route = useRoute();
const courseStore = useCourseStore();
const activeKeys = ref(["1"]);

// 获取课程信息
const course = computed(() => {
  const courseId = Number(route.params.id);
  // 先从热门课程中查找
  let foundCourse = mockData.hotCourses.find(c => c.id === courseId);
  
  // 如果热门课程中没找到，则在分类课程中查找
  if (!foundCourse) {
    // 遍历所有分类的课程
    for (const categoryId in mockData.categoryCourses) {
      const categoryCourses = mockData.categoryCourses[categoryId];
      foundCourse = categoryCourses.find(c => c.id === courseId);
      if (foundCourse) break;
    }
  }
  
  return foundCourse;
});
// 收藏状态
const isCollected = computed(() => courseStore.isCollected(course.value?.id));

// 收藏/取消收藏
const toggleCollect = () => {
  courseStore.toggleCollect(course.value);
};

// 格式化数字
const formatNumber = (num) => {
  return num > 9999 ? (num / 10000).toFixed(1) + "万" : num;
};
</script>

<style lang="less" scoped>
.course-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;

  .course-header {
    display: flex;
    gap: 48px;
    margin-bottom: 24px;

    .course-info {
      flex: 1;

      .course-title {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 24px;

        h1 {
          margin: 0;
          font-size: 28px;
          line-height: 1.4;
        }

        .ant-btn {
          &.is-collected {
            background-color: #ff4d4f;
            border-color: #ff4d4f;
          }
        }
      }

      .course-meta {
        display: flex;
        gap: 24px;
        margin-bottom: 24px;
        color: #666;
        font-size: 14px;

        .anticon {
          margin-right: 4px;
        }
      }

      .price-info {
        .price {
          font-size: 32px;
          color: #ff4d4f;
          font-weight: bold;
          margin-right: 12px;
        }

        .original-price {
          font-size: 16px;
          color: #999;
          text-decoration: line-through;
        }
      }
    }

    .course-image {
      width: 400px;
      height: 225px;
      border-radius: 8px;
      background-size: cover !important;
      background-position: center !important;
    }
  }

  .course-content {
    .course-description {
      h3 {
        font-size: 18px;
        margin: 24px 0 16px;

        &:first-child {
          margin-top: 0;
        }
      }

      p {
        color: #666;
        line-height: 1.8;
      }

      ul {
        padding-left: 20px;
        color: #666;
        line-height: 1.8;
      }
    }

    .chapter-list {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        display: flex;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #f0f0f0;

        &:last-child {
          border-bottom: none;
        }

        .anticon {
          margin-right: 8px;
          color: #1890ff;
        }

        .title {
          flex: 1;
          color: #333;
        }

        .duration {
          color: #999;
          font-size: 14px;
        }
      }
    }
  }
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

@media screen and (max-width: 768px) {
  .course-detail {
    padding: 16px;

    .course-header {
      flex-direction: column;
      gap: 24px;

      .course-image {
        width: 100%;
        height: 200px;
      }

      .course-meta {
        flex-wrap: wrap;
        gap: 16px;
      }
    }
  }
}
</style>
