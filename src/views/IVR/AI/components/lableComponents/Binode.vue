<style lang="scss" scoped>
.el-divider--horizontal {
  margin-top: 0;
}
</style>
<template>
  <div>
    <div style="width:70%;float:left">
      <span style="color:red">可拖动调整判断顺序。</span>
      当以下所有规则均不满足时，讲客户设置为
      <el-select
        v-model="defaultTag"
        @change="changeTag"
        size="small"
        style="width:220px"
      >
        <el-option
          v-for="item in tableData"
          :key="item.tagId"
          :label="item.tagName"
          :value="item.tagName"
        ></el-option>
      </el-select>
    </div>
    <div style="width:20%;text-align: right;float:right">
      <el-button
        size="small "
        type="primary"
        @click="NewlyEdit"
        :disabled="auditStatus"
        style="margin-right:30px"
      >
        添加规则
        <i class="el-icon-plus"></i>
      </el-button>
    </div>
    <div style="clear: both;"></div>
    <div id="listBox1">
      <el-table
        v-loading="loading"
        ref="filterTable"
        :data="tableData"
        style="width: 100%;margin-top:20px"
        :header-cell-style="styleObj"
      >
        <el-table-column class-name="my-handle" width="50px" align="center">
          <template>
            <i class="el-icon-s-operation" style="font-size:20px"></i>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="sort"
          label="判断顺序"
          width="100"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="rule"
          label="规则"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="tagName"
          label="标签名称"
          :show-overflow-tooltip="true"
        ></el-table-column>

        <el-table-column
          align="center"
          prop="tagDesc"
          label="标签说明"
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
    <el-drawer :title="title" v-if="isNew" :visible.sync="isNew" size="50%">
      <div style="width:100%;padding:0 20px">
        <el-form
          ref="RuleForm"
          :rules="newRules"
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
              v-model="RuleForm.tagDesc"
              placeholder="请输入标签说明"
              maxlength="100"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="标签规则：">
            <el-button
              type="primary"
              v-if="supplementSettingsDOList.length === 0"
              @click="addSupplement"
              >添加变量</el-button
            >
            <div v-else>
              <div
                v-for="(item, index) in supplementSettingsDOList"
                :key="index"
              >
                <div class="surfaceQuery">
                  <el-select v-model="item.varName" placeholder="请选择">
                    <el-option
                      :value="item.key"
                      :label="item.value"
                      v-for="(item, index) in vallLisData"
                      :key="index"
                    ></el-option>
                  </el-select>
                  <el-select v-model="item.setType" placeholder="请选择">
                    <el-option
                      v-for="item in condition"
                      :value="item.key"
                      :label="item.value"
                      :key="item.key"
                    ></el-option>
                  </el-select>
                  <el-input
                    style="width:220px"
                    v-model="item.setValue"
                    placeholder="请输入次数"
                  ></el-input>
                  <i
                    class="el-icon-remove-outline"
                    style="font-size:20px;margin-right:5px"
                    @click="subtract(index)"
                  ></i>
                  <i
                    class="el-icon-circle-plus"
                    style="font-size:20px"
                    @click="addQuery()"
                  ></i>
                </div>
              </div>
            </div>
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
import Sortable from "sortablejs";
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
      defaultTag: "",

      vallLisData: [
        { value: "肯定次数", key: 1 },
        { value: "否定次数", key: 2 },
        { value: "拒绝次数", key: 3 },
        { value: "命中业务问题数", key: 4 },
        { value: "客户讲话次数", key: 5 },
        { value: "通话时长", key: 6 },
      ],
      condition: [
        { value: "大于", key: 1 },
        { value: "等于", key: 2 },
        { value: "小于", key: 3 },
        { value: "大于等于", key: 4 },
        { value: "小于等于", key: 5 },
      ],
      supplementSettingsDOList: [],
    };
  },
  created() {
    this.sceneId = this.$route.query.sceneId;
  },
  components: {},

  computed: {},
  mounted() {
    this.listTag();
    this.initSort();
  },

  methods: {
    changeTag(val) {
      const self = this;
      let data = {
        data: {
          sceneId: self.sceneId,
          tagType: 2,
          tagName: val,
        },
      };
      this.$http.scene.moreAddTag(data).then((res) => {
        if (res.state == "0000") {
          self.$message({
            type: "success",
            message: "修改默认标签成功!",
          });
          this.listTag();
        } else {
          if (res.state == "9000") {
            this.$Beoverdue(function(url) {
              self.$router.push({
                path: url,
              });
            }); //公共方法，utils.js
          }
          self.$message.error(res.msg);
        }
      });
    },
    //添加变量名称
    addSupplement() {
      this.supplementSettingsDOList = [
        {
          varName: "",
          setType: "",
          setValue: "",
        },
      ];
    },
    subtract(index) {
      this.supplementSettingsDOList.splice(index, 1);
    },
    addQuery() {
      this.supplementSettingsDOList.push({
        varName: "",
        setType: "",
        setValue: "",
      });
    },
    //拖拽初始化
    initSort() {
      const el = document.querySelectorAll(
        "#listBox1 .el-table__body-wrapper > table > tbody"
      )[0];
      const sortable = new Sortable(el, {
        handle: ".my-handle",
        onEnd: (evt) => {
          let arr = this.tableData;
          const currRow = arr.splice(evt.oldIndex, 1)[0];

          arr.splice(evt.newIndex, 0, currRow);
          arr.forEach((item, index) => {
            item.sort = index + 1;
          });
          let data = {
            data: arr,
          };
          this.$http.scene.updateTagAll(data).then((res) => {
            if (res.state == "0000") {
              this.listTag();
            } else {
              if (res.state == "9000") {
                this.$Beoverdue(function(url) {
                  self.$router.push({
                    path: url,
                  });
                }); //公共方法，utils.js
              }
              self.$message.error(res.msg);
            }
          });
        },
      });
    },
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
      this.$http.scene.moreUpdateTag(data).then((res) => {
        if (res.state == "0000") {
          self.$message({
            type: "success",
            message: "编辑成功!",
          });
          self.listTag();
          self.isNew = false;
        } else {
          if (res.state == "9000") {
            this.$Beoverdue(function(url) {
              self.$router.push({
                path: url,
              });
            }); //公共方法，utils.js
          }
          self.$message.error(res.msg);
        }
      });
    },
    /*
    编辑
     */
    edit(index, row) {
      this.isNew = true;
      this.title = "编辑规则";
      this.RuleForm = {
        tagName: row.tagName,
        tagCode: row.tagCode,
        tagId: row.tagId,
        sceneId: this.sceneId,
        tagDesc: row.tagDesc,
      };
      this.supplementSettingsDOList = [];
      row.ruleLanguage.split("|").forEach((item) => {
        let variateList = item.split(",");
        let obj = {
          varName: Number(variateList[0]),
          setType: Number(variateList[1]),
          setValue: variateList[2],
        };
        this.supplementSettingsDOList.push(obj);
      });
    },
    /*
    新增
     */

    NewlyEdit() {
      this.isNew = true;
      this.title = "创建规则";
      this.RuleForm = {
        tagName: "",
        tagCode: "",
        sceneId: this.sceneId,
        tagDesc: "",
      };
      this.supplementSettingsDOList = [];
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
        this.$http.scene.moreDeleteTag(data).then((res) => {
          if (res.state == "0000") {
            self.listTag();
            self.$message({
              type: "success",
              message: "删除成功!",
            });
          } else {
            if (res.state == "9000") {
              this.$Beoverdue(function(url) {
                self.$router.push({
                  path: url,
                });
              }); //公共方法，utils.js
            }
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
          let ruleLanguage = "";
          let rule = "";
          let arr = [];
          let arr2 = [];
          this.supplementSettingsDOList.forEach((item) => {
            let str = `${item.varName},${item.setType},${item.setValue}`;
            arr.push(str);
          });
          ruleLanguage = arr.join("|");
          this.supplementSettingsDOList.forEach((item) => {
            let a = "";
            let b = "";
            this.vallLisData.forEach((type) => {
              if (type.key === item.varName) {
                a = type.value;
              }
            });
            this.condition.forEach((type) => {
              if (type.key === item.setType) {
                b = type.value;
              }
            });
            let str = `${a}${b}${item.setValue}`;
            arr2.push(str);
          });
          rule = arr2.join("并且");
          if (self.title == "创建规则") {
            var data = {
              data: {
                sceneId: self.sceneId,
                tagName: self.RuleForm.tagName,
                tagCode: self.RuleForm.tagCode,
                tagDesc: self.RuleForm.tagDesc,
                tagType: 1,
                ruleLanguage,
                rule,
              },
              version: "1.0",
            };
            this.$http.scene.moreAddTag(data).then((res) => {
              if (res.state == "0000") {
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
                this.supplementSettingsDOList = [];
                self.listTag();
                self.isNew = false;
              } else {
                if (res.state == "9000") {
                  this.$Beoverdue(function(url) {
                    self.$router.push({
                      path: url,
                    });
                  }); //公共方法，utils.js
                }
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
                tagType: 1,
                ruleLanguage,
                rule,
              },
              version: "1.0",
            };
            this.$http.scene.moreUpdateTag(data).then((res) => {
              if (res.state == "0000") {
                self.$message({
                  type: "success",
                  message: "编辑成功!",
                });
                self.listTag();
                self.isNew = false;
              } else {
                if (res.state == "9000") {
                  this.$Beoverdue(function(url) {
                    self.$router.push({
                      path: url,
                    });
                  }); //公共方法，utils.js
                }
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

    listTag() {
      const self = this;

      var data = {
        sceneId: self.sceneId,
      };
      this.$http.scene.listTag(data).then((res) => {
        if (res.state == "0000") {
          self.loading = false;
          self.tableData = [];
          res.data.forEach((item) => {
            if (item.tagType === 2) {
              this.defaultTag = item.tagName;
            } else {
              this.$nextTick(() => {
                self.tableData.push(item);
              });
            }
          });
        } else {
          if (res.state == "9000") {
            this.$Beoverdue(function(url) {
              self.$router.push({
                path: url,
              });
            }); //公共方法，utils.js
          }
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
.my-handle {
  width: 50px;
  height: 50px;
  float: left;
  background: gold;
  cursor: grab;
}
.demo-drawer__footer {
  width: 30%;
  position: fixed;
  bottom: 0;
  padding: 20px 0;
  display: flex;
  justify-content: center;
}
.surfaceQuery {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  float: right;
  ::v-deep .el-select {
    margin-right: 20px;
  }
  ::v-deep .el-input__inner {
    height: 30px !important;
    line-height: 30px !important;
  }
}
</style>
