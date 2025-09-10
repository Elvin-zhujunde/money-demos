<template>
      <div>
        <h3>购物车</h3>
        <table>
            <thead>
                <tr><th>ID</th><th>名称</th><th>价格</th><th>图片</th><th>数量</th></tr>
            </thead>
            <tbody>
                <tr v-for="good in goodData" :key="good.id">
                    <td>{{good.id}}</td>
                    <td>{{good.name}}</td>
                    <td>{{good.price}}</td>
                    <td><img width="30px" height="30px" :src="require(`../assets/${good.image}`)"/></td>
                    <td>1</td>
                </tr>
            </tbody>
            <tfoot class="footer">
                <span>总计：120 元</span> <button>结算</button>
            </tfoot>
        </table>
      </div>
    </template>
<script setup>
import{ref} from "vue"
import{cargoods} from '../data/goods.js'
const goodData=ref(cargoods)
</script>
    