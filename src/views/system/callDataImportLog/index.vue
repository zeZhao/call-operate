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
      
      <el-table-column prop="corpId" label="商户ID" />
      <el-table-column prop="taskId" label="任务ID" />
      <el-table-column prop="sceneId" label="IVR的ID" />
      <el-table-column prop="folder" label="批次ID" show-overflow-tooltip />
      <el-table-column prop="orgFileName" label="原始导入文件" show-overflow-tooltip/>
      <el-table-column prop="orgRecordCount" label="原始记录数" />
      <el-table-column prop="importState" label="导入状态" >
        <template slot-scope="{row}">
          <span v-if="row.importState == 0">等待导入</span>  
          <span v-if="row.importState == 1">正在导入</span>  
          <span v-if="row.importState == 2">导入成功</span>  
          <span v-if="row.importState == 9">导入失败</span>  
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="导入开始时间" >
        <template slot-scope="{row}">
          <span>{{row.startTime | dateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="导入完成时间" >
        <template slot-scope="{row}">
          <span>{{row.endTime | dateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="uploadTime" label="文件上传时间" >
        <template slot-scope="{row}">
          <span>{{row.uploadTime | dateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createBy" label="创建人" />
      <el-table-column prop="successCount" label="成功记录数" />
      <el-table-column prop="failCount" label="失败记录数" />
      <el-table-column prop="ignoreCount" label="忽略记录数" />
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
        { type: "input", label: "企业id", key: "corpId", optionData:[] },
        { type: "input", label: "批次ID", key: "folder", optionData:[] },
        { type: "input", label: "任务ID", key: "taskId", optionData:[] },
        { type: "input", label: "IVR的ID", key: "sceneId", optionData:[] },
        { type: "datetime", label: "上传时间", key: ["","startTime","endTime"] },
      ],
       //搜索框数据
      searchParam: {},
      //接口地址
      searchAPI: {
        namespace: "logs",
        list: "callDataImportLog",
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
