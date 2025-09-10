<template>
    <div class="categories-container">
      <div class="page-header">
        <h2>分类管理</h2>
        <el-button type="primary" @click="handleAdd">添加分类</el-button>
      </div>
  
      <!-- 分类列表 -->
      <el-table
        v-loading="loading"
        :data="categories"
        row-key="id"
        border
        :tree-props="{children: 'children'}"
      >
        <el-table-column
          prop="id"
          label="ID"
          width="80"
        />
        <el-table-column
          label="图标"
          width="100"
        >
          <template #default="{ row }">
            <img 
              v-if="row.icon"
              :src="row.icon" 
              class="category-icon"
            >
            <i v-else class="el-icon-folder"></i>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="分类名称"
        />
        <el-table-column
          prop="level"
          label="层级"
          width="100"
        />
        <el-table-column
          prop="sort"
          label="排序"
          width="100"
        />
        <el-table-column
          label="操作"
          width="400"
          fixed="right"
        >
          <template #default="{ row }">
            <el-button
              size="mini"
              @click="handleAdd(row)"
            >
              添加子分类
            </el-button>
            <el-button
              size="mini"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 编辑对话框 -->
      <el-dialog
        :title="editingCategory.id ? (isAddingSub ? '添加子分类' : '编辑分类') : '添加分类'"
        :visible.sync="showDialog"
        width="500px"
      >
        <el-form
          ref="categoryForm"
          :model="editingCategory"
          :rules="rules"
          label-width="80px"
        >
          <el-form-item label="名称" prop="name">
            <el-input v-model="editingCategory.name" />
          </el-form-item>
          <el-form-item label="图标">
            <el-upload
              class="icon-uploader"
              :action="`${baseURL}/api/upload`"
              :headers="uploadHeaders"
              :show-file-list="false"
              :on-success="handleUploadSuccess"
              :on-error="handleUploadError"
              :before-upload="beforeUpload"
            >
              <img 
                v-if="editingCategory.icon" 
                :src="editingCategory.icon" 
                class="upload-icon"
              >
              <i v-else class="el-icon-plus upload-icon-placeholder"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input-number 
              v-model="editingCategory.sort" 
              :min="0"
              :max="99"
            />
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="showDialog = false">取消</el-button>
          <el-button
            type="primary"
            :loading="submitting"
            @click="handleSubmit"
          >
            确定
          </el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CategoryManagement',
    data() {
      return {
        loading: false,
        categories: [],
        showDialog: false,
        editingCategory: {
          name: '',
          icon: '',
          parent_id: 0,
          level: 1,
          sort: 0
        },
        isAddingSub: false,
        submitting: false,
        baseURL: process.env.VUE_APP_BASE_API || 'http://localhost:9090',
        rules: {
          name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      uploadHeaders() {
        const userInfo = localStorage.getItem('userInfo')
        return userInfo ? {
          'user-info': encodeURIComponent(userInfo)
        } : {}
      }
    },
    created() {
      this.fetchCategories()
    },
    methods: {
      async fetchCategories() {
        try {
          this.loading = true
          const res = await this.$axios.get('/api/categories')
          if (res.code === 200) {
            this.categories = this.buildTree(res.data)
          }
        } catch (error) {
          console.error('获取分类列表失败:', error)
          this.$message.error('获取分类列表失败')
        } finally {
          this.loading = false
        }
      },
      buildTree(categories) {
        const parents = categories.filter(c => c.parent_id === 0)
        const children = categories.filter(c => c.parent_id !== 0)
        
        const buildChildren = (parent) => {
          const subs = children.filter(c => c.parent_id === parent.id)
          if (subs.length) {
            parent.children = subs
            subs.forEach(buildChildren)
          }
        }
        
        parents.forEach(buildChildren)
        return parents
      },
      handleAdd(parent) {
        this.isAddingSub = !!parent
        this.editingCategory = {
          name: '',
          icon: '',
          parent_id: parent ? parent.id : 0,
          level: parent ? parent.level + 1 : 1,
          sort: 0
        }
        this.showDialog = true
      },
      handleEdit(category) {
        this.isAddingSub = false
        this.editingCategory = { ...category }
        this.showDialog = true
      },
      async handleDelete(category) {
        try {
          await this.$confirm('确定要删除该分类吗？删除后无法恢复', '提示', {
            type: 'warning'
          })
          const res = await this.$axios.delete(`/api/admin/categories/${category.id}`)
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.fetchCategories()
          }
        } catch (error) {
          if (error !== 'cancel') {
            console.error('删除分类失败:', error)
            this.$message.error('删除分类失败')
          }
        }
      },
      handleUploadSuccess(res) {
        if (res.code === 200) {
          this.editingCategory.icon = this.baseURL + res.data.url
          this.$message.success('上传成功')
        } else {
          this.$message.error(res.message || '上传失败')
        }
      },
      handleUploadError(err) {
        console.error('上传失败:', err)
        this.$message.error('上传失败，请重试')
      },
      beforeUpload(file) {
        const isImage = file.type.startsWith('image/')
        const isLt2M = file.size / 1024 / 1024 < 2
  
        if (!isImage) {
          this.$message.error('只能上传图片文件!')
          return false
        }
        if (!isLt2M) {
          this.$message.error('图片大小不能超过 2MB!')
          return false
        }
        return true
      },
      async handleSubmit() {
        try {
          await this.$refs.categoryForm.validate()
          this.submitting = true
  
          const data = {
            name: this.editingCategory.name,
            icon: this.editingCategory.icon,
            parent_id: this.editingCategory.parent_id,
            level: this.editingCategory.level,
            sort: this.editingCategory.sort
          }
  
          let res
          if (this.editingCategory.id) {
            res = await this.$axios.put(`/api/admin/categories/${this.editingCategory.id}`, data)
          } else {
            res = await this.$axios.post('/api/admin/categories', data)
          }
  
          if (res.code === 200) {
            this.$message.success(this.editingCategory.id ? '更新成功' : '添加成功')
            this.showDialog = false
            this.fetchCategories()
          }
        } catch (error) {
          if (error !== 'cancel') {
            console.error('提交失败:', error)
            this.$message.error('提交失败')
          }
        } finally {
          this.submitting = false
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .categories-container {
    padding: 20px;
  }
  
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
  
  .category-icon {
    width: 30px;
    height: 30px;
    object-fit: contain;
  }
  
  .icon-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 100px;
    height: 100px;
  }
  
  .icon-uploader:hover {
    border-color: #409EFF;
  }
  
  .upload-icon-placeholder {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  
  .upload-icon {
    width: 100px;
    height: 100px;
    object-fit: contain;
  }
  </style>