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
      <!-- <el-table-column label="序号" type="index" align="center" /> -->
      <el-table-column prop="corpId" label="商户名称" />
      <el-table-column prop="corpId" label="任务名称" />
      <el-table-column prop="corpId" label="任务类型" />
      <el-table-column prop="corpId" label="服务流程/班组" />
      <el-table-column prop="corpId" label="主叫/线路" />
      <el-table-column prop="corpId" label="并发上限" />
      <el-table-column prop="corpId" label="总号码数" />
      <el-table-column prop="corpId" label="剩余号码数" />
      <el-table-column prop="corpId" label="任务状态" />
      <el-table-column prop="corpId" label="更新时间" />
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button
            @click="_mxEdit(scope.row, 'templateId')"
            type="text"
            size="small"
            >编辑</el-button
          >
          <el-button
            @click="_mxEdit(scope.row, 'templateId')"
            type="text"
            size="small"
            >启动</el-button
          >
          <el-button
            @click="_mxEdit(scope.row, 'templateId')"
            type="text"
            size="small"
            >暂停</el-button
          >
          <el-button
            @click="_mxEdit(scope.row, 'templateId')"
            type="text"
            size="small"
            >追加</el-button
          >
          <el-button
            @click="_mxEdit(scope.row, 'templateId')"
            type="text"
            size="small"
            >删除</el-button
          >
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
        :isSubmitBtn="true"
      >
      <template v-slot:custom = 'formData'>
        <el-form-item label="有效时段1：">
          <el-select v-model="formData.formData.timeValidity1_1">
            <el-option :value="1">星期一</el-option>
            <el-option :value="2">星期二</el-option>
            <el-option :value="3">星期三</el-option>
          </el-select>
          <el-time-picker
            v-model="formData.formData.timeValidity1_2"
            style="width:120px;margin-left:20px"
            placeholder="任意时间点">
          </el-time-picker>
          <el-time-picker
            style="width:120px;margin-left:20px"  
            v-model="formData.formData.timeValidity1_3"
            placeholder="任意时间点">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="有效时段2：">
          <el-select v-model="formData.formData.timeValidity2_1">
            <el-option :value="1">星期一</el-option>
            <el-option :value="2">星期二</el-option>
            <el-option :value="3">星期三</el-option>
          </el-select>
          <el-time-picker
            v-model="formData.formData.timeValidity2_2"
            style="width:120px;margin-left:20px"
            placeholder="任意时间点">
          </el-time-picker>
          <el-time-picker
            style="width:120px;margin-left:20px"  
            v-model="formData.formData.timeValidity2_3"
            placeholder="任意时间点">
          </el-time-picker>
        </el-form-item>
      </template>
      </FormItem>
      
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
        { type: "input", label: "商户名称", key: "corpName" },
        { type: "input", label: "任务名称", key: "corpNames" },
        { type: "inputNum", label: "主叫号码", key: "userId" },
        {
          type: "select",
          label: "任务类型",
          key: "sign",
          optionData: [
            { key: "1", value: "自动语音" },
            { key: "2", value: "呼通后转人工" },
          ],
        },
        {
          type: "select",
          label: "任务状态",
          key: "sign",
          optionData: [
            { key: "1", value: "已停止" },
            { key: "2", value: "运行中" },
          ],
        },
        // {
        //   type: "select",
        //   label: "类别",
        //   key: "signs",
        //   optionData: [
        //     { key: "1", value: "商家" },
        //     { key: "2", value: "代理商" },
        //     { key: "3", value: "供应商" },
        //   ],
        // },
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
          type: "input",
          label: "商户名称",
          key: "userId",
          defaultValue: "",
        },
        {
          type: "input",
          label: "任务名称",
          key: "userId1",
          defaultValue: "",
        },
        {
          type:"select",
          label:'任务类型',
          key:"supplier1",
          colSpan:12,
          optionData:[]
        },
        {
          type:"select",
          label:'主叫/线路',
          key:"supplier2",
          colSpan:12,
          optionData:[]
        },
        {
          type:"select",
          label:'服务流程/班组',
          key:"supplier3",
          colSpan:12,
          optionData:[]
        },
        {
          type:"input",
          label:'并发数',
          key:"supplier4",
          colSpan:12,
        },
        {
          type:"uploadXlsx",
          label:'外呼号码',
          key:"supplier5",
          // colSpan:12,
        },
        // {
        //   type: "textarea",
        //   label: "长号码",
        //   key: "smsLongNum",
        //   defaultValue: "",
        //   maxlength: 4000,
        //   // rules: [
        //   //   {
        //   //     required: true,
        //   //     message: "请输入必填项",
        //   //     trigger: ['blur', 'change']
        //   //   }
        //   // ]
        // },
      ],
      id: "",
    };
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    _mxHandleSubmit(form){
      console.log(form,'----')
    }
  },
  watch: {},
};
</script>
<style lang="scss" scoped></style>
