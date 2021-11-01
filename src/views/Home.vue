<template>
  <div class="home">
    <router-link to="/consult">
      <button @click="consult">建立链接</button>
    </router-link>
  </div>
</template>

<script>
// @ is an alias to /src
import SocketClient from "../utils/socket";

export default {
  name: "Home",
  data() {
    return {
      userId: "9527",
      gatewayUrl: "http://127.0.0.1:6001",
    };
  },
  methods: {
    async consult() {
      this.$store.commit("setUserId", this.userId);
      this.$store.commit("initMessages");
      const socketClient = new SocketClient(this.gatewayUrl, this.$store, {
        userId: this.userId,
      });
      this.$store.commit("setSocketClient", socketClient);
      await this.$store.dispatch("connectSocket");
    },
  },
};
</script>
