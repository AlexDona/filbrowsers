import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
});
const store = new Vuex.Store({
  modules: {
    modules,
  },
  plugins: [vuexLocal.plugin]
})
export default store
