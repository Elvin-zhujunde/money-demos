<template>
  <div class="orders-manage">
    <el-card>
      <!-- 搜索和筛选栏 -->
      <div class="toolbar">
        <div class="search-bar">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索订单号/用户名"
            clearable
            style="width: 300px"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>

          <el-select v-model="statusFilter" placeholder="订单状态" clearable>
            <el-option label="待发货" value="pending" />
            <el-option label="配送中" value="shipping" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
        </div>

        <el-button-group>
          <el-button
            :type="timeRange === 'today' ? 'primary' : ''"
            @click="timeRange = 'today'"
          >
            今日订单
          </el-button>
          <el-button
            :type="timeRange === 'week' ? 'primary' : ''"
            @click="timeRange = 'week'"
          >
            本周订单
          </el-button>
          <el-button
            :type="timeRange === 'month' ? 'primary' : ''"
            @click="timeRange = 'month'"
          >
            本月订单
          </el-button>
          <el-button
            :type="timeRange === 'all' ? 'primary' : ''"
            @click="timeRange = 'all'"
          >
            全部订单
          </el-button>
        </el-button-group>
      </div>

      <!-- 订单统计 -->
      <div class="statistics">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card shadow="hover">
              <template #header>
                <div class="stat-header">
                  <span>总订单数</span>
                  <el-icon><Tickets /></el-icon>
                </div>
              </template>
              <div class="stat-content">
                <span class="stat-number">{{ orderStats.total }}</span>
                <span class="stat-label">单</span>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover">
              <template #header>
                <div class="stat-header">
                  <span>待发货</span>
                  <el-icon><Box /></el-icon>
                </div>
              </template>
              <div class="stat-content">
                <span class="stat-number">{{ orderStats.pending }}</span>
                <span class="stat-label">单</span>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover">
              <template #header>
                <div class="stat-header">
                  <span>配送中</span>
                  <el-icon><Van /></el-icon>
                </div>
              </template>
              <div class="stat-content">
                <span class="stat-number">{{ orderStats.shipping }}</span>
                <span class="stat-label">单</span>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover">
              <template #header>
                <div class="stat-header">
                  <span>总金额</span>
                  <el-icon><Money /></el-icon>
                </div>
              </template>
              <div class="stat-content">
                <span class="stat-number"
                  >¥{{ orderStats.totalAmount.toFixed(2) }}</span
                >
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 订单列表 -->
      <el-table :data="filteredOrders" style="width: 100%" v-loading="loading">
        <el-table-column prop="orderNo" label="订单号" width="180" />
        <el-table-column label="用户信息" width="200">
          <template #default="{ row }">
            <div>{{ getUserName(row.userId) }}</div>
            <div class="text-secondary">{{ row.phone }}</div>
          </template>
        </el-table-column>
        <el-table-column label="商品信息">
          <template #default="{ row }">
            <div
              v-for="item in row.products"
              :key="item.productId"
              class="product-item"
            >
              {{ getProductName(item.productId) }} x {{ item.quantity }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="totalAmount" label="金额" width="120">
          <template #default="{ row }"> ¥{{ row.totalAmount }} </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button
              v-if="row.status === 'pending'"
              link
              type="primary"
              @click="handleShip(row)"
            >
              发货
            </el-button>
            <el-button link type="primary" @click="handleViewDetail(row)">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Search, Tickets, Box, Van, Money } from "@element-plus/icons-vue";
import axios from "axios";

const loading = ref(false);
const orders = ref([]);
const users = ref({}); // 用户信息缓存
const products = ref({}); // 商品信息缓存
const searchKeyword = ref("");
const statusFilter = ref("");
const timeRange = ref("all");

// 订单统计
const orderStats = computed(() => {
  const stats = {
    total: filteredOrders.value.length,
    pending: 0,
    shipping: 0,
    totalAmount: 0,
  };

  filteredOrders.value.forEach((order) => {
    if (order.status === "pending") stats.pending++;
    if (order.status === "shipping") stats.shipping++;
    stats.totalAmount += order.totalAmount;
  });

  return stats;
});

// 过滤订单列表
const filteredOrders = computed(() => {
  let result = [...orders.value];

  // 关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    result = result.filter(
      (order) =>
        order.orderNo.toLowerCase().includes(keyword) ||
        getUserName(order.userId).toLowerCase().includes(keyword)
    );
  }

  // 状态筛选
  if (statusFilter.value) {
    result = result.filter((order) => order.status === statusFilter.value);
  }

  // 时间范围筛选
  if (timeRange.value !== "all") {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    weekStart.setDate(today.getDate() - today.getDay());

    result = result.filter((order) => {
      const orderDate = new Date(order.createTime);

      switch (timeRange.value) {
        case "today":
          return orderDate >= today;
        case "week":
          return orderDate >= weekStart;
        case "month":
          return orderDate >= monthStart;
        default:
          return true;
      }
    });
  }

  return result;
});

// 获取用户名称
const getUserName = (userId) => {
  return users.value[userId]?.username || userId;
};

// 获取商品名称
const getProductName = (productId) => {
  return products.value[productId]?.title || productId;
};

// 获取状态样式
const getStatusType = (status) => {
  const types = {
    pending: "warning",
    shipping: "primary",
    completed: "success",
    cancelled: "info",
  };
  return types[status] || "info";
};

// 获取状态文本
const getStatusText = (status) => {
  const texts = {
    pending: "待发货",
    shipping: "配送中",
    completed: "已完成",
    cancelled: "已取消",
  };
  return texts[status] || "未知状态";
};

// 获取订单列表
const fetchOrders = async () => {
  loading.value = true;
  try {
    const { data } = await axios.get("/api/orders");
    orders.value = data;

    // 获取相关的用户和商品信息
    const userIds = new Set();
    const productIds = new Set();

    data.forEach((order) => {
      userIds.add(order.userId);
      order.products.forEach((item) => productIds.add(item.productId));
    });

    // 批量获取用户信息
    const userPromises = Array.from(userIds).map(async (id) => {
      const { data: user } = await axios.get(`/api/users/${id}`);
      users.value[id] = user;
    });

    // 批量获取商品信息
    const productPromises = Array.from(productIds).map(async (id) => {
      const { data: product } = await axios.get(`/api/products/${id}`);
      products.value[id] = product;
    });

    await Promise.all([...userPromises, ...productPromises]);
  } catch (error) {
    console.error("获取订单列表失败:", error);
  } finally {
    loading.value = false;
  }
};

// 发货处理
const handleShip = async (order) => {
  try {
    await ElMessageBox.confirm("确认发货？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "info",
    });

    await axios.patch(`/api/orders/${order.id}`, {
      status: "shipping",
      updateTime: new Date().toISOString(),
    });

    ElMessage.success("发货成功");
    await fetchOrders();
  } catch (error) {
    if (error !== "cancel") {
      console.error("发货失败:", error);
      ElMessage.error("发货失败");
    }
  }
};

// 查看订单详情
const handleViewDetail = (order) => {
  const productsList = order.products
    .map((item) => {
      const product = products.value[item.productId];
      return `${product?.title} x ${item.quantity} (¥${item.price})`;
    })
    .join("\n");

  try {
    ElMessageBox.alert(
      `
    订单号：${order.orderNo}
    用户名：${getUserName(order.userId)}
    下单时间：${formatDate(order.createTime)}
    更新时间：${formatDate(order.updateTime)}
    收货地址：${order.address}
    联系电话：${order.phone}
    订单状态：${getStatusText(order.status)}
    
    商品清单：
    ${productsList}
    
    总金额：¥${order.totalAmount}
    `,
      "订单详情",
      {
        confirmButtonText: "确定",
      }
    );
  } catch (error) {
    console.log(error);
  }
};

// 日期格式化
const formatDate = (date) => {
  return new Date(date).toLocaleString();
};

onMounted(() => {
  fetchOrders();
});
</script>

<style scoped>
.orders-manage {
  min-height: calc(100vh - 120px);
}

.toolbar {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-bar {
  display: flex;
  gap: 20px;
}

.statistics {
  margin-bottom: 20px;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-content {
  text-align: center;
  padding: 10px 0;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
}

.stat-label {
  margin-left: 4px;
  color: #909399;
}

.product-item {
  margin: 4px 0;
}

.text-secondary {
  color: #909399;
  font-size: 13px;
}
</style>

<script>
export default {
  name: "OrdersManageView",
};
</script>
