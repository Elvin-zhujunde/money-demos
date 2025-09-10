<template>
  <div class="category-container">
    <!-- 顶部分类导航 -->
    <div class="nav-categories">
      <div class="container">
        <div class="nav-list">
          <div 
            v-for="category in primaryCategories"
            :key="category.id"
            class="nav-item"
            :class="{ active: selectedPrimary === category.id }"
            @click="handlePrimarySelect(category)"
          >
            {{ category.name }}
          </div>
        </div>
      </div>
    </div>

    <div class="container main-content">
      <!-- 左侧子分类 -->
      <div class="sub-categories" v-if="subCategories.length">
        <h3 class="sub-title">子分类</h3>
        <div class="sub-list">
          <div
            v-for="category in subCategories"
            :key="category.id"
            class="sub-item"
            :class="{ active: selectedSub === category.id }"
            @click="handleSubSelect(category)"
          >
            <img :src="category.icon" :alt="category.name">
            <span>{{ category.name }}</span>
          </div>
        </div>
      </div>

      <!-- 右侧商品列表 -->
      <div class="product-section">
        <div class="list-header">
          <h2>{{ currentCategory ? currentCategory.name : '全部商品' }}</h2>
          <div class="sort-options">
            <el-radio-group v-model="sortBy" size="small">
              <el-radio-button label="default">默认</el-radio-button>
              <el-radio-button label="sales">销量</el-radio-button>
              <el-radio-button label="price">价格</el-radio-button>
            </el-radio-group>
          </div>
        </div>

        <div class="product-grid">
          <div 
            v-for="product in products" 
            :key="product.id"
            class="product-card"
            @click="$router.push(`/product/${product.id}`)"
          >
            <div class="product-img">
              <img :src="product.cover" :alt="product.title">
              <div class="quick-shop">
                <el-button type="primary" round>立即购买</el-button>
              </div>
            </div>
            <div class="product-info">
              <div class="product-title">{{ product.title }}</div>
              <div class="product-price">
                <span class="current-price">¥{{ product.price }}</span>
                <span class="sales">已售 {{ product.sales }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div class="pagination" v-if="total > 0">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            :page-size="pageSize"
            @current-change="handlePageChange"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Category',
  data() {
    return {
      primaryCategories: [], // 一级分类
      subCategories: [], // 二级分类
      selectedPrimary: null, // 选中的一级分类
      selectedSub: null, // 选中的二级分类
      currentCategory: null, // 当前选中的分类
      products: [], // 商品列表
      total: 0,
      pageSize: 20,
      currentPage: 1,
      sortBy: 'default'
    }
  },
  created() {
    this.fetchCategories()
    // 监听路由参数变化
    this.handleRouteChange()
  },
  methods: {
    async fetchCategories() {
      try {
        const res = await this.$axios.get('/api/categories')
        if (res.code === 200) {
          // 过滤出一级分类
          this.primaryCategories = res.data.filter(item => item.parent_id === 0)
          
          // 如果有选中的一级分类，获取其二级分类
          if (this.selectedPrimary) {
            this.subCategories = res.data.filter(item => item.parent_id === this.selectedPrimary)
          }
        }
      } catch (error) {
        console.error('获取分类失败:', error)
        this.$message.error('获取分类失败')
      }
    },
    handleRouteChange() {
      const { categoryId } = this.$route.query
      if (categoryId) {
        this.handleCategoryFromRoute(categoryId)
      }
    },
    async handlePrimarySelect(category) {
      // 避免重复导航
      if (this.selectedPrimary === category.id) return

      try {
        // 更新路由参数，添加 catch 处理重复导航错误
        await this.$router.push({
          path: '/category',
          query: {
            categoryId: category.id
          }
        }).catch(err => {
          if (err.name !== 'NavigationDuplicated') {
            throw err
          }
        })

        this.selectedPrimary = category.id
        this.selectedSub = null
        this.currentCategory = category
        
        // 获取二级分类
        const res = await this.$axios.get('/api/categories')
        if (res.code === 200) {
          this.subCategories = res.data.filter(item => item.parent_id === category.id)
        }
        
        // 获取商品列表
        this.currentPage = 1
        this.fetchProducts()
      } catch (error) {
        console.error('获取二级分类失败:', error)
      }
    },
    async handleSubSelect(category) {
      // 避免重复导航
      if (this.selectedSub === category.id) return

      try {
        // 更新路由参数，添加 catch 处理重复导航错误
        await this.$router.push({
          path: '/category',
          query: {
            categoryId: category.id
          }
        }).catch(err => {
          if (err.name !== 'NavigationDuplicated') {
            throw err
          }
        })

        this.selectedSub = category.id
        this.currentCategory = category
        this.currentPage = 1
        this.fetchProducts()
      } catch (error) {
        console.error('选择二级分类失败:', error)
      }
    },
    async fetchProducts() {
      try {
        const categoryId = this.selectedSub || this.selectedPrimary
        const res = await this.$axios.get(`/api/categories/${categoryId}/products`, {
          params: {
            page: this.currentPage,
            pageSize: this.pageSize,
            sortBy: this.sortBy
          }
        })
        if (res.code === 200) {
          this.products = res.data.list
          this.total = res.data.total
        }
      } catch (error) {
        console.error('获取商品列表失败:', error)
        this.$message.error('获取商品列表失败')
      }
    },
    handlePageChange(page) {
      this.currentPage = page
      this.fetchProducts()
    },
    async handleCategoryFromRoute(categoryId) {
      try {
        const res = await this.$axios.get('/api/categories')
        if (res.code === 200) {
          const category = res.data.find(item => item.id === parseInt(categoryId))
          if (category) {
            if (category.parent_id === 0) {
              // 如果是一级分类且未选中，则选中
              if (this.selectedPrimary !== category.id) {
                await this.handlePrimarySelect(category)
              }
            } else {
              const parent = res.data.find(item => item.id === category.parent_id)
              if (parent) {
                // 如果父分类未选中，则先选中父分类
                if (this.selectedPrimary !== parent.id) {
                  await this.handlePrimarySelect(parent)
                }
                // 如果二级分类未选中，则选中二级分类
                if (this.selectedSub !== category.id) {
                  await this.handleSubSelect(category)
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('处理路由分类失败:', error)
      }
    }
  },
  watch: {
    // 监听路由变化
    '$route'(to, from) {
      if (to.path === '/category' && to.query.categoryId !== from.query.categoryId) {
        this.handleRouteChange()
      }
    },
    sortBy() {
      this.fetchProducts()
    }
  }
}
</script>

<style scoped>
.category-container {
  min-height: 100vh;
  background-color: #fff;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.nav-categories {
  background: #f5f5f5;
  border-bottom: 1px solid #eee;
  margin-bottom: 40px;
}

.nav-list {
  display: flex;
  justify-content: flex-start;
  padding: 15px 0;
  gap: 30px;
}

.nav-item {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.nav-item:hover,
.nav-item.active {
  color: #000;
}

.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #000;
}

.main-content {
  display: flex;
  gap: 40px;
  padding-bottom: 60px;
}

.sub-categories {
  width: 240px;
  flex-shrink: 0;
}

.sub-title {
  font-size: 20px;
  font-weight: 500;
  margin: 0 0 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.sub-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.sub-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sub-item:hover {
  background: #f5f5f5;
}

.sub-item.active {
  background: #000;
  color: #fff;
}

.sub-item img {
  width: 24px;
  height: 24px;
  margin-right: 10px;
  object-fit: cover;
}

.product-section {
  flex: 1;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.list-header h2 {
  font-size: 24px;
  font-weight: 500;
  margin: 0;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.product-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.product-img {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
}

.product-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.product-card:hover .product-img img {
  transform: scale(1.1);
}

.quick-shop {
  position: absolute;
  bottom: -50px;
  left: 0;
  right: 0;
  padding: 15px;
  background: rgba(255,255,255,0.9);
  display: flex;
  justify-content: center;
  transition: bottom 0.3s ease;
}

.product-card:hover .quick-shop {
  bottom: 0;
}

.product-info {
  padding: 20px;
}

.product-title {
  font-size: 16px;
  color: #333;
  margin-bottom: 15px;
  height: 44px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.current-price {
  font-size: 20px;
  font-weight: 600;
  color: #000;
}

.sales {
  font-size: 14px;
  color: #999;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

/* Element UI 样式覆盖 */
:deep(.el-radio-button__inner) {
  padding: 8px 20px;
  border-color: #000;
}

:deep(.el-radio-button__orig-radio:checked + .el-radio-button__inner) {
  background-color: #000;
  border-color: #000;
  box-shadow: -1px 0 0 0 #000;
}

:deep(.el-radio-button__inner:hover) {
  color: #000;
}

:deep(.el-pagination.is-background .el-pager li:not(.disabled).active) {
  background-color: #000;
  color: #fff;
}

:deep(.el-pagination.is-background .el-pager li:not(.disabled):hover) {
  color: #000;
}

:deep(.el-button--primary) {
  background-color: #000;
  border-color: #000;
  padding: 12px 30px;
  font-size: 16px;
}

:deep(.el-button--primary:hover) {
  background-color: #333;
  border-color: #333;
}
</style> 