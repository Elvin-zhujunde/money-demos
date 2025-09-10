<template>
      <div v-if="good">
        <div>       
          <h2>{{ good.name }}</h2>
        </div>
        <div>
          <img :src="require(`../assets/${good.image}`)" alt=""/>
          <p>{{ good.description }}</p>
          <p>价格：{{ good.price }}</p>      
          <button @click="addToCar(good)">加入购物车</button>
        </div>    
      </div>
    </template>
<script>
import {ref, onMounted} from 'vue'
import { getGoodById } from '../data/goods.js'
export default({
  props: ['id'],
  setup(props) {
    const good = ref(null);   
    onMounted(() => {
      good.value = getGoodById(Number(props.id));
    });
    return {
      good,        
    }
  },
})
</script>
    