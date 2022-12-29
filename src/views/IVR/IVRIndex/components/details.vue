<style lang="scss" scoped>
.el-divider--horizontal {
  margin-top: 0;
}
</style>
<template>
  <div id="Box">
    <!-- @tab-click="handleClick"  -->
    <el-tabs v-model="activeName" class="tabs">
      <el-tab-pane label="时段话术" name="first">
        <Import-SetUp
          v-if="activeName == 'first'"
          :auditStatus="auditStatus"
        ></Import-SetUp>
      </el-tab-pane>
      <el-tab-pane label="非时段话术" name="second">
        <Import-NotSetUp
          v-if="activeName == 'second'"
          :auditStatus="auditStatus"
        ></Import-NotSetUp>
      </el-tab-pane>
      <el-tab-pane label="变量设定" name="third">
        <Import-Variable
          v-if="activeName == 'third'"
          :auditStatus="auditStatus"
        ></Import-Variable>
      </el-tab-pane>
      <el-tab-pane label="知识库" name="fourth">
        <Import-Knowledge
          v-if="activeName == 'fourth'"
          :auditStatus="auditStatus"
        ></Import-Knowledge>
      </el-tab-pane>
      <el-tab-pane label="数据标签" name="fifth">
        <Import-Label
          v-if="activeName == 'fifth'"
          :auditStatus="auditStatus"
          :tagType="tagType"
        ></Import-Label>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ImportLabel from "./label.vue"; //标签页面
import ImportVariable from "./variable.vue"; //变量页面
import ImportKnowledge from "./knowledge.vue"; //知识库页面
import ImportSetUp from "./setUp.vue"; //话术设置
import ImportNotSetUp from "./notSetUp.vue"; //非时段话术设置

export default {
  data() {
    return {
      activeName: "first",
      clientId: "",
      auditStatus: false,
      userType: "",
    };
  },
  created() {
    this.clientId = this.$route.query.clientId;
    this.userType = false;
    let status = this.$route.query.auditStatus;
    if (this.userType) {
      if (status == 2) {
        this.auditStatus = true;
      } else {
        this.auditStatus = false;
      }
    } else {
      this.auditStatus = false;
    }

    // this.List();
  },

  components: {
    ImportLabel,
    ImportVariable,
    ImportKnowledge,
    ImportSetUp,
    ImportNotSetUp,
  },

  computed: {},

  methods: {},
};
</script>
<style lang="scss" scoped>
#Box {
  width: 100%;
  // padding: 20px;
  box-sizing: border-box;
  background: #eeeeee;
  height: 100%;
  /deep/ .el-table td {
    padding: 3px 0;
  }
  .tabs {
    width: 100%;
    background: white;
    // padding: 20px;
    box-sizing: border-box;
    min-height: 100%;
  }
  #queryBox {
    background: white;
    padding: 20px;
    box-sizing: border-box;
  }
  .title {
    width: 100%;
    display: flex;
    justify-content: space-between;

    .operation {
      margin-right: 30px;
    }
  }
  #variableSetting {
    width: 50%;
    margin: 0 auto;
  }
}
.demo-drawer__footer {
  width: 50%;
  position: fixed;
  bottom: 0;
  padding: 20px 0;
  display: flex;
  justify-content: center;
}
</style>
