<template>
  <div>
    <div class="relative w-full mb-5">
      <select
        v-model="activeWeek"
        class="block appearance-none w-full text-black bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
      >
        <option v-for="item in weekDays" :key="item.id" :value="item.value">{{ item.label }}</option>
      </select>
      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
      >
        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>

    <div v-show="isLoading">Loading...</div>
    <table v-show="!isLoading" class="table-fixed border-collapse border-1 border-gray-500 w-full">
      <tbody>
        <tr v-for="item in animeList" :key="item.id">
          <td class="border-b p-2">
            <div>
              <span v-if="item.isnew" class="text-red-600">*</span>
              {{ item.name }}
            </div>
            <div class="text-xs text-gray-500">{{ item.namefornew }}</div>
            <div
              class="text-xs text-gray-300 transform scale-75 origin-left"
            >最後更新日期: {{ item.mtime }}</div>
          </td>
          <td class="w-1/5 border-b text-center">
            <router-link
              tag="button"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xs"
              :to="{ name: 'AgefansDetails', params: { id: item.id } }"
            >詳細</router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { format, startOfWeek, addDays, isBefore } from 'date-fns';
import { zhTW } from 'date-fns/locale';

import store from '@/store';
import { agefansSVC } from '@/services';

export default {
  setup() {
    const mode = ref('list');
    const activeTab = 'bg-blue-800  border-blue-800 text-white';
    const inactiveTab = 'border-gray-200 text-blue-800 bg-gray-200';
    const animeList = ref([]);
    const weekDays = Array(7)
      .fill('')
      .map((s, i) => {
        const id = (i + 1) % 7;
        const date = addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i);
        return {
          id,
          value: id,
          date,
          label: format(date, 'E', {
            locale: zhTW,
          }),
        };
      });
    const activeWeek = ref(new Date().getDay());
    const filterAnimeList = computed(() =>
      animeList.value
        .filter(item => item.wd === activeWeek.value)
        .sort((a, b) => {
          return isBefore(new Date(a.mtime.replace(/-/g, '/')), new Date(b.mtime.replace(/-/g, '/'))) ? 1 : -1;
        })
    );
    const isLoading = computed(() => store.state.isLoading);

    async function getAnimeList() {
      const ret = await agefansSVC.getList();
      if (!ret.success) {
        return;
      }
      animeList.value = ret.items;
    }

    getAnimeList();
    return {
      mode,
      activeTab,
      inactiveTab,
      weekDays,
      activeWeek,
      animeList: filterAnimeList,
      isLoading,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>