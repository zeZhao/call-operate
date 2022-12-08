!<template>
  <div class="voice">
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

            <el-button type="text" size="small" @click="synthesis(item, index)"
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
  </div>
</template>

<script>
import aplayer from "vue-aplayer";
export default {
  components:[aplayer],
  props: {
    voiceRow: {
      type: Object,
      require: true,
      default: () => {
        return {};
      },
    },
    varfile: {
      type: String,
      require: true,
      default: () => {
        return "";
      },
    },
  },
  components: {},
  data() {
    return {
      varfileUrl: this.varfile
    };
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
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
      this.$nextTick(()=>{
        self.varfileUrl = val.voiceFileUrl;
      })
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
  },
  watch: {},
};
</script>
<style lang="scss" scoped>
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
</style>
