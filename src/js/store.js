import Vue from 'vue'
import Vuex from 'vuex'
import Cart from './store/modules/cart/'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    Cart
  },
  state: {

  },
  mutations: {

  },
  actions: {

  }
})