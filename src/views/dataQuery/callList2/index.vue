<template>
  <div class="company">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="_mxCreate"
      :add="false"
    ></Search>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      :height="tableHeight"
    >
      <el-table-column label="序号" type="index" align="center" />
      <el-table-column prop="attendName" label="坐席名称" />
      <!-- <el-table-column prop="uploadTime" label="导入时间" >
        <template slot-scope="{row}">
          <span>{{row.uploadTime | dateTime}}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="startTime" label="开始时间" >
        <template slot-scope="{row}">
          <span>{{row.startTime | dateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="connTime" label="接通时间" >
        <template slot-scope="{row}">
          <span>{{row.connTime | dateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间" >
        <template slot-scope="{row}">
          <span>{{row.endTime | dateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="callerId" label="主叫" />
      <el-table-column prop="calledId" label="被叫" />
      <el-table-column prop="callId" label="呼叫ID" />
      <!-- <el-table-column prop="callType" label="通话类型" >
        <template slot-scope="{row}">
          <span v-if="row.callType == 1">AI外呼</span>
          <span v-if="row.callType == 2">外呼人工</span>
          <span v-if="row.callType == 3">呼入</span>
          <span v-if="row.callType == 4">呼入人工</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="lineIp" label="线路ip" />
      <el-table-column prop="linePort" label="线路端口" />
      <el-table-column prop="hangupCause" label="挂机原因" />
      <el-table-column prop="talkDuration" label="通话时长" />
      <el-table-column prop="userName" label="用户名称" />
      <el-table-column prop="costType" label="用户收费类型" >
        <template slot-scope="{row}">
          <span v-if="row.costType == 1">费率</span>
          <span v-if="row.costType == 2">套餐</span>
          <span v-if="row.costType == 3">套餐+余额</span>
        </template>
      </el-table-column>
      <el-table-column prop="costDuration" label="用户收费时长" />
      <el-table-column prop="cost" label="用户费用" />
      <el-table-column prop="period" label="用户计费周期" />
      <el-table-column prop="costSetMeal" label="用户套餐扣除时长" />
      <el-table-column prop="agentName" label="代理商名称" />
      <el-table-column prop="agentCostType" label="代理商收费类型" >
        <template slot-scope="{row}">
          <span v-if="row.agentCostType == 1">费率</span>
          <span v-if="row.agentCostType == 2">套餐</span>
          <span v-if="row.agentCostType == 3">套餐+余额</span>
        </template>
      </el-table-column>
      <el-table-column prop="agentCostDuration" label="代理商收费时长" />
      <el-table-column prop="agentCost" label="代理商费用" />
      <el-table-column prop="agentPeriod" label="代理商计费周期" />
      <el-table-column prop="agentSetMeal" label="代理商套餐扣除时长" />
      <el-table-column prop="supplyName" label="供应商名称" />
      <el-table-column prop="supplyCostType" label="供应商收费类型" >
        <template slot-scope="{row}">
          <span v-if="row.supplyCostType == 1">费率</span>
          <span v-if="row.supplyCostType == 2">套餐</span>
          <span v-if="row.supplyCostType == 3">套餐+余额</span>
        </template>
      </el-table-column>
      <el-table-column prop="supplyCostDuration" label="供应商收费时长" />
      <el-table-column prop="supplyCost" label="供应商费用" />
      <el-table-column prop="supplyPeriod" label="供应商计费周期" />
      <el-table-column prop="supplySetMeal" label="供应商套餐扣除时长" />
      <el-table-column prop="dataTag" label="标签" />
      <el-table-column prop="recordFile" label="录音" >
        <template slot-scope="{row}">
          <a :href="origin + row.recordFile" target="_blank" rel="noopener noreferrer">录音</a>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button
            @click="dialogue(scope.index, scope.row)"
            type="text"
            size="small"
            >通话详情</el-button
          >
        </template>
      </el-table-column> -->
    </el-table>
    <Page
      :pageObj="pageObj"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></Page>
    <el-dialog
      :title="title"
      :visible.sync="isDetails"
      width="50%"
      top="30px"
      :destroy-on-close="true"
    >
      <div class="audition">
        <div v-if="auditionUrl" class="audio-con">
          <audio :src="auditionUrl" controls ref="myAudio"></audio>
        </div>
        <div v-if="!auditionUrl" class="audio-con"></div>
        <el-button
          type="primary"
          @click="Audition(rowData.recordFile)"
          style="height: 40px"
        >
          完整录音试听
          <i class="el-icon-headset el-icon--right"></i>
        </el-button>
      </div>
      <div class="conversation">
        <ul v-for="(item, index) in detailsData" :key="index">
          <li>
            <div class="date">
              <span class="img_logo">
                <img src="../../../assets/images/robot.png" alt />
              </span>
              <span>
                机器人：{{ item.robotSpeechTime }}
                <i
                  class="el-icon-service"
                  @click="Audition(item.branchAudio)"
                ></i>
              </span>
            </div>

            <span class="content">{{ item.robotSpeechText }}</span>
          </li>
          <li class="liRight">
            <!-- 不可以删 -->
            <div></div>
            <div v-show="item.custSpeechText">
              <div class="date">
                <span>
                  客户：{{ item.custSpeechTime }}
                  <i
                    class="el-icon-service"
                    @click="Audition(item.replyAudio)"
                  ></i>
                </span>
                <span class="img_logo">
                  <img src="../../../assets/images/client.png" alt />
                </span>
              </div>

              <div class="content cur">{{ item.custSpeechText }}</div>
            </div>
          </li>
        </ul>
      </div>
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
        { type: "input", label: "主叫", key: "callerId" },
        { type: "input", label: "被叫", key: "calledId" },
        { type: "input", label: "座席姓名", key: "attendName" },
        { type: "input", label: "工号", key: "jobNumber" },
        { type: "select", label: "商家账户", key: "userId", optionData:[] },
        { type: "select", label: "供应商账户", key: "supplyId", optionData:[] },
        { type: "select", label: "代理商账户", key: "agentId", optionData:[] },
        { type: "input", label: "挂机原因", key: "hangupCause" },
        { type: "input", label: "通话时长>", key: "talkDuration" },
        { type: "date", label: "开始时间", key: "startTime" },
        { type: "date", label: "终止时间", key: "endTime" },
      ],
      //搜索框数据
      searchParam: {},
      //接口地址
      searchAPI: {
        namespace: "dataquery",
        list: "attendLogList",
      },
      isParamsNotData: false,
      submitParamsIsData: false,
      // 列表参数
      namespace: "",
      namespaceType: "Array",
      title: "",
      isDetails: false,
      auditionUrl: "",
      detailsData: [],
      origin:process.env.VUE_APP_USER_URL
    };
  },
  created() {},
  mounted() {
    this.queryCorpByCorpType(0)
    this.queryCorpByCorpType(1)
    this.queryCorpByCorpType(2)
  },
  computed: {},
  methods: {
    //获取公司下拉
    // corpType（0:商家,1:代理商,2:供应商）
    queryCorpByCorpType(corpType) {
      this.$http.select.queryCorpByCorpType({ corpType }).then((res) => {
        if(corpType === 0){
          this._setDefaultValue(
            this.searchFormConfig,
            res.data.records,
            "userId",
            "corpId",
            "corpName"
          );
        }else if(corpType === 1){
          this._setDefaultValue(
            this.searchFormConfig,
            res.data.records,
            "agentId",
            "corpId",
            "corpName"
          );
        }else{
          this._setDefaultValue(
            this.searchFormConfig,
            res.data.records,
            "supplyId",
            "corpId",
            "corpName"
          );
        }
        
      });
    },
    /*
      试听
     */
    Audition(url) {
      if (url) {
        this.auditionUrl = url;
        let audio = this.$refs.myAudio;
        setTimeout(() => {
          if (audio.paused === false) {
            audio.pause();
            return false;
          }
          audio.play();
        }, 200);
      }
    },
    /*
      对话详情
     */
    dialogue(index, row) {
      const self = this;

      self.rowData = row;
      this.auditionUrl = row.recordFile;
      self.title =
        "电话:" + self.rowData.calledId + "   时间:" + new Date(self.rowData.startTime).Format("yyyy-MM-dd hh:mm:ss");
      this.$http.dataquery.voicetalkAiList(row.dataId).then(res => {
        if (res.state == "200") {
          if (res.data.length == 0) {
            self.$notify({
              title: "提示",
              message: "暂无对话详情"
            });
            return;
          }
          self.isDetails = true;
          res.data.forEach(val => {
            val.robotSpeechTime = new Date(val.robotSpeechTime).Format("yyyy-MM-dd hh:mm:ss");
            val.custSpeechTime = new Date(val.custSpeechTime).Format("yyyy-MM-dd hh:mm:ss");
            // val.custSpeechTime = datetime(val.custSpeechTime);
          });
          self.detailsData = res.data;
        } else {
          self.$message.error(res.msg);
        }
      });
    },
  },
  watch: {},
};
</script>
<style lang="scss" scoped>
.audition {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.audio-con {
  width: 70%;
}
.audio-con audio {
  width: 100%;
}
.conversation {
  margin-top: 20px;
  padding-top: 10px;
  width: 100%;
  max-height: 500px;
  background: white;
  overflow-y: scroll;
  ul {
    width: 100%;
    margin: 0;
    padding: 0;
    padding: 0 10px;
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    li {
      width: 50%;
      list-style-type: none;

      margin-bottom: 5px;
      float: left;

      .date {
        display: flex;
      }
    }
    li.liRight {
      width: 100%;
      display: flex;
      justify-content: space-between;

      .date {
        text-align: right;
      }
    }

    .img_logo {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 1px solid rgb(107, 103, 103);
      display: inline-block;

      margin-right: 15px;
      img {
        width: 30px;
        height: 30px;
        padding: 2px;
        box-sizing: border-box;
      }
    }
    .img_logo:nth-child(2) {
      margin-left: 15px;
    }
    .content {
      margin-top: 15px;
      margin-left: 20px;
      background: #0181cc;
      padding: 10px;
      box-sizing: border-box;
      border-radius: 10px;
      color: white;
      display: inline-block;
    }
    .content.cur {
      margin-right: 20px;
      width: 280px;
      background: #ef8201;
      float: right;
    }
  }
}
</style>
