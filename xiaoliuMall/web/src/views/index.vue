<template>
  <div class="home">
    <!-- 导航栏 -->
    <div class="nav-categories">
      <div class="container">
        <div class="nav-list">
          <div class="nav-item" v-for="nav in mainNavs" :key="nav.id">
            {{ nav.name }}
          </div>
        </div>
      </div>
    </div>

    <!-- 轮播图 -->
    <div class="banner">
      <el-carousel height="600px" :interval="5000">
        <el-carousel-item v-for="banner in banners" :key="banner.id">
          <div class="banner-content">
            <img :src="banner.image_url" :alt="banner.title" @click="toRouter(banner.link_url)" />
            <!-- <div class="banner-info">
              <h1>{{ banner.title }}</h1>
              <p>{{ banner.description }}</p>
              <el-button type="primary" @click="toRouter(banner.link_url)">立即选购</el-button>
            </div> -->
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 商品分类 -->
    <div class="categories">
      <div class="container">
        <div class="section-header">
          <h2>精选分类</h2>
        </div>
        <div class="category-grid">
          <div 
            class="category-item"
            v-for="category in categories"
            :key="category.id"
            @click="handleCategoryClick(category)"
          >
            <div class="category-img">
              <img :src="category.icon" :alt="category.name" />
            </div>
            <div class="category-info">
              <h3>{{ category.name }}</h3>
              <span class="explore">探索更多</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 热门商品 -->
    <div class="hot-products">
      <div class="container">
        <div class="section-header">
          <h2>热门单品</h2>
          <el-button type="text">查看全部</el-button>
        </div>
        <div class="product-grid">
          <div 
            class="product-card" 
            v-for="product in hotProducts" 
            :key="product.id"
            @click="toProductDetail(product.id)"
          >
            <div class="product-img">
              <img :src="product.cover" :alt="product.title" />
              <div class="quick-shop">
                <el-button type="primary" round>快速购买</el-button>
              </div>
            </div>
            <div class="product-info">
              <div class="product-title">{{ product.title }}</div>
              <div class="product-price">
                <span class="current-price">¥{{ product.price }}</span>
                <span class="original-price" v-if="product.original_price">¥{{ product.original_price }}</span>
              </div>
            </div>
          </div>
        </div>
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
      mainNavs: [
        { id: 1, name: '新品上市' },
        { id: 2, name: '男装' },
        { id: 3, name: '女装' },
        { id: 4, name: '儿童' },
      ]
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
  background-color: #fff;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.nav-categories {
  background: #f5f5f5;
  border-bottom: 1px solid #eee;
}

.nav-list {
  display: flex;
  justify-content: center;
  padding: 15px 0;
}

.nav-item {
  padding: 0 25px;
  font-size: 16px;
  cursor: pointer;
  position: relative;
}

.nav-item:hover {
  color: #000;
}

.nav-item:hover::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #000;
}

.banner {
  width: 100%;
  margin-bottom: 60px;
}

.banner-content {
  position: relative;
  height: 100%;
}

.banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-info {
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
  max-width: 500px;
}

.banner-info h1 {
  font-size: 48px;
  margin-bottom: 20px;
}

.banner-info p {
  font-size: 18px;
  margin-bottom: 30px;
}

.categories {
  padding: 60px 0;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-header h2 {
  font-size: 32px;
  font-weight: 600;
  margin: 0;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  padding: 0 20px;
}

.category-item {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
}

.category-img {
  width: 100%;
  height: 400px;
  overflow: hidden;
}

.category-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.category-item:hover .category-img img {
  transform: scale(1.1);
}

.category-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30px;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  color: #fff;
}

.category-info h3 {
  font-size: 24px;
  margin: 0 0 10px 0;
}

.explore {
  font-size: 14px;
  opacity: 0.8;
}

.hot-products {
  padding: 60px 0;
  background: #f8f8f8;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  padding: 20px 0;
}

.product-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  border: 1px solid #f0f0f0;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.08);
}

.product-img {
  position: relative;
  width: 100%;
  height: 360px;
  overflow: hidden;
  background: #f7f7f7;
}

.product-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card:hover .product-img img {
  transform: scale(1.08);
}

.quick-shop {
  position: absolute;
  bottom: -62px;
  left: 0;
  right: 0;
  padding: 20px;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-top: 1px solid rgba(0,0,0,0.05);
}

.product-card:hover .quick-shop {
  bottom: 0;
}

.product-info {
  padding: 24px;
  position: relative;
}

.product-title {
  font-size: 16px;
  color: #333;
  margin-bottom: 12px;
  height: 44px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-weight: 500;
  line-height: 1.4;
}

.product-price {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.current-price {
  font-size: 22px;
  font-weight: 600;
  color: #111;
  font-family: 'Arial', sans-serif;
}

.original-price {
  font-size: 15px;
  color: #999;
  text-decoration: line-through;
}

:deep(.el-button--primary) {
  background-color: #000;
  border-color: #000;
  padding: 12px 36px;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.5px;
  border-radius: 30px;
  transition: all 0.3s ease;
}

:deep(.el-button--primary:hover) {
  background-color: #333;
  border-color: #333;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.15);
}

:deep(.el-carousel__indicators) {
  bottom: 30px;
}

:deep(.el-carousel__button) {
  width: 30px;
  height: 3px;
  border-radius: 0;
}
</style>
<style></style>