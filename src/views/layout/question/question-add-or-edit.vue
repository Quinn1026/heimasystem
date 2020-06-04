<template>
  <div class="questionEdit">
    <el-dialog :visible.sync="dialogVisible" fullscreen>
      <div slot="title" class="dialog-header">{{mode == 'add' ? '新增题目':'编辑题目'}}</div>
      <el-form
        :model="formQuestionEdit"
        label-position="left"
        :rules="rules"
        ref="formQuestionEdit"
        class="formQuestionEdit"
        label-width="100px"
      >
        <el-form-item label="学科" prop="subject">
          <el-select v-model="formQuestionEdit.subject" placeholder="请选择学科">
            <el-option
              v-for="item in subjectList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="阶段" prop="step">
          <el-select v-model="formQuestionEdit.step" placeholder="请选择阶段">
            <el-option v-for="(item,index) in stepList" :key="index" :label="item" :value="+index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业" prop="enterprise">
          <el-select v-model="formQuestionEdit.enterprise" placeholder="请选择企业">
            <el-option
              v-for="item in enterpriseList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-cascader
            size="large"
            :options="options"
            :props="{ value: 'label' }"
            v-model="formQuestionEdit.city"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="题型" prop="type">
          <el-radio-group v-model="formQuestionEdit.type">
            <el-radio v-for="(item, index) in typeList" :key="index" :label="+index">{{item}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="难度" prop="difficulty">
          <el-radio-group v-model="formQuestionEdit.difficulty">
            <el-radio v-for="(item, index) in difficultyList" :key="index" :label="+index">{{item}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <hr style="margin-top:20px;margin-bottom:20px" />
        <el-form-item label="标题" prop="title" class="setMargin">
          <quill-editor
            v-model="formQuestionEdit.title"
            @change="onEditorChange('title')"
            :options="editorOption"
          />
        </el-form-item>
        <el-form-item
          :label="typeList[formQuestionEdit.type]"
          :prop="questionTypeValidateObj[formQuestionEdit.type]"
        >
          <question-type :formQuestionEdit="formQuestionEdit"></question-type>
        </el-form-item>
        <hr style="margin-top:20px;margin-bottom:20px" />
        <el-form-item label="视频解析" prop="video">
          <upload type="video" v-model="formQuestionEdit.video"></upload>
        </el-form-item>
        <hr style="margin-top:20px;margin-bottom:20px" />
        <el-form-item label="答案解析" prop="answer_analyze" class="setMargin">
          <quill-editor
            v-model="formQuestionEdit.answer_analyze"
            @change="onEditorChange('answer_analyze')"
            :options="editorOption"
          />
        </el-form-item>
        <hr style="margin-top:20px;margin-bottom:20px" />
        <el-form-item label="试题备注" prop="remark">
          <el-input v-model="formQuestionEdit.remark"></el-input>
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
// 导入城市三级联动
import { regionData } from "element-china-area-data";
// 导入富文本编辑器
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
// 导入题型组件
import QuestionType from "./question-type";
// 导入子组件文件上传
import Upload from "./upload";

export default {
  name: "QuestionEdit",
  props: [
    "subjectList",
    "enterpriseList",
    "stepList",
    "typeList",
    "difficultyList"
  ],
  components: {
    quillEditor,
    QuestionType,
    Upload
  },
  watch: {
    dialogVisible(newValue) {
      if (newValue) {
        this.$nextTick(() => {
          this.$refs.formQuestionEdit.clearValidate();
        });
      }
    }
  },
  data() {
    return {
      mode: "",
      dialogVisible: false,
      options: regionData,
      editorOption: {
        // Some Quill options...
        placeholder: "请在此输入......"
      },
      questionTypeValidateObj: {
        1: "single_select_answer", // 单选
        2: "multiple_select_answer", // 多选
        3: "short_answer" // 简答
      },
      editId: "",
      formQuestionEdit: {
        title: "",
        type: 1,
        subject: "",
        step: "",
        enterprise: "",
        difficulty: 1,
        single_select_answer: "",
        multiple_select_answer: [],
        short_answer: "",
        video: "",
        remark: "",
        city: [],
        answer_analyze: "",
        select_options: [
          {
            label: "A",
            text: "狗不理",
            image: ""
          },
          {
            label: "B",
            text: "猫不理",
            image: ""
          },
          {
            label: "C",
            text: "麻花",
            image: ""
          },
          {
            label: "D",
            text: "炸酱面",
            image: ""
          }
        ]
      },
      rules: {
        subject: [{ required: true, message: "请选择学科", trigger: "change" }],
        step: [{ required: true, message: "请选择阶段", trigger: "change" }],
        enterprise: [
          { required: true, message: "请选择企业", trigger: "change" }
        ],
        city: [{ required: true, message: "请选择城市", trigger: "change" }],
        type: [{ required: true, message: "请选择题型", trigger: "change" }],
        difficulty: [
          { required: true, message: "请选择难度", trigger: "change" }
        ],
        title: [{ required: true, message: "标题不能为空", trigger: "change" }],
        single_select_answer: [
          { required: true, message: "单选答案不能为空", trigger: "change" }
        ],
        multiple_select_answer: [
          { required: true, message: "多选答案不能为空", trigger: "change" }
        ],
        short_answer: [
          { required: true, message: "简答不能为空", trigger: "blur" }
        ],
        answer_analyze: [
          { required: true, message: "答案解析不能为空", trigger: "change" }
        ],
        remark: [{ required: true, message: "请输入备注", trigger: "blur" }]
      }
    };
  },
  methods: {
    submit() {
      // 校验真个form表单
      this.$refs.formQuestionEdit.validate(async valid => {
        if (!valid) return;
        let res = null;
        if (this.mode == "add") {
          res = await this.$axios.post("/question/add", this.formQuestionEdit);
        } else {
          this.formQuestionEdit.city = this.formQuestionEdit.city.join(",");
          res = await this.$axios.post("/question/edit", {
            id: this.editId,
            ...this.formQuestionEdit
          });
        }
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: this.mode === "add" ? "新增成功~" : "编辑成功~"
          });
          this.dialogVisible = false;
          if (this.mode == "add") {
            this.$parent.search();
          } else {
            this.$parent.getData();
          }
        }
      });
    },
    onEditorChange(props) {
      this.$refs.formQuestionEdit.validateField(props);
    },
    questionTypeValidate() {
      this.$refs.formQuestionEdit.validateField([
        "single_select_answer",
        "multiple_select_answer",
        "short_answer"
      ]);
    }
  }
};
</script>

<style lang="less">
.questionEdit {
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
    padding-left: 30px;
    background-color: #109dfa;
    color: #fff;
  }
  .formQuestionEdit {
    width: 835px;
    margin: 0 auto;
    .setMargin {
      .el-form-item__content {
        margin-left: 0px !important;
        margin-top: 40px;
        line-height: normal;
      }
      .ql-container {
        height: 150px;
      }
    }
  }
  .dialog-footer {
    text-align: center;
  }
}
</style>