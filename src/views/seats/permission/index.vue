<template>
  <!-- 角色及权限 -->
  <div class="permission">
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
      <el-table-column prop="roleName" label="角色名称" />
      <el-table-column prop="remarks" label="描述" />
      <el-table-column prop="status" label="坐席类型">
        <template slot-scope="{ row }">
          <span v-if="row.roleType == 0">企业管理员</span>
          <span v-if="row.roleType == 1">普通坐席</span>
          <span v-if="row.roleType == 2">班长坐席</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="{ row }">
          <span v-if="row.status == 0">禁用</span>
          <span v-if="row.status == 1">启用</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间"
        ><template slot-scope="{ row }">
          <span>{{ row.createTime | dateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            @click="_mxEdit(scope.row, 'roleId')"
            type="text"
            size="small"
            >修改</el-button
          >
          <el-button
            @click="jurisdictionBtn(scope.row)"
            type="text"
            size="small"
            >权限</el-button
          >
          <el-button
            @click="_mxDeleteItem('roleId', scope.row.roleId, false, false)"
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
    <el-dialog
      title="权限分配"
      :visible.sync="jurisdictionVisible"
      :close-on-click-modal="false"
      top="45px"
    >
      <el-tree
        ref="tree"
        :data="treeData"
        :props="defaultProps"
        node-key="menuId"
        :default-checked-keys="defaultCheckedList"
        show-checkbox
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="jurisdictionVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitTree">确 定</el-button>
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
        { type: "input", label: "角色名称", key: "roleName" },
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
        namespace: "role",
        list: "list",
        add: "post",
        edit: "put",
        detele: "del",
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
        },
        {
          type: "input",
          label: "角色名称",
          key: "roleName",
          defaultValue: "",
        },
        {
          type: "radio",
          label: "坐席类型",
          key: "roleType",
          defaultValue: "",
          optionData: [
            { key: 0, value: "企业管理员" },
            { key: 1, value: "普通坐席" },
            { key: 2, value: "班长坐席" },
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
        {
          type: "textarea",
          label: "备注",
          key: "remarks",
          rules: [],
          defaultValue: "",
        },
      ],
      id: "",
      jurisdictionVisible: false,
      treeData: [],
      defaultCheckedList: [],
      defaultProps: {
        children: "childMenu",
        label: "name",
      },
      roleId: "",
      corpId: "",
      userList:[]
    };
  },
  created() {},
  mounted() {
    // this.getSysMenuList();
    this.getCorpList();
  },
  activated(){
    this.getCorpList();
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
        
      });
    },
    getSysMenuList() {
      this.$http.role.sysMenuList().then((res) => {
        let arr = [];
        res.data.forEach((item) => {
          if (item.type === 1) {
            arr.push(item);
          }
        });
        this.treeData = arr;
        console.log(res);
      });
    },
    sysRoleMenuList(roleId) {
      this.defaultCheckedList = [];
      this.$http.role.permissionsList({ roleId }).then((res) => {
        let arr = [];
        let checkedList = [];
        res.data.forEach((item) => {
          if (item.type === 1) {
            arr.push(item);
          }
        });
        console.log(res, "===============");
        this.treeData = arr;
        arr.forEach((item) => {
          if (item.childMenu && item.childMenu.length > 0) {
            item.childMenu.forEach((i) => {
              if (i.ifChecked == 1) {
                checkedList.push(i.menuId);
              }
            });
          } else {
            if (item.ifChecked == 1) {
              checkedList.push(item.menuId);
            }
          }
        });
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(checkedList);
          this.defaultCheckedList = checkedList;
        });
      });
    },
    jurisdictionBtn(row) {
      const { roleId, corpId } = row;
      this.roleId = roleId;
      this.corpId = corpId;
      this.jurisdictionVisible = true;
      // console.log(row, "====");

      this.sysRoleMenuList(roleId);
    },
    submitTree() {
      let arr = this.$refs.tree.getCheckedKeys();
      this.$http.role
        .permissionsPost({
          roleId: this.roleId,
          corpId: this.corpId,
          menuIdList: arr,
        })
        .then((res) => {
          if (res.state === '200') {
            this.jurisdictionVisible = false;
            this.roleId = "";
            this.$message.success('操作成功！')
          }else{
            this.$message.error(res.msg)
          }
        });
    },
    /**
     * 提交表单前调整表单内数据
     * @param formData
     * @private
     */
    _mxArrangeSubmitData(formData) {
      // const {userId} = formData
      // this.userList.forEach(item=>{
      //   if(item.userId == userId){
      //     formData.corpId = item.corpId
      //   }
      // })
      // console.log(formData,'=================')
      return formData;
    },
  },
  watch: {},
};
</script>
<style lang="scss" scoped></style>
