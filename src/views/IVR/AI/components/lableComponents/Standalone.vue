<style lang="scss" scoped>
.el-divider--horizontal {
  margin-top: 0;
}
</style>
<template>
  <div>
    <div style="width:100%;text-align: right;">
      <el-button
        size="small "
        type="primary"
        @click="NewlyEdit"
        :disabled="auditStatus"
        style="margin-right:30px"
      >
        新增
        <i class="el-icon-plus"></i>
      </el-button>
    </div>

    <div id="listBox">
      <el-table
        v-loading="loading"
        ref="filterTable"
        :data="tableData"
        style="width: 100%;"
        :header-cell-style="styleObj"
      >
        <el-table-column
          align="center"
          prop="tagId"
          label="标签ID"
          min-width="80"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="tagName"
          label="标签名称"
          min-width="150"
          :show-overflow-tooltip="true"
        ></el-table-column>

        <el-table-column
          align="center"
          prop="tagDesc"
          label="标签说明"
          min-width="100"
          :show-overflow-tooltip="true"
        ></el-table-column>

        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              @click="edit(scope.$index, scope.row)"
              type="text"
              size="small"
              :disabled="auditStatus"
              >编辑</el-button
            >
            <el-button
              @click="LabelDel(scope.$index, scope.row)"
              type="text"
              size="small"
              :disabled="auditStatus"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增弹框 -->
    <el-drawer :title="title" v-if="isNew" :visible.sync="isNew" size="30%">
      <div style="width:100%;padding:0 20px">
        <el-form
          ref="RuleForm"
          :rules="newRules"
          :inline="true"
          :model="RuleForm"
          label-position="left"
          label-width="110px"
          class="demo-form-inline"
          size="small"
        >
          <el-divider></el-divider>
          <el-form-item label="标签名称：" prop="tagName">
            <el-input
              v-model.trim="RuleForm.tagName"
              maxlength="20"
              placeholder="请输入标签名称"
              show-word-limit
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="标签代码：" prop="tagCode">
            <el-input v-model="RuleForm.tagCode" placeholder="请输入标签代码"></el-input>
          </el-form-item>-->

          <el-form-item label="标签说明：">
            <el-input
              type="textarea"
              :rows="5"
              :cols="50"
              v-model="RuleForm.tagDesc"
              placeholder="请输入标签说明"
              maxlength="100"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="demo-drawer__footer">
        <el-button @click="isNew = false" size="small">取 消</el-button>
        <el-button type="primary" @click="LabelAdd('RuleForm')" size="small"
          >确 定</el-button
        >
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  props: {
    auditStatus: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    var self = this;

    // 标签名称验证
    var tagNameValidator = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("标签名称不能为空"));
      } else {
        if (this.RuleForm.tagName !== "") {
          setTimeout(() => {
            self.$refs.RuleForm.validateField("tagName");
          }, 1000);
        }
        callback();
      }
    };
    // 标签名称验证
    var tagCodeValidator = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("标签代码不能为空"));
      } else {
        if (this.RuleForm.tagCode !== "") {
          setTimeout(() => {
            self.$refs.RuleForm.validateField("tagCode");
          }, 1000);
        }
        callback();
      }
    };
    return {
      title: "创建标签",
      loading: true,
      styleObj: {
        background: "#eeeeee",
        color: "black",
        padding: "15",
      },
      isNew: false,
      newRules: {
        tagName: [
          {
            required: true,
            validator: tagNameValidator,
            trigger: "blur",
          },
        ],
        tagCode: [
          {
            required: true,
            validator: tagCodeValidator,
            trigger: "blur",
          },
        ],
      },
      RuleForm: {
        tagName: "",
        tagCode: "",
        sceneId: "",
        tagDesc: "",
      },
      sceneId: "",
      tableData: [],
    };
  },
  created() {
    this.sceneId = this.$route.query.sceneId;
    this.LabelLis();
  },
  components: {},

  computed: {},

  methods: {
    /*
    编辑提交
     */
    editSub() {
      const self = this;
      var data = {
        data: {
          sceneId: self.sceneId,
          tagName: self.RuleForm.tagName,
          tagCode: self.RuleForm.tagCode,
          tagId: self.RuleForm.tagId,
          tagDesc: self.RuleForm.tagDesc,
        },
        version: "1.0",
      };
      this.$http.scene.updateTag(data).then((res) => {
        if (res.state == "200") {
          self.$message({
            type: "success",
            message: "编辑成功!",
          });
          self.LabelLis();
          self.isNew = false;
        } else {
          self.$message.error(res.msg);
        }
      });
    },
    /*
    编辑
     */
    edit(index, row) {
      this.isNew = true;
      this.title = "编辑标签";
      this.RuleForm = {
        tagName: row.tagName,
        tagCode: row.tagCode,
        tagId: row.tagId,
        sceneId: this.sceneId,
        tagDesc: row.tagDesc,
      };
    },
    /*
    新增
     */

    NewlyEdit() {
      this.isNew = true;
      this.title = "创建标签";
      this.RuleForm = {
        tagName: "",
        tagCode: "",
        sceneId: this.sceneId,
        tagDesc: "",
      };
    },
    /*
     标签列表删除
     */

    LabelDel(index, row) {
      const self = this;
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        var data = {
          data: {
            tagId: row.tagId,
          },
          version: "1.0",
        };
        this.$http.scene.deleteTag(data).then((res) => {
          if (res.state == "200") {
            self.LabelLis();
            self.$message({
              type: "success",
              message: "删除成功!",
            });
          } else {
            self.$message.error(res.msg);
          }
        });
      });
    },
    /*
     标签列表添加
     */

    LabelAdd(formName) {
      const self = this;

      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (self.title == "创建标签") {
            var data = {
              data: {
                sceneId: self.sceneId,
                tagName: self.RuleForm.tagName,
                tagCode: self.RuleForm.tagCode,
                tagDesc: self.RuleForm.tagDesc,
              },
              version: "1.0",
            };
            this.$http.scene.addTag(data).then((res) => {
              if (res.state == "200") {
                self.$message({
                  type: "success",
                  message: "添加成功!",
                });
                self.RuleForm = {
                  tagName: "",
                  tagCode: "",
                  sceneId: "",
                  tagDesc: "",
                };
                self.LabelLis();
                self.isNew = false;
              } else {
                self.$message.error(res.msg);
              }
            });
          }
          // 编辑
          else {
            var data = {
              data: {
                sceneId: self.sceneId,
                tagName: self.RuleForm.tagName,
                tagCode: self.RuleForm.tagCode,
                tagId: self.RuleForm.tagId,
                tagDesc: self.RuleForm.tagDesc,
              },
              version: "1.0",
            };
            this.$http.scene.checkBranchIsHaveTag(data).then((res) => {
              if (res.state == "200") {
                if (res.data) {
                  this.$confirm(
                    "有关联，是否要继续，续续的话会影响已有标签为空",
                    "提示",
                    {
                      confirmButtonText: "确定",
                      cancelButtonText: "取消",
                      type: "warning",
                    }
                  ).then(() => {
                    this.editSub();
                  });
                } else {
                  this.editSub();
                }
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
     标签列表
     */

    LabelLis() {
      const self = this;

      var data = {
        data: {
          sceneId: self.sceneId,
        },
        version: "1.0",
      };
      this.$http.scene.listTagBySceneId(data).then((res) => {
        if (res.state == "200") {
          self.loading = false;
          self.tableData = res.data;
        } else {
          self.$message.error(res.msg);
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
#listBox {
  margin-top: 20px;
}
.demo-drawer__footer {
  width: 30%;
  position: fixed;
  bottom: 0;
  padding: 20px 0;
  display: flex;
  justify-content: center;
}
</style>
