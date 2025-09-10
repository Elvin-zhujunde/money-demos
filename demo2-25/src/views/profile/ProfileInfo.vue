<template>
  <div class="user-profile">
    <div class="user-header">
      <a-avatar :size="80" :src="userInfo.avatar">
        {{ userInfo.name.charAt(0) }}
      </a-avatar>
      <div class="user-basic">
        <h2>{{ userInfo.name }}</h2>
        <div class="user-role">
          <crown-outlined v-if="userInfo.vip" class="vip-icon" />
          {{ userInfo.role }}
        </div>
        <div class="user-bio">{{ userInfo.bio }}</div>
      </div>
    </div>

    <a-divider />

    <div class="user-stats">
      <div class="stat-item">
        <read-outlined />
        <div class="stat-content">
          <div class="stat-value">{{ userInfo.totalLearnTime }}小时</div>
          <div class="stat-label">总学习时长</div>
        </div>
      </div>
      <div class="stat-item">
        <trophy-outlined />
        <div class="stat-content">
          <div class="stat-value">{{ userInfo.completedCourses }}</div>
          <div class="stat-label">完成课程</div>
        </div>
      </div>
      <div class="stat-item">
        <calendar-outlined />
        <div class="stat-content">
          <div class="stat-value">{{ userInfo.learningDays }}天</div>
          <div class="stat-label">学习天数</div>
        </div>
      </div>
    </div>

    <a-divider />

    <div class="user-details">
      <h3>个人资料</h3>
      <a-descriptions :column="1">
        <a-descriptions-item label="学号">
          {{ userInfo.studentId }}
        </a-descriptions-item>
        <a-descriptions-item label="专业">
          {{ userInfo.major }}
        </a-descriptions-item>
        <a-descriptions-item label="年级">
          {{ userInfo.grade }}
        </a-descriptions-item>
        <a-descriptions-item label="邮箱">
          {{ userInfo.email }}
        </a-descriptions-item>
        <a-descriptions-item label="注册时间">
          {{ userInfo.registerDate }}
        </a-descriptions-item>
      </a-descriptions>
    </div>

    <div class="learning-progress">
      <h3>最近学习</h3>
      <a-timeline>
        <a-timeline-item 
          v-for="record in userInfo.learningRecords" 
          :key="record.date"
        >
          <template #dot>
            <clock-circle-outlined style="fontSize: 16px" />
          </template>
          <div class="timeline-content">
            <div class="record-title">{{ record.courseName }}</div>
            <div class="record-time">{{ record.date }} · 学习{{ record.duration }}分钟</div>
          </div>
        </a-timeline-item>
      </a-timeline>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  CrownOutlined,
  ReadOutlined,
  TrophyOutlined,
  CalendarOutlined,
  ClockCircleOutlined
} from '@ant-design/icons-vue'

// Mock用户数据
const userInfo = ref({
  name: '张三',
  avatar: '', // 可以添加实际的头像URL
  role: '在校学生',
  vip: true,
  bio: '热爱学习，努力成为更好的自己',
  studentId: '2021114514',
  major: '计算机科学与技术',
  grade: '大二',
  email: 'zhangsan@university.edu',
  registerDate: '2023-01-15',
  totalLearnTime: 128,
  completedCourses: 12,
  learningDays: 45,
  learningRecords: [
    {
      date: '2024-01-20',
      courseName: 'Vue.js 3.0 企业级应用开发',
      duration: 90
    },
    {
      date: '2024-01-19',
      courseName: 'Python程序设计',
      duration: 60
    },
    {
      date: '2024-01-18',
      courseName: '数据结构基础',
      duration: 120
    }
  ]
})
</script>

<style lang="less" scoped>
.user-profile {
  .user-header {
    display: flex;
    gap: 24px;
    align-items: flex-start;

    .user-basic {
      h2 {
        margin: 0 0 8px;
        font-size: 24px;
      }

      .user-role {
        color: #666;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 8px;

        .vip-icon {
          color: #ffd700;
        }
      }

      .user-bio {
        color: #999;
        font-size: 14px;
      }
    }
  }

  .user-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    padding: 24px 0;

    .stat-item {
      display: flex;
      align-items: center;
      gap: 16px;

      .anticon {
        font-size: 24px;
        color: #1890ff;
      }

      .stat-content {
        .stat-value {
          font-size: 20px;
          font-weight: 600;
          color: #333;
        }

        .stat-label {
          font-size: 14px;
          color: #666;
        }
      }
    }
  }

  .user-details {
    margin-bottom: 32px;

    h3 {
      margin-bottom: 16px;
      font-size: 18px;
    }
  }

  .learning-progress {
    h3 {
      margin-bottom: 16px;
      font-size: 18px;
    }

    .timeline-content {
      .record-title {
        font-weight: 500;
        margin-bottom: 4px;
      }

      .record-time {
        font-size: 14px;
        color: #666;
      }
    }
  }
}
</style> 