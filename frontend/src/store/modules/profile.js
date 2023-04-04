/* eslint-disable */
import api from '@/http'

const state = () => ({
  profile: null,
  bills: [],
  categories: [],
  currencies: [],
  mainCurrency: null,
  perPage: 10,
})

const getters = {}

const actions = {
  getProfile({ dispatch }) {
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
      commit('setPerPage', profile?.per_page || 10)
      if (profile.currencies.length > 0) {
        const mainCurrency = profile.currencies.find(
          (currency) => currency.main === true
        )
        commit('setMainCurrency', mainCurrency)
      }
    }
  },

  updatePerPage({ dispatch }, perPage) {
    return new Promise((resolve, reject) => {
      api
        .post('profile/update-per-page', { per_page: perPage })
        .then((data) => {
          dispatch('updateProfile', data?.data || null)
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
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
  setPerPage(state, perPage) {
    state.perPage = perPage
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
