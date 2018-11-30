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
        <el-button type="primary" plain>添加商品</el-button>
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
      pagesize: 2,
      total: -1
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      const res = await this.axios.get(`goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
      console.log(res)
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
        this.total = data.total
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
