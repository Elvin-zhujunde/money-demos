`<template>
  <div class="app-container">
    <SideMenu class="side-menu" />
    <div class="main-content">
      <component :is="currentView"></component>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import SideMenu from './components/SideMenu.vue'
import OrderView from './components/OrderView.vue'
import CheckoutView from './components/CheckoutView.vue'
import MenuManagement from './components/MenuManagement.vue'
import OrderOverview from './components/OrderOverview.vue'

const store = useStore()
const currentView = computed(() => {
  const views = {
    order: OrderView,
    checkout: CheckoutView,
    management: MenuManagement,
    overview: OrderOverview
  }
  return views[store.state.currentView]
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f6f8fa;
}

.app-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.side-menu {
  width: 30%;
  background-color: #ffffff;
  box-shadow: 2px 0 8px rgba(0,0,0,0.1);
  height: 100%;
}

.main-content {
  width: 70%;
  height: 100%;
  padding: 24px;
  overflow-y: auto;
}
</style>`