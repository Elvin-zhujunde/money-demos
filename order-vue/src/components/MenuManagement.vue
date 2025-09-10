<template>
  <div v-loading="isLoading" class="menu-management">
    <div class="form-section">
      <h2>上架菜品</h2>
      <el-form :model="form" label-width="120px" class="menu-form">
        <el-form-item label="菜品名称" required>
          <el-input v-model="form.name" placeholder="请输入菜品名称"></el-input>
        </el-form-item>

        <el-form-item label="价格" required>
          <el-input-number
            v-model="form.price"
            :min="0"
            :precision="2"
            :step="0.1"
            placeholder="请输入价格"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="库存" required>
          <el-input-number
            v-model="form.stock"
            :min="0"
            :precision="0"
            placeholder="请输入库存数量"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="图片" required>
          <el-upload
            class="menu-upload"
            action="#"
            :show-file-list="false"
            :on-change="handleImageUpload"
            :auto-upload="false"
          >
            <img v-if="imageUrl" :src="imageUrl" class="preview-image" />
            <el-button v-else type="primary">
              <el-icon><Plus /></el-icon>
              选择图片
            </el-button>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="loading">
            添加菜品
          </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="menu-list">
      <h2>当前菜品</h2>
      <div class="menu-grid">
        <div v-for="item in menuItems" :key="item.id" class="menu-item">
          <img :src="item.image" :alt="item.name" />
          <div class="menu-item-content">
            <div class="menu-item-header">
              <span class="menu-item-name">{{ item.name }}</span>
              <span class="menu-item-price">¥{{ item.price }}</span>
            </div>
            <div class="menu-item-stock">库存: {{ item.stock }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";

const store = useStore();
const loading = ref(false);
const imageUrl = ref("");
const menuItems = computed(() => store.state.menu.items);
const isLoading = computed(() => store.state.menu.loading);

const form = ref({
  name: "",
  price: 0,
  stock: 0,
  image: null,
});

// 页面加载时获取菜单数据
onMounted(async () => {
  !store.state.menu.items.length &&
    (await store.dispatch("menu/fetchMenuItems"));
});

const handleImageUpload = (file) => {
  // 在实际项目中，这里应该调用上传API
  // 这里仅做演示，直接使用本地文件预览
  const reader = new FileReader();
  reader.onload = (e) => {
    imageUrl.value = e.target.result;
    form.value.image = e.target.result;
  };
  reader.readAsDataURL(file.raw);
};

const submitForm = async () => {
  if (
    !form.value.name ||
    !form.value.price ||
    !form.value.stock ||
    !form.value.image
  ) {
    ElMessage.warning("请填写完整信息");
    return;
  }

  try {
    loading.value = true;
    await store.dispatch("menu/addMenuItem", form.value);
    ElMessage.success("菜品添加成功");
    resetForm();
  } catch (error) {
    ElMessage.error(error.message || "添加失败");
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  form.value = {
    name: "",
    price: 0,
    stock: 0,
    image: null,
  };
  imageUrl.value = "";
};
</script>

<style scoped>
.menu-management {
  padding: 24px;
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 24px;
}

.form-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  height: fit-content;
}

.menu-form {
  margin-top: 24px;
}

.menu-upload {
  display: flex;
  justify-content: center;
}

.preview-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.menu-list {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.menu-item {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #ebeef5;
}

.menu-item img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
}

.menu-item-content {
  padding: 16px;
}

.menu-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.menu-item-name {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}

.menu-item-price {
  color: #f56c6c;
  font-weight: bold;
}

.menu-item-stock {
  color: #909399;
  font-size: 14px;
}

@media screen and (max-width: 1200px) {
  .menu-management {
    grid-template-columns: 1fr;
  }
}
</style>
