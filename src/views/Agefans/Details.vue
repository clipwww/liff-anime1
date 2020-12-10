<template>
  <div class="p-2 bg-white mt-2 shadow">
    <Skeleton  title avatar avatar-size="150px" avatar-shape="square" :loading="isLoading" :row="15" class="py-4">
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
            <a
              :href="item.officialWebsite"
              class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
              target="_blank"
            >官方網站</a>
          </div>
        </div>
        <div class="my-2">
          <Tag
            v-for="(tag, i) in item.tags"
            class="mr-1"
            :key="i"
            plain
          >#{{ tag }}</Tag>

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
            <Icon name="arrow" />
          </a>
        </div>
        <p class="text-gray-600 text-sm leading-snug" v-html="item.description"></p>
      </div>
    </Skeleton>

  </div>
</template>

<script>
import { toRefs, reactive, computed, inject } from 'vue';
import { Tag, Icon, Skeleton } from 'vant';

import store from '@/store';
import router from '@/router';
import { agefansSVC } from '@/services';
import { titleSymbol } from '@/provide';

export default {
  components: {
    Tag,
    Icon,
    Skeleton
  },
  setup(props, ctx) {
    const title = inject(titleSymbol)
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
      title.value = state.item.title;
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
