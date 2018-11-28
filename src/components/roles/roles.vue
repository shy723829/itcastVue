<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 按钮 -->
    <el-button type="primary" plain class="btn">添加角色</el-button>
    <!-- 表格s -->
    <el-table :data="rolesList" style="width: 100%">
      <el-table-column type="expand" label="#" width="80">
        <template slot-scope="scope">
          <el-row class="level1" v-for="item1 in scope.row.children" :key="item1.id">
            <el-col :span="4">
              <el-tag >
                {{item1.authName}}
              </el-tag>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180">
      </el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="180">
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button @click="editFormData(scope.row)" type="primary" plain size="mini" icon="el-icon-edit" circle></el-button>
          <el-button @click="deleUser(scope.row.id)" type="danger" plain size="mini" icon="el-icon-delete" circle></el-button>
          <el-button @click="roleCheck(scope.row)" type="success" plain size="mini" icon="el-icon-check" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      rolesList: []
    }
  },
  created() {
    this.loadRoles()
  },
  methods: {
    async loadRoles() {
      var AUTH_TOKEN = localStorage.getItem('token')
      this.axios.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res = await this.axios.get('roles')
      this.rolesList = res.data.data
    }
  }
}
</script>

<style>
.btn {
  margin-top: 15px
}
</style>
