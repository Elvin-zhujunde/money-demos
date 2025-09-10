<template>
  <div class="products-manage">
    <el-card>
      <!-- 搜索和操作栏 -->
      <div class="toolbar">
        <div class="search-bar">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索商品名称/描述"
            clearable
            style="width: 300px"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>

          <el-select v-model="categoryFilter" placeholder="商品分类" clearable>
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </div>

        <el-button type="primary" @click="handleAdd">
          新增商品
        </el-button>
      </div>

      <!-- 商品列表 -->
      <el-table :data="filteredProducts" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="商品图片" width="120">
          <template #default="{ row }">
            <el-image
              :src="row.image"
              fit="cover"
              class="product-image"
              :preview-src-list="[row.image]"
            />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="商品名称" />
        <el-table-column prop="price" label="价格">
          <template #default="{ row }">
            ¥{{ row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100" />
        <el-table-column prop="sales" label="销量" width="100" />
        <el-table-column label="分类">
          <template #default="{ row }">
            <el-tag>{{ getCategoryName(row.categoryId) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="热门" width="80">
          <template #default="{ row }">
            <el-switch
              v-model="row.isHot"
              @change="(val) => handleHotChange(row, val)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button 
              link 
              type="primary" 
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button 
              link 
              type="danger" 
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 商品表单对话框 -->
    <el-dialog
      :title="dialogType === 'add' ? '新增商品' : '编辑商品'"
      v-model="dialogVisible"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="商品名称" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>

        <el-form-item label="商品分类" prop="categoryId">
          <el-select v-model="form.categoryId" class="w-100">
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="商品价格" prop="price">
          <el-input-number 
            v-model="form.price"
            :precision="2"
            :step="0.1"
            :min="0"
          />
        </el-form-item>

        <el-form-item label="商品库存" prop="stock">
          <el-input-number 
            v-model="form.stock"
            :min="0"
            :precision="0"
          />
        </el-form-item>

        <el-form-item label="商品图片" prop="image">
          <el-input v-model="form.image" placeholder="请输入图片URL" />
          <div class="image-preview" v-if="form.image">
            <el-image :src="form.image" fit="cover" />
          </div>
        </el-form-item>

        <el-form-item label="商品描述" prop="description">
          <el-input 
            v-model="form.description"
            type="textarea"
            rows="3"
          />
        </el-form-item>

        <el-form-item label="热门商品">
          <el-switch v-model="form.isHot" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import axios from 'axios'

const loading = ref(false)
const submitting = ref(false)
const products = ref([])
const categories = ref([])
const searchKeyword = ref('')
const categoryFilter = ref('')
const dialogVisible = ref(false)
const dialogType = ref('add')
const formRef = ref()

// 表单数据
const form = ref({
  title: '',
  categoryId: '',
  price: 0,
  stock: 0,
  image: '',
  description: '',
  isHot: false,
  sales: 0
})

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择商品分类', trigger: 'change' }
  ],
  price: [
    { required: true, message: '请输入商品价格', trigger: 'blur' }
  ],
  stock: [
    { required: true, message: '请输入商品库存', trigger: 'blur' }
  ],
  image: [
    { required: true, message: '请输入商品图片URL', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入商品描述', trigger: 'blur' }
  ]
}

// 过滤商品列表
const filteredProducts = computed(() => {
  let result = [...products.value]
  
  // 关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(product => 
      product.title.toLowerCase().includes(keyword) ||
      product.description.toLowerCase().includes(keyword)
    )
  }
  
  // 分类筛选
  if (categoryFilter.value) {
    result = result.filter(product => product.categoryId === categoryFilter.value)
  }
  
  return result
})

// 获取分类名称
const getCategoryName = (categoryId) => {
  const category = categories.value.find(c => c.id === categoryId)
  return category ? category.name : ''
}

// 获取商品列表
const fetchProducts = async () => {
  loading.value = true
  try {
    const { data } = await axios.get('/api/products')
    products.value = data
  } catch (error) {
    console.error('获取商品列表失败:', error)
    ElMessage.error('获取商品列表失败')
  } finally {
    loading.value = false
  }
}

// 获取分类列表
const fetchCategories = async () => {
  try {
    const { data } = await axios.get('/api/categories')
    categories.value = data
  } catch (error) {
    console.error('获取分类列表失败:', error)
    ElMessage.error('获取分类列表失败')
  }
}

// 新增商品
const handleAdd = () => {
  dialogType.value = 'add'
  form.value = {
    title: '',
    categoryId: '',
    price: 0,
    stock: 0,
    image: '',
    description: '',
    isHot: false,
    sales: 0
  }
  dialogVisible.value = true
}

// 编辑商品
const handleEdit = (row) => {
  dialogType.value = 'edit'
  form.value = { ...row }
  dialogVisible.value = true
}

// 删除商品
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除该商品吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await axios.delete(`/api/products/${row.id}`)
    ElMessage.success('删除成功')
    await fetchProducts()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 更新热门状态
const handleHotChange = async (row, value) => {
  try {
    await axios.patch(`/api/products/${row.id}`, {
      isHot: value
    })
    ElMessage.success('更新成功')
  } catch (error) {
    console.error('更新失败:', error)
    ElMessage.error('更新失败')
    row.isHot = !value // 恢复状态
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        if (dialogType.value === 'add') {
          await axios.post('/api/products', form.value)
          ElMessage.success('添加成功')
        } else {
          const { id } = form.value
          await axios.patch(`/api/products/${id}`, form.value)
          ElMessage.success('更新成功')
        }
        
        dialogVisible.value = false
        await fetchProducts()
      } catch (error) {
        console.error('操作失败:', error)
        ElMessage.error('操作失败')
      } finally {
        submitting.value = false
      }
    }
  })
}

onMounted(() => {
  fetchCategories()
  fetchProducts()
})
</script>

<style scoped>
.products-manage {
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

.product-image {
  width: 60px;
  height: 60px;
  border-radius: 4px;
}

.image-preview {
  margin-top: 10px;
}

.image-preview .el-image {
  width: 100px;
  height: 100px;
  border-radius: 4px;
}

.w-100 {
  width: 100%;
}
</style>

<script>
export default {
  name: 'ProductsManageView'
}
</script> 