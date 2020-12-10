<template>
  <div id="app" class="bg-gray-200 min-h-screen pt-12 pb-8">
    <NavBar v-if="!searchMode" title fixed safe-area-inset-top class="shadow" @click-right="searchMode = true" @click-left="goHome">
       <template #left>
         <Icon :name="isHome ? 'wap-home-o' : 'arrow-left'" size="20" />
      </template>
      <template #title>
        {{ titleLabel }}
      </template>
      <template v-if="showSearchIcon" #right>
        <Icon name="search" size="20" />
      </template>
    </NavBar>
    <Search v-else class="fixed top-0 inset-x-0 z-50 shadow" v-model="keyword" placeholder="請輸入關鍵字搜尋" show-action @cancel="searchMode = false" />

    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, provide, watch } from 'vue';
import { NavBar, Icon, Search } from 'vant';

import router from '@/router';
import { keywordSymbol, titleSymbol } from '@/provide';


export default defineComponent({
  components: {
    NavBar,
    Icon,
    Search
  },
  setup() {
    const searchMode = ref(false);
    const keyword = ref('');
    const title = ref('');
    const titleLabel = computed(() => title.value || router.currentRoute.value.meta.label)
    const isHome = computed(() => router.currentRoute.value.name === 'Home')
    const showSearchIcon = computed(() => !!router.currentRoute.value.meta.search)

    provide(keywordSymbol, keyword)
    provide(titleSymbol, title)

    watch(searchMode, () => {
      keyword.value = '';
    })

    watch(router.currentRoute, () => {
      title.value = '';
    })

    function goHome() {
      if (!isHome.value) {
        router.go(-1)
      }
    }

    return {
      searchMode,
      titleLabel,
      keyword,
      isHome,
      showSearchIcon,

      goHome,
    };
  },
});
</script>

<style lang="scss">
</style>
