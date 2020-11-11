<template>
  <div class="p-2 bg-white rounded">
    <ContributionGraph
      v-for="item in contributionByYear"
      :key="item.id"
      :id="`js-contribution-${item.id}`"
      :records="item.records"
    />
  </div>
</template>

<script>
import { defineComponent, computed, onMounted, reactive, toRefs } from 'vue';
import dayjs from 'dayjs';
import _union from 'lodash/union';

import { axiosInstace } from '@/services/base.svc';
import { MovieRecordVM } from '@/view-models/movie-record';

import ContributionGraph from '@/components/ContributionGraph.vue';

export default defineComponent({
  components: {
    ContributionGraph,
  },
  setup() {
    const state = reactive({
      records: [],
      contribution: computed(() => {
        const newObj = {};
        state.records.forEach((item) => {
          const dateKey = dayjs(item.date).startOf('day').toISOString();
          newObj[dateKey] = (newObj[dateKey] || 0) + 1;
        });

        return Object.keys(newObj).map((key) => {
          return {
            date: key,
            count: newObj[key],
            list: state.records.filter((item) => dayjs(item.date).isSame(key, 'day')),
          };
        });
      }),
      contributionByYear: computed(() => {
        const newObj = {};
        const years = _union(
          state.records.map((item) => {
            return dayjs(item.date).year();
          })
        );

        return years.map((year) => {
          return {
            id: year,
            records: state.contribution.filter((item) => dayjs(item.date).year() === year),
          };
        });
      }),
    });

    async function getMovieRecord() {
      const ret = await axiosInstace.get('https://mechakucha-api.herokuapp.com/my-movie-record');
      if (!ret.success) {
        return;
      }

      state.records = ret.items;
    }

    getMovieRecord();

    onMounted(() => {});

    return {
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
</style>