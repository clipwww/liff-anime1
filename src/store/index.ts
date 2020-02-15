import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoading: false,
  },
  mutations: {
    UPDATE_LOADING(state, bool) {
      state.isLoading = bool;
    }
  },
  actions: {
    updateLoading({ commit }, bool) {
      commit('UPDATE_LOADING', bool);
    }
  },
  getters: {
    isLoading: state => state.isLoading
  },
  modules: {
  }
})
