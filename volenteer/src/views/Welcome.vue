<template>
  <div class="welcome-container">
    <div class="content">
      <div class="left-content">
        <h1>志愿者管理系统</h1>
        <p class="subtitle">让每一份爱心都被妥善安排</p>
        <div class="features">
          <div class="feature-item">
            <el-icon><Calendar /></el-icon>
            <span>活动管理</span>
          </div>
          <div class="feature-item">
            <el-icon><User /></el-icon>
            <span>志愿者管理</span>
          </div>
          <div class="feature-item">
            <el-icon><Check /></el-icon>
            <span>签到打卡</span>
          </div>
        </div>
        <div class="button-group">
          <el-button type="primary" size="large" @click="$router.push('/login')">去登录</el-button>
          <el-button type="success" size="large" @click="$router.push('/register')">去注册</el-button>
        </div>
      </div>
      <div class="right-content">
        <div class="cards-container">
          <div class="image-card">
            <img src="../assets/volunteer1.png" alt="志愿者服务">
            <div class="card-text">
              <h3>志愿服务</h3>
              <p>传递温暖，服务社会</p>
            </div>
          </div>
          <div class="image-card">
            <img src="../assets/volunteer2.png" alt="志愿者活动">
            <div class="card-text">
              <h3>公益活动</h3>
              <p>共建和谐社区</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <p>共建美好社会 · 传递志愿精神</p>
    </div>
  </div>
</template>

<script setup>
import { Calendar, User, Check } from '@element-plus/icons-vue'
</script>

<style scoped>
.welcome-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  padding: 0 40px;
}

.content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1440px;
  margin: 0 auto;
  padding: 60px 0;
  gap: 60px;
}

.left-content {
  flex: 1;
  max-width: 700px;
  padding-right: 40px;
}

h1 {
  font-size: 56px;
  color: #303133;
  margin-bottom: 30px;
  font-weight: bold;
  line-height: 1.2;
}

.subtitle {
  font-size: 28px;
  color: #606266;
  margin-bottom: 60px;
  line-height: 1.4;
}

.features {
  display: flex;
  gap: 80px;
  margin-bottom: 60px;
  justify-content: space-between;
  max-width: 800px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #409EFF;
  font-size: 18px;
  padding: 20px 30px;
  background: rgba(64, 158, 255, 0.1);
  border-radius: 8px;
  transition: all 0.3s ease;
  min-width: 200px;
  justify-content: center;
}

.feature-item:hover {
  transform: translateY(-3px);
  background: rgba(64, 158, 255, 0.15);
}

.feature-item .el-icon {
  font-size: 28px;
}

.button-group {
  display: flex;
  gap: 30px;
  margin-top: 80px;
}

.button-group .el-button {
  padding: 15px 40px;
  font-size: 18px;
  border-radius: 8px;
  min-width: 180px;
}

.right-content {
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
  padding-left: 80px;
}

.cards-container {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
  max-width: 500px;
}

.image-card {
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.image-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 30px 60px rgba(0,0,0,0.15);
}

.image-card img {
  width: 100%;
  height: 250px;
  display: block;
  object-fit: cover;
}

.card-text {
  padding: 30px;
}

.card-text h3 {
  font-size: 24px;
  color: #303133;
  margin-bottom: 12px;
}

.card-text p {
  font-size: 16px;
  color: #909399;
  margin: 0;
}

.footer {
  text-align: center;
  padding: 30px;
  color: #909399;
  background-color: #ffffff;
  box-shadow: 0 -1px 4px rgba(0,0,0,0.05);
  font-size: 16px;
}

@media (max-width: 1200px) {
  .content {
    padding: 40px 0;
  }

  .features {
    gap: 40px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .feature-item {
    min-width: 180px;
    padding: 15px 25px;
  }

  .cards-container {
    max-width: 450px;
  }

  .image-card img {
    height: 220px;
  }
}

@media (max-width: 768px) {
  .welcome-container {
    padding: 0 20px;
  }

  .content {
    flex-direction: column;
    padding: 20px;
  }

  .right-content {
    display: none;
  }

  h1 {
    font-size: 36px;
    margin-bottom: 20px;
  }

  .subtitle {
    font-size: 20px;
    margin-bottom: 30px;
  }

  .features {
    flex-direction: column;
    gap: 20px;
    margin-bottom: 30px;
    max-width: 100%;
  }

  .feature-item {
    min-width: 100%;
    padding: 15px 20px;
  }

  .button-group {
    flex-direction: column;
    gap: 15px;
  }

  .button-group .el-button {
    padding: 12px 30px;
    font-size: 16px;
    min-width: 100%;
  }
}
</style> 