import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login.vue'
import Home from '@/components/home/home.vue'
import Users from '@/components/user/users.vue'
import Rights from '@/components/roles/rights.vue'
import Roles from '@/components/roles/roles.vue'
import Goods from '@/components/goods/goodslist.vue'
import GoodsAdd from '@/components/goods/goodsAdd.vue'
Vue.use(Router)
const {Message}=()=>'element-ui'
const router = new Router({
  routes: [
    {
      name:'login',
      path: '/login',
      component:Login
    },{
      name:'home',
      path:'/home',
      component:Home,
      children:[{
        name:'users',
        path:'/users',
        component:Users
      },{
        name:'rights',
        path:'/rights',
        component:Rights
      },{
        name:'roles',
        path:'/roles',
        component:Roles
      },{
        name:'goods',
        path:'/goods',
        component:Goods
      },{
        name:'add',
        path:'/add',
        component:GoodsAdd
      }]
    }
  ]
})
//路由的前置守卫
router.beforeEach((to,from,next)=>{
  if(to.name==="login"){
    next()
  } else {
    const token = localStorage.getItem('token')
    if(!token){
      router.push({name:'login'})
      Message.warning('请先登录')
      return
    }else {
      next()
    }
  }
})
export default router
