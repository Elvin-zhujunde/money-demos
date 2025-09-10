<template>
  <div class="category-container">
    <div class="container">
      <!-- 左侧分类导航 -->
      <div class="category-nav">
        <!-- 一级分类 -->
        <div class="primary-categories">
          <div
            v-for="category in primaryCategories"
            :key="category.id"
            class="category-item"
            :class="{ active: selectedPrimary === category.id }"
            @click="handlePrimarySelect(category)"
          >
            <img :src="category.icon" :alt="category.name">
            <span>{{ category.name }}</span>
          </div>
        </div>
        
        <!-- 二级分类 -->
        <div class="sub-categories" v-if="subCategories.length">
          <div
            v-for="category in subCategories"
            :key="category.id"
            class="category-item"
            :class="{ active: selectedSub === category.id }"
            @click="handleSubSelect(category)"
          >
            <img :src="category.icon" :alt="category.name">
            <span>{{ category.name }}</span>
          </div>
        </div>
      </div>

      <!-- 右侧商品列表 -->
      <div class="product-list">
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

        <div class="products">
          <div 
            v-for="product in products" 
            :key="product.id"
            class="product-card"
            @click="$router.push(`/product/${product.id}`)"
          >
            <div class="product-img">
              <img :src="product.cover" :alt="product.title">
            </div>
            <div class="product-info">
              <h3 class="title">{{ product.title }}</h3>
              <div class="price-row">
                <div class="price">
                  <span class="currency">¥</span>
                  <span class="amount">{{ product.price }}</span>
                </div>
                <div class="sales">已售 {{ product.sales }}</div>
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
  padding: 20px 0;
}

.container {
  width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 20px;
}

/* 左侧分类导航 */
.category-nav {
  width: 240px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.primary-categories,
.sub-categories {
  padding: 15px;
}

.sub-categories {
  border-top: 1px solid #f0f0f0;
}

.category-item {
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}

.category-item:hover {
  background: #f5f5f5;
}

.category-item.active {
  background: #f0f0f0;
  color: #333;
}

.category-item img {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

/* 右侧商品列表 */
.product-list {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.list-header h2 {
  font-size: 20px;
  color: #333;
  margin: 0;
}

.products {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.product-card {
  cursor: pointer;
  transition: all 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-img {
  width: 100%;
  height: 220px;
  border-radius: 8px;
  overflow: hidden;
}

.product-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  padding: 10px;
}

.title {
  font-size: 14px;
  color: #333;
  margin: 0 0 10px;
  line-height: 1.4;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  color: #FF6B35;
}

.price .currency {
  font-size: 12px;
}

.price .amount {
  font-size: 18px;
  font-weight: bold;
}

.sales {
  color: #999;
  font-size: 12px;
}

.pagination {
  margin-top: 30px;
  text-align: right;
}

/* Element UI 样式覆盖 */
:deep(.el-radio-button__inner) {
  padding: 8px 15px;
}

:deep(.el-radio-button__orig-radio:checked + .el-radio-button__inner) {
  background-color: #333;
  border-color: #333;
  box-shadow: -1px 0 0 0 #333;
}

/* 分页样式 */
:deep(.el-pagination.is-background .el-pager li:not(.disabled).active) {
  background-color: #333;
  color: #fff;
}

:deep(.el-pagination.is-background .el-pager li:not(.disabled):hover) {
  color: #333;
}
</style> 