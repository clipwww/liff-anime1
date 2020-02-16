import Vue from 'vue';
import VueAnalytics from 'vue-analytics';
import router from '@/router';

Vue.use(VueAnalytics, {
  id: 'UA-93335284-4',
  router,
  autoTracking: {
    exception: true,
    exceptionLogs: false
  }
});

export function logEvent(eventCategory: string, eventAction: string, eventLabel: string): void {
  //@ts-ignore
  Vue.$ga.event(eventCategory, eventAction, eventLabel);
}


Vue.mixin({
  methods: {
    $g_logEvent: logEvent,
  },
});
