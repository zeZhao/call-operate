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
      <el-table-column prop="corpId" label="商家名称" />
      <el-table-column prop="corpId" label="应用场景" />
      <el-table-column prop="corpId" label="语音名称" />
      <el-table-column prop="corpId" label="语音文件名" />
      <el-table-column prop="corpId" label="语音文字" />
      <el-table-column prop="corpId" label="创建时间" />
      <el-table-column label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            >上传</el-button
          >
          <el-button
            type="text"
            size="small"
            >试听</el-button
          >
          <el-button
            @click=" _mxDeleteItem('agentId', scope.row.agentId, false, false)"
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
      // 搜索框配置
      searchFormConfig: [
        { type: "input", label: "商家名称", key: "corpName" },
        { type: "input", label: "应用场景", key: "corpNames" },
        { type: "inputNum", label: "语音名称", key: "userId" },
        // {
        //   type: "select",
        //   label: "任务类型",
        //   key: "sign",
        //   optionData: [
        //     { key: "1", value: "自动语音" },
        //     { key: "2", value: "呼通后转人工" },
        //   ],
        // },
        // {
        //   type: "select",
        //   label: "任务状态",
        //   key: "sign",
        //   optionData: [
        //     { key: "1", value: "已停止" },
        //     { key: "2", value: "运行中" },
        //   ],
        // },
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
          label: "账户编号",
          key: "userId",
          defaultValue: "",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"],
            },
          ],
        },
        {
          type: "textarea",
          label: "长号码",
          key: "smsLongNum",
          defaultValue: "",
          maxlength: 4000,
          // rules: [
          //   {
          //     required: true,
          //     message: "请输入必填项",
          //     trigger: ['blur', 'change']
          //   }
          // ]
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
