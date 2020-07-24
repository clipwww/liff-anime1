<template>
  <div>
    <div class="loader loader-border" :class="{ 'is-active': isLoading }"></div>
    <div v-if="item" class="pb-10">
      <div class="flex items-start mb-2">
        <img class="w-1/3" :src="item.imgUrl" />
        <div class="px-4">
          <div class="font-bold text-xl">
            {{ item.title }}
            <span class="ml-1 text-xs text-gray-500">[{{ item.status }}]</span>
          </div>
          <div class="mb-1 text-xs">{{ item.originName }}</div>
          <div class="mb-1 text-xs">地區: {{ item.area }}</div>
          <div class="mb-1 text-xs">製作公司: {{ item.studio }}</div>
          <div class="mb-1 text-xs">類型: {{ item.type }}</div>
          <div class="mb-1 text-xs">放送日: {{ item.dateAired }}</div>
        </div>
      </div>
      <div class="my-2">
        <span
          v-for="(tag, i) in item.tags"
          :key="i"
          class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
        >#{{ tag }}</span>
        <a
          :href="item.officialWebsite"
          class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
          target="_blank"
        >官方網站</a>
      </div>

      <div class="my-3 border-t border-opacity-25">
        <a
          v-for="ep in item.episodeList"
          :href="`https://mechakucha-api.herokuapp.com/agefans/${id}/${ep.pId}/${ep.eId}`"
          :key="ep.id"
          class="border-b border-opacity-25 p-2 flex items-center justify-between"
          target="_blank"
        >
          <div>{{ ep.title }}</div>
          <svg
            class="text-2xl"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            aria-hidden="true"
            focusable="false"
            width="1em"
            height="1em"
            style="vertical-align: -0.125em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
          >
            <path d="M8.59 16.58L13.17 12L8.59 7.41L10 6l6 6l-6 6l-1.41-1.42z" fill="currentColor" />
          </svg>
        </a>
      </div>
      <p class="text-gray-500 text-sm leading-snug" v-html="item.description"></p>
    </div>
  </div>
</template>

<script>
import { toRefs, reactive, computed } from 'vue';

import store from '@/store';
import router from '@/router';
import { agefansSVC } from '@/services';

export default {
  setup(props, ctx) {
    const state = reactive({
      id: router.currentRoute.value.params.id,
      item: null,
    });
    const isLoading = computed(() => store.state.isLoading);

    async function getAnimeDetails() {
      const ret = await agefansSVC.getDetails(state.id);
      if (!ret.success) {
        return;
      }

      state.item = ret.item;
    }

    getAnimeDetails();

    return {
      ...toRefs(state),
      isLoading,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>