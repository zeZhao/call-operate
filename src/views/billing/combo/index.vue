<template>
  <div class="agent">
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
      <el-table-column
        prop="comboName"
        label="套餐名称"
        width="120"
        show-overflow-tooltip
      />
      <el-table-column prop="comboType" label="套餐类型">
        <template slot-scope="{ row }">
          <span v-if="row.comboType == 0">通话</span>
          <span v-if="row.comboType == 1">录音</span>
        </template>
      </el-table-column>
      <el-table-column prop="cycle" label="租用周期">
        <template slot-scope="{ row }">
          <span v-if="row.cycle == 0">一次性</span>
          <span v-if="row.cycle == 1">每周</span>
          <span v-if="row.cycle == 2">每月</span>
          <span v-if="row.cycle == 3">每年</span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="租金（元）" />
      <el-table-column prop="comboLeft" label="套餐时长（秒）" />
      <el-table-column prop="status" label="状态"
        ><template slot-scope="{ row }">
          <span v-if="row.status == 0">禁用</span>
          <span v-if="row.status == 1">可用</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        show-overflow-tooltip
      >
      <template slot-scope="{row}">
          <span>{{row.createTime | dateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createrType" label="创建人类别">
        <template slot-scope="{ row }">
          <span v-if="row.createrType == 0">运营</span>
          <span v-if="row.createrType == 1">代理商</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="createrBy" label="创建人" /> -->
      <el-table-column prop="remarks" label="备注" show-overflow-tooltip />
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button
            @click="_mxEdit(scope.row, 'comboId')"
            type="text"
            size="small"
            >修改</el-button
          >
          <el-button
            @click="_mxDeleteItem('templateId', scope.row.comboId, false, true)"
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
        @selectChange="selectChange"
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
        { type: "input", label: "套餐名称", key: "comboName" },
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
      ],
      isParamsNotData: false,
      submitParamsIsData: false,
      //搜索框数据
      searchParam: {},
      //接口地址
      searchAPI: {
        namespace: "combo",
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
          label: "套餐名称",
          key: "comboName",
          defaultValue: "",
        },
        {
          type: "select",
          label: "套餐类型",
          key: "comboType",
          defaultValue: "",
          optionData: [
            { key: 1, value: "录音" },
            { key: 0, value: "通话" },
          ],
        },
        {
          type: "select",
          label: "租用周期",
          key: "cycle",
          defaultValue: "",
          optionData: [
            { key: 0, value: "一次性" },
            { key: 1, value: "每周" },
            { key: 2, value: "每月" },
            { key: 3, value: "每年" },
          ],
        },
        {
          type: "inputNum",
          label: "租金（元）",
          key: "amount",
          defaultValue: "",
        },
        {
          type: "inputNum",
          label: "套餐时长（秒）",
          key: "comboLeft",
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
    selectChange({ val, item }) {
      if (item.key === "comboType") {
        // 录音
        if (val === 1) {
          this._setDisplayShow(this.formConfig, "comboLeft", true);
        } else {
          this._setDisplayShow(this.formConfig,'comboLeft', false);
        }
      }
    },
  },
  watch: {},
};
</script>
<style lang="scss" scoped></style>
