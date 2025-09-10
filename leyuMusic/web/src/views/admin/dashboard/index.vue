<template>
  <div class="admin-dashboard">
    <div class="page-header">
      <h2>数据概览</h2>
      <a-button type="primary" @click="fetchStats">
        <a-icon type="reload" :spin="loading" />
        刷新
      </a-button>
    </div>

    <!-- 数据卡片 -->
    <div class="stat-cards">
      <a-card class="stat-card">
        <a-statistic
          title="总用户数"
          :value="stats.users?.total"
          :loading="loading"
        >
          <template #prefix>
            <a-icon type="user" />
          </template>
        </a-statistic>
      </a-card>

      <a-card class="stat-card">
        <a-statistic
          title="歌曲总数"
          :value="stats.songs?.total"
          :loading="loading"
        >
          <template #prefix>
            <a-icon type="customer-service" />
          </template>
          <template #suffix>
            <span class="sub-stat">已上架 {{ stats.songs?.active }}</span>
          </template>
        </a-statistic>
      </a-card>

      <a-card class="stat-card">
        <a-statistic
          title="总播放量"
          :value="stats.songs?.totalPlays"
          :loading="loading"
        >
          <template #prefix>
            <a-icon type="play-circle" />
          </template>
        </a-statistic>
      </a-card>

      <a-card class="stat-card">
        <a-statistic
          title="歌单数"
          :value="stats.playlists?.total"
          :loading="loading"
        >
          <template #prefix>
            <a-icon type="folder" />
          </template>
        </a-statistic>
      </a-card>

      <a-card class="stat-card">
        <a-statistic
          title="收藏数"
          :value="stats.likes?.total"
          :loading="loading"
        >
          <template #prefix>
            <a-icon type="heart" />
          </template>
        </a-statistic>
      </a-card>

      <a-card class="stat-card">
        <a-statistic
          title="评论数"
          :value="stats.comments?.total"
          :loading="loading"
        >
          <template #prefix>
            <a-icon type="message" />
          </template>
        </a-statistic>
      </a-card>
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
      <!-- 新增用户趋势 -->
      <a-card title="新增用户趋势" :loading="loading">
        <v-chart :option="userTrendOption" autoresize />
      </a-card>

      <!-- 播放量排行 -->
      <a-card title="播放量排行TOP10" :loading="loading">
        <v-chart :option="playRankOption" autoresize />
      </a-card>
    </div>
  </div>
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart, BarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import dayjs from "dayjs";

use([
  CanvasRenderer,
  LineChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
]);

export default {
  name: "AdminDashboard",
  components: {
    VChart,
  },
  data() {
    return {
      loading: false,
      stats: {
        users: {},
        songs: {},
        playlists: {},
        likes: {},
        comments: {},
        dailyNewUsers: [],
        topSongs: [],
      },
    };
  },
  computed: {
    userTrendOption() {
      const dates = this.stats.dailyNewUsers.map((item) =>
        dayjs(item.date).format("MM-DD")
      );
      const counts = this.stats.dailyNewUsers.map((item) => item.count);

      return {
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          data: dates,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "新增用户",
            type: "line",
            smooth: true,
            data: counts,
            itemStyle: {
              color: "#1890ff",
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(24,144,255,0.3)",
                  },
                  {
                    offset: 1,
                    color: "rgba(24,144,255,0.1)",
                  },
                ],
              },
            },
          },
        ],
      };
    },
    playRankOption() {
      const songs = this.stats.topSongs || [];
      return {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
          data: songs.map((song) => song.title),
          inverse: true,
        },
        series: [
          {
            name: "播放量",
            type: "bar",
            data: songs.map((song) => song.play_count),
            itemStyle: {
              color: "#1890ff",
            },
          },
        ],
      };
    },
  },
  methods: {
    async fetchStats() {
      this.loading = true;
      try {
        const res = await this.$http.get("/api/admin/dashboard/stats");
        if (res.code === 200) {
          this.stats = res.data;
        }
      } catch (error) {
        console.error("获取数据失败:", error);
        this.$message.error("获取数据失败");
      } finally {
        this.loading = false;
      }
    },
  },
  created() {
    this.fetchStats();
  },
};
</script>

<style lang="less" scoped>
.admin-dashboard {
  padding: 24px;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    h2 {
      margin: 0;
      font-size: 24px;
    }
  }

  .stat-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
    margin-bottom: 24px;

    .stat-card {
      .sub-stat {
        font-size: 14px;
        color: #999;
        margin-left: 8px;
      }

      :deep(.ant-statistic) {
        .ant-statistic-title {
          margin-bottom: 16px;
          font-size: 16px;
        }

        .ant-statistic-content {
          font-size: 24px;
          
          .anticon {
            margin-right: 8px;
            font-size: 24px;
          }
        }
      }
    }
  }

  .charts-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
    gap: 24px;

    .ant-card {
      height: 400px;

      :deep(.ant-card-body) {
        height: calc(100% - 57px);
      }

      .echarts {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style> 