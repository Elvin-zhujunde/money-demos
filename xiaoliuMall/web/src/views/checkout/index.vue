<template>
  <div class="checkout-container">
    <div class="container">
      <h2>订单结算</h2>
      
      <!-- 收货地址 -->
      <div class="section address-section">
        <div class="section-header">
          <h3>收货地址</h3>
          <el-button type="text" @click="showAddressDrawer = true">
            <i class="el-icon-plus"></i>
            选择地址
          </el-button>
        </div>
        <!-- 选中的地址展示 -->
        <div v-if="selectedAddressInfo" class="selected-address">
          <div class="address-info">
            <div class="receiver">
              <span class="name">{{ selectedAddressInfo.receiver }}</span>
              <span class="phone">{{ selectedAddressInfo.phone }}</span>
              <el-tag size="mini" type="primary" v-if="selectedAddressInfo.is_default">默认</el-tag>
            </div>
            <div class="address">
              {{ selectedAddressInfo.province }}{{ selectedAddressInfo.city }}{{ selectedAddressInfo.district }}{{ selectedAddressInfo.detail_address }}
            </div>
          </div>
          <el-button type="text" @click="showAddressDrawer = true">更换地址</el-button>
        </div>
        <div v-else class="no-address" @click="showAddressDrawer = true">
          <i class="el-icon-plus"></i>
          <span>请选择收货地址</span>
        </div>
      </div>

      <!-- 商品清单 -->
      <div class="section order-section">
        <div class="section-header">
          <h3>商品清单</h3>
        </div>
        <el-table :data="orderItems" style="width: 100%">
          <el-table-column label="商品信息" min-width="400">
            <template slot-scope="scope">
              <div class="product-info">
                <img :src="scope.row.cover" :alt="scope.row.title">
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
          <el-table-column label="数量" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.quantity }}</span>
            </template>
          </el-table-column>
          <el-table-column label="小计" width="150">
            <template slot-scope="scope">
              <div class="subtotal">¥{{ (scope.row.price * scope.row.quantity).toFixed(2) }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 支付方式 -->
      <div class="section payment-section">
        <div class="section-header">
          <h3>支付方式</h3>
        </div>
        <el-radio-group v-model="paymentMethod">
          <el-radio :label="1">微信支付</el-radio>
          <el-radio :label="2">支付宝</el-radio>
        </el-radio-group>
      </div>

      <!-- 订单金额 -->
      <div class="section amount-info">
        <h3>订单金额</h3>
        <div class="amount-detail">
          <p>
            <span>商品总额：</span>
            <span class="price">¥{{ totalPrice.toFixed(2) }}</span>
          </p>
          <p>
            <span>运费：</span>
            <span class="price">¥0.00</span>
          </p>
          <p class="total">
            <span>实付金额：</span>
            <span class="price">¥{{ totalPrice.toFixed(2) }}</span>
          </p>
        </div>
      </div>

      <!-- 提交订单 -->
      <div class="submit-order">
        <el-button 
          type="primary" 
          size="large" 
          :loading="submitting"
          @click="submitOrder"
        >
          提交订单
        </el-button>
      </div>
    </div>

    <!-- 地址抽屉 -->
    <el-drawer
      title="选择收货地址"
      :visible.sync="showAddressDrawer"
      direction="rtl"
      size="500px"
      :before-close="handleDrawerClose"
    >
      <div class="drawer-content">
        <!-- 地址列表 -->
        <div class="address-list">
          <div 
            v-for="address in addresses" 
            :key="address.id"
            class="address-item"
            :class="{ active: selectedAddress === address.id }"
            @click="handleSelectAddress(address)"
          >
            <div class="address-info">
              <div class="receiver">
                <span class="name">{{ address.receiver }}</span>
                <span class="phone">{{ address.phone }}</span>
                <el-tag size="mini" type="primary" v-if="address.is_default">默认</el-tag>
              </div>
              <div class="address">
                {{ address.province }}{{ address.city }}{{ address.district }}{{ address.detail_address }}
              </div>
            </div>
            <div class="address-actions">
              <el-button type="text" size="small" @click.stop="handleEditAddress(address)">
                <i class="el-icon-edit"></i>
              </el-button>
              <el-button type="text" size="small" @click.stop="handleDeleteAddress(address)">
                <i class="el-icon-delete"></i>
              </el-button>
            </div>
          </div>
        </div>

        <!-- 底部添加按钮 -->
        <div class="drawer-footer">
          <el-button type="primary" @click="showAddressDialog = true">新增收货地址</el-button>
        </div>
      </div>
    </el-drawer>

    <!-- 新增地址对话框 -->
    <el-dialog
      title="新增收货地址"
      :visible.sync="showAddressDialog"
      width="500px"
    >
      <el-form 
        ref="addressForm" 
        :model="addressForm" 
        :rules="addressRules"
        label-width="100px"
      >
        <el-form-item label="收货人" prop="receiver">
          <el-input v-model="addressForm.receiver" placeholder="请输入收货人姓名"></el-input>
        </el-form-item>
        
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="addressForm.phone" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        
        <el-form-item label="所在地区" prop="region">
          <el-cascader
            v-model="addressForm.region"
            :options="regionData"
            placeholder="请选择所在地区"
          ></el-cascader>
        </el-form-item>
        
        <el-form-item label="详细地址" prop="detail_address">
          <el-input 
            type="textarea" 
            v-model="addressForm.detail_address"
            placeholder="请输入详细地址"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="addressForm.is_default">设为默认地址</el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="showAddressDialog = false">取消</el-button>
        <el-button type="primary" :loading="submittingAddress" @click="submitAddress">确定</el-button>
      </div>
    </el-dialog>

    <!-- 支付弹窗 -->
    <PaymentDialog
      :visible.sync="showPaymentDialog"
      :amount="Number(totalPrice)"
      :payment-method="Number(paymentMethod)"
      @paid="handlePaymentSuccess"
      @cancel="handlePaymentCancel"
    />
  </div>
</template>

<script>
import PaymentDialog from '@/components/PaymentDialog.vue'
import { regionData } from '@/utils/region-data'

export default {
  name: 'Checkout',
  components: {
    PaymentDialog
  },
  data() {
    return {
      addresses: [],
      selectedAddress: null,
      orderItems: [],
      remark: '',
      paymentMethod: 1,
      submitting: false,
      showAddressDialog: false,
      showPaymentDialog: false,
      orderNo: '',
      addressForm: {
        receiver: '',
        phone: '',
        region: [],
        detail_address: '',
        is_default: false
      },
      addressRules: {
        receiver: [
          { required: true, message: '请输入收货人姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择所在地区', trigger: 'change' }
        ],
        detail_address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      regionData,
      submittingAddress: false,
      showAddressDrawer: false,
      selectedAddressInfo: null
    }
  },
  computed: {
    totalPrice() {
      return this.orderItems.reduce((total, item) => {
        return total + item.price * item.quantity
      }, 0)
    }
  },
  created() {
    this.initOrderItems()
    this.fetchAddresses()
  },
  methods: {
    initOrderItems() {
      const items = this.$route.query.items
      if (items) {
        this.orderItems = JSON.parse(items)
      }
    },
    async fetchAddresses() {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        const res = await this.$axios.get(`/api/addresses/${userInfo.id}`)
        if (res.code === 200) {
          this.addresses = res.data
          // 如果有默认地址，自动选中
          const defaultAddress = this.addresses.find(addr => addr.is_default)
          if (defaultAddress) {
            this.selectedAddress = defaultAddress.id
          }
        }
      } catch (error) {
        console.error('获取地址列表失败:', error)
        this.$message.error('获取地址列表失败')
      }
    },
    async submitOrder() {
      if (!this.selectedAddress) {
        return this.$message.warning('请选择收货地址')
      }

      try {
        this.submitting = true
        const res = await this.$axios.post('/api/orders', {
          address_id: this.selectedAddress,
          items: this.orderItems,
          payment_method: this.paymentMethod,
          remark: this.remark
        })

        if (res.code === 200) {
          this.orderNo = res.data.order_no
          this.showPaymentDialog = true
        } else {
          this.$message.error(res.message)
        }
      } catch (error) {
        console.error('提交订单失败:', error)
        this.$message.error('提交订单失败')
      } finally {
        this.submitting = false
      }
    },
    async handlePaymentSuccess() {
      try {
        const res = await this.$axios.post(`/api/orders/${this.orderNo}/pay`)
        if (res.code === 200) {
          this.$message.success('支付成功')
          this.$router.push('/profile')
        } else {
          this.$message.error(res.message)
        }
      } catch (error) {
        console.error('支付失败:', error)
        this.$message.error('支付失败')
      }
      this.showPaymentDialog = false
    },
    handlePaymentCancel() {
      this.$router.push('/profile')
    },
    async submitAddress() {
      try {
        await this.$refs.addressForm.validate()
        this.submittingAddress = true

        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        const [province, city, district] = this.addressForm.region

        const res = await this.$axios.post('/api/addresses', {
          user_id: userInfo.id,
          receiver: this.addressForm.receiver,
          phone: this.addressForm.phone,
          province,
          city,
          district,
          detail_address: this.addressForm.detail_address,
          is_default: this.addressForm.is_default
        })

        if (res.code === 200) {
          this.$message.success('添加成功')
          this.showAddressDialog = false
          this.$refs.addressForm.resetFields()
          await this.fetchAddresses()
        } else {
          this.$message.error(res.message)
        }
      } catch (error) {
        console.error('添加地址失败:', error)
        this.$message.error('添加地址失败')
      } finally {
        this.submittingAddress = false
      }
    },
    handleSelectAddress(address) {
      this.selectedAddress = address.id
      this.selectedAddressInfo = address
      this.showAddressDrawer = false
    },
    handleDrawerClose(done) {
      if (!this.selectedAddress) {
        this.$message.warning('请选择收货地址')
        return
      }
      done()
    },
    async handleEditAddress(address) {
      // TODO: 实现编辑地址功能
    },
    async handleDeleteAddress(address) {
      // TODO: 实现删除地址功能
    }
  }
}
</script>

<style scoped>
.checkout-container {
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

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  font-size: 18px;
  color: #333;
  font-weight: 500;
  margin: 0;
}

/* 地址样式 */
.address-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.address-item {
  position: relative;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s;
  cursor: pointer;
}

.address-item:hover {
  border-color: #333;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.address-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.address-info .receiver {
  display: flex;
  align-items: center;
  gap: 10px;
}

.address-info .name {
  font-weight: 500;
  color: #333;
}

.address-info .phone {
  color: #666;
}

.address-info .address {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-all;
}

/* 商品信息样式 */
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
  margin-bottom: 5px;
}

.product-detail .seller {
  color: #999;
  font-size: 12px;
}

/* 金额样式 */
.order-amount {
  border-top: 1px solid #f0f0f0;
  padding-top: 20px;
  margin-top: 30px;
}

.amount-item {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  color: #666;
}

.amount-item.total {
  font-size: 16px;
  color: #333;
}

.price {
  color: #FF6B35;
  font-weight: 500;
  margin-left: 20px;
}

.amount-item.total .price {
  font-size: 20px;
}

/* 提交订单按钮 */
.submit-order {
  text-align: right;
  margin-top: 30px;
}

.submit-order .el-button {
  width: 180px;
  height: 45px;
}

/* Element UI 样式覆盖 */
:deep(.el-radio__input.is-checked .el-radio__inner) {
  background-color: #333;
  border-color: #333;
}

:deep(.el-tag--primary) {
  background-color: #333;
  border-color: #333;
  color: #fff;
}

/* 选中的地址样式 */
.selected-address {
  background: #f8f8f8;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.no-address {
  background: #f8f8f8;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  color: #666;
}

.no-address i {
  font-size: 24px;
  margin-right: 8px;
}

/* 抽屉内容样式 */
.drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.drawer-content .address-list {
  overflow-y: auto;
}

.drawer-content .address-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.drawer-content .address-item:hover {
  border-color: #999;
}

.drawer-content .address-item.active {
  border-color: #333;
  background: #f8f8f8;
}

.address-actions {
  opacity: 0;
  transition: opacity 0.3s;
}

.address-item:hover .address-actions {
  opacity: 1;
}

.drawer-footer {
  margin-top: auto;
  padding: 20px 0;
  text-align: center;
  border-top: 1px solid #f0f0f0;
}

/* Element UI 样式覆盖 */
:deep(.el-drawer__header) {
  margin-bottom: 0;
  padding: 20px;
  font-size: 18px;
  font-weight: 500;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-drawer__body) {
  padding: 0;
}
</style> 