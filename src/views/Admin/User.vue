<template>
  <div>
    <el-table v-bind="TABLE_DEFAULT_PROPS" :data="users" row-key="userId" empty-text="No data">
      <el-table-column type="expand" width="30">
        <template slot-scope="{ row }">
          <ul>
            <li
              class="margin-bt-5"
              v-for="(item, index) in row.favoriteList"
              :key="item.id"
            >{{ index + 1 }}. {{ item.name }}</li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="40" align="center"></el-table-column>
      <el-table-column label="暱稱" prop="displayName"></el-table-column>
      <el-table-column label="大頭貼">
        <template slot-scope="{ row }">
          <el-avatar shape="square" :src="row.pictureUrl"></el-avatar>
        </template>
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
      users: [],
    };
  },
  created() {
    this.getUsers();
  },
  methods: {
    getUsers() {
      liffAni1Ref.once('value', snapshot => {
        let users = [];
        snapshot.forEach(item => {
          if (item.key.includes('user-')) {
            users.push(item.val());
          }
        });
        this.users = users;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>