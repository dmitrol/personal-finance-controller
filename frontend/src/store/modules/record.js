/* eslint-disable */
import api from '@/http'

const state = () => ({})

const getters = {}

const actions = {
  getRecords(ctx, params) {
    return new Promise((resolve, reject) => {
      api
        .get('record', { params: params })
        .then((data) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  addRecord(ctx, params) {
    return new Promise((resolve, reject) => {
      api
        .post('record', params)
        .then((data) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  updateRecord(ctx, params) {
    return new Promise((resolve, reject) => {
      api
        .put('record', params)
        .then((data) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  deleteRecord(ctx, params) {
    return new Promise((resolve, reject) => {
      api
        .delete('record', { data: params })
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
