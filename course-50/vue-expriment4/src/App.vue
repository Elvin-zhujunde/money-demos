<template>
    <div id="app">
      <header class="header">电商后台管理系统</header>
      <div class="main">
        <!-- 左侧菜单栏 -->
        <div class="content left">
          <ul>
            <li><router-link to="/users">用户管理</router-link></li>
            <li><router-link to="/rights">权限管理</router-link></li>
            <li><router-link to="/cars">购物车</router-link></li>
            <li><router-link to="/goods">商品管理</router-link></li>
            <li><router-link to="/orders">订单管理</router-link></li>
            <li><router-link to="/settings">系统设置</router-link></li>
          </ul>
        </div>
        <!-- 右侧内容区 -->
        <div class="content right">
          <div class="main-content">
            <router-view />
          </div>
        </div>
      </div>
      <footer class="footer">版权信息</footer>
    </div>
  </template>
  
  <script>
  export default {
    name: "App",
    components: {},
  };
  </script>
  
  <style>
  html,
  body,
  #app {
    margin: 0;
    padding: 0px;
    height: 100%;
  }
  .header {
    height: 50px;
    background-color: #545c64;
    line-height: 50px;
    text-align: center;
    font-size: 24px;
    color: #fff;
  }
  .footer {
    height: 40px;
    line-height: 40px;
    background-color: #888;
    position: absolute;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #fff;
  }
  .main {
    display: flex;
    position: absolute;
    top: 50px;
    bottom: 40px;
    width: 100%;
  }
  .content {
    flex: 1;
    text-align: center;
    height: 100%;
  }
  .left {
    flex: 0 0 20%;
    background-color: #545c64;
  }
  .left a {
    color: white;
    text-decoration: none;
  }
  .right {
    margin: 5px;
  }
  .main-content {
    margin-top: 10px;
  }
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  ul li {
    height: 42px;
    line-height: 45px;
    background-color: #a0a0a0;
    color: #fff;
    cursor: pointer;
    border-bottom: 1px solid #fff;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  td,
  th {
    border: 1px solid #eee;
    line-height: 35px;
    font-size: 12px;
  }
  
  th {
    background-color: #ddd;
  }
  </style>
  