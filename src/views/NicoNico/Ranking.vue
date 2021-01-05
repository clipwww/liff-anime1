<template>
  <PullRefresh v-model="refreshing" @refresh="fetchData">
    <Tabs class="py-2" type="card" v-model:active="type">
      <Tab title="全部" name="all" />
      <Tab title="アニメ" name="anime" />
    </Tabs>

    <template v-if="loading">
      <Cell class="py-2" v-for="n in 10" :key="n">
        <Skeleton class="p-0" :row="2"></Skeleton>
      </Cell>
    </template>

    <Cell v-else v-for="item in list" :key="item.id" size="large" center is-link @click="goNicoNico(item.link)">
      <template #icon>
        <VanImage class="mr-2 w-20" :src="item.thumbnailSrc" />
      </template>
      <template #title>
        <div class="text-xs">{{ item.title }}</div>
      </template>
      <template #label>
        <div class="text-xs">{{ item.timeLength }}</div>
      </template>
    </Cell>
  </PullRefresh>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, Ref, ref, inject, computed, watch } from 'vue';
import { PullRefresh, Cell, Skeleton, Image, Tabs, Tab } from 'vant';

import { niconicoSVC } from '@/services';

export default defineComponent({
  name: 'Anime1List',
  components: {
    PullRefresh,
    Cell,
    Skeleton,
    VanImage: Image,
    Tabs,
    Tab,
  },
  setup() {
    const state = reactive({
      type: 'all',
      list: [],
      refreshing: false,
      loading: true,
    });

    watch(
      () => state.type,
      () => {
        fetchData();
      }
    );

    async function fetchData() {
      state.refreshing = false;
      state.loading = true;

      const ret = await niconicoSVC.getRankingList(state.type);

      state.loading = false;
      if (!ret.success) {
        return;
      }

      state.list = ret.items;
    }

    function goNicoNico(url) {
      window.open(url);
    }

    fetchData();

    return {
      ...toRefs(state),

      fetchData,
      goNicoNico,
    };
  },
});
</script>

<style lang="scss" scoped>
</style>
