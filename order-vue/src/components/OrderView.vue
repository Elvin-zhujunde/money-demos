`
<template>
  <div class="order-view">
    <h2>点餐 - 桌号: {{ tableNumber }}</h2>
    <div class="menu-grid">
      <div v-for="item in menuItems" :key="item.id" class="menu-item">
        <img :src="item.image" :alt="item.name" />
        <div class="menu-item-content">
          <div class="menu-item-header">
            <span class="menu-item-name">{{ item.name }}</span>
            <span class="menu-item-price">¥{{ item.price }}</span>
          </div>
          <div class="menu-item-stock">库存: {{ item.stock }}</div>
          <div class="menu-item-action">
            <el-button
              type="primary"
              @click="addToCart(item)"
              :disabled="item.stock <= 0"
              :class="{ 'is-sold-out': item.stock <= 0 }"
            >
              {{ item.stock <= 0 ? "已售罄" : "加入购物车" }}
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="cart-preview" v-if="cartItems.length > 0">
      <h3>当前购物车</h3>
      <div v-for="item in cartItems" :key="item.id" class="cart-preview-item">
        <span>{{ item.name }}</span>
        <span>x{{ item.quantity }}</span>
      </div>
      <el-button type="success" @click="createOrder">生成订单</el-button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";

const store = useStore();
const menuItems = computed(() => store.state.menu.items);
const tableNumber = computed(() => store.state.cart.currentTable);
const cartItems = computed(() => store.state.cart.items);
const pendingTables = computed(() => store.getters["orders/pendingTables"]);

onMounted(async () => {
  if (!store.state.cart.currentTable) {
    generateNewTableNumber();
  }
  !store.state.menu.items.length &&
    (await store.dispatch("menu/fetchMenuItems"));
});

const generateNewTableNumber = () => {
  let newTable;
  do {
    newTable = `T${Math.floor(Math.random() * 100)}`;
  } while (pendingTables.value.includes(newTable));

  store.commit("cart/SET_TABLE", newTable);
};

const addToCart = async (item) => {
  if (item.stock > 0) {
    try {
      await store.dispatch("menu/updateStock", {
        id: item.id,
        quantity: 1,
      });
      store.commit("cart/ADD_TO_CART", item);
    } catch (error) {
      ElMessage.error("添加失败");
    }
  }
};

const createOrder = async () => {
  try {
    await store.dispatch("orders/createOrder");
    ElMessage.success("订单已生成");
    generateNewTableNumber();
  } catch (error) {
    ElMessage.error(error.message);
  }
};
</script>

<style scoped>
.order-view {
  padding: 20px;
  position: relative;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  padding: 20px;
  margin-bottom: 80px;
  margin-right: 340px;
}

.menu-item {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.menu-item img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
}

.menu-item-content {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.menu-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.menu-item-name {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.menu-item-price {
  color: #f56c6c;
  font-size: 18px;
  font-weight: bold;
}

.menu-item-stock {
  color: #909399;
  font-size: 14px;
  margin-bottom: 16px;
}

.menu-item-action {
  margin-top: auto;
  text-align: center;
}

.table-info {
  background: white;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.table-number {
  font-size: 18px;
  font-weight: bold;
  color: #409eff;
}

.cart-preview {
  position: fixed;
  top: 24px;
  right: 24px;
  width: 320px;
  background: white;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  z-index: 1000;
  max-height: calc(100vh - 48px);
  overflow-y: auto;
}

.cart-preview h3 {
  margin-bottom: 16px;
  color: #333;
  font-size: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-preview-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #ebeef5;
}

.cart-preview-item:last-child {
  border-bottom: none;
}

.cart-preview-item span:first-child {
  color: #606266;
}

.cart-preview-item span:last-child {
  color: #909399;
  font-size: 14px;
}

/* 响应式布局 */
@media screen and (max-width: 1400px) {
  .menu-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media screen and (max-width: 1200px) {
  .menu-grid {
    grid-template-columns: repeat(3, 1fr);
    margin-right: 0;
    margin-bottom: 120px;
  }
}

@media screen and (max-width: 900px) {
  .menu-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 600px) {
  .menu-grid {
    grid-template-columns: 1fr;
  }
}
</style>
`
