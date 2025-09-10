<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTravelStore } from '../store/travel'
import DestinationCard from '../components/DestinationCard.vue'

const store = useTravelStore()
const { destinations } = storeToRefs(store)

onMounted(async () => {
  await store.fetchDestinations()
})

const handleViewDetails = (destination) => {
  // 这里可以添加查看详情的逻辑，比如导航到详情页
  console.log('查看详情:', destination)
}
</script>

<template>
  <div class="destinations">
    <h1>目的地列表</h1>
    <el-row :gutter="20">
      <el-col 
        v-for="destination in destinations" 
        :key="destination.id"
        :xs="24"
        :sm="12"
        :md="8"
      >
        <DestinationCard
          :destination="destination"
          @view-details="handleViewDetails"
        />
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.destinations {
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
}
</style> 