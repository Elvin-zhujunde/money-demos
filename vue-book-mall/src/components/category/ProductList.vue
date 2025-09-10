<template>
  <div class="product-list">
    <div class="filter-section">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索商品"
        class="search-input"
        clearable
        @input="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <el-select v-model="sortBy" placeholder="排序方式" @change="handleSort">
        <el-option label="默认排序" value="" />
        <el-option label="价格从低到高" value="priceAsc" />
        <el-option label="价格从高到低" value="priceDesc" />
        <el-option label="销量优先" value="sales" />
      </el-select>
    </div>

    <div class="products-grid">
      <el-row :gutter="20">
        <el-col
          v-for="product in displayProducts"
          :key="product.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
        >
          <el-card :body-style="{ padding: '0px' }" class="product-card">
            <img :src="product.image" class="product-image" />
            <div class="product-info">
              <h3>{{ product.title }}</h3>
              <p class="description">{{ product.description }}</p>
              <p class="price">¥ {{ product.price }}</p>
              <p class="sales">销量: {{ product.sales }}</p>
              <el-button type="primary" @click="goToDetail(product.id)">
                查看详情
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="pagination" v-if="totalProducts > pageSize">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="totalProducts"
        layout="prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, defineProps } from "vue";
import { useRouter } from "vue-router";
import { Search } from "@element-plus/icons-vue";

const props = defineProps({
  products: {
    type: Array,
    required: true,
  },
});

const router = useRouter();
const searchKeyword = ref("");
const sortBy = ref("");
const currentPage = ref(1);
const pageSize = ref(9);

// 计算属性：过滤和排序后的商品列表
const filteredProducts = computed(() => {
  let result = [...props.products];

  // 搜索过滤
  if (searchKeyword.value) {
    result = result.filter(
      (product) =>
        product.title
          .toLowerCase()
          .includes(searchKeyword.value.toLowerCase()) ||
        product.description
          .toLowerCase()
          .includes(searchKeyword.value.toLowerCase())
    );
  }

  // 排序
  if (sortBy.value) {
    switch (sortBy.value) {
      case "priceAsc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "sales":
        result.sort((a, b) => b.sales - a.sales);
        break;
    }
  }

  return result;
});

// 分页后的商品列表
const displayProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredProducts.value.slice(start, end);
});

const totalProducts = computed(() => filteredProducts.value.length);

// 事件处理
const handleSearch = () => {
  currentPage.value = 1;
};

const handleSort = () => {
  currentPage.value = 1;
};

const handlePageChange = (page) => {
  currentPage.value = page;
};

const goToDetail = (id) => {
  router.push(`/product/${id}`);
};

// 监听products变化，重置分页
watch(
  () => props.products,
  () => {
    currentPage.value = 1;
    searchKeyword.value = "";
    sortBy.value = "";
  }
);
</script>

<style scoped>
.product-list {
  padding: 20px;
}

.filter-section {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.search-input {
  width: 300px;
}

.products-grid {
  margin-bottom: 30px;
}

.product-card {
  margin-bottom: 20px;
  transition: transform 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-info {
  padding: 14px;
}

.description {
  color: #666;
  font-size: 14px;
  margin: 10px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.price {
  color: #f56c6c;
  font-size: 20px;
  font-weight: bold;
  margin: 10px 0;
}

.sales {
  color: #909399;
  font-size: 14px;
  margin-bottom: 10px;
}

.pagination {
  text-align: center;
  margin-top: 30px;
}
</style>
