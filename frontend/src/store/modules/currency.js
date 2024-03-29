/* eslint-disable */
import api from '@/http'

const state = () => ({})

const getters = {}

const actions = {
  getCurrency(ctx, params) {
    return new Promise((resolve, reject) => {
      api
        .get('profile/currency', { params: params })
        .then((data) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  addCurrency({ dispatch }, params) {
    return new Promise((resolve, reject) => {
      api
        .post('profile/currency', params)
        .then((data) => {
          dispatch('profile/getProfile', null, { root: true })
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  updateCurrency({ dispatch }, params) {
    return new Promise((resolve, reject) => {
      api
        .put('profile/currency', params)
        .then((data) => {
          dispatch('profile/getProfile', null, { root: true })
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  deleteCurrency({ dispatch }, params) {
    return new Promise((resolve, reject) => {
      api
        .delete('profile/currency', { data: params })
        .then((data) => {
          dispatch('profile/getProfile', null, { root: true })
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
}

const mutations = {}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
