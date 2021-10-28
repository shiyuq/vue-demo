<template>
  <div>
    <div>发送信息</div>
    <input placeholder="请输入要发送的信息" />
    <button @click="postMessage">发送</button>
  </div>
</template>

<script>
import { io } from "socket.io-client";

export default {
  data() {
    return {
      socket: null,
      messList: [],
    };
  },
  created() {
    const socket = io("ws://127.0.0.1:6001");
    this.socket = socket;
    this.init();
  },
  methods: {
    init() {
      this.socket.on("connect", () => {
        console.log(1111111, this.socket.id);
      });

      this.socket.on("new message", function(data) {
        console.log(data);
      });

      this.socket.on("disconnect", () => {
        console.log(22222222222, this.socket.id);
      });
    },
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
