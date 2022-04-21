<template>
  <div class="wallet-box">
    <h3 style="text-align: center">ETH钱包地址批量生成工具</h3>
    <el-container>
      <el-header>
        <el-alert
            title="此工具生成ETH钱包,生成过程中无需联网,无后台程序交互."
            type="info"
            style="margin-bottom: 10px"
            :closable="false"
            show-icon>
        </el-alert>
        <el-form :inline="true" size="small" :model="formData" ref="ruleForm">
          <el-form-item label="生成数量:" prop="num" :rules="[
            { required: true, message: '数量不能为空'}
          ]">
            <el-input v-model="formData.num" type="number" placeholder="数量" @keyup.native="keyupEvent()"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="createAddress" icon="el-icon-circle-plus" :loading="loading">一键生成
            </el-button>
            <el-button icon="el-icon-download" type="success" @click="handleDownload">导出EXCEL</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <el-table
            :data="tableData"
            stripe
            v-loading="loading"
            style="width: 100%"
            height="calc(100vh - 200px)"
        >
          <el-table-column
              prop="index"
              label="序号"
              width="100"
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
    </el-container>
  </div>
</template>

<script>
import {parseTime} from "@/utils/index.js";

var ethers = require('ethers');
import moment from 'moment'

export default {
  name: 'HelloWorld',
  data() {
    return {
      tableData: [],
      loading: false,
      downloadLoading: false,
      //表头（主要是下载excel时候使用）
      columns: [
        {label: '序号', field: 'index'},
        {label: '地址', field: 'address'},
        {label: '助记词', field: 'privateKey'},
        {label: '私钥', field: 'mnemonic'}
      ],
      formData: {
        num: 20
      }
    }
  },
  methods: {
    keyupEvent() {
      this.formData.num = this.formData.num.replace(/^(0+)|[^\d]+/g, '')
    },
    createAddress() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true
          setTimeout(() => {
            this.newAddress()
          }, 500)
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    newAddress() {
      let dataArr = []
      for (let i = 0; i < this.formData.num; i++) {
        //拿到生成的钱包信息
        const wallet = ethers.Wallet.createRandom();
        //获取助记词
        const mnemonic = wallet.mnemonic;
        //获取钱包的私钥
        const privateKey = wallet.privateKey;
        //获取钱包地址
        const address = wallet.address;
        dataArr[i] = {
          index: i + 1,
          address,
          privateKey,
          mnemonic: mnemonic.phrase
        }
      }
      this.loading = false
      this.tableData = dataArr
    },
    handleDownload() {
      this.downloadLoading = true
      let self = this
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = []
        const filterVal = []
        for (let column of self.columns) {
          tHeader.push(column.label)
          filterVal.push(column.field)
        }
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'ETH钱包批量生成' + moment().format('YYYY-MM-DD')
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.tableData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
  }
}
</script>

<style scoped>
.wallet-box {
  height: 100%;
  width: 100%;
}
</style>
