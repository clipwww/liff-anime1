import router from '../index';
import store from '@/store'

router.beforeEach(async (to, from, next) => {

  store.dispatch('updateLoggedIn');
  const isLoggedIn = store.state.isLoggedIn;
  if (isLoggedIn) {
    store.dispatch('updateProfile');
  }

  console.log(to.meta.auth)
  if (to.meta.auth) {
    const profile = store.state.profile;
    const userId = profile ? profile.userId : '';

    if (!isLoggedIn || !profile || userId !== 'U383c9cfcab2d0d16ded2f96ec4337962') {
      return next({ name: 'Home' });
    }
  }

  next();
});
