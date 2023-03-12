/* eslint-disable */
import api from '@/http'

const state = () => ({
  profile: null,
})

const getters = {}

const actions = {
  getProfile({ rootState, dispatch }) {
    return new Promise((resolve, reject) => {
      api
        .get('profile')
        .then((data) => {
          dispatch('updateProfile', data?.data || null)
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  updateProfile({ state, commit }, profile) {
    if (profile === null) {
      commit('setProfile', null)
    } else {
      commit('setProfile', profile)
    }
  },
}

const mutations = {
  setProfile(state, profile) {
    state.profile = profile
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
