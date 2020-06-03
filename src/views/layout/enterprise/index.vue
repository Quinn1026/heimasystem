<template>
  <div class="enterprise">
    <el-card shadow="always">
      <el-form :inline="true" :model="formEnterprise" ref="formEnterprise">
        <el-form-item label="企业编号" prop="eid">
          <el-input v-model="formEnterprise.eid" placeholder="请输入企业编号"></el-input>
        </el-form-item>
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="formEnterprise.name" placeholder="请输入企业名称"></el-input>
        </el-form-item>
        <el-form-item label="创建者" prop="username">
          <el-input v-model="formEnterprise.username" placeholder="请输入创建者"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formEnterprise.status" placeholder="请选择角色">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="clr">清除</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="add">新增学科</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="always" style="margin-top:20px">
      <template>
        <el-table :data="enterpriseData" stripe>
          <el-table-column type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="eid" label="企业编号"></el-table-column>
          <el-table-column prop="name" label="企业名称"></el-table-column>
          <el-table-column prop="short_name" label="简称"></el-table-column>
          <el-table-column prop="username" label="创建者"></el-table-column>
          <el-table-column prop="update_time" label="创建日期"></el-table-column>
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
    <enterprise-edit ref="enterpriseEdit"></enterprise-edit>
  </div>
</template>

<script>
import EnterpriseEdit from "./enterprise-add-or-edit";
export default {
  name: "Enterprise",
  components: {
    EnterpriseEdit
  },
  data() {
    return {
      formEnterprise: {
        name: "",
        username: "",
        status: "",
        eid: ""
      },
      page: 1,
      limit: 2,
      total: 0,
      enterpriseData: []
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      const res = await this.$axios.get("/enterprise/list", {
        params: { page: this.page, limit: this.limit, ...this.formEnterprise }
      });
      if (res.data.code == 200) {
        this.enterpriseData = res.data.data.items;
        this.total = res.data.data.pagination.total;
      }
    },
    add() {
      this.$refs.enterpriseEdit.formEnterpriseEdit = {
        name: "",
        short_name: "",
        intro: "",
        eid: "",
        remark: ""
      };
      this.$refs.enterpriseEdit.dialogVisible = true;
      this.$refs.enterpriseEdit.mode = "add";
    },
    edit(row) {
      // console.log(row);
      let { name, short_name, intro, eid, remark } = row;
      this.$refs.enterpriseEdit.formEnterpriseEdit = {
        name,
        short_name,
        intro,
        eid,
        remark
      };
      this.$refs.enterpriseEdit.editId = row.id;
      this.$refs.enterpriseEdit.dialogVisible = true;
      this.$refs.enterpriseEdit.mode = "edit";
    },
    search() {
      this.page = 1;
      this.getData();
    },
    async changeStatus(id) {
      const res = await this.$axios.post("/enterprise/status", { id });
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
          const res = await this.$axios.post("/enterprise/remove", { id });
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
    clr() {
      this.$refs.formEnterprise.resetFields();
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
    }
  }
};
</script>

<style>
</style>