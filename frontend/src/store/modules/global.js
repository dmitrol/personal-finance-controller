const state = () => ({
  loader: false,
})

const getters = {}

const actions = {}

const mutations = {
  setLoader(state, loader) {
    state.loader = loader
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
