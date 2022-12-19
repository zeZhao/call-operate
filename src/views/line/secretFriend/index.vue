<template>
<!-- 号码管理 -->
  <div class="secretFriend">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="_mxCreate"
    >
    <template slot="other">
        <el-button type="primary" @click="allocation">分配号码</el-button>
        <el-button type="primary" @click="_mxCreate">新增号码</el-button>
        <el-button type="primary" @click="deteleNum">删除</el-button>
        <el-button type="primary" @click="exportNum">导出Excel</el-button>
      </template>
    </Search>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      :height="tableHeight"
       @selection-change="handleSelectionChange"
    >
      <el-table-column label="选择" type="selection" align="center" />
      <el-table-column prop="corpId" label="供应商名称" />
      <el-table-column prop="corpId" label="线路名称" />
      <el-table-column prop="corpId" label="号码归属地区" />
      <el-table-column prop="corpId" label="运营商" />
      <el-table-column prop="corpId" label="运营商号码" />
      <el-table-column prop="corpId" label="号码月租成本（元）" />
      <el-table-column prop="corpId" label="号码状态" />
      <el-table-column prop="corpId" label="使用商家" />
      <el-table-column prop="corpId" label="商家账户" />
      <el-table-column prop="corpId" label="路由类型" />
      <el-table-column prop="corpId" label="流程名称" />
      <!-- <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button
            @click="_mxEdit(scope.row, 'templateId')"
            type="text"
            size="small"
            >修改</el-button
          >
          <el-button
            @click="
              _mxDeleteItem('templateId', scope.row.templateId, false, true)
            "
            type="text"
            size="small"
            >删除
          </el-button>
        </template>
      </el-table-column> -->
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
      ></FormItem>
    </el-dialog>
    <el-dialog
      title="分配号码"
      :visible.sync="allocationVisible"
      :close-on-click-modal="false"
      top="45px"
    >
      <FormItem
        ref="allocationForm"
        :formConfig="allocationConfig"
        btnTxt="确定"
        @submit="submitAllocation"
        @cancel="cancelAllocation"
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
      // 搜索框配置
      searchFormConfig: [
        {
          type: "select",
          label: "供应商名称",
          key: "sign",
          optionData: [
            { key: "1", value: "有效" },
            { key: "2", value: "无效" },
          ],
        },
        {
          type: "select",
          label: "运营商",
          key: "signs",
          optionData: [
            { key: "1", value: "商家" },
            { key: "2", value: "代理商" },
            { key: "3", value: "供应商" },
          ],
        },
        { type: "input", label: "商家名称", key: "corpName" },
        {
          type: "select",
          label: "号码状态",
          key: "signs",
          optionData: [
            { key: "1", value: "商家" },
            { key: "2", value: "代理商" },
            { key: "3", value: "供应商" },
          ],
        },
        {
          type: "select",
          label: "线路名称",
          key: "signs",
          optionData: [
            { key: "1", value: "商家" },
            { key: "2", value: "代理商" },
            { key: "3", value: "供应商" },
          ],
        },
        { type: "input", label: "号码", key: "corpNames" },
        { type: "inputNum", label: "商家账号", key: "userId" },
        { type: "input", label: "号码归属地区", key: "corpNames" },
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
        namespace: "smslongnum",
        list: "list",
        detele: "delete",
      },
      // 列表参数
      namespace: "configs",
      namespaceType: "Array",
      // 表单配置
      formConfig: [
        {
          type:"select",
          label:'供应商名称',
          key:"supplier",
          optionData:[]
        },
        {
          type:"select",
          label:'线路名称',
          key:"supplier",
          optionData:[]
        },
        {
          type:"select",
          label:'号码归属地区',
          key:"supplier",
          colSpan:12,
          optionData:[]
        },
        {
          type:"select",
          label:'号码归属运营商',
          key:"supplier",
          colSpan:12,
          optionData:[]
        },
        {
          type: "input",
          label: "单号码月租（元）",
          key: "userId",
          defaultValue: "",
        },
        {
          type: "uploadXlsx",
          label: "运营商号码",
          key: "smsLongNum",
          defaultValue: "",
        },
      ],
      id: "",
      allocationConfig:[
        {
          type:"select",
          label:'供应商名称',
          key:"supplier",
          optionData:[]
        },
        {
          type:"select",
          label:'线路名称',
          key:"supplier",
          optionData:[]
        },
        {
          type:"select",
          label:'号码归属地区',
          key:"supplier",
          colSpan:12,
          optionData:[]
        },
        {
          type:"select",
          label:'号码归属运营商',
          key:"supplier",
          colSpan:12,
          optionData:[]
        },
        {
          type: "input",
          label: "运营商号码",
          key: "smsLongNum",
          defaultValue: "",
        },
        {
          type:'divider'
        },
        {
          type:"select",
          label:'使用商户',
          key:"supplier",
          optionData:[]
        },
        {
          type:"select",
          label:'商户账号',
          key:"supplier",
          optionData:[]
        },
        {
          type:"select",
          label:'路由类型',
          key:"supplier",
          colSpan:12,
          optionData:[]
        },
        {
          type:"select",
          label:'流程名称',
          key:"supplier",
          colSpan:12,
          optionData:[]
        },
      ],
      allocationVisible:false,
      multipleSelection:[]
    };
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    //table 多选
    handleSelectionChange(val){
      this.multipleSelection = val
    },
    submitAllocation(){},
    cancelAllocation(){
      this.allocationVisible = false
      setTimeout(() => {
        this.$refs.allocationForm.resetForm();
      }, 0);
    },
    allocation(){
      this.allocationVisible = true
      setTimeout(() => {
        this.$refs.allocationForm.resetForm();
      }, 0);
    },
    addNum(){},
    deteleNum(){
      if(this.multipleSelection.length === 0){
        this.$message.error('请选择一条数据')
      }
    },
    exportNum(){},
  },
  watch: {},
};
</script>
<style lang="scss" scoped></style>
