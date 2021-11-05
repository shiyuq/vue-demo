<template>
  <div class="home">
    <el-button @click="consult" type="primary">建立链接</el-button>
  </div>
</template>

<script>
// @ is an alias to /src
import SocketClient from "../utils/socket";

export default {
  name: "Home",
  data() {
    return {
      userInfo: null,
      gatewayUrl: "http://192.168.20.110:6001",
    };
  },
  created() {
    this.userInfo = JSON.parse(localStorage.getItem("userInfo") || null);
  },
  methods: {
    async consult() {
      if (!this.userInfo) {
        this.$message.error("请先登录");
        this.$router.push("/about");
        return;
      }
      this.$store.commit("setUserId", this.userInfo.id);
      this.$store.commit("initMessages");
      await this.$store.dispatch("initUsers");
      const socketClient = new SocketClient(this.gatewayUrl, this.$store, {
        userId: this.userInfo.id,
      });
      this.$store.commit("setSocketClient", socketClient);
      await this.$store.dispatch("connectSocket");
      this.$router.push("consult");
    },
  },
};
</script>
