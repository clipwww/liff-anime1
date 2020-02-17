<template>
  <div id="app">
    <div class="loader loader-default" :class="{ 'is-active': isLoading }" data-half></div>
    <div class="wrapper">
      <div class="main-content">
        <transition name="fade" mode="out-in">
          <router-view @onLogin="showLoginDialog = true" />
        </transition>
      </div>
      <footer>版權沒有🤔 © 2020 clipwww.github.io</footer>
    </div>
    <div class="profile" @click="onClickAvatar">
      <el-tooltip
        class="item"
        effect="dark"
        :content="`Hi, ${profile.displayName}`"
        placement="left"
        :disabled="!isLoggedIn"
      >
        <el-avatar :src="profile.pictureUrl"></el-avatar>
      </el-tooltip>
    </div>
    <el-dialog
      v-bind="DIALOG_DEFAULT_PROPS"
      :visible.sync="showLoginDialog"
      title="您尚未登入唷"
      width="95%"
    >
      <el-button type="success" @click="lineLogin">現在就去登入Line</el-button>
      <el-button type="danger" @click="showLoginDialog = false">晚點再說</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import { DIALOG_DEFAULT_PROPS } from '@/plugins/element-ui';

export default {
  metaInfo() {
    return {
      title: this.$route.meta.label,
      titleTemplate: '%s  |  ( ͡° ͜ʖ ͡°)',
    };
  },
  data() {
    return {
      DIALOG_DEFAULT_PROPS,
      showLoginDialog: false,
    };
  },
  computed: {
    ...mapGetters({
      isLoading: 'isLoading',
      isLoggedIn: 'isLoggedIn',
      profile: 'profile',
    }),
  },
  mounted() {
    if (!this.isLoggedIn) {
      // this.showLoginDialog = true;
    }
  },
  methods: {
    lineLogin() {
      this.$g_logEvent('Click', '登入', 'Login Button');
      window.liff.login({
        redirectUri: `${window.location.origin}${this.$route.path}`,
      });
    },
    onClickAvatar() {
      this.$g_logEvent('Click', this.isLoggedIn ? `Hi, ${this.profile.displayName}` : '登入', 'Avatar');
      if (this.isLoggedIn) {
        this.$router.push({ name: 'Admin' }).catch(err => {
          console.log('🚀');
        });
      } else {
        this.showLoginDialog = true;
      }
    },
  },
};
</script>

<style lang="scss">
.wrapper {
  display: flex;
  flex-flow: column;
  min-height: 100vh;
  background-color: rgba(#efefef, 0.5);
  max-width: 768px;
  margin: 0 auto;
}

.main-content {
  flex: 1;
}

footer {
  font-size: 12px;
  text-align: center;
  padding: 0;
  background-color: #fff;
  border-top: 1px solid #ddd;
  line-height: 25px;
  white-space: nowrap;
}

.profile {
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 99;
}
</style>
