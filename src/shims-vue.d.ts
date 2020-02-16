import Vue from 'vue';
import { MetaInfo } from 'vue-meta';
import VueAnalytics from 'vue-analytics';


declare module '*.vue' {
  export default Vue;
}
declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    metaInfo?: MetaInfo | (() => MetaInfo) | undefined;
  }
}
declare module "vue/types/vue" {
  interface Vue {
    $ga: VueAnalytics;
  }
}