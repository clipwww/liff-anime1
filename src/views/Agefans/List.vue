<template>
  <div>
    <ul class="flex mb-5">
      <li class="flex-1">
        <a
          class="text-center block border rounded-l-full py-1 px-4"
          :class="mode === 'list' ? activeTab : inactiveTab"
          href="javascript:;"
          @click="mode = 'list'"
        >列表</a>
      </li>
      <li class="flex-1">
        <a
          class="text-center block border border-white rounded-r-full py-1 px-4"
          :class="mode === 'search' ? activeTab : inactiveTab"
          href="javascript:;"
          @click="mode = 'search'"
        >搜尋</a>
      </li>
    </ul>

    <DeafultList v-if="mode === 'list'" />
    <Search v-if="mode === 'search'" />
  </div>
</template>

<script>
import { ref } from 'vue';

import DeafultList from './components/DeafultList.vue';
import Search from './components/Search.vue';

export default {
  name: 'AgefansList',
  components: {
    DeafultList,
    Search,
  },
  setup() {
    const mode = ref('list');
    const activeTab = 'bg-blue-800  border-blue-800 text-white';
    const inactiveTab = 'border-gray-200 text-blue-800 bg-gray-200';

    return {
      mode,
      activeTab,
      inactiveTab,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>