<template>
  <PullRefresh v-model="refreshing" @refresh="fetchData">
    <template v-if="loading">
      <Cell class="py-2" v-for="n in 10" :key="n">
        <Skeleton class="p-0" :row="2"></Skeleton>
      </Cell>
    </template>


    <Cell v-else v-for="item in filterList"
      :key="item.id"
      :title="item.name"
      :label="item.description"
      size="large"
      center
      is-link
      :to="{ name: 'Anime1Details', params: { id: item.id } }" />

  </PullRefresh>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, Ref, inject, computed } from 'vue';
import { PullRefresh, Cell, Skeleton } from 'vant';

import { ani1SVC } from '@/services'
import { keywordSymbol } from '@/provide';

export default defineComponent({
  components: {
    PullRefresh,
    Cell,
    Skeleton,
  },
  setup() {
    const keyword: Ref<string> = inject(keywordSymbol);

    const state = reactive({
      list: [],
      filterList: computed(() => state.list.filter(item => keyword.value ? item.name.includes(keyword.value) : true)),
      refreshing: false,
      loading: true,
    })


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
    }
  }
})
</script>

<style lang="scss" scoped>

</style>

v
