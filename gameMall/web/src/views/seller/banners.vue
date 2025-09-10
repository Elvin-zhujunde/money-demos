<template>
  <div class="banners-container">
    <div class="page-header">
      <h2>轮播图管理</h2>
      <el-button type="primary" @click="handleAdd">添加轮播图</el-button>
    </div>

    <!-- 轮播图列表 -->
    <el-table v-loading="loading" :data="banners" border style="width: 100%">
      <el-table-column label="图片" width="200">
        <template #default="{ row }">
          <img :src="row.image_url" :alt="row.title" class="banner-image" />
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="link_url" label="链接" />
      <el-table-column prop="sort_order" label="排序" width="100" />
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button size="mini" @click="handleEdit(row)"> 编辑 </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑对话框 -->
    <el-dialog
      :title="editingBanner.id ? '编辑轮播图' : '添加轮播图'"
      :visible.sync="showDialog"
      width="500px"
    >
      <el-form
        ref="bannerForm"
        :model="editingBanner"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="editingBanner.title" />
        </el-form-item>
        <el-form-item label="图片" prop="image_url">
          <el-upload
            class="banner-uploader"
            :action="`${baseURL}/api/upload`"
            :headers="uploadHeaders"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :before-upload="beforeUpload"
          >
            <img
              v-if="editingBanner.image_url"
              :src="editingBanner.image_url"
              class="upload-image"
            />
            <i v-else class="el-icon-plus upload-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="链接" prop="link_url">
          <el-input v-model="editingBanner.link_url" />
        </el-form-item>
        <el-form-item label="排序" prop="sort_order">
          <el-input-number
            v-model="editingBanner.sort_order"
            :min="0"
            :max="99"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="editingBanner.status"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "BannerManagement",
  data() {
    return {
      loading: false,
      banners: [],
      showDialog: false,
      editingBanner: {
        title: "",
        image_url: "",
        link_url: "",
        sort_order: 0,
        status: 1,
      },
      submitting: false,
      baseURL: process.env.VUE_APP_BASE_API || "http://localhost:9090",
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        image_url: [
          { required: true, message: "请上传图片", trigger: "change" },
        ],
        link_url: [{ required: true, message: "请输入链接", trigger: "blur" }],
      },
    };
  },
  computed: {
    uploadHeaders() {
      const userInfo = localStorage.getItem("userInfo");
      return userInfo
        ? {
            "user-info": encodeURIComponent(userInfo),
          }
        : {};
    },
  },
  created() {
    this.fetchBanners();
  },
  methods: {
    async fetchBanners() {
      try {
        this.loading = true;
        const res = await this.$axios.get("/api/banners");
        if (res.code === 200) {
          this.banners = res.data;
        }
      } catch (error) {
        console.error("获取轮播图列表失败:", error);
        this.$message.error("获取轮播图列表失败");
      } finally {
        this.loading = false;
      }
    },
    handleAdd() {
      this.editingBanner = {
        title: "",
        image_url: "",
        link_url: "",
        sort_order: 0,
        status: 1,
      };
      this.showDialog = true;
    },
    handleEdit(banner) {
      this.editingBanner = { ...banner };
      this.showDialog = true;
    },
    async handleDelete(banner) {
      try {
        await this.$confirm("确定要删除该轮播图吗？", "提示", {
          type: "warning",
        });
        const res = await this.$axios.delete(`/api/admin/banners/${banner.id}`);
        if (res.code === 200) {
          this.$message.success("删除成功");
          this.fetchBanners();
        }
      } catch (error) {
        if (error !== "cancel") {
          console.error("删除轮播图失败:", error);
          this.$message.error("删除轮播图失败");
        }
      }
    },
    async handleStatusChange(banner) {
      try {
        const res = await this.$axios.put(`/api/admin/banners/${banner.id}`, {
          status: banner.status,
        });
        if (res.code === 200) {
          this.$message.success("更新成功");
        }
      } catch (error) {
        console.error("更新状态失败:", error);
        this.$message.error("更新状态失败");
        banner.status = banner.status === 1 ? 0 : 1; // 还原状态
      }
    },
    handleUploadSuccess(res) {
      if (res.code === 200) {
        this.editingBanner.image_url = this.baseURL + res.data.url;
        this.$message.success("上传成功");
      } else {
        this.$message.error(res.message || "上传失败");
      }
    },
    handleUploadError(err) {
      console.error("上传失败:", err);
      this.$message.error("上传失败，请重试");
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
    async handleSubmit() {
      try {
        await this.$refs.bannerForm.validate();
        this.submitting = true;

        const data = {
          title: this.editingBanner.title,
          image_url: this.editingBanner.image_url,
          link_url: this.editingBanner.link_url,
          sort_order: this.editingBanner.sort_order,
          status: this.editingBanner.status,
        };

        let res;
        if (this.editingBanner.id) {
          res = await this.$axios.put(
            `/api/admin/banners/${this.editingBanner.id}`,
            data
          );
        } else {
          res = await this.$axios.post("/api/admin/banners", data);
        }

        if (res.code === 200) {
          this.$message.success(
            this.editingBanner.id ? "更新成功" : "添加成功"
          );
          this.showDialog = false;
          this.fetchBanners();
        }
      } catch (error) {
        if (error !== "cancel") {
          console.error("提交失败:", error);
          this.$message.error("提交失败");
        }
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>

<style scoped>
.banners-container {
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

.banner-image {
  width: 150px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.banner-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 200px;
  height: 120px;
}

.banner-uploader:hover {
  border-color: #409eff;
}

.upload-icon {
  font-size: 28px;
  color: #8c939d;
  width: 200px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}

.upload-image {
  width: 200px;
  height: 120px;
  object-fit: cover;
}
</style>
