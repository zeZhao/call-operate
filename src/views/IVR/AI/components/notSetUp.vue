<style lang="scss" scoped>
.el-divider--horizontal {
  margin-top: 0;
}
.el-drawer__body {
  overflow-y: scroll !important;
}
</style>
<template>
  <div id="box">
    <!-- <audio ref="varAudio" :src="varfileUrl"></audio> -->
    <el-collapse v-if="ListData.length != 0" v-model="activeNames">
      <el-collapse-item
        v-for="(item, index) in ListData"
        :name="index"
        :key="index"
      >
        <template slot="title">
          <div class="title">
            <span class="title-items"
              >({{ index + 1 }}):&nbsp;&nbsp;{{ item.branchTitle }}</span
            >
            <span class="operation">
              <!-- <el-divider direction="vertical"></el-divider> -->
              <el-button
                type="text"
                :disabled="auditStatus"
                size="small"
                @click.stop="voiceManage(item)"
                >语音管理</el-button
              >

              <!-- <el-upload
                style="width:28px;float:left"
                action="/rob/voicelib/sentence/uploadWav"
                :show-file-list="false"
                :limit="1"
                ref="my_upload"
                :on-success="uploadWavSuccess"
                :on-error="uploadWavError"
              >
                <el-button type="text" size="small" @click="uploadId(item)">上传</el-button>
              </el-upload> -->

              <!-- <el-divider direction="vertical" v-if="item.voiceFileUrl"></el-divider> -->
              <!-- <el-button
                type="text"
                size="small"
                v-if="item.voiceFileUrl"
                @click.stop="Audition(item)"
              >试听</el-button> -->
              <el-divider direction="vertical"></el-divider>
              <el-button
                type="text"
                size="small"
                :disabled="auditStatus"
                @click.stop="NewlyEdit(index, item)"
                >编辑</el-button
              >
              <el-divider direction="vertical"></el-divider>
              <el-button
                type="text"
                size="small"
                :disabled="auditStatus"
                @click.stop="del(index, item)"
                >删除</el-button
              >
              <el-divider
                direction="vertical"
                v-if="asrEnable != '2'"
              ></el-divider>
              <el-button
                type="text"
                size="small"
                :disabled="auditStatus"
                @click.stop="Matching(item, 0)"
                v-if="asrEnable != '2'"
                >匹配文本</el-button
              >
              <el-divider
                direction="vertical"
                v-if="
                  item.branchType != 1 &&
                    item.branchType != 2 &&
                    item.branchType != 4
                "
              ></el-divider>
              <el-button
                type="text"
                size="small"
                :disabled="auditStatus"
                @click.stop="Option(item, '新增选项')"
                v-if="
                  item.branchType != 1 &&
                    item.branchType != 2 &&
                    item.branchType != 4
                "
                >{{ asrEnable != "2" ? "新增选项" : "新增按键" }}</el-button
              >
            </span>
          </div>
        </template>

        <!-- <template v-if="item.isNull">
          <template v-for="(item2, index2) in item.branchSegmentList">
        <template>{{ item2.segText }}</template>-->
        <!-- <el-upload
              :key="index2"
              @click.native="getVarData(item2)"
              v-if="item2.segType.toString()==='1'"
              style="display:inline-block"
              accept="audio/wav"
              :show-file-list="false"
              action="/rob/voicelib/sentence/uploadWav"
              :on-change="handleChange"
              :on-error="handleError"
              :on-success="handleSuccess"
              multiple
              :limit="1"
              :file-list="fileList"
            >
              <i class="el-icon-upload"></i>
            </el-upload>

            <i
              v-if="item2.segVoiceFile"
              @click.stop="listenVarFile(item2)"
              :key="item2.segId"
              class="el-icon-service"
        ></i>-->
        <!-- </template>
        </template>-->

        <template>
          <span>{{ item.branchText }}</span>
        </template>
        <div class="optionList">
          <div v-for="(item2, index2) in item.optionList" :key="index2">
            <p>
              <span>({{ index2 + 1 }})：</span>
              <span>选项名称：{{ item2.optionTitle }}。</span>
              <span
                >下一分支：{{
                  nextBranchIdArr.indexOf(item2.nextBranchId) == -1
                    ? ""
                    : nextBranchIdArr.indexOf(item2.nextBranchId) + 1
                }}</span
              >
              <span class="operation" style="float: right;">
                <el-button
                  type="text"
                  size="small"
                  :disabled="auditStatus"
                  @click.stop="Option(item2, '编辑选项')"
                  >编辑</el-button
                >
                <el-divider direction="vertical"></el-divider>
                <el-button
                  type="text"
                  size="small"
                  :disabled="auditStatus"
                  @click.stop="delOption(index2, item2)"
                  >删除</el-button
                >
                <el-divider direction="vertical"></el-divider>

                <el-button
                  type="text"
                  size="small"
                  :disabled="auditStatus"
                  @click.stop="Matching(item2, 1)"
                  v-if="asrEnable != '2'"
                  >匹配文本</el-button
                >
                <el-button
                  type="text"
                  size="small"
                  :disabled="auditStatus"
                  @click.stop="Matching(item2, 1)"
                  v-else
                  >设置按键</el-button
                >
              </span>
            </p>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-button type="primary" @click="NewlyEdit" :disabled="auditStatus">
      新增题目
      <i class="el-icon-plus"></i>
    </el-button>

    <!-- 选项新增 编辑选项 -->
    <el-drawer
      :title="optionTitle"
      v-if="isOption"
      :visible.sync="isOption"
      size="32%"
    >
      <div style="width:100%;padding:0 20px;box-sizing: border-box">
        <el-divider></el-divider>
      </div>

      <div style="overflow-y: scroll;  height:500px">
        <div style="width:100%;padding:0 20px 50px 20px;box-sizing: border-box">
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
            <el-form-item
              :label="asrEnable != '2' ? '选项名称：' : '按键选项：'"
              prop="optionTitle"
            >
              <el-input
                v-model="otionForm.optionTitle"
                placeholder="请输入"
              ></el-input>
            </el-form-item>

            <el-form-item label="下一分支：">
              <el-select
                v-model="otionForm.nextBranch_id"
                clearable
                placeholder="请选择标签"
                style="width:200px"
              >
                <el-option
                  v-for="(item, index) in ListData"
                  :label="item.branchTitle"
                  :value="item.branchId"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="demo-drawer__footer2">
          <el-button @click="isOption = false" size="small">取 消</el-button>
          <el-button type="primary" size="small" @click="optionSubmit()"
            >确 定</el-button
          >
        </div>
      </div>
    </el-drawer>
    <!-- 匹配文本显示 -->
    <el-drawer
      :title="asrEnable != '2' ? '匹配文本' : '设置按键'"
      v-if="isMatching"
      :visible.sync="isMatching"
      size="30%"
    >
      <div style="width:100%;padding:0 20px;box-sizing: border-box">
        <el-divider></el-divider>
      </div>

      <div style="overflow-y: scroll;  height:500px">
        <div style="width:100%;padding:0 20px 50px 20px;box-sizing: border-box">
          <el-form
            ref="RuleForm2"
            :rules="newRules2"
            :inline="true"
            :model="RuleForm2"
            label-position="left"
            label-width="80px"
            class="demo-form-inline"
            size="small"
          >
            <el-form-item
              :label="asrEnable != '2' ? '文本：' : '选择按键'"
              prop="Matchingtext"
            >
              <el-input
                style="width:150px"
                v-model.trim="RuleForm2.Matchingtext"
                placeholder="请输入文本"
                v-if="asrEnable != '2'"
              ></el-input>
              <!-- <el-input style="width:150px" v-model="Matchingtext" placeholder="请输入文本" ></el-input> -->
              <el-select
                v-else
                v-model="RuleForm2.Matchingtext"
                clearable
                placeholder="请选择"
                style="width:150px"
              >
                <el-option label="1" value="1"></el-option>
                <el-option label="2" value="2"></el-option>
                <el-option label="3" value="3"></el-option>
                <el-option label="4" value="4"></el-option>
                <el-option label="5" value="5"></el-option>
                <el-option label="6" value="6"></el-option>
                <el-option label="7" value="7"></el-option>
                <el-option label="8" value="8"></el-option>
                <el-option label="9" value="9"></el-option>
                <el-option label="0" value="0"></el-option>
                <el-option label="#" value="#"></el-option>
                <el-option label="*" value="*"></el-option>
                <!-- <el-option label="人工服务" value="4"></el-option> -->
              </el-select>
            </el-form-item>
            <el-button type="primary" size="small" @click="checkMatch()"
              >添加</el-button
            >
          </el-form>
          <div>
            <span
              v-for="(item, index) in matchingData"
              :key="index"
              style="cursor:pointer;padding:20px 0"
            >
              <el-tag size="mini" closable @close="delMatching(index, item)">{{
                item.ruleExpr
              }}</el-tag>

              <el-divider
                direction="vertical"
                v-if="matchingData.length - 1 != index"
              ></el-divider>
            </span>
          </div>
        </div>
      </div>
    </el-drawer>
    <!-- 新增,编辑弹框 -->
    <el-drawer
      :title="title"
      v-if="isNew"
      :visible.sync="isNew"
      size="700px"
      tyle="width:100%;"
      :destroy-on-close="true"
    >
      <div style="width:100%;padding:0 20px;box-sizing: border-box">
        <el-divider></el-divider>
      </div>
      <div>
        <div
          style="width:100%;padding:0 20px 100px 20px;box-sizing: border-box"
        >
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
            <el-form-item label="标题：" prop="branchTitle">
              <el-input
                v-model.trim="RuleForm.branchTitle"
                placeholder="请输入标题"
                maxlength="80"
                show-word-limit
              ></el-input>
            </el-form-item>

            <el-form-item label="标签：">
              <el-select
                v-model="RuleForm.dataTag"
                clearable
                placeholder="请选择标签"
                style="width:200px"
              >
                <el-option
                  v-for="(item, index) in TagData"
                  :label="item.tagName"
                  :value="item.tagId"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="题目类型：" prop="branchType">
              <el-select
                v-model="RuleForm.branchType"
                clearable
                placeholder="请选择题目类型"
                style="width:200px"
              >
                <el-option label="欢迎语" value="1"></el-option>
                <el-option label="结束语" value="2"></el-option>
                <el-option label="题目" value="3"></el-option>
                <el-option label="人工服务" value="4"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              label="客服电话："
              prop="cusPhone"
              v-if="RuleForm.branchType == 4 || RuleForm.branchType == '4'"
            >
              <el-input
                v-model="RuleForm.cusPhone"
                placeholder="请输入人工电话"
              ></el-input>
              <p>可输入多个电话中间用英文逗号分隔</p>
            </el-form-item>
            <el-form-item
              label="指定下一题："
              v-if="RuleForm.branchType == 3 || RuleForm.branchType == '3'"
            >
              <el-select
                v-model="RuleForm.defaultNext"
                clearable
                placeholder="请选择指定下一题"
                style="width:200px"
              >
                <el-option
                  v-for="(item, index) in appointTopicData"
                  :label="item.branchTitle"
                  :value="item.branchId"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- ||(RuleForm.branchType==4||RuleForm.branchType=='4') -->
            <el-form-item
              label="下一题："
              v-if="RuleForm.branchType == 1 || RuleForm.branchType == '1'"
            >
              <el-select
                v-model="RuleForm.defaultNext"
                clearable
                placeholder="请选择下一题"
                style="width:200px"
              >
                <el-option
                  v-for="(item, index) in topicData"
                  :label="item.branchTitle"
                  :value="item.branchId"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="短信模板："
              v-if="
                RuleForm.branchType == 1 ||
                  RuleForm.branchType == '1' ||
                  (RuleForm.branchType == 2 || RuleForm.branchType == '2') ||
                  (RuleForm.branchType == 3 || RuleForm.branchType == '3')
              "
            >
              <el-select
                v-model="RuleForm.smsTemplateId"
                clearable
                placeholder="请选择短信模板"
                style="width:200px"
              >
                <!-- templateData -->
                <!-- <el-option label="不设置" value="1"></el-option> -->
                <el-option
                  v-for="(item, index) in templateData"
                  :label="item.templateName"
                  :value="item.templateId"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="超时下一题："
              v-if="
                (RuleForm.branchType == 1 ||
                  RuleForm.branchType == '1' ||
                  (RuleForm.branchType == 3 || RuleForm.branchType == '3')) &&
                  (RuleForm.overtimeType == 1 ||
                    RuleForm.overtimeType == '1' ||
                    RuleForm.overtimeType == 2 ||
                    RuleForm.overtimeType == '2')
              "
            >
              <el-select
                v-model="RuleForm.overtimeNext"
                clearable
                placeholder="请选择超时下一题"
                style="width:200px"
              >
                <el-option
                  v-for="(item, index) in overtimeTopicData"
                  :label="item.branchTitle || item.kbItemTitle"
                  :value="item.branchId || item.kbItemId"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- ||(RuleForm.branchType==4||RuleForm.branchType=='4') -->
            <el-form-item
              label="超时设置："
              v-if="
                RuleForm.branchType == 1 ||
                  RuleForm.branchType == '1' ||
                  (RuleForm.branchType == 3 || RuleForm.branchType == '3')
              "
            >
              <el-radio v-model="RuleForm.overtimeType" label="0"
                >暂不设置</el-radio
              >
              <el-radio
                v-model="RuleForm.overtimeType"
                label="1"
                @change="knowledgeBase(1)"
                >知识库</el-radio
              >
              <el-radio
                v-model="RuleForm.overtimeType"
                label="2"
                @change="Retain(1)"
                >当前场景</el-radio
              >
            </el-form-item>
            <el-form-item
              label="未识别下一题："
              v-if="
                (RuleForm.branchType == 3 || RuleForm.branchType == '3') &&
                  (RuleForm.unrecogType == 2 ||
                    RuleForm.unrecogType == '2' ||
                    RuleForm.unrecogType == 1 ||
                    RuleForm.unrecogType == '1')
              "
            >
              <el-select
                v-model="RuleForm.unrecogNext"
                clearable
                placeholder="请选择未识别下一题"
                style="width:200px"
              >
                <el-option
                  v-for="(item, index) in trackTopicData"
                  :label="item.branchTitle || item.kbItemTitle"
                  :value="item.branchId || item.kbItemId"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="未识别设置："
              v-if="RuleForm.branchType == 3 || RuleForm.branchType == '3'"
            >
              <el-radio v-model="RuleForm.unrecogType" label="0"
                >暂不设置</el-radio
              >
              <el-radio
                v-model="RuleForm.unrecogType"
                label="1"
                @change="knowledgeBase(2)"
                >知识库</el-radio
              >
              <el-radio
                v-model="RuleForm.unrecogType"
                label="2"
                @change="Retain(2)"
                >当前场景</el-radio
              >
            </el-form-item>

            <el-form-item
              label="可否打断："
              v-if="
                RuleForm.branchType == 1 ||
                  RuleForm.branchType == '1' ||
                  (RuleForm.branchType == 2 || RuleForm.branchType == '2') ||
                  (RuleForm.branchType == 3 || RuleForm.branchType == '3')
              "
            >
              <el-radio v-model="RuleForm.interruptFlag" label="0"
                >不能打断</el-radio
              >
              <el-radio v-model="RuleForm.interruptFlag" label="1"
                >能打断</el-radio
              >
            </el-form-item>
            <br />
            <el-form-item
              label="可否全局匹配："
              v-if="
                RuleForm.branchType == 1 ||
                  RuleForm.branchType == '1' ||
                  (RuleForm.branchType == 2 || RuleForm.branchType == '2') ||
                  (RuleForm.branchType == 3 || RuleForm.branchType == '3')
              "
            >
              <el-radio v-model="RuleForm.globalMatching" label="1"
                >是</el-radio
              >
              <el-radio v-model="RuleForm.globalMatching" label="0"
                >否</el-radio
              >
            </el-form-item>
            <el-form-item label="内容：" prop="branchText">
              <textarea
                v-model.trim="RuleForm.branchText"
                id="textarea"
                type="textarea"
                rows="5"
                cols="90"
                autocomplete="off"
                maxlength="500"
                show-word-limit
                ref="singleText"
              ></textarea>
            </el-form-item>
          </el-form>
          <div>
            <span
              v-for="(item, index) in variableData"
              :key="index"
              style="cursor:pointer"
              @click="insert(`#{${item.varName}}`)"
            >
              <el-tag size="mini">{{ item.varName }}</el-tag>

              <el-divider
                direction="vertical"
                v-if="variableData.length - 1 != index"
              ></el-divider>
            </span>
          </div>
        </div>
      </div>
      <div class="demo-drawer__footer">
        <el-button @click="isNew = false" size="small">取 消</el-button>
        <el-button
          type="primary"
          :loading="SubmitLoading"
          size="small"
          @click="newSubmit('RuleForm')"
          >确 定</el-button
        >
      </div>
    </el-drawer>

    <!-- 语音管理 -->

    <el-drawer
      title="语音管理"
      v-if="isVoice"
      :visible.sync="isVoice"
      size="500px"
      tyle="width:100%;"
      :destroy-on-close="true"
      :before-close="handleClose"
    >
      <div style="width:100%;padding:0 20px;box-sizing: border-box">
        <el-divider></el-divider>
        <div class="aplayer" v-if="varfileUrl">
          <aplayer
            v-if="varfileUrl"
            autoplay
            :music="{
              title: '试听',
              author: '....',
              url: varfileUrl,
              lrc: '[00:00.00]lrc here\n[00:01.00]aplayer',
            }"
          />
        </div>
        <div v-for="(item, index) in voiceRow.branchSegmentList" :key="index">
          <div class="title" v-if="item.segType.toString() === '1'">
            <span class="title-items" style="float:left">识别内容</span>
            <span class="operation">
              <el-divider direction="vertical"></el-divider>

              <el-upload
                style="width:28px;float:left"
                action="/rob/voicelib/sentence/uploadWav"
                :show-file-list="false"
                :limit="1"
                ref="my_upload"
                :on-success="uploadWavSuccess"
                :on-error="uploadWavError"
              >
                <el-button type="text" size="small" @click="uploadId(item)"
                  >上传</el-button
                >
              </el-upload>
              <el-button
                type="text"
                size="small"
                v-if="item.segVoiceFile"
                @click="listenVarFile(item)"
                >试听</el-button
              >
              <el-divider direction="vertical"></el-divider>

              <el-button
                type="text"
                size="small"
                @click="synthesis(item, index)"
                >合成</el-button
              >
            </span>
          </div>
          <el-input
            v-if="item.segType.toString() === '1'"
            type="textarea"
            autosize
            readonly
            placeholder="请输入内容"
            :value="item.segText"
          ></el-input>
        </div>
        <div v-if="!voiceRow.isNull">
          <div class="title">
            <span class="title-items" style="float:left">识别内容</span>
            <span class="operation">
              <el-divider
                direction="vertical"
                v-if="voiceRow.voiceFile"
              ></el-divider>
              <el-upload
                style="width:28px;float:left"
                action="/rob/voicelib/sentence/uploadWav"
                :show-file-list="false"
                :limit="1"
                ref="my_upload"
                :on-success="uploadWavSuccess"
                :on-error="uploadWavError"
              >
                <el-button type="text" size="small" @click="uploadId(voiceRow)"
                  >上传</el-button
                >
              </el-upload>

              <el-button
                type="text"
                size="small"
                v-if="voiceRow.voiceFileUrl"
                @click="Audition(voiceRow)"
                >试听</el-button
              >
              <el-divider direction="vertical"></el-divider>
              <el-button type="text" size="small" @click="synthesis()"
                >合成</el-button
              >
            </span>
          </div>
          <el-input
            type="textarea"
            autosize
            readonly
            placeholder="请输入内容"
            :value="voiceRow.branchText"
          ></el-input>
        </div>
      </div>
      <!--
            <div class="demo-drawer__footer">
              <el-button @click="isVoice = false" size="small">取 消</el-button>

              <el-button
                type="primary"
                :loading="SubmitLoading"
                size="small"
                @click="newSubmit('RuleForm')"
              >确 定</el-button>
            </div> -->
    </el-drawer>
  </div>
</template>

<script>
import { constants } from "fs";
import aplayer from "vue-aplayer";
export default {
  props: {
    auditStatus: {
      type: Boolean,
      default: false,
    },
  },
  components:[aplayer],
  data() {
    var self = this;
    // 人工电话不能为空
    var cusPhoneValidator = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("人工电话不能为空"));
      } else {
        if (this.RuleForm.cusPhone != "") {
          setTimeout(() => {
            self.$refs.RuleForm.validateField("cusPhone");
          }, 1000);
        }
        callback();
      }
    };
    // 标题验证
    var branchTitleValidator = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("标题不能为空"));
      } else {
        if (this.RuleForm.branchTitle !== "") {
          setTimeout(() => {
            self.$refs.RuleForm.validateField("branchTitle");
          }, 1000);
        }
        callback();
      }
    };
    //题目验证
    var branchTypeValidator = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("题目不能为空"));
      } else {
        if (this.RuleForm.branchType !== "") {
          setTimeout(() => {
            self.$refs.RuleForm.validateField("branchType");
          }, 1000);
        }
        callback();
      }
    };
    // 内容验证
    var branchTextValidator = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("内容不能为空"));
      } else {
        if (this.RuleForm.branchText !== "") {
          setTimeout(() => {
            self.$refs.RuleForm.validateField("branchText");
          }, 1000);
        }
        callback();
      }
    };
    // 新增文本不能为空
    var MatchingtextValidator = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("内容不能为空"));
      } else {
        if (this.RuleForm2.Matchingtext !== "") {
          setTimeout(() => {
            self.$refs.RuleForm2.validateField("Matchingtext");
          }, 1000);
        }
        callback();
      }
    };

    return {
      SubmitLoading: false,
      varfileUrl: "", // 题目中变量上传文件后获取的文件路径
      varFileName: "", // 题目中变量上传文件后获取的文件名
      segId: "", // 题目中变量的id
      fileList: [],
      activeNames: [1],
      isNew: false,
      isVoice: false,
      voiceRow: [], //语音管理列表
      title: "新增",
      optionTitle: "新增选项",
      // 新增 验证
      newRules2: {
        Matchingtext: [
          {
            required: true,
            validator: MatchingtextValidator,
            trigger: "blur",
          },
        ],
      },
      RuleForm2: {
        Matchingtext: "",
      },
      //   选项添加表单
      otionForm: { optionTitle: "", nextBranch_id: "" },
      // 搜索条件
      // 新增 验证
      newRules: {
        branchText: [
          {
            required: true,
            validator: branchTextValidator,
            trigger: "blur",
          },
        ],
        branchTitle: [
          {
            required: true,
            validator: branchTitleValidator,
            trigger: "blur",
          },
        ],
        branchType: [
          {
            required: true,
            message: "请选择题目",
            trigger: "blur",
          },
        ],
        cusPhone: [
          {
            required: true,
            validator: cusPhoneValidator,
            trigger: "blur",
          },
        ],
      },
      RuleForm: {
        clientId: "",
        sceneId: "", //url 传过来的id  过
        branchTitle: "", //分支标题   过
        branchType: "1", //题目类型  过
        branchText: "", //分支内容  过
        seqNum: "",
        branchState: "2",
        dataTag: 0, //标签id    过
        overtimeType: "0", //超时下一题选项 '1. 知识库,2. 此场景中的分支(为空时为重复播当前题目)设置  过
        overtimeNext: "", //超时下一题   过
        unrecogNext: "", //未识别下一题目
        unrecogType: "", //未识别下一题选项 '1. 知识库,2. 此场景中的分支(为空时为重复播当前题目) 设置
        defaultNext: "", //默认下一题目  过
        interruptFlag: "0", //是否打断 0.不可打断，1.可打断 过
        globalMatching: "0",
        smsTemplateId: "", //短信模板id 过
        cusPhone: "", //人工电话
      },
      TagData: [], //标签列表数据
      ListData: [], //列表数据
      topicData: [], //下一题列表数据
      templateData: [], //模本列表数据
      overtimeTopicData: [], //超时下一题列表数据
      RetainovertimeTopicData: [], //临时存储超时下一题列表数据
      trackTopicData: [], //未识别下一题列表数据
      appointTopicData: [], //指定下一题列表数据
      content: "", //指定下一题列表数据
      variableData: [], //变量列表数据
      matchingData: [], //匹配文本数据
      nextBranchIdArr: [], //匹配文本数据
      isMatching: false, //匹配弹框显示状态
      Matchingtext: "", //匹配文本内容
      branchId: "",
      optionId: "",
      sceneId: "",
      isOption: false, //新增选项弹框显示
      asrEnable: "",
      isOptionalText: false,
    };
  },
  mounted() {
    this.RuleForm.sceneId = this.$route.query.sceneId;
    this.RuleForm.clientId = this.$route.query.clientId;
    this.asrEnable = this.$route.query.asrEnable;
    this.List(); //列表
    this.TagList(); //标签选项列表
    this.variableList(); //变量列表
    this.templateist(); //模板列表
    this.getKnowledgeBase(1);
    this.getKnowledgeBase(2);
  },

  components: {},

  computed: {},

  methods: {
    handleClose() {
      this.varfileUrl = "";
      this.isVoice = !this.isVoice;
      this.List(); //列表
    },
    /*
       合成
       */

    synthesis(item, index) {
      const self = this;
      var data = {};
      if (this.voiceRow.isNull) {
        data = {
          status: 2,
          branchText: item.segText,
          branchId: "",
          segId: item.segId,
        };
      } else {
        data = {
          status: 1,
          branchText: this.voiceRow.branchText,
          branchId: this.voiceRow.branchId,
          segId: "",
        };
      }
      this.$http.scene
        .synthesisBranchVoice({
          version: "1.0",
          data: data,
        })
        .then((res) => {
          const { data, state, msg } = res;
          if (state === "0000") {
            //  这个赋值没有任何作用，就是判断是否有合成语音

            // self.voiceRow.branchSegmentList[index].segVoiceFile="file"
            if (self.voiceRow.branchSegmentList.length > 0) {
              self.voiceRow.branchSegmentList[index].segVoiceFile = res.msg;
            } else {
              self.voiceRow.voiceFileUrl = res.msg;
            }
            self.$message.success("合成成功");
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
        语音管理
       */
    voiceManage(item) {
      this.isVoice = !this.isVoice;
      this.voiceRow = item;
    },
    /*
        超时下一题  .未识别下一题 赋值场景列表
       */
    Retain(i) {
      if (i == 1) {
        this.RuleForm.overtimeNext = "";
        this.overtimeTopicData = this.ListData;
      } else if (i == 2) {
        this.RuleForm.unrecogNext = "";
        this.trackTopicData = this.ListData;
      }
    },
    /*
            试听
       */
    Audition(val) {
      const self = this;
      // self.varfileUrl = val.voiceFileUrl;

      // setTimeout(function() {
      //    self.$refs["varAudio"].play();
      // }, 1);
      this.varfileUrl = "";

      setTimeout(function() {
        self.varfileUrl = val.voiceFileUrl;
      });
    },
    /*
          上传保存id
       */
    uploadId(val) {
      this.branchId = val.branchId;
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
      if (response.state == "0000") {
        var data = {
          data: {
            branchId: self.branchId,
            voiceFile: response.data.fileName,
          },
          version: "1.0",
        };
        self.$http.scene.updateBranchFile(data).then((res) => {
          if (res.state == "0000") {
            self.$message({
              message: "上传成功",
              type: "success",
            });
            self.List();
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
      } else {
        this.$notify({
          title: "上传失败",
          message: response.msg,
          type: "fail",
          duration: 2000,
        });
        this.$refs["my_upload"].clearFiles();
      }
    },

    updateBranchFile: function(branchId, voiceFile) {},

    // 试听变量上传的语音文件
    listenVarFile(data) {
      const self = this;
      this.$http.scene
        .getSegment({
          version: "1.0",
          data: {
            segId: data.segId,
          },
        })
        .then((res) => {
          const { data, state } = res;
          if (state === "0000") {
            this.varfileUrl = "";

            setTimeout(function() {
              self.varfileUrl = data.segVoiceFileUrl;
            });
            // setTimeout(function() {
            //   self.$refs["varAudio"].play();
            // }, 1);
          } else {
            if (res.state == "9000") {
              this.$Beoverdue(function(url) {
                self.$router.push({
                  path: url,
                });
              }); //公共方法，utils.js
            }
          }
        });
    },
    // 点击题目变量上传文件按钮获取segid
    getVarData(data) {
      this.segId = data.segId;
    },
    /*
        新增 编辑
      */

    NewlyEdit(index, row) {
      const self = this;
      this.isNew = true;

      if (row) {
        this.title = "编辑";

        self.branchId = row.branchId;
        if (row.overtimeType == 2) {
          this.overtimeTopicData = this.ListData;
        }
        if (row.unrecogType == 2) {
          this.trackTopicData = this.ListData;
        }

        this.RuleForm = {
          sceneId: row.sceneId == null ? "" : row.sceneId, //url 传过来的id
          branchTitle: row.branchTitle == null ? "" : row.branchTitle, //分支标题
          branchType: row.branchType == null ? "" : row.branchType + "", //题目类型
          branchText: row.branchText == null ? "" : row.branchText, //分支内容
          seqNum: row.seqNum == null ? "" : row.seqNum,
          cusPhone: row.cusPhone == null ? "" : row.cusPhone, //人工电话
          dataTag: row.dataTag == null ? 0 : row.dataTag, //标签id
          overtimeType: row.overtimeType == null ? "" : row.overtimeType + "", //超时下一题选项 '1. 知识库,2. 此场景中的分支(为空时为重复播当前题目)设置
          overtimeNext: row.overtimeNext == null ? "" : row.overtimeNext, //超时下一题
          unrecogNext: row.unrecogNext == null ? "" : row.unrecogNext, //未识别下一题目
          unrecogType: row.unrecogType == null ? "" : row.unrecogType + "", //未识别下一题选项 '1. 知识库,2. 此场景中的分支(为空时为重复播当前题目) 设置
          defaultNext: row.defaultNext == null ? "" : row.defaultNext, //默认下一题目
          branchState: "2" /*1.时段   2.非时段*/,
          interruptFlag:
            row.interruptFlag == null ? "" : row.interruptFlag + "", //是否打断 0.不可打断，1.可打断
          globalMatching:
            row.globalMatching == null ? "" : row.globalMatching + "", //1是 0否
          smsTemplateId: row.smsTemplateId == null ? "" : row.smsTemplateId, //短信模板id
        };
      } else {
        this.title = "新增";

        this.RuleForm = {
          sceneId: self.RuleForm.sceneId, //url 传过来的id
          branchTitle: "", //分支标题
          branchType: "1", //题目类型
          branchText: "", //分支内容
          seqNum: "",
          dataTag: 0, //标签id
          cusPhone: "", //人工电话
          overtimeType: "0", //超时下一题选项 '1. 知识库,2. 此场景中的分支(为空时为重复播当前题目)设置
          overtimeNext: "", //超时下一题
          unrecogNext: "", //未识别下一题目
          unrecogType: "", //未识别下一题选项 '1. 知识库,2. 此场景中的分支(为空时为重复播当前题目) 设置
          defaultNext: "", //默认下一题目
          interruptFlag: "0", //是否打断 0.不可打断，1.可打断
          globalMatching: "0",
          smsTemplateId: "", //短信模板id
          branchState: "2" /*1.时段   2.非时段*/,
        };
      }
    },

    handleChange(d) {
      // console.log(d);
    },
    handleError(d) {
      // console.log(d);
    },
    /**
     * 上传成功回调
     */
    handleSuccess(response) {
      if (response.state === "0000") {
        this.varFileName = response.data.fileName; // 获取文件名
        this.$http.scene
          .updateSegment({
            data: {
              segVoiceFile: this.varFileName,
              segId: this.segId,
            },
            version: "1.0",
          })
          .then((res) => {
            const { state, data } = res;
            if (state === "0000") {
              this.$message.success("上传成功");
              this.List();
            } else {
              if (res.state == "9000") {
                this.$Beoverdue(function(url) {
                  self.$router.push({
                    path: url,
                  });
                }); //公共方法，utils.js
              }
              this.$notify({
                title: "上传失败",
                message: res.msg,
                type: "fail",
                duration: 2000,
              });
            }
          });
      }
    },
    /*
       删除选项
       */
    delOption(index, val) {
      const self = this;

      this.$confirm(
        "当前操作会将选项的匹配文本一同删除，您确定要删除当前数据吗？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        var data = {
          data: {
            optionId: val.optionId,
          },
          version: "1.0",
        };
        self.$http.scene.deleteOption(data).then((res) => {
          if (res.state == "0000") {
            self.$message({
              type: "success",
              message: "删除成功!",
            });
            self.List();
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
       列表添加选项弹框显示
       */
    Option(val, text) {
      this.isOption = true;
      this.branchId = val.branchId;
      this.optionId = val.optionId;
      if (text == "新增选项" || text == "新增按键") {
        this.optionTitle = this.asrEnable != "2" ? "新增选项" : "新增按键";
        this.otionForm = { optionTitle: "", nextBranch_id: "" };
      } else {
        this.optionTitle = "编辑选项";
        this.optionTitle = this.asrEnable != "2" ? "编辑选项" : "编辑按键";
        this.otionForm = {
          optionTitle: val.optionTitle,
          nextBranch_id: val.nextBranchId,
        };
      }
    },

    /*
       列表添加选项
       */
    optionSubmit() {
      const self = this;
      if (this.optionTitle == "新增选项" || this.optionTitle == "新增按键") {
        var data = {
          data: {
            branchId: self.branchId,
            optionTitle: self.otionForm.optionTitle,
            nextBranch_id: self.otionForm.nextBranch_id,
          },
          version: "1.0",
        };
        self.$http.scene.addOption(data).then((res) => {
          if (res.state == "0000") {
            self.isOption = false;
            self.$message({
              type: "success",
              message: "选项添加成功!",
            });
            self.List();
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
      } else {
        var data = {
          data: {
            branchId: self.branchId,
            optionId: self.optionId,
            optionTitle: self.otionForm.optionTitle,
            nextBranch_id: self.otionForm.nextBranch_id,
          },
          version: "1.0",
        };
        self.$http.scene.updateOption(data).then((res) => {
          if (res.state == "0000") {
            self.isOption = false;
            self.$message({
              type: "success",
              message: "编辑成功!",
            });
            self.List();
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
    },

    /*
       列表匹配文本删除
       */
    delMatching(index, val) {
      const self = this;
      if (this.isOptionalText == false) {
        var data = {
          data: {
            ruleId: val.ruleId,
          },
          version: "1.0",
        };
        self.$http.scene.deleteMatchRule(data).then((res) => {
          if (res.state == "0000") {
            self.matchingData.splice(index, 1);
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
      } else {
        //
        var data = {
          data: {
            ruleId: val.ruleId,
          },
          version: "1.0",
        };
        self.$http.scene.deleteOptionMatchRule(data).then((res) => {
          if (res.state == "0000") {
            self.matchingData.splice(index, 1);
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
      }
    },
    /*
       列表匹配文本添加校验
       */
    checkMatch() {
      const self = this;

      if (this.isOptionalText == false) {
        var data = {
          data: {
            sceneId: self.sceneId,
            ruleExpr: self.RuleForm2.Matchingtext,
          },
          version: "1.0",
        };
        self.$http.scene.checkMatchRule(data).then((res) => {
          if (res.state == "0000") {
            self.addMatching();
            this.RuleForm2.Matchingtext = "";
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
      } else {
        if (this.matchingData.length > 0 && this.asrEnable == "2") {
          self.$message.error("当前为按键应答,请删除后添加");
          return;
        }

        var data = {
          data: {
            branchId: self.branchId,
            ruleExpr: self.RuleForm2.Matchingtext,
          },
          version: "1.0",
        };
        self.$http.scene.checkOptionRuleExist(data).then((res) => {
          if (res.state == "0000") {
            self.addOptionMatching();
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
    },

    /*
        选项匹配文本添加
       */
    addOptionMatching(val) {
      this.isMatching = true;

      const self = this;
      this.$refs["RuleForm2"].validate((valid) => {
        if (valid) {
          var data = {
            data: {
              optionId: self.optionId,
              ruleExpr: self.RuleForm2.Matchingtext,
            },
            version: "1.0",
          };
          self.$http.scene.addOptionMatchRule(data).then((res) => {
            if (res.state == "0000") {
              self.$message({
                type: "success",
                message: "添加成功!",
              });
              self.Optionlist();
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
        } else {
          return false;
        }
      });
    },
    /*
       列表匹配文本添加
       */
    addMatching(val) {
      this.isMatching = true;

      const self = this;
      this.$refs["RuleForm2"].validate((valid) => {
        if (valid) {
          var data = {
            data: {
              branchId: self.branchId,
              ruleExpr: self.RuleForm2.Matchingtext,
            },
            version: "1.0",
          };
          self.$http.scene.addMatchRule(data).then((res) => {
            if (res.state == "0000") {
              self.$message({
                type: "success",
                message: "添加成功!",
              });
              self.MatchRule();
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
        } else {
          return false;
        }
      });
    },
    /*
       列表匹配文本数据显示，弹框显示
       */
    Matching(val, i) {
      this.isMatching = true;
      this.matchingData = [];

      this.RuleForm2.Matchingtext = "";

      if (i == 0) {
        this.branchId = val.branchId;
        this.sceneId = val.sceneId;
        this.MatchRule();
        this.isOptionalText = false;
      } else {
        this.branchId = val.branchId;
        this.optionId = val.optionId;
        this.Optionlist(val.optionId);
        this.isOptionalText = true;
      }
    },
    /*
       规则匹配文本数据
       */
    Optionlist() {
      const self = this;
      var data = {
        data: {
          optionId: self.optionId,
        },
        version: "1.0",
      };
      self.$http.scene.listOptionMatchRule(data).then((res) => {
        if (res.state == "0000") {
          self.matchingData = res.data;
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
     列表匹配文本数据显示
       */
    MatchRule() {
      const self = this;
      var data = {
        data: {
          branchId: self.branchId,
        },
        version: "1.0",
      };
      self.$http.scene.listMatchRule(data).then((res) => {
        if (res.state == "0000") {
          self.matchingData = res.data;
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
     删除列表
       */

    del(index, val) {
      const self = this;
      if (val.optionList.length != 0) {
        this.$message({
          message: "请您先删除当前选项后在进行此操作！",
          type: "warning",
        });

        return;
      }
      this.$confirm(
        "当前操作会将分支的匹配文本一同删除，您确定要删除当前数据吗？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        var data = {
          data: {
            branchId: val.branchId,
          },
          version: "1.0",
        };
        self.$http.scene.deleteBranch(data).then((res) => {
          if (res.state == "0000") {
            self.$message({
              type: "success",
              message: "删除成功!",
            });
            self.List();
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
      变量列表
       */
    variableList(i) {
      const self = this;
      var data = {
        data: {
          sceneId: this.RuleForm.sceneId,
        },
        version: "1.0",
      };
      self.$http.scene.listVarAlias(data).then((res) => {
        if (res.state == "0000") {
          self.variableData = res.data;
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
        知识库选项列表
       */
    knowledgeBase(i) {
      const self = this;

      var data = {
        data: {
          sceneId: this.RuleForm.sceneId,
          classId: i,
          status: "1",
        },
        version: "1.0",
      };
      if (i == 1) {
        this.RuleForm.overtimeNext = "";
      } else if (i == 2) {
        this.RuleForm.unrecogNext = "";
      }
      self.$http.scene.listKnowledge(data).then((res) => {
        if (res.state == "0000") {
          if (i == 1) {
            // self.RetainovertimeTopicData = self.overtimeTopicData;
            self.overtimeTopicData = res.data;
          } else if (i == 2) {
            // self.RetainovertimeTopicData = self.trackTopicData;
            self.trackTopicData = res.data;
          }
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

    getKnowledgeBase(i) {
      const self = this;

      var data = {
        data: {
          sceneId: this.$route.query.sceneId,
          classId: i,
          status: "1",
        },
        version: "1.0",
      };
      self.$http.scene.listKnowledge(data).then((res) => {
        if (res.state == "0000") {
          if (i == 1) {
            // self.RetainovertimeTopicData = self.overtimeTopicData;
            self.overtimeTopicData = res.data;
          } else if (i == 2) {
            // self.RetainovertimeTopicData = self.trackTopicData;
            self.trackTopicData = res.data;
          }
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
        短信模板选项列表
       */

    templateist() {
      const self = this;
      var data = {
        data: {
          clientId: this.RuleForm.clientId,
          status: "",
        },
        version: "1.0",
      };
      self.$http.note.listSmsTemplate(data).then((res) => {
        if (res.state == "0000") {
          self.templateData = res.data;
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
        标签选项列表
       */

    TagList() {
      const self = this;
      var data = {
        data: {
          sceneId: this.RuleForm.sceneId,
        },
        version: "1.0",
      };
      self.$http.scene.listTagBySceneId(data).then((res) => {
        if (res.state == "0000") {
          let arr = [
            {
              tagName: "无",
              tagId: 0,
            },
          ];
          self.TagData = arr.concat(res.data);
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
        列表
       */

    List() {
      const self = this;
      var data = {
        data: {
          branchState: "2" /*1.时段   2.非时段*/,
          sceneId: this.RuleForm.sceneId,
        },
        version: "1.0",
      };
      self.$http.scene.listBranch(data).then((res) => {
        if (res.state == "0000") {
          const data = res.data;
          this.nextBranchIdArr = [];
          this.activeNames = [];
          data.forEach(function(val, index) {
            if (val.branchSegmentList.length != 0) {
              val.isNull = true; //自定义字段
            } else {
              val.isNull = false; //自定义字段
            }

            self.activeNames.push(index);

            self.nextBranchIdArr.push(val.branchId);
          });

          self.ListData = data;
          self.topicData = data;
          // self.overtimeTopicData = data;
          // self.trackTopicData = data;
          self.appointTopicData = data;
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
        话术设置提交
       */

    newSubmit(formName) {
      const self = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          self.SubmitLoading = true;

          if (this.title == "新增") {
            var data = {
              data: {
                sceneId: this.RuleForm.sceneId,
                branchState: this.RuleForm.branchState,
                branchTitle: this.RuleForm.branchTitle,
                branchType: this.RuleForm.branchType,
                branchText: this.RuleForm.branchText,
                seqNum: this.RuleForm.seqNum,
                dataTag: this.RuleForm.dataTag,
                overtimeType: this.RuleForm.overtimeType,
                cusPhone: this.RuleForm.cusPhone,
                overtimeNext: this.RuleForm.overtimeNext,
                unrecogNext: this.RuleForm.unrecogNext,
                unrecogType: this.RuleForm.unrecogType,
                defaultNext: this.RuleForm.defaultNext,
                interruptFlag: this.RuleForm.interruptFlag,
                globalMatching: this.RuleForm.globalMatching,
                smsTemplateId: this.RuleForm.smsTemplateId,
              },
              version: "1.0",
            };
            self.$http.scene.addBranch(data).then((res) => {
              self.SubmitLoading = false;
              if (res.state == "0000") {
                self.$message({
                  type: "success",
                  message: "新增成功!",
                });
                this.isNew = false;
                this.List();
              } else {
                self.$message.error(res.msg);
              }
            });
          } else {
            var data = {
              data: {
                sceneId: this.RuleForm.sceneId,
                branchState: this.RuleForm.branchState,
                branchId: this.branchId,
                branchTitle: this.RuleForm.branchTitle,
                branchType: this.RuleForm.branchType,
                branchText: this.RuleForm.branchText,
                seqNum: this.RuleForm.seqNum,
                dataTag: this.RuleForm.dataTag,
                cusPhone: this.RuleForm.cusPhone,
                overtimeType: this.RuleForm.overtimeType,
                overtimeNext: this.RuleForm.overtimeNext,
                unrecogNext: this.RuleForm.unrecogNext,
                unrecogType: this.RuleForm.unrecogType,
                defaultNext: this.RuleForm.defaultNext,
                interruptFlag: this.RuleForm.interruptFlag,
                globalMatching: this.RuleForm.globalMatching,
                smsTemplateId: this.RuleForm.smsTemplateId,
              },
              version: "1.0",
            };
            self.$http.scene.updateBranch(data).then((res) => {
              self.SubmitLoading = false;
              if (res.state == "0000") {
                self.$message({
                  type: "success",
                  message: "编辑成功!",
                });
                this.isNew = false;
                this.List();
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
          return false;
        }
      });
    },
    /*
      内容获取光标位置，插入变量
       */

    async insert(myValue) {
      // const myField = document.querySelector('#textarea');
      const myField = this.$refs.singleText;
      if (myField.selectionStart || myField.selectionStart === 0) {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        this.RuleForm.branchText =
          myField.value.substring(0, startPos) +
          myValue +
          myField.value.substring(endPos, myField.value.length);
        await this.$nextTick(); // 这句是重点, 圈起来
        myField.focus();
        myField.setSelectionRange(
          endPos + myValue.length,
          endPos + myValue.length
        );
      } else {
        this.RuleForm.branchText += myValue;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .el-drawer__container .el-drawer__body {
  overflow-y: scroll !important;
}
#box {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  height: 100%;
  /deep/ .el-drawer__container .el-drawer__body {
    overflow-y: scroll !important;
  }
  .el-icon-upload,
  .el-icon-headset,
  .el-icon-service {
    font-size: 16px;
    background: #409eff;
    color: #ffffff;
    border-radius: 5px;
    padding: 3px;
    cursor: pointer;
    margin: 0 3px;
  }
  .title {
    width: 100%;
    display: flex;
    justify-content: space-between;

    .operation {
      margin-right: 30px;
    }
    .title-items {
      font-weight: bold;
    }
  }
  .optionList {
    padding: 0 20px;
    box-sizing: border-box;
    background: #f3f0f0;
    margin-top: 15px;
    div {
      &:last-child p {
        border-bottom: 0;
      }
      p {
        margin: 0;
        padding: 10px 0;
        border-bottom: 1px solid #ddd;
      }
    }
  }
}
#textarea {
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: inline-block;
  padding: 15px 15px;
  box-sizing: border-box;

  width: 100%;
}
.demo-drawer__footer {
  width: 700px;
  position: fixed;
  bottom: 0;
  padding: 20px 0;
  display: flex;
  justify-content: center;
  background: white;
}
.demo-drawer__footer2 {
  width: 30%;
  position: fixed;
  bottom: 0;
  padding: 20px 0;
  display: flex;
  justify-content: center;
  background: white;
}
</style>
