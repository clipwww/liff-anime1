<template>
  <div class="bangumi">
    <el-page-header @back="goBack">
      <div slot="content" @click="goAnime1">
        <el-link href="javascript:;" type="info">前往 Anime1 原頁面</el-link>
      </div>
    </el-page-header>
    <div class="bangumi__list">
      <el-timeline
        v-infinite-scroll="loadMore"
        :infinite-scroll-disabled="filterBangumiList.length >= bangumiList.length"
      >
        <el-timeline-item
          v-for="item in filterBangumiList"
          :key="item.id"
          :timestamp="item.datePublished | formatDate"
          placement="top"
          size="large"
          color="#67C23A"
        >
          <el-card>
            <div slot="header">
              <el-tag class="margin-r-10" type="info" size="mini" hit>{{ item.type }}</el-tag>
              <span>{{ item.name }}</span>
            </div>
            <el-button
              class="is-block margin-b-10"
              type="primary"
              size="mini"
              @click="downloadMp4(item)"
            >下載</el-button>
            <el-collapse>
              <el-collapse-item
                title="線上看"
                name="1"
                @click="$g_logEvent('Click', `查閱線上看 ${item.name}`, 'Collapse')"
              >
                <div>
                  <div v-if="item.type === 'mp4'" class="video-wrapper">
                    <iframe :src="item.iframeSrc"></iframe>
                  </div>
                  <div v-else>
                    <div>m3u8無法😭</div>
                    <div @click="goM3u8OriginPage(item)">
                      <el-link href="javascript:;" type="info">直接去原頁面看吧</el-link>
                    </div>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-card>
        </el-timeline-item>
        <div v-if="isLoading" class="text-center fs-30">
          <i class="el-icon-loading"></i>
        </div>
      </el-timeline>
    </div>
    <!-- <el-table v-bind="TABLE_DEFAULT_PROPS" :data="bangumiList">
      <el-table-column type="expand" width="30">
        <template slot-scope="{ row }">
          
        </template>
      </el-table-column>
      <el-table-column label="種類" align="center" width="65">
        <template slot-scope="{ row }">
          <el-tag type="info" size="mini" hit>{{ row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="標題" prop="name"></el-table-column>
    </el-table>-->
  </div>
</template>

<script>
import moment from 'moment';
import _isEqualWith from 'lodash/isEqualWith';

import { TABLE_DEFAULT_PROPS } from '@/plugins/element-ui';
import { firebaseInstance } from '@/plugins/firebase';
import { ani1SVC } from '@/services';

const liffAni1Ref = firebaseInstance.database().ref('/liff-anime1/');

export default {
  metaInfo() {
    return {
      title: this.title || '番組',
    };
  },
  data() {
    return {
      TABLE_DEFAULT_PROPS,

      bangumiList: [],
      currentCount: 1,
      isLoading: false,
    };
  },
  computed: {
    title() {
      return this.$route.query.name;
    },
    bangumiId() {
      return this.$route.params.id;
    },
    filterBangumiList() {
      return this.bangumiList.filter((item, i) => i < this.currentCount);
    },
  },
  created() {
    this.getBangumiList();
  },
  methods: {
    goBack() {
      this.$g_logEvent('Click', '返回', 'Back Button');
      this.$router.replace({ name: 'Home' });
    },
    async getBangumiList() {
      let firebaseItems = [];
      await liffAni1Ref.child(`bangumi-${this.bangumiId}`).once('value', snapshot => {
        const data = snapshot.val();
        if (data) {
          this.bangumiList = data.items;
          firebaseItems = this.bangumiList;
        }
      });

      const ret = await ani1SVC.getBangumi(this.bangumiId);
      if (!ret.success) {
        return;
      }

      this.bangumiList = ret.items;

      const isEqual = _isEqualWith(this.bangumiList, firebaseItems, (a, b) => {
        if (a.length !== b.length) {
          return false;
        }

        return a.every((x, i) => x.id === b[i].id);
      });

      if (!isEqual) {
        liffAni1Ref.child(`bangumi-${this.bangumiId}`).set({
          id: this.bangumiId,
          title: this.title,
          items: this.bangumiList,
          dateCreated: +moment(),
        });
      }
    },
    loadMore() {
      this.isLoading = true;
      setTimeout(() => {
        this.currentCount += 2;
        this.isLoading = false;
      }, 200);
    },
    downloadMp4(item) {
      const url = !!item.m3u8Url
        ? `https://clipwww-nuxt-express-project.herokuapp.com/api/anime1/download/${item.type}?url=${
            item.m3u8Url
          }&name=${decodeURIComponent(`${item.id}-${+new Date()}`)}`
        : item.mp4Url;
      this.$g_logEvent('Click', `下載 ${item.name}`, 'Download Button');
      if (window.liff.isInClient()) {
        window.liff.openWindow({
          url,
          external: false,
        });
      } else {
        window.open(url);
      }
    },
    goAnime1() {
      const url = `https://anime1.me/?cat=${this.bangumiId}`;
      this.$g_logEvent('Click', `前往 ${this.title} Anime1頁面`, 'Link Button');
      if (window.liff.isInClient()) {
        window.liff.openWindow({
          url,
          external: false,
        });
      } else {
        window.location.href = url;
      }
    },
    goM3u8OriginPage(item) {
      const url = item.iframeSrc;
      this.$g_logEvent('Click', `前往 ${item.name} Anime1 播放器頁面`, 'Link Button');
      if (window.liff.isInClient()) {
        window.liff.openWindow({
          url,
          external: false,
        });
      } else {
        window.location.href = url;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.bangumi {
  padding: 10px 10px 0;

  &__list {
    height: calc(100vh - 62px);
    padding: 30px 5px 0;
  }
}
::v-deep {
  .el-timeline {
    height: 100%;
    overflow: auto;
    padding-left: 5px;
  }
  .el-timeline-item__tail {
    border-color: #67c23a;
  }
  .el-timeline-item__wrapper {
    padding-left: 22px;
  }
  .el-timeline-item__timestamp {
    color: #666;
  }
}
</style>
