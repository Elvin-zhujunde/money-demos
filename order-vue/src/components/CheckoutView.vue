`<template>
  <div class="checkout-view">
    <h2>结算 - 桌号: {{ tableNumber }}</h2>
    
    <div v-if="order" class="cart-items">
      <div v-for="item in order.items" :key="item.id" class="cart-item">
        <span>{{ item.name }}</span>
        <span>¥{{ item.price }} x {{ item.quantity }}</span>
      </div>
      
      <div class="total">
        总计: ¥{{ order.total }}
      </div>
      
      <div v-if="order.status === 'ready'" class="actions">
        <el-button 
          type="primary" 
          @click="handleCheckout" 
          :loading="loading"
        >
          结算
        </el-button>
      </div>
      <div v-else-if="order.status === 'paid'" class="paid-status">
        已结算
      </div>
    </div>
    
    <div v-else class="no-order">
      未找到订单信息
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'

const store = useStore()
const loading = ref(false)

const tableNumber = computed(() => store.state.cart.currentTable)
const order = computed(() => 
  store.getters['orders/getOrderByTable'](tableNumber.value)
)

const handleCheckout = async () => {
  if (!order.value) return
  
  try {
    loading.value = true
    await store.dispatch('orders/payOrder', order.value.id)
    ElMessage.success('支付成功')
  } catch (error) {
    ElMessage.error('支付失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.checkout-view {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.cart-items {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #ebeef5;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.item-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.total {
  font-size: 1.4em;
  font-weight: bold;
  margin: 24px 0;
  text-align: right;
  color: #f56c6c;
}

.paid-status {
  color: #67C23A;
  font-weight: bold;
  background: #f0f9eb;
  padding: 8px 16px;
  border-radius: 4px;
  display: inline-block;
}

.actions {
  margin-top: 24px;
  text-align: center;
}

.actions .el-button {
  padding: 12px 36px;
  font-size: 16px;
}

.no-order {
  text-align: center;
  color: #999;
  margin-top: 40px;
}
</style>`