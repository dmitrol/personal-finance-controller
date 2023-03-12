/* eslint-disable */
import api from '@/http'

const state = () => ({
  accessToken: localStorage.getItem('token') || null,
})

const getters = {}

const actions = {
  registration(ctx, payload) {
    return new Promise((resolve, reject) => {
      api
        .post('registration', payload)
        .then((data) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  login({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      api
        .post('login', payload)
        .then((data) => {
          commit('setAccessToken', data.data.accessToken)
          dispatch('profile/getProfile', null, { root: true })
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  logout({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      api
        .post('logout')
        .then((data) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
        .finally(() => {
          commit('setAccessToken', null)
          dispatch('profile/updateProfile', null, { root: true })
        })
    })
  },
  refreshToken({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      api
        .get('refresh')
        .then((data) => {
          commit('setAccessToken', data?.data?.accessToken || null)
          dispatch('profile/updateProfile', data?.data?.profile || null, {
            root: true,
          })
          resolve(data)
        })
        .catch((error) => {
          commit('setAccessToken', null)
          dispatch('profile/updateProfile', null, {
            root: true,
          })
          reject(error)
        })
    })
  },
}

const mutations = {
  setAccessToken(state, token) {
    state.accessToken = token
    if (!token) {
      localStorage.removeItem('token')
    } else {
      localStorage.setItem('token', token)
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
