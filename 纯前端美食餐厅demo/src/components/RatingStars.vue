<template>
  <div class="rating-wrapper">
    <el-rate 
      v-model="rating" 
      :disabled="disabled"
      :colors="colors"
      :show-text="showText"
      :texts="['差', '一般', '好', '很好', '非常好']"
    />
    <span v-if="showScore" class="score">{{ rating }}分</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  disabled: {
    type: Boolean,
    default: true
  },
  showText: {
    type: Boolean,
    default: false
  },
  showScore: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue'])

const rating = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const colors = ['#F7BA2A', '#F7BA2A', '#F7BA2A']
</script>

<style scoped>
.rating-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.score {
  color: #F7BA2A;
  font-weight: bold;
}
</style> 