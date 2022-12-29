<template>
  <div class="login-container">
    <div class="head-logo">
      <img :src="logo" alt />
      <!-- <h3>呼叫中心运营平台</h3> -->
    </div>
    <div class="login_box" style="display: block">
      <!-- <img class="loginImg" src="../../../src/image/login_bg.png" alt /> -->
      <div class="loginFormStyle">
        <div class="login_name">
          <h2>呼叫中心运营平台1</h2>
          <p>
            <!-- <span>|</span>短信系统 -->
          </p>
        </div>
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          autocomplete="on"
          label-position="left"
        >
          <el-form-item prop="account" label="账号">
            <el-input
              ref="account"
              v-model="loginForm.account"
              placeholder="请输入账号"
              name="account"
              type="text"
              tabindex="1"
            />
          </el-form-item>

          <el-form-item prop="pwd" label="密码">
            <el-input
              v-model="loginForm.pwd"
              type="password"
              placeholder="请输入密码"
              tabindex="2"
            />
          </el-form-item>

         
          <el-button
            :loading="loading"
            type="primary"
            class="loginBut"
            @click.native.prevent="handleLogin"
            >登录</el-button
          >
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
// import {Encrypt,Decrypt } from "@/utils/validate";

// import { phone } from "@/utils/validator";
// import SocialSign from "./components/SocialSignin";
import { setStorage, getStorage,randomNum, getTime } from "@/utils/auth";
import logo from "@/assets/images/logo.png";
export default {
  name: "Login",
  // components: { SocialSign },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 8) {
        callback(new Error("密码至少为8位数"));
      } else {
        callback();
      }
    };
    const validateVerifyCode = (rule, value, callback) => {
      if (value.length !== 6) {
        callback(new Error("口令为6位数"));
      } else {
        callback();
      }
    };
    return {
      logo: logo,
      captcha: "",
      loginForm: {
        account: "",
        pwd: "",
        // verifyCode: "",
        // uuid: this.common.randomNum(),
        // time: this.common.getTime()
      },
      loginRules: {
        // account: [{ required: true, trigger: "blur", validator: phone }],
        account: [{ required: true, trigger: "blur", message:'请输入账号'}],
        pwd: [{ required: true, trigger: "blur", message:'请输入密码'}],
        // pwd: [
        //   // { required: true, trigger: "blur", validator: validatePassword }
        // ],
        verifyCode: [
          { required: true, trigger: "blur", validator: validateVerifyCode }
        ]
      },
      capsTooltip: false,
      loading: false,
    };
  },
  watch: {
  },
  created() {
  },
  mounted() {
    // this.getCaptcha();
    // localStorage.uuid = this.common.randomNum();
    // localStorage.time = this.common.getTime();
    // window.localStorage.getItem('uuid')
    window.addEventListener('keydown',this.keyDown);
  },
  destroyed() {
    window.removeEventListener('keydown',this.keyDown,false);
  },
  methods: {
    keyDown(e){
      //如果是回车则执行登录方法
      if(e.keyCode == 13){
         this.handleLogin();
      }
    },
    getCaptcha() {
      const num = Math.ceil(Math.random() * 10); //生成一个随机数（防止缓存）
      this.captcha =
        process.env.VUE_APP_BASE_API +
        "/sysLogin/captcha?uuId=" +
        this.loginForm.uuid +
        "&num=" +
        num;
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$http.login.login(this.loginForm).then(res=>{
            if(res.state == '200'){
              
              setStorage('token',res.msg)
              // setStorage('info',res.data)
              this.$router.push("/");
              
              this.$message.success("登录成功");
              this.loading = false;
            }else{
              this.loading = false;
              // this.getCaptcha()
              this.$message.error(res.msg)
            }
          }).catch(()=>{
            this.loading = false;
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  }
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #000;
$cursor: #333;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-form-item {
    // border: 1px solid #999;
    border-radius: 5px;
    color: #454545;
  }
  // .el-input {
  //   display: inline-block;
  //   height: 47px;
  //   input {
  //     border: 0px;
  //     -webkit-appearance: none;
  //     border-radius: 0px;
  //     background-color: #fff;
  //     padding: 12px 5px 12px 15px;
  //     color: $light_gray;
  //     height: 47px;
  //     caret-color: $cursor;
  //     &:-webkit-autofill {
  //     }
  //   }
  // }

  // .el-form-item {
  //   border: 1px solid #f2f2f2;
  //   background: #fff;
  //   border-radius: 5px;
  //   color: #454545;
  // }
}
</style>

<style lang="scss" scoped>
$bg: #f8ffff;
$dark_gray: #889aa4;
$light_gray: #eee;
.el-form-item__content {
  background-color: #fff;
}
.loginFormStyle {
  height: 470px;
  border: 1px solid #cccccc;
  vertical-align: top;
  width: 45%;
  margin: 0 auto;
  background: #fff;
  &:hover {
    box-shadow: 0 5px 10px 0 rgba(51, 51, 51, 0.3);
  }
}
.login_name {
  width: 100%;
  float: left;
  text-align: left;
  // margin-top: 20px;
  padding: 40px 35px 0;
  color: #666;
  box-sizing: border-box;
}
.login_name span {
  margin-right: 10px;
  font-weight: 700;
  color: #0964ff;
}
.login-container {
  min-height: 100%;
  width: 100%;

  background-color: $bg;
  background: url("../../assets/images/login-bg.png") no-repeat;
  overflow: hidden;
  .head-logo {
    
    position: fixed;
    top: 0;
    left: 0;
    padding: 12px 32px;
    box-sizing: border-box;
    img {
      width: 176px;
      height: 50px;
      object-fit: fill;
      cursor: pointer;
      display: inline-block;
      vertical-align: super;
    }
    h3 {
      display: inline-block;
      vertical-align: text-bottom;
      padding-left: 10px;
      color: #666666;
    }
  }

  .login-form {
    position: relative;
    width: 100%;
    display: inline-block;
    max-width: 100%;
    padding: 20px 35px 0;
    margin: 0 auto;
    overflow: hidden;
    vertical-align: top;
    box-sizing: border-box;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }
  .captcha_code {
    width: 50%;
    display: inline-block;
    text-align: right;
    height: 47px;
  }
  .captcha_code img {
    display: inline-block;
    height: 100%;
    vertical-align: -webkit-baseline-middle;
    cursor: pointer;
  }
  .loginImg {
    width: 50%;
  }
  .login_box {
    width: 1000px;
    display: block;
    margin: 0 auto;
    vertical-align: middle;
    position: relative;
    top: 50%; /*偏移*/
    transform: translateY(50%);
  }
  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
  @media only screen and (max-width: 1550px) {
    .login_box {
      transform: translateY(20%);
    }
  }
  @media only screen and (max-width: 1311px) {
    .login_box {
      transform: translateY(10%);
    }
  }
  @media only screen and (max-width: 1222px) {
    .login_box {
      transform: translateY(8%);
    }
  }
  .loginBut {
    display: inline-block;
    vertical-align: middle;
    padding: 12px 24px;
    margin: 20px 0;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    cursor: pointer;
    color: #ffffff;
    // background-color: #69bebf;
    border-radius: 3px;
    border: none;
    -webkit-appearance: none;
    outline: none;
    width: 100%;
  }
}
</style>
