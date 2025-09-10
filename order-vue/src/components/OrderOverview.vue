`<template>
  <div class="order-overview">
    <h2>订单总览</h2>
    
    <div class="orders-list">
      <div v-for="order in orders" :key="order.id" class="order-item">
        <div class="order-header">
          <span>桌号: {{ order.tableNumber }}</span>
          <span>时间: {{ formatDate(order.timestamp) }}</span>
        </div>
        
        <div class="order-items">
          <div v-for="item in order.items" :key="item.id">
            {{ item.name }} x {{ item.quantity }} - ¥{{ item.price * item.quantity }}
          </div>
        </div>
        
        <div class="order-footer">
          <span>总价: ¥{{ order.total }}</span>
          <div class="order-status">
            <span :class="['status-tag', order.status]">{{ getStatusText(order.status) }}</span>
          </div>
          <div class="order-actions">
            <template v-if="order.status === 'pending'">
              <el-button type="warning" @click="handleCook(order)">
                开始制作
              </el-button>
            </template>
            <template v-else-if="order.status === 'cooking'">
              <el-button type="success" @click="handleServe(order)">
                完成出餐
              </el-button>
            </template>
            <template v-else-if="order.status === 'ready'">
              <el-button type="primary" @click="goToCheckout(order)">
                去结算
              </el-button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'

const store = useStore()
const orders = computed(() => store.state.orders.list)

const getStatusText = (status) => {
  const statusMap = {
    pending: '待制作',
    cooking: '制作中',
    ready: '待结算',
    paid: '已完成'
  }
  return statusMap[status]
}

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString()
}

const handleCook = async (order) => {
  try {
    await store.dispatch('orders/cookOrder', order.id)
    ElMessage.success('订单已开始制作')
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const handleServe = async (order) => {
  try {
    await store.dispatch('orders/serveOrder', order.id)
    ElMessage.success('订单已出餐完成')
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const goToCheckout = (order) => {
  store.commit('cart/SET_TABLE', order.tableNumber)
  store.commit('setCurrentView', 'checkout')
}
</script>

<style scoped>
.order-overview {
  padding: 24px;
}

.orders-list {
  display: grid;
  gap: 20px;
  margin-top: 24px;
}

.order-item {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}

.order-header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
  color: #606266;
}

.order-items {
  padding: 16px 0;
}

.order-items > div {
  padding: 8px 0;
  color: #606266;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.order-footer span:first-child {
  color: #f56c6c;
  font-weight: bold;
}

.order-footer .el-button {
  padding: 8px 24px;
}

.order-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
}

.status-tag.pending {
  background-color: #e6a23c1a;
  color: #e6a23c;
}

.status-tag.cooking {
  background-color: #409eff1a;
  color: #409eff;
}

.status-tag.ready {
  background-color: #67c23a1a;
  color: #67c23a;
}

.status-tag.paid {
  background-color: #9093991a;
  color: #909399;
}

.order-actions {
  display: flex;
  gap: 8px;
}
</style>`