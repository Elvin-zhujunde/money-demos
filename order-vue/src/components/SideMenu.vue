`<template>
  <div class="side-menu">
    <el-menu class="menu-vertical">
      <el-menu-item v-for="item in menuItems" :key="item.view" @click="changeView(item.view)">
        {{ item.label }}
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'

const store = useStore()
const menuItems = [
  { label: '点餐', view: 'order' },
  { label: '结算', view: 'checkout' },
  { label: '上架菜品', view: 'management' },
  { label: '订单总览', view: 'overview' }
]

const changeView = (view) => {
  store.commit('setCurrentView', view)
}
</script>

<style scoped>
.side-menu {
  height: 100%;
  padding: 20px 0;
}

.menu-vertical {
  height: 100%;
  border-right: none;
}

:deep(.el-menu-item) {
  height: 60px;
  line-height: 60px;
  font-size: 16px;
  margin: 8px 0;
  border-radius: 0 24px 24px 0;
}

:deep(.el-menu-item.is-active) {
  background: #409eff1a !important;
  color: #409EFF;
  font-weight: bold;
}

:deep(.el-menu-item:hover) {
  background: #f5f7fa !important;
}
</style>`