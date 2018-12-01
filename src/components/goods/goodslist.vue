<template>
  <el-card>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row class="inputSearch">
      <el-col :span="24">
        <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="primary" plain @click="$router.push({name:'add'})">添加商品</el-button>
      </el-col>
    </el-row>
    <!-- 表单 -->
    <el-table :data="goodsList" style="width: 100%">
      <el-table-column label="#" width="60" type="index">
      </el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="350">
      </el-table-column>
      <el-table-column prop="goods_price" label="商品价值" width="150">
      </el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width="150">
      </el-table-column>
      <el-table-column prop="add_time" label="创建日期" width="150">
        <template slot-scope="scope">
          {{scope.row.create_time|fmtDate('YYYY-MM-DD')}}
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" icon="el-icon-edit" circle></el-button>
          <el-button type="danger" plain size="mini" icon="el-icon-delete" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum" 
      :page-sizes="[5, 10, 15,20 ]" 
      :page-size="pagesize" 
      layout="total, sizes, prev, pager, next, jumper" 
      :total="total">
    </el-pagination>
  </el-card>

</template>

<script>
export default {
  data() {
    return {
      goodsList: [],
      formData: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        add_time: ''
      },
      query: '',
      pagenum: 1,
      pagesize: 5,
      total: -1
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    //分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize=val
      this.loadData()

    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum=val
      this.loadData()
    },
    //获取数据
    async loadData() {
      const res = await this.axios.get(`goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
      const {
        data,
        meta: {
          msg,
          status
        }
      } = res.data
      if (status === 200) {
        this.goodsList = res.data.data.goods
        this.$message.success(msg)
        this.total =res.data.data.total
      }
    }
  }
}
</script>

<style>
.input-with-select {
  width: 300px;
}

.inputSearch {
  margin-top: 15px;
}
</style>
