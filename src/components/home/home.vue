<template>
    <el-container class="container">
        <el-header class="header">
            <el-row>
                <el-col :span="4">
                    <img src="@/assets/logo.png" alt="图片无法正常载入">
                </el-col>
                <el-col :span="19">
                    <div class="grid-content bg-purple-light">
                        <h3>电商后台管理系统</h3>
                    </div>
                </el-col>
                <el-col :span="1">
                    <div class="grid-content bg-purple">
                        <a @click.prevent="handelOut()">退出</a>
                    </div>
                </el-col>
            </el-row>
        </el-header>
        <el-container>
            <el-aside width="200px" class="aside">
                <el-menu :default-openeds="['1', '3']" :router="true">
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>用户管理</span>
                        </template>
                            <el-menu-item index="users">
                                 <template slot="title">
                                    <i class="el-icon-menu"></i>
                                    <span>用户列表</span>
                                </template>
                        </el-menu-item>
                    </el-submenu>
                    <el-submenu index="2">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>权限管理</span>
                        </template>
                        <el-menu-item index="2-1">
                          <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>角色列表</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item index="rights">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>权限列表</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                    <el-submenu index="3">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>商品管理</span>
                        </template>
                        <el-menu-item index="3-1">
                           <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>商品列表</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item index="3-2">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>分类参数</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item index="3-3">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>商品分类</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                    <el-submenu index="4">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>订单管理</span>
                        </template>
                        <el-menu-item index="4-1">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>订单列表</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                    <el-submenu index="5">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>数据统计</span>
                        </template>
                            <el-menu-item index="5-1">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>数据报表</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main class="right">
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    beforeCreate(){
        const token = localStorage.getItem('token')
        if(!token){
            this.$router.push({name:'login'})
        }
    },
    methods:{
        handelOut(){
            this.$message.success('退成成功')
            localStorage.clear()
            this.$router.push({name:'login'})
        }
    }
}
</script>

<style>
.container{
    height:100%;
}
.header{
     background-color: #b3c0d1;
}
.aside{
     background-color: #d3dce6;
}
.right{
    background-color: #e9eef3;
    /* height:100% */
}
.bg-purple-light{
    text-align: center
}
a{
    text-decoration:none;
    line-height:60px
}
</style>
