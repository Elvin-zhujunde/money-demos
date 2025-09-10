import { createRouter,createWebHistory } from "vue-router";
import User from "../components/User.vue"
import Goods from "../components/Goods.vue"
import Userinfo from "../components/UserInfo.vue"
import goodDetail from "../components/goodDetail.vue"
import goodCar from "../components/goodCar.vue";

const routes=[
    {path:"/users",name:"user",component:User},
    {path:"/goods",name:"goods",component:Goods},
    {path:"/userinfo/:id",name:"userinfo",component:Userinfo,props:true},
    {path:"/good/:id",name:"goodDetail",component:goodDetail,props:true},
    {path:"/cars",name:"goodCar",component:goodCar}
];

const router=createRouter({
    history:createWebHistory(),
    routes
})
export default router;