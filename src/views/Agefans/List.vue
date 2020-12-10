<template>
  <Tabs class="mt-2" type="card" v-model:active="mode" offset-top="8px" sticky ellipsis>
    <Tab title="列表" name="list">
      <DeafultList  />
    </Tab>
    <Tab title="搜尋" name="search">
      <Search  />
    </Tab>
  </Tabs>
</template>

<script>
import { ref } from 'vue';
import { Tabs, Tab } from 'vant';

import DeafultList from './components/DeafultList.vue';
import Search from './components/Search.vue';

export default {
  name: 'AgefansList',
  components: {
    DeafultList,
    Search,
    Tabs,
    Tab
  },
  setup() {
    const mode = ref('list');

    return {
      mode,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
