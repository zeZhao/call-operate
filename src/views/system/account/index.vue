<template>
  <!-- 账户管理 -->
  <div class="account">
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
      <el-table-column prop="account" label="账号" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="roleName" label="对应角色" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="state" label="状态">
        <template slot-scope="{ row }">
          <span v-if="row.state == 1">有效</span>
          <span v-if="row.state == 0">无效</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button
            @click="_mxEdit(scope.row, 'suId')"
            type="text"
            size="small"
            >修改</el-button
          >
          <el-button @click="reset(scope.row)" type="text" size="small"
            >密码重置</el-button
          >
          <el-button
            @click="_mxDeleteItem('suId', scope.row.suId, false, false)"
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
      isParamsNotData: false,
      submitParamsIsData: false,
      // 搜索框配置
      searchFormConfig: [
        { type: "input", label: "登录账号", key: "account" },
        { type: "input", label: "姓名", key: "name" },
        // { type: "inputNum", label: "手机号", key: "mobile" },
        {
          type: "select",
          label: "状态",
          key: "state",
          optionData: [
            { key: "1", value: "有效" },
            { key: "0", value: "无效" },
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
        namespace: "sysUser",
        list: "list",
        add: "save",
        edit: "save",
        detele: "delete",
      },
      // 列表参数
      namespace: "",
      namespaceType: "Array",
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "姓名",
          key: "name",
          defaultValue: "",
        },
        {
          type: "input",
          label: "账号",
          key: "account",
          defaultValue: "",
        },
        {
          type: "password",
          label: "密码",
          key: "pwd",
          defaultValue: "",
        },
        {
          type: "select",
          label: "对应角色",
          key: "roleId",
          defaultValue: "",
          optionData: [],
        },
        {
          type: "select",
          label: "状态",
          key: "state",
          defaultValue: "",
          optionData: [
            { key: 1, value: "有效" },
            { key: 0, value: "无效" },
          ],
        },
      ],
      id: "",
    };
  },
  created() {},
  mounted() {
    this.getRoleLlist();
  },
  activated(){
    this.getRoleLlist();
  },
  computed: {},
  methods: {
    getRoleLlist() {
      this.$http.sysUser.sysRoleLlist({ current: 1, size: 999 }).then((res) => {
        this._setDefaultValue(
          this.formConfig,
          res.data.records,
          "roleId",
          "roleId",
          "roleName"
        );
      });
    },
    reset({ suId }) {
      this.$prompt("请输入新密码", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: null,
        inputErrorMessage: "密码格式不正确",
      })
        .then(({ value }) => {
          this.$http.sysUser.updatePwd({ suId, pwd: value }).then((res) => {
            if (res.state == 200) {
              this.$message.success("修改成功");
            } else {
              this.$message.success("修改失败");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    _mxCreate() {
      this.addChannel = true;
      this.formTit = "新增";
      this.id = "";
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
      this.formConfig.forEach((item) => {
        if (item.key === "pwd") {
          item.isShow = false;
        }
      });
    },
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
        }
        if (!Object.keys(row).includes(item.key)) {
          this.$set(item, "defaultValue", "");
        }
        if (item.key === "pwd") {
          item.isShow = true;
        }
      });
      setTimeout(() => {
        this.$refs.formItem.clearValidate();
      }, 0);
      this.addChannel = true;
    },
    /**
     * 提交表单操作
     * @param form    表单数据
     * @param editId        编辑修改id
     * @private
     */
    _mxHandleSubmit(form, editId, hasData = true) {
      editId = this.editId;
      form = this._mxArrangeSubmitData(form);
      const { namespace, add, edit } = this.searchAPI;
      let params = {};

      if (hasData && this.submitParamsIsData) {
        params = {
          data: {
            ...form,
          },
        };
      } else {
        params = {
          ...form,
        };
      }

      if (this.formTit == "新增") {
        this.$http[namespace][add](params).then((res) => {
          this._mxSuccess(
            res,
            hasData && this.submitParamsIsData ? params.data : params
          );
        });
      } else {
        if (hasData && this.submitParamsIsData) {
          params.data = Object.assign(params.data, {
            [editId]: this.id,
          });
        } else {
          params = Object.assign(params, {
            [editId]: this.id,
          });
        }

        // params.data[editId] = this.id
        // this.$set(params.data, editId, this.id)
        this.$http[namespace][edit](params).then((res) => {
          this._mxSuccess(
            res,
            hasData && this.submitParamsIsData ? params.data : params
          );
        });
      }
    },
    /**
     * 提交成功后执行
     * @param res
     */
    _mxSuccess(res, params) {
      if (resOk(res)) {
        this.$http.sysUser
          .addOrUpdateRole({ roleId: params.roleId, userId: res.data })
          .then((res) => {
            if (resOk(res)) {
              this.$message.success(res.msg || res.data);
              this._mxGetList();
              this.addChannel = false;
            }
          });
      } else {
        // console.log(111)
        this.$message.error(res.msg || res.data);
      }
    },
  },
  watch: {},
};
</script>
<style lang="scss" scoped></style>
