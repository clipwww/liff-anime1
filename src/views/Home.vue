<template>
  <div class="home__wrapper">
    <div class="home__search">
      <el-input v-model="keyword" suffix-icon="el-icon-search" placeholder="請輸入關鍵字搜尋"></el-input>
    </div>
    <div class="home__list">
      <RecycleScroller
        class="scroller"
        :items="filterItems"
        key-field="id"
        v-slot="{ item, index, active }"
        :min-item-size="65"
      >
        <el-card shadow="none" :class="{ 'is-odd': index % 2 === 0, 'is-active': active }">
          <div class="home__card">
            <div class="flag">
              <i class="el-icon-s-flag"></i>
            </div>
            <div class="name">
              <div>{{ item.name }}</div>
              <span class="little-text">{{ item.description }}</span>
            </div>
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
  </div>
</template>

<script>
import { RecycleScroller } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import moment from 'moment';
import _isEqualWith from 'lodash/isEqualWith';

import { firebaseInstance } from '@/plugins/firebase';
import { ani1SVC } from '@/services';

const liffAni1Ref = firebaseInstance.database().ref('/liff-animate1/');

export default {
  components: {
    RecycleScroller,
  },
  data() {
    return {
      keyword: '',
      items: [],
    };
  },
  computed: {
    filterItems() {
      return this.items.filter(item => (this.keyword ? item.name.includes(this.keyword) : true));
    },
  },
  created() {
    this.getAni1List();
  },
  methods: {
    async getAni1List() {
      let firebaseItems = [];
      await liffAni1Ref.child('list').once('value', snapshot => {
        const data = snapshot.val();
        if (data) {
          this.items = data.items;
          firebaseItems = this.items;
        }
      });

      const ret = await ani1SVC.getList();
      if (!ret.success) {
        return;
      }

      this.items = ret.items;

      const isEqual = _isEqualWith(this.items, firebaseItems, (a, b) => {
        if (a.length !== b.length) {
          return false;
        }

        return a.every((x, i) => x.id === b[i].id);
      });

      if (!isEqual) {
        liffAni1Ref.child('list').set({
          items: this.items,
          dateCreated: +moment(),
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  &__wrapper {
    position: relative;
  }

  &__list {
    position: fixed;
    top: 0px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    padding-bottom: 26px;
  }

  &__search {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 10px;
    z-index: 2;
    background-color: #000;
  }

  &__card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .flag {
      font-size: 1.1rem;
      width: 20px;
      margin-right: 10px;
      color: #ddd;
    }
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
  .scroller {
    height: 100%;
    padding: 71px 15px 0;
  }
}
</style>