<template>
  <div class="profile-container">
    <div class="container">
      <!-- 右侧内容区 -->
      <div class="content">
        <!-- 用户信息卡片 - 移到这里 -->
        <div class="user-info-card section">
          <el-button
            type="text"
            class="edit-btn"
            @click="showUserInfoDialog = true"
          >
            <i class="el-icon-edit"></i>
          </el-button>
          
          <div class="user-info-content">
            <div class="avatar">
              <img :src="userInfo.avatar" :alt="userInfo.name" />
            </div>
            <div class="info-detail">
              <h2 class="name">{{ userInfo.name }}</h2>
              <p class="contact">{{ userInfo.phone || "未绑定手机号" }}</p>
              <p class="contact">{{ userInfo.email || "未绑定邮箱" }}</p>
            </div>
            <div class="actions">
              <el-button
                type="text"
                class="manage-address-btn"
                @click="showAddressDrawer = true"
              >
                管理收货地址
              </el-button>
            </div>
          </div>
        </div>

        <!-- 订单统计 -->
        <div class="section order-stats">
          <div
            class="stat-item"
            :class="{ active: selectedStatus === -1 }"
            @click="handleStatusSelect(-1)"
          >
            <div class="number">{{ getTotalOrders }}</div>
            <div class="text">全部</div>
          </div>
          <div
            v-for="(stat, index) in orderStats"
            :key="index"
            class="stat-item"
            :class="{ active: selectedStatus === index }"
            @click="handleStatusSelect(index)"
          >
            <div class="number">{{ stat.count }}</div>
            <div class="text">{{ stat.text }}</div>
          </div>
        </div>

        <!-- 我的订单 -->
        <div class="section order-list">
          <div class="section-header">
            <h3>我的订单</h3>
          </div>

          <el-table :data="orders" style="width: 100%">
            <el-table-column label="订单信息" min-width="400">
              <template slot-scope="scope">
                <div class="order-info">
                  <div class="order-no">订单号：{{ scope.row.order_no }}</div>
                  <div class="order-items">
                    <div
                      class="item"
                      v-for="item in scope.row.items"
                      :key="item.id"
                    >
                      <img
                        :src="item.product_cover"
                        :alt="item.product_title"
                      />
                      <span class="title">{{ item.product_title }}</span>
                      <span class="quantity">x{{ item.quantity }}</span>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="收货人" width="150">
              <template slot-scope="scope">
                <div>{{ scope.row.receiver }}</div>
                <div class="text-muted">{{ scope.row.receiver_phone }}</div>
              </template>
            </el-table-column>
            <el-table-column label="金额" width="150">
              <template slot-scope="scope">
                <div class="price">¥{{ scope.row.total_amount }}</div>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100">
              <template slot-scope="scope">
                <el-tag :type="getStatusType(scope.row.status)">
                  {{ getStatusText(scope.row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template #default="{ row }">
                <el-button 
                  size="mini" 
                  @click="$router.push(`/order/${row.order_no}`)"
                >
                  查看详情
                </el-button>
                <el-button
                  v-if="row.status === 2"
                  size="mini"
                  type="success"
                  @click="handleConfirmReceive(row)"
                >
                  确认收货
                </el-button>
                <el-button
                  v-if="row.status === 0"
                  size="mini"
                  type="primary"
                  @click="handlePay(row)"
                >
                  去支付
                </el-button>
              </template>
            </el-table-column>
          </el-table>

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
    </div>

    <!-- 支付弹窗 -->
    <PaymentDialog
      :visible.sync="showPaymentDialog"
      :amount="Number(currentOrder.total_amount)"
      :payment-method="Number(currentOrder.payment_method)"
      @paid="handlePaymentSuccess"
    />

    <!-- 地址管理抽屉 -->
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

    <!-- 地址编辑���窗 -->
    <AddressDialog
      v-model="showAddressDialog"
      :address="currentAddress"
      @success="handleAddressSuccess"
    />

    <!-- 编辑个人信息弹窗 -->
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
  computed: {
    getTotalOrders() {
      return this.orderStats.reduce((sum, stat) => sum + Number(stat.count), 0)
    }
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
            status: this.selectedStatus
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
      this.showPaymentDialog = false
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
        await this.$confirm('确认已收到商品?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        const res = await this.$axios.post(`/api/orders/${order.order_no}/receive`)
        if (res.code === 200) {
          this.$message.success('确认收货成功')
          this.fetchOrders()
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('确认收货失败:', error)
          this.$message.error('确认收货失败')
        }
      }
    },
    handleStatusSelect(status) {
      this.selectedStatus = status
      this.currentPage = 1 // 切换状态时重置页码
      this.fetchOrders()
    }
  },
};
</script>

<style scoped>
.profile-container {
  padding: 20px 0;
}

.container {
  width: 1200px;
  margin: 0 auto;
}

.content {
  width: 100%;
}

.section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 用户信息卡片新样式 */
.user-info-card {
  margin-bottom: 20px;
  position: relative;
}

.user-info-content {
  display: flex;
  align-items: center;
  padding: 20px;
}

.avatar {
  width: 80px;
  height: 80px;
  margin-right: 30px;
}

.avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.info-detail {
  flex: 1;
}

.info-detail .name {
  font-size: 20px;
  color: #333;
  margin: 0 0 10px 0;
}

.info-detail .contact {
  color: #666;
  margin: 5px 0;
  font-size: 14px;
}

.actions {
  text-align: right;
}

/* 订单统计样式优化 */
.order-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  padding: 30px 0;
}

.stat-item {
  text-align: center;
  flex: 1;
  position: relative;
  cursor: pointer;
  transition: all 0.3s;
  padding: 15px 0;
}

.stat-item:hover {
  background: #f8f8f8;
}

.stat-item.active {
  background: #f0f0f0;
}

.stat-item.active .number {
  color: #333;
  font-weight: bold;
}

.stat-item:not(:last-child):after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 30px;
  background: #f0f0f0;
}

.stat-item .number {
  font-size: 28px;
  color: #333;
  font-weight: 500;
  margin-bottom: 8px;
}

.stat-item .text {
  color: #666;
  font-size: 14px;
}

/* 订单列表 */
.section-header {
  margin-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 15px;
}

.section-header h3 {
  font-size: 18px;
  color: #333;
  font-weight: 500;
  margin: 0;
}

.order-info .order-no {
  color: #666;
  margin-bottom: 10px;
}

.order-items {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.order-items .item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.order-items img {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
}

.order-items .title {
  color: #333;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.order-items .quantity {
  color: #999;
}

.text-muted {
  color: #999;
  font-size: 12px;
  margin-top: 4px;
}

.price {
  color: #ff6b35;
  font-weight: 500;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

/* Element UI 样��覆盖 */
:deep(.el-button--primary) {
  background-color: #333;
  border-color: #333;
}

:deep(.el-button--primary:hover) {
  background-color: #555;
  border-color: #555;
}

:deep(.el-tag--primary) {
  background-color: #333;
  border-color: #333;
  color: #fff;
}

.action-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-group .el-button {
  padding: 4px 0;
}

/* 更多按钮样式 */
:deep(.el-dropdown) {
  margin-left: 8px;
}

:deep(.el-dropdown .el-button) {
  display: flex;
  align-items: center;
}

:deep(.el-dropdown .el-icon-arrow-down) {
  margin-left: 4px;
  font-size: 12px;
}

/* 下拉菜单样式 */
:deep(.el-dropdown-menu) {
  padding: 4px 0;
}

:deep(.el-dropdown-menu__item) {
  font-size: 14px;
  padding: 8px 16px;
  line-height: 1.4;
}

:deep(.el-dropdown-menu__item:hover) {
  background-color: #f5f5f5;
  color: #333;
}

.become-seller-btn {
  margin-top: 15px;
  width: 120px;
}

.address-drawer-content {
  padding: 20px;
}

.address-list {
  margin-bottom: 20px;
}

.address-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.address-info .receiver {
  margin-bottom: 8px;
}

.address-info .name {
  font-weight: 500;
  margin-right: 10px;
}

.address-info .phone {
  color: #666;
  margin-right: 10px;
}

.address-info .address {
  color: #666;
  font-size: 14px;
}

.add-address {
  text-align: center;
  padding: 20px 0;
}

.manage-address-btn {
  margin-top: 10px;
}

.edit-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 18px;
}
</style>
