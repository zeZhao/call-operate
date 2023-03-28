<template>
<!-- IVR -->
  <div class="IVR">
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
      <el-table-column prop="corpId" label="商家账号" />
      <el-table-column prop="corpId" label="流程名" />
      <el-table-column prop="corpId" label="流程类型" />
      <el-table-column prop="corpId" label="ASR并发上限" />
      <el-table-column prop="corpId" label="状态" />
      <el-table-column prop="corpId" label="创建时间" />
      <el-table-column prop="corpId" label="备注" />
      <el-table-column label="操作" width="100" fixed="right">
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
          <el-button
            type="text"
            size="small"
            >复制
          </el-button>
          <el-button
            type="text"
            size="small"
            >重载
          </el-button>
          <el-button
            type="text"
            size="small"
            >流程详情
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
      // 搜索框配置
      searchFormConfig: [
        { type: "input", label: "商家账号", key: "corpName" },
        { type: "input", label: "流程名称", key: "corpName" },
        {
          type: "select",
          label: "流程类型",
          key: "sign",
          optionData: [
            { key: "1", value: "全部" },
            { key: "2", value: "IVR" },
            { key: "3", value: "技能组" },
          ],
        },
        {
          type: "select",
          label: "状态",
          key: "signs",
          optionData: [
            { key: "1", value: "全部" },
            { key: "2", value: "停用" },
            { key: "3", value: "有效" },
          ],
        },
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
          type: "input",
          label: "商家名称",
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
          type: "input",
          label: "流程名称",
          key: "userId",
          defaultValue: "",
        },
        {
          type: "input",
          label: "ASR并发上限",
          key: "userId",
          defaultValue: "",
        },
        {
          type: "select",
          label: "流程类型",
          key: "userId",
          defaultValue: "",
          optionData:[
            {key:'1',value:'IVR'},
            {key:'2',value:'技能组'},
          ],
        },
        {
          type: "select",
          label: "状态",
          key: "userId",
          defaultValue: "",
          optionData:[
            {key:'1',value:'有效'},
            {key:'2',value:'停用'},
          ],
        },
        {
          type: "textarea",
          label: "备注",
          key: "userId",
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
  methods: {},
  watch: {},
};
</script>
<style lang="scss" scoped></style>
