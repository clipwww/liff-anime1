<template>
  <div class="home__wrapper">
    <div class="home__search">
      <el-input
        id="js-step3"
        v-model="keyword"
        suffix-icon="el-icon-search"
        placeholder="請輸入關鍵字搜尋"
        :readonly="isIntroMode"
        @blur="$g_logEvent('Blur', `搜尋 ${keyword}`, 'Search Input')"
        @keyup.native.enter="$g_logEvent('Keyup Enter', `搜尋 ${keyword}`, 'Search Input')"
      ></el-input>
      <div id="js-step4" class="flex-between margin-t-10">
        <el-switch
          v-if="isLoggedIn || isIntroMode"
          v-model="onlyShowFavorite"
          active-color="#cc2f2d"
          active-text="只顯示老子愛的"
          @click="$g_logEvent('Click', '切換列表顯示', 'Switch')"
        ></el-switch>
        <div class="tip" v-else>登入就可以使用「我的最愛」囉</div>
      </div>
    </div>
    <div class="home__list" v-loading="isLoading" element-loading-background="rgba(0, 0, 0, 0.7)">
      <template v-if="isIntroMode">
        <el-card class="margin-b-10" shadow="none" v-for="n in 5" :key="n">
          <div class="home__card">
            <div id="js-step2" class="flag" :class="{ 'is-favorite': n <= 1 }">
              <i :class=" n <= 1 ? 'el-icon-star-on' : 'el-icon-star-off'"></i>
            </div>
            <div class="name">
              <div>少年動畫 第{{ n }}季</div>
              <span class="little-text">連載中 (第2324353253423948{{ n }}話)</span>
            </div>
            <span id="js-step1" class="more">
              <i class="el-icon-more"></i>
            </span>
          </div>
        </el-card>
      </template>
      <RecycleScroller
        v-else
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
              <i :class="isFavorite(item.id) ? 'el-icon-star-on' : 'el-icon-star-off'"></i>
            </div>
            <div class="name">
              <div>{{ item.name }}</div>
              <span class="little-text">{{ item.description }}</span>
            </div>
            <span class="more" @click="goBangumi(item)">
              <i class="el-icon-more"></i>
            </span>
          </div>
        </el-card>
      </RecycleScroller>
    </div>
    <div id="js-step5" class="home__intro" @click="isIntroMode = true">
      <i class="el-icon-question"></i>
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
import { createIntro } from '@/plugins/intro';
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
      isIntroMode: window.localStorage.getItem('liff-anime1:home-intro') !== '1',
      onlyShowFavorite: window.localStorage.getItem(`liff-anime1:onlyShowFavorite`) === 'true',
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
          return this.onlyShowFavorite ? this.isFavorite(item.id) : true;
        })
        .filter(item => (this.keyword ? item.name.includes(this.keyword) : true));
    },
  },
  watch: {
    isIntroMode(bool) {
      if (bool) {
        this.$g_logEvent('教學', `開啟教學`, `「${this.profile?.displayName ?? '--'}」開啟教學了`);
        this.initIntro();
      }
    },
    onlyShowFavorite(bool) {
      window.localStorage.setItem(`liff-anime1:onlyShowFavorite`, bool);
    },
  },
  created() {
    this.getAni1List();
    if (this.isIntroMode) {
      this.initIntro();
    }
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
      } catch (err) {
        console.log(err);
        this.$ga.exception(err.message);
      } finally {
        this.isLoading = false;
      }
    },
    goBangumi(item) {
      this.$router.push({ name: 'Bangumi', params: { id: item.id }, query: { name: item.name } });
      this.$g_logEvent('Click', `前往 ${item.name}`, 'Bangumi More');
    },
    initIntro() {
      const intro = createIntro();
      intro.setOptions({
        steps: [
          {
            element: '#js-step1',
            intro: `
              <div>點「<i class="el-icon-more"></i>」圖示可進入詳細頁面，下載動畫</div>
            `,
          },
          {
            element: '#js-step2',
            intro: `
              <div>點「<i class="el-icon-star-on"></i>」圖示可將動畫加入我的最愛</div>
              <span class="little-text">使用此功能必須要登入</span>
            `,
          },
          {
            element: '#js-step3',
            intro: `
              <div>輸入動畫名稱的關鍵字可快速搜尋</div>
            `,
          },
          {
            element: '#js-step4',
            intro: `
              <div>可切換是否只顯示已被加入「我的最愛」之動畫</div>
              <span class="little-text">使用此功能必須要登入</span>
            `,
            highlightClass: 'dark',
          },
          {
            element: '#js-step5',
            intro: `
              <div>想再看一次本說明可以點「<i class="el-icon-question"></i>」圖示</div>
            `,
          },
        ],
      });

      intro.oncomplete(() => {
        this.$g_logEvent('教學', `教學 Complete`, `「${this.profile?.displayName ?? '--'}」閱讀完教學了`);
      });

      intro.onexit(() => {
        this.isIntroMode = false;
        window.localStorage.setItem('liff-anime1:home-intro', '1');
      });

      this.$nextTick(() => {
        intro.start();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  &__wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
  }

  &__list {
    padding: 10px 10px 0;
    flex: 1;
    height: calc(100vh - 116px);
  }

  &__search {
    padding: 10px;
    background-color: #000;
    height: 90px;
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
        color: $warning;
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

  &__intro {
    position: fixed;
    bottom: 5px;
    left: 10px;
    z-index: 99;
    font-size: 2rem;
    border-radius: 50%;
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