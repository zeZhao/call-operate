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
              v-model="query.clientName"
              clearable
              filterable
              placeholder="请选择商户名称"
            >
              <el-option
                v-for="(item, index) in clientList"
                :label="item.corpName || item.corpId"
                :value="item.corpName"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数据表名称：">
            <el-input
              v-model="query.clientTableCnName"
              placeholder="输入数据表名称"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="List('query')">查询</el-button>
            <el-button type="primary" @click="reset">重置</el-button>
          </el-form-item>
          <el-button
            size="small "
            type="primary"
            @click="NewlyEdit('', '', '新增')"
            style="float: right;margin-right:30px"
          >
            新增
            <i class="el-icon-plus"></i>
          </el-button>
        </el-form>
      </div>

      <div id="listBox">
        <el-table
          v-loading="loading"
          ref="filterTable"
          :data="tableData"
          max-height="600"
          style="width: 100%;"
          border
        >
          <el-table-column
            label="序号"
            type="index"
            width="50"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="clientName"
            label="商户名称"
            min-width="150"
            :show-overflow-tooltip="true"
            v-if="!userType"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="clientTableCnName"
            label="数据表名称"
            min-width="150"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="userName"
            label="创建账号"
            min-width="150"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="createTime"
            label="创建时间"
            min-width="170"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column align="center" label="操作" min-width="300">
            <template slot-scope="{ row, $index }">
              <el-button
                @click="delRow($index, row)"
                type="text"
                size="small"
                v-if="
                  (row.auditStatus !== 2) ||
                    !userType
                "
                >删除</el-button
              >
              <el-divider
                direction="vertical"
              ></el-divider>
              <el-button
                @click="
                  NewlyEdit('', row, '编辑')
                "
                type="text"
                size="small"
                >详情</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNumber"
          :current-page="page"
          style="float: right;margin-right:30px;margin-top:20px"
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
              <el-select
                v-model="RuleForm.clientId"
                clearable
                filterable
                placeholder="请选择商户"
                style="width:200px"
                @change="chooseClient"
              >
                <el-option
                  v-for="(item, index) in clientList"
                  :label="item.corpName"
                  :value="item.corpId"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="表名称：" prop="tableName">
              <el-input
                v-model="RuleForm.tableName"
                placeholder="请输入中文名称"
                style="width:48%;margin-right:4%"
              ></el-input>
              <el-input
                v-model="RuleForm.enTableName"
                placeholder="请输入英文名称"
                style="width:48%"
              ></el-input>
            </el-form-item>
            <div
              v-for="(item, index) in columnList"
              :key="index"
              class="surfaceQuery"
            >
              <el-form-item :label="`字段名称${index + 1}：`">
                <el-input
                  v-model="item.tableCnColumn"
                  placeholder="请输入中文名称"
                ></el-input>
                <el-input
                  v-model="item.tableEnColumn"
                  placeholder="请输入英文名称"
                ></el-input>
                <el-select v-model="item.tableColumnType">
                  <!-- <el-option label="date" value="date"></el-option> -->
                  <el-option label="text" value="text"></el-option>
                </el-select>
                <i
                  class="el-icon-remove-outline"
                  style="font-size:20px;margin-right:5px"
                  @click="subtract(index)"
                  v-if="columnList.length !== 1"
                ></i>
                <i
                  class="el-icon-circle-plus"
                  style="font-size:20px"
                  @click="addQuery()"
                ></i>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="demo-drawer__footer" v-if="this.title !== '编辑'">
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
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
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
      loading: true,
      SubmitLoading: false,
      title: "",
      styleObj: {
        background: "#eeeeee",
        color: "black",
        padding: "15",
      },
      clientList: [],
      tableData: [],
      page: 1,
      size: 10,
      totalNumber: 10, //分页总数
      isNew: false,
      query: {
        clientName: "",
        clientTableCnName: "",
      },
      // 新增 验证
      newRules: {
        clientId: [
          {
            required: true,
            message: "请选择商户名称",
            trigger: "blur",
          },
        ],
        tableName: [
          {
            required: true,
            message: "请输入表名称",
            trigger: "blur",
          },
        ],
        enTableName: [
          {
            required: true,
            message: "请输入表名称",
            trigger: "blur",
          },
        ],
      },
      RuleForm: {
        clientId: "",
        tableName: "",
        enTableName: "",
      },
      sceneId: "", //修改id
      clientId: "", //商户id
      userType: "",
      columnList: [
        {
          tableCnColumn: "",
          tableEnColumn: "",
          tableColumnType: "text",
          sort: 1
        },
      ],
    };
  },
  created() {
    this.userType = false;
    this.List();
    this.listClient();
  },

  components: {},

  computed: {
    // userType: () => {
    //   return this.$cookies;
    // },
  },

  methods: {
    //新增修改添加字段名称
    addQuery() {
      let length = this.columnList.length;
      let num = this.columnList[length - 1].sort;
      this.columnList.push({
        tableCnColumn: "",
        tableEnColumn: "",
        tableColumnType: "text",
        sort: num + 1
      });
    },
    subtract(index) {
      this.columnList.splice(index, 1);
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
            clientTableId: row.id,
          },
          version: "1.0",
        };
        self.$http.dataSheet.deleteClientTable(data).then((res) => {
          if (res.state == "200") {
            self.$message({
              type: "success",
              message: "删除成功!",
            });

            self.List();
          } else {
            self.$message.error(res.msg);
          }
        });
      });
    },
    /*
       新增,编辑 提交
     */
    newSubmit(formName) {
      const self = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          self.SubmitLoading = true;
          if (self.title == "新增") {
            let columnMap = {};
            this.columnList.forEach((item) => {
              columnMap[item.tableEnColumn] = {
                columnName: item.tableCnColumn,
                columnType: item.tableColumnType,
                sort: item.sort
              };
            });
            var data = {
              data: {
                ...self.RuleForm,
                columnMap,
              },
              version: "1.0",
            };
            self.$http.dataSheet.createClientTable(data).then((res) => {
              self.SubmitLoading = false;
              if (res.state == "200") {
                self.$message({
                  message: "新增成功",
                  type: "success",
                });
                self.isNew = false; //关闭新增弹框

                self.List(); //重新请求列表
              } else {
                self.$message.error(res.msg);
              }
            });
          }
          // 修改
          else if (self.title == "编辑") {
            var data = {
              data: {
                clientId: self.RuleForm.clientId,
              },
              version: "1.0",
            };
            if (self.userType) {
              data.data.auditStatus = 1;
            }
            self.$http.scene.updateScene(data).then((res) => {
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
          } else {
            console.log("error submit!!");
            return false;
          }
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
    新增 ,编辑显示
     */
    NewlyEdit(index, row, title) {
      this.isNew = true;
      this.title = title;
      this.sceneId = row.sceneId;
      this.clientId = row.clientId;
      if (title == "编辑") {
        this.RuleForm = {
          clientId: row.clientId,
          tableName: row.clientTableCnName,
          enTableName: row.clientTableEnName,
        };
        this.columnList = row.columnList
      } else if (title == "新增") {
        this.RuleForm = {
          clientId: "",
          tableName: "",
          enTableName: "",
        };
        this.columnList = [
          {
            tableCnColumn: "",
            tableEnColumn: "",
            tableColumnType: "text",
            sort: 1
          },
        ];
      }
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
          pageNum: self.page,
          pageSize: self.size,
          ...self.query,
        },
        version: "1.0",
      };
      this.$http.dataSheet.listClientTableByPage(data).then((res) => {
        self.loading = false;
        if (res.state == "200") {
          var arr = [];
          res.data.list.forEach((val) => {
            val.createTime = new Date(val.createTime).Format('yyyy-MM-dd hh:mm:ss');
            arr.push(val);
          });
          self.tableData = arr;

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
    reset(){
      this.query.clientName = ''
      this.query.clientTableCnName = ''
    }
  },
};
</script>
<style lang="scss" scoped>
#outsideBox {
  width: 100%;
  // padding: 20px;

  box-sizing: border-box;
  #listBox {
    width: 100%;
  }
  // /deep/ .el-table td {
  //   padding: 7px 0;
  // }
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
.surfaceQuery {
  width: 100%;
  ::v-deep .el-form-item__content {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  ::v-deep .el-input,
  ::v-deep .el-select {
    width: 30%;
  }
  ::v-deep .el-select {
    .el-input {
      width: 100%;
    }
  }
}
::v-deep .el-drawer__body {
  overflow-y: auto;
}
// ::v-deep .el-form {
//   margin-bottom: 60px;
// }
</style>
