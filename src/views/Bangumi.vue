<template>
  <div>
    <el-page-header @back="goBack"></el-page-header>
    <el-table class="margin-bt-30" v-bind="TABLE_DEFAULT_PROPS" :data="bangumiList">
      <el-table-column type="expand" width="30">
        <template slot-scope="{ row }">
          <div v-if="row.type === 'mp4'" class="video-wrapper">
            <video controls>
              <source
                :src="`https://clipwww-nuxt-express-project.herokuapp.com/api/anime1/download/mp4?url=${row.mp4Url}`"
                type="video/mp4"
              />
            </video>
            <iframe :src="row.mp4Url"></iframe>
            <el-button
              type="success"
              size="mini"
              @click="downloadMp4(`https://clipwww-nuxt-express-project.herokuapp.com/api/anime1/download/${row.type}?url=${row.m3u8Url || row.mp4Url}`)"
            >下載</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="種類" align="center" width="70">
        <template slot-scope="{ row }">
          <el-tag type="info" size="mini" hit>{{ row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="標題" prop="name"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { ani1SVC } from '@/services';
import { TABLE_DEFAULT_PROPS } from '@/plugins/element-ui';

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
      const ret = await ani1SVC.getBangumi(this.bangumiId);
      if (!ret.success) {
        return;
      }

      this.bangumiList = ret.items;
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
