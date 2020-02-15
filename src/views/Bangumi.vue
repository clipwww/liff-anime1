<template>
  <div>
    <el-page-header @back="goBack"></el-page-header>
    <el-timeline class="margin-bt-30">
      <el-timeline-item
        v-for="item in bangumiList"
        :key="item.id"
        :timestamp="item.datePublished | formatDate"
        placement="top"
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
            @click="downloadMp4(item.type === 'm3u8' ? `https://clipwww-nuxt-express-project.herokuapp.com/api/anime1/download/${item.type}?url=${item.m3u8Url}` :  item.mp4Url)"
          >下載</el-button>
          <el-collapse>
            <el-collapse-item title="線上看" name="1">
              <div>
                <div v-if="item.type === 'mp4'" class="video-wrapper">
                  <iframe :src="item.iframeSrc"></iframe>
                </div>
                <div v-else>m3u8無法😭</div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-timeline-item>
    </el-timeline>
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

const liffAni1Ref = firebaseInstance.database().ref('/liff-animate1/');

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
    };
  },
  computed: {
    title() {
      return this.$route.query.name;
    },
    bangumiId() {
      return this.$route.params.id;
    },
  },
  created() {
    this.getBangumiList();
  },
  methods: {
    goBack() {
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
          items: this.bangumiList,
          dateCreated: +moment(),
        });
      }
    },
    downloadMp4(url) {
      if (window.liff.isInClient()) {
        window.liff.openWindow({
          url,
          external: true,
        });
      } else {
        window.open(url);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
