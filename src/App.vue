<template>
  <div id="app">
    <div
      class="loader loader-default"
      :class="{ 'is-active': isLoading }"
      data-half
      data-text="正在努力加載中..."
    ></div>
    <div class="wrapper">
      <div class="main-content">
        <transition name="fade" mode="out-in">
          <router-view />
        </transition>
      </div>
      <footer>版權沒有🤔 © 2020 clipwww.github.io</footer>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  metaInfo() {
    return {
      title: this.$route.meta.label,
      titleTemplate: '%s | ( ͡° ͜ʖ ͡°)',
    };
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      isLoading: 'isLoading',
    }),
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
  padding: 15px;
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
</style>
