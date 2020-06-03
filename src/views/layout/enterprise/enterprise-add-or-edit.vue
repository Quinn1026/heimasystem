<template>
  <div class="enterpriseEdit">
    <el-dialog :visible.sync="dialogVisible" width="480px">
      <div slot="title" class="dialog-header">{{mode == 'add' ? '新增学科':'编辑学科'}}</div>
      <el-form
        :model="formEnterpriseEdit"
        :rules="rules"
        ref="formEnterpriseEdit"
        label-width="100px"
      >
        <el-form-item label="企业编号" prop="eid">
          <el-input v-model="formEnterpriseEdit.eid" placeholder="请输入企业编号"></el-input>
        </el-form-item>
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="formEnterpriseEdit.name" placeholder="请输入企业名称"></el-input>
        </el-form-item>
        <el-form-item label="企业简称" prop="short_name">
          <el-input v-model="formEnterpriseEdit.short_name" placeholder="请输入企业简称"></el-input>
        </el-form-item>
        <el-form-item label="企业简介" prop="intro">
          <el-input v-model="formEnterpriseEdit.intro"></el-input>
        </el-form-item>
        <el-form-item label="企业备注" prop="remark">
          <el-input v-model="formEnterpriseEdit.remark"></el-input>
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
  name: "EnterpriseEdit",
  watch: {
    dialogVisible(newValue) {
      if (!newValue) this.$refs.formEnterpriseEdit.clearValidate();
    }
  },
  data() {
    return {
      dialogVisible: false,
      mode: "",
      editId: "",
      formEnterpriseEdit: {
        name: "",
        short_name: "",
        intro: "",
        eid: "",
        remark: ""
      },
      rules: {
        eid: [{ required: true, message: "请输入企业编号", trigger: "blur" }],
        name: [{ required: true, message: "请输入企业名称", trigger: "blur" }],
        short_name: [
          { required: true, message: "请输入企业简称", trigger: "blur" }
        ],
        intro: [{ required: true, message: "请输入企业简介", trigger: "blur" }]
      }
    };
  },

  methods: {
    submit() {
      // 校验表单
      this.$refs.formEnterpriseEdit.validate(async valid => {
        if (!valid) return;
        let res = null;
        if (this.mode == "add") {
          res = await this.$axios.post(
            "/enterprise/add",
            this.formEnterpriseEdit
          );
        } else {
          res = await this.$axios.post("/enterprise/edit", {
            id: this.editId,
            ...this.formEnterpriseEdit
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
.enterpriseEdit {
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