<template>
  <div class="about">
    <div class="input">
      <el-form label-width="80px" :model="loginForm">
        <el-form-item label="账号">
          <el-input v-model="loginForm.name"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="caozuo">
      <el-button @click="login" type="primary">授权github登录</el-button>
      <el-button @click="generalLogin">账号密码登录</el-button>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import userService from "../api/user-service";
const oauthUri = "https://github.com/login/oauth/authorize";
const clientId = "569e7664d7a71d0ed046";
const redirectUri = "http://192.168.1.177:5001/github/auth";

export default {
  name: "about",
  data() {
    return {
      loginForm: {
        name: "",
        password: "",
      },
    };
  },
  methods: {
    login() {
      window.location.href = `${oauthUri}?client_id=${clientId}&redirect_url=${redirectUri}`;
    },
    async generalLogin() {
      if (!this.loginForm.name) {
        this.$message.warning("请输入账号");
        return;
      }
      if (!this.loginForm.password) {
        this.$message.warning("请输入密码");
        return;
      }
      const { data = null } = await userService.userLogin(this.loginForm);
      if (data) {
        Cookies.set("token", data.token);
        localStorage.setItem("userInfo", JSON.stringify(data.userInfo));
        this.$message.success("登录成功");
        this.$router.push("/");
      } else {
        this.$message.warning("请联系管理员添加账号");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.about {
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.input {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
