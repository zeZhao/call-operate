<template>
  <!-- 账户管理 -->
  <div class="account">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="_mxCreate"
    ></Search>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      :height="tableHeight"
    >
      <el-table-column label="序号" type="index" align="center"/>
      <el-table-column prop="rateName" label="费率名称" width="120" show-overflow-tooltip/>
      <el-table-column prop="period" label="计费周期（秒）" /> 
      <el-table-column prop="unitPrice" label="单价（元）" />
      <el-table-column prop="status" label="费率状态">
        <template slot-scope="{row}">
          <span v-if="row.status == 0">禁用</span>
          <span v-if="row.status == 1">可用</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间"  show-overflow-tooltip/>
      <el-table-column prop="createrType" label="创建人类别">
        <template slot-scope="{row}">
          <span v-if="row.createrType == 0">运营</span>
          <span v-if="row.createrType == 1">代理商</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="createBy" label="创建人" /> -->
      <el-table-column prop="remarks" label="备注" />
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button
            @click="_mxEdit(scope.row, 'rateId')"
            type="text"
            size="small"
            >修改</el-button
          >
          <el-button
            @click="
              _mxDeleteItem('rateId', scope.row.rateId, false, true)
            "
            type="text"
            size="small"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <Page
      :pageObj="pageObj"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></Page>
    <el-dialog
      :title="formTit"
      :visible.sync="addChannel"
      :close-on-click-modal="false"
      top="45px"
    >
      <FormItem
        ref="formItem"
        :formConfig="formConfig"
        :btnTxt="formTit"
        @submit="_mxHandleSubmit"
        @cancel="_mxCancel"
        @choose="choose"
      ></FormItem>
    </el-dialog>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";
export default {
  mixins: [listMixin],
  components: {},
  data() {
    return {
      isParamsNotData: false,
      submitParamsIsData: false,
      // 搜索框配置
      searchFormConfig: [
        { type: "input", label: "费率名称", key: "rateName" },
        // { type: "input", label: "姓名", key: "name" },
        // // { type: "inputNum", label: "手机号", key: "mobile" },
        {
          type: "select",
          label: "状态",
          key: "status",
          optionData: [
            { key: 1, value: "可用" },
            { key: 0, value: "禁用" },
          ],
        },
        {
          type: "select",
          label: "类别",
          key: "createrType",
          optionData: [
            { key: 0, value: "运营" },
            { key: 1, value: "代理商" },
          ],
        },
        // {
        //   type: "daterange",
        //   label: "开户时间",
        //   key: ["", "submitStartTime", "submitEndTime"],
        // },
      ],
      //搜索框数据
      searchParam: {},
      //接口地址
      searchAPI: {
        namespace: "costRate",
        list: "get",
        add: "post",
        edit: "put",
        detele: "delete",
      },
      // 列表参数
      namespace: "",
      namespaceType: "Array",
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "费率名称",
          key: "rateName",
          defaultValue: "",
        },
        {
          type: "input",
          label: "计费周期（秒）",
          key: "period",
          defaultValue: "",
        },
        {
          type: "input",
          label: "单价（元）",
          key: "unitPrice",
          defaultValue: "",
        },
        {
          type: "select",
          label: "费率状态", 
          key: "status",
          defaultValue: "",
          optionData: [
            { key: 1, value: "可用" },
            { key: 0, value: "禁用" },
          ],
        },
        {
          type: "select",
          label: "创建人类别", 
          key: "createrType",
          defaultValue: "",
          optionData: [
            { key: 1, value: "代理商" },
            { key: 0, value: "运营" },
          ],
        },
        {
          type: "textarea",
          label: "备注",
          key: "remarks",
          rules:[],
          defaultValue: "",
        },
      ],
      id: "",
    };
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
  },
  watch: {},
};
</script>
<style lang="scss" scoped></style>
