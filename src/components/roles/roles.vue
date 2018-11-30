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
          <!-- 一级权限 -->
          <el-row class="level1" v-for="item1 in scope.row.children" :key="item1.id">
            <el-col :span="4">
              <el-tag closable @close="handelClose(scope.row,item1.id)">
                {{item1.authName}}
              </el-tag>
            </el-col>
            <el-col :span="20">
              <el-row class="level2" v-for="item2 in item1.children" :key="item2.id">
                <!-- 二级权限 -->
                <el-col :span="4">
                  <el-tag closable type="success" @close="handelClose(scope.row,item2.id)">
                    {{item2.authName}}
                  </el-tag>
                </el-col>
                <!-- 三级权限 -->
                <el-col :span="20">
                  <el-tag closable @close="handelClose(scope.row,item3.id)" type="warning" class="level3" v-for="item3 in item2.children" :key="item3.id">
                    {{item3.authName}}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <!-- 权限为空时 -->
          <span v-if="scope.row.children.length===0">
              未分配权限
            </span>
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
          <el-button @click="rightsPlay(scope.row)" type="success" plain size="mini" icon="el-icon-check" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹框 -->
    <el-dialog title="收货地址" :visible.sync="rightsdialogFormVisible">
      <!-- 
        :default-expanded-keys="[2, 3]" 
        :default-checked-keys="[5]"
       -->
      <el-tree :data="rightsTree" ref=tree :default-expanded-keys="expendList" :default-checked-keys="checkedList" show-checkbox node-key="id" :props="defaultProps" default-expand-all>
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rightsdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="getRolesRights()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      rightsdialogFormVisible: false,
      rightsTree: {},
      defaultProps: {
        children: "children",
        label: "authName"
      },
      currentRolesId: -1,
      checkedList: [],
      expendList:[]
    }
  },
  created() {
    this.loadRoles()
  },
  methods: {
    //角色授权
    async getRolesRights(){
      // console.log(this.currentRolesId)
      let getCheckedAll = this.$refs.tree.getCheckedKeys()
      let getHalfCheckedAll = this.$refs.tree.getHalfCheckedKeys()
      let keysAll=[...getCheckedAll,...getHalfCheckedAll]
      const res = await this.axios.post(`roles/${this.currentRolesId}/rights`,{
        rids:keysAll.join(',')
      })
      console.log(res)
      const{data,meta:{msg,status}}=res.data
      if(status===200){
        this.$message.success(msg)
        this.rightsdialogFormVisible=false
        this.loadRoles()
      }else{
        this.$message.error(msg)
      }
    },
    //角色权限展示
    async rightsPlay(rights) {
      this.currentRolesId=rights.id
      const res = await this.axios.get("rights/tree")
      // console.log(res)
      const {
        data,
        meta: {
          msg,
          status
        }
      } = res.data
      if (status === 200) {
        this.rightsTree = data
        this.$message.success(msg)
        this.currentRolesId = rights.id
        const arr = []
        this.rightsTree.forEach((item1) => {
          item1.children.forEach((item2) => {
            item2.children.forEach((item3) => {
              arr.push(item3.id)
            })
          })
        })
        this.expendList = arr

        //获取角色权限
        const arr1 = []
        rights.children.forEach((item1)=>{
          item1.children.forEach((item2)=>{
            item2.children.forEach((item3)=>{
              arr1.push(item3.id)
            })
          })
        })
        this.checkedList=arr1
        this.rightsdialogFormVisible = true
      } else {
        this.$message.error(msg)
      }
    },
    //权限管理关闭
    async handelClose(roles, rightsId) {
      const res = await this.axios.delete(`roles/${roles.id}/rights/${rightsId}`)
      console.log(res)
      const {
        meta: {
          msg,
          status
        },
        data
      } = res.data
      if (status === 200) {
        this.$message.success(msg)
        roles.children = data
      } else {
        this.$message.error(msg)
      }
    },
    // 查询角色
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
