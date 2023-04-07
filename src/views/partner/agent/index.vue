<template>
  <div class="user">
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
      <el-table-column type="index" label="序号" align="center" />
      <el-table-column prop="corpName" label="公司名称" width="120" />
      <el-table-column prop="userName" label="账户名称" />
      <el-table-column prop="rateName" label="费率" show-overflow-tooltip />
      <el-table-column prop="chargeType" label="计费类型">
        <template slot-scope="{ row }">
          <span v-if="row.chargeType == 0">预付</span>
          <span v-if="row.chargeType == 1">后付</span>
        </template>
      </el-table-column>
      <el-table-column prop="balance" label="账户余额（元）" />
      <el-table-column prop="overdraft" label="透支额度（元）" />
      <el-table-column
        prop="comboName"
        label="通话套餐"
        show-overflow-tooltip
      />
      <el-table-column prop="comboLeft" label="套餐时长（秒）" />
      <el-table-column prop="smsCount" label="短信条数" />
      <el-table-column prop="recordLimit" label="录音上限(个）" />
      <!-- <el-table-column prop="agentUserName" label="代理商" /> -->
      <el-table-column prop="status" label="账户状态">
        <template slot-scope="{ row }">
          <span v-if="row.status == 0">禁用</span>
          <span v-if="row.status == 1">使用</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="开户时间" width="150" />
      <el-table-column label="操作" width="130">
        <template slot-scope="scope">
          <el-button
            @click="_mxEdit(scope.row, 'agentId')"
            type="text"
            size="small"
            >修改</el-button
          >
          <el-button @click="recharge(scope.row)" type="text" size="small"
            >充值
          </el-button>
          <!-- <el-button
            @click="
              _mxDeleteItem('agentId', scope.row.agentId, false, true)
            "
            type="text"
            size="small"
            >删除
          </el-button> -->
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

    <el-dialog
      title="充值"
      :visible.sync="rechargeVisible"
      :close-on-click-modal="false"
      top="45px"
    >
      <FormItem
        ref="rechargeForm"
        :formConfig="rechargeFormConfig"
        btnTxt="确定"
        @submit="rechargeSubmit"
        @cancel="rechargeCancel"
        @onChange="onChangeRecharge"
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
        { type: "select", label: "费率", key: "rateName",optionData:[] },
        // { type: "input", label: "代理商", key: "corpName" },

        // { type: "input", label: "定购套餐", key: "corpName" },
        {
          type: "select",
          label: "账户状态",
          key: "status",
          optionData: [
            { key: 1, value: "有效" },
            { key: 0, value: "无效" },
          ],
        },
        { type: "input", label: "账户名称", key: "userName" },
        {
          type: "select",
          label: "计费类型",
          key: "chargeType",
          optionData: [
            { key: 0, value: "预付" },
            { key: 1, value: "后付" },
          ],
        },

        // {
        //   type: "daterange",
        //   label: "开户时间",
        //   key: ["", "submitStartTime", "submitEndTime"]
        // }
      ],
      //搜索框数据
      searchParam: {},
      //接口地址
      searchAPI: {
        namespace: "corpAgent",
        list: "list",
        add: "updateAndSaveCorpAgent",
        edit: "updateAndSaveCorpAgent",
        detele: "delete",
      },
      // 列表参数
      namespace: "",
      namespaceType: "Array",
      // 表单配置
      formConfig: [
        {
          type: "select",
          label: "公司名称",
          key: "corpId",
          defaultValue: "",
          optionData: [],
        },
        {
          type: "input",
          label: "账户名称",
          key: "userName",
          defaultValue: "",
        },
        {
          type: "input",
          label: "登录账号",
          key: "account",
          defaultValue: "",
        },
        {
          type: "password",
          label: "密码",
          key: "pwd",
          defaultValue: "",
        },
        // {
        //   type: "select",
        //   label: "代理商",
        //   key: "agentId",
        //   defaultValue: "",
        //   optionData:[
        //     { key: 0, value: "商家" },
        //     { key: 1, value: "代理商" },
        //     { key: 2, value: "供应商" },
        //   ],
        //   colSpan:12
        // },
        {
          type: "select",
          label: "状态",
          key: "status",
          defaultValue: "",
          optionData: [
            { key: 1, value: "使用" },
            { key: 0, value: "禁用" },
          ],
          colSpan: 12,
        },
        {
          type: "select",
          label: "计费类型",
          key: "chargeType",
          defaultValue: "",
          optionData: [
            { key: 0, value: "预付" },
            { key: 1, value: "后付" },
          ],
          colSpan: 12,
        },
        {
          type: "select",
          label: "费率",
          key: "rateId",
          defaultValue: "",
          optionData: [
            { key: 0, value: "商家" },
            { key: 1, value: "代理商" },
            { key: 2, value: "供应商" },
          ],
          colSpan: 12,
        },
        {
          type: "select",
          label: "通话套餐",
          key: "comboId",
          defaultValue: "",
          optionData: [
            { key: 0, value: "通话套餐A" },
            { key: 1, value: "通话套餐B" },
            { key: 2, value: "通话套餐C" },
          ],
          rules: [],
          colSpan: 12,
        },
        {
          type: "select",
          label: "录音套餐",
          key: "recComboId",
          defaultValue: "",
          optionData: [
            { key: 0, value: "录音套餐A" },
            { key: 1, value: "录音套餐B" },
            { key: 2, value: "录音套餐C" },
          ],
          rules: [],
          colSpan: 12,
        },
        {
          type: "input",
          label: "透支额度（元）",
          key: "overdraft",
          defaultValue: "",
          rules: [],
          colSpan: 12,
        },
        {
          type: "input",
          label: "录音上限",
          key: "recordLimit",
          defaultValue: "",
          rules: [],
          colSpan: 12,
        },
      ],
      id: "",
      rechargeVisible: false,
      rechargeFormConfig: [
        {
          type: "radio",
          label: "类型",
          key: "rechargeType",
          defaultValue: 1,
          initDefaultValue: 1,
          optionData: [
            { key: 1, value: "语音充值" },
            { key: 2, value: "短信充值" },
          ],
        },
        {
          type: "input",
          label: "公司名称",
          key: "corpId",
          defaultValue: "",
        },
        {
          type: "input",
          label: "账户名称",
          key: "userId",
          defaultValue: "",
        },

        {
          type: "select",
          label: "操作方式",
          key: "optType",
          defaultValue: "",
          optionData: [
            { key: 0, value: "充值" },
            { key: 1, value: "扣款" },
          ],
        },
        // {
        //   type: "input",
        //   label: "充值金额",
        //   key: "amount",
        //   defaultValue: "",
        //   isShow:true
        // },
        {
          type: "input",
          label: "充值条数",
          key: "optBalance",
          defaultValue: "",
          isShow: true,
        },
        {
          type: "input",
          label: "金额",
          key: "amount",
          defaultValue: "",
          rules: [
            {
              required: true,
              trigger: ["blur", "change"],
              validator: (rule, value, callback) => {
                if (value === "" || value === undefined || value === null) {
                  callback(new Error("请输入必填项"));
                } else {
                  if (value <= 0) {
                    callback(new Error("需大于0"));
                  } else {
                    const val =
                      typeof value === "string"
                        ? value.trim()
                        : (value + "").trim();
                    if (/^(\d{1,9})$|^(\d{1,9}\.\d{1,2})$/.test(val)) {
                      callback();
                    } else {
                      callback(new Error("输入大于0的数，小数点保留2位"));
                    }
                  }
                }
              }
            }
          ]
        },
        {
          type: "textarea",
          label: "备注",
          key: "remark",
          defaultValue: "",
          rules: [],
          maxlength: 4000,
        },
      ],
      row: {},
    };
  },
  created() {},
  mounted() {
    this.queryCorpByCorpType();
    this.costRateList();
    this.comboList();
  },
  activated() {
    this.queryCorpByCorpType();
    this.costRateList();
    this.comboList();
  },
  computed: {},
  methods: {
    //获取公司下拉
    queryCorpByCorpType() {
      this.$http.select.queryCorpByCorpType({ corpType: 1 }).then((res) => {
        this._setDefaultValue(
          this.formConfig,
          res.data.records,
          "corpId",
          "corpId",
          "corpName"
        );
      });
    },
    //获取费率下拉
    costRateList() {
      this.$http.costRate.get({ enablePage: false }).then((res) => {
        this._setDefaultValue(
          this.formConfig,
          res.data.list,
          "rateId",
          "rateId",
          "rateName"
        );
        this._setDefaultValue(this.searchFormConfig,res.data.list,'rateName','rateName','rateName')
      });
    },
    //获取通话套餐
    comboList() {
      this.$http.combo.get({ enablePage: false, comboType: 0 }).then((res) => {
        this._setDefaultValue(
          this.formConfig,
          res.data.list,
          "comboId",
          "comboId",
          "comboName"
        );
      });
      //获取录音套餐
      this.$http.combo.get({ enablePage: false, comboType: 1 }).then((res) => {
        this._setDefaultValue(
          this.formConfig,
          res.data.list,
          "recComboId",
          "comboId",
          "comboName"
        );
      });
    },
    //充值
    recharge(row) {
      this.rechargeVisible = true;
      this.row = row;
      setTimeout(() => {
        this.$refs.rechargeForm.resetForm();
        this.rechargeFormConfig.forEach((item) => {
          if (item.key === "userId") {
            item.defaultValue = row.userName;
          }
          if (item.key === "corpId") {
            item.defaultValue = row.corpName;
          }
        });
      }, 0);
    },
    onChangeRecharge({ val, item }) {
      const { key } = item;
      if (key === "rechargeType") {
        if (val === 1) {
          this._setDisplayShow(this.rechargeFormConfig, "optBalance", true);
          // this._setDisplayShow(this.rechargeFormConfig, "amount", true);
          this._setDisplayShow(this.rechargeFormConfig, "amount", false);
        } else {
          this._setDisplayShow(this.rechargeFormConfig, "optBalance", false);
          // this._setDisplayShow(this.rechargeFormConfig, "amount", false);
          this._setDisplayShow(this.rechargeFormConfig, "amount", true);
        }
      }
    },
    rechargeSubmit() {
      const form = Object.assign({}, this.$refs.rechargeForm.formData);
      let params = Object.assign(form, {
        corpId: this.row.corpId,
        userId: this.row.userId,
        agentId: this.row.agentId,
      });
      // console.log(,'====')
      this.$http.corpAgent.cropAgentRecharge(params).then((res) => {
        if (res.state === "200") {
          this.rechargeVisible = false;
          this.$message.success("充值成功");
          this._mxGetList();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    rechargeCancel() {
      this.rechargeVisible = false;
      setTimeout(() => {
        this.$refs.rechargeForm.resetForm();
      }, 0);
    },
    /**
     * 创建表单
     * @param row  当前行数据
     * @param id  当前行ID
     * @private
     */

    _mxCreate() {
      this.addChannel = true;
      this.formTit = "新增";
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
      this._setDisplayShow(this.formConfig, "comboId", true);
      this._setDisplayShow(this.formConfig, "recComboId", true);
      this.formConfig.forEach(item=>{
        if(item.key === 'account'){
          item.rules = [ {
          required: true,
          message: "请输入必填项",
          trigger: ["blur", "change"],
        },]
        }
        if(item.key === 'pwd'){
          item.rules = [ {
          required: true,
          message: "请输入必填项",
          trigger: ["blur", "change"],
        },]
        }
      })
    },

    /**
     * 编辑表单
     * @param row  当前行数据
     * @param ID  当前行ID
     * @private
     */

    _mxEdit(row, ID) {
      row = this._mxArrangeEditData(row);
      this.id = row[ID];
      this.editId = ID;
      this.formTit = "修改";
      this.formConfig.forEach((item) => {
        for (let key in row) {
          if (item.key === key && row[key] !== "-") {
            this.$set(item, "defaultValue", row[key]);
          }
          if (row["chargeType"] === 0) {
            this._setDisplayShow(this.formConfig, "comboId", false);
            this._setDisplayShow(this.formConfig, "recComboId", false);
          } else {
            this._setDisplayShow(this.formConfig, "comboId", true);
            this._setDisplayShow(this.formConfig, "recComboId", true);
          }
        }
        if (!Object.keys(row).includes(item.key)) {
          this.$set(item, "defaultValue", "");
        }
        if(item.key === 'account'){
          item.rules = []
        }
        if(item.key === 'pwd'){
          item.rules = []
        }
      });
      setTimeout(() => {
        this.$refs.formItem.clearValidate();
      }, 0);

      this.addChannel = true;
    },
    selectChange({ val, item }) {
      if (item.key === "chargeType") {
        if (this.formTit === "修改") {
          if (val === 1) {
            this._setDisplayShow(this.formConfig, "comboId", true);
            this._setDisplayShow(this.formConfig, "recComboId", true);
          } else {
            this._setDisplayShow(this.formConfig, "comboId", false);
            this._setDisplayShow(this.formConfig, "recComboId", false);
          }
        }
      }
    },
  },
  watch: {},
};
</script>
<style lang="scss" scoped></style>
