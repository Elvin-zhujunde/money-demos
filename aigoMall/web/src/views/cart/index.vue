<template>
  <div class="cart-container">
    <div class="container">
      <div class="cart-header">
        <h2>购物车</h2>
        <el-button type="text" @click="$router.push('/')">继续购物</el-button>
      </div>

      <div class="cart-content" v-if="cartItems.length > 0">
        <el-table :data="cartItems" style="width: 100%">
          <el-table-column width="50">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.selected" @change="handleSelect"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="商品信息" min-width="400">
            <template slot-scope="scope">
              <div class="product-info">
                <img :src="scope.row.cover" :alt="scope.row.title" />
                <div class="product-detail">
                  <div class="title">{{ scope.row.title }}</div>
                  <div class="seller">{{ scope.row.seller_name }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="单价" width="150">
            <template slot-scope="scope">
              <div class="price">¥{{ scope.row.price }}</div>
            </template>
          </el-table-column>
          <el-table-column label="数量" width="200">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.quantity"
                :min="1"
                :max="scope.row.stock"
                size="small"
                @change="handleQuantityChange(scope.row)"
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="小计" width="150">
            <template slot-scope="scope">
              <div class="subtotal">
                ¥{{ (scope.row.price * scope.row.quantity).toFixed(2) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                type="text"
                class="delete-btn"
                @click="handleDelete(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 底部结算栏 -->
        <div class="cart-footer">
          <div class="left">
            <el-checkbox v-model="selectAll" @change="handleSelectAll">全选</el-checkbox>
            <el-button type="text" @click="handleBatchDelete">删除选中</el-button>
          </div>
          <div class="right">
            <div class="total">
              已选择 <span>{{ selectedCount }}</span> 件商品 
              合计：<span class="price">¥{{ totalPrice.toFixed(2) }}</span>
            </div>
            <el-button
              type="primary"
              size="large"
              :disabled="selectedCount === 0"
              @click="handleBatchCheckout"
            >
              结算
            </el-button>
          </div>
        </div>
      </div>

      <!-- 空购物车 -->
      <div class="empty-cart" v-else>
        <i class="el-icon-shopping-cart-2"></i>
        <p>购物车还是空的</p>
        <el-button type="primary" @click="$router.push('/')">去逛逛</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cartItems: [],
      loading: false
    }
  },
  computed: {
    selectAll: {
      get() {
        return this.cartItems.length > 0 && this.cartItems.every(item => item.selected)
      },
      set(value) {
        this.cartItems.forEach(item => item.selected = value)
      }
    },
    selectedCount() {
      return this.cartItems.filter(item => item.selected).length
    },
    totalPrice() {
      return this.cartItems
        .filter(item => item.selected)
        .reduce((total, item) => total + item.price * item.quantity, 0)
    }
  },
  created() {
    this.fetchCartItems()
  },
  methods: {
    async fetchCartItems() {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        const res = await this.$axios.get(`/api/cart/${userInfo.id}`)
        if (res.code === 200) {
          this.cartItems = res.data.map(item => ({
            ...item,
            selected: false
          }))
        }
      } catch (error) {
        console.error('获取购物车失败:', error)
        this.$message.error('获取购物车失败')
      }
    },
    handleSelect() {
      // 单个选择时触发，不需要特殊处理
    },
    handleSelectAll(value) {
      this.cartItems.forEach(item => item.selected = value)
    },
    async handleBatchDelete() {
      try {
        const selectedItems = this.cartItems.filter(item => item.selected)
        if (selectedItems.length === 0) {
          this.$message.warning('请选择要删除的商品')
          return
        }

        await this.$confirm('确定要删除选中的商品吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        const ids = selectedItems.map(item => item.id)
        const res = await this.$axios.post('/api/cart/batch-remove', { ids })

        if (res.code === 200) {
          this.$message.success('删除成功')
          await this.fetchCartItems()
        } else {
          this.$message.error(res.message)
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('批量删除失败:', error)
          this.$message.error('删除失败')
        }
      }
    },
    async handleDelete(item) {
      try {
        await this.$confirm('确定要删除该商品吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        const res = await this.$axios.delete(`/api/cart/${item.id}`)
        if (res.code === 200) {
          this.$message.success('删除成功')
          await this.fetchCartItems()
        } else {
          this.$message.error(res.message)
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除失败:', error)
          this.$message.error('删除失败')
        }
      }
    },
    async handleQuantityChange(item) {
      try {
        const res = await this.$axios.put('/api/cart/quantity', {
          id: item.id,
          quantity: item.quantity
        })

        if (res.code !== 200) {
          this.$message.error(res.message)
        }
      } catch (error) {
        console.error('更新数量失败:', error)
        this.$message.error('更新数量失败')
      }
    },
    handleBatchCheckout() {
      const selectedItems = this.cartItems.filter(item => item.selected)
      if (selectedItems.length === 0) {
        this.$message.warning('请选择要结算的商品')
        return
      }
      this.$router.push({
        path: '/checkout',
        query: {
          items: JSON.stringify(selectedItems)
        }
      })
    }
  }
}
</script>

<style scoped>
.cart-container {
  padding: 20px 0;
}

.container {
  width: 1200px;
  margin: 0 auto;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.cart-header h2 {
  font-size: 24px;
  color: #333;
  font-weight: 500;
}

.cart-content {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 商品信息样式 */
.product-info {
  display: flex;
  align-items: center;
  padding: 10px 0;
}

.product-info img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 15px;
}

.product-detail {
  flex: 1;
}

.product-detail .title {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.4;
}

.product-detail .seller {
  font-size: 12px;
  color: #999;
}

/* 价格样式 */
.price,
.subtotal {
  color: #ff6b35;
  font-weight: 500;
}

/* 删除按钮 */
.delete-btn {
  color: #999;
}

.delete-btn:hover {
  color: #ff6b35;
}

/* 底部结算栏 */
.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.cart-footer .left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.cart-footer .right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.total {
  font-size: 14px;
  color: #666;
}

.total span {
  color: #333;
  margin: 0 5px;
}

.total .price {
  font-size: 20px;
  font-weight: bold;
  color: #ff6b35;
}

/* 空购物车样式 */
.empty-cart {
  text-align: center;
  padding: 60px 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.empty-cart i {
  font-size: 60px;
  color: #999;
  margin-bottom: 20px;
}

.empty-cart p {
  color: #666;
  margin-bottom: 20px;
}

/* Element UI 样式覆盖 */
:deep(.el-table) {
  border-radius: 8px;
}

:deep(.el-button--primary) {
  background-color: #333;
  border-color: #333;
}

:deep(.el-button--primary:hover) {
  background-color: #555;
  border-color: #555;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #333;
  border-color: #333;
}

:deep(.el-input-number) {
  width: 120px;
}
</style>
