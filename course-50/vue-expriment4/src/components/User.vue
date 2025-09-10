<template>
  <div>
    <h3>用户管理区域</h3>
    <table>
        <thead>
            <tr>
                <th>编号</th>
                <th>姓名</th>
                <th>年龄</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in userlist" :key="item.id">
                <td>{{item.id}}</td>
                <td>{{item.name}}</td>
                <td>{{item.age}}</td>
                <td>
                    <a href="javascript:;" @click="goDetail(item.id)">详情</a>
                </td>
            </tr>
        </tbody>
    </table>
  </div>
</template>

<script>
export default {
    data(){
        return{
        userlist:[
            {id:1,name:"自来水",age:19},
            {id:2,name:"水蒸气",age:20},
            {id:3,name:"蒸馏水",age:20},
            {id:4,name:"矿泉水",age:88}
        ]
    }
    },
    methods: {
        goDetail(id){
            console.log(id)
            this.$router.push('/userinfo/'+id)
        }
    },
}

</script>

<style>

</style>