<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 按钮 -->
    <el-button type="primary" plain class="btn">添加用户</el-button>
    <!-- 表格 -->
    <template>
      <el-table :data="rightsList" style="width: 100%">
        <el-table-column  label="#" width="100" type="index">
        </el-table-column>
        <el-table-column prop="authName" label="权限名称" width="200">
        </el-table-column>
        <el-table-column prop="path" label="路径" width="200">
        </el-table-column>
        <el-table-column prop="level" label="层级" width="200">
        </el-table-column>
      </el-table>
    </template>
  </el-card>

</template>

<script>
export default {
    data(){
        return{
            rightsList:[]
        }
    },
    created(){
        this.loadData()
    },
    methods:{
        async loadData(){
            const res = await this.axios.get(`rights/:list`)
            console.log(res)
        }
    }
}
</script>

<style>
.btn {
  margin-top: 15px
}
</style>
