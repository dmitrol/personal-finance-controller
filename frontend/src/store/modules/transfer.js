/* eslint-disable */
import api from '@/http'

const state = () => ({})

const getters = {}

const actions = {
  getTransfer(ctx, transfer_id) {
    return new Promise((resolve, reject) => {
      api
        .get(`transfer/${transfer_id}`)
        .then((data) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  addTransfer(ctx, params) {
    return new Promise((resolve, reject) => {
      api
        .post('transfer', params)
        .then((data) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  updateTransfer(ctx, params) {
    return new Promise((resolve, reject) => {
      api
        .put('transfer', params)
        .then((data) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  deleteTransfer(ctx, params) {
    return new Promise((resolve, reject) => {
      api
        .delete('transfer', { data: params })
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
