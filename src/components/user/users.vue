<template>
  <el-card class="card-box">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row>
      <el-col :span="24">
        <div class="grid-content bg-purple-dark">
          <div style="margin-top: 15px;">
            <el-input placeholder="请输入关键词" v-model="query" clearable class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click.prevent="checkkey()"></el-button>
            </el-input>
            <el-button type="primary" @click.prevent="dialogFormVisible=true">添加用户</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="userList" style="width: 100%">
      <el-table-column label="#" width="50" type="index">
      </el-table-column>
      <el-table-column prop="username" label="姓名" width="100">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="180">
      </el-table-column>
      <el-table-column prop="mobile" label="电话" width="200">
      </el-table-column>
      <el-table-column prop="create_time" label="创建日期">
        <template slot-scope="scope">
          {{scope.row.create_time|fmtDate('YYYY-MM-DD')}}
        </template>
      </el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch @change="handelSwitchChange(scope.row)" v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button @click="editFormData(scope.row)" type="primary" plain size="mini" icon="el-icon-edit" circle></el-button>
          <el-button @click="deleUser(scope.row.id)" type="danger" plain size="mini" icon="el-icon-delete" circle></el-button>
          <el-button @click="roleCheck(scope.row)" type="success" plain size="mini" icon="el-icon-check" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block">
      <el-pagination class="pagebox" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[2, 4, 6, 8]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 添加用户 -->
    <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
      <el-form :model="formData">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="formData.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="adduser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户 -->
    <el-dialog title="收货地址" :visible.sync="EditdialogFormVisible">
      <el-form :model="formData">
        <el-form-item label="用户名" prop="username">
          <el-input disabled v-model="formData.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="formData.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="EditdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="edituser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="RoledialogFormVisible">
      <el-form label-width="100px">
        <el-form-item label="用户名">
          {{currentName}}
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="currentRoleId">
            <el-option label="请选择" :value="-1"></el-option>
            <el-option v-for="(item,i) in roles" :key="i" :value="item.id" :label="item.roleName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="RoledialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleChange()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      userList: [],
      query: '',
      pagenum: 1,
      pagesize: 2,
      total: 0,
      is_active: true,
      dialogFormVisible: false,
      dialogVisible: false,
      EditdialogFormVisible: false,
      RoledialogFormVisible: false,
      formData: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      currentName: '',
      currentRoleId: -1,
      currentUserId: -1,
      roles: {},
    }
  },

  mounted() {
    this.getData()
  },
  methods: {
    //角色授权
    async editRoleChange() {
      const res = await this.axios.put(`users/${this.currentUserId}/role`, {
        rid: this.currentRoleId
      })
      const {
        data,
        meta: {
          msg,
          status
        }
      } = res.data
      if (status === 200) {
        this.$message.success(msg)
        this.RoledialogFormVisible = false
      } else {
        this.$message.error(msg)
      }
    },
    // 获取角色
    async roleCheck(user) {
      this.RoledialogFormVisible = true
      this.currentName = user.username
      this.currentUserId = user.id
      const res = await this.axios.get('roles')
      const {
        data,
        meta: {
          msg,
          status
        }
      } = res.data
      this.roles = data
      this.axios.get(`users/${user.id}`)
        .then(res => {
          this.currentRoleId = res.data.data.rid
        })

    },
    //修改用户信息
    async edituser() {
      const res = await this.axios.put(`users/${this.formData.id}`, this.formData)
      const {
        data,
        meta: {
          msg,
          status
        }
      } = res.data
      if (status === 200) {
        this.EditdialogFormVisible = false
        this.$message.success(msg)
        this.formData = {}
      }
    },
    //编辑用户
    async editFormData(user) {
      this.EditdialogFormVisible = true
      this.formData.mobile = user.mobile
      this.formData.email = user.email
      this.formData.username = user.username
      this.formData.id = user.id
    },
    //删除用户
    deleUser(id) {
      this.$confirm('确定删除该用户？', '删除用户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.axios.delete(`users/${id}`)
        console.log(res)
        const {
          meta: {
            status,
            msg
          }
        } = res.data
        if (status === 200) {
          this.$message.success(msg)
          this.getData()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //添加用户
    async adduser() {
      const res = await this.axios.post('users', this.formData)
      // console.log(res)
      const {
        meta: {
          msg,
          status
        },
        data
      } = res.data
      if (status === 201) {
        this.getData()
        this.formData = {}
        this.dialogFormVisible = false
      }
    },
    // 用户状态
    async handelSwitchChange(user) {
      const res = await this.axios.put(`users/${user.id}/state/${user.mg_state}`)
      const {
        data,
        meta: {
          msg,
          status
        }
      } = res.data
      if (status === 200) {
        this.$message.success(msg)
      } else {
        this.$message.error(msg)
      }
    },
    // 根据关键词搜索
    checkkey() {
      this.getData()
      this.query = ''
    },
    // 分页
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.getData()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getData()
    },
    // 获取列表数据
    getData() {
      var AUTH_TOKEN = localStorage.getItem('token')
      this.axios.defaults.headers.common['Authorization'] = AUTH_TOKEN
      this.axios.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
        .then((res) => {
          const {
            data: {
              total,
              pagenum,
              users
            },
            meta: {
              msg,
              status
            }
          } = res.data
          if (status === 200) {
            this.userList = users
            this.total = total
            this.$message.success(msg)
          }
        })
    }
  }
}
</script>

<style>
.input-with-select {
  width: 300px
}

.pagebox {
  text-align: center;
  margin-top: 10px;
}
</style>
