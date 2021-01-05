<template>
  <PullRefresh v-model="refreshing" @refresh="fetchData(true, true)">
    <Sticky>
      <VanSearch v-model="keyword" show-action placeholder="請輸入關鍵字" @search="fetchData">
        <template #action>
          <Button type="primary" @click="fetchData(true)">搜索</Button>
        </template>
      </VanSearch>
    </Sticky>

    <List v-model:loading="loading" :finished="finished" loading-text="努力搜尋中" @load="fetchData">
      <Cell
        v-for="item in list"
        :key="item.id"
        :title="item.title"
        size="large"
        is-link
        center
        @click="downloadDanmaku(item)"
      >
        <template #label>
          <div class="my-1">彈幕量: {{ item.count }}</div>
          <div class="text-xs text-gray-500">來源: {{ item.source }}</div>
        </template>
      </Cell>
    </List>
  </PullRefresh>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, Ref, onMounted, toRefs } from 'vue';

import { himawariSVC, baseURL } from '@/services';

import { Search, Button, Cell, PullRefresh, Skeleton, Image, List, Sticky } from 'vant';

export default defineComponent({
  components: {
    VanSearch: Search,
    Button,
    List,
    Cell,
    PullRefresh,
    Skeleton,
    Image,
    Sticky,
  },
  setup() {
    const state = reactive({
      keyword: '',
      list: [],
      refreshing: false,
      loading: false,
      finished: false,
      page: 1,
    });

    async function fetchData(init = false, refreshing = false) {
      if (init) {
        state.list = [];
        state.page = 1;
        state.finished = false;
      }
      if (refreshing) {
        state.refreshing = true;
      }

      state.loading = true;
      const ret = await himawariSVC.getList(state.keyword, state.page, state.keyword ? 'comment_cnt' : 'group_id');
      state.loading = false;
      state.refreshing = false;

      if (!ret.success) {
        state.finished = true;
        return;
      }

      state.list = state.list.concat(ret.items.filter((item) => item.group_id));
      state.page += 1;
      if (state.page >= ret.page.pageAmount) {
        state.finished = true;
      }
    }

    function downloadDanmaku({ group_id }) {
      window.open(`${baseURL}/himawari/${group_id}/danmaku?mode=download&group=1`);
    }

    return {
      ...toRefs(state),

      fetchData,
      downloadDanmaku,
    };
  },
});
</script>

<style lang="scss" scoped>
</style>
