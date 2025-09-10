<template>
  <div class="user-page">
    <el-container>
      <!-- 左侧导航 -->
      <el-aside width="240px">
        <el-menu
          :default-active="activeMenu"
          class="user-menu"
          @select="handleMenuSelect"
        >
          <div class="menu-header">
            <el-avatar :size="64" :src="userAvatar">
              {{ userInfo.username?.charAt(0)?.toUpperCase() }}
            </el-avatar>
            <h3>{{ userInfo.username }}</h3>
          </div>
          <el-menu-item index="profile">
            <el-icon><User /></el-icon>
            <span>个人信息</span>
          </el-menu-item>
          <el-menu-item index="orders">
            <el-icon><List /></el-icon>
            <span>我的订单</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 右侧内容 -->
      <el-main>
        <!-- 个人信息页 -->
        <div v-if="activeMenu === 'profile'">
          <el-card class="profile-card">
            <template #header>
              <div class="card-header">
                <h2>个人信息</h2>
                <p class="subtitle">管理您的个人信息和账户安全</p>
              </div>
            </template>

            <el-form
              ref="profileFormRef"
              :model="profileForm"
              :rules="profileRules"
              label-width="100px"
            >
              <el-form-item label="用户名">
                <el-input v-model="profileForm.username" disabled />
              </el-form-item>

              <el-form-item label="邮箱">
                <el-input v-model="profileForm.email" disabled />
              </el-form-item>

              <el-form-item label="手机号" prop="phone">
                <el-input v-model="profileForm.phone" />
              </el-form-item>

              <el-form-item label="收货地址" prop="address">
                <el-input
                  v-model="profileForm.address"
                  type="textarea"
                  rows="2"
                />
              </el-form-item>

              <el-divider>修改密码</el-divider>

              <el-form-item label="原密码" prop="oldPassword">
                <el-input
                  v-model="profileForm.oldPassword"
                  type="password"
                  show-password
                />
              </el-form-item>

              <el-form-item label="新密码" prop="newPassword">
                <el-input
                  v-model="profileForm.newPassword"
                  type="password"
                  show-password
                />
              </el-form-item>

              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input
                  v-model="profileForm.confirmPassword"
                  type="password"
                  show-password
                />
              </el-form-item>

              <el-form-item>
                <el-button
                  type="primary"
                  @click="handleUpdateProfile"
                  :loading="loading"
                >
                  保存修改
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>

        <!-- 订单列表页 -->
        <div v-else>
          <el-card class="orders-card">
            <template #header>
              <div class="header-left">
                <h2>我的订单</h2>
                <p class="subtitle">共 {{ orders.length }} 个订单</p>
              </div>
              <div class="orders-header">
                <el-select
                  v-model="orderStatus"
                  placeholder="订单状态"
                  clearable
                >
                  <el-option label="全部订单" value="" />
                  <el-option label="待发货" value="pending">
                    <el-icon><Box /></el-icon>
                    <span style="margin-left: 8px">待发货</span>
                  </el-option>
                  <el-option label="配送中" value="shipping">
                    <el-icon><Van /></el-icon>
                    <span style="margin-left: 8px">配送中</span>
                  </el-option>
                  <el-option label="已完成" value="completed">
                    <el-icon><CircleCheck /></el-icon>
                    <span style="margin-left: 8px">已完成</span>
                  </el-option>
                  <el-option label="已取消" value="cancelled">
                    <el-icon><CircleClose /></el-icon>
                    <span style="margin-left: 8px">已取消</span>
                  </el-option>
                </el-select>
              </div>
            </template>

            <!-- 订单为空 -->
            <el-empty
              v-if="filteredOrders.length === 0"
              :description="orderStatus ? '暂无相关订单' : '暂无订单'"
            >
              <el-button type="primary" @click="$router.push('/')">
                去购物
              </el-button>
            </el-empty>

            <!-- 订单列表 -->
            <div v-else class="orders-list">
              <el-card
                v-for="order in filteredOrders"
                :key="order.id"
                class="order-card"
                shadow="hover"
              >
                <div class="order-header">
                  <div class="order-info">
                    <span class="order-time">{{
                      formatDate(order.createTime)
                    }}</span>
                    <span class="order-no">订单号：{{ order.orderNo }}</span>
                  </div>
                  <el-tag :type="getOrderStatusType(order.status)">
                    {{ getOrderStatusText(order.status) }}
                  </el-tag>
                </div>

                <div class="order-products">
                  <div
                    v-for="item in order.products"
                    :key="item.productId"
                    class="order-product"
                    @click="goToDetail(item.productId)"
                  >
                    <el-image
                      :src="getProductImage(item.productId)"
                      fit="cover"
                      class="product-image"
                    />
                    <div class="product-info">
                      <h4>{{ getProductTitle(item.productId) }}</h4>
                      <div class="product-meta">
                        <span class="price">¥{{ item.price }}</span>
                        <span class="quantity">x {{ item.quantity }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="order-footer">
                  <div class="order-total">
                    共 {{ order.products.length }} 件商品
                    <span class="total-divider">|</span>
                    实付款：<span class="total-price"
                      >¥{{ order.totalAmount }}</span
                    >
                  </div>
                  <div class="order-actions">
                    <el-button
                      v-if="order.status === 'pending'"
                      type="danger"
                      plain
                      size="small"
                      @click="handleCancelOrder(order)"
                    >
                      取消订单
                    </el-button>
                    <el-button
                      v-if="order.status === 'shipping'"
                      type="success"
                      plain
                      size="small"
                      @click="handleConfirmReceive(order)"
                    >
                      确认收货
                    </el-button>
                    <el-button
                      type="primary"
                      plain
                      size="small"
                      @click="handleViewOrderDetail(order)"
                    >
                      查看详情
                    </el-button>
                  </div>
                </div>
              </el-card>
            </div>
          </el-card>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox, ElTag } from "element-plus";
import {
  User,
  List,
  Box,
  Van,
  CircleCheck,
  CircleClose,
} from "@element-plus/icons-vue";
import axios from "axios";

const router = useRouter();
const loading = ref(false);
const activeMenu = ref("profile");
const orders = ref([]);
const orderStatus = ref("");
const productsCache = ref({}); // 缓存商品信息

// 表单相关
const profileFormRef = ref();
const profileForm = ref({
  username: "",
  email: "",
  phone: "",
  address: "",
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// 表单验证规则
const profileRules = {
  phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入正确的手机号",
      trigger: "blur",
    },
  ],
  address: [{ required: true, message: "请输入收货地址", trigger: "blur" }],
  oldPassword: [{ required: true, message: "请输入原密码", trigger: "blur" }],
  newPassword: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    { min: 6, message: "密码长度不能小于6位", trigger: "blur" },
  ],
  confirmPassword: [
    { required: true, message: "请确认新密码", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value !== profileForm.value.newPassword) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
};

// 获取用户信息
const getUserInfo = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

// 加载用户信息
const loadUserProfile = async () => {
  const user = getUserInfo();
  if (!user) return;

  try {
    const { data } = await axios.get(`/api/users/${user.id}`);
    const { password, ...userInfo } = data;
    console.log(password);

    Object.assign(profileForm.value, userInfo);
  } catch (error) {
    console.error("获取用户信息失败:", error);
    ElMessage.error("获取用户信息失败");
  }
};

// 更新用户信息
const handleUpdateProfile = async () => {
  if (!profileFormRef.value) return;

  await profileFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        const user = getUserInfo();
        const { data: userData } = await axios.get(`/api/users/${user.id}`);

        // 验证原密码
        if (
          profileForm.value.oldPassword &&
          profileForm.value.oldPassword !== userData.password
        ) {
          ElMessage.error("原密码错误");
          return;
        }

        // 更新用户信息
        const updates = {
          phone: profileForm.value.phone,
          address: profileForm.value.address,
        };

        // 如果修改了密码，添加新密码
        if (profileForm.value.newPassword) {
          updates.password = profileForm.value.newPassword;
        }

        await axios.patch(`/api/users/${user.id}`, updates);

        // 清空密码字段
        profileForm.value.oldPassword = "";
        profileForm.value.newPassword = "";
        profileForm.value.confirmPassword = "";

        ElMessage.success("更新成功");
      } catch (error) {
        console.error("更新失败:", error);
        ElMessage.error("更新失败");
      } finally {
        loading.value = false;
      }
    }
  });
};

// 加载订单列表
const loadOrders = async () => {
  const user = getUserInfo();
  if (!user) return;

  try {
    const { data } = await axios.get(`/api/orders`, {
      params: { userId: user.id },
    });
    orders.value = data;

    // 加载订单中的商品信息
    const productIds = new Set();
    data.forEach((order) => {
      order.products.forEach((item) => {
        productIds.add(item.productId);
      });
    });

    // 批量获取商品信息并缓存
    await Promise.all(
      Array.from(productIds).map(async (id) => {
        const { data: product } = await axios.get(`/api/products/${id}`);
        productsCache.value[id] = product;
      })
    );
  } catch (error) {
    console.error("获取订单列表失败:", error);
  }
};

// 订单状态过滤
const filteredOrders = computed(() => {
  if (!orderStatus.value) return orders.value;
  return orders.value.filter((order) => order.status === orderStatus.value);
});

// 获取商品信息
const getProductImage = (productId) =>
  productsCache.value[productId]?.image || "";
const getProductTitle = (productId) =>
  productsCache.value[productId]?.title || "";

// 订单状态处理
const getOrderStatusType = (status) => {
  const types = {
    pending: "warning",
    shipping: "primary",
    completed: "success",
    cancelled: "info",
  };
  return types[status] || "info";
};

const getOrderStatusText = (status) => {
  const texts = {
    pending: "待发货",
    shipping: "配送中",
    completed: "已完成",
    cancelled: "已取消",
  };
  return texts[status] || "未知状态";
};

// 更新订单状态
const updateOrderStatus = async (orderId, status) => {
  try {
    await axios.patch(`/api/orders/${orderId}`, {
      status,
      updateTime: new Date().toISOString(),
    });
    await loadOrders();
    ElMessage.success("订单状态已更新");
  } catch (error) {
    console.error("更新订单状态失败:", error);
    ElMessage.error("更新订单状态失败");
  }
};

// 取消订单
const handleCancelOrder = async (order) => {
  try {
    await ElMessageBox.confirm("确定要取消这个订单吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    await updateOrderStatus(order.id, "cancelled");
  } catch (error) {
    if (error !== "cancel") {
      console.error("取消订单失败:", error);
      ElMessage.error("取消订单失败");
    }
  }
};

// 确认收货
const handleConfirmReceive = async (order) => {
  try {
    await ElMessageBox.confirm("确认已收到商品？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "info",
    });

    await updateOrderStatus(order.id, "completed");
  } catch (error) {
    if (error !== "cancel") {
      console.error("确认收货失败:", error);
      ElMessage.error("确认收货失败");
    }
  }
};

// 更新订单详情显示
const handleViewOrderDetail = (order) => {
  ElMessageBox.alert(
    h("div", { class: "order-detail" }, [
      h("div", { class: "detail-header" }, [
        h("h3", "订单详情"),
        h("div", { class: "order-status" }, [
          h(
            ElTag,
            {
              type: getOrderStatusType(order.status),
            },
            () => getOrderStatusText(order.status)
          ),
        ]),
      ]),
      h("div", { class: "detail-content" }, [
        h("div", { class: "detail-item" }, [
          h("span", { class: "label" }, "订单号："),
          h("span", order.orderNo),
        ]),
        h("div", { class: "detail-item" }, [
          h("span", { class: "label" }, "下单时间："),
          h("span", formatDate(order.createTime)),
        ]),
        h("div", { class: "detail-item" }, [
          h("span", { class: "label" }, "更新时间："),
          h("span", formatDate(order.updateTime)),
        ]),
        h("div", { class: "detail-item" }, [
          h("span", { class: "label" }, "收货地址："),
          h("span", order.address),
        ]),
        h("div", { class: "detail-item" }, [
          h("span", { class: "label" }, "联系电话："),
          h("span", order.phone),
        ]),
        h("div", { class: "detail-divider" }),
        h("div", { class: "products-title" }, "商品清单"),
        ...order.products.map((item) => {
          const product = productsCache.value[item.productId];
          return h("div", { class: "product-item" }, [
            h("span", { class: "product-name" }, product?.title),
            h("div", { class: "product-price" }, [
              h("span", { class: "quantity" }, `x${item.quantity}`),
              h("span", { class: "price" }, `¥${item.price}`),
            ]),
          ]);
        }),
        h("div", { class: "detail-divider" }),
        h("div", { class: "total-amount" }, [
          h("span", "总计："),
          h("span", { class: "amount" }, `¥${order.totalAmount}`),
        ]),
      ]),
    ]),
    "订单详情",
    {
      confirmButtonText: "确定",
      customClass: "order-detail-dialog",
    }
  );
};

// 日期格式化
const formatDate = (date) => {
  return new Date(date).toLocaleString();
};

// 菜单切换
const handleMenuSelect = (index) => {
  activeMenu.value = index;
};

// 商品详情跳转
const goToDetail = (productId) => {
  router.push(`/product/${productId}`);
};

// 添加用户信息计算属性
const userInfo = computed(() => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : {};
});

const userAvatar = computed(() => {
  // 这里可以返回用户头像URL，如果有的话
  return "";
});

onMounted(() => {
  loadUserProfile();
  loadOrders();
});
</script>

<style scoped>
.user-page {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
  min-height: calc(100vh - 100px);
}

.user-menu {
  border-right: none;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px 0;
  height: 100%;
}

.menu-header {
  text-align: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 20px;
}

.menu-header h3 {
  margin: 10px 0 0;
  color: #303133;
}

.profile-card,
.orders-card {
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.card-header {
  margin-bottom: 20px;
}

.card-header h2,
.header-left h2 {
  margin: 0;
  font-size: 20px;
  color: #303133;
}
.header-left {
  display: flex;
  gap: 40px;
  padding-bottom: 10px;
}
.subtitle {
  margin: 8px 0 0;
  color: #909399;
  font-size: 14px;
}

.orders-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.orders-header h3 {
  margin: 0;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  transition: all 0.3s;
}

.order-card:hover {
  transform: translateY(-2px);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
}

.order-info {
  display: flex;
  gap: 20px;
  color: #909399;
  font-size: 14px;
}

.order-products {
  padding: 20px 0;
}

.order-product {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.order-product:hover {
  background-color: #f5f7fa;
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  object-fit: cover;
}

.product-info {
  flex: 1;
}

.product-info h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #303133;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.price {
  color: #f56c6c;
  font-weight: bold;
}

.quantity {
  color: #909399;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #ebeef5;
}

.order-total {
  color: #606266;
  font-size: 14px;
}

.total-divider {
  margin: 0 10px;
  color: #dcdfe6;
}

.total-price {
  color: #f56c6c;
  font-size: 18px;
  font-weight: bold;
}

.order-actions {
  display: flex;
  gap: 10px;
}

:deep(.el-main) {
  padding: 0 0 0 20px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-input__wrapper),
:deep(.el-textarea__inner) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
}

:deep(.el-input__wrapper:hover),
:deep(.el-textarea__inner:hover) {
  box-shadow: 0 0 0 1px #c0c4cc inset;
}

:deep(.el-button--primary) {
  padding: 12px 30px;
  font-size: 16px;
}

.order-detail-dialog {
  max-width: 600px;
}

.order-detail {
  padding: 20px 0;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.detail-header h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.detail-content {
  font-size: 14px;
}

.detail-item {
  margin-bottom: 12px;
  line-height: 1.4;
}

.detail-item .label {
  color: #909399;
  margin-right: 8px;
}

.detail-divider {
  height: 1px;
  background-color: #ebeef5;
  margin: 20px 0;
}

.products-title {
  font-weight: bold;
  margin-bottom: 12px;
  color: #303133;
}

.product-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.product-name {
  color: #606266;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 10px;
}

.product-price .quantity {
  color: #909399;
}

.product-price .price {
  color: #f56c6c;
  font-weight: bold;
}

.total-amount {
  text-align: right;
  font-weight: bold;
}

.total-amount .amount {
  color: #f56c6c;
  font-size: 18px;
  margin-left: 8px;
}
</style>
