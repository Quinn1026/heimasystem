<template>
  <div class="subjectEdit">
    <el-dialog :visible.sync="dialogVisible" width="480px">
      <div slot="title" class="dialog-header">{{mode == 'add' ? '新增学科':'编辑学科'}}</div>
      <el-form :model="formSubjectEdit" :rules="rules" ref="formSubjectEdit" label-width="100px">
        <el-form-item label="学科编号" prop="rid">
          <el-input v-model="formSubjectEdit.rid" placeholder="请输入学科编号"></el-input>
        </el-form-item>
        <el-form-item label="学科名称" prop="name">
          <el-input v-model="formSubjectEdit.name" placeholder="请输入学科名称"></el-input>
        </el-form-item>
        <el-form-item label="学科简称" prop="short_name">
          <el-input v-model="formSubjectEdit.short_name" placeholder="请输入学科简称"></el-input>
        </el-form-item>
        <el-form-item label="学科简介" prop="intro">
          <el-input v-model="formSubjectEdit.intro"></el-input>
        </el-form-item>
        <el-form-item label="学科备注" prop="remark">
          <el-input v-model="formSubjectEdit.remark"></el-input>
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
  name: "SubjectEdit",
  watch: {
    dialogVisible(newValue) {
      if (!newValue) this.$refs.formSubjectEdit.clearValidate();
    }
  },
  data() {
    return {
      dialogVisible: false,
      mode: "",
      editId: "",
      formSubjectEdit: {
        name: "",
        short_name: "",
        intro: "",
        rid: "",
        remark: ""
      },
      rules: {
        rid: [{ required: true, message: "请输入学科编号", trigger: "blur" }],
        name: [{ required: true, message: "请输入学科名称", trigger: "blur" }]
      }
    };
  },

  methods: {
    submit() {
      // 校验表单
      this.$refs.formSubjectEdit.validate(async valid => {
        if (!valid) return;
        let res = null;
        if (this.mode == "add") {
          res = await this.$axios.post("/subject/add", this.formSubjectEdit);
        } else {
          res = await this.$axios.post("/subject/edit", {
            id: this.editId,
            ...this.formSubjectEdit
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
.subjectEdit {
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