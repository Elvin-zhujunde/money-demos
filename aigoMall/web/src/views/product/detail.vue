<template>
  <div class="product-detail">
    <div class="container">
      <div class="product-info">
        <div class="left">
          <div class="product-image">
            <img :src="product.cover" :alt="product.title">
          </div>
        </div>
        <div class="right">
          <h1 class="title">{{ product.title }}</h1>
          <div class="seller">商家：{{ product.seller_name }}</div>
          <div class="price-row">
            <div class="price">
              <span class="currency">¥</span>
              <span class="amount">{{ product.price }}</span>
              <span class="original" v-if="product.original_price && product.original_price > product.price">
                ¥{{ product.original_price }}
              </span>
            </div>
            <div class="sales">已售 {{ product.sales }} 件</div>
          </div>
          <div class="shipping">发货地：{{ product.shipping_from }}</div>
          <div class="description">{{ product.description }}</div>
          
          <div class="quantity-row">
            <span class="label">购买数量：</span>
            <el-input-number 
              v-model="quantity" 
              :min="1" 
              :max="product.stock"
              size="small"
            ></el-input-number>
            <span class="stock">库存：{{ product.stock }}件</span>
          </div>

          <div class="action-row">
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
      userInfo: null
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
  padding: 20px 0;
}

.container {
  width: 1200px;
  margin: 0 auto;
}

.product-info {
  display: flex;
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.left {
  width: 400px;
  margin-right: 40px;
}

.product-image {
  width: 400px;
  height: 400px;
  overflow: hidden;
  border-radius: 8px;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.right {
  flex: 1;
  padding: 20px 0;
}

.title {
  font-size: 24px;
  color: #333;
  margin-bottom: 15px;
  line-height: 1.4;
}

.seller {
  color: #666;
  margin-bottom: 20px;
}

.price-row {
  display: flex;
  align-items: baseline;
  margin-bottom: 20px;
}

.price {
  display: flex;
  align-items: baseline;
}

.price .currency {
  font-size: 16px;
  color: #FF6B35;
}

.price .amount {
  font-size: 32px;
  font-weight: bold;
  color: #FF6B35;
  margin-right: 10px;
}

.price .original {
  color: #999;
  text-decoration: line-through;
  font-size: 14px;
}

.sales {
  color: #999;
  margin-left: 20px;
}

.shipping {
  color: #666;
  margin-bottom: 20px;
}

.description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 30px;
}

.quantity-row {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.quantity-row .label {
  margin-right: 10px;
  color: #666;
}

.quantity-row .stock {
  margin-left: 20px;
  color: #999;
}

.action-row {
  display: flex;
  gap: 20px;
}

.action-row .el-button {
  width: 180px;
  height: 45px;
}

:deep(.el-button--primary) {
  background-color: #333;
  border-color: #333;
}

:deep(.el-button--primary:hover) {
  background-color: #555;
  border-color: #555;
}

:deep(.el-button--primary.is-plain) {
  color: #333;
  background: #fff;
  border-color: #333;
}

:deep(.el-button--primary.is-plain:hover) {
  color: #fff;
  background-color: #333;
}

/* ... 其他样式保持不变 */
</style> 