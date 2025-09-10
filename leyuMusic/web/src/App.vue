<template>
  <div id="app">
    <router-view></router-view>
    <Player />
  </div>
</template>

<script>
import Player from '@/components/Player'

export default {
  name: 'App',
  components: {
    Player
  }
}
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'Noto Color Emoji';
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  background-color: #f5f5f5;
}

#app {
  height: 100%;
}

// 全局样式
.ant-btn-primary {
  background-color: #000;
  border-color: #000;

  &:hover,
  &:focus {
    background-color: #333;
    border-color: #333;
  }
}

.ant-pagination-item-active {
  border-color: #000;
  
  a {
    color: #000;
  }
}

.ant-pagination-item:hover {
  border-color: #000;
  
  a {
    color: #000;
  }
}

.ant-pagination-item-active:focus, 
.ant-pagination-item-active:hover {
  border-color: #000;
  
  a {
    color: #000;
  }
}

.ant-btn-link {
  color: #000;
  
  &:hover,
  &:focus {
    color: #333;
  }
}

.ant-dropdown-menu-item:hover, 
.ant-dropdown-menu-submenu-title:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.ant-message-notice-content {
  background: #000;
  color: #fff;
  
  .anticon {
    color: #fff;
  }
}

// 修改 Message 组件文字颜色
.ant-message {
  .ant-message-notice-content {
    color: #000;
  }
  
  // 不同类型的消息样式
  .ant-message-success,
  .ant-message-error,
  .ant-message-warning,
  .ant-message-info {
    color: #000;
    
    .anticon {
      color: inherit;  // 图标颜色保持原样
    }
  }
}
</style>
