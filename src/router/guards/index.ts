import router from '../index';

import store from '@/store'

router.beforeEach(async (to, from, next) => {

  store.dispatch('updateLoggedIn');

  if (store.state.isLoggedIn) {
    store.dispatch('updateProfile');
  }

  next();
});
