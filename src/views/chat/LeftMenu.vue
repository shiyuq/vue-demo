<template>
  <div class="menu">
    <div
      v-for="user in users"
      :key="user.id"
      :class="user.id === selectedUser ? 'selectedUser' : 'user'"
      @click="setCurrentUser(user)"
    >
      <span v-if="unReadMessages[user.id]">
        <el-badge :value="unReadMessages[user.id].length" class="item">
          {{ user.name }}
        </el-badge>
      </span>
      <span v-else>{{ user.name }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "leftMenu",
  computed: {
    users() {
      return this.$store.state.users;
    },
    selectedUser() {
      return this.$store.state.selectedUser;
    },
    unReadMessages() {
      return this.$store.state.unReadMessages;
    },
  },
  created() {
    if (this.selectedUser) {
      this.setCurrentUser(this.selectedUser);
    }
  },
  methods: {
    setCurrentUser(user) {
      this.$store.commit("setSelectedUser", user.id);
    },
  },
};
</script>

<style lang="scss">
.menu {
  display: flex;
  flex-direction: column;
  height: calc(100%);
  overflow-y: scroll;
  overflow-x: hidden;
}

.user {
  padding: 20px;
  cursor: pointer;
  &:hover {
    background-color: #fff;
  }
}
.selectedUser {
  padding: 20px;
  cursor: pointer;
  background-color: yellow;
}
</style>
