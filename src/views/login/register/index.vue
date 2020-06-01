<template>
  <div class="register">
    <el-dialog :visible.sync="dialogVisible" center width="600px">
      <div class="register-header" slot="title">用户注册</div>
      <el-form :model="registerForm" ref="registerForm" label-width="100px" :rules="rules">
        <el-form-item label="昵称" prop="username">
          <el-input v-model.trim="registerForm.username" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model.trim="registerForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model.trim="registerForm.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model.trim="registerForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="图形吗" prop="code">
          <el-row>
            <el-col :span="16">
              <el-input v-model.trim="registerForm.code" placeholder="请输入图形码"></el-input>
            </el-col>
            <el-col :span="7">
              <img :src="captchaUrl" @click="getCode" style="width:100%;margin-left:20px" />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="验证码" prop="rcode">
          <el-row>
            <el-col :span="16">
              <el-input v-model.number="registerForm.rcode" placeholder="请输入验证码"></el-input>
            </el-col>
            <el-col :span="7">
              <el-button style="width:100%;margin-left:20px" @click="getRcode">获取用户验证码</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align:center">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      captchaUrl: process.env.VUE_APP_BASEURL + "/captcha?type=sendsms",
      registerForm: {
        username: "",
        phone: "",
        email: "",
        avatar: "",
        password: "",
        rcode: "",
        code: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        email: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("请输入邮箱"));
              } else if (
                !/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(
                  value
                )
              ) {
                callback(new Error("请输入正确的邮箱格式"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ],
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
          { required: true, message: "请输入图形码", trigger: "blur" },
          { min: 4, max: 4, message: "图形码为4个字符", trigger: "blur" }
        ],
        rcode: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { min: 4, max: 4, message: "验证码为4个字符", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    dialogVisible(newValue) {
      if (!newValue) {
        this.$refs.registerForm.resetFields();
      }
    }
  },
  methods: {
    submit() {},
    getCode() {
      this.captchaUrl += "&r=" + Math.random();
    },
    async getRcode() {
      // let { code, phone } = this.registerForm;
      const res = await this.$axios.post("/sendsms", {
        code: this.registerForm.code,
        phone: this.registerForm.phone
      });
      console.log(res);
      if (res.data.code == 200) {
        let captcha = res.data.data.captcha;
        this.$message("验证码: " + captcha);
        this.registerForm.rcode = captcha;
      }
    }
  }
};
</script>

<style lang="less">
.register {
  .register-header {
    height: 53px;
    line-height: 53px;
    background-color: #03c0f9;
    text-align: center;
    color: #fff;
  }
  .el-dialog__header {
    padding: 0px;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
  }
}
</style>