<template>
  <div>
    <h3>商品管理区域</h3>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>名称</th>
                <th>价格</th>
                <th>图片</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="good in goodData" :key="good.id">
                <td>{{ good.id }}</td>
                <td>{{ good.name }}</td>
                <td>{{ good.price }}</td>
                <td><img width="30px" height="30px" :src="require(`../assets/${good.image}`)"/></td>
                <td><router-link :to="'/good/'+good.id">详情</router-link></td>
            </tr>
        </tbody>
    </table>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {goods} from '../data/goods.js'
const goodData = ref(goods)
</script>


<style>

</style>