<template>
  <div class="admin-songs">
    <div class="page-header">
      <h2>歌曲管理</h2>
    </div>

    <!-- 操作栏 -->
    <div class="operation-bar">
      <div class="left">
        <el-input
          v-model="keyword"
          placeholder="搜索歌曲名称"
          prefix-icon="el-icon-search"
          style="width: 300px"
          @keyup.enter.native="handleSearch"
          clearable
        />
      </div>
      <div class="right">
        <el-button type="primary" icon="el-icon-plus" @click="showCreateModal">
          添加歌曲
        </el-button>
      </div>
    </div>

    <!-- 歌曲列表 -->
    <el-table :data="songs" v-loading="loading" style="width: 100%" border>
      <el-table-column label="封面" width="100" align="center">
        <template slot-scope="scope">
          <img
            :src="scope.row.cover_image || 'https://picsum.photos/100/100'"
            class="song-cover"
            alt="封面"
          />
        </template>
      </el-table-column>

      <el-table-column prop="title" label="歌曲名称" />

      <el-table-column prop="singer_name" label="歌手" />

      <el-table-column prop="status" label="状态" width="220" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            active-text="上架"
            inactive-text="下架"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-edit"
            @click="handleEdit(scope.row)"
          >
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        :current-page.sync="pagination.current"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        layout="total, prev, pager, next"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 创建/编辑弹窗 -->
    <el-dialog
      :title="editingId ? '编辑歌曲' : '添加歌曲'"
      :visible.sync="modalVisible"
      width="500px"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="歌曲名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入歌曲名称" />
        </el-form-item>

        <el-form-item label="歌手" prop="singer_name">
          <el-input v-model="form.singer_name" placeholder="请输入歌手名称" />
        </el-form-item>

        <el-form-item label="歌曲文件" prop="file_url">
          <el-select
            v-model="form.file_url"
            placeholder="请选择歌曲文件"
            style="width: 100%"
            @change="handleMusicSelect"
          >
            <el-option
              v-for="file in audioFiles"
              :key="file.url"
              :label="file.name"
              :value="file.url"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="封面图片" prop="cover_image">
          <el-upload
            class="avatar-uploader"
            :action="`${baseURL}/api/admin/songs/upload/cover`"
            :headers="uploadHeaders"
            :show-file-list="false"
            :before-upload="beforeUploadImage"
            :on-success="handleCoverSuccess"
            :on-error="handleCoverError"
          >
            <img
              v-if="form.cover_image"
              :src="form.cover_image"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.admin-songs {
  .page-header {
    margin-bottom: 24px;
  }

  .operation-bar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .song-cover {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 4px;
  }

  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }

  .danger-button {
    color: #f56c6c;
    margin-left: 10px;
  }

  .avatar-uploader {
    :deep(.el-upload) {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;

      &:hover {
        border-color: #409eff;
      }
    }
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }

  .avatar {
    width: 100px;
    height: 100px;
    display: block;
    object-fit: cover;
  }

  :deep(.el-switch) {
    margin-right: 8px;
  }
}
</style>

<script>
export default {
  name: "AdminSongs",
  data() {
    return {
      baseURL: "http://localhost:3000",
      loading: false,
      keyword: "",
      songs: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      columns: [
        {
          title: "封面",
          dataIndex: "cover_image",
          scopedSlots: { customRender: "cover" },
          width: 100,
        },
        {
          title: "歌曲名称",
          dataIndex: "title",
        },
        {
          title: "歌手",
          dataIndex: "singer_name",
        },
        {
          title: "状态",
          dataIndex: "status",
          scopedSlots: { customRender: "status" },
        },
        {
          title: "操作",
          dataIndex: "action",
          key: "action",
          scopedSlots: { customRender: "action" },
          width: 200,
          fixed: "right",
        },
      ],
      modalVisible: false,
      submitting: false,
      editingId: null,
      form: {
        title: "",
        singer_name: "",
        file_url: "",
        cover_image: "",
      },
      rules: {
        title: [{ required: true, message: "请输入歌曲名称", trigger: "blur" }],
        singer_name: [
          { required: true, message: "请输入歌手名称", trigger: "blur" },
        ],
        file_url: [
          { required: true, message: "请上传歌曲文件", trigger: "change" },
        ],
      },
      audioFiles: [], // 音频文件列表
    };
  },
  computed: {
    uploadHeaders() {
      return {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };
    },
  },
  methods: {
    // 获取歌曲列表
    async fetchSongs() {
      this.loading = true;
      try {
        const res = await this.$http.get("/api/admin/songs", {
          params: {
            keyword: this.keyword,
            page: this.pagination.current,
            pageSize: this.pagination.pageSize,
          },
        });
        if (res.code === 200) {
          console.log("获取到的歌曲列表:", res.data.list);

          this.songs = Array.isArray(res.data.list) ? res.data.list : [];
          this.pagination.total = res.data.total;
        }
      } catch (error) {
        console.error("获取歌曲列表失败:", error);
        this.$message.error("获取歌曲列表失败");
        this.songs = [];
      } finally {
        this.loading = false;
      }
    },
    handleMusicSelect(data) {
      let name = this.audioFiles.find(item => item.url === data).name;
      let namewithoutExt = name.split(".")[0];
      this.form.title = namewithoutExt;
    },
    // 获取音频文件列表
    async fetchAudioFiles() {
      try {
        const res = await this.$http.get("/api/admin/audio-files");
        if (res.code === 200) {
          this.audioFiles = res.data;
        }
      } catch (error) {
        console.error("获取音频文件列表失败:", error);
        this.$message.error("获取音频文件列表失败");
      }
    },

    // 搜索
    handleSearch() {
      this.pagination.current = 1;
      this.fetchSongs();
    },

    // 表格翻页
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.fetchSongs();
    },

    // 显示创建弹窗
    showCreateModal() {
      this.editingId = null;
      this.form = {
        title: "",
        singer_name: "",
        file_url: "",
        cover_image: "",
      };
      this.fetchAudioFiles(); // 获取音频文件列表
      this.modalVisible = true;
    },

    // 显示编辑弹窗
    handleEdit(record) {
      console.log("编辑的歌曲数据:", record);

      if (!record) {
        this.$message.error("无效的歌曲数据");
        return;
      }

      this.editingId = record.id;
      this.form = {
        title: record.title || "",
        singer_name: record.singer_name || "",
        file_url: record.file_url || "",
        cover_image: record.cover_image || "",
      };
      this.fetchAudioFiles();
      this.modalVisible = true;
    },

    // 删除歌曲
    async handleDelete(id) {
      if (!id) {
        this.$message.error("无效的歌曲ID");
        return;
      }

      try {
        const res = await this.$http.delete(`/api/admin/songs/${id}`);
        if (res.code === 200) {
          this.$message.success("删除成功");
          this.fetchSongs();
        }
      } catch (error) {
        console.error("删除失败:", error);
        this.$message.error("删除失败");
      }
    },

    // 提交表单
    async handleSubmit() {
      try {
        await this.$refs.form.validate();
        this.submitting = true;

        const formData = {
          title: this.form.title,
          singer_name: this.form.singer_name,
          file_url: this.form.file_url,
          cover_image: this.form.cover_image,
        };

        if (this.editingId) {
          // 更新
          await this.$http.put(`/api/admin/songs/${this.editingId}`, formData);
          this.$message.success("更新成功");
        } else {
          // 创建
          await this.$http.post("/api/admin/songs", formData);
          this.$message.success("创建成功");
        }

        this.modalVisible = false;
        this.fetchSongs();
      } catch (error) {
        console.error("操作失败:", error);
        this.$message.error(error.message || "操作失败");
      } finally {
        this.submitting = false;
      }
    },

    // 取消
    handleCancel() {
      this.modalVisible = false;
      this.$refs.form.resetFields();
    },

    // 上传前检查
    beforeUploadImage(file) {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        this.$message.error("只能上传图片文件!");
      }
      return isImage;
    },

    // 处理封面上传
    handleCoverChange(info) {
      if (info.file.status === "done") {
        this.form.cover_image = info.file.response.data.url;
        this.$message.success("上传成功");
      } else if (info.file.status === "error") {
        this.$message.error("上传失败");
      }
    },

    // 选择音频文件
    handleAudioSelect(url) {
      this.form.file_url = url;
    },

    // 分页改变
    handleCurrentChange(page) {
      this.pagination.current = page;
      this.fetchSongs();
    },

    // 封面上传成功
    handleCoverSuccess(res) {
      this.form.cover_image = res.data.url;
      this.$message.success("上传成功");
    },

    // 封面上传失败
    handleCoverError() {
      this.$message.error("上传失败");
    },

    // 处理状态变更
    async handleStatusChange(row) {
      try {
        await this.$http.put(`/api/admin/songs/${row.id}/status`, {
          status: row.status,
        });
        this.$message.success(row.status === 1 ? "上架成功" : "下架成功");
      } catch (error) {
        console.error("更新状态失败:", error);
        this.$message.error("操作失败");
        // 恢复状态
        row.status = row.status === 1 ? 0 : 1;
      }
    },
  },
  created() {
    this.fetchSongs();
  },
};
</script>
