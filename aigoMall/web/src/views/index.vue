<template>
  <div class="home">
    <!-- 轮播图 -->
    <div class="banner">
      <el-carousel height="400px">
        <el-carousel-item v-for="banner in banners" :key="banner.id">
          <img @click="toRouter(banner.link_url)" :src="banner.image_url" :alt="banner.title" />
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 商品分类 -->
    <div class="categories">
      <div class="section-header">
        <h2>商品分类</h2>
        <el-button type="text" @click="$router.push('/category')"
          >查看全部 ></el-button
        >
      </div>
      <div class="category-list">
        <div class="category-scroll">
          <div
            class="category-item"
            v-for="category in categories"
            :key="category.id"
            @click="handleCategoryClick(category)"
          >
            <div class="category-img">
              <img :src="category.icon" :alt="category.name" />
            </div>
            <div class="category-name">{{ category.name }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 热门商品 -->
    <div class="hot-products">
      <div class="section-header">
        <h2>每日特惠</h2>

      </div>
      <div class="product-list">
        <el-row :gutter="20">
          <el-col :span="6" v-for="product in hotProducts" :key="product.id">
            <div class="product-card" @click="toProductDetail(product.id)">
              <div class="product-img">
                <img :src="product.cover" :alt="product.title" />
              </div>
              <div class="product-info">
                <div class="product-title">{{ product.title }}</div>
                <div class="product-sales">已售 {{ product.sales }}</div>
                <div class="price-row">
                  <div class="price">
                    <span class="old-price">{{
                      "¥" + product.original_price
                    }}</span>
                    <span class="currency">¥</span>
                    <span class="amount">{{ product.price }}</span>
                  </div>
                  <el-button size="small" type="primary" round>
                    <i class="el-icon-shopping-cart-2"></i>
                    购买
                  </el-button>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      banners: [],
      categories: [],
      hotProducts: [],
    };
  },
  created() {
    this.fetchBanners();
    this.fetchCategories();
    this.fetchHotProducts();
  },
  methods: {
    toRouter(url) {
      this.$router.push(url);
    },
    async fetchBanners() {
      try {
        const res = await this.$axios.get("/api/banners");
        if (res.code === 200) {
          this.banners = res.data;
        }
      } catch (error) {
        console.error("获取轮播图失败:", error);
        this.$message.error("获取轮播图数据失败");
      }
    },
    async fetchCategories() {
      try {
        const res = await this.$axios.get("/api/categories");
        if (res.code === 200) {
          this.categories = res.data.filter(category => category.parent_id == 0);
        }
      } catch (error) {
        console.error("获取分类失败:", error);
        this.$message.error("获取分类数据失败");
      }
    },
    async fetchHotProducts() {
      try {
        const res = await this.$axios.get("/api/products/hot");
        if (res.code === 200) {
          this.hotProducts = res.data;
        }
      } catch (error) {
        console.error("获取热门商品失败:", error);
        this.$message.error("获取热门商品数据失败");
      }
    },
    handleCategoryClick(category) {
      this.$router.push({
        path: "/category",
        query: {
          categoryId: category.id,
        },
      });
    },
    toProductDetail(id) {
      this.$router.push(`/product/${id}`);
    },
  },
};
</script>

<style scoped>
.home {
  width: 100%;
}

.banner {
  width: 100%;
  margin-bottom: 30px;
}

.banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.categories,
.hot-products {
  width: 1200px;
  margin: 0 auto;
  padding: 20px 0;
}

.category-list {
  position: relative;
  margin: 20px 0;
  overflow: hidden;
}

.category-scroll {
  display: flex;
  overflow-x: auto;
  padding: 10px 0;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.category-scroll::-webkit-scrollbar {
  display: none;
}

.category-item {
  flex: 0 0 auto;
  width: 120px;
  margin-right: 20px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s;
}

.category-img {
  width: 80px;
  height: 80px;
  margin: 0 auto 8px;
  border-radius: 8px;
  overflow: hidden;
}

.category-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-name {
  font-size: 14px;
  color: #333;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 5px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 24px;
  font-weight: 500;
  color: #333;
  margin: 0;
}

.product-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-img {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.product-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .product-img img {
  transform: scale(1.05);
}

.product-info {
  padding: 12px;
}

.product-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.4;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-sales {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.old-price {
  color: #999;
  font-size: 12px;
  text-decoration: line-through;
}

.price {
  color: #ff6b35;
}

.price .currency {
  font-size: 12px;
  margin-right: 2px;
}

.price .amount {
  font-size: 20px;
  font-weight: bold;
}

.el-button--small {
  padding: 6px 12px;
}

.el-button [class*="el-icon-"] + span {
  margin-left: 4px;
}
</style>
