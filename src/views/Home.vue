<template>
  <div class="home__wrapper">
    <div class="home__search">
      <el-input
        v-model="keyword"
        suffix-icon="el-icon-search"
        placeholder="請輸入關鍵字搜尋"
        @blur="$g_logEvent('Blur', `搜尋 ${keyword}`, 'Search Input')"
        @keyup.native.enter="$g_logEvent('Keyup Enter', `搜尋 ${keyword}`, 'Search Input')"
      ></el-input>
      <div class="flex-between margin-t-10">
        <el-switch
          v-if="isLoggedIn"
          v-model="profile.onlyShowFavorite"
          active-color="#cc2f2d"
          active-text="只顯示老子愛的"
          @click="$g_logEvent('Click', '切換列表顯示', 'Switch')"
        ></el-switch>
        <div class="tip" v-else>登入就可以使用「我的最愛」囉</div>
      </div>
    </div>
    <div class="home__list" v-loading="isLoading" element-loading-background="rgba(0, 0, 0, 0.7)">
      <RecycleScroller
        class="scroller"
        :items="filterItems"
        key-field="id"
        v-slot="{ item, index, active }"
        :min-item-size="65"
      >
        <el-card shadow="none" :class="{ 'is-odd': index % 2 === 0, 'is-active': active }">
          <div class="home__card">
            <div
              class="flag"
              :class="{ 'is-favorite': isFavorite(item.id) }"
              @click="toggleFavorite(item)"
            >
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
              @click="$g_logEvent('Click', `前往 ${item.name}`, 'Bangumi More')"
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
import { mapActions, mapGetters } from 'vuex';
import { RecycleScroller } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import moment from 'moment';
import _isEqualWith from 'lodash/isEqualWith';
import _get from 'lodash/get';

import { liffAni1Ref } from '@/plugins/firebase';
import { ani1SVC } from '@/services';

export default {
  components: {
    RecycleScroller,
  },
  data() {
    return {
      keyword: '',
      items: [],
      isLoading: false,
    };
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'isLoggedIn',
      profile: 'profile',
    }),
    filterItems() {
      return this.items
        .filter(item => {
          if (!this.isLoggedIn) {
            return true;
          }
          return this.profile.onlyShowFavorite ? this.isFavorite(item.id) : true;
        })
        .filter(item => (this.keyword ? item.name.includes(this.keyword) : true));
    },
  },
  watch: {
    async 'profile.onlyShowFavorite'(bool) {
      await liffAni1Ref.child(`user-${this.profile.userId}`).set({
        ...this.profile,
        onlyShowFavorite: bool,
      });
    },
  },
  created() {
    this.getAni1List();
  },
  methods: {
    ...mapActions({
      updateProfile: 'updateProfile',
    }),
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
    isFavorite(id) {
      if (!this.isLoggedIn) {
        return false;
      }
      return _get(this.profile, 'favoriteList', []).some(item => item.id === id);
    },
    async toggleFavorite(item) {
      if (!this.isLoggedIn) {
        this.$emit('onLogin');
        this.$g_logEvent('Click', '需要登入', 'Favorite Button');
        return;
      }

      try {
        const isFavorite = this.isFavorite(item.id);

        let nowArr = _get(this.profile, 'favoriteList', []);
        nowArr = Array.isArray(nowArr) ? nowArr : [];

        this.isLoading = true;
        await liffAni1Ref.child(`user-${this.profile.userId}`).set({
          ...this.profile,
          favoriteList: this.isFavorite(item.id) ? nowArr.filter(f => f.id !== item.id) : nowArr.concat(item),
        });
        this.$g_logEvent('Click', (isFavorite ? '移除我的最愛: ' : '加到我的最愛: ') + item.name, 'Favorite Button');

        await this.updateProfile();
        // this.$notify({
        //   type: 'success',
        //   title: isFavorite ? '已從我的最愛中刪除' : '已加入我的最愛',
        //   message: '',
        // });
      } catch (err) {
        console.log(err);
        this.$g_logEvent('Error', err.message, '發生錯誤惹');
      } finally {
        this.isLoading = false;
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
    bottom: 0;
    left: 50%;
    max-width: 768px;
    width: 100%;
    transform: translate(-50%);
    z-index: 1;
    padding-bottom: 26px;
  }

  &__search {
    position: fixed;
    top: 0;
    left: 50%;
    max-width: 768px;
    width: 100%;
    height: 90px;
    transform: translate(-50%);
    padding: 10px;
    z-index: 2;
    background-color: #000;
    .tip {
      color: #fff;
      padding-left: 3px;
      font-size: 12px;
    }
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

      &.is-favorite {
        color: $re;
      }
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
    padding: 105px 15px 0;
  }
  .el-switch {
    &__label {
      color: fade-out(#fff, 0.5);
      &.is-active {
        color: #fff;
      }
    }
  }
}
</style>