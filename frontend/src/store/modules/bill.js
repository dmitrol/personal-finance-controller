/* eslint-disable */
import api from '@/http'

const state = () => ({})

const getters = {}

const actions = {
  getBill(ctx, params) {
    return new Promise((resolve, reject) => {
      api
        .get('profile/bill', { params: params })
        .then((data) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  addBill({ dispatch }, params) {
    return new Promise((resolve, reject) => {
      api
        .post('profile/bill', params)
        .then((data) => {
          dispatch('profile/getProfile', null, { root: true })
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  updateBill({ dispatch }, params) {
    return new Promise((resolve, reject) => {
      api
        .put('profile/bill', params)
        .then((data) => {
          dispatch('profile/getProfile', null, { root: true })
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  deleteBill({ dispatch }, params) {
    return new Promise((resolve, reject) => {
      api
        .delete('profile/bill', { data: params })
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
