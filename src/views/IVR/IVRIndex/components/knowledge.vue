<style lang="scss" scoped>
.el-divider--horizontal {
  margin-top: 0;
}
</style>
<template>
  <div>
    <div id="queryBox">
      <audio ref="varAudio" :src="audition.url"></audio>
      <el-form :inline="true" class="demo-form-inline" size="small">
        <el-form-item label="知识库标题：">
          <el-input
            v-model="quertForm.kbItemTitle"
            clearable
            placeholder="请输入知识库标题"
          ></el-input>
        </el-form-item>

        <el-form-item label="知识库类：">
          <el-select
            v-model="quertForm.classId"
            clearable
            placeholder="请选择知识库类型"
          >
            <el-option
              v-for="(item, index) in KnowledgePointsData"
              :label="item.className"
              :value="item.classId"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="List()">查询</el-button>
        </el-form-item>
        <el-button
          size="small "
          type="primary"
          @click="NewlyEdit"
          style="float: right;margin-right:30px"
          :disabled="auditStatus"
        >
          新增
          <i class="el-icon-plus"></i>
        </el-button>
      </el-form>
    </div>
    <div id="listBox">
      <!-- <div class="aplayer" v-if="audition.url">
        <aplayer
          v-if="audition.url"
          autoplay
          :music="{
          title: audition.Title ,
          author:audition.createBy,
          url: audition.url,
          pic: '../../assets/images/timg.jpg',
          lrc: '[00:00.00]lrc here\n[00:01.00]aplayer'
            }"
        />
        <i class="el-icon-close close" @click="audition.url=''"></i>
      </div>-->
      <div v-for="(item, index) in data" :key="index">
        <p>标题：{{ item.kbItemTitle }}</p>
        <p>{{ item.kbItemText }}</p>
        <p>
          <span
            v-for="(item2, index2) in item.knowledgeRuleList"
            :key="index2"
            style="margin-right:10px"
          >
            <el-tag size="mini" :closable="!auditStatus" @close="delLabel(item2)">{{
              item2.ruleExpr
            }}</el-tag>
          </span>
        </p>

        <p>
          <!-- <span type="primary">上传</span> -->
          <el-upload
            style="width:28px;float:left"
            action="/rob/voicelib/sentence/uploadWav"
            :show-file-list="false"
            :limit="1"
            ref="my_upload"
            :on-success="uploadWavSuccess"
            :on-error="uploadWavError"
            :disabled="auditStatus"
          >
            <el-link type="primary" :disabled="auditStatus" @click="uploadId(item)">上传</el-link>
          </el-upload>
          <el-divider direction="vertical"></el-divider>

          <el-link
            type="danger"
            v-if="item.status == 1"
            :disabled="auditStatus"
            @click="statusSubmit(item, 2)"
            >禁用</el-link
          >
          <el-link
            type="primary"
            :disabled="auditStatus"
            @click="statusSubmit(item, 1)"
            v-if="item.status == 2 && item.knowledgeVoiceFileUrl"
            >启用</el-link
          >

          <el-divider
            direction="vertical"
            v-if="
              (item.status == 2 || item.status == 1) &&
                item.knowledgeVoiceFileUrl
            "
          ></el-divider>

          <el-link type="primary" :disabled="auditStatus" @click="NewlyEdit(index, item)">编辑</el-link>
          <el-divider direction="vertical"></el-divider>

          <el-link
            type="primary"
            :disabled="auditStatus"
            @click="addRule(item)"
            v-if="item.classId == 3 || item.classId == '3'"
            >添加规则</el-link
          >
          <el-divider
            direction="vertical"
            v-if="item.classId == 3 || item.classId == '3'"
          ></el-divider>

          <el-link
            type="primary"
            v-if="item.knowledgeVoiceFileUrl"
            @click="Audition(item)"
            >试听</el-link
          >
          <el-divider
            direction="vertical"
            v-if="
              item.knowledgeVoiceFileUrl &&
                (item.status == '2' || item.status == 2)
            "
          ></el-divider>

          <el-link
            type="warning"
            :disabled="auditStatus"
            @click="del(index, item.kbItemId)"
            v-if="item.status == '2' || item.status == 2"
            >删除</el-link
          >
        </p>

        <el-divider></el-divider>
      </div>
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
          <el-form-item label="知识库标题：" prop="kbItemTitle">
            <el-input
              v-model.trim="RuleForm.kbItemTitle"
              maxlength="30"
              placeholder="请输入知识库标题"
            ></el-input>
          </el-form-item>

          <el-form-item label="知识库类型：" prop="classId">
            <el-select
              v-model.trim="RuleForm.classId"
              clearable
              placeholder="请选择知识库类型"
              style="width:200px"
            >
              <el-option
                v-for="(item, index) in KnowledgePointsData"
                :label="item.className"
                :value="item.classId"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="知识库内容：" prop="kbItemText">
            <el-input
              v-model.trim="RuleForm.kbItemText"
              type="textarea"
              :rows="5"
              :cols="50"
              placeholder="请输入知识库内容"
              maxlength="500"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="可否打断：">
            <el-radio v-model.trim="RuleForm.interruptFlag" label="0"
              >不能打断</el-radio
            >
            <el-radio v-model.trim="RuleForm.interruptFlag" label="1"
              >能打断</el-radio
            >
          </el-form-item>
        </el-form>
      </div>
      <div class="demo-drawer__footer">
        <el-button @click="isNew = false" size="small">取 消</el-button>
        <el-button type="primary" @click="mewSubmit('RuleForm')" size="small"
          >确 定</el-button
        >
      </div>
    </el-drawer>

    <!-- 匹配文本弹框 -->
    <el-dialog title="匹配文本" :visible.sync="istext" width="40%">
      <div>
        <el-form class="demo-form-inline" size="small">
          <el-form-item label=" " prop="account">
            <el-input
              v-model.trim="ruleValue"
              maxlength="100"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="textcheck" size="small"
          >添加</el-button
        >
        <el-button @click="istext = false" size="small">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { setTimeout } from "timers";
export default {
  props: {
    auditStatus: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    var self = this;
    //知识库标题验证
    var kbItemTitleValidator = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("知识库标题不能为空"));
      } else {
        if (this.RuleForm.kbItemTitle !== "") {
          setTimeout(() => {
            self.$refs.RuleForm.validateField("kbItemTitle");
          }, 1000);
        }
        callback();
      }
    };
    //知识库内容题验证
    var kbItemTextValidator = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("知识库标题不能为空"));
      } else {
        if (this.RuleForm.kbItemText !== "") {
          setTimeout(() => {
            self.$refs.RuleForm.validateField("kbItemText");
          }, 1000);
        }
        callback();
      }
    };
    //知识库类型验证
    var classIdValidator = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("知识库标题不能为空"));
      } else {
        if (this.RuleForm.classId !== "") {
          setTimeout(() => {
            self.$refs.RuleForm.validateField("classId");
          }, 1000);
        }
        callback();
      }
    };
    return {
      title: "",
      isNew: false,
      istext: false,
      quertForm: {
        kbItemTitle: "",
        classId: "",
      },
      sceneId: "",
      KnowledgePointsData: [],
      data: [],
      newRules: {
        kbItemTitle: [
          {
            required: true,
            validator: kbItemTitleValidator,
            trigger: "blur",
          },
        ],
        kbItemText: [
          {
            required: true,
            validator: kbItemTextValidator,
            trigger: "blur",
          },
        ],
        classId: [
          {
            required: true,
            validator: classIdValidator,
            trigger: "blur",
          },
        ],
      },
      RuleForm: {
        kbItemTitle: "",
        kbItemText: "",
        classId: "",
        interruptFlag: "1",
      },
      seqNum: "",
      kbItemId: "",
      ruleValue: "",

      audition: {
        url: "",
        createBy: "",
        Title: "",
      },
    };
  },
  created() {
    this.sceneId = this.$route.query.sceneId;

    this.List();
    this.KnowledgePointsList();
  },
  components: {},

  methods: {
    /*
       音乐试听
     */
    Audition(val) {
      const self = this;
      this.audition = {
        url: val.knowledgeVoiceFileUrl,
        createBy: "",
        Title: "",
      };
      setTimeout(function() {
        self.$refs["varAudio"].play();
      }, 1);
    },
    /*
       修改状态提交
     */
    statusSubmit(val, type) {
      //  updateKnowledgeStatus
      const self = this;
      var data = {
        data: {
          kbItemId: val.kbItemId,
          status: type,
        },
        version: "1.0",
      };
      self.$http.scene.updateKnowledgeStatus(data).then((res) => {
        if (res.state == "200") {
          self.$message({
            message: "状态修改成功",
            type: "success",
          });
          self.List();
        } else {
          self.$message.error(res.msg);
        }
      });
    },

    /*
        上传保存id
     */
    uploadId(val) {
      this.kbItemId = val.kbItemId;
    },

    /*
       上传错误
     */
    uploadWavError: function(err) {
      this.$notify({
        title: "上传失败",
        message: err.msg,
        type: "fail",
        duration: 2000,
      });
    },

    /*
       上传成功
     */
    uploadWavSuccess: function(response) {
      var self = this;
      if (response.state == "200") {
        var data = {
          data: {
            kbItemId: self.kbItemId,
            kbItemVoice: response.data.fileName,
          },
          version: "1.0",
        };
        self.$http.scene.updateKnowledgeFile(data).then((res) => {
          if (res.state == "200") {
            self.$message({
              message: "上传成功",
              type: "success",
            });
            self.List();
          } else {
            self.$message.error(res.msg);
          }
        });
      } else {
        this.$notify({
          title: "上传失败",
          message: response.msg,
          type: "fail",
          duration: 2000,
        });
      }
      self.$refs["my_upload"].forEach((item) => {
        item.clearFiles();
      });
    },

    updateBranchFile: function(branchId, voiceFile) {},

    /*
      删除标签
     */
    delLabel(val) {
      const self = this;
      var data = {
        data: {
          ruleId: val.ruleId,
        },
        version: "1.0",
      };
      self.$http.scene.deleteKnowledgeRule(data).then((res) => {
        if (res.state == "200") {
          self.$message({
            message: "删除成功",
            type: "success",
          });
          self.List();
        } else {
          self.$message.error(res.msg);
        }
      });
    },
    /*
      添加弹框显示
     */
    addRule(val) {
      this.istext = true;
      this.kbItemId = val.kbItemId;
      this.ruleValue = "";
    },
    /*
      添加规则校验
     */

    textcheck() {
      const self = this;
      if (self.ruleValue) {
        var data = {
          data: {
            ruleExpr: self.ruleValue,
            kbItemId: self.kbItemId,
          },
          version: "1.0",
        };
        self.$http.scene.checkKnowledgeRuleExist(data).then((res) => {
          if (res.state == "200") {
            self.textSubmit();
          } else {
            self.$message.error(res.msg);
          }
        });
      } else {
        self.$message.error("请输入匹配文本");
      }
    },
    /*
      添加规则提交
     */

    textSubmit() {
      const self = this;
      var data = {
        data: {
          ruleExpr: self.ruleValue,
          kbItemId: self.kbItemId,
        },
        version: "1.0",
      };
      self.$http.scene.addKnowledgeRule(data).then((res) => {
        if (res.state == "200") {
          self.$message({
            message: "添加成功",
            type: "success",
          });
          self.istext = false;
          self.List(); //重新请求列表
        } else {
          self.$message.error(res.msg);
        }
      });
    },
    /*
    列表删除
     */

    del(index, delId) {
      const self = this;
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        var data = {
          data: {
            kbItemId: delId + "",
          },
          version: "1.0",
        };
        this.$http.scene.deleteKnowledge(data).then((res) => {
          if (res.state == "200") {
            self.data.splice(index, 1);
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
      新增 编辑 提交
    */
    mewSubmit(formName) {
      const self = this;

      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (self.title == "新增") {
            var data = {
              data: {
                kbItemTitle: self.RuleForm.kbItemTitle,
                kbItemText: self.RuleForm.kbItemText,
                classId: self.RuleForm.classId,

                interruptFlag: self.RuleForm.interruptFlag,
                sceneId: self.sceneId,
              },
              version: "1.0",
            };
            self.$http.scene.addKnowledge(data).then((res) => {
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
          } else {
            var data = {
              data: {
                kbItemTitle: self.RuleForm.kbItemTitle,
                kbItemText: self.RuleForm.kbItemText,
                classId: self.RuleForm.classId,
                seqNum: self.seqNum,
                kbItemId: self.kbItemId,
                interruptFlag: self.RuleForm.interruptFlag,
                sceneId: self.sceneId,
              },
              version: "1.0",
            };
            self.$http.scene.updateKnowledge(data).then((res) => {
              if (res.state == "200") {
                self.$message({
                  message: "修改成功",
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
      新增 编辑 
    */

    NewlyEdit(index, row) {
      this.isNew = true;

      if (row) {
        this.seqNum = row.seqNum;
        this.kbItemId = row.kbItemId;
        this.RuleForm = {
          kbItemTitle: row.kbItemTitle,
          kbItemText: row.kbItemText,
          classId: row.classId,
          interruptFlag: row.interruptFlag + "",
        };
        this.title = "编辑";
      } else {
        this.RuleForm = {
          kbItemTitle: "",
          kbItemText: "",
          classId: "",
          interruptFlag: "1",
        };
        this.title = "新增";
      }
    },
    /*
   知识点类型列表
    */

    KnowledgePointsList() {
      const self = this;

      var data = {
        data: {
          sceneId: self.sceneId,
        },
        version: "1.0",
      };
      this.$http.scene.listKnowledgeClass(data).then((res) => {
        if (res.state == "200") {
          self.KnowledgePointsData = res.data;
        } else {
          self.$message.error(res.msg);
        }
      });
    },
    /*
   知识列表
    */

    List() {
      const self = this;

      var data = {
        data: {
          sceneId: self.sceneId,
          kbItemTitle: self.quertForm.kbItemTitle,
          classId: self.quertForm.classId,
        },
        version: "1.0",
      };
      this.$http.scene.listKnowledge(data).then((res) => {
        if (res.state == "200") {
          self.data = res.data;
        } else {
          self.$message.error(res.msg);
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.aplayer {
  position: relative;
  .close {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 9999;
    cursor: pointer;
  }
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
