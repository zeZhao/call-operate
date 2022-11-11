<template>
  <div class="layout">
    <NavMenu></NavMenu>
    <div class="content">
      <div class="content_side">
        <Sidebar></Sidebar>
      </div>
      <div class="content_cnt">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import NavMenu from "./components/NavMenu";
import Sidebar from "./components/Sidebar";
export default {
  components: { NavMenu, Sidebar },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {},
  watch: {},
};
</script>
<style lang="scss" scoped>
.layout {
  width: 100%;
  height: 100vh;
  .content {
    background: #fff;
    position: relative;
    height: calc(100vh - 50px);
    overflow-y: auto;
    // min-height: 100%;
    .content_side {
      width: 175px;
      height: calc(100vh - 50px);
      float: left;
      position: fixed;
    }
    .content_cnt {
      // min-height: 100%;
      min-height: calc(100vh - 110px);
      margin-left: 175px;
      position: relative;
      background: #f8f9fa;
      padding: 16px;
      .content_view {
        height: 100%;
      }

      ::v-deep .el-button {
        min-width: 92px;
        height: 32px;
        padding: 7px 20px;
      }
      ::v-deep .el-button--primary {
        background-color: #1890ff;
        border-color: #1890ff;
      }
      ::v-deep .el-form-item__content {
        line-height: 32px;
      }
      ::v-deep .el-input__inner {
        height: 32px;
        line-height: 32px;
      }
      ::v-deep .el-form-item__label {
        padding: 0 !important;
        line-height: 34px !important;
      }
      ::v-deep .el-input__icon {
        height: auto;
        line-height: 32px;
      }
      ::v-deep .el-date-editor .el-range-separator {
        height: auto;
      }
    }
  }
}
</style>
