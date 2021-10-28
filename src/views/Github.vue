<template>
  <div>
    <div>{{ githubUser }}</div>
  </div>
</template>

<script>
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
      const res = await userService.getUserInfo(params);
      console.log("res11111111111 :>> ", res);
    },
  },
};
</script>

<style></style>
