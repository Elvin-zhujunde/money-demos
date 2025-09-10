<script setup>
import { computed } from 'vue'

const props = defineProps({
  destination: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['view-details'])

const formattedPrice = computed(() => {
  return `¥${props.destination.price.toLocaleString()}`
})
</script>

<template>
  <el-card class="destination-card" v-highlight>
    <img :src="destination.image" class="destination-image">
    <div class="destination-info">
      <h3>{{ destination.name }}</h3>
      <p>{{ destination.description }}</p>
      <div class="price">{{ formattedPrice }}</div>
      <el-button type="primary" @click="$emit('view-details', destination)">
        查看详情
      </el-button>
    </div>
  </el-card>
</template>

<style scoped>
.destination-card {
  margin-bottom: 20px;
  transition: transform 0.3s;
}

.destination-card:hover {
  transform: translateY(-5px);
}

.destination-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.destination-info {
  padding: 15px;
}

.price {
  font-size: 1.2em;
  color: #409EFF;
  margin: 10px 0;
}
</style> 