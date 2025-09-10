<template>
  <div class="seller-orders">
    <div class="page-header">
      <h2>订单管理</h2>
      <div class="filter-options">
        <el-input
          v-model="searchKeyword"
          placeholder="请输入订单号或商品名称"
          class="search-input"
          clearable
          @keyup.enter.native="handleSearch"
        >
          <el-button 
            slot="append" 
            icon="el-icon-search"
            @click="handleSearch"
          ></el-button>
        </el-input>

        <el-select v-model="status" placeholder="订单状态" @change="handleFilter">
          <el-option label="全部" value=""></el-option>
          <el-option label="待付款" :value="0"></el-option>
          <el-option label="待发货" :value="1"></el-option>
          <el-option label="待收货" :value="2"></el-option>
          <el-option label="已完成" :value="3"></el-option>
          <el-option label="已取消" :value="4"></el-option>
        </el-select>
      </div>
    </div>

    <el-table :data="orders" style="width: 100%">
      <el-table-column label="订单信息" min-width="400">
        <template slot-scope="scope">
          <div class="order-info">
            <div class="order-no">订单号：{{ scope.row.order_no }}</div>
            <div class="order-items">
              <div class="item" v-for="item in scope.row.items" :key="item.id">
                <img :src="item.product_cover" :alt="item.product_title">
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
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button 
            v-if="scope.row.status === 1"
            type="text"
            @click="handleShip(scope.row)"
          >
            发货
          </el-button>
          <el-button 
            v-if="scope.row.status === 0"
            type="text"
            class="cancel-btn"
            @click="handleCancel(scope.row)"
          >
            取消订单
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

    <!-- 发货对话框 -->
    <el-dialog
      title="订单发货"
      :visible.sync="showShipDialog"
      width="400px"
    >
      <el-form 
        ref="shipForm" 
        :model="shipForm" 
        :rules="shipRules"
        label-width="100px"
      >
        <el-form-item label="快递公司" prop="express_company">
          <el-select v-model="shipForm.express_company" placeholder="请选择快递公司">
            <el-option label="顺丰快递" value="SF"></el-option>
            <el-option label="中通快递" value="ZTO"></el-option>
            <el-option label="圆通快递" value="YTO"></el-option>
            <el-option label="韵达快递" value="YD"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号" prop="express_no">
          <el-input v-model="shipForm.express_no"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="showShipDialog = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitShip">
          确定发货
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SellerOrders',
  data() {
    return {
      searchKeyword: '',
      orders: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      status: '',
      showShipDialog: false,
      submitting: false,
      currentOrder: null,
      shipForm: {
        express_company: '',
        express_no: ''
      },
      shipRules: {
        express_company: [
          { required: true, message: '请选择快递公司', trigger: 'change' }
        ],
        express_no: [
          { required: true, message: '请输入快递单号', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchOrders()
  },
  methods: {
    async fetchOrders() {
      try {
        const res = await this.$axios.get('/api/seller/orders', {
          params: {
            page: this.currentPage,
            pageSize: this.pageSize,
            status: this.status,
            keyword: this.searchKeyword
          }
        })
        if (res.code === 200) {
          this.orders = res.data.list
          this.total = res.data.total
        }
      } catch (error) {
        console.error('获取订单列表失败:', error)
        this.$message.error('获取订单列表失败')
      }
    },
    handlePageChange(page) {
      this.currentPage = page
      this.fetchOrders()
    },
    handleFilter() {
      this.currentPage = 1
      this.fetchOrders()
    },
    getStatusType(status) {
      const types = {
        0: 'warning',
        1: 'primary',
        2: 'success',
        3: 'info',
        4: 'danger'
      }
      return types[status] || 'info'
    },
    getStatusText(status) {
      const texts = {
        0: '待付款',
        1: '待发货',
        2: '待收货',
        3: '已完成',
        4: '已取消'
      }
      return texts[status] || '未知状态'
    },
    async handleShip(order) {
      try {
        await this.$confirm('确定要发货吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        })

        const res = await this.$axios.post(`/api/seller/orders/${order.order_no}/ship`)
        if (res.code === 200) {
          this.$message.success('发货成功')
          this.fetchOrders()
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('发货失败:', error)
          this.$message.error('发货失败')
        }
      }
    },
    async handleCancel(order) {
      try {
        await this.$confirm('确定要取消该订单吗？', '提示', {
          type: 'warning'
        })
        const res = await this.$axios.post(`/api/seller/orders/${order.order_no}/cancel`)
        if (res.code === 200) {
          this.$message.success('取消成功')
          this.fetchOrders()
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('取消订单失败:', error)
          this.$message.error('取消订单失败')
        }
      }
    },
    async submitShip() {
      try {
        await this.$refs.shipForm.validate()
        this.submitting = true

        const res = await this.$axios.post(
          `/api/seller/orders/${this.currentOrder.order_no}/ship`,
          this.shipForm
        )

        if (res.code === 200) {
          this.$message.success('发货成功')
          this.showShipDialog = false
          this.fetchOrders()
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('发货失败:', error)
          this.$message.error('发货失败')
        }
      } finally {
        this.submitting = false
      }
    },
    handleSearch() {
      this.currentPage = 1
      this.fetchOrders()
    }
  }
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
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
  color: #FF6B35;
  font-weight: 500;
}

.cancel-btn {
  color: #F56C6C;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.filter-options {
  display: flex;
  gap: 15px;
  align-items: center;
}

.search-input {
  width: 250px;
}

:deep(.el-select) {
  width: 120px;
}
</style> 