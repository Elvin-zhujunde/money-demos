<template>
  <div class="profile-container">
    <!-- 顶部个人信息区域 -->
    <div class="profile-header">
      <div class="container">
        <div class="user-info-content">
          <div class="left-section">
            <div class="avatar-wrapper">
              <div class="avatar">
                <img :src="userInfo.avatar" :alt="userInfo.name" />
              </div>
              <el-button
                class="edit-avatar"
                type="text"
                @click="showUserInfoDialog = true"
              >
                <i class="el-icon-camera"></i>
              </el-button>
            </div>
            <div class="info-detail">
              <h2 class="name">{{ userInfo.name }}</h2>
              <div class="contact-info">
                <span class="contact-item" v-if="userInfo.phone">
                  <i class="el-icon-mobile-phone"></i>
                  {{ userInfo.phone }}
                </span>
                <span class="contact-item" v-if="userInfo.email">
                  <i class="el-icon-message"></i>
                  {{ userInfo.email }}
                </span>
              </div>
            </div>
          </div>
          <div class="right-section">
            <el-button type="primary" @click="showAddressDrawer = true">
              <i class="el-icon-location"></i>
              管理收货地址
            </el-button>
            <el-button @click="showUserInfoDialog = true">
              <i class="el-icon-edit"></i>
              编辑个人信息
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="container main-content">
      <!-- 订单统计卡片 -->
      <div class="stats-grid">
        <div
          class="stats-card total-orders"
          @click="handleStatusSelect(-1)"

          :class="{ active: selectedStatus === -1 }"
        >
          <div class="stats-value">{{ getTotalOrders }}</div>
          <div class="stats-label">全部订单</div>
        </div>
        <div
          v-for="(stat, index) in orderStats"
          :key="index"
          class="stats-card"
          :class="{ active: selectedStatus === index }"
          @click="handleStatusSelect(index)"
        >
          <div class="stats-value">{{ stat.count }}</div>
          <div class="stats-label">{{ stat.text }}</div>
        </div>
      </div>

      <!-- 订单列表区域 -->
      <div class="orders-section">
        <div class="section-header">
          <h3>我的订单</h3>
        </div>

        <div class="orders-list">
          <div v-for="order in orders" :key="order.order_no" class="order-card">
            <div class="order-header">
              <span class="order-no">订单号：{{ order.order_no }}</span>
              <el-tag :type="getStatusType(order.status)">
                {{ getStatusText(order.status) }}
              </el-tag>
            </div>

            <div class="order-items">
              <div v-for="item in order.items" :key="item.id" class="item">
                <img :src="item.product_cover" :alt="item.product_title" />
                <div class="item-info">
                  <div class="item-title">{{ item.product_title }}</div>
                  <div class="item-price">
                    ¥{{ item.price }} × {{ item.quantity }}
                  </div>
                </div>
              </div>
            </div>

            <div class="order-footer">
              <div class="order-total">
                <span class="label">实付金额：</span>
                <span class="amount">¥{{ order.total_amount }}</span>
              </div>
              <div class="order-actions">
                <el-button
                  size="small"
                  @click="$router.push(`/order/${order.order_no}`)"
                >
                  查看详情
                </el-button>
                <el-button
                  v-if="order.status === 2"
                  size="small"
                  type="primary"
                  @click="handleConfirmReceive(order)"
                >
                  确认收货
                </el-button>
                <el-button
                  v-if="order.status === 0"
                  size="small"
                  type="primary"
                  @click="handlePay(order)"
                >
                  去支付
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div class="pagination">
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

    <!-- 弹窗组件保持不变 -->
    <PaymentDialog
      :visible.sync="showPaymentDialog"
      :amount="Number(currentOrder.total_amount)"
      :payment-method="Number(currentOrder.payment_method)"
      @paid="handlePaymentSuccess"
    />

    <el-drawer
      title="收货地址管理"
      :visible.sync="showAddressDrawer"
      direction="rtl"
      size="500px"
    >
      <div class="address-drawer-content">
        <div class="address-list">
          <div
            v-for="address in addresses"
            :key="address.id"
            class="address-item"
          >
            <div class="address-info">
              <div class="receiver">
                <span class="name">{{ address.receiver }}</span>
                <span class="phone">{{ address.phone }}</span>
                <el-tag v-if="address.is_default" size="small" type="primary"
                  >默认</el-tag
                >
              </div>
              <div class="address">
                {{
                  address.province +
                  address.city +
                  address.district +
                  address.detail_address
                }}
              </div>
            </div>
            <div class="address-actions">
              <el-button type="text" @click="handleEditAddress(address)"
                >编辑</el-button
              >
              <el-button type="text" @click="handleDeleteAddress(address.id)"
                >删除</el-button
              >
            </div>
          </div>
        </div>

        <div class="add-address">
          <el-button type="primary" @click="handleAddAddress"
            >新增收货地址</el-button
          >
        </div>
      </div>
    </el-drawer>

    <AddressDialog
      v-model="showAddressDialog"
      :address="currentAddress"
      @success="handleAddressSuccess"
    />

    <UserInfoDialog
      v-model="showUserInfoDialog"
      :user-info="userInfo"
      @success="handleUserInfoSuccess"
    />
  </div>
</template>

<script>
import { formatTime, formatPrice, formatPhone } from "@/utils/format";
import PaymentDialog from "@/components/PaymentDialog.vue";
import AddressDialog from "@/components/AddressDialog.vue";
import UserInfoDialog from "@/components/UserInfoDialog.vue";

export default {
  name: "Profile",
  components: {
    PaymentDialog,
    AddressDialog,
    UserInfoDialog,
  },
  data() {
    return {
      userInfo: {},
      orders: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      showPaymentDialog: false,
      currentOrder: {},
      orderStats: [
        { text: "待付款", count: 0 },
        { text: "待发货", count: 0 },
        { text: "待收货", count: 0 },
        { text: "已完成", count: 0 },
      ],
      showAddressDrawer: false,
      showAddressDialog: false,
      addresses: [],
      currentAddress: {},
      showUserInfoDialog: false,
      selectedStatus: -1,
    };
  },
  watch: {
    selectedStatus(val){
      console.log(val);
      
    }
  },
  computed: {
    getTotalOrders() {
      return this.orderStats.reduce((sum, stat) => sum + Number(stat.count), 0);
    },
  },
  created() {
    this.initUserInfo();
    this.fetchOrders();
    this.fetchOrderStats();
    this.fetchAddresses();
  },
  methods: {
    initUserInfo() {
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        this.userInfo = JSON.parse(userInfo);
      }
    },
    async fetchOrders() {
      try {
        const res = await this.$axios.get("/api/orders/my", {
          params: {
            page: this.currentPage,
            pageSize: this.pageSize,
            status: this.selectedStatus,
          },
        });
        if (res.code === 200) {
          this.orders = res.data.list;
          this.total = res.data.total;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        console.error("获取订单列表失败:", error);
        this.$message.error("获取订单列表失败");
      }
    },
    async fetchOrderStats() {
      try {
        const res = await this.$axios.get("/api/orders/stats");
        if (res.code === 200) {
          this.orderStats = [
            { text: "待付款", count: res.data.unpaid || 0 },
            { text: "待发货", count: res.data.unshipped || 0 },
            { text: "待收货", count: res.data.shipped || 0 },
            { text: "已完成", count: res.data.completed || 0 },
          ];
        }
      } catch (error) {
        console.error("获取订单统计失败:", error);
      }
    },
    getStatusType(status) {
      const types = {
        0: "warning",
        1: "primary",
        2: "success",
        3: "info",
        4: "danger",
      };
      return types[status] || "info";
    },
    getStatusText(status) {
      const texts = {
        0: "待付款",
        1: "待发货",
        2: "待收货",
        3: "已完成",
        4: "已取消",
      };
      return texts[status] || "未知状态";
    },
    handlePageChange(page) {
      this.currentPage = page;
      this.fetchOrders();
    },
    handlePay(order) {
      this.currentOrder = order;
      this.showPaymentDialog = true;
    },
    async handlePaymentSuccess() {
      try {
        const res = await this.$axios.post(
          `/api/orders/${this.currentOrder.order_no}/pay`
        );
        if (res.code === 200) {
          this.$message.success("支付成功");
          await this.fetchOrders();
          await this.fetchOrderStats();
        }
      } catch (error) {
        console.error("支付失败:", error);
        this.$message.error("支付失败");
      }
      this.showPaymentDialog = false;
    },
    async handleCancel(order) {
      try {
        await this.$confirm("确定要取消订单吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });

        const res = await this.$axios.post(
          `/api/orders/${order.order_no}/cancel`
        );
        if (res.code === 200) {
          this.$message.success("订单已取消");
          await this.fetchOrders();
          await this.fetchOrderStats();
        }
      } catch (error) {
        if (error !== "cancel") {
          console.error("取消订单失败:", error);
          this.$message.error("取消订单失败");
        }
      }
    },
    formatTime,
    formatPrice,
    formatPhone,
    handleCommand(command, order) {
      switch (command) {
        case "pay":
          this.handlePay(order);
          break;
        case "cancel":
          this.handleCancel(order);
          break;
      }
    },
    async handleBecomeSeller() {
      try {
        await this.$confirm("确定要注册成为商家吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info",
        });

        const res = await this.$axios.post("/api/user/become-seller");
        if (res.code === 200) {
          // 更新本地存储的用户信息
          localStorage.setItem("userInfo", JSON.stringify(res.data));
          this.$message.success("注册成功");
          // 刷新页面
          window.location.reload();
        }
      } catch (error) {
        if (error !== "cancel") {
          console.error("注册商家失败:", error);
          this.$message.error("注册失败");
        }
      }
    },
    // 获取地址列表
    async fetchAddresses() {
      try {
        const res = await this.$axios.get(`/api/addresses/${this.userInfo.id}`);
        if (res.code === 200) {
          this.addresses = res.data;
        }
      } catch (error) {
        console.error("获取地址列表失败:", error);
        this.$message.error("获取地址列表失败");
      }
    },

    // 新增地址
    handleAddAddress() {
      this.currentAddress = {};
      this.showAddressDialog = true;
    },

    // 编辑地址
    handleEditAddress(address) {
      this.currentAddress = { ...address };
      this.showAddressDialog = true;
    },

    // 删除地址
    async handleDeleteAddress(id) {
      try {
        await this.$confirm("确定要删除该地址吗?", "提示", {
          type: "warning",
        });
        const res = await this.$axios.delete(`/api/addresses/${id}`);
        if (res.code === 200) {
          this.$message.success("删除成功");
          this.fetchAddresses();
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        if (error !== "cancel") {
          console.error("删除地址失败:", error);
          const message =
            error.response && error.response.data
              ? error.response.data.message
              : "删除失败";
          this.$message.error(message);
        }
      }
    },

    // 新增/编辑成功回调
    handleAddressSuccess() {
      this.fetchAddresses();
      this.showAddressDialog = false;
    },
    handleUserInfoSuccess() {
      // 重新获取用户信息
      this.initUserInfo();
    },
    // 添加确认收货方法
    async handleConfirmReceive(order) {
      try {
        await this.$confirm("确认已收到商品?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });

        const res = await this.$axios.post(
          `/api/orders/${order.order_no}/receive`
        );
        if (res.code === 200) {
          this.$message.success("确认收货成功");
          this.fetchOrders();
        }
      } catch (error) {
        if (error !== "cancel") {
          console.error("确认收货失败:", error);
          this.$message.error("确认收货失败");
        }
      }
    },
    handleStatusSelect(status) {
      this.selectedStatus = status;
      this.currentPage = 1; // 切换状态时重置页码
      this.fetchOrders();
    },
  },
};
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background-color: #f8f8f8;
}

.profile-header {
  background: #fff;
  padding: 40px 0;
  margin-bottom: 30px;
  border-bottom: 1px solid #eee;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.user-info-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 30px;
}

.avatar-wrapper {
  position: relative;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #fff;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.edit-avatar {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-detail .name {
  font-size: 28px;
  font-weight: 500;
  color: #000;
  margin: 0 0 10px;
}

.contact-info {
  display: flex;
  gap: 20px;
}

.contact-item {
  color: #666;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.right-section {
  display: flex;
  gap: 15px;
}

.main-content {
  padding-bottom: 60px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stats-card {
  background: #fff;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.stats-card.active {
  background: #000;
  color: #fff;
}

.stats-value {
  font-size: 36px;
  font-weight: 600;
  margin-bottom: 10px;
}

.stats-label {
  color: #666;
  font-size: 15px;
}

.stats-card.active .stats-label {
  color: rgba(255, 255, 255, 0.8);
}

.orders-section {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.section-header {
  padding: 25px 30px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h3 {
  font-size: 20px;
  font-weight: 500;
  margin: 0;
}

.orders-list {
  padding: 20px;
}

.order-card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 20px;
  overflow: hidden;
}

.order-header {
  padding: 15px 20px;
  background: #f8f8f8;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-no {
  color: #666;
  font-size: 14px;
}

.order-items {
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.order-items .item {
  display: flex;
  gap: 15px;
}

.order-items img {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.item-price {
  color: #999;
  font-size: 14px;
}

.order-footer {
  padding: 15px 20px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-total {
  font-size: 15px;
}

.order-total .label {
  color: #666;
}

.order-total .amount {
  font-size: 18px;
  font-weight: 500;
  color: #000;
}

.order-actions {
  display: flex;
  gap: 10px;
}

.pagination {
  padding: 30px;
  display: flex;
  justify-content: center;
  border-top: 1px solid #f0f0f0;
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

:deep(.el-radio-button__inner) {
  border-color: #000;
}

:deep(.el-radio-button__orig-radio:checked + .el-radio-button__inner) {
  background-color: #000;
  border-color: #000;
  box-shadow: -1px 0 0 0 #000;
}

:deep(.el-tag--primary) {
  background-color: #f8f8f8;
  border-color: #e0e0e0;
  color: #333;
}

:deep(.el-drawer__header) {
  margin-bottom: 0;
  padding: 20px 30px;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-drawer__body) {
  padding: 0;
}

/* 地址管理样式 */
.address-drawer-content {
  padding: 30px;
}

.address-list {
  margin-bottom: 30px;
}

.address-item {
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 15px;
}

.address-info .receiver {
  margin-bottom: 10px;
}

.address-info .name {
  font-size: 16px;
  font-weight: 500;
  margin-right: 12px;
}

.address-info .phone {
  color: #666;
  margin-right: 12px;
}

.address-info .address {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.address-actions {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

.add-address {
  text-align: center;
  padding: 20px 0;
}
</style>
