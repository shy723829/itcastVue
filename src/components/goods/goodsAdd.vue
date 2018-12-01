<template>
  <el-card>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品添加</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 提示框 -->
    <el-alert title="添加商品信息" type="success" center show-icon class="alert">
    </el-alert>
    <!-- 步骤条 -->
    <el-steps :active="active*1" finish-status="success" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- tabs选项卡 -->
    <el-form label-position="top" label-width="80px" :model="form">
      <el-tabs @tab-click="handleTabClick" tab-position="left" style="height: 400px; overflow:auto" calss="tabs" v-model="active">
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <!-- 级联选择器 -->
          <el-cascader placeholder="试试搜索：指南" :options="options" :props="defaultsProps" v-model="selectedOption" expand-trigger="hover" @change="handelchange">
          </el-cascader>

        </el-tab-pane>
        <el-tab-pane name="2" label="商品参数">
          <el-form-item v-for="(item,i) in dynamicsParams" :key="i" :label="item.attr_name">
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox :label="item1" border v-for="(item1,index) in item.attr_vals" :key="index"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="3" label="商品属性">
          <el-form-item v-for="(item,i) in goodscs" :key="i" :label="item.attr_name">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="4" label="商品图片">
          <el-upload class="upload-demo" action="http://localhost:8888/api/private/v1/upload" :headers="headers" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileListtwo" :on-success="handelsuccess" list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane name="5" label="商品内容">
          <el-button type="primary">添加商品</el-button>
          <el-form-item >
            <quill-editor v-model="form.goods_introduce"></quill-editor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import {
  quillEditor
} from 'vue-quill-editor'
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      active: "1",
      form: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_introduce:'',
        // 第一个tab - 基本信息 - 级联选择器 v-model所绑定的数据
        goods_cat: '', // 以为','分割的分类列表	不能为空
        // pic:[] [每个图片临时路径的对象 {pic:临时路径}]
        pics: [], // 上传的图片临时路径（对象）	可以为空
        // 动态参数+静态参数的部分数据
        attrs: '' //商品的参数（数组）	可以为空
      },
      options: [],
      selectedOption: [],
      defaultsProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      dynamicsParams: [],
      attr_vals: [],
      goodscs: [],
      fileListtwo: [],
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    //文件上传
    handleRemove(file, fileList) {
      console.log(file, fileList);
      let index = this.form.pics.findIndex((item) => {
        return item.pics === file.response.data.tmp_path
      })
      this.form.pics.splice(index, 1)
      // console.log(this.form.pics)
    },
    handlePreview(file) {
      //   console.log(file);
    },
    handelsuccess(file) {
      // console.log(file)
      this.form.pics.push({
        pic: file.data.tmp_path
      })
    },
    //tab切换
    async handleTabClick() {
      if (this.active === "2" || this.active === "3") {
        if (this.selectedOption.length !== 3) {
          this.$message.warning('请选择三级分类')
          return
        }
      }
      const sel = this.active === '2' ? 'many' : 'only'
      const res = await this.axios.get(`categories/${this.selectedOption[2]}/attributes?sel=${sel}`)
      console.log(res)
      if (this.active === '2') {
        this.dynamicsParams = res.data.data
        this.dynamicsParams.forEach((item) => {
          item.attr_vals = item.attr_vals.trim().split(',')
        })
      } else if (this.active === '3') {
        this.goodscs = res.data.data
      }
    },
    handelchange() {
      if (this.selectedOption.length !== 3) {
        this.$message.warning('请选择三级分类')
        this.selectedOption.length === 0
      }
    },
    //获取商品数据列表
    async loadData() {
      const res = await this.axios.get(`categories?type=3`)
      this.options = res.data.data
    }
  }
}
</script>

<style>
.alert {
  margin-top: 15px
}

.el-tabs {
  margin-top: 10px
}
.ql-editor{
    min-height:200px
}
</style>
