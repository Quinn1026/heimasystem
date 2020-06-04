<template>
  <div class="questionType">
    <div v-if="formQuestionEdit.type == 1">
      <div v-for="item in formQuestionEdit.select_options" :key="item.label" class="oneline">
        <el-radio v-model="formQuestionEdit.single_select_answer" :label="item.label">{{item.label}}</el-radio>
        <el-input v-model="item.text" style="margin-right:15px"></el-input>
        <upload v-model="item.image"></upload>
      </div>
    </div>
    <div v-else-if="formQuestionEdit.type == 2">
      <div v-for="item in formQuestionEdit.select_options" :key="item.label" class="oneline">
        <el-checkbox
          v-model="formQuestionEdit.multiple_select_answer"
          :label="item.label"
        >{{item.label}}</el-checkbox>
        <el-input v-model="item.text" style="margin-left:30px;margin-right:15px"></el-input>
        <upload v-model="item.image"></upload>
      </div>
    </div>
    <div v-else>
      <el-input
        type="textarea"
        :rows="5"
        placeholder="请在此输入......"
        v-model="formQuestionEdit.short_answer"
      ></el-input>
    </div>
  </div>
</template>

<script>
import Upload from "./upload";
export default {
  name: "QuestionType",
  props: ["formQuestionEdit"],
  components: {
    Upload
  },
  data() {
    return {};
  }
};
</script>

<style lang="less">
.questionType {
  .oneline {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .el-radio__label,
    .el-checkbox__label {
      width: 20px;
    }
  }
}
</style>