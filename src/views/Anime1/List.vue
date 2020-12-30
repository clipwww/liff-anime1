<template>
  <PullRefresh v-model="refreshing" @refresh="fetchData">
    <Sticky>
      <VanSearch v-model="keyword" placeholder="請輸入關鍵字"></VanSearch>
    </Sticky>

    <template v-if="loading">
      <Cell class="py-2" v-for="n in 10" :key="n">
        <Skeleton class="p-0" :row="2"></Skeleton>
      </Cell>
    </template>

    <Cell
      v-else
      v-for="item in filterList"
      :key="item.id"
      :title="item.name"
      :label="item.description"
      size="large"
      center
      is-link
      :to="{ name: 'Anime1Details', params: { id: item.id } }"
    />
  </PullRefresh>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, Ref, ref, inject, computed } from 'vue';
import { PullRefresh, Cell, Skeleton, Search, Button, Sticky } from 'vant';

import { ani1SVC } from '@/services';

export default defineComponent({
  name: 'Anime1List',
  components: {
    PullRefresh,
    Cell,
    Skeleton,
    VanSearch: Search,
    Button,
    Sticky,
  },
  setup() {
    const keyword = ref('');

    const state = reactive({
      list: [],
      filterList: computed(() =>
        state.list.filter((item) => (keyword.value ? item.name.includes(keyword.value) : true))
      ),
      refreshing: false,
      loading: true,
    });

    async function fetchData() {
      state.refreshing = false;
      state.loading = true;

      const ret = await ani1SVC.getList();

      state.loading = false;
      if (!ret.success) {
        return;
      }

      state.list = ret.items;
    }

    fetchData();

    return {
      ...toRefs(state),
      keyword,

      fetchData,
    };
  },
});
</script>

<style lang="scss" scoped>
</style>
