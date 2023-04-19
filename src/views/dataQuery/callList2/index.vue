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
      <!-- <el-table-column prop="dataTag" label="标签" /> -->
      <el-table-column prop="recordFile" label="录音" >
        <template slot-scope="{ row }">
          <el-button type="text" @click="look(row)">查看录音</el-button>
          <!-- <a :href="origin + row.recordFile" target="_blank" rel="noopener noreferrer">录音</a> -->
        </template>
      </el-table-column>
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
      top="150px"
      :destroy-on-close="true"
    >
      <div class="audition">
        <div class="audio-con">
          <audio :src="auditionUrl" controls ref="myAudio"></audio>
        </div>
        <div v-if="!auditionUrl" class="audio-con"></div>
        <el-button type="primary" @click="Audition()" style="height: 40px">
          完整录音试听
          <i class="el-icon-headset el-icon--right"></i>
        </el-button>
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
        { type: "input", label: "坐席姓名", key: "attendName" },
        { type: "input", label: "工号", key: "jobNumber" },
        { type: "select", label: "商家账户", key: "userId", optionData:[] },
        { type: "select", label: "供应商账户", key: "supplyId", optionData:[] },
        { type: "select", label: "代理商账户", key: "agentId", optionData:[] },
        { type: "input", label: "挂机原因", key: "hangupCause" },
        { type: "input", label: "通话时长>", key: "talkDuration" },
        // { type: "datetime", label: "开始时间", key: "startTime" },
        // { type: "datetime", label: "终止时间", key: "endTime" },
        { type: "datetime", label: "导入时间", key: ["","startTime","endTime"] },
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
    this.getCorpListAll()
    this.getUserListAll()
    this.getAgentListAll()
  },
  activated(){
    this.getCorpListAll()
    this.getUserListAll()
    this.getAgentListAll()
  },
  computed: {},
  methods: {
    //获取供应商账户
    getCorpListAll(){
      this.$http.select.corpListAll({}).then(res=>{
        this._setDefaultValue(this.searchFormConfig,res.data.records,'supplyId','supplyId','userName')
      })
    },
    // 获取商户账户
    getUserListAll(){
      this.$http.select.userListAll({}).then(res=>{
        this._setDefaultValue(this.searchFormConfig,res.data.records,'userId','userId','userName')
      })
    },
    // 获取代理商账户
    getAgentListAll(){
      this.$http.select.agentListAll({}).then(res=>{
        this._setDefaultValue(this.searchFormConfig,res.data.records,'agentId','agentId','userName')
      })
    },
    look(row) {
      this.$nextTick(() => {
        this.auditionUrl = this.origin + row.recordFile;
      });

      this.isDetails = true;
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
