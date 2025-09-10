<template>
  <div class="seller-products">
    <div class="page-header">
      <h2>商品管理</h2>
      <el-button type="primary" @click="showAddDialog = true">
        <i class="el-icon-plus"></i>
        添加商品
      </el-button>
    </div>

    <div class="search-bar">
      <el-input
        v-model="searchKeyword"
        placeholder="请输入商品名称"
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
    </div>

    <el-table :data="products" style="width: 100%">
      <el-table-column label="商品信息" min-width="400">
        <template slot-scope="scope">
          <div class="product-info">
            <img :src="scope.row.cover" :alt="scope.row.title" />
            <div class="product-detail">
              <div class="title">{{ scope.row.title }}</div>
              <div class="category">
                分类：{{ getCategory(scope.row.category_id) }}
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="价格" width="150">
        <template slot-scope="scope">
          <div class="price">¥{{ scope.row.price }}</div>
          <div class="original-price" v-if="scope.row.original_price">
            ¥{{ scope.row.original_price }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="库存" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.stock }}</span>
        </template>
      </el-table-column>
      <el-table-column label="销量" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.sales }}</span>
        </template>
      </el-table-column>
    
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button
            type="text"
            class="delete-btn"
            @click="handleDelete(scope.row)"
          >
            删除
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

    <!-- 添加/编辑商品对话框 -->
    <el-dialog
      :title="editingProduct.id ? '编辑商品' : '添加商品'"
      :visible.sync="showAddDialog"
      width="600px"
    >
      <el-form
        ref="productForm"
        :model="editingProduct"
        :rules="productRules"
        label-width="100px"
      >
        <el-form-item label="商品名称" prop="title">
          <el-input v-model="editingProduct.title"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" prop="category_id">
          <el-cascader
            v-model="editingProduct.category"
            :options="categories"
            :props="{
              value: 'id',
              label: 'name',
              children: 'children',
            }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="商品图片" prop="cover">
          <el-upload
            class="avatar-uploader"
            :action="`${baseURL}/api/upload`"
            :headers="uploadHeaders"
            name="file"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :before-upload="beforeUpload"
          >
            <img
              v-if="editingProduct.cover"
              :src="editingProduct.cover"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input-number
            v-model="editingProduct.price"
            :precision="2"
            :step="0.1"
            :min="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="原价" prop="original_price">
          <el-input-number
            v-model="editingProduct.original_price"
            :precision="2"
            :step="0.1"
            :min="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input-number
            v-model="editingProduct.stock"
            :min="0"
            :step="1"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="商品描述" prop="description">
          <el-input
            type="textarea"
            v-model="editingProduct.description"
            :rows="4"
          ></el-input>
        </el-form-item>
        <el-form-item label="发货地" prop="shipping_from">
          <el-input v-model="editingProduct.shipping_from"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitProduct">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "SellerProducts",
  data() {
    return {
      searchKeyword: '',
      loading: false,
      products: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      showAddDialog: false,
      submitting: false,
      orgCategories:[],
      editingProduct: {
        title: "",
        category: [],
        cover: "",
        price: 0,
        original_price: 0,
        stock: 0,
        description: "",
        shipping_from: "",
      },
      productRules: {
        title: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        category: [
          { required: true, message: "请选择商品分类", trigger: "change" },
        ],
        cover: [
          { required: true, message: "请上传商品图片", trigger: "change" },
        ],
        price: [{ required: true, message: "请输入商品价格", trigger: "blur" }],
        stock: [{ required: true, message: "请输入商品库存", trigger: "blur" }],
        shipping_from: [
          { required: true, message: "请输入发货地", trigger: "blur" },
        ],
      },
      categories: [],
      baseURL: "http://localhost:9090",
      uploadHeaders: {
        "user-info": encodeURIComponent(localStorage.getItem("userInfo")),
      },
    };
  },
  created() {
    this.fetchProducts();
    this.fetchCategories();
  },
  methods: {
    async fetchProducts() {
      try {
        const res = await this.$axios.get("/api/seller/products", {
          params: {
            page: this.currentPage,
            pageSize: this.pageSize,
          },
        });
        if (res.code === 200) {
          this.products = res.data.list;
          this.total = res.data.total;
        }
      } catch (error) {
        console.error("获取商品列表失败:", error);
        this.$message.error("获取商品列表失败");
      }
    },
    async fetchCategories() {
      try {
        const res = await this.$axios.get("/api/categories");
        if (res.code === 200) {
          // 处理分类数据，构建树形结构
          this.categories = this.buildCategoryTree(res.data);
          this.orgCategories = res.data;
        }
      } catch (error) {
        console.error("获取分类失败:", error);
        this.$message.error("获取分类失败");
      }
    },
    getCategory(id) {
      const category = this.orgCategories.find((c) => c.id === id);
      return category ? category.name : "未分类";
    },
    buildCategoryTree(categories) {
      const parents = categories.filter((c) => c.parent_id === 0);
      parents.forEach((p) => {
        p.children = categories.filter((c) => c.parent_id === p.id);
      });
      return parents;
    },
    handlePageChange(page) {
      this.currentPage = page;
      this.fetchProducts();
    },
    handleEdit(product) {
      this.editingProduct = { ...product };
      this.showAddDialog = true;
    },
    async handleDelete(product) {
      try {
        await this.$confirm("确定要删除该商品吗？", "提示", {
          type: "warning",
        });
        const res = await this.$axios.delete(
          `/api/seller/products/${product.id}`
        );
        if (res.code === 200) {
          this.$message.success("删除成功");
          this.fetchProducts();
        }
      } catch (error) {
        if (error !== "cancel") {
          console.error("删除商品失败:", error);
          this.$message.error("删除商品失败");
        }
      }
    },
    async handleStatusChange(product) {
      try {
        const res = await this.$axios.put(
          `/api/seller/products/${product.id}/status`,
          {
            status: product.status,
          }
        );
        if (res.code === 200) {
          this.$message.success("更新成功");
        }
      } catch (error) {
        console.error("更新状态失败:", error);
        this.$message.error("更新状态失败");
        // 恢复状态
        product.status = product.status === 1 ? 0 : 1;
      }
    },
    beforeUpload(file) {
      const isImage = file.type.startsWith("image/");
      const isLt5M = file.size / 1024 / 1024 < 5;

      if (!isImage) {
        this.$message.error("只能上传图片文件!");
        return false;
      }
      if (!isLt5M) {
        this.$message.error("图片大小不能超过 5MB!");
        return false;
      }
      return true;
    },
    handleUploadSuccess(res) {
      if (res.code === 200) {
        this.editingProduct.cover = this.baseURL + res.data.url;
        this.$message.success("上传成功");
      } else {
        this.$message.error(res.message || "上传失败");
      }
    },
    handleUploadError(err) {
      console.error("上传失败:", err);
      this.$message.error("上传失败，请重试");
    },
    async submitProduct() {
      try {
        await this.$refs.productForm.validate();
        this.submitting = true;

        const data = {
          title: this.editingProduct.title,
          category_id:
            this.editingProduct.category[
              this.editingProduct.category.length - 1
            ],
          cover: this.editingProduct.cover,
          price: this.editingProduct.price,
          original_price: this.editingProduct.original_price,
          stock: this.editingProduct.stock,
          description: this.editingProduct.description,
          shipping_from: this.editingProduct.shipping_from,
        };

        // 如果是编辑模式，添加 id
        if (this.editingProduct.id) {
          data.id = this.editingProduct.id;
        }

        const res = await this.$axios[data.id ? "put" : "post"](
          `/api/seller/products${data.id ? `/${data.id}` : ""}`,
          data
        );

        if (res.code === 200) {
          this.$message.success(data.id ? "更新成功" : "添加成功");
          this.showAddDialog = false;
          this.fetchProducts();
          // 重置表单
          this.editingProduct = {
            title: "",
            category: [],
            cover: "",
            price: 0,
            original_price: 0,
            stock: 0,
            description: "",
            shipping_from: "",
          };
        } else {
          this.$message.error(
            res.message || (data.id ? "更新失败" : "添加失败")
          );
        }
      } catch (error) {
        if (error !== "cancel") {
          console.error("商品操作失败:", error);
          this.$message.error(this.editingProduct.id ? "更新失败" : "添加失败");
        }
      } finally {
        this.submitting = false;
      }
    },
    async handleSearch() {
      if (!this.searchKeyword.trim()) {
        return this.fetchProducts() // 如果搜索框为空,则获取全部商品
      }
      
      try {
        this.loading = true
        const res = await this.$axios.get('/api/seller/products/search', {
          params: {
            keyword: this.searchKeyword
          }
        })
        if (res.code === 200) {
          this.products = res.data
        }
      } catch (error) {
        console.error('搜索商品失败:', error)
        this.$message.error('搜索失败，请重试')
      } finally {
        this.loading = false
      }
    },
  },
};
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

.product-info {
  display: flex;
  align-items: center;
}

.product-info img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 10px;
}

.product-detail .title {
  color: #333;
  margin-bottom: 5px;
}

.product-detail .seller {
  color: #666;
  font-size: 12px;
  margin-bottom: 3px;
}

.product-detail .category {
  color: #999;
  font-size: 12px;
}

.price {
  color: #ff6b35;
  font-weight: 500;
}

.original-price {
  color: #999;
  text-decoration: line-through;
  font-size: 12px;
}

.delete-btn {
  color: #f56c6c;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 120px;
  height: 120px;
}

.avatar-uploader:hover {
  border-color: #333;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}

.avatar {
  width: 120px;
  height: 120px;
  display: block;
  object-fit: cover;
}

.search-bar {
  margin-bottom: 20px;
}

.search-input {
  width: 300px;
}
</style>
