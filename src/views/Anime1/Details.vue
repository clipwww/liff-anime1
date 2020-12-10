<template>
  <PullRefresh v-model="refreshing" @refresh="fetchData">
    <template v-if="loading">
      <Cell class="py-2" v-for="n in 10" :key="n">
        <Skeleton class="p-0" :row="2"></Skeleton>
      </Cell>
    </template>
    <Cell v-else v-for="item in list"
      :key="item.id"
      :title="item.name"
      center
      is-link
      @click="openPlayer(item)"
    >
      <template #icon>
        <Tag class="mr-2" type="primary" plain >{{ item.type }}</Tag>
      </template>
      <template #right-icon>
        <Icon name="play" size="20" />
      </template>
    </Cell>
  </PullRefresh>
   <!-- <iframe :src="`https://anime1.me/?cat=${id}`" class="hidden"></iframe> -->
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs, inject, Ref } from 'vue';
import { PullRefresh, Cell, Skeleton, Icon, Tag } from 'vant';

import router from '@/router';
import { ani1SVC } from '@/services'
import { titleSymbol } from '@/provide';

export default defineComponent({
  components: {
    PullRefresh,
    Cell,
    Skeleton,
    Icon,
    Tag
  },
  setup(prop) {
    const state = reactive({
      id: computed(() => router.currentRoute.value.params.id as string),
      list: [],
      refreshing: false,
      loading: true,
    })
    const title: Ref<String> = inject(titleSymbol)

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

    function openPlayer({ id, iframeSrc }) {
      // window.open(iframeSrc);
      window.open(`https://anime1.me/${id}`);
    }

    fetchData();

    return {
      ...toRefs(state),

      fetchData,
      openPlayer
    }
  }
})
</script>

<style lang="scss" scoped>

</style>

v
