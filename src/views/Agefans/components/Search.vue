<template>
  <div>
    <div class="w-full">
      <div class="flex items-center border-b border-b-2 border-teal-500">
        <input
          class="appearance-none bg-transparent border-none w-full text-gray-100 mr-3 px-2 text-xl leading-tight focus:outline-none"
          type="text"
          placeholder="請輸入關鍵字"
          v-model.trim="keyword"
          @keyup.enter="searchAnime"
        />
        <button
          class="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white my-2 py-1 px-2 rounded"
          type="button"
          @click="searchAnime"
        >搜尋</button>
      </div>
    </div>

    <div v-show="isLoading">Loading...</div>
    <div v-show="!isLoading">
      <router-link
        v-for="item in animeList"
        :key="item.id"
        :to="{ name: 'AgefansDetails', params: { id: item.id } }"
        class="flex items-start my-2 p-2 border-b"
      >
        <img class="w-1/4" :src="item.imgUrl" alt />
        <div class="px-2">
          <div class="font-bold text-base">{{ item.title }}</div>
          <div class="mb-1 text-xs">{{ item.originName }}</div>
          <div class="mb-1 text-xs">類型: {{ item.type }}</div>
          <div class="mb-1 text-xs">放送日: {{ item.dateAired }}</div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

import store from '@/store';
import { agefansSVC } from '@/services';

export default {
  setup() {
    const keyword = ref('');
    const animeList = ref([]);
    const isLoading = ref(false);

    async function searchAnime() {
      if (!keyword) return;

      isLoading.value = true;
      const ret = await agefansSVC.getList(keyword.value);
      isLoading.value = false;
      if (!ret.success) {
        return;
      }

      animeList.value = ret.items;
    }

    return {
      keyword,
      animeList,
      isLoading,

      searchAnime,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>