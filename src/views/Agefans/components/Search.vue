<template>

  <PullRefresh class="mt-2" v-model="refreshing" @refresh="fetchData">
    <VanSearch
      v-model="keyword"
      show-action
      placeholder="請輸入關鍵字"
      @search="fetchData"
    >
      <template #action>
        <Button type="primary" @click="fetchData">搜索</Button>
      </template>
    </VanSearch>
    <template v-if="loading">
      <Cell class="py-2" v-for="n in 10" :key="n">
        <Skeleton class="p-0" :row="2"></Skeleton>
      </Cell>
    </template>
    <Cell v-else v-for="item in list"
      :key="item.id"
      :title="item.title"
      size="large"
      is-link
      center
      :to="{ name: 'AgefansDetails', params: { id: item.id } }">
      <template #icon>
        <Image :src="item.imgUrl" class="w-16 mr-2" />
      </template>
      <template #label>
        <div>{{ item.originName }}</div>
        <div class="text-xs text-gray-500 my-1">類型: {{ item.type }}</div>
        <div class="text-xs text-gray-500">放送日: {{ item.dateAired }}</div>
      </template>

    </Cell>

  </PullRefresh>
</template>

<script>
import { ref, computed, toRefs, reactive } from 'vue';
import { Search, Button, Cell, PullRefresh, Skeleton, Image } from 'vant';

import store from '@/store';
import { agefansSVC } from '@/services';

export default {
  components: {
    VanSearch: Search,
    Button,
    Cell,
    PullRefresh,
    Skeleton,
    Image
  },
  setup() {
    const state = reactive({
      keyword: '',
      list: [],
      refreshing: false,
      loading: false,
    })

    async function fetchData() {
      if (!state.keyword) return;

      state.refreshing = false;
      state.loading = true;

      const ret = await agefansSVC.getList(state.keyword);

      state.loading = false;
      if (!ret.success) {
        return;
      }

      state.list = ret.items;
    }


    return {
      ...toRefs(state),

      fetchData,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
