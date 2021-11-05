<template>
  <div class="chatPanel">
    <div class="content">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="
          message.sourceUser === userId
            ? 'user-message-box'
            : 'chat-message-box'
        "
      >
        <span
          :class="
            message.sourceUser === userId
              ? 'user-message-span'
              : 'chat-message-span'
          "
          >{{ message.content[message.content.type] }}</span
        >
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
export default {
  name: "ChatPanel",
  data() {
    return {
      message: "",
    };
  },
  computed: {
    messages() {
      return this.$store.state.messages;
    },
    selectedUser() {
      return this.$store.state.selectedUser;
    },
    userId() {
      return this.$store.state.userId;
    },
  },
  watch: {
    messages() {
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
  padding-right: 34px;
}

.chat-message-box {
  position: relative;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  padding: 10px 0;
  padding-left: 34px;
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
</style>
