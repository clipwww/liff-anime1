<template>
  <div class="mb-4 text-black mx-auto relative" style="max-width: 670px">
    <div class="text-lg pl-4">{{ year }}</div>
    <div class="text-xs mb-2 pl-4">
      看了 {{ totalCount }} 場電影，一共 {{ totalTicks }} 張電影票，花了 {{ totalCost.toLocaleString() }} 新台幣
    </div>
    <div class="w-full overflow-x-auto">
      <svg :id="id" width="660" height="110"></svg>
    </div>
    <span
      :id="tooltip.id"
      v-show="tooltip.show"
      class="tooltiptext whitespace-no-wrap"
      v-html="tooltip.content"
      :style="{ top: `${tooltip.top}px`, left: `${tooltip.left}px` }"
    ></span>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  computed,
  PropType,
  watch,
  nextTick,
  toRefs,
  onMounted,
  CanvasHTMLAttributes,
} from 'vue';
import dayjs from 'dayjs';
import * as d3 from 'd3/index';
import '@/plugins/dayjs';

import { MovieRecordVM } from '@/view-models/movie-record';

export default defineComponent({
  props: {
    id: {
      type: String,
      default: 'js-contribution',
    },
    records: {
      type: Array as PropType<{ date: string; count: number; list: MovieRecordVM[] }[]>,
      required: true,
    },
  },
  setup(props) {
    const monthNames = Array(12)
      .fill('')
      .map((_, i) => dayjs().month(i).format('MMM'));
    const weekdayNames = Array(7)
      .fill('')
      .map((_, i) => dayjs().weekday(i).format('dd'))
      .filter((_, i) => i % 2 === 1);

    const state = reactive({
      year: computed(() => dayjs(props.records[0].date).year()),
      totalCount: computed(() => props.records.reduce((pre, item) => (pre += item.count), 0)),
      totalCost: computed(() =>
        props.records.reduce(
          (pre, item) => (pre += item.list.reduce((total, subItem) => (total += subItem.cost), 0)),
          0
        )
      ),
      totalTicks: computed(() =>
        props.records.reduce(
          (pre, item) => (pre += item.list.reduce((total, subItem) => (total += subItem.tickets), 0)),
          0
        )
      ),
      contributions: computed(() => {
        const dayObj = dayjs(props.records[0].date).startOf('year');
        const days = dayObj.isLeapYear() ? 366 : 365;
        const emptyBlocks = dayObj.isoWeekday() % 7;

        return Array(emptyBlocks)
          .fill('')
          .map(() => {
            return {
              date: '',
              value: -1,
            };
          })
          .concat(
            Array(days)
              .fill('')
              .map((v, i) => {
                const thisDay = dayObj.add(i, 'day');
                const count = props.records.find((record) => thisDay.isSame(record.date, 'day'))?.count ?? 0;

                return {
                  date: thisDay.toISOString(),
                  value: count,
                };
              })
          );
      }),
    });

    const tooltip = reactive({
      id: computed(() => `${props.id}-tooltip`),
      show: false,
      content: '',
      top: 0,
      left: 0,
    });

    watch(
      () => state.contributions,
      async () => {
        await nextTick();
        drawGraph();
      }
    );

    onMounted(() => {
      drawGraph();
    });

    function drawGraph() {
      const svg = d3.select(`#${props.id}`);

      const heatMap = svg.append('g').attr('class', 'mainChart').attr('transform', `translate(15, 15)`);

      const rect = heatMap.selectAll('rect').data(state.contributions);
      const color = d3
        .scaleQuantile()
        .domain([-1, 0, 1, 2, 3, 4, 5])
        // @ts-ignore
        .range(['#fff', '#eee', '#d6e685', '#8cc665', '#44a340', '#1e6823']);

      rect
        .enter()
        .append('rect')
        .attr('height', 10)
        .attr('width', 10)
        .attr('fill', (d) => {
          return color(d.value);
        })
        .attr('y', (_, i) => {
          return (i % 7) * 12;
        })
        .attr('x', (_, i) => {
          return ~~(i / 7) * 12;
        })
        .on('mouseover', async (e: MouseEvent, d) => {
          if (!d.value) {
            return;
          }

          tooltip.show = true;
          const list = props.records.find((record) => dayjs(d.date).isSame(record.date, 'day'))?.list ?? [];
          tooltip.content = `
            <div class="text-left">
              ${dayjs(d.date).format('YYYY/MM/DD (ddd)')}<br/>
              ${list
                .reverse()
                .map((item) => `${dayjs(item.date).format('HH:mm')} ${item.title}`)
                .join('<br/>')}
            </div>
          `;

          await nextTick();
          const $tooltip = document.getElementById(tooltip.id) as HTMLElement;
          tooltip.left = e.offsetX - $tooltip.clientWidth / 2;
          tooltip.top = e.offsetY + 35 - $tooltip.clientHeight;
        })
        .on('mouseleave', () => {
          tooltip.show = false;
        });

      svg
        .append('g')
        .attr('class', 'xAxis')
        .selectAll('text')
        .data(monthNames)
        .enter()
        .append('text')
        .text((d) => d)
        .attr('x', (d, i) => {
          return i * (13 * 4) + 25;
        })
        .attr('y', 10)
        .style('text-anchor', 'middle')
        .style('font-size', 10);

      svg
        .append('g')
        .attr('class', 'yAxis')
        .selectAll('text')
        .data(weekdayNames)
        .enter()
        .append('text')
        .text((d) => d)
        .attr('y', (d, i) => {
          return i * (12.5 * 2) + 35;
        })
        .attr('x', 5)
        .style('text-anchor', 'middle')
        .style('font-size', 10);
    }

    return {
      ...toRefs(state),
      tooltip,
    };
  },
});
</script>

<style lang="scss" scoped>
</style>
