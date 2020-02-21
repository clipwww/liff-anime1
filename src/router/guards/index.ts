import router from '../index';
import store from '@/store'

router.beforeEach(async (to, from, next) => {

  store.dispatch('updateLoggedIn');
  const isLoggedIn = store.state.isLoggedIn;
  if (isLoggedIn) {
    store.dispatch('updateProfile');
  }

  if (to.meta.auth) {
    const userId = store.state?.profile?.userId ?? '';

    if (!isLoggedIn || userId !== 'U383c9cfcab2d0d16ded2f96ec4337962') {
      return next({ name: 'Home' });
    }
  }

  next();
});
