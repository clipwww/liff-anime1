<template>
  <div>
    <el-table v-bind="TABLE_DEFAULT_PROPS" :data="bangumiList" row-key="id" empty-text="No data">
      <el-table-column type="expand" width="30">
        <template slot-scope="{ row }">
          <ul>
            <li class="margin-bt-5" v-for="item in row.items" :key="item.id">
              <div>{{ item.name }}</div>
              <span class="little-text">{{ item.datePublished | formatDate }}</span>
            </li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="40" align="center"></el-table-column>
      <el-table-column label="標題" prop="title"></el-table-column>
      <el-table-column label="更新時間">
        <template slot-scope="{ row }">{{ row.dateCreated | formatDate }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { liffAni1Ref } from '@/plugins/firebase';
import { TABLE_DEFAULT_PROPS } from '@/plugins/element-ui';

export default {
  data() {
    return {
      TABLE_DEFAULT_PROPS,
      bangumiList: [],
    };
  },
  created() {
    this.getBangumiList();
  },
  methods: {
    getBangumiList() {
      liffAni1Ref.once('value', snapshot => {
        let bangumiList = [];
        snapshot.forEach(item => {
          if (item.key.includes('bangumi-')) {
            const val = item.val();
            const id = val.id || item.key.replace('bangumi-', '');
            bangumiList.push({
              ...val,
              id,
              title: val.title || id,
            });
          }
        });
        this.bangumiList = bangumiList;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>