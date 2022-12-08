<template>
<!-- 坐席 -->
  <div class="seatsIndex">
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
      <el-table-column prop="corpId" label="座席姓名" />
      <el-table-column prop="corpId" label="工号" />
      <el-table-column prop="corpId" label="座席密码" />
      <el-table-column prop="corpId" label="角色" />
      <el-table-column prop="corpId" label="归属技能组" />
      <el-table-column prop="corpId" label="状态" />
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
        { type: "input", label: "座席名称", key: "corpNames" },
        { type: "inputNum", label: "工号", key: "userId" },
        {
          type: "select",
          label: "角色",
          key: "sign",
          optionData: [
            { key: "1", value: "全部" },
            { key: "2", value: "普通坐席" },
            { key: "3", value: "企业管理员" },
          ],
        },
        {
          type: "select",
          label: "归属技能组",
          key: "signs",
          optionData: [
            { key: "1", value: "全部" },
            { key: "2", value: "技能组A" },
            { key: "3", value: "技能组B" },
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
      namespace: "configs",
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
          label: "座席姓名",
          key: "userId",
          defaultValue: "",
        },
        {
          type: "input",
          label: "工号",
          key: "userId",
          defaultValue: "",
        },
        {
          type: "input",
          label: "密码",
          key: "userId",
          defaultValue: "",
        },
        {
          type: "select",
          label: "座席角色",
          key: "userId",
          defaultValue: "",
          optionData:[
            {key:'1',value:'普通坐席'},
            {key:'2',value:'企业管理员'},
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
