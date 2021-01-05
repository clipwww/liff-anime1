<template>
  <div id="app" class="bg-gray-200 min-h-screen pb-8" :class="{ 'pt-12': !isInClient }">
    <NavBar v-if="!isInClient" title fixed safe-area-inset-top class="shadow" @click-left="goHome">
      <template #left>
        <Icon v-if="!isHome" name="arrow-left" size="20" />
      </template>
      <template #title>
        {{ titleLabel }}
      </template>
    </NavBar>

    <router-view v-slot="{ Component }">
      <keep-alive :include="['AgefansList', 'Anime1List']">
        <component :is="Component" />
      </keep-alive>
    </router-view>

    <VanImage class="pic w-12" :src="profile.pictureUrl" :alt="profile.displayName" round @click="login" />
  </div>
</template>

<script lang="ts">
import liff from '@line/liff';
import { defineComponent, computed, ref, provide, watch } from 'vue';
import { NavBar, Icon, Image, Toast } from 'vant';

import router from '@/router';
import store from '@/store';
import { keywordSymbol, titleSymbol } from '@/provide';

export default defineComponent({
  components: {
    NavBar,
    Icon,
    VanImage: Image,
  },
  setup() {
    const isInClient = liff.isInClient();
    const title = ref('');
    const titleLabel = computed(() => title.value || router.currentRoute.value.meta.label);
    const isHome = computed(() => router.currentRoute.value.name === 'Home');
    const profile = computed(() => store.getters.profile);

    provide(titleSymbol, title);

    watch(router.currentRoute, () => {
      title.value = '';
    });

    function goHome() {
      if (!isHome.value) {
        router.go(-1);
      }
    }

    function login() {
      if (store.state.isLoggedIn) {
        Toast({
          message: `Hi, ${profile.value.displayName}`,
          icon: 'like-o',
        });
        return;
      }
      liff.login({
        redirectUri: window.location.href,
      });
    }

    return {
      isInClient,
      titleLabel,
      isHome,
      profile,

      goHome,
      login,
    };
  },
});
</script>

<style lang="scss" scoped>
.pic {
  position: fixed;
  right: 10px;
  bottom: 10px;
}
</style>
