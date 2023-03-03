<style lang="scss" scoped>
.el-divider--horizontal {
  margin-top: 0;
}
.el-drawer__body {
  overflow-y: scroll !important;
}
::v-deep .el-drawer__header {
  margin-bottom: 5px !important;
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
              <!-- <el-button
                type="text"
                :disabled="auditStatus"
                size="small"
                @click.stop="voiceManage(item)"
                >语音管理</el-button
              > -->

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
              <!-- <el-divider direction="vertical"></el-divider> -->
              <el-button
                type="text"
                :disabled="auditStatus"
                size="small"
                @click.stop="NewlyEdit(index, item)"
                >编辑</el-button
              >
              <el-divider direction="vertical"></el-divider>
              <el-button
                type="text"
                :disabled="auditStatus"
                size="small"
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
            ref="otionForm"
            :rules="newRules3"
            :inline="true"
            :model="otionForm"
            label-position="left"
            label-width="110px"
            class="demo-form-inline"
            size="small"
          >
            <el-form-item label="行为：">
              <el-radio-group
                v-model="otionForm.variableType"
                @change="typeChange"
              >
                <el-radio :label="1">肯定</el-radio>
                <el-radio :label="2">否定</el-radio>
                <el-radio :label="3">拒绝</el-radio>
                <el-radio :label="4">自定义</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              :label="asrEnable != '2' ? '选项名称：' : '按键选项：'"
              prop="optionTitle"
            >
              <el-input
                v-model="otionForm.optionTitle"
                placeholder="请输入"
                :disabled="isDisabled"
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
            <!-- <el-form-item label="变量名：" prop="variableName">
              <el-input
                v-model="otionForm.variableName"
                placeholder="请输入变量名"
              ></el-input>
            </el-form-item> -->
          </el-form>
        </div>
        <div class="demo-drawer__footer2">
          <el-button @click="isOption = false" size="small">取 消</el-button>
          <el-button
            type="primary"
            size="small"
            @click="optionSubmit('otionForm')"
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
      <div>
        <div
          style="width:100%;padding:0 20px 100px 20px;box-sizing: border-box"
        >
          <el-tabs v-model="activeName">
            <el-tab-pane label="常规配置" name="first">
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

                <el-form-item label="标签：" v-if="RuleForm.branchType != 5">
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
                <el-col :span="24">
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
                      <el-option label="数据查询" value="5"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <div v-if="RuleForm.branchType != 5">
                  
                  <el-form-item
                    label="指定下一题："
                    v-if="
                      RuleForm.branchType == 3 || RuleForm.branchType == '3'
                    "
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
                    v-if="
                      RuleForm.branchType == '4' || RuleForm.branchType == '1'
                    "
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
                    label="技能组："
                    prop="cusPhone"
                    v-if="
                      RuleForm.branchType == 4 || RuleForm.branchType == '4'
                    "
                  >
                    <el-select
                      v-model="RuleForm.cusPhone"
                      placeholder="请输入技能组"
                    >
                    <el-option
                    v-for="(item, index) in IVRlistAll"
                        :label="item.skillGroupName"
                        :value="item.sgId"
                        :key="index">

                    </el-option>
                    </el-select>
                    <!-- <p>可输入多个电话中间用英文逗号分隔</p> -->
                  </el-form-item>
                  <el-form-item
                    label="人机交互形式："
                    v-if="RuleForm.branchType != 5"
                  >
                    <el-radio-group v-model="RuleForm.interactiveType">
                      <el-radio :label="1">无交互</el-radio>
                      <el-radio :label="2">接收用户说话</el-radio>
                      <el-radio :label="3">接收用户按键</el-radio>
                      <el-radio :label="4">留言按键</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item
                    label="接收用户按键"
                    v-if="RuleForm.interactiveType == 3"
                    prop="endValue"
                  >
                    <el-select v-model="RuleForm.endType" style="width:200px">
                      <el-option :value="1" label="按键结束"
                        >按键结束</el-option
                      >
                      <el-option :value="2" label="按键位长结束"
                        >按键位长结束</el-option
                      >
                    </el-select>
                    <el-input
                      v-model="RuleForm.endValue"
                      style="width:40%;margin-left: 20px;"
                      :placeholder="
                        `请输入${
                          RuleForm.endType == 1 ? '结束按键' : '结束按键位长'
                        }`
                      "
                    />
                  </el-form-item>
                  <el-form-item
                    label="嘟音回复："
                    v-if="RuleForm.interactiveType == 4"
                    prop="endValue"
                  >
                    <el-radio-group
                      v-model="RuleForm.endType"
                      style="width:200px"
                    >
                      <el-radio :value="2" :label="2">使用</el-radio>
                      <el-radio :value="1" :label="1">不使用</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item
                    label="结束按键："
                    v-if="RuleForm.interactiveType == 4"
                    prop="endValue"
                  >
                    <el-input
                      v-model="RuleForm.endValue"
                      :placeholder="`请输入结束按键`"
                    />
                  </el-form-item>
                  <el-form-item
                    label="短信模板："
                    v-if="
                      (RuleForm.branchType == 1 ||
                        RuleForm.branchType == '1' ||
                        (RuleForm.branchType == 2 ||
                          RuleForm.branchType == '2') ||
                        (RuleForm.branchType == 3 || RuleForm.branchType == '3')) && RuleForm.interactiveType !== 4
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
                      ((RuleForm.branchType == 1 ||
                        RuleForm.branchType == '1' ||
                        (RuleForm.branchType == 3 ||
                          RuleForm.branchType == '3')) &&
                        (RuleForm.overtimeType == 1 ||
                          RuleForm.overtimeType == '1' ||
                          RuleForm.overtimeType == 2 ||
                          RuleForm.overtimeType == '2')) && RuleForm.interactiveType !== 4
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
                      (RuleForm.branchType == 1 ||
                        RuleForm.branchType == '1' ||
                        (RuleForm.branchType == 3 || RuleForm.branchType == '3')) && RuleForm.interactiveType !== 4
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
                      ((RuleForm.branchType == 3 ||
                        RuleForm.branchType == '3') &&
                        (RuleForm.unrecogType == 2 ||
                          RuleForm.unrecogType == '2' ||
                          RuleForm.unrecogType == 1 ||
                          RuleForm.unrecogType == '1')) && RuleForm.interactiveType !== 4
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
                    v-if="
                      (RuleForm.branchType == 3 || RuleForm.branchType == '3') && RuleForm.interactiveType !== 4
                    "
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
                      (RuleForm.branchType == 1 ||
                        RuleForm.branchType == '1' ||
                        (RuleForm.branchType == 2 ||
                          RuleForm.branchType == '2') ||
                        (RuleForm.branchType == 3 || RuleForm.branchType == '3')) && RuleForm.interactiveType !== 4
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
                      ((RuleForm.branchType == 1 ||
                        RuleForm.branchType == '1') ||
                        (RuleForm.branchType == 2 ||
                          RuleForm.branchType == '2') ||
                        (RuleForm.branchType == 3 || RuleForm.branchType == '3')) && RuleForm.interactiveType !== 4
                    "
                  >
                    <el-radio v-model="RuleForm.globalMatching" label="1"
                      >是</el-radio
                    >
                    <el-radio v-model="RuleForm.globalMatching" label="0"
                      >否</el-radio
                    >
                  </el-form-item>
                  <el-form-item
                    label="内容："
                    prop="branchText"
                    v-if="RuleForm.branchType != 5"
                  >
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
                      @blur="branchTextChange"
                    ></textarea>
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
                    <div
                      v-for="(item, index) in branchSegmentList"
                      :key="item.segText + index"
                      class="voiceCard"
                    >
                      <el-card shadow="always">
                        <div class="aplayer" v-if="item.segVoiceFileUrl">
                          <aplayer
                            v-if="item.segVoiceFileUrl"
                            autoplay
                            :music="{
                              title: '试听',
                              author: '....',
                              url: item.segVoiceFileUrl,
                              lrc: '[00:00.00]lrc here\n[00:01.00]aplayer',
                            }"
                          />
                        </div>
                        <span class="lable">{{
                          item.segType == 1 ? "语音内容：" : "变量："
                        }}</span>
                        <span class="content">{{ item.segText }}</span>
                        <!-- <el-tag effect="dark" v-else>{{ item.segText }}</el-tag> -->
                        <el-button-group v-if="item.segType == 1">
                          <el-upload
                            style="float:left;margin-top: -1px;"
                            action="/api/scene/branch/uploadWav"
                            :headers="header"
                            :show-file-list="false"
                            :limit="1"
                            ref="my_upload"
                            :on-success="
                              (res, file, fileList) => {
                                uploadWavSuccess(res, file, fileList, index);
                              }
                            "
                            :on-error="uploadWavError"
                          >
                            <el-button type="text">上传</el-button>
                          </el-upload>
                          <el-button type="text" v-if="item.segVoiceFileUrl"
                            >试听</el-button
                          >
                          <el-button type="text" @click="synthesis(item, index)"
                            >合成</el-button
                          >
                        </el-button-group>
                      </el-card>
                    </div>
                  </el-form-item>
                </div>
                <div v-else>
                  <el-form-item label="数据表名称：" prop="">
                    <el-select
                      v-model="dataQueryForm.tableName"
                      @change="selectTable"
                    >
                      <el-option
                        v-for="(item, index) in clientTableList"
                        :label="item.clientTableCnName"
                        :value="item.clientTableEnName"
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-col :span="24">
                    <el-form-item label="多条件规则：" prop="">
                      <el-radio-group v-model="dataQueryForm.queryType">
                        <el-radio :label="1">或关系</el-radio>
                        <el-radio :label="2">且关系</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24"
                    ><el-form-item label="表查询条件：" prop="">
                      <el-button
                        type="primary"
                        v-if="dataQueryForm.queryConditionDOList.length === 0"
                        @click="addQueryCondition"
                        >添加条件</el-button
                      >
                      <div v-else>
                        <div
                          v-for="(item,
                          index) in dataQueryForm.queryConditionDOList"
                          :key="index"
                        >
                          <div class="surfaceQuery">
                            <el-select
                              v-model="item.fieldName"
                              placeholder="请选择字段"
                              no-data-text="请先选择数据表名称"
                            >
                              <el-option
                                :value="item.tableEnColumn"
                                :key="item.tableEnColumn"
                                :label="item.tableCnColumn"
                                v-for="item in tableColumnList"
                              ></el-option>
                            </el-select>
                            <el-select
                              v-model="item.matchingType"
                              placeholder="请选择条件"
                            >
                              <el-option
                                :value="1"
                                label="精准匹配"
                              ></el-option>
                              <el-option
                                :value="2"
                                label="模糊匹配"
                              ></el-option>
                            </el-select>
                            <el-select
                              v-model="item.variableName"
                              placeholder="请选择变量"
                            >
                              <el-option
                                :value="`sys${RuleForm.sceneId}`"
                                :label="`sys${RuleForm.sceneId}`"
                              ></el-option>
                              <el-option
                                :value="item.varName"
                                :label="item.varName"
                                v-for="(item, index) in vallLisData"
                                :key="index"
                              ></el-option>
                            </el-select>
                            <i
                              class="el-icon-remove-outline"
                              style="font-size:20px;margin-right:5px"
                              @click="subtract(item, index, 'query')"
                            ></i>
                            <i
                              class="el-icon-circle-plus"
                              style="font-size:20px"
                              @click="addQuery('query')"
                            ></i>
                          </div>
                        </div>
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24"
                    ><el-form-item label="获取结果：" prop="">
                      <el-button
                        type="primary"
                        v-if="dataQueryForm.queryResultsDOList.length === 0"
                        @click="addQueryResults"
                        >添加结果</el-button
                      >
                      <div v-else>
                        <div
                          v-for="(item,
                          index) in dataQueryForm.queryResultsDOList"
                          :key="index"
                        >
                          <div class="surfaceQuery">
                            <el-select
                              v-model="item.variableName"
                              placeholder="请选择变量"
                            >
                              <el-option
                                :value="item.varName"
                                :label="item.varName"
                                v-for="(item, index) in vallLisData"
                                :key="index"
                              ></el-option>
                            </el-select>
                            <span style="padding-right:20px ">=</span>
                            <el-select
                              v-model="item.fieldName"
                              placeholder="请选择字段"
                              no-data-text="请先选择数据表名称"
                            >
                              <el-option
                                :value="item.tableEnColumn"
                                :key="item.tableEnColumn"
                                :label="item.tableCnColumn"
                                v-for="item in tableColumnList"
                              ></el-option>
                            </el-select>
                            <i
                              class="el-icon-remove-outline"
                              style="font-size:20px;margin-right:5px"
                              @click="subtract(item, index, 'result')"
                            ></i>
                            <i
                              class="el-icon-circle-plus"
                              style="font-size:20px"
                              @click="addQuery('result')"
                            ></i>
                          </div>
                        </div>
                      </div>
                    </el-form-item>
                  </el-col>
                </div>
              </el-form>
            </el-tab-pane>
            <!-- <el-tab-pane label="数据查询" name="second">
              <el-form ref="dataQueryForm" :model="dataQueryForm">
                <el-form-item label="是否查询数据接口：">
                  <el-radio-group v-model="dataQueryForm.queryState">
                    <el-radio :label="1">不查询</el-radio>
                    <el-radio :label="2">查询</el-radio>
                  </el-radio-group>
                </el-form-item>
                
              </el-form>
            </el-tab-pane> -->
            <el-tab-pane label="补充设置" name="third">
              <el-form ref="replenishForm" :model="replenishForm">
                <el-form-item label="变量名称：" prop="">
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
                        <el-select
                          v-model="item.varName"
                          placeholder="请选择变量"
                        >
                          <el-option
                            :value="item.varName"
                            :label="item.varName"
                            v-for="(item, index) in vallLisData"
                            :key="index"
                          ></el-option>
                        </el-select>
                        <el-select
                          v-model="item.setType"
                          placeholder="请选择类型"
                        >
                          <el-option :value="1" label="客户的回答"></el-option>
                          <el-option :value="2" label="自定义的值"></el-option>
                        </el-select>
                        <el-input
                          style="width:220px"
                          v-model="item.setValue"
                          :placeholder="
                            `请输入${
                              item.setType == 1 ? '客户的回答' : '自定义的值'
                            }`
                          "
                        ></el-input>
                        <i
                          class="el-icon-remove-outline"
                          style="font-size:20px;margin-right:5px"
                          @click="subtract(item, index, 'replenish')"
                        ></i>
                        <i
                          class="el-icon-circle-plus"
                          style="font-size:20px"
                          @click="addQuery('replenish')"
                        ></i>
                      </div>
                    </div>
                  </div>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
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
      <Voice :varfile="varfileUrl" :voiceRow="voiceRow"></Voice>
    </el-drawer>
  </div>
</template>

<script>
import Voice from "./voice.vue";
import { getStorage } from "@/utils/auth";
export default {
  props: {
    auditStatus: {
      type: Boolean,
      default: false,
    },
  },
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
      isDisabled: false,
      //   选项添加表单
      otionForm: {
        variableType: 4,
        optionTitle: "",
        nextBranch_id: "",
        variableName: "",
      },
      newRules3: {
        optionTitle: [
          {
            required: true,
            message: "请输入选项",
            trigger: ["blur", "change"],
          },
        ],
      },
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
        endValue: [
          {
            required: true,
            message: "请输入按键内容",
            trigger: "blur",
          },
        ],
      },
      RuleForm: {
        corpId: "",
        sceneId: "", //url 传过来的id  过
        branchTitle: "", //分支标题   过
        branchType: "1", //题目类型  过
        branchText: "", //分支内容  过
        seqNum: "",
        branchState: "1" /*1.时段   2.非时段*/,
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
        interactiveType: 1, //人机交互形式
        endType: 1, // 按键选择
        endValue: "", // 按键内容
      },
      TagData: [], //标签列表数据
      ListData: [], //列表数据
      topicData: [], //下一题列表数据
      templateData: [], //模本列表数据
      overtimeTopicData: [], //超时下一题列表数据
      RetainovertimeTopicData: [], //临时存储超时下一题列表数据
      trackTopicData: [], //未识别下一题列表数据
      appointTopicData: [], //指定下一题列表数据
      IVRlistAll: [], //技能组数据
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
      //话术编辑
      activeName: "first",
      //数据查询数据
      dataQueryForm: {
        queryState: "",
        tableName: "",
        queryType: "",
        //表查询条件
        queryConditionDOList: [],
        // 获取结果数据
        queryResultsDOList: [],
      },
      //补充设置数据
      replenishForm: {},

      //变量名称数据
      supplementSettingsDOList: [],
      //分支内容截取
      branchSegmentList: [],
      //变量数据
      vallLisData: [],
      // 表名称数据
      clientTableList: [],
      // 字段数据
      tableColumnList: [],
      header:{
        token:getStorage('token')
      }
    };
  },
  mounted() {
    this.RuleForm.sceneId = this.$route.query.sceneId || 0;
    this.RuleForm.corpId = this.$route.query.corpId || 0;
    this.asrEnable = this.$route.query.asrEnable;
    this.List(); //列表
    this.TagList(); //标签选项列表
    this.variableList(); //变量列表
    // this.templateist(); //模板列表
    this.getKnowledgeBase(1);
    this.getKnowledgeBase(2);
    this.VallLis();
    this.listClientTable();
    this.getIVRlistAll() // 获取技能组数据
  },
  activated(){
    this.List(); //列表
    this.TagList(); //标签选项列表
    this.variableList(); //变量列表
    // this.templateist(); //模板列表
    this.getKnowledgeBase(1);
    this.getKnowledgeBase(2);
    this.VallLis();
    this.listClientTable();
    this.getIVRlistAll() // 获取技能组数据
  },

  components: { Voice },

  computed: {},

  methods: {
    //选择表名称
    selectTable(val) {
      let data = this.clientTableList.filter(
        (item) => item.clientTableEnName === val
      );
      if (data && data.length) {
        this.getTableColumnList(data[0].id);
      }
      this.dataQueryForm.queryConditionDOList = [];
      this.dataQueryForm.queryResultsDOList = [];
    },
    /*
      字段列表
     */
    getTableColumnList(clientTableId) {
      const self = this;
      var data = {
        data: {
          clientTableId,
        },
        version: "1.0",
      };
      this.$http.dataTable.getTableColumnList({ ...data }).then((res) => {
        if (res.state == "200") {
          self.tableColumnList = res.data;
        } else {
          self.$message.error(res.msg);
        }
      });
    },
    /*
      数据表列表
     */
    listClientTable() {
      const self = this;
      var data = {
        data: { corpId: self.RuleForm.corpId },
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
     标签列表
     */

    VallLis() {
      const self = this;

      var data = {
        data: {
          sceneId: self.RuleForm.sceneId || 0,
          varType: 2,
        },
        version: "1.0",
      };
      this.$http.scene.listVarAlias(data).then((res) => {
        if (res.state == "200") {
          self.vallLisData = [];
          res.data.forEach((val) => {
            self.vallLisData.push({
              varId: val.varId,
              varName: val.varName,
            });
          });
        } else {
          self.$message.error(res.msg);
        }
      });
    },
    //添加表查询条件
    addQueryCondition() {
      this.dataQueryForm.queryConditionDOList = [
        {
          fieldName: "",
          matchingType: "",
          variableName: "",
        },
      ];
    },
    //添加获取结果
    addQueryResults() {
      this.dataQueryForm.queryResultsDOList = [
        {
          variableName: "",
          fieldName: "",
        },
      ];
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

    // type参数：query表查询条件 result获取结果 replenish 变量名称
    addQuery(type) {
      if (type === "query") {
        this.dataQueryForm.queryConditionDOList.push({
          fieldName: "",
          matchingType: "",
          variableName: "",
        });
      } else if (type === "result") {
        this.dataQueryForm.queryResultsDOList.push({
          variableName: "",
          fieldName: "",
        });
      } else if (type === "replenish") {
        this.supplementSettingsDOList.push({
          varName: "",
          setType: "",
          setValue: "",
        });
      }
    },
    subtract(item, index, type) {
      if (type === "query") {
        this.dataQueryForm.queryConditionDOList.splice(index, 1);
      } else if (type === "result") {
        this.dataQueryForm.queryResultsDOList.splice(index, 1);
      } else if (type === "replenish") {
        this.supplementSettingsDOList.splice(index, 1);
      }
    },
    handleClose() {
      this.varfileUrl = "";
      this.isVoice = !this.isVoice;
      this.List(); //列表
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

        let arr = [];
        this.templateData.forEach((item) => {
          arr.push(item.templateId);
        });

        this.RuleForm = {
          sceneId: row.sceneId == null ? "" : row.sceneId, //url 传过来的id
          branchTitle: row.branchTitle == null ? "" : row.branchTitle, //分支标题
          branchType: row.branchType == null ? "" : row.branchType + "", //题目类型
          branchText: row.branchText == null ? "" : row.branchText, //分支内容
          seqNum: row.seqNum == null ? "" : row.seqNum,
          cusPhone: row.cusPhone == null ? "" : row.cusPhone, //人工电话
          dataTag: row.dataTag == null ? 0 : Number(row.dataTag), //标签id
          overtimeType: row.overtimeType == null ? "" : row.overtimeType + "", //超时下一题选项 '1. 知识库,2. 此场景中的分支(为空时为重复播当前题目)设置
          overtimeNext: row.overtimeNext == null ? "" : row.overtimeNext, //超时下一题
          unrecogNext: row.unrecogNext == null ? "" : row.unrecogNext, //未识别下一题目
          unrecogType: row.unrecogType == null ? "" : row.unrecogType + "", //未识别下一题选项 '1. 知识库,2. 此场景中的分支(为空时为重复播当前题目) 设置
          defaultNext: row.defaultNext == null ? "" : row.defaultNext, //默认下一题目
          branchState: "1" /*1.时段   2.非时段*/,
          interruptFlag:
            row.interruptFlag == null ? "" : row.interruptFlag + "", //是否打断 0.不可打断，1.可打断
          globalMatching:
            row.globalMatching == null ? "" : row.globalMatching + "", //1是 0否
          smsTemplateId:
            row.smsTemplateId == null
              ? ""
              : arr.includes(row.smsTemplateId)
              ? row.smsTemplateId
              : "", //短信模板id
          interactiveType: row.interactiveType, //人机交互形式
          endType: row.endType, // 按键选择
          endValue: row.endValue, // 按键内容
        };
        //语音内容与变量截取
        this.branchSegmentList = [];
        this.branchSegmentList = row.branchSegmentList;
        //变量数据回显
        let variableData = [
          {
            varName: "",
            setType: "",
            setValue: "",
          },
        ];
        this.supplementSettingsDOList =
          row.supplementSettingsDOList.length !== 0
            ? row.supplementSettingsDOList
            : variableData;

        const {
          queryState,
          queryType,
          tableName,
          queryConditionDOList,
          queryResultsDOList,
        } = row.dataQueryDO;
        //表查询条件
        let tableArr = [
          {
            fieldName: "",
            matchingType: "",
            variableName: "",
          },
        ];
        // 获取结果数据
        let resultData = [
          {
            variableName: "",
            fieldName: "",
          },
        ];

        //数据查询数据
        this.dataQueryForm = {
          queryState: queryState ? queryState : "",
          tableName: tableName ? tableName : "",
          queryType: queryType ? queryType : "",
          //表查询条件
          queryConditionDOList:
            queryConditionDOList.length !== 0 ? queryConditionDOList : tableArr,
          // 获取结果数据
          queryResultsDOList:
            queryResultsDOList.length !== 0 ? queryResultsDOList : resultData,
        };

        let data = this.clientTableList.filter(
          (item) => item.clientTableEnName === tableName
        );
        if (data && data.length) {
          this.getTableColumnList(data[0].id);
        }
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
          branchState: "1" /*1.时段   2.非时段*/,
          interactiveType: 1, //人机交互形式
          endType: 1, // 按键选择
          endValue: "", // 按键内容
        };
        this.branchSegmentList = [];
        //数据查询数据
        this.dataQueryForm = {
          queryState: "",
          tableName: "",
          queryType: "",
          //表查询条件
          queryConditionDOList: [],
          // 获取结果数据
          queryResultsDOList: [],
        };
        this.supplementSettingsDOList = [];
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
      if (response.state === "200") {
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
            if (state === "200") {
              this.$message.success("上传成功");
              this.List();
            } else {
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
     列表添加选项弹框显示
     */
    Option(val, text) {
      this.isOption = true;
      this.branchId = val.branchId;
      this.optionId = val.optionId;
      if (text == "新增选项" || text == "新增按键") {
        this.optionTitle = this.asrEnable != "2" ? "新增选项" : "新增按键";
        this.otionForm = {
          variableType: 4,
          optionTitle: "",
          nextBranch_id: "",
          variableName: "",
        };
        this.isDisabled = false;
      } else {
        this.optionTitle = "编辑选项";
        this.optionTitle = this.asrEnable != "2" ? "编辑选项" : "编辑按键";
        this.otionForm = {
          variableType: val.variableType,
          optionTitle: val.optionTitle,
          nextBranch_id: val.nextBranchId,
          variableName: val.variableName,
        };
        let value = val.variableType;
        if (value === 1 || value === 2 || value === 3) {
          this.isDisabled = true;
        } else {
          this.isDisabled = false;
        }
      }
    },

    typeChange(val) {
      if (val === 1 || val === 2 || val === 3) {
        this.isDisabled = true;
      } else {
        this.isDisabled = false;
      }
      let str = "";
      switch (val) {
        case 1:
          str = "肯定";
          break;
        case 2:
          str = "否定";
          break;
        case 3:
          str = "拒绝";
          break;
      }
      this.otionForm.optionTitle = str;
    },

    /*
     列表添加选项
     */
    optionSubmit(formName) {
      const self = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (
            this.optionTitle == "新增选项" ||
            this.optionTitle == "新增按键"
          ) {
            var data = {
              data: {
                branchId: self.branchId,
                variableType: self.otionForm.variableType,
                optionTitle: self.otionForm.optionTitle,
                nextBranch_id: self.otionForm.nextBranch_id,
                // variableName: self.otionForm.variableName,
              },
              version: "1.0",
            };
            self.$http.scene.addOption(data).then((res) => {
              if (res.state == "200") {
                self.isOption = false;
                self.$message({
                  type: "success",
                  message: "选项添加成功!",
                });
                self.List();
              } else {
                self.$message.error(res.msg);
              }
            });
          } else {
            var data = {
              data: {
                branchId: self.branchId,
                optionId: self.optionId,
                variableType: self.otionForm.variableType,
                optionTitle: self.otionForm.optionTitle,
                nextBranch_id: self.otionForm.nextBranch_id,
                // variableName: self.otionForm.variableName,
              },
              version: "1.0",
            };
            self.$http.scene.updateOption(data).then((res) => {
              if (res.state == "200") {
                self.isOption = false;
                self.$message({
                  type: "success",
                  message: "编辑成功!",
                });
                self.List();
              } else {
                self.$message.error(res.msg);
              }
            });
          }
        }
      });
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
          if (res.state == "200") {
            self.matchingData.splice(index, 1);
            self.$message({
              type: "success",
              message: "删除成功!",
            });
          } else {
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
          if (res.state == "200") {
            self.matchingData.splice(index, 1);
            self.$message({
              type: "success",
              message: "删除成功!",
            });
          } else {
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
          if (res.state == "200") {
            self.addMatching();
            this.RuleForm2.Matchingtext = "";
          } else {
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
          if (res.state == "200") {
            self.addOptionMatching();
          } else {
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
            if (res.state == "200") {
              self.$message({
                type: "success",
                message: "添加成功!",
              });
              self.Optionlist();
            } else {
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
            if (res.state == "200") {
              self.$message({
                type: "success",
                message: "添加成功!",
              });
              self.MatchRule();
            } else {
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
        if (res.state == "200") {
          self.matchingData = res.data;
        } else {
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
        if (res.state == "200") {
          self.matchingData = res.data;
        } else {
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
    变量列表
     */
    variableList(i) {
      const self = this;
      var data = {
        data: {
          sceneId: this.RuleForm.sceneId || 0,
        },
        version: "1.0",
      };
      self.$http.scene.listVarAlias(data).then((res) => {
        if (res.state == "200") {
          self.variableData = res.data;
        } else {
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
        if (res.state == "200") {
          if (i == 1) {
            // self.RetainovertimeTopicData = self.overtimeTopicData;
            self.overtimeTopicData = res.data;
          } else if (i == 2) {
            // self.RetainovertimeTopicData = self.trackTopicData;
            self.trackTopicData = res.data;
          }
        } else {
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
        if (res.state == "200") {
          if (i == 1) {
            // self.RetainovertimeTopicData = self.overtimeTopicData;
            self.overtimeTopicData = res.data;
          } else if (i == 2) {
            // self.RetainovertimeTopicData = self.trackTopicData;
            self.trackTopicData = res.data;
          }
        } else {
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
        if (res.state == "200") {
          let arr = [
            {
              tagName: "无",
              tagId: 0,
            },
          ];
          self.TagData = arr.concat(res.data);
        } else {
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
          branchState: "1" /*1.时段   2.非时段*/,
          sceneId: this.RuleForm.sceneId,
        },
        version: "1.0",
      };
      self.$http.scene.listBranch(data).then((res) => {
        if (res.state == "200") {
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
          self.$message.error(res.msg);
        }
      });
    },
    //获取技能组数据
    getIVRlistAll(){
      let data = {corpId:this.RuleForm.corpId}
      this.$http.select.IVRlistAll(data).then(res=>{
        if(res.state == '200'){
          this.IVRlistAll = res.data
        }
      })
    },

    /*
      话术设置提交
     */

    newSubmit(formName) {
      const self = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          self.SubmitLoading = true;
          let voiceFile = "";
          if (this.branchSegmentList.length == 1) {
            voiceFile = this.branchSegmentList[0].segVoiceFile;
          }
          if (this.title == "新增") {
            var data = {
              data: {
                ...this.RuleForm,
                dataQueryDO: { ...this.dataQueryForm },
                voiceFile,
                branchSegmentList: this.branchSegmentList,
                supplementSettingsDOList: this.supplementSettingsDOList,
              },
              version: "1.0",
            };
            self.$http.scene.addBranch(data).then((res) => {
              self.SubmitLoading = false;
              if (res.state == "200") {
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
                branchId: this.branchId,
                ...this.RuleForm,
                voiceFile,
                dataQueryDO: { ...this.dataQueryForm },
                branchSegmentList: this.branchSegmentList,
                supplementSettingsDOList: this.supplementSettingsDOList,
              },
              version: "1.0",
            };
            self.$http.scene.updateBranch(data).then((res) => {
              self.SubmitLoading = false;
              if (res.state == "200") {
                self.$message({
                  type: "success",
                  message: "编辑成功!",
                });
                this.isNew = false;
                this.List();
              } else {
                self.$message.error(res.msg);
              }
            });
          }
        } else {
          this.$message.error("请检查必填项是否填写");
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
    //内容截取分支
    branchTextChange(val) {
      let str = val.target._value;
      let arr = [];
      let oldBranchSegmentList = this.branchSegmentList;
      this.branchSegmentList = [];
      let rep = /\#\{(.+?)\}/gi;
      str = str.replace(rep, (text) => {
        arr.push(text);
        return "-";
      });
      let arr1 = str.split("-");
      arr.forEach((item, index) => {
        arr1.splice(index * 2 + 1, 0, item);
      });
      arr1.forEach((item) => {
        if (item.indexOf("#{") !== -1) {
          this.branchSegmentList.push({
            segText: item,
            segType: 2, // 1代表内容 2代表变量
            segVoiceFileUrl: "",
            segVoiceFile: "",
          });
        } else {
          if (item) {
            this.branchSegmentList.push({
              segText: item,
              segType: 1, // 1代表内容 2代表变量
              segVoiceFileUrl: "",
              //给后端传的文件名称参数
              segVoiceFile: "",
            });
          }
        }
      });
      if (oldBranchSegmentList && oldBranchSegmentList.length) {
        oldBranchSegmentList.forEach((item) => {
          this.branchSegmentList.forEach((el) => {
            if (item.segText === el.segText) {
              el.segVoiceFile = item.segVoiceFile;
              el.segVoiceFileUrl = item.segVoiceFileUrl;
            }
          });
        });
      }
    },
    /*
     合成
     */

    synthesis(item, index) {
      const self = this;
      var data = {
        status: item.segType,
        branchText: item.segText,
        branchId: "",
        segId: "",
      };
      this.$http.scene
        .synthesisBranchVoice({
          version: "1.0",
          data: data,
        })
        .then((res) => {
          const { data, state, msg } = res;
          if (state === "200") {
            this.$nextTick(() => {
              self.branchSegmentList[index].segVoiceFile = res.data.voiceFile;
              self.branchSegmentList[index].segVoiceFileUrl =
                res.data.voiceFileUrl;
            });

            self.$message.success("合成成功");
          } else {
            self.$message.error(res.msg);
          }
        });
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
    uploadWavSuccess: function(response, file, fileList, index) {
      var self = this;
      if (response.state == "200") {
        self.branchSegmentList[index].segVoiceFile = response.data.fileName;
        self.branchSegmentList[index].segVoiceFileUrl = response.data.url;
        self.$message.success("上传成功");
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
  height: calc(100vh - 273px) !important;
  overflow-y: auto;
  // overflow-y: scroll !important;
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
.voiceCard {
  margin-top: 10px;
  .aplayer {
    margin-bottom: 15px;
  }
  .lable {
    color: #898b91;
  }
  .content {
    width: 70%;
    display: inline-block;
    vertical-align: middle;
  }
  ::v-deep .el-card__body {
    padding: 12px !important;
  }
  ::v-deep .el-button-group {
    .el-button {
      margin-left: 10px;
    }
  }
}
.el-form-item--small {
  ::v-deep .el-form-item__content {
    // width: 100%;
    // padding-left: -110px;
    // width: calc(100% - 110px);
  }
}
</style>
