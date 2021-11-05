<template>
  <div class="menu">
    <div
      v-for="user in users"
      :key="user.id"
      :class="user.id === selectedUser ? 'selectedUser' : 'user'"
      @click="setCurrentUser(user)"
    >
      {{ user.name }}
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
