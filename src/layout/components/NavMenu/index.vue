<template>
  <div class="NavMenu">
    <div class="nav_conent">
      <div class="nav_conent_title">呼叫中心</div>
      <div class="nav_conent_handle clearfix">
        <div class="handle_name">
          <div class="name_img">
            <!-- <img src="@/assets/images/name_icon@2x.png" alt="" /> -->
          </div>

          <!-- <span class="name_txt">管理员：{{ name }}</span> -->
        </div>
        <!-- <span>账号名：{{ account }}</span> -->
        <el-dropdown @command="handleCommand" trigger="click">
          <span class="el-dropdown-link">
            <div class="link_img">
              <!-- <img src="@/assets/images/account_icon@2x.png" alt="" /> -->
            </div>

            <div class="link_account">
              {{ account }}<i class="el-icon-caret-bottom el-icon--right"></i>
            </div>
          </span>
          <el-dropdown-menu slot="dropdown" class="dropdown_item">
            <el-dropdown-item>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    
    <el-dialog
      title="温馨提示"
      :visible.sync="confirmVisible"
      :close-on-click-modal="false"
      :show-close="false"
      width="30%"
      custom-class="confirm_visible"
    >
      <div slot="title" class="header_title">
        <span
          ><i
            class="el-icon-warning"
            style="color: #ff8800; font-size: 26px"
          ></i>
        </span>
        <span class="title">是否退出登录？</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="submitExport"
          style="margin-left: 16px"
          >确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { setStorage, getStorage } from "@/utils/auth";
// import { logout } from "@/api/user";
export default {
  components: {},
  data() {
    return {
      name: "xxx",
      account: "账号名",
      confirmVisible: false,
    };
  },
  created() {},
  mounted() {
    if(JSON.parse(getStorage("info")) !== null){
      const { name, account } = JSON.parse(getStorage("info"));
      
      this.name = name;
      this.account = account;
    }
    
  },
  computed: {},
  methods: {
    handleCommand() {
      this.confirmVisible = true;
    },
    submitExport() {
      setStorage("token");
      setStorage("info");
          this.$router.push("/login");
      // logout().then((res) => {
      //   if (res.code === 200) {
      //     this.$message.success("退出成功");
          
      //   }
      // });
    },
  },
  watch: {},
};
</script>
<style lang="scss" scoped>
::v-deep .el-dropdown-menu__item:focus,
::v-deep .el-dropdown-menu__item:not(.is-disabled):hover {
  color: #1890ff !important;
  background: #f3f9ff !important;
}
.NavMenu {
  width: 100%;
  height: 50px;
  line-height: 50px;
  // background: url("../../../assets/images/header_back.png") no-repeat;
  background-size: cover;
  overflow: hidden;
  background: #182131;
  .nav_conent {
    background: rgba(119, 119, 119, 1);
    color: #fff;
    .nav_conent_title {
      float: left;
      padding-left: 24px;
      font-family: PingFangSC-Medium;
      font-weight: Medium;
      font-size: 16px;
      color: #ffffff;
    }
    .nav_conent_handle {
      float: right;
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      .handle_name {
        line-height: 1;
        .name_txt {
          padding-right: 0px;
        }
        .name_img {
          display: inline-block;
          margin-top: 4px;
          margin-right: 5px;
          vertical-align: bottom;
          width: 14px;
          height: 14px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      ::v-deep .el-dropdown {
        height: 50px;
      }

      ::v-deep .el-dropdown-link {
        height: 50px;
        display: inline-block;
        border-top: 0 red solid;
      }
      ::v-deep .el-dropdown-link .link_img {
        display: inline-block;
        margin-top: 13px;
        margin-right: 12px;
        width: 36px;
        height: 36px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      ::v-deep .el-dropdown-link .link_account {
        display: inline-block;
        vertical-align: top;
        font-family: PingFangSC-Medium;
        font-weight: Medium;
        font-size: 16px;
        color: #ffffff;
        i {
          font-size: 10px;
        }
      }

      span,
      .handle_name {
        padding-right: 20px;
        font-family: PingFangSC-Regular;
        font-weight: Regular;
        font-size: 14px;
        color: #ffffff;
      }
      span:last-child {
        cursor: pointer;
      }
    }
  }
  ::v-deep .confirm_visible {
    height: 128px;
    line-height: 1;
    .header_title {
      .title {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #1f2329;
        line-height: 24px;
        padding-left: 16px;
        vertical-align: text-bottom;
      }
      .content {
        font-family: PingFangSC-Regular;
        font-weight: Regular;
        font-size: 14px;
        color: #1f2329;
        padding-top: 8px;
        padding-left: 42px;
      }
    }
    .el-dialog__header {
      padding: 24px 24px 10px;
    }
    .el-dialog__body {
      padding: 0;
    }
    .el-dialog__footer {
      padding: 10px 24px 24px;
      margin-top: 4px;
    }
  }
}
</style>
