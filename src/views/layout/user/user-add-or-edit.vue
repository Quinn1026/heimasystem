<template>
  <div class="userEdit">
    <el-dialog :visible.sync="dialogVisible" width="480px">
      <div slot="title" class="dialog-header">{{mode == 'add' ? '新增用户':'编辑用户'}}</div>
      <el-form :model="formUserEdit" :rules="rules" ref="formUserEdit" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formUserEdit.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formUserEdit.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="formUserEdit.phone" placeholder="请输入电话"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role_id">
          <el-select v-model="formUserEdit.role_id" placeholder="请选择角色">
            <el-option v-for="(item, index) in roleList" :key="index" :label="item" :value="+index"></el-option>
            <!-- <el-option label="超级管理员" :value="1"></el-option>
            <el-option label="管理员" :value="2"></el-option>
            <el-option label="教师" :value="3"></el-option>
            <el-option label="学生" :value="4"></el-option>-->
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formUserEdit.status" placeholder="请选择状态">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户备注" prop="remark">
          <el-input v-model="formUserEdit.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "UserEdit",
  props: {
    roleList: Object
  },
  watch: {
    dialogVisible(newValue) {
      if (newValue) {
        this.$nextTick(() => {
          this.$refs.formUserEdit.clearValidate();
        });
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      mode: "",
      editId: "",
      formUserEdit: {
        username: "",
        email: "",
        phone: "",
        status: "",
        role_id: "",
        remark: ""
      },
      rules: {
        username: [
          { required: true, message: "请选择活动区域", trigger: "blur" }
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
        role_id: [{ required: true, message: "请选择角色", trigger: "change" }]
      }
    };
  },

  methods: {
    submit() {
      // 校验表单
      this.$refs.formUserEdit.validate(async valid => {
        if (!valid) return;
        let res = null;
        if (this.mode == "add") {
          res = await this.$axios.post("/user/add", this.formUserEdit);
        } else {
          res = await this.$axios.post("/user/edit", {
            id: this.editId,
            ...this.formUserEdit
          });
        }

        if (res.data.code == 200) {
          this.$message({
            message: this.mode == "add" ? "新增成功~" : "编辑成功",
            type: "success"
          });
          this.dialogVisible = false;
          this.$parent.search();
        } else {
          this.$message({
            message: res.data.message,
            type: "error"
          });
        }
      });
    }
  }
};
</script>

<style lang="less">
.userEdit {
  .el-dialog__header {
    padding: 0px;
  }
  .el-dialog__headerbtn .el-dialog__close,
  .el-dialog__headerbtn .el-dialog__close:hover {
    color: #fff;
  }
  .dialog-header {
    height: 54px;
    line-height: 54px;
    text-align: center;
    background-color: #109dfa;
    color: #fff;
  }
  .dialog-footer {
    text-align: center;
  }
}
</style>