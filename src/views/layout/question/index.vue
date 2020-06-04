<template>
  <div class="question">
    <el-card shadow="always">
      <el-form :model="formQuestion" ref="formQuestion" label-width="60px">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="学科" prop="subject">
              <el-select v-model="formQuestion.subject" placeholder="请选择学科">
                <el-option
                  v-for="item in subjectList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="阶段" prop="step">
              <el-select v-model="formQuestion.step" placeholder="请选择阶段">
                <el-option
                  v-for="(item,index) in stepList"
                  :key="index"
                  :label="item"
                  :value="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="企业" prop="enterprise">
              <el-select v-model="formQuestion.enterprise" placeholder="请选择企业">
                <el-option
                  v-for="item in enterpriseList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="题型" prop="type">
              <el-select v-model="formQuestion.type" placeholder="请选择题型">
                <el-option
                  v-for="(item,index) in typeList"
                  :key="index"
                  :label="item"
                  :value="+index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="难度" prop="difficulty">
              <el-select v-model="formQuestion.difficulty" placeholder="请选择难度">
                <el-option
                  v-for="(item,index) in difficultyList"
                  :key="index"
                  :label="item"
                  :value="+index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="作者" prop="username">
              <el-input v-model="formQuestion.username" placeholder="请输入作者"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="状态" prop="status">
              <el-select v-model="formQuestion.status" placeholder="请选择状态">
                <el-option label="启用" :value="1"></el-option>
                <el-option label="禁用" :value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="日期" prop="create_date">
              <el-date-picker v-model="formQuestion.create_date" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="标题" prop="title">
              <el-input v-model="formQuestion.title" placeholder="请输入标题"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label-width="0px">
              <el-button type="primary" @click="search">搜索</el-button>
              <el-button @click="clr">清除</el-button>
              <el-button type="primary" icon="el-icon-plus" @click="add">新增题目</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="always" style="margin-top:20px">
      <template>
        <el-table :data="questionData" stripe border>
          <el-table-column type="index" label="序号" width="80"></el-table-column>
          <el-table-column label="题目">
            <template slot-scope="scope">
              <span v-html="scope.row.title"></span>
            </template>
          </el-table-column>
          <el-table-column :formatter="formatter" label="学科.阶段"></el-table-column>
          <el-table-column label="题型">
            <template slot-scope="scope">
              <span>{{typeList[scope.row.type]}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="enterprise_name" label="企业"></el-table-column>
          <el-table-column prop="username" label="创建者"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <span
                :style="{color:scope.row.status == 1 ? '#67C23A' : '#F56C6C'}"
              >{{scope.row.status == 1 ? '启用' : '禁用'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250">
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click="edit(scope.row)">编辑</el-button>
              <el-button
                size="small"
                @click="changeStatus(scope.row.id)"
                :type="scope.row.status == 0 ? 'success' : 'info'"
              >{{scope.row.status == 0 ? '启用' : '禁用'}}</el-button>
              <el-button size="small" type="danger" @click="remove(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div style="text-align:center;margin-top:20px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[2, 3, 4, 5]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <question-edit
      ref="QuestionEdit"
      :subjectList="subjectList"
      :enterpriseList="enterpriseList"
      :stepList="stepList"
      :typeList="typeList"
      :difficultyList="difficultyList"
    ></question-edit>
  </div>
</template>

<script>
import QuestionEdit from "./question-add-or-edit";
export default {
  name: "Question",
  components: {
    QuestionEdit
  },
  data() {
    return {
      subjectList: [],
      enterpriseList: [],
      stepList: { 1: "初级", 2: "中级", 3: "高级" },
      typeList: { 1: "单选", 2: "多选", 3: "简答" },
      difficultyList: { 1: "简单", 2: "一般", 3: "困难" },
      formQuestion: {
        subject: "",
        step: "",
        enterprise: "",
        type: "",
        difficulty: "",
        username: "",
        status: "",
        create_date: "",
        title: ""
      },
      page: 1,
      limit: 2,
      total: 0,
      questionData: []
    };
  },
  created() {
    this.getSubjectList();
    this.getEnterpriseList();
    this.getData();
  },
  methods: {
    add() {
      this.$refs.QuestionEdit.formQuestionEdit = {
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
      };
      this.$refs.QuestionEdit.dialogVisible = true;
      this.$refs.QuestionEdit.mode = "add";
    },
    edit(row) {
      // console.log(row);
      this.$refs.QuestionEdit.formQuestionEdit = JSON.parse(
        JSON.stringify(row)
      );
      if (row.city) {
        this.$refs.QuestionEdit.formQuestionEdit.city = row.city.split(",");
      }
      if (row.multiple_select_answer) {
        this.$refs.QuestionEdit.formQuestionEdit.multiple_select_answer = row.multiple_select_answer.split(
          ","
        );
      }
      this.$refs.QuestionEdit.editId = row.id;
      this.$refs.QuestionEdit.dialogVisible = true;
      this.$refs.QuestionEdit.mode = "edit";
    },
    async changeStatus(id) {
      const res = await this.$axios.post("/question/status", { id });
      if (res.data.code == 200) {
        this.$message({
          message: "更改状态成功",
          type: "success"
        });
        this.getData();
      }
    },
    remove(id) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$axios.post("/question/remove", { id });
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.search();
          }
        })
        .catch(() => {});
    },
    async getSubjectList() {
      const res = await this.$axios.get("/subject/list");
      if (res.data.code == 200) {
        this.subjectList = res.data.data.items;
      }
    },
    async getEnterpriseList() {
      const res = await this.$axios.get("/enterprise/list");
      if (res.data.code == 200) {
        this.enterpriseList = res.data.data.items;
      }
    },
    async getData() {
      const res = await this.$axios.get("/question/list", {
        params: { page: this.page, limit: this.limit, ...this.formQuestion }
      });
      if (res.data.code == 200) {
        this.questionData = res.data.data.items;
        this.total = res.data.data.pagination.total;
      }
    },
    search() {
      this.page = 1;
      this.getData();
    },
    clr() {
      this.$refs.formQuestion.resetFields();
      this.search();
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.limit = val;
      this.search();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.page = val;
      this.getData();
    },
    formatter(row) {
      return row.subject_name + "." + this.stepList[row.step];
    }
  }
};
</script>

<style>
</style>