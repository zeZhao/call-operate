<template>
  <!-- 线路对接 -->
  <div class="lineDocking">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="_mxCreate"
    >
      <template slot="other">
        <el-button type="primary" @click="advanced">高级配置</el-button>
      </template>
    </Search>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      :height="tableHeight"
    >
      <el-table-column label="序号" type="index" align="center" />
      <el-table-column prop="corpId" label="线路名称" />
      <el-table-column prop="corpId" label="供应商名称" />
      <el-table-column prop="corpId" label="供应商账户" />
      <el-table-column prop="corpId" label="对接方式" />
      <el-table-column prop="corpId" label="线路并发数" />
      <el-table-column prop="corpId" label="IP地址" />
      <el-table-column prop="corpId" label="端口" />
      <el-table-column prop="corpId" label="注册账号" />
      <el-table-column prop="corpId" label="可用状态" />
      <el-table-column prop="corpId" label="落地省份" />
      <el-table-column prop="corpId" label="归属运营商" />
      <el-table-column prop="corpId" label="线路类型" />
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

    <!-- 高级配置 -->
    <el-dialog
      title="高级设置"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div>
        <p>主叫改写规则</p>
        <el-divider></el-divider>
        <p>被叫改写规则</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
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
        { type: "input", label: "供应商名称", key: "corpName" },
        { type: "input", label: "线路名称", key: "corpNames" },
        { type: "inputNum", label: "供应商账户", key: "userId" },
        {
          type: "select",
          label: "对接方式",
          key: "sign",
          optionData: [
            { key: "1", value: "全部" },
            { key: "2", value: "SIP对接" },
            { key: "3", value: "账号注册" },
          ],
        },
        {
          type: "select",
          label: "线路类型",
          key: "signs",
          optionData: [
            { key: "1", value: "全部" },
            { key: "2", value: "直连" },
            { key: "3", value: "第三方" },
          ],
        },
        {
          type: "select",
          label: "运营商",
          key: "signs",
          optionData: [
            { key: "1", value: "全部" },
            { key: "2", value: "移动" },
            { key: "3", value: "联通" },
            { key: "4", value: "电信" },
          ],
        },
        {
          type: "select",
          label: "落地省份",
          key: "signs",
          optionData: [
            { key: "1", value: "全部" },
            { key: "2", value: "停用" },
            { key: "3", value: "有效" },
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
          label: "供应商名称",
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
          label: "供应商账户",
          key: "userId",
          defaultValue: "",
        },
        {
          type: "input",
          label: "线路名称",
          key: "userId",
          defaultValue: "",
        },
        {
          type: "select",
          label: "线路类型",
          key: "userId",
          defaultValue: "",
          optionData: [
            { key: "1", value: "普通坐席" },
            { key: "2", value: "企业管理员" },
          ],
        },
        {
          type: "select",
          label: "运营商",
          key: "userId",
          defaultValue: "",
          optionData: [
            { key: "1", value: "普通坐席" },
            { key: "2", value: "企业管理员" },
          ],
        },
        {
          type: "select",
          label: "落地城市",
          key: "userId",
          defaultValue: "",
          optionData: [
            { key: "1", value: "普通坐席" },
            { key: "2", value: "企业管理员" },
          ],
        },
        {
          type: "select",
          label: "状态",
          key: "userId",
          defaultValue: "",
          optionData: [
            { key: "1", value: "有效" },
            { key: "2", value: "停用" },
          ],
        },
        {
          type: "input",
          label: "线路并发数",
          key: "userId",
          defaultValue: "",
        },
        {
          type: "select",
          label: "对接方式",
          key: "userId",
          defaultValue: "",
          optionData: [
            { key: "1", value: "有效" },
            { key: "2", value: "停用" },
          ],
        },
        {
          type: "input",
          label: "服务器IP",
          key: "userId",
          defaultValue: "",
        },
        {
          type: "input",
          label: "信令端口",
          key: "userId",
          defaultValue: "",
        },
      ],
      id: "",
      dialogVisible:false
    };
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    advanced() {},
  },
  watch: {},
};
</script>
<style lang="scss" scoped></style>
