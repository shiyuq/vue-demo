<template>
  <div class="about">
    <button @click="login">授权github登录</button>
  </div>
</template>

<script>
const oauthUri = "https://github.com/login/oauth/authorize";
const clientId = "569e7664d7a71d0ed046";
const redirectUri = "http://192.168.1.177:5001/github/auth";

export default {
  name: "about",
  data() {
    return {};
  },
  methods: {
    login() {
      window.location.href = `${oauthUri}?client_id=${clientId}&redirect_url=${redirectUri}`;
    },
  },
};
</script>
