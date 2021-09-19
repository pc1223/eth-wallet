<template>
  <div>
    <h3 style="text-align: center">ETH钱包地址批量生成工具</h3>
    <p style="text-align: center;font-size: 12px;color: red">可断网离线生成</p>
    <el-container>
      <el-header>
        <el-form :inline="true" :model="formInline" ref="ruleForm">
          <el-form-item label="生成数量:" prop="num" :rules="[
            { required: true, message: '数量不能为空'}
          ]">
            <el-input v-model="formInline.num" type="number" placeholder="数量" @keyup.native="keyupEvent()"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="createAddress" :loading="loading">一键生成</el-button>
            <el-button type="danger" @click="resetForm('ruleForm')" :disabled="loading">重置表单</el-button>
          </el-form-item>
          <el-form-item>
            <download-excel
                class = "export-excel-wrapper"
                :data = "tableData"
                :fields = "json_fields"
                title="ETH钱包批量生成"
                :name = "fileName">
              <el-button type="success">导出EXCEL</el-button>
            </download-excel>
<!-- moment().format();-->
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <el-table
            :data="tableData"
            stripe
            style="width: 100%"
        >
          <el-table-column
             prop="index"
              label="序号"
             width="80"
          >
          </el-table-column>
          <el-table-column
              prop="address"
              label="地址"
          >
          </el-table-column>
          <el-table-column
              prop="privateKey"
              label="私钥"
          >
          </el-table-column>
          <el-table-column
              prop="mnemonic"
              label="助记词"
          >
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>

      </el-footer>
    </el-container>
  </div>
</template>

<script>
var ethers = require('ethers');
import moment from 'moment'
export default {
  name: 'HelloWorld',
  data() {
    return {
      tableData: [],
      loading:false,
      fileName:'ETH钱包批量生成'+moment().format('YYYY-MM-DD')+'.xls',
      formInline: {
        num: 20,
      },
      json_fields: {
        '序号':'index',
        "地址": "address",
        "私钥": "privateKey",
        "助记词": "mnemonic",
      }
    }
  },
  methods: {
    keyupEvent() {
      this.formInline.num = this.formInline.num.replace(/^(0+)|[^\d]+/g, '')
    },
    createAddress() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading=true
          setTimeout(()=>{
            this.newAddress()
          },500)
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    newAddress() {
      let dataArr =[]
      for (let i = 0; i < this.formInline.num; i++) {

        //拿到生成的钱包信息
        const wallet = ethers.Wallet.createRandom();

        //获取助记词
        const mnemonic = wallet.mnemonic;
        console.log("钱包助记词：",mnemonic.phrase)

        //获取钱包的私钥
        const privateKey = wallet.privateKey;
        console.log("钱包私钥：",privateKey)

        //获取钱包地址
        const address = wallet.address;
        console.log("钱包地址：",address)
        dataArr[i]={
          index:i+1,
          address,
          privateKey,
          mnemonic:mnemonic.phrase
        }
      }
      this.loading=false
      this.tableData=dataArr
    },
    resetForm() {
      this.formInline.num = null
      this.$refs.ruleForm.resetFields();

    }
  }
}
</script>

<style scoped>
div{
  height: 100%;
}
</style>
