<template>
  <!-- 号码管理 -->
  <div class="secretFriend">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="_mxCreate"
      :add="false"
    >
      <template slot="other">
        <el-button type="primary" @click="_mxCreate">新增号码</el-button>
        <el-button type="primary" @click="allocation">分配号码</el-button>
        <el-button type="primary" @click="_mxDeleteItem">删除</el-button>
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
      <el-table-column prop="supplyName" label="供应商名称" />
      <el-table-column prop="lineName" label="线路名称" />
      <el-table-column prop="privince" label="号码归属地区" />
      <el-table-column prop="operaId" label="运营商">
        <template slot-scope="{ row }">
          <span v-if="row.operaId === 0">非法</span>
          <span v-if="row.operaId === 1">移动</span>
          <span v-if="row.operaId === 2">联通</span>
          <span v-if="row.operaId === 3">电信</span>
          <span v-if="row.operaId === 4">国际</span>
        </template>
      </el-table-column>
      <el-table-column prop="operaNumber" label="运营商号码" />
      <el-table-column prop="numberCost" label="号码月租成本（元）" />
      <el-table-column prop="numberStatus" label="号码状态">
        <template slot-scope="{ row }">
          <span v-if="row.numberStatus === 0">空闲</span>
          <span v-if="row.numberStatus === 1">已分配</span>
          <span v-if="row.numberStatus === 2">停用</span>
        </template>
      </el-table-column>
      <el-table-column prop="merchantTenantName" label="使用商家" />
      <el-table-column prop="merchantTenantAccountName" label="商家账户" />
      <el-table-column prop="routeType" label="路由类型">
        <template slot-scope="{ row }">
          <span v-if="row.routeType === 2">技能组</span>
          <span v-if="row.routeType === 1">IVR</span>
        </template>
      </el-table-column>
      <el-table-column prop="sceneName" label="流程名称" />
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
        @selectChange="addSelectChange"
        @changeFileUpload="changeFileUpload"
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
      isParamsNotData: false,
      submitParamsIsData: false,
      // 搜索框配置
      searchFormConfig: [
        {
          type: "select",
          label: "供应商名称",
          key: "corpId",
          optionData: [],
        },
        {
          type: "select",
          label: "运营商",
          key: "operaId",
          optionData: [
            { key: 0, value: "非法" },
            { key: 1, value: "移动" },
            { key: 2, value: "联通" },
            { key: 3, value: "电信" },
            { key: 4, value: "国际" },
          ],
        },
        {
          type: "select",
          label: "商家名称",
          key: "corpUserId",
          optionData: [],
        },
        {
          type: "select",
          label: "号码状态",
          key: "numberStatus",
          optionData: [
            { key: 0, value: "空闲" },
            { key: 1, value: "已分配" },
            { key: 2, value: "停用" },
          ],
        },
        {
          type: "select",
          label: "线路名称",
          key: "lineId",
          optionData: [],
        },
        { type: "input", label: "号码", key: "operaNumber" },
        { type: "select", label: "商户账号", key: "userId", optionData: [] },
        {
          type: "select",
          label: "号码归属地区",
          key: "privince",
          optionData: [],
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
        namespace: "inboundcfg",
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
          type: "select",
          label: "供应商公司",
          key: "corpId",
          optionData: [],
        },
        {
          type: "select",
          label: "供应商账户",
          key: "supplyId",
          optionData: [],
        },
        {
          type: "select",
          label: "线路名称",
          key: "lineId",
          colSpan: 12,
          optionData: [],
        },
        {
          type: "select",
          label: "线路类型",
          key: "lineType",
          colSpan: 12,
          disabled: true,
          defaultValue: "",
          optionData: [
            { key: 0, value: "直连" },
            { key: 1, value: "第三方" },
          ],
        },
        {
          type: "select",
          label: "号码归属地区",
          key: "privince",
          colSpan: 12,
          disabled: false,
          defaultValue: "",
          optionData: [],
        },
        {
          type: "select",
          label: "号码归属运营商",
          key: "operaId",
          colSpan: 12,
          disabled: false,
          defaultValue: "",
          optionData: [
            // { key: 0, value: "非法" },
            { key: 1, value: "移动" },
            { key: 2, value: "联通" },
            { key: 3, value: "电信" },
            // { key: 4, value: "国际" },
          ],
        },
        {
          type: "input",
          label: "单号码月租（元）",
          key: "numberCost",
          defaultValue: "",
        },
        // {
        //   type: "uploadXlsx",
        //   label: "运营商号码",
        //   key: "operaNumber",
        //   uploadUrl:'https://jsonplaceholder.typicode.com/posts/',
        //   defaultValue: "",
        // },
        {
          type: "fileUpload",
          label: "运营商号码",
          key: "file",
          defaultValue: "",
        },
      ],
      id: "",
      allocationConfig: [
        {
          type: "select",
          label: "供应商公司",
          key: "supplyName",
          disabled: true,
          optionData: [],
        },
        {
          type: "select",
          label: "供应商公司",
          key: "supplyId",
          disabled: true,
          isShow:true,
          optionData: [],
        },
        {
          type: "select",
          label: "线路名称",
          key: "lineId",
          disabled: true,
          optionData: [],
        },
        {
          type: "select",
          label: "号码归属地区",
          key: "privince",
          colSpan: 12,
          disabled: true,
          optionData: [],
        },
        {
          type: "select",
          label: "号码归属运营商",
          key: "operaId",
          colSpan: 12,
          disabled: true,
          optionData: [
            { key: 1, value: "移动" },
            { key: 2, value: "联通" },
            { key: 3, value: "电信" },
          ],
        },
        {
          type: "input",
          label: "运营商号码",
          key: "operaNumber",
          disabled: true,
          defaultValue: "",
        },
        {
          type: "divider",
        },
        {
          type: "select",
          label: "使用商家",
          key: "corpUserId",
          optionData: [],
        },
        {
          type: "select",
          label: "商家账户",
          key: "userId",
          optionData: [],
        },
        {
          type: "select",
          label: "路由类型",
          key: "routeType",
          colSpan: 12,
          optionData: [
            { key: 2, value: "技能组" },
            { key: 1, value: "IVR" },
          ],
        },
        {
          type: "select",
          label: "流程名称",
          key: "sceneId",
          colSpan: 12,
          optionData: [],
        },
        {
          type: "checkbox",
          label: "周天",
          key: "weekDays",
          colSpan: 24,
          defaultValue: [],
          optionData: [
            { key: "1", value: "星期一" },
            { key: "2", value: "星期二" },
            { key: "3", value: "星期三" },
            { key: "4", value: "星期四" },
            { key: "5", value: "星期五" },
            { key: "6", value: "星期六" },
            { key: "0", value: "星期日" },
          ],
        },
        {
          type: "dates",
          label: "日期",
          defaultValue: "",
          key: "dates",
          colSpan: 24,
        },
        {
          type: "times",
          label: "时间段1",
          defaultValue: "",
          key: "time1",
          colSpan: 24,
        },
        {
          type: "times",
          label: "时间段2",
          defaultValue: "",
          key: "time2",
          colSpan: 24,
          rules: [],
        },
        {
          type: "times",
          label: "时间段3",
          defaultValue: "",
          key: "time3",
          colSpan: 24,
          rules: [],
        },
      ],
      allocationVisible: false,
      multipleSelection: [],
      lineList: [],
    };
  },
  created() {},
  mounted() {
    this.queryCorpByCorpType();
    this.getUser();
    this.provincecity();
    this.linecfgList();
    this.listAll();
  },
  activated() {
    this.queryCorpByCorpType();
    this.getUser();
    this.provincecity();
    this.linecfgList();
    this.listAll();
  },
  computed: {},
  methods: {
    /* -------------------------分配号码操作处理------------------------- */
    /* 
    获取分配号码流程名称数据
    corpId：商户账号ID
    processType：路由类型
    */
    listScene(corpId, processType) {
      var data = {
        data: {
          corpId,
          processType,
        },
        version: "1.0",
      };
      this.$http.outbound.listScene(data).then((res) => {
        if (res.state === "200") {
          this._setDefaultValue(
            this.allocationConfig,
            res.data,
            "sceneId",
            "sceneId",
            "sceneName"
          );
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //获取分配号码商家公司下拉
    getUser() {
      this.$http.select.queryCorpByCorpType({ corpType: 0 }).then((res) => {
        this._setDefaultValue(
          this.allocationConfig,
          res.data.records,
          "corpUserId",
          "corpId",
          "corpName"
        );
        this._setDefaultValue(
          this.searchFormConfig,
          res.data.records,
          "corpUserId",
          "corpId",
          "corpName"
        );
      });
    },
    // 获取分配号码商家账号下拉数据
    listAll(corpId) {
      this.$http.corpUser.list({ enablePage: false, corpId }).then((res) => {
        if (corpId) {
          this._setDefaultValue(
            this.allocationConfig,
            res.data.records,
            "userId",
            "userId",
            "userName"
          );
        } else {
          this._setDefaultValue(
            this.searchFormConfig,
            res.data.records,
            "userId",
            "userId",
            "userName"
          );
        }
      });
    },
    // 分配号码下拉操作处理
    selectChange({ val, item }) {
      if (item.key === "corpUserId") {
        let routeType = this._getFormKeyData(this.allocationConfig, "routeType");
        if (val) {
          this.listAll(val);
          this.listScene(val,routeType);
          this._deleteDefaultValue(this.allocationConfig, "userId");
          this._deleteDefaultValue(this.allocationConfig, "sceneId");
        } else {
          this._setDefaultValue(
            this.allocationConfig,
            [],
            "userId",
            "supplyId",
            "userName"
          );
          this._setDefaultValue(
            this.allocationConfig,
            [],
            "sceneId",
            "sceneId",
            "sceneName"
          );

          this._deleteDefaultValue(this.allocationConfig, "userId");
          this._deleteDefaultValue(this.allocationConfig, "sceneId");
        }
      }
      // if (item.key === "userId") {
      //   let routeType = this._getFormKeyData(
      //     this.allocationConfig,
      //     "routeType"
      //   );
      //   if (val) {
      //     if (routeType) {
      //       this._deleteDefaultValue(this.allocationConfig, "sceneId");
      //       this.listScene(corpId, val);
      //     }
      //   } else {
      //     this._setDefaultValue(
      //       this.allocationConfig,
      //       [],
      //       "sceneId",
      //       "sceneId",
      //       "sceneName"
      //     );
      //     this._deleteDefaultValue(this.allocationConfig, "sceneId");
      //   }
      // }
      if (item.key === "routeType") {
        let corpId = this._getFormKeyData(this.allocationConfig, "corpUserId");
        if (corpId) {
          if (val) {
            this._deleteDefaultValue(this.allocationConfig, "sceneId");
            this.listScene(corpId, val);
          } else {
            this._setDefaultValue(
              this.allocationConfig,
              [],
              "sceneId",
              "sceneId",
              "sceneName"
            );
            this._deleteDefaultValue(this.allocationConfig, "sceneId");
          }
        } else {
          this.$message.error("请先选择使用商家");
          this._setDefaultValue(
            this.allocationConfig,
            [],
            "sceneId",
            "sceneId",
            "sceneName"
          );
          this._deleteDefaultValue(this.allocationConfig, "sceneId");
        }

        if (val) {
          // console.log(this._getFormKeyData(this.allocationConfig,'corpId'),'--------_getFormKeyData获取企业ID')
        } else {
        }
      }
    },
    // 分配号码提交
    submitAllocation(form) {
      form.inId = this.multipleSelection[0].inId;
      form.startDate = form.dates[0];
      form.stopDate = form.dates[1];
      form.callTime1Start = form.time1[0];
      form.callTime1End = form.time1[1];
      form.callTime2Start = form.time2 ? form.time2[0] : null;
      form.callTime2End = form.time2 ? form.time2[1] : null;
      form.callTime3Start = form.time3 ? form.time3[0] : null;
      form.callTime3End = form.time3 ? form.time3[1] : null;

      this.$http.inboundcfg.put({ data: { ...form } }).then((res) => {
        if (res.state == 200) {
          this.$message.success(res.msg);
          this._mxGetList();
          this.allocationVisible = false;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //分配号码取消操作
    cancelAllocation() {
      this.allocationVisible = false;
      setTimeout(() => {
        this.$refs.allocationForm.resetForm();
      }, 0);
    },
    //分配号码数据回显
    allocation() {
      if (
        this.multipleSelection.length === 0 ||
        this.multipleSelection.length > 1
      ) {
        this.$message.error("请选择一条数据");
      } else {
        this.allocationVisible = true;
        setTimeout(() => {
          this.$refs.allocationForm.resetForm();
          let row = this.multipleSelection[0];
          console.log(row,'=====row')
          if (row.corpUserId && row.corpUserId !== "-") {
            this.listAll(row.corpUserId);
            if (row.routeType && row.routeType !== "-") {
              this.listScene(row.corpUserId, row.routeType);
            } else {
              this._setDefaultValue(
                this.allocationConfig,
                [],
                "sceneId",
                "sceneId",
                "sceneName"
              );
            }
          } else {
            // this._setDefaultValue(
            //   this.allocationConfig,
            //   [],
            //   "userId",
            //   "userId",
            //   "userName"
            // );
            // this._setDefaultValue(
            //   this.allocationConfig,
            //   [],
            //   "sceneId",
            //   "sceneId",
            //   "sceneName"
            // );
            this._deleteDefaultValue(this.allocationConfig, "userId");
            this._deleteDefaultValue(this.allocationConfig, "sceneId");
          }
          this.linecfgList(row.supplyId);

          this.allocationConfig.forEach((item) => {
            for (let key in row) {
              if (item.key === key && row[key] !== "-") {
                this.$set(item, "defaultValue", row[key]);
              }
            }
            if (!Object.keys(row).includes(item.key)) {
              this.$set(item, "defaultValue", "");
            }
            if (item.key === "weekDays" && row["weekDays"] !== "-") {
              console.log(row["weekDays"], "======weekDays");
              this.$set(item, "defaultValue", JSON.parse(row["weekDays"]));
            }
            if (item.key === "userId" && row["userId"] === 0) {
              this.$set(item, "defaultValue", '');
            }
            if (
              item.key === "dates" &&
              row["startDate"] !== "-" &&
              row["stopDate"] !== "-"
            ) {
              this.$set(item, "defaultValue", [
                row["startDate"],
                row["stopDate"],
              ]);
            }
            if (
              item.key === "time1" &&
              row["callTime1Start"] !== "-" &&
              row["callTime1End"] !== "-"
            ) {
              this.$set(item, "defaultValue", [
                row["callTime1Start"],
                row["callTime1End"],
              ]);
            }
            if (
              item.key === "time2" &&
              row["callTime2Start"] !== "-" &&
              row["callTime2End"] !== "-"
            ) {
              this.$set(item, "defaultValue", [
                row["callTime2Start"],
                row["callTime2End"],
              ]);
            }
            if (
              item.key === "time3" &&
              row["callTime3Start"] !== "-" &&
              row["callTime3End"] !== "-"
            ) {
              this.$set(item, "defaultValue", [
                row["callTime3Start"],
                row["callTime3End"],
              ]);
            }
          });
          setTimeout(() => {
            this.$refs.allocationForm.clearValidate();
          }, 0);
        }, 0);
      }
    },

    /* ------------------新增号码操作处理-------------- */

    //新增号码获取供应商公司下拉
    queryCorpByCorpType() {
      this.$http.select.queryCorpByCorpType({ corpType: 2 }).then((res) => {
        this._setDefaultValue(
          this.formConfig,
          res.data.records,
          "corpId",
          "corpId",
          "corpName"
        );
        this._setDefaultValue(
          this.allocationConfig,
          res.data.records,
          "supplyId",
          "corpId",
          "corpName"
        );
        this._setDefaultValue(
          this.searchFormConfig,
          res.data.records,
          "corpId",
          "corpId",
          "corpName"
        );
      });
    },
    // 新增号码获取供应商账户
    corpListAll(corpId) {
      this.$http.select.corpListAll({ corpId }).then((res) => {
        this._setDefaultValue(
          this.formConfig,
          res.data.records,
          "supplyId",
          "supplyId",
          "userName"
        );
      });
    },
    // 新增号码获取线路下拉数据
    linecfgList(supplyId) {
      this.$http.select.linecfgList({ supplyId }).then((res) => {
        this.lineList = res.data;
        if (supplyId) {
          this._setDefaultValue(
            this.formConfig,
            res.data,
            "lineId",
            "lineId",
            "lineName"
          );
          this._setDefaultValue(
            this.allocationConfig,
            res.data,
            "lineId",
            "lineId",
            "lineName"
          );
        } else {
          this._setDefaultValue(
            this.searchFormConfig,
            res.data,
            "lineId",
            "lineId",
            "lineName"
          );
        }
      });
    },
    /**
     * 创建新增号码表单
     * @param row  当前行数据
     * @param id  当前行ID
     * @private
     */

    _mxCreate() {
      this.addChannel = true;
      this.formTit = "新增";
      this._setDisabledShow(this.formConfig, "privince", false);
      this._setDisabledShow(this.formConfig, "operaId", false);
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
    },

    //新增号码下拉操作数据处理
    addSelectChange({ val, item }) {
      if (item.key === "corpId") {
        if (val) {
          this.corpListAll(val);
          this._deleteDefaultValue(this.formConfig, "supplyId");
          this._deleteDefaultValue(this.formConfig, "lineId");
          this._deleteDefaultValue(this.formConfig, "lineType");
          this._deleteDefaultValue(this.formConfig, "privince");
          this._deleteDefaultValue(this.formConfig, "operaId");
        } else {
          this._setDefaultValue(this.formConfig, [], "supplyId");
          this._setDefaultValue(this.formConfig, [], "lineId");
          this._deleteDefaultValue(this.formConfig, "supplyId");
          this._deleteDefaultValue(this.formConfig, "lineId");
          this._deleteDefaultValue(this.formConfig, "lineType");
          this._deleteDefaultValue(this.formConfig, "privince");
          this._deleteDefaultValue(this.formConfig, "operaId");
        }
      }
      if (item.key === "supplyId") {
        if (val) {
          this.linecfgList(val);
          this._deleteDefaultValue(this.formConfig, "lineId");
          this._deleteDefaultValue(this.formConfig, "lineType");
          this._deleteDefaultValue(this.formConfig, "privince");
          this._deleteDefaultValue(this.formConfig, "operaId");
        } else {
          this._setDefaultValue(this.formConfig, [], "lineId");
          this._deleteDefaultValue(this.formConfig, "lineId");
          this._deleteDefaultValue(this.formConfig, "lineType");
          this._deleteDefaultValue(this.formConfig, "privince");
          this._deleteDefaultValue(this.formConfig, "operaId");
        }
      }
      if (item.key === "lineId") {
        if (val) {
          let lines = this.lineList.filter((item) => item.lineId === val);
          if (lines.length > 0) {
            let line = lines[0];
            const { lineType, operaId, province } = line;
            this.formConfig.forEach((item) => {
              if (item.key === "lineType") {
                this.$set(item, "defaultValue", lineType);
                item.defaultValue = lineType;
              }
              if (item.key === "privince") {
                this.$set(item, "defaultValue", province);
                item.defaultValue = province;
              }
              if (item.key === "operaId") {
                this.$set(item, "defaultValue", operaId);
                item.defaultValue = operaId;
              }
            });
            // 线路为第三方可以修改地区和运营商
            if (lineType === 0) {
              this._setDisabledShow(this.formConfig, "privince", true);
              this._setDisabledShow(this.formConfig, "operaId", true);
            } else {
              this._setDisabledShow(this.formConfig, "privince", false);
              this._setDisabledShow(this.formConfig, "operaId", false);
            }
          }
        } else {
          this._deleteDefaultValue(this.formConfig, "lineType");
          this._deleteDefaultValue(this.formConfig, "privince");
          this._deleteDefaultValue(this.formConfig, "operaId");
        }
      }
    },
    // 新增提交号码
    _mxHandleSubmit(form) {
      let params = this.jsonToFormData(form);
      this.$http.inboundcfg.batchcreate(params).then((res) => {
        if (res.state == 200) {
          this.$message.success(res.msg);
          this._mxGetList();
          this.addChannel = false;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //新增号码上传运营商号码处理
    changeFileUpload({ item, e }) {
      if (item.key === "file") {
        this.formConfig.forEach((i) => {
          if (i.key === item.key) {
            i.defaultValue = e.target.files[0];
          }
        });
      }
    },

    /* ---------------------页面操作处理------------------------ */

    //导出Excel
    exportNum() {
      this.downloadFileByFile(
        "/api/inboundcfg/exportExcel",
        this.searchParam,
        "号码"
      );
    },
    //删除呼入号码数据
    _mxDeleteItem() {
      if (this.multipleSelection.length === 0) {
        this.$message.error("请选择一条数据");
        return false;
      }
      const h = this.$createElement;
      this.$msgbox({
        title: "删除",
        message: h("div", null, [
          h("p", null, "您确定要删除此项吗？"),
          // h('p', {
          //     style: 'color: red'
          // }, '删除后，将不再执行重发，请谨慎操作')
        ]),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then((action) => {
          let params = this.multipleSelection
            .map((item) => item.inId)
            .join(",");
          const { namespace, detele } = this.searchAPI;
          this.$http[namespace][detele](params).then((res) => {
            if (resOk(res)) {
              this.$message.success("删除成功！");
              this.pageObj.currentPage = 1;
              this._mxGetList();
            } else {
              this.$message.error(res.msg || "删除失败！");
            }
          });
        })
        .catch(() => {});
    },
    //table 多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 获取号码归属地区
    provincecity(province) {
      this.$http.select.provincecity({ province }).then((res) => {
        this._setDefaultValue(
          this.formConfig,
          res.data,
          "privince",
          "province",
          "province"
        );
        this._setDefaultValue(
          this.allocationConfig,
          res.data,
          "privince",
          "province",
          "province"
        );
        this._setDefaultValue(
          this.searchFormConfig,
          res.data,
          "privince",
          "province",
          "province"
        );
      });
    },
  },
  watch: {},
};
</script>
<style lang="scss" scoped></style>
