<template>
  <div class="agent">
    <!-- <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
    ></Search> -->
    <h4 class="textLeft margin10">下表是语音充值记录</h4>
    <el-table
      :data="listData1"
      border
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="序号" type="index" align="center"/>
      <el-table-column prop="corpName" label="公司名称" />
      <el-table-column prop="userName" label="账户名称" />
      <el-table-column prop="userType" label="账户身份" />
      <el-table-column prop="corpId" label="操作类型" />
      <el-table-column prop="corpId" label="缴费金额（元）" />
      <el-table-column prop="corpId" label="账户余额（元）" />
      <el-table-column prop="corpId" label="操作时间" />
      <el-table-column prop="corpId" label="操作人" />
      <el-table-column prop="corpId" label="操作人身份" />
      <el-table-column prop="corpId" label="备注" />
    </el-table>
    <h4 class="textLeft margin10">下表是短信充值记录</h4>
    <el-table
      :data="listData2"
      border
      highlight-current-row
      style="width: 100%"
      :height="tableHeight"
    >
      <el-table-column label="序号" type="index" align="center"/>
      <el-table-column prop="corpId" label="公司名称" />
      <el-table-column prop="corpId" label="账户名称" />
      <el-table-column prop="corpId" label="账户身份" />
      <el-table-column prop="corpId" label="账户身份" />
      <el-table-column prop="corpId" label="操作类型" />
      <el-table-column prop="corpId" label="缴费金额（元）" />
      <el-table-column prop="corpId" label="充值数量（条）" />
      <el-table-column prop="corpId" label="短信余额（条）" />
      <el-table-column prop="corpId" label="操作时间" />
      <el-table-column prop="corpId" label="操作人" />
      <el-table-column prop="corpId" label="操作人身份" />
      <el-table-column prop="corpId" label="备注" />
    </el-table>
    <Page
      :pageObj="pageObj"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></Page>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";
export default {
  mixins: [listMixin],
  components: {},
  data() {
    return {
      // 搜索框配置
      searchFormConfig: [
        { type: "input", label: "公司名称", key: "corpName" },
        { type: "input", label: "账户名称", key: "corpNames" },
        // { type: "inputNum", label: "联系电话", key: "userId" },
        { type: "select", label: "签名", key: "sign",optionData:[{key:'1',value:"有效"},{key:'2',value:"无效"},] },
        { type: "select", label: "类别", key: "signs",optionData:[{key:'1',value:"商家"},{key:'2',value:"代理商"},{key:'3',value:"供应商"},] },
        {
          type: "daterange",
          label: "有效时间",
          key: ["", "submitStartTime", "submitEndTime"]
        },
        {
          type: "daterange",
          label: "开户时间",
          key: ["", "submitStartTime1", "submitEndTime1"]
        },
      ],
      listData1:[],
      listData2:[]
    };
  },
  created() {},
  mounted() {
    this.getSmsRechargeLog()
    this.getSpeechRechargeLog()
  },
  computed: {},
  methods: {
    getSmsRechargeLog(){
      this.$http.rechargeWater.smsRechargeLog({}).then(res=>{
        this.listData2 = res.data.list
      })
    },
    getSpeechRechargeLog(){
      this.$http.rechargeWater.speechRechargeLog({}).then(res=>{
        this.listData1 = res.data.list
      })
    }
  },
  watch: {},
};
</script>
<style lang="scss" scoped></style>
