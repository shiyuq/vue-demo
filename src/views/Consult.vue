<template>
  <div>
    <div>发送信息</div>
    <input placeholder="请输入要发送的信息" />
    <button @click="postMessage">发送</button>
  </div>
</template>

<script>

export default {
  data() {
    return {
      socket: null,
      messList: [],
    };
  },
  created() {
  },
  methods: {
    postMessage() {
      this.socket.emit("recive message", {
        message: "123",
        time: new Date(),
      });
      this.messList.push({
        message: "123",
        time: new Date(),
      });
    },
  },
};
</script>

<style></style>
