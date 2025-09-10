<template>
  <div class="search-box">
    <el-autocomplete
      v-model="keyword"
      :fetch-suggestions="querySearch"
      placeholder="搜索商品/订单"
      :trigger-on-focus="false"
      @select="handleSelect"
      class="search-input"
      clearable
    >
      <template slot-scope="{ item }">
        <div class="search-suggestion">
          <template v-if="item.type === 'product'">
            <img :src="item.cover" :alt="item.title" class="suggestion-img">
            <div class="suggestion-info">
              <div class="title">{{ item.title }}</div>
              <div class="price">¥{{ item.price }}</div>
            </div>
          </template>
          <template v-else-if="item.type === 'order'">
            <i class="el-icon-document"></i>
            <div class="suggestion-info">
              <div class="title">订单号：{{ item.order_no }}</div>
              <div class="order-items">
                <template v-if="item.items && item.items.length">
                  {{ formatOrderItems(item.items) }}
                </template>
              </div>
              <div class="desc">{{ formatOrderInfo(item) }}</div>
            </div>
          </template>
        </div>
      </template>
    </el-autocomplete>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'

export default {
  name: 'SearchBox',
  data() {
    return {
      keyword: ''
    }
  },
  methods: {
    async querySearch(queryString, callback) {
      if (queryString.length < 1) {
        callback([])
        return
      }
      
      try {
        // 同时搜索商品和订单
        const [productsRes, ordersRes] = await Promise.all([
          this.$axios.get('/api/products/search', {
            params: { keyword: queryString }
          }).catch(() => ({ code: 200, data: [] })),
          this.$axios.get('/api/orders/search', {
            params: { keyword: queryString }
          }).catch(() => ({ code: 200, data: [] }))
        ])

        const suggestions = []

        // 添加商品搜索结果
        if (productsRes.code === 200 && Array.isArray(productsRes.data)) {
          suggestions.push(
            ...productsRes.data.map(item => ({
              ...item,
              type: 'product',
              value: item.title
            }))
          )
        }

        // 添加订单搜索结果
        if (ordersRes.code === 200 && Array.isArray(ordersRes.data)) {
          suggestions.push(
            ...ordersRes.data.map(item => ({
              ...item,
              type: 'order',
              value: `订单号：${item.order_no}`
            }))
          )
        }

        callback(suggestions)
      } catch (error) {
        console.error('搜索失败:', error)
        callback([])
      }
    },
    async handleSelect(item) {
      if (item.type === 'product') {
        // 添加错误处理
        try {
          await this.$router.push(`/product/${item.id}`).catch(err => {
            if (err.name !== 'NavigationDuplicated') {
              throw err
            }
          })
        } catch (error) {
          console.error('导航失败:', error)
        }
      } else if (item.type === 'order') {
        try {
          await this.$router.push(`/order/${item.order_no}`).catch(err => {
            if (err.name !== 'NavigationDuplicated') {
              throw err
            }
          })
        } catch (error) {
          console.error('导航失败:', error)
        }
      }
      this.keyword = ''
    },
    formatOrderItems(items) {
      // 最多显示2个商品名称，超过则显示省略号
      const titles = items.map(item => item.product_title)
      if (titles.length <= 2) {
        return titles.join('、')
      }
      return `${titles[0]}、${titles[1]} 等${titles.length}件商品`
    },
    formatOrderInfo(order) {
      const statusMap = {
        0: '待付款',
        1: '待发货',
        2: '待收货',
        3: '已完成',
        4: '已取消'
      }
      return `${statusMap[order.status]} | ¥${order.total_amount}`
    }
  }
}
</script>

<style scoped>
.search-box {
  width: 400px;
}

.search-input {
  width: 100%;
}

.search-suggestion {
  display: flex;
  align-items: center;
  padding: 12px 0;
}

.suggestion-img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 10px;
}

.suggestion-info {
  flex: 1;
}

.suggestion-info .title {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.suggestion-info .price {
  font-size: 12px;
  color: #FF6B35;
}

.suggestion-info .order-items {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.suggestion-info .desc {
  font-size: 12px;
  color: #999;
  display: flex;
  justify-content: space-between;
}

:deep(.el-autocomplete-suggestion) {
  width: 100%;
  max-height: 400px;
}

:deep(.el-autocomplete-suggestion__wrap) {
  max-height: 400px;
}

:deep(.el-icon-document) {
  font-size: 32px;
  color: #666;
  margin-right: 12px;
  margin-left: 4px;
}

:deep(.el-input__inner) {
  border-radius: 20px;
}

:deep(.el-input__inner:focus) {
  border-color: #333;
}
</style> 