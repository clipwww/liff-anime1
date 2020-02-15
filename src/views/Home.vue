<template>
  <div class="home__list">
    <RecycleScroller :items="items" :min-item-size="55" key-field="id" v-slot="{ item, index }">
      <el-card shadow="none" :class="{ 'is-odd': index % 2 === 0 }">
        <div class="home__card">
          <span class="name">{{ item.name }}</span>
          <router-link
            class="more"
            tag="span"
            :to="{ name: 'Bangumi', params: { id: item.id }, query: { name: item.name } }"
          >
            <i class="el-icon-more"></i>
          </router-link>
        </div>
      </el-card>
    </RecycleScroller>
  </div>
</template>

<script>
import { ani1SVC } from '@/services';

import { RecycleScroller } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

export default {
  components: {
    RecycleScroller,
  },
  data() {
    return {
      items: [],
    };
  },
  computed: {},
  created() {
    this.getAni1List();
  },
  methods: {
    async getAni1List() {
      const ret = await ani1SVC.getList();
      if (!ret.success) {
        return;
      }

      this.items = ret.items;
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  &__card {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .name {
      font-size: 14px;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .more {
      font-size: 1.3rem;
      width: 23px;
      text-align: center;
      margin-left: 5px;
    }
  }
}

::v-deep {
  .el-card {
    &.is-odd {
      // background-color: #000;
      // color: #fff;
    }
    &__body {
      padding: 10px;
    }
  }
}
</style>