<template>
  <div class="product-detail">
    <div class="container">
      <div class="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ product.category_name }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ product.title }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="product-content">
        <div class="left">
          <div class="product-gallery">
            <div class="main-image">
              <img :src="product.cover" :alt="product.title">
            </div>
            <div class="thumbnail-list" v-if="product.images && product.images.length">
              <div 
                v-for="(image, index) in product.images" 
                :key="index"
                class="thumbnail-item"
                :class="{ active: index === currentImageIndex }"
                @click="currentImageIndex = index"
              >
                <img :src="image" :alt="product.title">
              </div>
            </div>
          </div>
        </div>

        <div class="right">
          <h1 class="title">{{ product.title }}</h1>
          
          <div class="price-section">
            <div class="current-price">
              <span class="label">价格</span>
              <span class="currency">¥</span>
              <span class="amount">{{ product.price }}</span>
            </div>
            <div class="original-price" v-if="product.original_price && product.original_price > product.price">
              <span class="label">原价</span>
              <span class="price">¥{{ product.original_price }}</span>
            </div>
          </div>

          <div class="info-section">
            <div class="info-item">
              <span class="label">销量</span>
              <span class="value">{{ product.sales }}件</span>
            </div>
            <div class="info-item">
              <span class="label">库存</span>
              <span class="value">{{ product.stock }}件</span>
            </div>
            <div class="info-item">
              <span class="label">发货地</span>
              <span class="value">{{ product.shipping_from }}</span>
            </div>
          </div>

          <div class="seller-section">
            <div class="seller-info">
              <img :src="product.seller_avatar" class="seller-avatar">
              <span class="seller-name">{{ product.seller_name }}</span>
            </div>
          </div>

          <div class="description-section">
            <h3>商品描述</h3>
            <p>{{ product.description }}</p>
          </div>
          
          <div class="action-section">
            <div class="quantity-selector">
              <span class="label">数量</span>
              <el-input-number 
                v-model="quantity" 
                :min="1" 
                :max="product.stock"
                size="large"
              ></el-input-number>
            </div>

            <div class="button-group">
              <el-button 
                type="primary" 
                size="large"
                :loading="loading"
                @click="addToCart"
              >
                加入购物车
              </el-button>
              <el-button 
                type="primary" 
                size="large"
                plain
                :loading="loading"
                @click="buyNow"
              >
                立即购买
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchBox from '@/components/SearchBox.vue'

export default {
  name: 'ProductDetail',
  components: {
    SearchBox
  },
  data() {
    return {
      product: {},
      quantity: 1,
      loading: false,
      userInfo: null,
      currentImageIndex: 0
    }
  },
  created() {
    this.fetchProductDetail()
    this.initUserInfo()
  },
  methods: {
    initUserInfo() {
      const userInfo = localStorage.getItem('userInfo')
      if (userInfo) {
        this.userInfo = JSON.parse(userInfo)
      }
    },
    handleCommand(command) {
      switch (command) {
        case 'profile':
          this.$router.push('/profile')
          break
        case 'logout':
          localStorage.removeItem('userInfo')
          this.userInfo = null
          this.$message.success('退出成功')
          this.$router.push('/login')
          break
      }
    },
    async fetchProductDetail() {
      try {
        const id = this.$route.params.id
        const res = await this.$axios.get(`/api/products/${id}`)
        if (res.code === 200) {
          this.product = res.data
        } else {
          this.$message.error(res.message)
        }
      } catch (error) {
        console.error('获取商品详情失败:', error)
        this.$message.error('获取商品详情失败')
      }
    },
    async addToCart() {
      try {
        const userInfo = localStorage.getItem('userInfo')
        if (!userInfo) {
          this.$router.push('/login')
          return
        }

        this.loading = true
        const { id: user_id } = JSON.parse(userInfo)
        const res = await this.$axios.post('/api/cart/add', {
          user_id,
          product_id: this.product.id,
          quantity: this.quantity
        })

        if (res.code === 200) {
          this.$message.success('添加成功')
        } else {
          this.$message.error(res.message)
        }
      } catch (error) {
        console.error('加入购物车失败:', error)
        this.$message.error('加入购物车失败')
      } finally {
        this.loading = false
      }
    },
    async buyNow() {
      try {
        const userInfo = localStorage.getItem('userInfo')
        if (!userInfo) {
          this.$router.push('/login')
          return
        }

        // 构造订单项
        const orderItem = {
          id: this.product.id,
          title: this.product.title,
          cover: this.product.cover,
          price: this.product.price,
          quantity: this.quantity,
          seller_name: this.product.seller_name
        }

        // 跳转到结算页
        this.$router.push({
          path: '/checkout',
          query: {
            items: JSON.stringify([orderItem])
          }
        })
      } catch (error) {
        console.error('立即购买失败:', error)
        this.$message.error('立即购买失败')
      }
    }
  },
  watch: {
    // 监听路由参数变化
    '$route'(to, from) {
      if (to.params.id !== from.params.id) {
        this.fetchProductDetail()
      }
    }
  }
}
</script>

<style scoped>
.product-detail {
  padding: 40px 0;
  min-height: 100vh;
  background-color: #fff;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.breadcrumb {
  margin-bottom: 30px;
}

.product-content {
  display: flex;
  gap: 60px;
}

.left {
  width: 600px;
  flex-shrink: 0;
}

.product-gallery {
  position: sticky;
  top: 20px;
}

.main-image {
  width: 100%;
  height: 600px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-list {
  display: flex;
  gap: 10px;
}

.thumbnail-item {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.thumbnail-item:hover,
.thumbnail-item.active {
  opacity: 1;
}

.thumbnail-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.right {
  flex: 1;
  padding-top: 20px;
}

.title {
  font-size: 32px;
  font-weight: 500;
  color: #000;
  margin: 0 0 30px;
  line-height: 1.4;
}

.price-section {
  background: #f8f8f8;
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.current-price {
  display: flex;
  align-items: baseline;
  margin-bottom: 10px;
}

.current-price .label {
  font-size: 16px;
  color: #666;
  margin-right: 15px;
}

.current-price .currency {
  font-size: 24px;
  color: #000;
  margin-right: 4px;
}

.current-price .amount {
  font-size: 36px;
  font-weight: 600;
  color: #000;
}

.original-price {
  display: flex;
  align-items: center;
}

.original-price .label {
  font-size: 14px;
  color: #999;
  margin-right: 15px;
}

.original-price .price {
  font-size: 16px;
  color: #999;
  text-decoration: line-through;
}

.info-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item .label {
  font-size: 14px;
  color: #666;
}

.info-item .value {
  font-size: 16px;
  color: #333;
}

.seller-section {
  padding: 20px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  margin-bottom: 30px;
}

.seller-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.seller-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.seller-name {
  font-size: 16px;
  color: #333;
}

.description-section {
  margin-bottom: 40px;
}

.description-section h3 {
  font-size: 18px;
  font-weight: 500;
  margin: 0 0 15px;
  color: #333;
}

.description-section p {
  font-size: 16px;
  line-height: 1.6;
  color: #666;
}

.action-section {
  position: sticky;
  bottom: 0;
  background: #fff;
  padding: 30px 0;
  border-top: 1px solid #eee;
}

.quantity-selector {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.quantity-selector .label {
  font-size: 16px;
  color: #333;
  margin-right: 15px;
}

.button-group {
  display: flex;
  gap: 20px;
}

.button-group .el-button {
  flex: 1;
  height: 50px;
  font-size: 16px;
}

/* Element UI 样式覆盖 */
:deep(.el-breadcrumb__inner) {
  color: #666;
}

:deep(.el-breadcrumb__inner.is-link:hover) {
  color: #000;
}

:deep(.el-input-number) {
  width: 150px;
}

:deep(.el-button--primary) {
  background-color: #000;
  border-color: #000;
}

:deep(.el-button--primary:hover) {
  background-color: #333;
  border-color: #333;
}

:deep(.el-button--primary.is-plain) {
  color: #000;
  background: #fff;
  border-color: #000;
}

:deep(.el-button--primary.is-plain:hover) {
  color: #fff;
  background-color: #000;
  border-color: #000;
}
</style> 