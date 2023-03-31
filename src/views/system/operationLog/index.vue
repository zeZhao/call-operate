<template>
  <div class="agent">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
    ></Search>
    <el-table :data="listData" border highlight-current-row style="width: 100%" :height="tableHeight">
      <el-table-column label="序号" type="index" align="center" />
      <el-table-column prop="serverType" label="项目类型">
        <template slot-scope="{ row }">
          <span v-if="row.serverType == 1">运营端</span>
          <span v-if="row.serverType == 2">商户端</span>
          <span v-if="row.serverType == 3">代理商端</span>
        </template>
      </el-table-column>
      <el-table-column prop="logType" label="日志类型">
        <template slot-scope="{ row }">
          <span v-if="row.logType == 1">正常日志</span>
          <span v-if="row.logType == 2">异常日志</span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="操作类型">
        <template slot-scope="{ row }">
          <span v-if="row.type == 1">新增</span>
          <span v-if="row.type == 2">删除</span>
          <span v-if="row.type == 3">修改</span>
          <span v-if="row.type == 4">导出</span>
          <span v-if="row.type == 5">登录</span>
          <span v-if="row.type == 6">登出</span>
          <span v-if="row.type == 7">新增OR修改</span>
          <span v-if="row.type == 8">其他</span>
        </template>
      </el-table-column>
      <el-table-column prop="module" label="操作模块" />
      <el-table-column prop="remark" label="操作描述" />
      <el-table-column prop="requParam" label="请求参数" show-overflow-tooltip/>
      <el-table-column prop="respParam" label="返回参数" show-overflow-tooltip/>
      <el-table-column prop="excName" label="异常名称" show-overflow-tooltip/>
      <el-table-column prop="excMessage" label="异常信息" show-overflow-tooltip/>
      <el-table-column prop="operatorId" label="操作人ID" />
      <el-table-column prop="operatorName" label="操作人名称" />
      <el-table-column prop="method" label="操作方法" show-overflow-tooltip />
      <el-table-column prop="requUrl" label="请求地址url" />
      <el-table-column prop="requIp" label="请求ip" />
      <el-table-column prop="createTime" label="创建时间" >
        <template slot-scope="{row}">
          <span>{{row.createTime | dateTime}}</span>
        </template>
      </el-table-column>
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
        {
          type: "input",
          label: "操作人名称",
          key: "operatorName",
          optionData: [],
        },
        {
          type: "select",
          label: "项目类型",
          key: "serverType",
          optionData: [
            { key: "1", value: "运营端" },
            // { key: "2", value: "商户端" },
            // { key: "3", value: "代理商端" },
          ],
        },
        {
          type: "select",
          label: "日志类型",
          key: "logType",
          optionData: [
            { key: "1", value: "正常日志" },
            { key: "2", value: "异常日志" },
          ],
        },
        {
          type: "select",
          label: "操作类型",
          key: "type",
          optionData: [
            { key: "1", value: "新增" },
            { key: "2", value: "删除" },
            { key: "3", value: "修改" },
            { key: "4", value: "导出" },
            { key: "5", value: "登录" },
            { key: "6", value: "登出" },
            { key: "7", value: "新增OR修改" },
            { key: "8", value: "其他" },
          ],
        },
      ],
      //搜索框数据
      searchParam: {},
      //接口地址
      searchAPI: {
        namespace: "logs",
        list: "operationLog",
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
    this.queryCorpByCorpType();
  },
  activated(){
    this.queryCorpByCorpType();
  },
  computed: {},
  methods: {
    //获取公司下拉
    // corpType（0:商家,1:代理商,2:供应商）
    queryCorpByCorpType(corpType) {
      this.$http.select.queryCorpByCorpType({ corpType: "" }).then((res) => {
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
