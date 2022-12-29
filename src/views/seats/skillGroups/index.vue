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
      <el-table-column prop="corpName" label="商户名称" />
      <el-table-column prop="taskName" label="技能组名称" />
      <el-table-column prop="taskType" label="技能组流程" >
        <template slot-scope="{row}">
          <span v-if="row.taskType === 1">自动语音</span>
          <span v-if="row.taskType === 2">呼通后转人工</span>
        </template>
      </el-table-column>
      <el-table-column prop="corpId" label="座席数量" />
      <el-table-column prop="corpId" label="座席分配策略" />
      <el-table-column prop="corpId" label="满意度流程" />
      <el-table-column prop="corpId" label="报工号" />
      <el-table-column prop="corpId" label="报工号语音" />
      <el-table-column prop="state" label="状态" >
        <template slot-scope="{row}">
          <span v-if="row.state === 3">未开始</span>
          <span v-if="row.state === 4">呼叫中</span>
          <span v-if="row.state === 5">自动暂停</span>
          <span v-if="row.state === 6">任务完成</span>
          <span v-if="row.state === 7">任务终止</span>
          <span v-if="row.state === 8">手动暂停</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button
            @click="_mxEdit(scope.row, 'templateId')"
            type="text"
            size="small"
            >查看</el-button
          >
          <el-button
            @click="_mxEdit(scope.row, 'templateId')"
            type="text"
            size="small"
            >编辑</el-button
          >
          <el-button
            @click=" _mxDeleteItem('extId', scope.row.extId, false, false)"
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
        <div style="margin-left:50px;margin-bottom:20px">
          <el-transfer 
            v-model="formData.formData.seat" 
            :data="data" 
            :titles="['已关联座席', '待关联座席']" 
            :left-default-checked="[2, 3]"
            :right-default-checked="[1]"
            ></el-transfer>
        </div>
        
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
    const generateData = _ => {
        const data = []; 
        for (let i = 1; i <= 8; i++) {
          data.push({
            key: i,
            label: `000${ i }张三`,
            // disabled: i % 4 === 0
          });
        }
        return data;
      };
    return {
      data: generateData(),
      // 搜索框配置
      searchFormConfig: [
        { type: "input", label: "商户名称", key: "corpId" },
        { type: "input", label: "技能组流程", key: "taskName" },
        { type: "inputNum", label: "满意度流程", key: "extId" },
        { type: "inputNum", label: "技能组名称", key: "extId" },
        {
          type: "select",
          label: "座席分配策略",
          key: "taskType",
          optionData: [
            { key: 1, value: "轮选" },
            { key: 2, value: "随机" },
            { key: 3, value: "分机记忆" },
            { key: 4, value: "共振" },
            { key: 5, value: "空闲时间最长" },
            { key: 6, value: "通话时间最短" },
            { key: 7, value: "电话数量最少" },
          ],
        },
        {
          type: "select",
          label: "状态",
          key: "state",
          optionData: [
            { key: 3, value: "有效" },
            { key: 4, value: "停用" },
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
      namespace: "",
      namespaceType: "Array",
      // 表单配置
      formConfig: [
        {
          type: "select",
          label: "商户名称",
          key: "corpId",
          defaultValue: "",
          optionData:[]
        },
        {
          type: "input",
          label: "技能组名称",
          key: "taskName",
          defaultValue: "",
        },
        {
          type:"select",
          label:'排队流程',
          key:"taskType",
          colSpan:12,
          optionData:[
            { key: 1, value: "系统默认" },
            { key: 2, value: "呼通后转人工" },
          ]
        },
        {
          type:"select",
          label:'座席分配策略',
          key:"supplier2",
          colSpan:12,
          optionData:[
            { key: 1, value: "轮选" },
            { key: 2, value: "随机" },
            { key: 3, value: "分机记忆" },
            { key: 4, value: "共振" },
            { key: 5, value: "空闲时间最长" },
            { key: 6, value: "通话时间最短" },
            { key: 7, value: "电话数量最少" },
          ]
        },
        {
          type:"select",
          label:'满意度调查流程',
          key:"supplier3",
          colSpan:12,
          defaultValue:1,
          optionData:[
            { key: 1, value: "系统默认" },
            { key: 2, value: "呼通后转人工" },
          ]
        },
        {
          type: "divider",
        },
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
