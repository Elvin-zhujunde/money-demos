const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  
  // 开发服务器配置
  devServer: {
    port: 8080,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    }
  },

  // CSS 相关配置
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
          // 全局 Less 变量
          globalVars: {
            primaryColor: '#000000',
            secondaryColor: '#666666',
            borderRadius: '8px'
          },
          // 添加全局 mixins
          additionalData: `
            @import "@/styles/mixins.less";
          `
        }
      }
    }
  }
})