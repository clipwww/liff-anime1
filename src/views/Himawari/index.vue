<template>
  <div>
    <div class="w-full">
      <div class="flex items-center border-b border-b-2 border-teal-500">
        <input
          class="appearance-none bg-transparent border-none w-full text-gray-100 mr-3 px-2 text-xl leading-tight focus:outline-none"
          type="text"
          placeholder="請輸入關鍵字"
          v-model.trim="keyword"
          @keyup.enter="getDanmakuList(true)"
        />
        <button
          class="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white my-2 py-1 px-2 rounded"
          type="button"
          @click="getDanmakuList(true)"
        >
          搜尋
        </button>
      </div>
    </div>

    <div>
      <div
        v-for="(item, index) in danmakuList"
        :key="item.id"
        class="flex items-center py-2 px-2 border-b"
        :class="{ 'bg-gray-700': index % 2 }"
      >
        <div class="w-full px-2">
          <div class="font-bold text-gray-300">{{ item.title }}</div>
          <div class="text-gray-400 text-sm">彈幕量: {{ item.count }}</div>
        </div>
        <div class="text-right ml-2">
          <a :href="`${baseURL}/himawari/${item.group_id}/danmaku?mode=download&group=1`">
            <svg
              class="text-3xl"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              aria-hidden="true"
              focusable="false"
              width="1em"
              height="1em"
              style="
                vertical-align: -0.125em;
                -ms-transform: rotate(360deg);
                -webkit-transform: rotate(360deg);
                transform: rotate(360deg);
              "
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 24 24"
            >
              <path
                d="M17 13l-5 5l-5-5h3V9h4v4m5.35-2.97A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.03A6.004 6.004 0 0 0 0 14a6 6 0 0 0 6 6h13a5 5 0 0 0 5-5c0-2.64-2.05-4.78-4.65-4.97z"
                fill="currentColor"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
    <div v-show="isLoading">Loading...</div>
    <div id="js-bottom" class="py-2" key="bottom"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, Ref, onMounted } from 'vue';

import { baseURL } from '@/services';

export default defineComponent({
  setup() {
    const keyword = ref('');
    const isLoading = ref(false);
    const danmakuList: Ref<{ group_id: string; title: string; count: string; source: string }[]> = ref([]);
    const pageInfo = reactive({
      index: 1,
      pageAmount: 0,
      dataAmount: 0,
    });

    async function getDanmakuList(init = false) {
      if (init) {
        pageInfo.index = 1;
        pageInfo.pageAmount = 0;
        pageInfo.dataAmount = 0;
        danmakuList.value = [];
      }

      if (!keyword.value || isLoading.value || (pageInfo.pageAmount !== 0 && pageInfo.index >= pageInfo.pageAmount)) {
        return;
      }

      pageInfo.index += 1;

      isLoading.value = true;
      // const ret = await himawariSVC.getDanmakuList(keyword.value, pageInfo.index);
      isLoading.value = false;

      // if (!ret.success) {
      //   return;
      // }

      // danmakuList.value = ret.items;
      // pageInfo.index = ret.page?.index ?? pageInfo.index;
      // pageInfo.pageAmount = ret.page?.size ?? 0;
      // pageInfo.dataAmount = ret.page?.amount ?? 0;
    }

    onMounted(() => {
      const intersectionObserver = new IntersectionObserver(
        (entries) => {
          if (entries?.[0]?.isIntersecting) {
            getDanmakuList();
          }
        },
        { rootMargin: '0px 0px 30px 0px' }
      );
      intersectionObserver.observe(document.getElementById('js-bottom') as HTMLElement);
    });

    return {
      baseURL,

      keyword,
      danmakuList,
      isLoading,

      getDanmakuList,
    };
  },
});
</script>

<style lang="scss" scoped>
</style>
