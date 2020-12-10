<template>
  <PullRefresh class="mt-2 pb-12" v-model="refreshing" @refresh="fetchData">
    <template v-if="loading">
      <Cell class="py-2" v-for="n in 10" :key="n">
        <Skeleton class="p-0" :row="2"></Skeleton>
      </Cell>
    </template>
    <Cell v-else v-for="item in filterList"
      :key="item.id"
      :title="item.name"
      size="large"
      is-link
      center
      :to="{ name: 'AgefansDetails', params: { id: item.id } }">
      <template #label>
        <div>{{ item.namefornew }}</div>
        <div class="text-xs text-gray-500 transform scale-75 origin-left">最後更新日期: {{ item.mtime }}</div>
      </template>

    </Cell>

    <Tabbar v-model="activeWeek" fixed border safe-area-inset-bottom	>
      <TabbarItem v-for="item in weekdays" :key="item.value" :name="item.value">{{ item.label }}</TabbarItem>
    </Tabbar>
  </PullRefresh>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from 'vue';
import { PullRefresh, Cell, Skeleton, Tabbar, TabbarItem } from 'vant';
import dayjs from 'dayjs';

import { agefansSVC } from '@/services'

export default defineComponent({
  components: {
    PullRefresh,
    Cell,
    Skeleton,
    Tabbar,
    TabbarItem
  },
  setup() {
    const weekdays = Array(7)
      .fill('')
      .map((_, i) => {
       return {
          value:  (i + 1) % 7,
          label: dayjs().weekday(i).format('ddd')
        }
      })


    const state = reactive({
      list: [],
      activeWeek: new Date().getDay(),
      filterList: computed(() => state.list.filter((item) => item.wd === state.activeWeek)
        .sort((a, b) => {
          return dayjs(new Date(a.mtime.replace(/-/g, '/'))).isBefore(new Date(b.mtime.replace(/-/g, '/'))) ? 1 : -1;
        })),
      refreshing: false,
      loading: true,
    })

    async function fetchData() {
      state.refreshing = false;
      state.loading = true;

      const ret = await agefansSVC.getList();

       state.loading = false;
      if (!ret.success) {
        return;
      }

      state.list = ret.items;

    }

    fetchData();

    return {
      ...toRefs(state),
      weekdays,

      fetchData,
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
