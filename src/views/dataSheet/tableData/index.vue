<style lang="scss" scoped>
.el-divider--horizontal {
  margin-top: 0;
}
</style>
<template>
  <div style="width:100%">
    <div id="outsideBox" v-if="$route.matched.length < 3">
      <div id="queryBox">
        <el-form :inline="true" class="demo-form-inline" size="small">
          <el-form-item label="商户名称：" v-if="!userType">
            <el-select
              v-model="query.clientId"
              clearable
              filterable
              placeholder="请选择商户名称"
              @change="selectClientId"
            >
              <el-option
                v-for="(item, index) in clientList"
                :label="item.corpName"
                :value="item.corpId"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数据表名称：">
            <el-select
              v-model="query.clientTableId"
              clearable
              filterable
              placeholder="请选择数据表名称"
              no-data-text="请先选择商户名称"
            >
              <el-option
                v-for="(item, index) in clientTableList"
                :label="item.clientTableCnName"
                :value="item.id"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="List('query')">查询</el-button>
            <el-button type="primary" @click="reset">重置</el-button>
          </el-form-item>
          <el-button
            size="small "
            type="primary"
            @click="exportTableData"
            style="float: right;margin-right:30px"
          >
            导出Excel
          </el-button>
          <el-button
            size="small "
            type="primary"
            @click="dialogVisible = true"
            style="float: right;margin-right:30px"
          >
            导入Excel
          </el-button>
        </el-form>
      </div>

      <div id="listBox">
        <el-table
          v-loading="loading"
          ref="filterTable"
          :data="tableData"
          max-height="500"
          style="width: 100%;"
          :header-cell-style="styleObj"
          empty-text="请先选择数据表名称"
        >
          <el-table-column
            label="序号"
            type="index"
            width="50"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="client_name"
            label="商户名称"
            min-width="150"
            :show-overflow-tooltip="true"
            v-if="!userType"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="table_name"
            label="数据表名称"
            min-width="150"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            align="center"
            :prop="item.tableEnColumn"
            :label="item.tableCnColumn"
            min-width="150"
            :show-overflow-tooltip="true"
            v-for="(item, index) in columnList"
            :key="index"
          >
          </el-table-column>
          <el-table-column align="center" label="操作" min-width="300">
            <template slot-scope="{ row, $index }">
              <el-button @click="delRow($index, row)" type="text" size="small"
                >删除</el-button
              >
              <el-divider direction="vertical"></el-divider>
              <el-button
                @click="NewlyEdit('', row, '编辑')"
                type="text"
                size="small"
                >编辑</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalNumber"
          :current-page="page"
          style="float: right;margin-right:30px"
          @current-change="pagingChange"
        ></el-pagination>
      </div>

      <!-- 新增,编辑弹框 -->
      <el-drawer :title="title" v-if="isNew" :visible.sync="isNew" size="40%">
        <div style="width:100%;padding:0 20px">
          <el-form
            ref="RuleForm"
            :rules="newRules"
            :inline="true"
            :model="RuleForm"
            label-position="top"
            label-width="90px"
            class="demo-form-inline"
            size="small"
          >
            <el-divider></el-divider>
            <el-form-item label="商户名称：" prop="clientId" v-if="!userType">
              <el-input v-model="RuleForm.clientName" disabled></el-input>
              <!-- <el-select
                v-model="RuleForm.clientId"
                clearable
                filterable
                placeholder="请选择商户"
                style="width:200px"
                @change="chooseClient"
              >
                <el-option
                  v-for="(item, index) in clientList"
                  :label="item.clientName"
                  :value="item.clientId"
                  :key="index"
                ></el-option>
              </el-select> -->
            </el-form-item>
            <el-form-item label="表名称：">
              <el-input
                v-model="RuleForm.chineseName"
                placeholder="请输入中文名称"
                style="width:100%"
                disabled
              ></el-input>
            </el-form-item>
            <h4 style="margin-bottom:10px">字段名称：</h4>
            <div
              v-for="(item, index) in fieldList"
              :key="index"
              class="surfaceQuery"
            >
              <el-form-item :label="`${item.tableCnColumn}：`">
                <el-input
                  v-model="item.value"
                  placeholder="请输入中文名称"
                ></el-input>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="demo-drawer__footer">
          <el-button @click="isNew = false" size="small">取 消</el-button>
          <el-button
            type="primary"
            :loading="SubmitLoading"
            @click="newSubmit('RuleForm')"
            size="small"
            >确 定</el-button
          >
        </div>
      </el-drawer>
      <el-dialog
        title="导入模板"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
      >
        <p style="margin-bottom:16px">
          请先<span @click="download" style="color:teal;cursor: pointer;"
            >下载模板</span
          >
        </p>
        <el-upload
          ref="importClientDataUpload"
          action="/api/client/table/importClientData"
          :on-remove="handleRemove"
          :on-success="handleAvatarSuccess"
          :headers="{ token: token }"
          :data="{ tableId: query.clientTableId }"
          multiple
          :limit="1"
        >
          <el-button size="small" type="primary">导入模板</el-button>
        </el-upload>
        <!-- <p style="margin-top:16px;color:#409EFF;cursor: pointer;">导入模板</p> -->
      </el-dialog>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
import axios from "axios";
import { setStorage, getStorage } from "@/utils/auth";
export default {
  data() {
    var self = this;
    var reg = new RegExp("^[0-9]*$");
    // 场景名称验证
    var sceneNameValidator = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("场景名称不能为空"));
      } else {
        if (this.RuleForm.sceneName !== "") {
          setTimeout(() => {
            self.$refs.RuleForm.validateField("sceneName");
          }, 1000);
        }
        callback();
      }
    };

    return {
      loading: false,
      SubmitLoading: false,
      title: "",
      styleObj: {
        background: "#eeeeee",
        color: "black",
        padding: "15",
      },
      clientList: [],
      tableData: [],
      columnList: [],
      page: 1,
      size: 10,
      totalNumber: 10, //分页总数
      isNew: false,
      query: {
        clientId: "",
        clientTableId: "",
      },
      //数据表列表
      clientTableList: [],
      // 新增 验证
      newRules: {
        sceneName: [
          {
            required: true,
            validator: sceneNameValidator,
            trigger: "blur",
          },
        ],
        validTalkTime: [
          {
            required: true,
            message: "请填写必填项",
            trigger: "blur",
          },
        ],
      },
      RuleForm: {
        clientId: "",
        clientName: "",
        chineseName: "",
        englishName: "",
      },
      sceneId: "", //修改id
      clientId: "", //商户id
      userType: "",
      templateData: [], //模本列表数据
      fieldList: [],
      dialogVisible: false,
      token: getStorage("token"),
    };
  },
  created() {
    this.userType = false;
    // this.List();
    // this.listClientTable();
    this.listClient();
  },

  components: {},

  computed: {
    // userType: () => {
    //   return this.$cookies;
    // },
  },

  methods: {
    handleAvatarSuccess(res, file) {
      if (res.state === "200") {
        this.$message.success("导入成功！");
        this.List();
        this.dialogVisible = false;
      } else {
        this.$message.error("导入失败！");
      }
      this.$refs.importClientDataUpload.clearFiles();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleClose() {
      this.dialogVisible = false;
      this.$refs.importClientDataUpload.clearFiles();
    },
    //下载模板
    download() {
      const { clientId, clientTableId } = this.query;
      if (clientTableId) {
        axios({
          method: "get",
          url: "/api/client/table/downloadExcelTemplate",
          params: {
            tableId: this.query.clientTableId,
          },
          headers:{token:this.token},
          responseType: "blob",
        }).then((res) => {
          let clientName = this.clientList.filter(
            (item) => item.corpId == clientId
          )[0].corpName;
          let clientTableCnName = this.clientTableList.filter(
            (item) => item.id == clientTableId
          )[0].clientTableCnName;
          let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel;charset=utf-8",
          });
          let url = window.URL.createObjectURL(blob);
          let aLink = document.createElement("a");
          aLink.style.display = "none";
          aLink.href = url;
          aLink.setAttribute(
            "download",
            `${clientName}（商户）-${clientTableCnName}-表数据模板.xlsx`
          );
          document.body.appendChild(aLink);
          aLink.click();
          document.body.removeChild(aLink);
          window.URL.revokeObjectURL(url);
        });
      } else {
        this.$message.error("请选择数据表");
      }
    },
    //导出
    exportTableData() {
      if (this.tableData.length == 0) {
        this.$message.error("没有数据");
      } else {
        axios({
          method: "get",
          url: "/rob/client/table/exportTableData",
          params: {
            tableId: this.query.clientTableId,
          },
          responseType: "blob",
        }).then((res) => {
          const { clientId, clientTableId } = this.query;
          let clientName = this.clientList.filter(
            (item) => item.corpId == clientId
          )[0].clientName;
          let clientTableCnName = this.clientTableList.filter(
            (item) => item.id == clientTableId
          )[0].clientTableCnName;
          let blob = new Blob([res], {
            type: "application/zip",
          });
          let url = window.URL.createObjectURL(blob);
          let aLink = document.createElement("a");
          aLink.style.display = "none";
          aLink.href = url;
          aLink.setAttribute(
            "download",
            `${clientName}（商户）-${clientTableCnName}-表数据.zip`
          );
          document.body.appendChild(aLink);
          aLink.click();
          document.body.removeChild(aLink);
          window.URL.revokeObjectURL(url);
        });
      }
    },
    /* 
    根据选择不同商户展示不同短信模板
    */
    chooseClient() {},

    /*
    删除
     */
    delRow(index, row) {
      const self = this;
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        var data = {
          data: {
            clientTableId: this.query.clientTableId,
            id: row.id,
          },
          version: "1.0",
        };
        self.$http.dataTable.deleteDoc(data).then((res) => {
          if (res.state == "200") {
            self.$message({
              type: "success",
              message: "删除成功!",
            });
            if (self.tableData.length == 1 && self.page != 0) {
              self.page = self.page - 1;
            }

            self.List();
          } else {
            self.$message.error(res.msg);
          }
        });
      });
    },
    /*
    新增 ,编辑显示
     */
    NewlyEdit(index, row, title) {
      this.isNew = true;
      this.title = title;
      this.sceneId = row.sceneId;
      this.clientId = row.clientId;
      if (title == "编辑") {
        this.fieldList = [];
        let keys = ["id", "table_id", "table_name", "client_name"];
        this.columnList.forEach((item) => {
          for (let key in row) {
            if (item.tableEnColumn === key) {
              this.fieldList.push({
                tableCnColumn: item.tableCnColumn,
                tableEnColumn: item.tableEnColumn,
                value: row[key],
              });
            }
          }
        });
        this.RuleForm = {
          clientName: row.client_name,
          chineseName: row.table_name,
          id: row.id,
        };
      }
    },
    /*
       新增,编辑 提交
     */
    newSubmit(formName) {
      const self = this;

      this.$refs[formName].validate((valid) => {
        if (valid) {
          self.SubmitLoading = true;
          // 修改
          if (self.title == "编辑") {
            let paramMap = {};
            this.fieldList.forEach((item) => {
              paramMap[item.tableEnColumn] = item.value;
            });
            var data = {
              data: {
                clientTableId: self.query.clientTableId,
                id: self.RuleForm.id,
                paramMap,
              },
              version: "1.0",
            };
            if (self.userType) {
              data.data.auditStatus = 1;
            }
            self.$http.dataTable.updateDoc(data).then((res) => {
              self.SubmitLoading = false;
              if (res.state == "200") {
                self.$message({
                  message: "编辑成功",
                  type: "success",
                });
                self.isNew = false; //关闭新增弹框
                self.List(); //重新请求列表
              } else {
                self.$message.error(res.msg);
              }
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /*
      分页
     */
    pagingChange(val) {
      this.page = val;
      this.List();
    },
    selectClientId(val) {
      this.query.clientTableId = "";
      this.listClientTable();
    },
    /*
      数据表列表
     */
    listClientTable() {
      const self = this;
      // if (this.query.clientId) {
      //   var data = {
      //     data: { clientId: this.query.clientId },
      //     version: "1.0",
      //   };
      // } else {
      //   var data = {
      //     data: {},
      //     version: "1.0",
      //   };
      // }
      var data = {
        data: { clientId: this.query.clientId },
        version: "1.0",
      };

      this.$http.dataTable.selectClientTable({ ...data }).then((res) => {
        if (res.state == "200") {
          self.clientTableList = res.data;
        } else {
          self.$message.error(res.msg);
        }
      });
    },
    /*
      商户列表
     */
    listClient() {
      const self = this;
      var data = {
        corpType: 0
      };
      this.$http.select.queryCorpByCorpType(data).then((res) => {
        if (res.state == "200") {
          self.clientList = res.data.records;
        } else {
          self.$message.error(res.msg);
        }
      });
    },

    /*
     列表
     */
    List(i) {
      const self = this;
      self.loading = true;
      if (i == "query") {
        self.page = 1;
      }
      var data = {
        data: {
          pageNumber: self.page - 1,
          pageSize: self.size,
          clientTableId: self.query.clientTableId,
          // clientTableId: 35,
          // clientId: self.query.clientId,
        },
        version: "1.0",
      };
      this.$http.dataTable.listClientTableData(data).then((res) => {
        self.loading = false;
        if (res.state == "200") {
          var arr = [];
          res.data.dataList.forEach((val) => {
            if (val.client_name === "null") {
              val.client_name = this.clientList.filter(
                (item) => item.corpId === this.query.clientId
              )[0].clientName;
            }
            arr.push(val);
          });
          self.tableData = arr;
          self.columnList = res.data.columnList;

          self.totalNumber = res.data.total;
        } else {
          self.$message.error(res.msg);
        }
      });
    },
    /*
    路由跳转
     */

    push(url, row) {
      var data = {
        data: {
          sceneId: row.sceneId,
        },
        version: "1.0",
      };
      this.$http.scene.skipSceneInformation(data).then((res) => {});
      this.$router.push({
        path: url,
        query: {
          clientId: row.clientId,
          sceneId: row.sceneId,
          asrEnable: row.asrEnable,
          auditStatus: row.auditStatus,
        },
      });
    },

    reset() {
      this.query.clientId = "";
      this.query.clientTableId = "";
    },
  },
};
</script>
<style lang="scss" scoped>
#outsideBox {
  width: 100%;
  padding: 20px;

  box-sizing: border-box;
  #listBox {
    width: 100%;
  }
  /deep/ .el-table td {
    padding: 7px 0;
  }
}
.demo-drawer__footer {
  width: 40%;
  position: fixed;
  bottom: 0;
  padding: 20px 0;
  display: flex;
  justify-content: center;
  background: #fff;
}
.form-tip {
  color: #aba8a8;
  font-size: 13px;
  margin-top: -18px;
  margin-bottom: 10px;
}
::v-deep .el-dialog__body {
  padding: 10px 20px 20px;
}
.surfaceQuery {
  width: 100%;
  ::v-deep .el-form-item {
    width: 100%;
    display: flex;
  }
  ::v-deep .el-form-item__label {
    width: 150px;
  }
}
::v-deep .el-drawer__body {
  overflow-y: auto;
}
::v-deep .el-form {
  margin-bottom: 60px;
}
</style>
