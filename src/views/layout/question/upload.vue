<template>
  <div class="upload">
    <el-upload
      class="avatar-uploader"
      name="file"
      :action="BaseUrl + '/question/upload'"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <div v-if="type == 'image'">
        <img v-if="value" :src="BaseUrl + '/' + value" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </div>
      <div v-else>
        <video v-if="value" :src="BaseUrl + '/' + value" controls></video>
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </div>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: "Upload",
  props: {
    value: String,
    type: {
      type: String,
      default: "image"
    }
  },
  data() {
    return {
      BaseUrl: process.env.VUE_APP_BASEURL
    };
  },
  methods: {
    handleAvatarSuccess(res, file) {
      // console.log(res, file);
      // v-model传值过来的 所以把文件路径赋给父组件的的input事件即可实现双向绑定
      if (res.code == 200) this.$emit("input", res.data.url);
    },
    beforeAvatarUpload(file) {
      if (this.type == "image") {
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
      } else {
        const isMP4 = file.type === "video/mp4";
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isMP4) {
          this.$message.error("上传视频只能是 MP4 格式!");
        }
        if (!isLt2M) {
          this.$message.error("上传视频大小不能超过 2MB!");
        }
        return isMP4 && isLt2M;
      }
    }
  }
};
</script>

<style lang="less">
.upload {
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