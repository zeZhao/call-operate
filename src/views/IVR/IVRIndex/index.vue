<style lang="scss" scoped>
.el-divider--horizontal {
  margin-top: 0;
}
</style>
<template>
  <div style="width: 100%">
    <div id="outsideBox" v-if="$route.matched.length < 3">
      <div id="queryBox">
        <el-form :inline="true" class="demo-form-inline" size="small">
          <el-form-item label="商户名称：" v-if="!userType">
            <el-select
              v-model="query.corpId"
              clearable
              filterable
              placeholder="请选择商户名称"
            >
              <el-option
                v-for="(item, index) in clientList"
                :label="item.corpName"
                :value="item.corpId"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="场景名称：">
            <el-input
              v-model="query.sceneName"
              clearable
              placeholder="请输入场景名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select
              v-model="query.status"
              clearable
              placeholder="请选择状态"
            >
              <el-option label="待提审" value="1"></el-option>
              <el-option label="待审核" value="2"></el-option>
              <el-option label="已通过" value="3"></el-option>
              <el-option label="已拒绝" value="4"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="审核时间：">
            <el-date-picker
              size="small"
              :clearable="false"
              v-model="query.auditTime"
              type="datetimerange"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
            ></el-date-picker>
          </el-form-item> -->

          <el-form-item>
            <el-button type="primary" @click="List('query')">查询</el-button>
          </el-form-item>
          <el-button
            size="small "
            type="primary"
            @click="NewlyEdit('', '', '新增')"
            style="float: right; margin-right: 30px"
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
          max-height="500"
          border
          style="width: 100%"
        >
          <el-table-column
            align="center"
            prop="corpName"
            label="商户名称"
            min-width="150"
            :show-overflow-tooltip="true"
            v-if="!userType"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="sceneName"
            label="场景名称"
            min-width="150"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <!-- <el-table-column
            align="center"
            prop="applyIndustry"
            label="适用行业"
            min-width="150"
            :show-overflow-tooltip="true"
          ></el-table-column> -->
          <!--<el-table-column-->
          <!--align="center"-->
          <!--prop="sceneDesc"-->
          <!--label="场景说明"-->
          <!--width="150"-->
          <!--:show-overflow-tooltip="true"-->
          <!--&gt;</el-table-column>-->
          <el-table-column
            align="center"
            prop="createTime"
            label="创建时间"
            min-width="170"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="{ row }">
              <span>{{ row.createTime | dateTime }}</span>
            </template>
          </el-table-column>
          <!--<el-table-column-->
          <!--align="center"-->
          <!--prop="createUserName"-->
          <!--label="创建人"-->
          <!--width="100"-->
          <!--:show-overflow-tooltip="true"-->
          <!--&gt;</el-table-column>-->
          <!-- <el-table-column
            align="center"
            prop="auditTime"
            label="审核时间"
            min-width="170"
            :show-overflow-tooltip="true"
          ></el-table-column> -->
          <el-table-column
            align="center"
            prop="status"
            label="状态"
            min-width="120"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="{ row }">
              <span v-if="row.status == 1">有效</span>
              <span v-else-if="row.status == 2">停用</span>
              <!-- <span v-else-if="row.status == 3">通过</span>
              <span v-else-if="row.status == 4">拒绝</span> -->
              <span v-else>停用</span>
            </template>
          </el-table-column>
          <!-- <el-table-column
            align="center"
            prop="refuseReason"
            label="拒绝理由"
            min-width="120"
            :show-overflow-tooltip="true"
          ></el-table-column> -->
          <!--<el-table-column-->
          <!--align="center"-->
          <!--prop="updateUserName"-->
          <!--label="更新人"-->
          <!--width="100"-->
          <!--:show-overflow-tooltip="true"-->
          <!--&gt;</el-table-column>-->
          <el-table-column align="center" label="操作" min-width="330">
            <template slot-scope="{ row, $index }">
              <el-button
                @click="NewlyEdit($index, row, '编辑')"
                type="text"
                size="small"
                v-if="!userType"
                >编辑</el-button
              >
              <el-divider direction="vertical"></el-divider>
              <el-button
                @click="delRow($index, row)"
                type="text"
                size="small"
                v-if="!userType"
                >删除</el-button
              >
              <el-divider direction="vertical"></el-divider>
              <el-button
                @click="updateSceneStatus(row)"
                type="text"
                size="small"
                >{{ row.status === 1 ? "停用" : "启用" }}</el-button
              >
              <el-divider direction="vertical"></el-divider>
              <el-button
                @click="NewlyEdit($index, row, '复制')"
                type="text"
                size="small"
                >复制</el-button
              >

              <el-divider direction="vertical"></el-divider>
              <!-- <el-button
                @click="Release($index, row)"
                type="text"
                size="small"
                >发布</el-button
              > -->
              <!-- <el-divider
                direction="vertical"
              ></el-divider> -->
              <el-button
                @click="againRelease($index, row)"
                type="text"
                size="small"
                >重新发布</el-button
              >
              <el-divider direction="vertical"></el-divider>
              <!-- <el-button
                @click="check(row, 2)"
                type="text"
                size="small"
                >提交审核</el-button
              > -->
              <!-- <el-divider
                direction="vertical"
              ></el-divider> -->
              <el-button
                @click="
                  push('/IVR/AI/detail', row);
                  updatedAuditStatus(row, 1);
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
          style="float: right; margin-right: 30px"
          @current-change="pagingChange"
        ></el-pagination>
      </div>

      <!-- 新增,编辑弹框 -->
      <el-drawer :title="title" v-if="isNew" :visible.sync="isNew" width="55%">
        <div style="width: 100%; padding: 0 20px">
          <el-form
            ref="RuleForm"
            :rules="newRules"
            :inline="true"
            :model="RuleForm"
            label-position="left"
            label-width="167px"
            class="demo-form-inline"
            size="small"
          >
            <el-divider></el-divider>
            <el-form-item label="场景名称：" prop="sceneName">
              <el-input
                v-model.trim="RuleForm.sceneName"
                placeholder="请输入场景名称"
                maxlength="30"
                show-word-limit
              ></el-input>
            </el-form-item>
            <!-- <el-form-item label="适用行业：" prop="applyIndustry">
              <el-input
                v-model.trim="RuleForm.applyIndustry"
                placeholder="请输入适用行业"
                maxlength="20"
                show-word-limit
              ></el-input>
            </el-form-item> -->
            <el-form-item label="最大超时次数：" prop="maxOverTimes">
              <el-input
                v-model.number="RuleForm.maxOverTimes"
                maxlength="2"
                placeholder="请输入最大超时次数"
              ></el-input>
            </el-form-item>
            <el-form-item label="最大未识别次数：" prop="maxUnrecogTimes">
              <el-input
                v-model.number="RuleForm.maxUnrecogTimes"
                maxlength="2"
                placeholder="请输入最大未识别次数"
              ></el-input>
            </el-form-item>
            <el-form-item label="商户：" prop="corpId" v-if="!userType">
              <el-select
                v-model="RuleForm.corpId"
                clearable
                filterable
                placeholder="请选择商户"
                style="width: 200px"
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
            <el-form-item label="流程类型：">
              <el-radio v-model="RuleForm.processType" :label="1">IVR</el-radio>
              <el-radio v-model="RuleForm.processType" :label="2"
                >技能组</el-radio
              >
              <!-- <el-radio v-model="RuleForm.asrEnable" label="0"
                >ASR不识别</el-radio
              > -->
            </el-form-item>
            <el-form-item label="是否开启异常短信提醒：">
              <div style="width: 200px">
                <el-radio v-model="RuleForm.isAbnormalSms" :label="1"
                  >开启</el-radio
                >
                <el-radio v-model="RuleForm.isAbnormalSms" :label="2"
                  >不开启</el-radio
                >
              </div>
            </el-form-item>
            <p class="form-tip">
              开启后将在用户秒挂、不在服务区、关机、欠费、未接通等状态下发送短信
            </p>
            <!-- <el-form-item label="短信模板：">
              <el-select
                v-model="RuleForm.smsTemplateId"
                clearable
                placeholder="请选择短信模板"
                style="width:200px"
              >
                
                <el-option
                  v-for="(item, index) in templateData"
                  :label="item.templateName"
                  :value="item.templateId"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="有效通话时长/s：" prop="validTalkTime">
              <el-input
                v-model.trim="RuleForm.validTalkTime"
                placeholder="请输入有效通话时长/s"
                maxlength="10"
                show-word-limit
              ></el-input>
            </el-form-item>

            <!-- <el-form-item label="启用识别：">
              <el-select
                v-model="RuleForm.asrEnable"
                clearable
                placeholder="请选择是否启用识别"
                style="width:200px"
              >
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>-->

            <el-form-item label="场景说明：" prop="sceneDesc">
              <!-- <el-input v-model="RuleForm.sceneDesc" placeholder="请输入场景说明"></el-input> -->
              <el-input
                type="textarea"
                v-model.trim="RuleForm.sceneDesc"
                placeholder="请输入场景说明"
                :rows="5"
                :cols="50"
                maxlength="150"
                show-word-limit
              ></el-input>
            </el-form-item>
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
    // 最大超时次数验证
    var maxOverTimesValidator = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("最大超时次数不能为空和0"));
      } else if (value > 10) {
        callback(new Error("设置此处不能大于10 "));
      } else if (!reg.test(value)) {
        callback(new Error("请输入数字"));
      } else {
        if (this.RuleForm.maxOverTimes !== "") {
          setTimeout(() => {
            self.$refs.RuleForm.validateField("maxOverTimes");
          }, 1000);
        }
        callback();
      }
    };
    // 最大识别次数
    var maxUnrecogTimesValidator = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("最大超时次数不能为空和0"));
      } else if (value > 10) {
        callback(new Error("设置此处不能大于10 "));
      } else if (!reg.test(value)) {
        callback(new Error("请输入数字"));
      } else {
        if (this.RuleForm.maxUnrecogTimes !== "") {
          setTimeout(() => {
            self.$refs.RuleForm.validateField("maxUnrecogTimes");
          }, 1000);
        }
        callback();
      }
    };
    //场景说明验证
    var sceneDescValidator = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("场景说明不能为空"));
      } else {
        if (this.RuleForm.sceneDesc !== "") {
          setTimeout(() => {
            self.$refs.RuleForm.validateField("sceneDesc");
          }, 1000);
        }
        callback();
      }
    };
    //启用验证
    var asrEnableValidator = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("启用状态不能为空"));
      } else {
        if (this.RuleForm.asrEnable !== "") {
          setTimeout(() => {
            self.$refs.RuleForm.validate("asrEnable");
          }, 1000);
        }
        callback();
      }
    };
    //启用验证
    // var validTalkTimeValidator = (rule, value, callback) => {
    //   if (this.RuleForm.validTalkTime !== "") {
    //     setTimeout(() => {
    //       self.$refs.RuleForm.validate("validTalkTime");
    //     }, 1000);
    //   }
    //   callback();
    // };
    // 有效通话时长/s
    var validTalkTimeValidator = (rule, value, callback) => {
      if (!reg.test(value)) {
        callback(new Error("请输入数字"));
      } else {
        // if (this.RuleForm.maxUnrecogTimes !== "") {
        //   setTimeout(() => {
        //     self.$refs.RuleForm.validateField("validTalkTime");
        //   }, 1000);
        // }
        callback();
      }
    };
    return {
      loading: false,
      SubmitLoading: false,
      title: "",
      clientList: [],
      tableData: [{ corpName: "11" }, { corpName: "22" }],
      page: 1,
      size: 10,
      totalNumber: 10, //分页总数
      isNew: false,
      query: {
        status: "",
        sceneName: "",
        corpId: "",
        auditTime: [
          new Date(
            new Date(new Date().toLocaleDateString()).getTime() -
              24 * 60 * 60 * 1000 * 6
          ),
          new Date(
            new Date(new Date().toLocaleDateString()).getTime() +
              (24 * 60 * 60 * 1000 - 1)
          ),
        ],
      },
      // 新增 验证
      newRules: {
        sceneName: [
          {
            required: true,
            validator: sceneNameValidator,
            trigger: "blur",
          },
        ],

        maxOverTimes: [
          {
            required: true,
            validator: maxOverTimesValidator,
            trigger: "blur",
          },
        ],
        maxUnrecogTimes: [
          {
            required: true,
            validator: maxUnrecogTimesValidator,
            trigger: "blur",
          },
        ],
        // asrEnable: [
        //   {
        //     required: true,
        //     validator: asrEnableValidator,
        //     trigger: "blur",
        //   },
        // ],
        sceneDesc: [
          {
            required: true,
            validator: sceneDescValidator,
            trigger: "blur",
          },
        ],
        validTalkTime: [
          {
            required: true,
            message: "请填写必填项",
            trigger: "blur",
          },
          {
            required: true,
            validator: validTalkTimeValidator,
            trigger: "change",
          },
        ],
        corpId: [
          {
            required: true,
            message: "请填写必填项",
            trigger: ["blur", "change"],
          },
        ],
      },
      RuleForm: {
        corpId: "",
        sceneName: "",
        applyIndustry: "",
        sceneDesc: "",
        maxOverTimes: "3",
        validTalkTime: "",
        maxUnrecogTimes: "3",
        asrEnable: "1",
        processType: 1,
        isAbnormalSms: 2,
        smsTemplateId: "",
      },
      sceneId: "", //修改id
      corpId: "", //商户id
      userType: "",
      templateData: [], //模本列表数据
    };
  },
  created() {
    this.userType = false;
    this.List();
    this.listClient();
    // this.templateist(); //模板列表
  },

  components: {},

  computed: {
    // userType: () => {
    //   return this.$cookies;
    // },
  },

  methods: {
    updateSceneStatus({ sceneId, status }) {
      var data = {
        data: {
          sceneId,
          status: status == 1 ? 2 : 1,
        },
        version: "1.0",
      };
      this.$http.scene.updateSceneStatus(data).then((res) => {
        if (res.state == "200") {
          this.List();
        } else {
          self.$message.error(res.msg);
        }
      });
    },
    // 发布按钮显示
    issue(row) {
      if (this.userType) {
        if (row.status == 3 && row.status == 0) {
          return true;
        } else {
          return false;
        }
      } else {
        if (row.status == 0) {
          return true;
        } else {
          return false;
        }
      }
    },
    // 重新发布按钮显示
    republish(row) {
      if (this.userType) {
        if (row.status == 3 && row.status == 2) {
          return true;
        } else {
          return false;
        }
      } else {
        if (row.status == 2) {
          return true;
        } else {
          return false;
        }
      }
    },
    /* 
    根据选择不同商户展示不同短信模板
    */
    chooseClient() {
      // this.templateist();
    },
    /*
      短信模板选项列表
     */

    templateist() {
      const self = this;
      var data = {
        data: {
          corpId: this.RuleForm.corpId,
          status: "",
        },
        version: "1.0",
      };
      self.$http.note.listSmsTemplate(data).then((res) => {
        if (res.state == "200") {
          self.templateData = res.data;
        } else {
          self.$message.error(res.msg);
        }
      });
    },
    /* 
    提交审核
    */
    check(row, status) {
      const self = this;
      var data = {
        data: {
          status,
          sceneId: row.sceneId,
        },
        version: "1.0",
      };
      self.$http.auditManage.updateAuditStatus(data).then((res) => {
        if (res.state == "200") {
          self.$message({
            type: "success",
            message: "操作成功!",
          });
          if (self.tableData.length == 1 && self.page != 0) {
            self.page = self.page - 1;
          }

          self.List();
        } else {
          self.$message.error(res.msg);
        }
      });
    },
    /* 
      商户端点击详情修改状态（认为商户有改动）
    */
    updatedAuditStatus(row, auditStatus) {
      const self = this;
      if (!self.userType) return;
      if (row.status === 2) return;
      var data = {
        data: {
          status,
          sceneId: row.sceneId,
        },
        version: "1.0",
      };
      self.$http.auditManage.updateAuditStatus(data).then((res) => {
        if (res.state == "200") {
          // self.$message({
          //   type: "success",
          //   message: "操作成功!",
          // });
          if (self.tableData.length == 1 && self.page != 0) {
            self.page = self.page - 1;
          }

          self.List();
        } else {
          self.$message.error(res.msg);
        }
      });
    },
    /*
    公布
     */
    Release(index, row) {
      const self = this;
      this.$confirm(
        "当前操作会将之前的话术设置进行更新，您确定要执行当前操作吗？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        var data = {
          data: {
            sceneId: row.sceneId,
            corpId: row.corpId,
          },
          version: "1.0",
        };
        self.$http.scene.releaseScene(data).then((res) => {
          if (res.state == "200") {
            self.$message({
              type: "success",
              message: "重新发布成功!",
            });

            self.List();
          } else {
            self.$message.error(res.msg);
          }
        });
      });
    },
    /*
    重新公布
     */
    againRelease(index, row) {
      const self = this;
      this.$confirm(
        "当前操作会将之前的话术设置进行更新，您确定要执行当前操作吗？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        var data = {
          data: {
            sceneId: row.sceneId,
            corpId: row.corpId,
          },
          version: "1.0",
        };
        self.$http.scene.releaseScene(data).then((res) => {
          if (res.state == "200") {
            self.$message({
              type: "success",
              message: "重新发布成功!",
            });

            self.List();
          } else {
            self.$message.error(res.msg);
          }
        });
      });
    },
    /*
    公开
     */
    publish(index, row, i) {
      const self = this;
      var data = {
        data: {
          openFlag: i + "",
          sceneId: row.sceneId,
        },
        version: "1.0",
      };
      self.$http.scene.updateSceneByOpenFlag(data).then((res) => {
        if (res.state == "200") {
          self.$message({
            type: "success",
            message: "设置成功!",
          });

          self.List();
        } else {
          self.$message.error(res.msg);
        }
      });
    },

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
            sceneId: row.sceneId,
          },
          version: "1.0",
        };
        self.$http.scene.deleteScene(data).then((res) => {
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
       新增,编辑 提交
     */
    newSubmit(formName) {
      const self = this;

      this.$refs[formName].validate((valid) => {
        if (valid) {
          self.SubmitLoading = true;
          if (self.title == "新增") {
            var data = {
              data: {
                corpId: self.RuleForm.corpId,
                sceneName: self.RuleForm.sceneName,
                applyIndustry: self.RuleForm.applyIndustry,
                sceneDesc: self.RuleForm.sceneDesc,
                maxOverTimes: self.RuleForm.maxOverTimes,
                validTalkTime: self.RuleForm.validTalkTime,
                maxUnrecogTimes: self.RuleForm.maxUnrecogTimes,
                // asrEnable: self.RuleForm.asrEnable,
                processType: self.RuleForm.processType,
                smsTemplateId: self.RuleForm.smsTemplateId,
                isAbnormalSms: self.RuleForm.isAbnormalSms,
              },
              version: "1.0",
            };
            self.$http.scene.addScene(data).then((res) => {
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
                sceneId: self.sceneId,
                corpId: self.RuleForm.corpId,
                sceneName: self.RuleForm.sceneName,
                applyIndustry: self.RuleForm.applyIndustry,
                sceneDesc: self.RuleForm.sceneDesc,
                maxOverTimes: self.RuleForm.maxOverTimes,
                validTalkTime: self.RuleForm.validTalkTime,
                maxUnrecogTimes: self.RuleForm.maxUnrecogTimes,
                // asrEnable: self.RuleForm.asrEnable,
                processType: self.RuleForm.processType,
                smsTemplateId: self.RuleForm.smsTemplateId,
                isAbnormalSms: self.RuleForm.isAbnormalSms,
                status: "2",
              },
              version: "1.0",
            };
            if (self.userType) {
              data.data.status = 1;
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
          } else if (self.title == "复制") {
            self.SubmitLoading = false;
            var data = {
              data: {
                sceneId: self.sceneId,
                corpId: self.RuleForm.corpId,
                sceneName: self.RuleForm.sceneName,
                applyIndustry: self.RuleForm.applyIndustry,
                sceneDesc: self.RuleForm.sceneDesc,
                maxOverTimes: self.RuleForm.maxOverTimes,
                maxUnrecogTimes: self.RuleForm.maxUnrecogTimes,
                validTalkTime: self.RuleForm.validTalkTime,
                smsTemplateId: self.RuleForm.smsTemplateId,
                isAbnormalSms: self.RuleForm.isAbnormalSms,
              },
              version: "1.0",
            };
            self.$http.scene.copyScene(data).then((res) => {
              if (res.state == "200") {
                self.$message({
                  message: "复制成功",
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
    /*
      商户列表
     */
    listClient() {
      const self = this;
      var data = {
        corpType: 0,
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
      this.corpId = row.corpId;
      if (title == "编辑") {
        let arr = [];
        this.templateData.forEach((item) => {
          arr.push(item.templateId);
        });
        this.RuleForm = {
          corpId: row.corpId,
          sceneName: row.sceneName,
          applyIndustry: row.applyIndustry,
          sceneDesc: row.sceneDesc,
          maxOverTimes: row.maxOverTimes,
          validTalkTime: row.validTalkTime,
          maxUnrecogTimes: row.maxUnrecogTimes,
          processType: row.processType,
          // asrEnable: row.asrEnable,
          // smsTemplateId: row.smsTemplateId,
          smsTemplateId:
            row.smsTemplateId == null
              ? ""
              : arr.includes(row.smsTemplateId)
              ? row.smsTemplateId
              : "", //短信模板id,,
          isAbnormalSms: row.isAbnormalSms,
        };
      } else if (title == "新增" || title == "复制") {
        this.RuleForm = {
          corpId: "",
          sceneName: "",
          applyIndustry: "",
          sceneDesc: "",
          maxOverTimes: "2",
          validTalkTime: "",
          maxUnrecogTimes: "2",
          // asrEnable: "1",
          processType: 1,
          smsTemplateId: "",
          isAbnormalSms: 2,
        };
      }
      // this.templateist();
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
      if (self.query.auditTime == null) {
        self.query.auditTime = ["", ""];
      }
      var data = {
        data: {
          pageNumber: self.page - 1,
          pageSize: self.size,

          scene: {
            status: self.query.status,
            sceneName: self.query.sceneName,
            corpId: self.query.corpId,
            starTime:
              self.query.auditTime.length > 0
                ? new Date(self.query.auditTime[0]).Format(
                    "yyyy-MM-dd hh:mm:ss"
                  )
                : new Date(
                    new Date(new Date().toLocaleDateString()).getTime() -
                      24 * 60 * 60 * 1000 * 6
                  ),
            endTime:
              self.query.auditTime.length > 0
                ? new Date(self.query.auditTime[1]).Format(
                    "yyyy-MM-dd hh:mm:ss"
                  )
                : new Date(
                    new Date(new Date().toLocaleDateString()).getTime() +
                      (24 * 60 * 60 * 1000 - 1)
                  ),
          },
        },
        version: "1.0",
      };
      this.$http.scene.listSceneByPage(data).then((res) => {
        self.loading = false;
        if (res.state == "200") {
          var arr = [];
          res.data.records.forEach((val) => {
            // val.createTime = new Date(val.createTime).Format(
            //   "yyyy-MM-dd hh:mm:ss"
            // );
            // val.auditTime = new Date(val.auditTime).Format(
            //   "yyyy-MM-dd hh:mm:ss"
            // );
            // if (val.voiceSource == 1 || val.voiceSource == "1") {
            //   val.voiceSourceName = "人工录制";
            // } else {
            //   val.voiceSourceName = "TTS";
            // }
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
      // this.$http.scene.skipSceneInformation(data).then((res) => {});
      this.$router.push({
        path: url,
        query: {
          corpId: row.corpId,
          sceneId: row.sceneId,
          processType: row.processType,
          // asrEnable: row.asrEnable,
          status: row.status,
          tagType: row.tagType,
        },
      });
    },
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
  width: 30%;
  position: fixed;
  bottom: 0;
  padding: 20px 0;
  display: flex;
  justify-content: center;
}
.form-tip {
  color: #aba8a8;
  font-size: 13px;
  margin-top: -18px;
  margin-bottom: 10px;
}
</style>
