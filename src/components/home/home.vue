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
        <el-menu class="menu" :unique-opened="true" :router="true">
          <el-submenu v-for="item in menus" :key="item.id" :index="''+item.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item v-for="item1 in item.children" :key="item1.id" :index='"/" + item1.path'>
              <i class="el-icon-menu"></i>
              <span>{{item1.authName}}</span>
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
  data() {
    return {
      menus: []
    }
  },
  beforeCreate() {
    const token = localStorage.getItem('token')
    this.axios.defaults.headers.common['Authorization'] = token
    if (!token) {
      this.$router.push({
        name: 'login'
      })
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    //动态渲染左侧列表
    async loadData() {
      const res = await this.axios.get("menus")
      const {
        data,
        meta: {
          msg,
          status
        }
      } = res.data
      if (status === 200) {
        this.menus = data
      }
    },
    handelOut() {
      this.$message.success('退成成功')
      localStorage.clear()
      this.$router.push({
        name: 'login'
      })
    }
  }
}
</script>

<style>
.container {
  height: 100%;
}

.header {
  background-color: #b3c0d1;
}

.aside {
  background-color: #d3dce6;
}

.right {
  background-color: #e9eef3;
  /* height:100% */
}

.bg-purple-light {
  text-align: center
}

a {
  text-decoration: none;
  line-height: 60px
}
</style>
