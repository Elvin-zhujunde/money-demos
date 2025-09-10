<template>
  <div class="admin-playlists">
    <div class="page-header">
      <h2>歌单管理</h2>
    </div>

    <!-- 搜索和过滤 -->
    <div class="toolbar">
      <div class="left">
        <el-input
          v-model="keyword"
          placeholder="搜索歌单名称或创建者"
          prefix-icon="el-icon-search"
          clearable
          @clear="handleSearch"
          @keyup.enter.native="handleSearch"
          style="width: 300px"
        />
      </div>

    </div>

    <!-- 歌单列表 -->
    <el-table
      :data="playlists"
      v-loading="loading"
      style="width: 100%"
    >
      <!-- 歌单信息 -->
      <el-table-column label="歌单信息" min-width="400">
        <template slot-scope="{row}">
          <div class="playlist-info">
            <el-image 
              :src="row.cover_image || 'https://picsum.photos/200/200'"
              fit="cover"
              class="cover"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
            <div class="details">
              <div class="name">{{ row.name }}</div>
              <div class="meta">
                <span class="creator">
                  <i class="el-icon-user"></i>
                  {{ row.creator_name }}
                </span>
                <span class="date">
                  <i class="el-icon-date"></i>
                  {{ formatTime(row.created_at) }}
                </span>
              </div>
              <div class="description">{{ row.description || '暂无描述' }}</div>
            </div>
          </div>
        </template>
      </el-table-column>

      <!-- 统计信息 -->
      <el-table-column label="统计数据" width="280">
        <template slot-scope="{row}">
          <div class="stats">
            <div class="stat-item">
              <i class="el-icon-headset"></i>
              <span>{{ formatCount(row.play_count) }}次播放</span>
            </div>
            <div class="stat-item">
              <i class="el-icon-document"></i>
              <span>{{ row.song_count }}首歌曲</span>
            </div>
            <div class="stat-item">
              <i class="el-icon-star-on"></i>
              <span>{{ row.collect_count }}次收藏</span>
            </div>
          </div>
        </template>
      </el-table-column>



      <!-- 操作 -->
      <el-table-column label="操作" width="200" fixed="right">
        <template slot-scope="{row}">
          <el-button
            type="text"
            size="small"
            @click="goToDetail(row.id)"
          >
            <i class="el-icon-view"></i>
          </el-button>
          <el-button
            type="text"
            size="small"
            @click="showEditModal(row)"
          >
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button
            type="text"
            size="small"
            @click="toggleStatus(row)"
          >
            <i :class="row.status === 1 ? 'el-icon-close' : 'el-icon-check'"></i>
          </el-button>
          <el-button
            type="text"
            size="small"
            class="danger"
            @click="handleDelete(row)"
          >
            <i class="el-icon-delete"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.current"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
      >
      </el-pagination>
    </div>

    <!-- 编辑弹窗 -->
    <el-dialog
      :title="editingPlaylist ? '编辑歌单' : '创建歌单'"
      :visible.sync="editModalVisible"
      width="600px"
    >
      <el-form 
        :model="editForm"
        :rules="rules"
        ref="editForm"
        label-width="80px"
      >
        <el-form-item label="封面">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleCoverChange"
            accept="image/*"
          >
            <img 
              v-if="editForm.cover_image" 
              :src="editForm.cover_image" 
              class="avatar"
            >
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="名称" prop="name">
          <el-input 
            v-model="editForm.name"
            placeholder="请输入歌单名称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="描述">
          <el-input 
            type="textarea"
            v-model="editForm.description"
            placeholder="请输入歌单描述"
            :rows="4"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

      </el-form>
      <div slot="footer">
        <el-button @click="editModalVisible = false">取消</el-button>
        <el-button type="primary" @click="handleEditSubmit" :loading="submitting">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.admin-playlists {
  padding: 24px;

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .playlist-info {
    display: flex;
    align-items: flex-start;
    
    .cover {
      width: 80px;
      height: 80px;
      border-radius: 4px;
      margin-right: 16px;
    }

    .details {
      flex: 1;
      min-width: 0;

      .name {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 8px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .meta {
        display: flex;
        gap: 16px;
        color: #666;
        font-size: 12px;
        margin-bottom: 8px;

        i {
          margin-right: 4px;
        }
      }

      .description {
        color: #999;
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .stats {
    .stat-item {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      color: #666;

      i {
        margin-right: 8px;
        font-size: 16px;
      }
    }
  }

  .avatar-uploader {
    :deep(.el-upload) {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;

      &:hover {
        border-color: #409EFF;
      }
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }

    .avatar {
      width: 178px;
      height: 178px;
      display: block;
      object-fit: cover;
    }

    .el-upload__tip {
      font-size: 12px;
      color: #909399;
      margin-top: 8px;
    }
  }

  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }

  .danger {
    color: #F56C6C;
  }
}
</style>

<script>
import dayjs from 'dayjs';

export default {
  name: 'AdminPlaylists',
  data() {
    return {
      loading: false,
      playlists: [],
      keyword: '',
      status: '',
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      editModalVisible: false,
      editingPlaylist: null,
      submitting: false,
      editForm: {
        name: '',
        description: '',
        cover_image: '',
        status: 1
      },
      rules: {
        name: [
          { required: true, message: '请输入歌单名称', trigger: 'blur' },
          { max: 50, message: '名称不能超过50个字符', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    formatTime(time) {
      return dayjs(time).format('YYYY-MM-DD HH:mm');
    },
    async fetchPlaylists() {
      this.loading = true;
      try {
        const res = await this.$http.get('/api/admin/playlists', {
          params: {
            keyword: this.keyword,
            page: this.pagination.current,
            pageSize: this.pagination.pageSize
          }
        });
        if (res.code === 200) {
          this.playlists = res.data.list;
          this.pagination.total = res.data.total;
        }
      } catch (error) {
        console.error('获取歌单列表失败:', error);
        this.$message.error('获取歌单列表失败');
      } finally {
        this.loading = false;
      }
    },
    handleSearch() {
      this.pagination.current = 1;
      this.fetchPlaylists();
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.fetchPlaylists();
    },
    handleCurrentChange(val) {
      this.pagination.current = val;
      this.fetchPlaylists();
    },
    showEditModal(playlist) {
      this.editingPlaylist = playlist;
      this.editForm = {
        name: playlist.name,
        description: playlist.description,
        cover_image: playlist.cover_image,
        status: playlist.status
      };
      this.editModalVisible = true;
    },
    async handleEditSubmit() {
      try {
        this.submitting = true;
        const res = await this.$http.put(
          `/api/admin/playlists/${this.editingPlaylist.id}`,
          this.editForm
        );
        if (res.code === 200) {
          this.$message.success('更新成功');
          this.editModalVisible = false;
          this.fetchPlaylists();
        }
      } catch (error) {
        console.error('更新失败:', error);
        this.$message.error(error.response?.data?.message || '更新失败');
      } finally {
        this.submitting = false;
      }
    },
    async handleDelete(playlist) {
      try {
        await this.$confirm({
          title: '确认删除',
          content: '确定要删除该歌单吗？删除后无法恢复。',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消'
        });

        const res = await this.$http.delete(`/api/admin/playlists/${playlist.id}`);
        if (res.code === 200) {
          this.$message.success('删除成功');
          this.fetchPlaylists();
        }
      } catch (error) {
        if (error) {
          console.error('删除失败:', error);
          this.$message.error(error.response?.data?.message || '删除失败');
        }
      }
    },
    async handleCoverChange(file) {
      // 文件类型检查
      const isImage = file.raw.type.startsWith('image/');
      if (!isImage) {
        this.$message.error('只能上传图片文件!');
        return;
      }

      // 文件大小检查
      const isLt2M = file.raw.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 2MB!');
        return;
      }

      try {
        const formData = new FormData();
        formData.append('file', file.raw);

        const res = await this.$http.post('/api/admin/songs/upload/cover', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (res.code === 200) {
          this.editForm.cover_image = res.data.url;
          this.$message.success('封面上传成功');
        }
      } catch (error) {
        console.error('上传封面失败:', error);
        this.$message.error('上传封面失败');
      }
    },
    formatCount(count) {
      if (!count) return '0';
      return count >= 10000 ? (count / 10000).toFixed(1) + '万' : count;
    },
    goToDetail(id) {
      this.$router.push(`/playlist/${id}`);
    },
    async toggleStatus(playlist) {
      try {
        const res = await this.$http.put(`/api/admin/playlists/${playlist.id}`, {
          ...playlist,
          status: playlist.status === 1 ? 0 : 1
        });
        
        if (res.code === 200) {
          this.$message.success(playlist.status === 1 ? '已禁用' : '已启用');
          this.fetchPlaylists();
        }
      } catch (error) {
        console.error('操作失败:', error);
        this.$message.error('操作失败');
      }
    }
  },
  created() {
    this.fetchPlaylists();
  }
};
</script> 