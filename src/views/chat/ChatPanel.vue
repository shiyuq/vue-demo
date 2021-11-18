<template>
  <div class="chatPanel">
    <div class="content">
      <div
        v-for="(message, index) in currentMessages"
        :key="index"
        :class="
          message.sourceUser === userId
            ? 'user-message-box'
            : 'chat-message-box'
        "
      >
        <div v-if="message.sourceUser !== userId" class="single-left-message">
          <img
            src="http://qxb-img-osscache.qixin.com/new_media/f0e8fba3-23a8-4bc6-99cf-97c72263057d.jpg"
            alt=""
          />
          <span class="chat-message-span">{{
            message.content[message.content.type]
          }}</span>
        </div>
        <div v-else class="single-right-message">
          <span class="user-message-span">{{
            message.content[message.content.type]
          }}</span>
          <img
            src="http://qxb-img-osscache.qixin.com/new_media/bd49c73a-4f90-4cd1-8ee8-f6f362056abe.jpg"
            alt=""
          />
        </div>
      </div>
    </div>
    <div class="bottom">
      <el-input
        type="textarea"
        placeholder="请输入内容"
        v-model="message"
        style="width: 100%;"
        @keydown.enter.native="sendMessage($event)"
        :autosize="{ minRows: 4, maxRows: 4 }"
      >
      </el-input>
    </div>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  name: "ChatPanel",
  data() {
    return {
      message: "",
    };
  },
  created() {
    if (!this.users.length) {
      this.$router.push("/");
    }
  },
  computed: {
    messages() {
      return this.$store.state.messages;
    },
    users() {
      return this.$store.state.users;
    },
    selectedUser() {
      return this.$store.state.selectedUser;
    },
    currentMessages() {
      return this.messages[this.selectedUser] || [];
    },
    userId() {
      return this.$store.state.userId;
    },
    unReadMessages() {
      return this.$store.state.unReadMessages;
    },
  },
  watch: {
    currentMessages() {
      this.scrollToBottom();
    },
  },
  methods: {
    sendMessage(event) {
      if (!event.shiftKey && event.keyCode === 13) {
        if (!event.metaKey) {
          event.preventDefault();
          if (!this.selectedUser) {
            this.$message.error("请选择聊天用户");
            return;
          }
          if (!_.trim(this.message)) {
            this.$notify({
              title: "警告",
              message: "请输入聊天内容",
              type: "warning",
            });
            return;
          }
          this.$store.dispatch("sendMessage", {
            type: "text",
            text: this.message,
          });
          this.message = "";
        }
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$el.querySelector(".content");
        container.scrollTop = container.scrollHeight;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.chatPanel {
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  .bottom {
    height: 95px;
  }
  .content {
    height: calc(100% - 95px);
    overflow-y: scroll;
    overflow-x: hidden;
    padding-top: 20px;
  }
}

.single ::deep .el-textarea__inner,
.el-textarea {
  resize: none;
}

.user-message-box {
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  flex-direction: column;
  padding: 10px 0;
  padding-right: 10px;
}

.chat-message-box {
  position: relative;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  padding: 10px 0;
  padding-left: 10px;
}

.user-message-span {
  padding: 10px;
  background-color: #7fff00;
  border-radius: 4px;
  word-wrap: break-word;
  word-break: break-all;
  text-align: left;
  max-width: 80%;
}

.chat-message-span {
  padding: 10px;
  background-color: #ffffff;
  border-radius: 4px;
  word-wrap: break-word;
  word-break: break-all;
  text-align: left;
  max-width: 80%;
}

.single-left-message {
  display: flex;
  align-content: center;
  img {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    border-radius: 5px;
  }
}

.single-right-message {
  display: flex;
  align-content: center;
  justify-content: flex-end;
  img {
    width: 40px;
    height: 40px;
    margin-left: 10px;
    border-radius: 5px;
  }
}
</style>
