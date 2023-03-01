<template>
  <div class="agent">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
    ></Search>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="序号" type="index" align="center"/>
      <el-table-column prop="corpName" label="公司名称" />
      <el-table-column prop="accountName" label="账户名称" />
      <el-table-column prop="accountCategory" label="账户身份" />
      <el-table-column prop="operateType" label="操作类型" >
        <template slot-scope="{row}">
          <span v-if="row.operateType == 0">充值</span>  
          <span v-if="row.operateType == 1">扣费</span>  
          <span v-if="row.operateType == 2">套餐扣费</span>  
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="缴费金额（元）" />
      <el-table-column prop="balance" label="账户余额（元）" />
      <el-table-column prop="createTime" label="操作时间" >
        <template slot-scope="{row}">
          <span>{{row.createTime | dateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updateByName" label="操作人" />
      <el-table-column prop="accountCategory" label="操作人身份" />
      <el-table-column prop="remarks" label="备注" />
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
        { type: "select", label: "公司名称", key: "userId", optionData:[] },
      ],
       //搜索框数据
      searchParam: {},
      //接口地址
      searchAPI: {
        namespace: "rechargeWater",
        list: "speechRechargeLog",
        add: "post",
        edit: "put",
        detele: "delete",
      },
      isParamsNotData: false,
      submitParamsIsData: false,
      // 列表参数
      namespace: "",
      namespaceType: "Array",
    };
  },
  created() {},
  mounted() {
    this.queryCorpByCorpType()
  },
  computed: {},
  methods: {
    //获取公司下拉
    // corpType（0:商家,1:代理商,2:供应商）
    queryCorpByCorpType(corpType) {
      this.$http.select.queryCorpByCorpType({ corpType:"" }).then((res) => {
        this._setDefaultValue(
            this.searchFormConfig,
            res.data.records,
            "userId",
            "corpId",
            "corpName"
          );
        
      });
    },
  },
  watch: {},
};
</script>
<style lang="scss" scoped></style>
