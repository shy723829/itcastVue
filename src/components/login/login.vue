<template>
    <div class="form-wrap">
        <el-form label-position="top" label-width="80px" :model="formdata" class="from-data">
            <h2>用户登录</h2>
            <el-form-item label="用户名">
                <el-input v-model="formdata.username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="formdata.password"></el-input>
            </el-form-item>
            <el-button @click.prevent="handelLogin()" class="from-btn" type="primary">登录</el-button>
        </el-form>
    </div>
</template>

<script>
export default {
    data(){
        return {
            formdata:{
                username:'',
                password:''
            }
        }
    },
    methods:{
       async handelLogin(){
           const res = await this.axios.post('login',this.formdata)
                console.log(res)
                const{meta:{msg,status},data}=res.data
                if(status===200) {
                    const token = localStorage.setItem('token',data.token)
                    this.$router.push({name:'home'})
                    //提示登录成功
                    this.$message.success(msg)
                }else{
                    this.$message.error(msg)
                }
        }
    }
};
</script>

<style>
.form-wrap{
    background-color:#324152;
    height:100%;
    display:flex;
    justify-content:center;
    align-items:center
}
.from-data{
    width:400px;
    background-color:#fff;
    border-radius:5px;
    padding:30px
}
.from-btn{
    width:100%
}
</style>
