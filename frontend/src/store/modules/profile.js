/* eslint-disable */
import api from '@/http'

const state = () => ({
  profile: null,
  bills: [],
  categories: [],
  currencies: [],
  mainCurrency: null,
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

  updateProfile({ commit }, profile) {
    if (profile === null) {
      commit('setProfile', null)
    } else {
      commit('setProfile', profile)
      commit('setBills', profile?.bills || [])
      commit('setCategory', profile?.categories || [])
      commit('setCurrencies', profile?.currencies || [])
      if (profile.currencies.length > 0) {
        const mainCurrency = profile.currencies.find(
          (currency) => currency.main === true
        )
        commit('setMainCurrency', mainCurrency)
      }
    }
  },
}

const mutations = {
  setProfile(state, profile) {
    state.profile = profile
  },
  setBills(state, bills) {
    state.bills = bills
  },
  setCategory(state, categories) {
    state.categories = categories
  },
  setCurrencies(state, currencies) {
    state.currencies = currencies
  },
  setMainCurrency(state, currency) {
    state.mainCurrency = currency
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
