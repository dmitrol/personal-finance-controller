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
  addBill(ctx, params) {
    return new Promise((resolve, reject) => {
      api
        .post('profile/bill', params)
        .then((data) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  updateBill(ctx, params) {
    return new Promise((resolve, reject) => {
      api
        .put('profile/bill', params)
        .then((data) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  deleteBill(ctx, params) {
    return new Promise((resolve, reject) => {
      api
        .delete('profile/bill', { data: params })
        .then((data) => {
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
