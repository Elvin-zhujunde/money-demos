<template>
  <div class="banner-carousel">
    <el-carousel height="300px">
      <el-carousel-item v-for="banner in banners" :key="banner.id">
        <img :src="banner.image" :alt="banner.title" class="banner-image" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
// import axios from "axios";
import banerImg from "./1.png";
import banerImg1 from "./2.png";
const banners = ref([
  {
    id: 1,
    title: "Banner 1",
    image: banerImg,
    link: "/",
  },
  {
    id: 2,
    title: "Banner 2",
    image: banerImg1,
    link: "/",
  },
]);

// const fetchBanners = async () => {
//   try {
//     const { data } = await axios.get("/api/banners");
//     banners.value = data;
//   } catch (error) {
//     console.error("获取轮播图失败:", error);
//   }
// };

onMounted(() => {
  // fetchBanners()
});
</script>

<style scoped>
.banner-carousel {
  margin: 20px 0;
}
.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
