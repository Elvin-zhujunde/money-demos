<template>
  <div class="home">
    <search-bar />
    <category-nav />
    <banner-carousel />
    <hot-products />
  </div>
</template>

<script setup>
import SearchBar from '@/components/home/SearchBar.vue'
import CategoryNav from '@/components/home/CategoryNav.vue'
import BannerCarousel from '@/components/home/BannerCarousel.vue'
import HotProducts from '@/components/home/HotProducts.vue'
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>
