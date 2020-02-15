import Vue from 'vue'
import Vuex from 'vuex'

import { liffAni1Ref } from '@/plugins/firebase';
import { LineProfile } from '@/view-models/liff.vm';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoading: false,
    isLoggedIn: false,
    profile: null,
  },
  mutations: {
    UPDATE_LOADING(state, bool) {
      state.isLoading = bool;
    },
    UPDATE_LOGGED_IN(state, bool) {
      state.isLoggedIn = bool;
    },
    UPDATE_PROFILE(state, profile) {
      state.profile = profile;
    }
  },
  actions: {
    updateLoading({ commit }, bool) {
      commit('UPDATE_LOADING', bool);
    },
    updateLoggedIn({ commit }) {
      commit('UPDATE_LOGGED_IN', window.liff.isLoggedIn());
    },
    async updateProfile({ commit, state }) {
      if (!state.isLoggedIn) {
        return;
      }
      const ret = await window.liff.getProfile();

      const snapshot = await liffAni1Ref.child(`user-${ret.userId}`).once('value')
      const profile = snapshot.val();
      const newProfile = {
        ...ret,
        ...profile,
      };

      liffAni1Ref.child(`user-${ret.userId}`).set(newProfile);
      commit('UPDATE_PROFILE', newProfile);
    }
  },
  getters: {
    isLoading: state => state.isLoading,
    isLoggedIn: state => state.isLoggedIn && window.liff.isLoggedIn(),
    profile: state => state.profile || {
      pictureUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
    },
  },
  modules: {
  }
})
