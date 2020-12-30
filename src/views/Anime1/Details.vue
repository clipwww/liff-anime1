<template>
  <PullRefresh v-model="refreshing" @refresh="fetchData">
    <template v-if="loading">
      <Cell class="py-2" v-for="n in 10" :key="n">
        <Skeleton class="p-0" :row="2"></Skeleton>
      </Cell>
    </template>
    <Cell v-else v-for="item in list" :key="item.id" :title="item.name" center>
      <template #icon>
        <Tag class="mr-2" type="primary" plain>{{ item.type }}</Tag>
      </template>
      <template #right-icon>
        <Icon class="mr-3" name="live" size="22" @click="openOriginPage(item)" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          aria-hidden="true"
          focusable="false"
          role="img"
          class="iconify iconify--mdi"
          width="1.5em"
          height="1.5em"
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 24 24"
          style="transform: rotate(360deg)"
          @click="downloadMp4(item)"
        >
          <path
            d="M14 2l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8m4 18V9h-5V4H6v16h12m-6-1l-4-4h2.5v-3h3v3H16l-4 4z"
            fill="currentColor"
          ></path>
        </svg>
      </template>
      <!-- <iframe :src="item.iframeSrc" class="hidden"></iframe> -->
    </Cell>
  </PullRefresh>
  <!-- <iframe :src="`https://anime1.me/?cat=${id}`" class="hidden"></iframe> -->
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs, inject, Ref } from 'vue';
import { PullRefresh, Cell, Skeleton, Icon, Tag } from 'vant';

import router from '@/router';
import { ani1SVC, baseURL } from '@/services';
import { titleSymbol } from '@/provide';

export default defineComponent({
  components: {
    PullRefresh,
    Cell,
    Skeleton,
    Icon,
    Tag,
  },
  setup(prop) {
    const state = reactive({
      id: computed(() => router.currentRoute.value.params.id as string),
      list: [],
      refreshing: false,
      loading: true,
    });
    const title: Ref<String> = inject(titleSymbol);

    async function fetchData() {
      state.refreshing = false;
      state.loading = true;

      const ret = await ani1SVC.getBangumi(state.id);
      state.loading = false;
      if (!ret.success) {
        return;
      }

      state.list = ret.items;
      title.value = ret.item.title;
    }

    function downloadMp4({ id }) {
      window.open(`${baseURL}/anime1/video/${id}/download`, '_blank', 'noreferrer');
    }

    function openOriginPage({ id, iframeSrc }) {
      window.open(iframeSrc, '_blank', 'noreferrer');
      // window.open(`https://anime1.me/${id}`);
    }

    fetchData();

    return {
      ...toRefs(state),

      fetchData,
      downloadMp4,
      openOriginPage,
    };
  },
});
</script>

<style lang="scss" scoped>
</style>
