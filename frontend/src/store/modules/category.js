/* eslint-disable */
import api from '@/http'

const state = () => ({})

const getters = {}

const actions = {
  getCategory(ctx, params) {
    return new Promise((resolve, reject) => {
      api
        .get('profile/category', { params: params })
        .then((data) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  addCategory({ dispatch }, params) {
    return new Promise((resolve, reject) => {
      api
        .post('profile/category', params)
        .then((data) => {
          dispatch('profile/getProfile', null, { root: true })
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  updateCategory({ dispatch }, params) {
    return new Promise((resolve, reject) => {
      api
        .put('profile/category', params)
        .then((data) => {
          dispatch('profile/getProfile', null, { root: true })
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  deleteCategory({ dispatch }, params) {
    return new Promise((resolve, reject) => {
      api
        .delete('profile/category', { data: params })
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
