<template>
  <div class="company">
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
      <el-table-column label="序号" type="index" align="center" />
      <el-table-column prop="corpName" label="公司名称" width="120" />
      <el-table-column prop="shortName" label="公司简称" />
      <el-table-column prop="corpTypename" label="类别" />
      <el-table-column prop="sells" label="销售" />
      <el-table-column prop="linkman" label="联系人" />
      <el-table-column prop="tel" label="联系电话"  width="150"/>
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="cardno" label="银行账户" />
      <el-table-column prop="address" label="地址" />
      <!-- <el-table-column prop="corpId" label="状态" /> -->
      <el-table-column prop="createTime" label="开户时间" width="150" />
      <el-table-column prop="remarks" label="备注" />
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button
            @click="_mxEdit(scope.row, 'corpId')"
            type="text"
            size="small"
            >修改</el-button
          >
          <el-button
            @click="
              _mxDeleteItem('corpId', scope.row.corpId, false, false)
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
        { type: "input", label: "公司名称", key: "corpName" },
        { type: "input", label: "销售", key: "sells" },
        // { type: "inputNum", label: "联系电话", key: "userId" },
        // {
        //   type: "select",
        //   label: "签名",
        //   key: "sign",
        //   optionData: [
        //     { key: "1", value: "有效" },
        //     { key: "2", value: "无效" },
        //   ],
        // },
        {
          type: "select",
          label: "类别",
          key: "corpType",
          optionData: [
            { key: 0, value: "商家" },
            { key: 1, value: "代理商" },
            { key: 2, value: "供应商" },
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
        namespace: "corp",
        list: "list",
        add: "save",
        edit: "save",
        detele: "delete",
      },
      // 列表参数
      namespace: "",
      namespaceType: "Array",
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "公司名称",
          key: "corpName",
          defaultValue: "",
        },
        {
          type: "input",
          label: "公司简称",
          key: "shortName",
          defaultValue: "",
        },
        {
          type: "select",
          label: "合作方类别",
          key: "corpType",
          defaultValue: "",
          optionData:[
            { key: 0, value: "商家" },
            { key: 1, value: "代理商" },
            { key: 2, value: "供应商" },
          ],
          colSpan:12
        },
        {
          type: "input",
          label: "销售",
          key: "sells",
          defaultValue: "",
          colSpan:12
        },
        {
          type: "input",
          label: "联系人",
          key: "linkman",
          defaultValue: "",
          colSpan:12
        },
        {
          type: "input",
          label: "联系电话",
          key: "tel",
          defaultValue: "",
          colSpan:12
        },
        {
          type: "input",
          label: "邮箱",
          key: "email",
          defaultValue: "",
          colSpan:12
        },
        {
          type: "input",
          label: "银行账户",
          key: "cardno",
          defaultValue: "",
          colSpan:12
        },
        {
          type: "input",
          label: "地址",
          key: "address",
          defaultValue: "",
        },
        {
          type: "textarea",
          label: "备注",
          key: "remarks",
          defaultValue: "",
          maxlength: 4000,
        },
      ],
      id: "",
    };
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {},
  watch: {},
};
</script>
<style lang="scss" scoped></style>
