<template>
  <div class="register">
    <el-dialog :visible.sync="dialogVisible" center width="600px">
      <div class="register-header" slot="title">用户注册</div>
      <el-form :model="registerForm" ref="registerForm" label-width="100px" :rules="rules">
        <el-form-item label="头像" prop="avatar">
          <!-- upload的name字段必须写 -->
          <el-upload
            class="avatar-uploader"
            :action="avatarUrl"
            name="image"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
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
      imageUrl: "",
      avatarUrl: process.env.VUE_APP_BASEURL + "/uploads",
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
        avatar: [{ required: true, message: "请添加头像", trigger: "change" }],
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
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("验证码不能为空"));
              }
              if (!Number.isInteger(value)) {
                return callback(new Error("验证码为数字"));
              }
              callback();
            },
            trigger: "change"
          }
        ]
      }
    };
  },
  watch: {
    dialogVisible(newValue) {
      if (!newValue) {
        this.$refs.registerForm.resetFields();
        this.imageUrl = "";
      }
    }
  },
  methods: {
    submit() {
      // 先验证表单
      this.$refs.registerForm.validate(async valid => {
        if (!valid) return;
        const res = await this.$axios.post("/register", this.registerForm);
        if (res.data.code == 200) {
          this.$message({
            message: "注册成功~",
            type: "success"
          });
          this.dialogVisible = false;
        } else {
          this.$message({
            message: res.data.message,
            type: "error"
          });
        }
      });
    },
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
    },
    handleAvatarSuccess(res, file) {
      // console.log(res, file);
      this.imageUrl = process.env.VUE_APP_BASEURL + "/" + res.data.file_path;
      this.registerForm.avatar = res.data.file_path;
    },
    beforeAvatarUpload(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG/PNG/GIF 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
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
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>