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
      <el-table-column prop="corpName" label="企业名称" />
      <el-table-column prop="shortName" label="登录账号" width="120">
        <template slot-scope="{row}">
          <span>{{row.jobNumber}}@{{row.shortName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="pwd" label="登录密码" />
      <el-table-column prop="attendName" label="坐席姓名" />
      <el-table-column prop="jobNumber" label="工号" />
      
      <el-table-column prop="roleName" label="角色" />
      <el-table-column prop="skillGroupName" label="归属技能组" />
      <el-table-column prop="roleType" label="坐席类型">
        <template slot-scope="{ row }">
          <span v-if="row.roleType == 0">企业管理员</span>
          <span v-if="row.roleType == 1">普通坐席</span>
          <span v-if="row.roleType == 2">班长坐席</span>
        </template>
      </el-table-column>
      <el-table-column prop="loginMode" label="坐席登录方式" width="120">
        <template slot-scope="{ row }">
          <span v-if="row.loginMode == 0">人工</span>
          <span v-if="row.loginMode == 1">自动</span>
        </template>
      </el-table-column>
      <el-table-column prop="attendState" label="坐席状态">
        <template slot-scope="{ row }">
          <span v-if="row.attendState == 1">未登录</span>
          <span v-if="row.attendState == 2">登录</span>
          <span v-if="row.attendState == 3">忙</span>
          <span v-if="row.attendState == 4">暂停</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="{ row }">
          <span v-if="row.status == 0">禁用</span>
          <span v-if="row.status == 1">启用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            @click="_mxEdit(scope.row, 'attendId')"
            type="text"
            size="small"
            >修改</el-button
          >
          <el-button
            @click="_mxDeleteItem('attendId', scope.row.attendId, false, false)"
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
    // 标签名称验证
    var tagNameValidator = (rule, value, callback) => {
      if (value) {
        let test = /^[\da-z]+$/i.test(value)
        if (!test) {
          callback(new Error("工号只能输入字母、数字!"));
        } else {
          callback();
        }
      } else {
        callback(new Error("工号不能为空!"));
      }
    };
    return {
      // 搜索框配置
      searchFormConfig: [
        { type: "select", label: "企业名称", key: "corpId",optionData:[] },
        { type: "input", label: "坐席名称", key: "attendName" },
        { type: "inputNum", label: "工号", key: "jobNumber" },
        {
          type: "select",
          label: "角色",
          key: "attendroleId",
          optionData: [
          ],
        },
        {
          type: "select",
          label: "归属技能组",
          key: "skillgroupId",
          optionData: [
          ],
        },
        {
          type: "select",
          label: "状态",
          key: "status",
          optionData: [
            { key: 0, value: "禁用" },
            { key: 1, value: "启用" },
          ],
        },
      ],
      isParamsNotData: false,
      submitParamsIsData: false,
      //搜索框数据
      searchParam: {},
      //接口地址
      searchAPI: {
        namespace: "attend",
        list: "list",
        add: "updateAndSaveAttend",
        edit: "updateAndSaveAttend",
        detele: "delete",
      },
      // 列表参数
      namespace: "",
      namespaceType: "Array",
      // 表单配置
      formConfig: [
        {
          type: "select",
          label: "企业名称",
          key: "corpId",
          defaultValue: "",
          optionData: [],
          disabled:false
        },
        {
          type: "input",
          label: "坐席姓名",
          key: "attendName",
          defaultValue: "",
        },
        {
          type: "input",
          label: "工号",
          key: "jobNumber",
          defaultValue: "",
          rules: [
            {
              required: true,
              validator: tagNameValidator,
              trigger: "blur",
            },
          ],
        },
        {
          type: "password",
          label: "密码",
          key: "pwd",
          defaultValue: "",
        },
        {
          type: "select",
          label: "坐席角色",
          key: "attendroleId",
          defaultValue: "",
          optionData: [
            // { key: 2, value: "普通坐席" },
            // { key: 1, value: "企业管理员" },
          ],
        },
        // {
        //   type: "select",
        //   label: "技能组",
        //   key: "skillGroupName",
        //   defaultValue: "",
        //   optionData:[
        //     {key:0,value:'人工'},
        //     {key:1,value:'自动'},
        //   ],
        // },
        {
          type: "select",
          label: "坐席登录方式",
          key: "loginMode",
          defaultValue: "",
          optionData: [
            { key: 0, value: "人工" },
            { key: 1, value: "自动" },
          ],
        },
        {
          type: "select",
          label: "状态",
          key: "status",
          defaultValue: "",
          optionData: [
            { key: 1, value: "启用" },
            { key: 0, value: "禁用" },
          ],
        },
      ],
      id: "",
      userList: [],
    };
  },
  created() {},
  mounted() {
    this.getCorpList();
    this.getRoleList();
    this.skillGroupListAll();
  },
  activated() {
    this.getCorpList();
    this.getRoleList();
    this.skillGroupListAll();
  },
  computed: {},
  methods: {
    //获取公司下拉
    // corpType（0:商家,1:代理商,2:供应商）
    getCorpList(corpType) {
      this.$http.select.queryCorpByCorpType({ corpType:"0" }).then((res) => {
        this._setDefaultValue(
            this.formConfig,
            res.data.records,
            "corpId",
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
    selectChange({ val, item }) {
      const {key} = item
      if (key === "corpId") {
        if (val) {
          this._setDefaultValue(
            this.formConfig,
            [],
            "attendroleId",
            "roleId",
            "roleName"
          );
          this._deleteDefaultValue(this.formConfig, "attendroleId");
          this.getRoleList(val);
          // this.userList.forEach((item) => {
          //   if (item.userId === val) {
          //     console.log(item.corpId,'======shanghugongsi ')
          //     this.getRoleList(item.corpId);
          //   }
          // });
        } else {
          this._setDefaultValue(
            this.formConfig,
            [],
            "attendroleId",
            "roleId",
            "roleName"
          );
          this._deleteDefaultValue(this.formConfig, "attendroleId");
        }
      }
    },
    skillGroupListAll(){
      this.$http.select.IVRlistAll().then(res=>{
        this._setDefaultValue(
          this.searchFormConfig,
          res.data,
          "skillgroupId",
          "sgId",
          "skillGroupName"
        );
      })
    },
    //获取商家账户下拉
    // queryCorpByCorpType() {
    //   this.$http.select.userListAll({ corpType: 0 }).then((res) => {
    //     this.userList = res.data.records;
    //     this._setDefaultValue(
    //       this.formConfig,
    //       res.data.records,
    //       "userId",
    //       "userId",
    //       "userName"
    //     );
    //     this._setDefaultValue(
    //       this.searchFormConfig,
    //       res.data.records,
    //       "userName",
    //       "userName",
    //       "userName"
    //     );
    //   });
    // },
    //获取坐席角色
    getRoleList(corpId) {
      this.$http.role.list({ enablePage: false, corpId}).then((res) => {
        if(corpId){
          this._setDefaultValue(
          this.formConfig,
          res.data.list,
          "attendroleId",
          "roleId",
          "roleName"
        );
        }else{
          this._setDefaultValue(
          this.searchFormConfig,
          res.data.list,
          "attendroleId",
          "roleId",
          "roleName"
        );
        }
        
        
      });
    },
    // _mxArrangeSubmitData(formData) {  
    //   // let form = Object.assign({}, formData);
    //   // let userId = form.userId;
    //   // if (userId) {
    //   //   this.userList.forEach((item) => {
    //   //     if (item.userId === userId) {
    //   //       form.corpId = item.corpId;
    //   //     }
    //   //   });
    //   // }
    //   return form;
    // },
    _mxCreate() {
      this.addChannel = true;
      this.formTit = "新增";
      setTimeout(() => {
        this.$refs.formItem.resetForm();
        this._setDisabledShow(this.formConfig,'corpId',false)
      }, 0);
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
      this.formConfig.forEach(item => {
        for (let key in row) {
          if (item.key === key && row[key] !== "-") {
            this.$set(item, "defaultValue", row[key]);
          }
        }
        if (!Object.keys(row).includes(item.key)) {
          this.$set(item, "defaultValue", "");
        }
        if(item.key === 'corpId'){
          this.getRoleList(item.defaultValue);
          item.disabled = true
        }
      });
      setTimeout(() => {
        this.$refs.formItem.clearValidate();
      }, 0);
      this.addChannel = true;
    },
  },
  watch: {},
};
</script>
<style lang="scss" scoped></style>
