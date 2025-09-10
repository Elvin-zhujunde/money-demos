<template>
  <div class="profile">
    <!-- 用户信息头部 -->
    <div class="user-header">
      <div class="avatar">
        <img
          :src="userInfo.avatar || require('@/assets/default-avatar.png')"
          alt="avatar"
        />
      </div>
      <div class="info">
        <h2 class="nickname">{{ userInfo.nickname }}</h2>
        <div class="meta">
          <span class="gender">
            <i :class="genderIcon"></i>
          </span>
        </div>
        <p class="signature">
          {{ userInfo.signature || "这个人很懒，什么都没有写~" }}
        </p>
        <div class="stats">
          <div class="stat-item">
            <div class="count">{{ createdPlaylistsCount }}</div>
            <div class="label">创建的歌单</div>
          </div>
          <div class="stat-item">
            <div class="count">{{ collectedPlaylistsCount }}</div>
            <div class="label">收藏的歌单</div>
          </div>
          <div class="stat-item">
            <div class="count">{{ userInfo.likedSongsCount || 0 }}</div>
            <div class="label">喜欢的音乐</div>
          </div>
        </div>
      </div>
      <div class="actions" v-if="isCurrentUser">
        <a-button type="primary" @click="handleEdit">编辑资料</a-button>
      </div>
    </div>

    <!-- 歌单列表 -->
    <div class="playlist-section">
      <h3>创建的歌单</h3>
      <div class="playlist-grid">
        <div
          v-for="playlist in userInfo.createdPlaylists"
          :key="playlist.id"
          class="playlist-card"
          @click="goToPlaylist(playlist.id)"
        >
          <div class="cover">
            <img :src="playlist.cover_image" :alt="playlist.name" />
            <div class="play-count">
              <i class="icon-play"></i>
              {{ formatCount(playlist.songCount) }}
            </div>
          </div>
          <div class="name">{{ playlist.name }}</div>
          <div class="song-count">{{ playlist.songCount }}首</div>
        </div>
      </div>
    </div>

    <div class="playlist-section">
      <h3>收藏的歌单</h3>
      <div class="playlist-grid">
        <div
          v-for="playlist in userInfo.collectedPlaylists"
          :key="playlist.id"
          class="playlist-card"
          @click="goToPlaylist(playlist.id)"
        >
          <div class="cover">
            <img :src="playlist.cover_image" :alt="playlist.name" />
            <div class="play-count">
              <i class="icon-play"></i>
              {{ formatCount(playlist.songCount) }}
            </div>
          </div>
          <div class="name">{{ playlist.name }}</div>
          <div class="song-count">{{ playlist.songCount }}首</div>
        </div>
      </div>
    </div>

    <!-- 编辑资料弹窗 -->
    <a-modal
      :visible="editModalVisible"
      title="编辑个人资料"
      @ok="handleEditSubmit"
      @cancel="editModalVisible = false"
      :confirmLoading="submitting"
    >
      <a-form :model="editForm">
        <a-form-item label="头像">
          <a-upload
            name="file"
            :show-upload-list="false"
            :before-upload="beforeAvatarUpload"
            @change="handleAvatarChange"
            accept="image/*"
          >
            <img v-if="imageUrl" :src="imageUrl" alt="avatar" width="128" height="128" />
            <div v-else>
              <a-button> <a-icon type="upload" /> 上传头像</a-button>
            </div>
          </a-upload>
        </a-form-item>

        <a-form-item label="昵称">
          <a-input v-model="editForm.nickname" />
        </a-form-item>

        <a-form-item label="性别">
          <a-radio-group v-model="editForm.gender">
            <a-radio :value="1">男</a-radio>
            <a-radio :value="2">女</a-radio>
            <a-radio :value="0">保密</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="个性签名">
          <a-textarea v-model="editForm.signature" :rows="4" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "UserProfile",
  data() {
    return {
      userInfo: {},
      editModalVisible: false,
      submitting: false,
      imageUrl: "",
      editForm: {
        nickname: "",
        gender: 0,
        signature: "",
        avatar: "",
      },
    };
  },
  computed: {
    isCurrentUser() {
      return (
        JSON.parse(localStorage.getItem("userInfo"))?.id ===
        Number(this.$route.params.id)
      );
    },
    genderIcon() {
      switch (this.userInfo.gender) {
        case 1:
          return "iconfont icon-male";
        case 2:
          return "iconfont icon-female";
        default:
          return "";
      }
    },
    createdPlaylistsCount() {
      return this.userInfo.createdPlaylists?.length || 0;
    },
    collectedPlaylistsCount() {
      return this.userInfo.collectedPlaylists?.length || 0;
    },
  },
  methods: {
    formatCount(count) {
      if (count >= 10000) {
        return (count / 10000).toFixed(1) + "万";
      }
      return count;
    },
    async fetchUserInfo() {
      try {
        const res = await this.$http.get(
          `/api/user/info/${this.$route.params.id}`
        );
        if (res.code === 200) {
          this.userInfo = res.data;
        }
      } catch (error) {
        console.error(error);
        this.$message.error("获取用户信息失败");
      }
    },
    handleEdit() {
      this.editForm = {
        nickname: this.userInfo.nickname,
        gender: this.userInfo.gender,
        signature: this.userInfo.signature,
        avatar: this.userInfo.avatar,
      };
      this.editModalVisible = true;
    },
    beforeAvatarUpload(file) {
      const isImage = file.type.startsWith("image/");
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isImage) {
        this.$message.error("只能上传图片文件!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("图片大小不能超过 2MB!");
        return false;
      }

      return false;
    },
    async handleAvatarChange({ file }) {
      console.log(file);
      if (file.status !== "uploading") {
        try {
          const formData = new FormData();
          formData.append("file", file);

          const res = await this.$http.post(
            "/api/admin/users/upload/avatar",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          debugger
          if (res.code === 200) {
            this.editForm.avatar = res.data.url;
            this.imageUrl = res.data.url;
            this.$message.success("头像上传成功");
          }
        } catch (error) {
          console.error("上传头像失败:", error);
          this.$message.error("上传头像失败");
        }
      }
    },
    async handleEditSubmit() {
      try {
        this.submitting = true;
        const res = await this.$http.put("/api/user/info", {
          nickname: this.editForm.nickname,
          gender: this.editForm.gender,
          signature: this.editForm.signature,
          avatar: this.editForm.avatar,
        });

        if (res.code === 200) {
          this.$message.success("更新成功");
          this.editModalVisible = false;
          this.userInfo = res.data;
          localStorage.setItem("userInfo", JSON.stringify(this.userInfo));
          window.location.reload();
        }
      } catch (error) {
        console.error(error);
        this.$message.error("更新失败");
      } finally {
        this.submitting = false;
      }
    },
    goToPlaylist(id) {
      this.$router.push(`/playlist/${id}`);
    },
  },
  created() {
    this.fetchUserInfo();
  },
};
</script>

<style lang="less" scoped>
.profile {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: #333;

  .user-header {
    display: flex;
    padding: 30px;
    background: #000;
    border-radius: 8px;
    margin-bottom: 20px;
    color: #fff;

    .avatar {
      width: 200px;
      height: 200px;
      margin-right: 30px;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
      }
    }

    .info {
      flex: 1;

      .nickname {
        font-size: 24px;
        margin-bottom: 10px;
        color: #fff;
      }

      .meta {
        margin-bottom: 10px;

        .gender,
        .level {
          margin-right: 10px;
          color: rgba(255, 255, 255, 0.8);
        }
      }

      .signature {
        color: rgba(255, 255, 255, 0.6);
        margin-bottom: 20px;
      }

      .stats {
        display: flex;

        .stat-item {
          margin-right: 40px;
          text-align: center;

          .count {
            font-size: 20px;
            font-weight: bold;
            color: #fff;
          }

          .label {
            color: rgba(255, 255, 255, 0.6);
          }
        }
      }
    }

    .actions {
      .ant-btn-primary {
        background: transparent;
        border-color: #fff;

        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      }
    }
  }

  .playlist-section {
    margin-bottom: 40px;

    h3 {
      font-size: 20px;
      margin-bottom: 20px;
      color: #000;
    }

    .playlist-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 20px;

      .playlist-card {
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          transform: translateY(-5px);

          .cover {
            &::after {
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.3);
              border-radius: 8px;
            }
          }
        }

        .cover {
          position: relative;
          padding-top: 100%;
          margin-bottom: 8px;

          img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 8px;
          }

          .play-count {
            position: absolute;
            bottom: 5px;
            right: 5px;
            color: #fff;
            font-size: 12px;
          }
        }

        .name {
          font-size: 14px;
          margin-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .song-count {
          font-size: 12px;
          color: #666;
        }
      }
    }
  }

  .avatar-uploader {
    text-align: center;

    .avatar-preview {
      width: 128px !important;
      height: 128px !important;
      border-radius: 50% !important;
      object-fit: cover !important;
      cursor: pointer !important;
    }

    .avatar-upload-placeholder {
      width: 128px;
      height: 128px;
      border-radius: 50%;
      background: #fafafa;
      border: 1px dashed #d9d9d9;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #999;

      &:hover {
        border-color: #000;
        color: #000;
      }

      .anticon {
        font-size: 24px;
        margin-bottom: 8px;
      }
    }
  }
}
</style>
