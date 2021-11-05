<template>
  <div class="chat">
    <LeftMenu class="leftMenu"></LeftMenu>
    <ChatPanel class="chatPanel"></ChatPanel>
  </div>
</template>

<script>
import LeftMenu from "./chat/LeftMenu.vue";
import ChatPanel from "./chat/ChatPanel.vue";
export default {
  name: "consult",
  components: {
    LeftMenu,
    ChatPanel,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss">
.chat {
  display: flex;
  width: 1000px;
  margin: 0 auto;
  background-color: pink;
  border-radius: 4px;
  height: calc(100vh - 200px);
}

.leftMenu {
  width: 150px;
  border-right: 1px solid burlywood;
}

.chatPanel {
  width: calc(100% - 150px);
}
</style>
