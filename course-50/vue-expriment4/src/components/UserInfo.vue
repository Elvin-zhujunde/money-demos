<template>
  <div>
    <h5>用户详情页 ---用户id为：{{ id }}</h5>
    <button @click="goback()">后退</button>
  </div>
</template>

<script>
export default {
    props:['id'],
    methods:{
        goback(){
            this.$router.go(-1)
        }
    }

}
</script>

<style>

</style>