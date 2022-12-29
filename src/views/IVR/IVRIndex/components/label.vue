<style lang="scss" scoped>
.el-divider--horizontal {
  margin-top: 0;
}
</style>
<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane name="1">
        <span slot="label">
          <el-radio v-model="activeName" label="1">单节点</el-radio>
        </span>
        <Standalone></Standalone>
      </el-tab-pane>
      <el-tab-pane label="多节点" name="2">
        <span slot="label">
          <el-radio v-model="activeName" label="2">多节点</el-radio>
        </span>
        <Binode></Binode>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Binode from "./lableComponents/Binode.vue";
import Standalone from "./lableComponents/Standalone.vue";
export default {
  data() {
    return {
      activeName: this.$route.query.tagType || '1',
    };
  },
  created() {
    this.updateSceneTag(this.activeName);
  },
  components: { Binode, Standalone },

  computed: {},
  mounted() {},

  methods: {
    handleClick(tab, event) {
      this.updateSceneTag(tab.name);
    },
    updateSceneTag(type) {
      const self = this;
      var data = {
        data: {
          sceneId: self.$route.query.sceneId,
          tagType: type || '1',
        },
        version: "1.0",
      };
      self.$http.scene.updateSceneTag(data).then((res) => {
        // if (res.state !== "200") {
        //   self.$message.error(res.msg);
        // }
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
