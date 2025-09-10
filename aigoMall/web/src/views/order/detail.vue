<template>
  <div class="order-detail">
    <div class="container">
      <!-- 订单状态卡片 -->
      <div class="section status-card" v-if="order && order.order_no">
        <div class="status-icon">
          <i :class="getStatusIcon"></i>
        </div>
        <div class="status-info">
          <h2>{{ getStatusText }}</h2>
          <p v-if="order && order.status === 0">请在24小时内完成支付，超时订单将自动取消</p>
          <p v-else-if="order && order.status === 1">商家正在处理您的订单，请耐心等待</p>
          <p v-else-if="order && order.status === 2">商品已发出，请注意查收</p>
        </div>
        <div class="status-action" v-if="order && order.status === 0">
          <el-button type="primary" @click="handlePay">立即支付</el-button>
          <el-button @click="handleCancel">取消订单</el-button>
        </div>
      </div>

      <!-- 收货信息 -->
      <div class="section" v-if="order && order.receiver">
        <h3>收货信息</h3>
        <div class="info-content">
          <p>
            <span class="label">收货人：</span>
            {{ order.receiver }}
            <span class="phone">{{ order.receiver_phone }}</span>
          </p>
          <p>
            <span class="label">收货地址：</span>
            {{ order.province }}{{ order.city }}{{ order.district }}{{ order.detail_address }}
          </p>
        </div>
      </div>

      <!-- 商品信息 -->
      <div class="section" v-if="order && order.items && order.items.length">
        <h3>商品信息</h3>
        <el-table :data="order.items" style="width: 100%">
          <el-table-column label="商品信息" min-width="400">
            <template slot-scope="scope">
              <div class="product-info">
                <img :src="scope.row.product_cover" :alt="scope.row.product_title">
                <div class="product-detail">
                  <div class="title">{{ scope.row.product_title }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="单价" width="150">
            <template slot-scope="scope">
              <div class="price">¥{{ scope.row.product_price }}</div>
            </template>
          </el-table-column>
          <el-table-column label="数量" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.quantity }}</span>
            </template>
          </el-table-column>
          <el-table-column label="小计" width="150">
            <template slot-scope="scope">
              <div class="subtotal">¥{{ (scope.row.product_price * scope.row.quantity).toFixed(2) }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 订单信息 -->
      <div class="section" v-if="order && order.order_no">
        <h3>订单信息</h3>
        <div class="info-content">
          <p><span class="label">订单编号：</span>{{ order.order_no }}</p>
          <p><span class="label">创建时间：</span>{{ formatTime(order.created_at) }}</p>
          <p><span class="label">支付方式：</span>{{ getPaymentMethod }}</p>
          <p v-if="order.paid_time"><span class="label">支付时间：</span>{{ formatTime(order.paid_time) }}</p>
        </div>
      </div>

      <!-- 订单金额 -->
      <div class="section" v-if="order && order.total_amount">
        <h3>订单金额</h3>
        <div class="amount-detail">
          <p>
            <span>商品总额：</span>
            <span class="price">¥{{ order.total_amount }}</span>
          </p>
          <p>
            <span>运费：</span>
            <span class="price">¥0.00</span>
          </p>
          <p class="total">
            <span>实付金额：</span>
            <span class="price">¥{{ order.total_amount }}</span>
          </p>
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
  padding: 20px 0;
}

.container {
  width: 1200px;
  margin: 0 auto;
}

.section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.section h3 {
  font-size: 18px;
  color: #333;
  font-weight: 500;
  margin: 0 0 20px 0;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

/* 状态卡片 */
.status-card {
  display: flex;
  align-items: center;
}

.status-icon {
  font-size: 48px;
  color: #333;
  margin-right: 20px;
}

.status-info h2 {
  font-size: 24px;
  color: #333;
  margin: 0 0 10px 0;
}

.status-info p {
  color: #666;
  margin: 0;
}

.status-action {
  margin-left: auto;
}

/* 信息内容 */
.info-content {
  color: #666;
  line-height: 1.8;
}

.info-content .label {
  color: #999;
  margin-right: 10px;
}

.info-content .phone {
  margin-left: 20px;
}

/* 商品信息 */
.product-info {
  display: flex;
  align-items: center;
}

.product-info img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 10px;
}

.product-detail .title {
  color: #333;
}

/* 金额信息 */
.amount-detail {
  text-align: right;
  color: #666;
}

.amount-detail p {
  margin: 10px 0;
}

.amount-detail .price {
  color: #FF6B35;
  font-weight: 500;
  margin-left: 20px;
  font-size: 16px;
}

.amount-detail .total {
  font-size: 16px;
  color: #333;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.amount-detail .total .price {
  font-size: 20px;
}

/* Element UI 样式覆盖 */
:deep(.el-button--primary) {
  background-color: #333;
  border-color: #333;
}

:deep(.el-button--primary:hover) {
  background-color: #555;
  border-color: #555;
}
</style> 