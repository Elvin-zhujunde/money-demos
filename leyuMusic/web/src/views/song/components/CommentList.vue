<template>
  <div>
    <div class="card-header">
      <h2>评论</h2>
      <span class="comment-count"
        >共 {{ (comments && comments.length) || 0 }} 条评论</span
      >
    </div>
    <div class="comment-list">
      <!-- 评论输入框 -->
      <div class="comment-input" v-if="isLogin">
        <a-textarea
          v-model="commentContent"
          :rows="3"
          placeholder="写下你的评论..."
          :maxLength="200"
        />
        <div class="input-footer">
          <span class="count">{{ commentContent.length }}/200</span>
          <a-button type="primary" @click="submitComment" :loading="submitting">
            发布评论
          </a-button>
        </div>
      </div>
      <div v-else class="login-tip">
        <a-button type="link" @click="$emit('login')">登录后发表评论</a-button>
      </div>

      <!-- 评论列表 -->
      <div class="comments">
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <img
            :src="comment.user_avatar || 'https://picsum.photos/200/200'"
            class="avatar"
          />
          <div class="content">
            <div class="info">
              <span class="nickname">{{ comment.user_nickname }}</span>
              <span class="time">{{ formatTime(comment.created_at) }}</span>
            </div>
            <div class="text">{{ comment.content }}</div>
            <div class="actions">
              <a-button
                v-if="canDelete(comment)"
                type="link"
                class="delete-btn"
                @click="deleteComment(comment)"
              >
                删除
              </a-button>
            </div>
          </div>
        </div>

        <!-- 加载更多 -->
        <div class="load-more" v-if="hasMore">
          <a-button type="link" @click="loadMore" :loading="loading">
            加载更多
          </a-button>
        </div>

        <!-- 无评论时显示 -->
        <div v-if="!comments.length" class="empty">暂无评论，快来抢沙发~</div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";

dayjs.extend(relativeTime);
dayjs.locale("zh-cn");

export default {
  name: "CommentList",
  props: {
    songId: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {
      comments: [],
      commentContent: "",
      page: 1,
      pageSize: 20,
      total: 0,
      loading: false,
      submitting: false,
    };
  },
  computed: {
    hasMore() {
      return this.comments.length < this.total;
    },
    isLogin() {
      return !!localStorage.getItem("userInfo");
    },
    userInfo() {
      return JSON.parse(localStorage.getItem("userInfo"));
    },
  },
  methods: {
    async fetchComments(page = 1) {
      try {
        this.loading = true;
        const res = await this.$http.get(`/api/songs/${this.songId}/comments`, {
          params: {
            page,
            pageSize: this.pageSize,
          },
        });
        if (res.code === 200) {
          if (page === 1) {
            this.comments = res.data.list;
          } else {
            this.comments.push(...res.data.list);
          }
          this.total = res.data.total;
        }
      } catch (error) {
        console.error("获取评论失败:", error);
      } finally {
        this.loading = false;
      }
    },

    async submitComment() {
      if (!this.commentContent.trim()) {
        return this.$message.warning("请输入评论内容");
      }

      try {
        this.submitting = true;
        const res = await this.$http.post(
          `/api/songs/${this.songId}/comments`,
          {
            content: this.commentContent,
          }
        );
        
        if (res.code === 200) {
          this.$message.success("评论成功");
          this.commentContent = "";
          this.fetchComments(1);
        }
      } catch (error) {
        console.error("发表评论失败:", error);
        this.$message.error("发表评论失败");
      } finally {
        this.submitting = false;
      }
    },

    async deleteComment(comment) {
      this.$msgbox({
        title: "确定删除这条评论吗？",
        message: "删除后不可恢复",
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "执行中...";
            setTimeout(async () => {
              try {
                const res = await this.$http.delete(
                  `/api/songs/${this.songId}/comments/${comment.id}`
                );
                if (res.code === 200) {
                  this.$message.success("删除成功");
                  this.fetchComments(1);
                }
              } catch (error) {
                if (error) {
                  console.error("删除评论失败:", error);
                  this.$message.error("删除评论失败");
                }
              }
              done();
              setTimeout(() => {
                instance.confirmButtonLoading = false;
              }, 300);
            }, 300);
          } else {
            done();
          }
        },
      }).then(async (action) => {});
    },

    loadMore() {
      this.page++;
      this.fetchComments(this.page);
    },

    formatTime(time) {
      return dayjs(time).fromNow();
    },

    canDelete(comment) {
      return (
        this.userInfo?.id === comment.user_id || this.userInfo?.role === "admin"
      );
    },
  },
  created() {
    this.fetchComments();
  },
};
</script>

<style lang="less" scoped>
.comment-list {
  padding: 20px;

  .comment-input {
    margin-bottom: 24px;

    .input-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px;

      .count {
        color: #999;
      }
    }
  }

  .login-tip {
    text-align: center;
    padding: 20px;
    color: #999;
  }

  .comment-item {
    display: flex;
    padding: 16px 0;
    border-bottom: 1px solid #f0f0f0;

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 16px;
    }

    .content {
      flex: 1;

      .info {
        margin-bottom: 8px;

        .nickname {
          font-weight: 500;
          margin-right: 8px;
        }

        .time {
          color: #999;
          font-size: 12px;
        }
      }

      .text {
        line-height: 1.6;
        margin-bottom: 8px;
      }

      .actions {
        .delete-btn {
          color: #999;
          padding: 0;

          &:hover {
            color: #ff4d4f;
          }
        }
      }
    }
  }

  .load-more {
    text-align: center;
    padding: 20px 0;
  }

  .empty {
    text-align: center;
    padding: 40px 0;
    color: #999;
  }
}
</style>
