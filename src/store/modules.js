/**
 * Created by lyx on 2022/3/23.
 */
const modules = {
  state: {
    locale: 'zh-hans',
    lg: '',
    xs: ''
  },
  mutations: {
    locale(state, data) {
      state.locale = data
    },
    setLg(state, data) {
      state.lg = data
    },
    setXs(state, data) {
      state.xs = data
    },
  },
  actions: {
    locale: ({commit}, data) => {
      commit('locale', data)
    },
  },
  getters: {
    locale(state) {
      return state.locale
    },
  }
}
export default modules
