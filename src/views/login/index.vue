<template>
  <div class="login">
    <div class="left">
      <div class="title">
        <img src="@/assets/login_icon.png" alt />
        <span class="titleName">黑马管理系统</span>
        <span class="titleLine">|</span>
        <span class="titleName">用户登陆</span>
      </div>
      <div class="body">
        <el-form :model="loginForm" ref="loginForm" :rules="rules">
          <el-form-item prop="phone">
            <el-input
              v-model.number="loginForm.phone"
              placeholder="请输入手机号"
              prefix-icon="el-icon-user"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              v-model="loginForm.password"
              placeholder="请输入密码"
              prefix-icon="el-icon-lock"
            ></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-row :gutter="20">
              <el-col :span="16">
                <el-input
                  v-model.trim="loginForm.code"
                  placeholder="请输入验证码"
                  prefix-icon="el-icon-key"
                ></el-input>
              </el-col>
              <el-col :span="8">
                <img :src="codeUrl" @click="getCode" alt style="width:100%" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item prop="isCheck">
            <el-checkbox v-model.number="loginForm.isCheck">
              我已阅读并同意
              <el-link type="primary">用户协议</el-link>和
              <el-link type="primary">隐私条款</el-link>
            </el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width:100%" @click="login">登 陆</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width:100%" @click="register">注 册</el-button>
          </el-form-item>
        </el-form>
        <!-- 注册组件 -->
        <register-form ref="RegisterForm"></register-form>
      </div>
    </div>
    <div class="right">
      <img src="@/assets/login_bg.png" alt />
    </div>
  </div>
</template>

<script>
import RegisterForm from "./register";
import { setToken } from "@/utils/token.js";
export default {
  name: "Login",
  components: {
    RegisterForm
  },
  data() {
    return {
      codeUrl: process.env.VUE_APP_BASEURL + "/captcha?type=login",
      loginForm: {
        phone: "18511111111",
        password: "12345678",
        code: "",
        isCheck: false
      },
      rules: {
        phone: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("请输入手机号"));
              } else if (!/^1[3456789]\d{9}$/.test(value)) {
                callback(new Error("请输入11位手机号"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "密码长度至少6个字符", trigger: "blur" }
        ],
        code: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { min: 4, max: 4, message: "验证码长度为4位", trigger: "blur" }
        ],
        isCheck: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("必须勾选用户协议"));
              }
              callback();
            },
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    register() {
      this.$refs.RegisterForm.dialogVisible = true;
    },
    getCode() {
      this.codeUrl += "&r=" + Math.random();
    },
    login() {
      // 先验证表单
      this.$refs.loginForm.validate(async valid => {
        if (!valid) return;
        const res = await this.$axios.post("/login", this.loginForm);
        if (res.data.code == 200) {
          this.$message({
            message: "登录成功~",
            type: "success"
          });
          let token = res.data.data.token;
          setToken(token);
          this.$router.push("/layout/user");
        } else {
          this.$message({
            message: res.data.message,
            type: "error"
          });
          this.getCode();
        }
      });
    }
  }
};
</script>

<style lang="less">
.login {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  background: linear-gradient(
    225deg,
    rgba(20, 147, 250, 1),
    rgba(1, 198, 250, 1)
  );
  .left {
    width: 478px;
    height: 550px;
    padding: 42px;
    background-color: #f5f5f5;
    .title {
      display: flex;
      align-items: center;
      .titleName {
        font-size: 24px;
        font-weight: normal;
        color: rgba(12, 12, 12, 1);
        margin: 0 15px;
      }
    }
    .body {
      margin-top: 30px;
    }
  }
}
</style>