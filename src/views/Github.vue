<template>
  <div>
    <div>{{ githubUser }}</div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import userService from "../api/user-service";

export default {
  name: "github",
  data() {
    return {
      githubUser: "github登陆中",
    };
  },
  async created() {
    const code = this.$route.query.code;
    if (code) {
      await this.getUserInfo({ code });
    }
  },
  methods: {
    async getUserInfo(params) {
      const { data = null } = await userService.getUserInfo(params);
      if (data) {
        Cookies.set("token", data.token);
        localStorage.setItem("userInfo", JSON.stringify(data.userInfo));
      }
    },
  },
};
</script>

<style></style>
