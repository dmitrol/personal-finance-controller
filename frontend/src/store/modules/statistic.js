/* eslint-disable */
import api from '@/http'

const state = () => ({})

const getters = {}

const actions = {
  getStatisticByBills(ctx, params) {
    return new Promise((resolve, reject) => {
      api
        .get('statistic', { params: params })
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
