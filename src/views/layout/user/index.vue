<template>
  <div class="user">
    <el-card shadow="always">
      <el-form :inline="true" :model="formUser" ref="formUser">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formUser.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formUser.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role_id">
          <el-select v-model="formUser.role_id" placeholder="请选择角色">
            <el-option v-for="(item, index) in roleList" :key="index" :label="item" :value="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="clr">清除</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="add">新增用户</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="always" style="margin-top:20px">
      <template>
        <el-table :data="userData" stripe>
          <el-table-column type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="username" label="用户名"></el-table-column>
          <el-table-column prop="phone" label="电话"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="role" label="角色"></el-table-column>
          <el-table-column prop="remark" label="备注"></el-table-column>
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
    <user-edit ref="userEdit" :roleList="roleList"></user-edit>
  </div>
</template>

<script>
import UserEdit from "./user-add-or-edit";
export default {
  name: "User",
  components: {
    UserEdit
  },
  data() {
    return {
      roleList: { 1: "超级管理员", 2: "管理员", 3: "老师", 4: "学生" },
      formUser: {
        username: "",
        email: "",
        role_id: ""
      },
      page: 1,
      limit: 2,
      total: 0,
      userData: []
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      const res = await this.$axios.get("/user/list", {
        params: { page: this.page, limit: this.limit, ...this.formUser }
      });
      if (res.data.code == 200) {
        this.userData = res.data.data.items;
        this.total = res.data.data.pagination.total;
      }
    },
    add() {
      this.$refs.userEdit.formUserEdit = {
        username: "",
        email: "",
        phone: "",
        status: "",
        role_id: "",
        remark: ""
      };
      this.$refs.userEdit.dialogVisible = true;
      this.$refs.userEdit.mode = "add";
    },
    edit(row) {
      let { username, email, phone, status, role_id, remark } = row;
      this.$refs.userEdit.formUserEdit = {
        username,
        email,
        phone,
        status,
        role_id,
        remark
      };
      this.$refs.userEdit.editId = row.id;
      this.$refs.userEdit.dialogVisible = true;
      this.$refs.userEdit.mode = "edit";
    },
    search() {
      this.page = 1;
      this.getData();
    },
    async changeStatus(id) {
      const res = await this.$axios.post("/user/status", { id });
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
          const res = await this.$axios.post("/user/remove", { id });
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
      this.$refs.formUser.resetFields();
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