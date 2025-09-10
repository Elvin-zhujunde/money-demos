<template>
  <div class="order-detail">
    <div class="container">
      <!-- 订单状态卡片 -->
      <div class="status-section" v-if="order && order.order_no">
        <div class="status-content">
          <div class="status-info">
            <div class="status-icon">
              <i :class="getStatusIcon"></i>
            </div>
            <div class="status-text">
              <h2>{{ getStatusText }}</h2>
              <p v-if="order && order.status === 0">请在24小时内完成支付，超时订单将自动取消</p>
              <p v-else-if="order && order.status === 1">商家正在处理您的订单，请耐心等待</p>
              <p v-else-if="order && order.status === 2">商品已发出，请注意查收</p>
            </div>
          </div>
          <div class="status-action" v-if="order && order.status === 0">
            <el-button type="primary" size="large" @click="handlePay">立即支付</el-button>
            <el-button size="large" @click="handleCancel">取消订单</el-button>
          </div>
        </div>
      </div>

      <div class="order-grid">
        <div class="order-main">
          <!-- 商品信息 -->
          <div class="section products-section" v-if="order && order.items && order.items.length">
            <div class="section-header">
              <h3>商品信息</h3>
            </div>
            <div class="products-list">
              <div v-for="item in order.items" :key="item.id" class="product-item">
                <div class="product-image">
                  <img :src="item.product_cover" :alt="item.product_title">
                </div>
                <div class="product-info">
                  <div class="product-title">{{ item.product_title }}</div>
                  <div class="product-meta">
                    <span class="price">¥{{ item.product_price }}</span>
                    <span class="quantity">× {{ item.quantity }}</span>
                  </div>
                </div>
                <div class="product-subtotal">
                  <div class="label">小计</div>
                  <div class="amount">¥{{ (item.product_price * item.quantity).toFixed(2) }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 收货信息 -->
          <div class="section" v-if="order && order.receiver">
            <div class="section-header">
              <h3>收货信息</h3>
            </div>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">收货人</span>
                <span class="value">{{ order.receiver }}</span>
              </div>
              <div class="info-item">
                <span class="label">联系电话</span>
                <span class="value">{{ order.receiver_phone }}</span>
              </div>
              <div class="info-item full-width">
                <span class="label">收货地址</span>
                <span class="value">{{ order.province }}{{ order.city }}{{ order.district }}{{ order.detail_address }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="order-side">
          <!-- 订单信息 -->
          <div class="section" v-if="order && order.order_no">
            <div class="section-header">
              <h3>订单信息</h3>
            </div>
            <div class="info-list">
              <div class="info-item">
                <span class="label">订单编号</span>
                <span class="value">{{ order.order_no }}</span>
              </div>
              <div class="info-item">
                <span class="label">创建时间</span>
                <span class="value">{{ formatTime(order.created_at) }}</span>
              </div>
              <div class="info-item">
                <span class="label">支付方式</span>
                <span class="value">{{ getPaymentMethod }}</span>
              </div>
              <div class="info-item" v-if="order.paid_time">
                <span class="label">支付时间</span>
                <span class="value">{{ formatTime(order.paid_time) }}</span>
              </div>
            </div>
          </div>

          <!-- 订单金额 -->
          <div class="section amount-section" v-if="order && order.total_amount">
            <div class="section-header">
              <h3>订单金额</h3>
            </div>
            <div class="amount-list">
              <div class="amount-item">
                <span>商品总额</span>
                <span class="price">¥{{ order.total_amount }}</span>
              </div>
              <div class="amount-item">
                <span>运费</span>
                <span class="price">¥0.00</span>
              </div>
              <div class="amount-item total">
                <span>实付金额</span>
                <span class="price">¥{{ order.total_amount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 支付弹窗 -->
    <PaymentDialog
      :visible.sync="showPaymentDialog"
      :amount="order && order.total_amount ? order.total_amount : 0"
      :payment-method="order && order.payment_method ? order.payment_method : 1"
      @paid="handlePaymentSuccess"
    />
  </div>
</template>

<script>
import { formatTime } from '@/utils/format'
import PaymentDialog from '@/components/PaymentDialog.vue'

export default {
  name: 'OrderDetail',
  components: {
    PaymentDialog
  },
  data() {
    return {
      order: {
        total_amount: 0,
        payment_method: 1,
        items: []
      },
      showPaymentDialog: false
    }
  },
  computed: {
    getStatusIcon() {
      if (!this.order) return ''
      const icons = {
        0: 'el-icon-time',
        1: 'el-icon-box',
        2: 'el-icon-truck',
        3: 'el-icon-check',
        4: 'el-icon-close'
      }
      return icons[this.order.status] || 'el-icon-more'
    },
    getStatusText() {
      if (!this.order) return ''
      const status = {
        0: '待付款',
        1: '待发货',
        2: '待收货',
        3: '已完成',
        4: '已取消'
      }
      return status[this.order.status] || '未知状态'
    },
    getPaymentMethod() {
      if (!this.order) return ''
      return this.order.payment_method === 1 ? '微信支付' : '支付宝'
    }
  },
  created() {
    this.fetchOrderDetail()
    debugger
  },
  methods: {
    formatTime,
    async fetchOrderDetail() {
      try {
        const { orderNo } = this.$route.params
        console.log('请求订单详情, 订单号:', orderNo)
        
        const res = await this.$axios.get(`/api/orders/${orderNo}`)
        console.log('订单详情响应:', res)
        
        if (res.code === 200) {
          this.order = res.data
          console.log('订单数据:', this.order)
        } else {
          this.$message.error(res.message || '获取订单详情失败')
        }
      } catch (error) {
        console.error('获取订单详情失败:', error)
        this.$message.error('获取订单详情失败')
      }
    },
    async handlePay() {
      this.showPaymentDialog = true
    },
    async handlePaymentSuccess() {
      try {
        const res = await this.$axios.post(`/api/orders/${this.order.order_no}/pay`)
        if (res.code === 200) {
          this.$message.success('支付成功')
          await this.fetchOrderDetail()
        }
      } catch (error) {
        console.error('支付失败:', error)
        this.$message.error('支付失败')
      }
      this.showPaymentDialog = false
    },
    async handleCancel() {
      try {
        await this.$confirm('确定要取消订单吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        const res = await this.$axios.post(`/api/orders/${this.order.order_no}/cancel`)
        if (res.code === 200) {
          this.$message.success('订单已取消')
          await this.fetchOrderDetail()
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('取消订单失败:', error)
          this.$message.error('取消订单失败')
        }
      }
    }
  }
}
</script>

<style scoped>
.order-detail {
  padding: 40px 0;
  min-height: 100vh;
  background-color: #f8f8f8;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 订单状态区域 */
.status-section {
  background: #fff;
  border-radius: 12px;
  margin-bottom: 30px;
  overflow: hidden;
}

.status-content {
  padding: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-info {
  display: flex;
  align-items: center;
  gap: 30px;
}

.status-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f8f8f8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: #000;
}

.status-text h2 {
  font-size: 28px;
  font-weight: 500;
  color: #000;
  margin: 0 0 10px;
}

.status-text p {
  color: #666;
  font-size: 15px;
  margin: 0;
}

.status-action {
  display: flex;
  gap: 15px;
}

/* 订单内容网格布局 */
.order-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 30px;
}

.section {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 30px;
}

.section-header {
  padding: 25px 30px;
  border-bottom: 1px solid #f0f0f0;
}

.section-header h3 {
  font-size: 18px;
  font-weight: 500;
  color: #000;
  margin: 0;
}

/* 商品列表样式 */
.products-list {
  padding: 20px 30px;
}

.product-item {
  display: flex;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0;
}

.product-item:last-child {
  border-bottom: none;
}

.product-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  margin-right: 20px;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-title {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
  line-height: 1.4;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  color: #666;
}

.product-subtotal {
  text-align: right;
  margin-left: 30px;
}

.product-subtotal .label {
  font-size: 14px;
  color: #999;
  margin-bottom: 5px;
}

.product-subtotal .amount {
  font-size: 18px;
  font-weight: 500;
  color: #000;
}

/* 信息网格布局 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 30px;
}

.info-grid .full-width {
  grid-column: 1 / -1;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item .label {
  font-size: 14px;
  color: #999;
}

.info-item .value {
  font-size: 16px;
  color: #333;
}

/* 订单信息列表 */
.info-list {
  padding: 20px 30px;
}

.info-list .info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-list .info-item:last-child {
  border-bottom: none;
}

/* 金额信息 */
.amount-list {
  padding: 20px 30px;
}

.amount-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  color: #666;
}

.amount-item.total {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
  color: #000;
  font-size: 16px;
  font-weight: 500;
}

.amount-item .price {
  color: #000;
  font-weight: 500;
}

.amount-item.total .price {
  font-size: 24px;
}

/* Element UI 样式覆盖 */
:deep(.el-button--primary) {
  background-color: #000;
  border-color: #000;
}

:deep(.el-button--primary:hover) {
  background-color: #333;
  border-color: #333;
}

:deep(.el-button--default:hover) {
  color: #000;
  border-color: #000;
}
</style> 