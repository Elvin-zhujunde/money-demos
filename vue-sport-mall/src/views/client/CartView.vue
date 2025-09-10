<template>
  <div class="cart-page">
    <el-card class="cart-card">
      <template #header>
        <div class="cart-header">
          <h2>我的购物车</h2>
          <div class="select-all">
            <el-checkbox 
              v-model="isAllSelected"
              @change="handleSelectAll"
            >
              全选
            </el-checkbox>
          </div>
        </div>
      </template>

      <!-- 购物车为空 -->
      <el-empty
        v-if="cartItems.length === 0"
        description="购物车还是空的"
      >
        <el-button type="primary" @click="$router.push('/')">
          去购物
        </el-button>
      </el-empty>

      <!-- 购物车列表 -->
      <div v-else class="cart-list">
        <el-table :data="cartItems" style="width: 100%">
          <!-- 选择框 -->
          <el-table-column width="50">
            <template #default="{ row }">
              <el-checkbox 
                v-model="row.selected"
                @change="handleSelect"
              />
            </template>
          </el-table-column>

          <!-- 商品信息 -->
          <el-table-column label="商品信息">
            <template #default="{ row }">
              <div class="product-info">
                <el-image 
                  :src="row.product.image"
                  fit="cover"
                  class="product-image"
                  @click="goToDetail(row.product.id)"
                />
                <div class="product-detail">
                  <h3 class="product-title" @click="goToDetail(row.product.id)">
                    {{ row.product.title }}
                  </h3>
                  <p class="product-desc">{{ row.product.description }}</p>
                </div>
              </div>
            </template>
          </el-table-column>

          <!-- 单价 -->
          <el-table-column label="单价" width="120">
            <template #default="{ row }">
              <span class="price">¥{{ row.product.price }}</span>
            </template>
          </el-table-column>

          <!-- 数量 -->
          <el-table-column label="数量" width="200">
            <template #default="{ row }">
              <el-input-number 
                v-model="row.quantity"
                :min="1"
                :max="row.product.stock"
                @change="(value) => handleQuantityChange(row, value)"
              />
            </template>
          </el-table-column>

          <!-- 小计 -->
          <el-table-column label="小计" width="120">
            <template #default="{ row }">
              <span class="subtotal">¥{{ (row.product.price * row.quantity).toFixed(2) }}</span>
            </template>
          </el-table-column>

          <!-- 操作 -->
          <el-table-column label="操作" width="100">
            <template #default="{ row }">
              <el-button 
                type="danger" 
                link
                @click="handleDelete(row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 结算栏 -->
      <div class="cart-footer" v-if="cartItems.length > 0">
        <div class="footer-left">
          <el-button @click="handleClearCart" type="danger" plain>
            清空购物车
          </el-button>
        </div>
        <div class="footer-right">
          <div class="total-info">
            <p>已选择 {{ selectedCount }} 件商品</p>
            <p class="total">
              总计：<span class="total-price">¥{{ totalPrice.toFixed(2) }}</span>
            </p>
          </div>
          <el-button 
            type="primary" 
            size="large"
            :disabled="selectedCount === 0"
            @click="handleCheckout"
          >
            结算
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'

const router = useRouter()
const cartItems = ref([])
const loading = ref(false)

// 获取用户信息
const getUserInfo = () => {
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}

// 计算属性
const isAllSelected = computed({
  get: () => cartItems.value.length > 0 && cartItems.value.every(item => item.selected),
  set: (value) => cartItems.value.forEach(item => item.selected = value)
})

const selectedCount = computed(() => 
  cartItems.value.filter(item => item.selected).length
)

const totalPrice = computed(() => 
  cartItems.value
    .filter(item => item.selected)
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0)
)

// 获取购物车数据
const fetchCartItems = async () => {
  const user = getUserInfo()
  if (!user) return

  loading.value = true
  try {
    const { data } = await axios.get(`/api/cart`, {
      params: { userId: user.id }
    })

    // 获取每个购物车项对应的商品信息
    const itemsWithProduct = await Promise.all(
      data.map(async (item) => {
        const { data: product } = await axios.get(`/api/products/${item.productId}`)
        return { ...item, product }
      })
    )

    cartItems.value = itemsWithProduct
  } catch (error) {
    console.error('获取购物车失败:', error)
    ElMessage.error('获取购物车失败')
  } finally {
    loading.value = false
  }
}

// 更新购物车项
const updateCartItem = async (item, updates) => {
  try {
    await axios.patch(`/api/cart/${item.id}`, updates)
    await fetchCartItems() // 刷新购物车数据
  } catch (error) {
    console.error('更新购物车失败:', error)
    ElMessage.error('更新购物车失败')
  }
}

// 事件处理
const handleSelectAll = () => {
  handleSelect()
}

const handleSelect = () => {
  // 选中状态已通过 v-model 自动更新
}

const handleQuantityChange = async (item, value) => {
  await updateCartItem(item, { quantity: value })
}

const handleDelete = async (item) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这个商品吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    await axios.delete(`/api/cart/${item.id}`)
    ElMessage.success('删除成功')
    await fetchCartItems()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

const handleClearCart = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要清空购物车吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    await Promise.all(
      cartItems.value.map(item => axios.delete(`/api/cart/${item.id}`))
    )
    
    ElMessage.success('购物车已清空')
    await fetchCartItems()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('清空购物车失败:', error)
      ElMessage.error('清空购物车失败')
    }
  }
}

const handleCheckout = async () => {
  try {
    await ElMessageBox.confirm(
      `确认结算 ${selectedCount.value} 件商品？总计：¥${totalPrice.value.toFixed(2)}`,
      '确认结算',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'info',
      }
    )
    
    const user = getUserInfo()
    if (!user) return

    // 获取选中的商品
    const selectedItems = cartItems.value.filter(item => item.selected)
    
    // 创建订单
    const orderData = {
      userId: user.id,
      orderNo: generateOrderNo(), // 生成订单号
      products: selectedItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      })),
      status: 'pending',
      totalAmount: totalPrice.value,
      address: user.address,
      phone: user.phone,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    }

    // 创建订单
    await axios.post('/api/orders', orderData)
    
    // 清空已结算的购物车商品
    await Promise.all(
      selectedItems.map(item => axios.delete(`/api/cart/${item.id}`))
    )
    
    ElMessage.success('下单成功！')
    await fetchCartItems()

    // 跳转到订单页面
    router.push('/user?tab=orders')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('结算失败:', error)
      ElMessage.error('结算失败')
    }
  }
}

// 生成订单号
const generateOrderNo = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
  return `${year}${month}${day}${random}`
}

const goToDetail = (productId) => {
  router.push(`/product/${productId}`)
}

// 生命周期钩子
onMounted(() => {
  fetchCartItems()
})
</script>

<style scoped>
.cart-page {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-header h2 {
  margin: 0;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  cursor: pointer;
}

.product-detail {
  flex: 1;
}

.product-title {
  margin: 0 0 10px 0;
  cursor: pointer;
  color: #303133;
}

.product-title:hover {
  color: #409EFF;
}

.product-desc {
  margin: 0;
  color: #909399;
  font-size: 12px;
}

.price, .subtotal {
  color: #f56c6c;
  font-weight: bold;
}

.cart-footer {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #EBEEF5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.total-info {
  text-align: right;
}

.total-info p {
  margin: 5px 0;
}

.total {
  font-size: 16px;
  font-weight: bold;
}

.total-price {
  color: #f56c6c;
  font-size: 20px;
}
</style>

<script>
export default {
  name: 'CartView'
}
</script> 