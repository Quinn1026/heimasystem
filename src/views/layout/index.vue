<template>
  <div class="layout">
    <el-container class="layoutContainer">
      <el-header>
        <div class="left">
          <i
            :class="[isCollapse ? 'el-icon-s-unfold': 'el-icon-s-fold']"
            @click="isCollapse = !isCollapse"
          ></i>
          <img src="@/assets/layout_icon.png" class="marginlr" />
          <span>黑马后台管理系统</span>
        </div>
        <div class="right">
          <img :src="avatar" alt />
          <span class="username">{{username}} 你好</span>
          <el-button type="primary" @click="logout">退出</el-button>
        </div>
      </el-header>
      <el-container>
        <el-aside width="auto">
          <el-menu
            default-active="/layout/user"
            router
            class="el-menu-vertical-demo"
            :collapse="isCollapse"
          >
            <el-menu-item index="/layout/chart">
              <i class="el-icon-pie-chart"></i>
              <span slot="title">数据概览</span>
            </el-menu-item>
            <el-menu-item index="/layout/user">
              <i class="el-icon-user"></i>
              <span slot="title">用户列表</span>
            </el-menu-item>
            <el-menu-item index="/layout/question">
              <i class="el-icon-edit-outline"></i>
              <span slot="title">题库列表</span>
            </el-menu-item>
            <el-menu-item index="/layout/enterprise">
              <i class="el-icon-office-building"></i>
              <span slot="title">企业列表</span>
            </el-menu-item>
            <el-menu-item index="/layout/subject">
              <i class="el-icon-notebook-2"></i>
              <span slot="title">学科列表</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { removeToken } from "@/utils/token";
export default {
  data() {
    return {
      username: "",
      avatar: "",
      isCollapse: false // 是否收起菜单
    };
  },
  created() {
    this.getInfo();
  },
  methods: {
    async getInfo() {
      const res = await this.$axios.get("/info");
      if (res.data.code == 200) {
        this.username = res.data.data.username;
        this.avatar = process.env.VUE_APP_BASEURL + "/" + res.data.data.avatar;
      }
    },
    logout() {
      this.$confirm("是否退出?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$axios.get("/logout");
          if (res.data.code == 200) {
            // 删除token 并跳转到登录页
            removeToken();
            this.$router.push("/login");
          }
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="less">
.layout {
  height: 100%;
  .layoutContainer {
    height: 100%;
    .el-header {
      display: flex;
      justify-content: space-between;
      .left {
        display: flex;
        align-items: center;
        font-size: 22px;
        .marginlr {
          margin: 0 10px;
        }
      }
      .right {
        display: flex;
        align-items: center;
        img {
          width: 43px;
          height: 43px;
          margin-right: 10px;
          border-radius: 50%;
        }
        .username {
          margin-right: 30px;
        }
      }
    }
    .el-aside {
      .el-menu {
        border: 0;
      }
      .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;
      }
    }
    .el-main {
      background-color: #e8e9ec;
    }
  }
}
</style>